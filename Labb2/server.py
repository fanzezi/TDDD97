from flask import Flask, request, jsonify
import database_helper
import json

app = Flask(__name__)

app.debug = True

# File shall contain all the server side remote procedures
#implemented using Python and Flask
# signup singin

@app.route("/sign-in", methods=['POST'])
def sign_in():
    email = request.json['email']
    password = request.json['password']

    #if user exists
    if database_helper.find_user(email,password):
        token = database_helper.generate_token()
        #save token
        if token:
            return json.dumps({'success': True, 'message': "Successfully signed in", 'data': token})
        else:
            return json.dumps({'success': False, 'message': "Sign in failed"})
    else:
        return json.dumps({'success': False, 'message': "Wrong username or password!"})


# NOT FINISHED
@app.route("/sign-up", methods=['POST'])
def sign_up():

    email  = request.json['email']
    password = request.json['password']
    firstname = request.json['firstname']
    familyname = request.json['familyname']
    gender = request.json['gender']
    city = request.json['city']
    country = request.json['country']

    if (len(email) == 0 or
        len(password) ==  0 or
        len(firstname) == 0 or
        len(familyname) == 0 or
        len(gender) == 0 or
        len(city) == 0 or
        len(country) == 0):

        return json.dumps({'success': False, 'message': "Form data missing or incorrect type."})

    if len(password) < 4:
        return json.dumps({'success': False, 'message': "Password must be at least 4 characters long"})

    user = database_helper.register(email, password, firstname, familyname, gender, city, country)

    if user is not False:
        return json.dumps({'success': True, 'message': "Successfully created a new user."})
    else:
        return json.dumps({'success': False, 'message': "User already exists"})



@app.route("/sign-out", methods=['POST'])
def sign_out():
    #token = request.json['token']
    token = request.headers['Authorization']
    #if user is not signed in
    if database_helper.remove_user(token):
        #sign out user
        return json.dumps({'success': True, 'message': "Successfully signed out"})
    else:
        return json.dumps({'success': False, 'message': "You are not signed in"})

@app.route("/change-password", methods=['POST'])
def change_password():
    #token = request.json['token']
    token = request.headers['Authorization']
    oldPassword = request.json['oldPassword']
    newPassword = request.json['newPassword']

    # if old password equal to new password
    if oldPassword == newPassword:
        return json.dumps({'success': False, 'message': "Can't use the same password"})

    #if password length is less than 4 characters
    if len(newPassword)< 4:
        return json.dumps({'success': False, 'message': "Password must be at least 4 characters long"})

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

@app.route("/get-user-data-by-token", methods=['GET'])
def get_user_data_by_token():
    token = request.headers['Authorization']
    #token = request.json['token']
    email = database_helper.tokenToEmail(token)
    user_data = database_helper.get_user_data(email)

    data = {
        'email': user_data[0],
        'firstname': user_data[1],
        'familyname': user_data[2],
        'gender': user_data[3],
        'city': user_data[4],
        'country': user_data[5]
    }

    if user_data:
        return json.dumps({'success': True, 'message': "Messages retrieved", 'data': data})

@app.route("/get-user-data-by-email", methods=['GET'])
def get_user_data_by_email():
    #token = request.json['token']
    token = request.headers['Authorization']
    email = request.json['email']
    user = database_helper.get_user_data(email)

    if not database_helper.tokenToEmail(token):
        return json.dumps({'success': False, 'message': "You are not signed in"})

    if not user:
        return json.dumps({'success': False, 'message': "No such user"})

    match = {
        'email': user[0],
        'firstname': user[1],
        'familyname': user[2],
        'gender': user[3],
        'city': user[4],
        'country': user[5]
    }
    return json.dumps({'success': True, 'message': "User data retrieved", 'data': match})


@app.route("/get-user-messages-by-token", methods=['GET'])
def get_user_messages_by_token():
    #token = request.json['token']
    token = request.headers['Authorization']
    email = database_helper.tokenToEmail(token)
    user_messages = database_helper.get_user_messages(email)

    if user_data:
        return json.dumps({'success': True, 'message': "Messages retrieved", 'data': user_messages})

@app.route("/get-user-messages-by-email", methods=['GET'])
def get_user_messages_by_email():
    #token = request.json['token']
    token = request.headers['Authorization']
    email = request.json['email']

    #get user
    match = database_helper.get_user_messages(email)
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
    #token = request.json['token']
    token = request.headers['Authorization']
    message = request.json['message']
    toEmail = request.json['email']

    fromEmail = database_helper.tokenToEmail(token)

    if not fromEmail:
        return json.dumps({'success': False, 'message': "You are not signed in"})

    if not database_helper.get_user(toEmail):
        return json.dumps({'success': False, 'message': "No such user"})

    result = database_helper.create_post(toEmail, fromEmail, message)
    if result:
        return json.dumps({'success': True, 'message': "Message posted"})
