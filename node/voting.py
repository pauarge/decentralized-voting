import hashlib


def validate_token(token, election):
    for user in election['users']:
        sha_1 = hashlib.sha1()
        sha_1.update("{}{}".format(user.get('email'), user.get('id')).encode('utf-8'))
        if sha_1.hexdigest() == token:
            return user.get('id')
    return None


def register_vote(option, user, election):
    for o in election['options']:
        if o['name'] == option:
            o['votes'] += 1
            sha_1 = hashlib.sha1()
            sha_1.update("{}{}".format(election['id'], user))
            return sha_1.hexdigest()
    return None
