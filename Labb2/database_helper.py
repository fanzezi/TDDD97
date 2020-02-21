# find_user(), remove_user(), create_post()
import sqlite3
from flask import g
from random import randint

#connect to database
def connect_db():
    return sqlite3.connect("database.db")

#get database
def get_db():
    db = getattr(g, 'db', None)
    if db is None:
        db = g.db = connect_db()
    return

def disconnect_db():
    db = getattr(g, 'db', None)
    if db is not None:
        g.db.close()
        g.db = None

#get email from token
def tokenToEmail(token):
    c = get_db()
    c.execute('SELECT email FROM loggedInUser WHERE token = ?', [token])
    rows = c.fetchone()
    return rows[0]

def register(email, password, firstname, familyname, gender, city, country):
    c = get_db()

    try:
        c.execute('INSERT INTO users (email, password, firstname, lastname, gender, city, country) VALUES (?,?,?,?,?,?,?)', [email, password, firstname, familyname, gender, city, country])
        c.commit()
        return True
    except:
        return False

# get user
def get_user(email):
    c = get_db()
    cursor = c.execute('SELECT * FROM users WHERE email = ?', [email])
    user = cursor.fetchall()
    cursor.close()
    result = []
    for i in range(len(user)):
        result.append({'email': rows[i][0]})
    return result

def generate_token():
    letters = "abcdefghiklmnopqrstuvwwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890"
    token = ""
    for i in range (0,36):
        token += letters[randint(0,len(letters) -1)]
    return token

def get_user_data(email):
    c = get_db()
    c.execute('SELECT * FROM users WHERE email = ?', [email])
    data = c.fetchone()
    return data

def get_user_messages(email):
    c = get_db()
    c.execute('SELECT message,fromEmail FROM messages WHERE toEmail = ?', [email])
    data = c.fetchall()
    result = []
    for i in range(len(data)):
        result.append({'message': data[i][0], 'fromEmail': data[i][1]})
    return result

# find user
def find_user(email, password):
    db = get_db()
    user = (email, password)
    if user:
        return True
    else:
        return False

def remove_user(token):
    c = get_db()
    try:
        c.execute('DELETE FROM loggedInUser WHERE token = ?', [token])
        c.commit()
        return True
    except:
        return False


def create_post(toEmail, fromEmail, message):
    #do stuff
    try:
        c = get_db()
        c.execute('INSERT INTO messages (toEmail, fromEmail, message) VALUES (?,?,?)', [toEmail, fromEmail, message])
        c.commit()
        return True
    except:
        return False


def colse():
    get_db().close()
