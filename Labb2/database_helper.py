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
    result = c.execute('SELECT email FROM loggedInUser WHERE token = ?', (token,))
    row = result.fetchone()
    return row[0]

# get user
def copyUser(email):
    c = get_db()
    result = c.execute('SELECT * FROM users WHERE email = ?', (email,))
    user = result.fetchall()
    return user

# find user
def find_user(email, password):
    db = get_db()
    user = (email, password)
    if user:
        return True
    else:
        return False

def create_post():
    #do stuff
    return ""

def store_message():
    #do stuff
    return ""

def remove_user():
    # do stuff
    return ""
etattr(g, 'db', None)
    if db is None:
        db = g.db = connect_db()
    return db

def find_user(email, password):
    db = get_db()
    user = (email, password)
    if user:
        return True
    else:
        return False

def create_post():

def remove_user():
