import requests
import hashlib
import json
import random
import string

from config import SALT, SALT_QR


def random_string():
    return ''.join(random.choice(string.ascii_uppercase + string.ascii_lowercase + string.digits) for _ in range(32))


def generate_token(election, user):
    sha = hashlib.sha1()
    sha.update("{}{}{}{}".format(user.get('email'), SALT, user.get('id'), election.get('id')).encode('utf-8'))
    return sha.hexdigest()


def validate_token(election, token):
    for user in election.get('users'):
        sha = hashlib.sha1()
        sha.update("{}{}{}{}".format(SALT_QR, user.get('email'), user.get('id'), election['id']).encode('utf-8'))
        if user.get('id') not in election['voted'] and sha.hexdigest() == token:
        # if sha.hexdigest() == token:
            return user.get('id')
    return None


def broadcast_blocks(blocks, known_hosts):
    for host in known_hosts:
        requests.post(host, json.dumps(blocks))
