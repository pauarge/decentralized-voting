from flask import Flask, request, jsonify
import random
import string

from send_email import send_email

app = Flask(__name__)
app.current_election = None
known_hosts = []

global current_election


@app.route("/")
def hello():
    return "Hello World!"


@app.route("/headers")
def headers():
    return request.headers.get('host')


@app.route("/discover")
def discover():
    return "Discover"


@app.route("/election", methods=['POST'])
def election():
    data = request.get_json()
    #if not app.current_election:
    election_id = ''.join(
        random.choice(string.ascii_uppercase + string.ascii_lowercase + string.digits) for _ in range(32))
    app.current_election = data
    app.current_election['id'] = election_id
    send_email(app.current_election, request.headers.get('host'))

    return jsonify({'current_election': app.current_election})
