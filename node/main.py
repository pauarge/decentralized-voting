import hashlib

from flask import Flask, request, jsonify, render_template, send_file
from flask_qrcode import QRcode
import random
import string

from send_email import send_email

app = Flask(__name__)
app.current_election = None
qrcode = QRcode(app)
known_hosts = []

global current_election


@app.route("/")
def hello():
    return "Hello World!"


@app.route("/discover")
def discover():
    return "Discover"


@app.route("/election", methods=['POST'])
def election():
    data = request.get_json()
    # if not app.current_election:
    election_id = ''.join(
        random.choice(string.ascii_uppercase + string.ascii_lowercase + string.digits) for _ in range(32))
    app.current_election = data
    app.current_election['id'] = election_id
    send_email(app.current_election, request.headers.get('host'))

    return jsonify({'current_election': app.current_election})


@app.route("/verify", methods=['GET'])
def verify():
    return render_template('verify.html', token=request.args.get('token'))


@app.route('/qrcode', methods=['POST'])
def get_qrcode():
    # please get /qrcode?data=<qrcode_data>
    email = request.form.get('email')
    id = request.form.get('id')
    token = request.form.get('token')

    sha_1 = hashlib.sha1()
    sha_1.update("{}{}".format(email, id).encode('utf-8'))

    if sha_1.hexdigest() == token:
        return send_file(
            qrcode(token, mode='raw'),
            mimetype='image/png'
        )
    else:
        return 'incorrect parameters'
