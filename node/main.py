from flask import Flask, request, jsonify, render_template, send_file
from flask_cors import CORS
from flask_qrcode import QRcode
import random
import string
import time
import copy
import json
import hashlib

from config import SALT_QR
from send_email import send_register_email
from voting import validate_token, register_vote, generate_token, broadcast_blocks
from model import Model

app = Flask(__name__)
CORS(app)
qrcode = QRcode(app)

app.blocks = []
app.model = Model()
app.known_hosts = []


@app.route("/election", methods=['POST'])
def election():
    data = request.get_json()

    if data and 'users' in data and 'name' in data and 'description' in data and 'expiration' in data \
            and 'options' in data:
        if len(app.blocks) < 1:
            elec = data
            elec['id'] = ''.join(
                random.choice(string.ascii_uppercase + string.ascii_lowercase + string.digits) for _ in range(32))
            elec['voted'] = []
            elec['options'] = [{'index': i, 'name': x, 'votes': 0} for i, x in enumerate(data.get('options'))]
            elec['pointer'] = 0
            elec['hash'] = ''

            app.blocks.append(elec)
            app.model.save(app.blocks)
            broadcast_blocks(app.blocks, app.known_hosts)
            send_register_email(elec, request.headers.get('host'))
            return jsonify(app.blocks)
        elif app.blocks[-1].get('expire') < time.time():
            return jsonify({'error': 'there was an election but it expired, check results'})
        else:
            return jsonify({'error': 'there is an election ongoing'})

    return jsonify({'error': 'invalid parameters'}), 400


@app.route("/verify", methods=['GET'])
def verify():
    return render_template('verify.html', token=request.args.get('token'))


@app.route('/qrcode', methods=['POST'])
def qrcode():
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

        sha = hashlib.sha512()
        sha.update("{}{}{}{}".format(SALT_QR, email, id, app.blocks[-1]['id']).encode('utf-8'))

        if generate_token(app.blocks[-1], user) == token:
            return send_file(qrcode(sha.hexdigest(), mode='raw'), mimetype='image/png')

    return jsonify({'error': 'invalid parameters'}), 400


@app.route('/options', methods=['POST'])
def options():
    if len(app.blocks) < 1:
        return jsonify({'error': 'no ongoing election'}), 400
    return jsonify(app.blocks[-1]['options'])


# expect 'token' (string) and 'option' (int) as parameter
@app.route('/vote', methods=['POST'])
def vote():
    if app.blocks[-1]['expiration'] < time.time():
        return jsonify({'error': 'poll expired'})

    data = request.get_json()
    user = validate_token(data.get('token'), app.blocks[-1], data.blocks[-1]['voted'])

    if user:
        new_block = copy.copy(app.blocks[-1])
        new_block['voted'].append(user)

        sha = hashlib.sha512()
        sha.update(json.dumps(app.blocks[-1]))
        new_block['hash'] = sha.hexdigest()
        result = register_vote(data.get('option'), user, new_block)
        if result:
            app.blocks.append(new_block)
            app.model.save(app.blocks)
            broadcast_blocks(app.blocks, app.known_hosts)
            return jsonify({'blocks': app.blocks, 'verification': result})

    return jsonify({'error': 'vote not registered'})


@app.route("/proof", methods=['POST'])
def proof():
    token = request.form.get('token')
    return send_file(qrcode(token, mode='raw'), mimetype='image/png')


@app.route('/results', methods=['POST'])
def results():
    if app.blocks[-1]['expiration'] > time.time():
        return 'results not available yet'
    return jsonify(app.blocks[-1]['options'])


@app.route('/update', methods=['POST'])
def update():
    data = request.get_json()
    local_pointer = app.current_election['pointer']

    if local_pointer < data['pointer']:
        app.current_election = data
    else:
        broadcast_blocks(app.blocks, app.known_hosts)
