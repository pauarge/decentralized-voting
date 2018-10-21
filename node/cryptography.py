from Crypto.Cipher import AES
import base64
import os


def generate_secret_key_for_AES_cipher():
    # AES key length must be either 16, 24, or 32 bytes long
    AES_key_length = 16  # use larger value in production
    # generate a random secret key with the decided key length
    # this secret key will be used to create AES cipher for encryption/decryption
    secret_key = os.urandom(AES_key_length)
    # encode this secret key for storing safely in database
    encoded_secret_key = base64.b64encode(secret_key)
    return encoded_secret_key


def encrypt_message(private_msg, encoded_secret_key, padding_character):
    # decode the encoded secret key
    secret_key = base64.b64decode(encoded_secret_key)
    # use the decoded secret key to create a AES cipher
    cipher = AES.new(secret_key)
    # pad the private_msg
    # because AES encryption requires the length of the msg to be a multiple of 16
    padded_private_msg = private_msg + (padding_character * ((16 - len(private_msg)) % 16))
    # use the cipher to encrypt the padded message
    encrypted_msg = cipher.encrypt(padded_private_msg)
    # encode the encrypted msg for storing safely in the database
    encoded_encrypted_msg = base64.b64encode(encrypted_msg)
    # return encoded encrypted message
    return encoded_encrypted_msg


def decrypt_message(encoded_encrypted_msg, encoded_secret_key, padding_character):
    # decode the encoded encrypted message and encoded secret key
    secret_key = base64.b64decode(encoded_secret_key)
    encrypted_msg = base64.b64decode(encoded_encrypted_msg)
    # use the decoded secret key to create a AES cipher
    cipher = AES.new(secret_key)
    # use the cipher to decrypt the encrypted message
    decrypted_msg = cipher.decrypt(encrypted_msg)
    # unpad the encrypted message
    unpadded_private_msg = decrypted_msg.decode('utf-8').rstrip(padding_character)
    # return a decrypted original private message
    return unpadded_private_msg
