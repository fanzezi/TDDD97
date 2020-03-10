import sqlite3
from flask import g
from flask import Flask
import os
import random
from random import randint
import string

DATABASE = "database.db"
app = Flask(__name__)

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db

def init_db():
    with app.app_context():
        db = get_db()
        with app.open_resource('schema.sql', mode='r') as f:
            db.cursor().executescript(f.read())
        db.commit()

def disconnect_db():
    db = getattr(g, 'db', None)
    if db is not None:
        g.db.close()

# sign in -----------------------------------------------------
# generate random token
def generate_token():
    letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    token = ""
    for i in range (0,36):
        token += letters[randint(0,len(letters) -1)]
    return token

# if email is in user
def user_exist(email):
    c = get_db()
    cursor = c.execute('SELECT email FROM users WHERE email = ?', [email])
    user = cursor.fetchone()
    cursor.close()
    if user:
        return True
    else:
        return False

# get user email
def get_user(email):
    c = get_db()
    try:
        cursor = c.execute('SELECT * FROM users WHERE email = ?', [email])
        rows = cursor.fetchall()[0]
        cursor.close()
        return {'email' : rows[0],
                'password' : rows[1]}
    except:
        return False

# get email from loggedInUsers
def get_loggedInEmail(email):
    c = get_db()
    try:
        cursor = c.execute('SELECT * FROM loggedInUsers WHERE email = ?', [email])
        rows = cursor.fetchall()
        cursor.close()
        return {'email' : rows[0]}
    except:
        return False

#insert user into loggedInUsers
def sign_in(token,email):
    c = get_db()
    try:
        result = get_loggedInEmail(email)
        if result is False:
            c.execute('INSERT INTO loggedInUsers VALUES(?,?)', [email ,token])
            c.commit()
            return True
        else:
            c.execute('UPDATE loggedInUsers SET token = ? WHERE email = ?', [token,email])
            c.commit()
            return True
    except:
        return False

# print all logged in users
def allLoggedInUsers():
    c = get_db()
    cursor = c.execute('SELECT * FROM loggedInUsers')
    rows = cursor.fetchall()
    cursor.close()
    result = []
    for index in range(len(rows)):
        result.append({'email' : rows[index][0],
                        'token' : rows[index][1]})
    return result

# sign up ------------------------------------------------------------
# insert new user into users
def register(email, password, firstname, familyname, gender, city, country):
    c = get_db()
    try:
        c.execute('INSERT INTO users VALUES(?,?,?,?,?,?,?)', [email, password, firstname, familyname, gender, city, country])
        c.commit()
        return True
    except:
        return False

# sign out -----------------------------------------------------------
# delete user from loggedInUsers
def remove_user(token):
    c = get_db()
    try:
        c.execute('DELETE FROM loggedInUsers WHERE token = ?', [token])
        c.commit()
        return True
    except:
        return False

#get loggedInUsers from token
def tokenToEmail(token):
    c = get_db()
    try:
        cursor = c.execute('SELECT * FROM loggedInUsers WHERE token = ?', [token])
        rows = cursor.fetchall()[0]
        cursor.close()
        print(rows[0])
        print(rows[1])
        return {'email' : rows[0],
                'token' : rows[1]}
    except:
        return False

# change password ------------------------------------------------
def change_password(token,newPassword,oldPassword):
    c = get_db()
    try:
        email = tokenToEmail(token)
        user = get_user(email['email'])

        if oldPassword == user['password']:
            c.execute('UPDATE users SET password = ? WHERE email =  ?', [newPassword,email['email']])
            c.commit()
            return True
        else:
            return False
    except:
        return False

#get user data from email in users
def get_user_data_by_email(email):
    c = get_db()
    cursor = c.execute('SELECT * FROM users WHERE email = ?', [email])
    rows = cursor.fetchall()[0]
    cursor.close()
    return {'email' : rows[0],'firstname' : rows[2],
            'familyname' : rows[3], 'gender' : rows[4],
            'city' : rows[5],'country' : rows[6]}

# get user messages from token
def get_user_messages_by_token(email):
    print(email)
    c = get_db()
    cursor = c.execute('SELECT * FROM messages WHERE fromEmail = ?', [email])
    rows = cursor.fetchall()
    cursor.close()
    result = []
    for index in range(len(rows)):
        result.append({'fromEmail': rows[index][1],
                        'message' : rows[index][2],
                        'toEmail' : rows[index][3]})
    return result

# get user messages from email
def get_user_messages_by_email(email):
    c = get_db()
    cursor = c.execute('SELECT * FROM messages WHERE toEmail = ?', [email])
    rows = cursor.fetchall()
    cursor.close()
    result = []
    for index in range(len(rows)):
        result.append({'fromEmail' : rows[index][1],
                        'message' : rows[index][2],
                        'toEmail' : rows[index][3]})
    return result

# def print_all_users():
#     c = get_db()
#     cursor = c.execute('SELECT * FROM users')
#     rows = cursor.fetchall()
#     cursor.close()
#     result = []
#     for index in range(len(rows)):
#         result.append({'email' : rows[index][0],
#                         'password' : rows[index][1]})
#     return result

# insert new message into messages
def post_message(fromEmail, message, toEmail):
    c = get_db()
    try:
        c.execute('INSERT INTO messages (fromEmail, message, toEmail) VALUES(?,?,?)', [fromEmail, message, toEmail])
        c.commit()
        return True
    except:
        return False

# print all messages on signed in users wall
def print_all_messages(toEmail):
    c = get_db()
    cursor = c.execute('SELECT * FROM messages WHERE toEmail = ?', [toEmail])
    rows = cursor.fetchall()
    cursor.close()
    result = []
    for index in range(len(rows)):
        result.append({'fromEmail' : rows[index][1],
                        'messages' : rows[index][2],
                        'toEmail' : rows[index][3] })
        print(rows[index][3])
    return result
