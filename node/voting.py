import requests
import hashlib
import json
import random
import string

from config import SALT


def random_string():
    return ''.join(random.choice(string.ascii_uppercase + string.ascii_lowercase + string.digits) for _ in range(32))


def generate_token(election, user):
    sha = hashlib.sha512()
    sha.update("{}{}{}{}".format(user.get('email'), SALT, user.get('id'), election.get('id')).encode('utf-8'))
    return sha.hexdigest()


def validate_token(election, token):
    for user in election.get('users'):
        if user.get('id') not in election['voted'] and generate_token(election, user) == token:
            return user.get('id')
    return None


def register_vote(option, user, election):
    for o in election['options']:
        if o['name'] == option:
            o['votes'] += 1
            sha = hashlib.sha512()
            sha.update("{}{}".format(election['id'], user))
            return sha.hexdigest()
    return None


def broadcast_blocks(blocks, known_hosts):
    for host in known_hosts:
        requests.post(host, json.dumps(blocks))
