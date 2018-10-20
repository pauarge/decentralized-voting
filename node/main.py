import hashlib

from flask import Flask, request, jsonify, render_template, send_file
from flask_cors import CORS
from flask_qrcode import QRcode
import random
import string
import time

from config import SALT_QR
from cron import scheduler
from send_email import send_email
from voting import validate_token, register_vote, generate_token
from model import Model

app = Flask(__name__)
CORS(app)
qrcode = QRcode(app)

app.current_election = None
app.model = Model()
known_hosts = []

scheduler.start()


@app.route("/discover")
def discover():
    return "Discover"


@app.route("/election", methods=['POST'])
def election():
    data = request.get_json()
    # if not app.current_election:
    app.current_election = data
    app.current_election['id'] = ''.join(
        random.choice(string.ascii_uppercase + string.ascii_lowercase + string.digits) for _ in range(32))
    app.current_election['voted'] = []
    app.current_election['options'] = list(map(lambda x: {'name': x, 'votes': 0}, data.get('options')))

    app.model.save(app.current_election)
    send_email(app.current_election, request.headers.get('host'))

    return jsonify({'current_election': app.current_election})


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
    sha.update("{}{}{}{}".format(SALT_QR, email, id, app.current_election['id']).encode('utf-8'))

    if generate_token(app.current_election, user) == token:
        return send_file(qrcode(sha.hexdigest(), mode='raw'), mimetype='image/png')
    else:
        return 'incorrect parameters'


@app.route('/vote', methods=['POST'])
def vote():
    if not app.current_election:
        return "no current election"

    data = request.get_json()
    user = validate_token(data.get('token'), app.current_election)

    if user:
        app.current_election['voted'].append(user)
        result = register_vote(data.get('option'), user, app.current_election)
        app.model.save(app.current_election)
        return jsonify({'current_election': app.current_election})
    else:
        return "no user"


@app.route("/proof", methods=['POST'])
def proof():
    return "voting proof"


@app.route('/results', methods=['POST'])
def results():
    data = request.get_json()

    if not app.current_election:
        return 'no election'
    elif data.current_election['expiration'] > time.time():
        return 'results not available yet'
    return jsonify(app.current_election['options'])
