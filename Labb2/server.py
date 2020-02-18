from flask import Flask, request, jsonify
import database_helper
import json


# File shall contain all the server side remote procedures
#implemented using Python and Flask
# signup singin


@app.route("/sign_in", methods=['GET', 'POST'])
def sign_in():
    email = request.json['email']
    password = request.json['password']

    #if user exists
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

    # if somethings missing:
    # return json.dumps({'success': False, 'message': "Form data missing or incorrect type."})

    return json.dumps({'success': True, 'message': "Successfully created a new user."})



@app.route("/change-password", methods=['POST'])
def change_password():

    token = request.json['token']
    oldPassword = request.json['oldPassword']
    newPassword = request.json['newPassword']

    # if old password equal to new password
    if oldPassword == newPassword:
        return json.dumps({'success': False, 'message': "Can't use the same password"})

    #if password length is less than 4 characters
    if len(newPassword)< 4:
        return json.dumps({'success': False, 'message': "Password must be at least 3 characters long"})

    #get email from token
    email = database_helper.tokenToEmail(token)

    # if user not logged in
    if not email:
        return json.dumps({'success': False, 'message': "You are not logged in!"})

    # if wrong password
    if not database_helper.find_user(email, oldPassword):
        return json.dumps({'success': False, 'message': "Wrong password"})

    #return password successfully changed
    return json.dumps({'success': True, 'message': "Password changed"})

def get_user_data_by_token()


def get_user_data_by_email()

def get_user_messages_by_token():
    token = request.json['token']
    email = database_helper.tokenToEmail(token)

@app.route("/get-user-messages-by-email", methods=['GET'])
def get_user_messages_by_email():
    token = request.json['token']
    email = request.json['email']

    #get user
    match = database_helper.copyUser(email)

    # if user do not exist
    if not match:
        return json.dumps({'success': False, 'message': "No such user"})

    #if user is not signed in
    if not database_helper.tokenToEmail(token):
        return json.dumps({'success': False, 'message': "You are not signed in"})

    #return user messages
    return json.dumps({'success': True, 'message': "User messages retrived", 'data': match})

#post message
@app.route("/post-message", methods=['POST'])
def post_message():
    token = request.json['token']
    message = request.json['message']
    toEmail = request.json['email']

    fromEmail = database_helper.tokenToEmail(token)

    if not fromEmail:
        return json.dumps({'success': False, 'message': "You are not signed in"})

    if not database_helper.find_user(toEmail):
        return json.dumps({'success': False, 'message': "No such user"})

    #result = database_helper.store_message(toEmail, fromEmail, message)
    # if result
    return json.dumps({'success': True, 'message': "Message posted"})
