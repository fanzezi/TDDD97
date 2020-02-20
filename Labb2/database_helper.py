# find_user(), remove_user(), create_post()
import sqlite3
from flask import g

#connect to database
def connect_db():
    return sqlite3.connect("database.db")

#get database
def get_db():
    db = getattr(g, 'db', None)
    if db is None:
        db = g.db = connect_db()
    return db

#get email from token
def tokenToEmail(token):
    c = get_db()
    c.execute('SELECT email FROM loggedInUser WHERE token = ?', [token])
    rows = c.fetchone()
    return rows[0]

def register(email, password, firstname, familyname, gender, city, country):
    c = get_db()

    try:
        c.execute('INSERT INTO users VALUES (?,?,?,?,?,?,?)', [email, password, firstname, familyname, gender, city, country])
        c.commit()
        return True
    except:
        return False

# get user
def get_user(email):
    c = get_db()
    cursor = c.execute('SELECT * FROM users WHERE email = ?', [email])
    user = cursor.fetchall()
    return user

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
