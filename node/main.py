from collections import defaultdict

from flask import Flask, request, jsonify, render_template, send_file
from flask_cors import CORS
from flask_qrcode import QRcode
import requests
import copy
import json
import hashlib
import os

from config import SALT_QR, PADDING_CHAR
from cryptography import generate_secret_key_for_AES_cipher, encrypt_message, decrypt_message
from send_email import send_register_email, send_verification_email
from voting import validate_token, generate_token, broadcast_blocks, random_string
from model import Model

app = Flask(__name__)
CORS(app)
qrcode = QRcode(app)

app.server_id = int(os.environ.get('SERVER_ID', '1'))
app.secret_key = generate_secret_key_for_AES_cipher()
app.blocks = []
app.model = Model()
app.known_hosts = []


@app.route("/")
def hello():
    return "hello"


@app.route("/election", methods=['POST'])
def election():
    data = request.get_json()

    if data and 'users' in data and 'name' in data and 'description' in data and 'expiration' in data \
            and 'options' in data:
        if len(app.blocks) < 1:
            elec = data
            elec['id'] = random_string()
            elec['voted'] = []
            elec['options'] = [{'index': i, 'name': x} for i, x in enumerate(data.get('options'))]
            elec['pointer'] = 0
            elec['owner'] = app.server_id
            elec['results'] = encrypt_message('', app.secret_key, PADDING_CHAR).decode('utf-8')
            elec['hash'] = ''

            app.blocks.append(elec)
            app.model.save(app.blocks, app.secret_key)
            broadcast_blocks(app.blocks, app.known_hosts)
            send_register_email(elec, request.headers.get('host'))
            return jsonify(app.blocks)
        # elif app.blocks[-1].get('expire') < time.time():
        #    return jsonify({'error': 'there was an election but it expired, check results'})
        else:
            return jsonify({'error': 'there is an election ongoing'})

    return jsonify({'error': 'invalid parameters'}), 400


@app.route("/verify", methods=['GET'])
def verify():
    return render_template('verify.html', token=request.args.get('token'))


@app.route('/qrcode', methods=['POST'])
def get_qrcode():
    if 'email' in request.form and 'id' in request.form and 'token' in request.form:
        email = request.form.get('email')
        id = request.form.get('id')
        token = request.form.get('token')
        user = {
            'email': email,
            'id': id
        }

        if len(app.blocks) < 1:
            return jsonify({'error': 'no ongoing election'}), 400

        sha = hashlib.sha1()
        sha.update("{}{}{}{}".format(SALT_QR, email, id, app.blocks[-1]['id']).encode('utf-8'))

        if generate_token(app.blocks[-1], user) == token:
            return send_file(qrcode(sha.hexdigest(), mode='raw'), mimetype='image/png')

    return jsonify({'error': 'invalid parameters'}), 400


@app.route('/options', methods=['POST'])
def options():
    if len(app.blocks) < 1:
        return jsonify({'error': 'no ongoing election'}), 400
    return jsonify({
        'id': app.blocks[-1]['id'],
        'name': app.blocks[-1]['name'],
        'description': app.blocks[-1]['description'],
        'candidates': app.blocks[-1]['options']
    })


# expect 'token' (string) and 'option' (int) as parameter
@app.route('/vote', methods=['POST'])
def vote():
    if len(app.blocks) < 1:
        return jsonify({'error': 'no ongoing election'}), 400

    # if app.blocks[-1]['expiration'] < time.time():
        # return jsonify({'error': 'election expired'}), 400

    data = request.get_json()

    if data and 'token' in data and 'option' in data:
        user = validate_token(app.blocks[-1], data.get('token'))

        if user:
            new_block = copy.copy(app.blocks[-1])
            new_block['voted'].append(user)
            new_block['pointer'] += 1
            new_block['owner'] = app.server_id

            try:
                parsed_option = int(data.get('option'))
            except TypeError:
                return jsonify({'error': 'invalid option'}), 400

            result_hash = None
            for o in app.blocks[-1]['options']:
                if o['index'] == parsed_option:
                    new_block['results'] = encrypt_message(
                        '{},,,{}'.format(new_block['results'], parsed_option),
                        app.secret_key,
                        PADDING_CHAR).decode('utf-8')
                    sha = hashlib.sha1()
                    sha.update("{}{}".format(app.blocks[-1]['id'], user).encode('utf-8'))
                    result_hash = sha.hexdigest()

            if result_hash:
                sha = hashlib.sha1()
                sha.update(json.dumps(app.blocks[-1]).encode('utf-8'))
                new_block['hash'] = sha.hexdigest()

                app.blocks.append(new_block)
                app.model.save(app.blocks, app.secret_key)
                send_verification_email(app.blocks[-1], request.headers.get('host'), result_hash)
                broadcast_blocks(app.blocks, app.known_hosts)
                return jsonify({'verification': result_hash})

        return jsonify({'error': 'vote not registered'}), 400

    return jsonify({'error': 'invalid parameters'}), 400


@app.route("/proof", methods=['GET'])
def proof():
    if 'token' in request.args:
        token = request.args.get('token')
        return send_file(qrcode(token, mode='raw'), mimetype='image/png')
    return jsonify({'error': 'invalid parameters'}), 400


@app.route('/verify', methods=['POST'])
def verify_token():
    data = request.get_json()
    if 'token' in data:
        for user in app.blocks[-1]['voted']:
            sha = hashlib.sha1()
            sha.update("{}{}".format(app.blocks[-1]['id'], user).encode('utf-8'))
            if sha.hexdigest() == data.get('token'):
                return jsonify({'valid': True})
        return jsonify({'error': 'vote not registered'}), 400

    return jsonify({'error': 'invalid parameters'}), 400


@app.route('/results', methods=['POST'])
def results():
    # if app.blocks[-1]['expiration'] > time.time():
    #    return 'results not available yet'

    current_results = defaultdict(int)
    reversed_blocks = reversed(app.blocks)
    for b in reversed_blocks:
        payload = b['results']
        if b['owner'] == app.server_id:
            res = decrypt_message(payload.encode('utf-8'), app.secret_key, PADDING_CHAR)
        else:
            res = requests.post(app.known_hosts[b['owner']], {'payload': payload}).json().get('result')
        if len(res) > 1:
            option = int(res.split(',,,')[1])
            current_results[option] += 1

    return jsonify({
        'options': app.blocks[-1]['options'],
        'results': current_results
    })


@app.route('/decrypt', methods=['POST'])
def decrypt():
    data = request.get_json()
    if data and 'payload' in data:
        return jsonify({'result': decrypt_message(data.get('payload'), app.secret_key, PADDING_CHAR)})

    return jsonify({'error': 'invalid parameters'}), 400


@app.route('/update', methods=['POST'])
def update():
    data = request.get_json()
    local_pointer = app.current_election['pointer']

    if local_pointer < data['pointer']:
        app.current_election = data
        app.model.save(app.blocks, app.secret_key)
    else:
        broadcast_blocks(app.blocks, app.known_hosts)
