from flask import Flask, request, jsonify
import database_helper
import json


# File shall contain all the server side remote procedures
#implemented using Python and Flask
# signup singin

# token = generate_token()
#         res = database_helper.save_token(email, token)
#         if res:
#             return json.dumps({'success':True, 'message':"You successfully signed in", 'data':token})
#         else:
#             return json.dumps({'success':False, 'message':"Sign in was unsuccessful", 'data':""})



@app.route("/sign_in", methods=['GET', 'POST'])
def sign_in():
    email = request.json['email']
    password = request.json['password']

    if database_helper.find_user(email,password):
        token = generate_token()
        #save token
        #if :#token
        return json.dumps({'success': True, 'message': "Successfully signed in", 'data': token})
        #else:
        #    return json.dumps({'success': False, 'message': "Sign in failed", 'data':"" })
    else:
        return json.dumps({'success': False, 'message': "Wrong username or password!"})



@app.route("/sign_up", methods=['POST'])
def sign_up():

    email  = request.json['email']
    password = request.json['password']
    firstname = request.json['firstname']
    familyname = request.json['familyname']
    gender = request.json['gender']
    city = request.json['city']
    country = request.json['country']

    return json.dumps({'success': True, 'message': "Successfully created a new user."})

    return json.dumps({'success': False, 'message': "Form data missing or incorrect type."})


@app.route("/change-password", methods=['POST'])
def change_password():

    token = request.json['token']
    oldPassword = request.json['oldPassword']
    newPassword = request.json['newPassword']

    if oldPassword == newPassword:
        return json.dumps({'success': False, 'message': "Can't use the same password"})
    return json.dumps({'success': True, 'message': "Password changed"})
    return json.dumps({'success': False, 'message': "Wrong password"})
    return json.dumps({'success': False, 'message': "You are not logged in!"})

def get_user_data_by_token()


def get_user_data_by_email()

def get_user_messages_by_token()

def get_user_messages_by_email()

def post_message()
