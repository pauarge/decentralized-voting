import hashlib

from config import SALT


def generate_token(election, user):
    sha = hashlib.sha512()
    sha.update("{}{}{}{}".format(user.get('email'), SALT, user.get('id'), election.get('id')).encode('utf-8'))
    return sha.hexdigest()


def validate_token(election, token):
    for user in election['users']:
        if generate_token(election, user) == token:
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
