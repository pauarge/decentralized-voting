import hashlib

from flask import Flask, request, jsonify, render_template, send_file
from flask_cors import CORS
from flask_qrcode import QRcode
import random
import string
import time
import copy
import json

from config import SALT_QR
from send_email import send_email
from voting import validate_token, register_vote, generate_token, broadcast_blocks
from model import Model

app = Flask(__name__)
CORS(app)
qrcode = QRcode(app)

app.blocks = []
app.model = Model()
known_hosts = []


# scheduler.start()


@app.route("/election", methods=['POST'])
def election():
    data = request.get_json()
    # if not app.current_election:
    elec = data
    elec['id'] = ''.join(
        random.choice(string.ascii_uppercase + string.ascii_lowercase + string.digits) for _ in range(32))
    elec['voted'] = []
    elec['options'] = list(map(lambda x: {'name': x, 'votes': 0}, data.get('options')))
    elec['pointer'] = 0
    elec['hash'] = ''

    app.blocks.append(elec)
    app.model.save(app.blocks)
    broadcast_blocks(app.blocks, known_hosts)
    send_email(elec, request.headers.get('host'))
    return jsonify(app.blocks)


@app.route("/verify", methods=['GET'])
def verify():
    return render_template('verify.html', token=request.args.get('token'))


@app.route('/qrcode', methods=['POST'])
def get_qrcode():
    email = request.form.get('email')
    id = request.form.get('id')
    token = request.form.get('token')
    user = {
        'email': email,
        'id': id
    }

    sha = hashlib.sha512()
    sha.update("{}{}{}{}".format(SALT_QR, email, id, app.blocks[-1]['id']).encode('utf-8'))

    if generate_token(app.blocks[-1], user) == token:
        return send_file(qrcode(sha.hexdigest(), mode='raw'), mimetype='image/png')
    else:
        return 'incorrect parameters'


# expect 'token' (string) and 'option' (int) as parameter
@app.route('/vote', methods=['POST'])
def vote():
    if app.blocks[-1]['expiration'] < time.time():
        return jsonify({'error': 'poll expired'})

    data = request.get_json()
    user = validate_token(data.get('token'), app.blocks[-1])

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
            broadcast_blocks(app.blocks, known_hosts)
            return jsonify({'blocks': app.blocks, 'verification': result})

    return jsonify({'error': 'vote not registered'})


@app.route("/proof", methods=['POST'])
def proof():
    return "voting proof"


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
        broadcast_blocks(app.blocks, known_hosts)
