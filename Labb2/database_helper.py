# find_user(), remove_user(), create_post()
import sqlite3
from flask import g

def connect_db():
    return sqlite3.connect("database.db")

def get_db():
    db = getattr(g, 'db', None)
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
