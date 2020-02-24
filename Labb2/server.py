from flask import Flask, request, jsonify
import database_helper
import json

app = Flask(__name__)
app.debug = True

@app.teardown_request
def after_request(exception):
    database_helper.disconnect_db()

# sign in user
@app.route('/sign-in',methods = ['POST'])
def sign_in():
    email = request.json['email']
    password = request.json['password']
    user = database_helper.get_user(email)

    if user is not False:
        if email and password:
            if user['email'] == email and user['password'] == password:
                token = database_helper.generate_token()
                result = database_helper.sign_in(token, email)
                if result:
                    return jsonify(database_helper.allLoggedInUsers())
                    #return jsonify({'success': True, 'message': "Successfully signed in", 'data': token})
                else:
                    return jsonify({'success': False, 'message': "Sign in failed"})
            else:
                return jsonify({'success': False, 'message': "Wrong username or password!"})
        else:
            return jsonify({'success': False, 'message': "Form data missing or incorrect type"})
    else:
        return jsonify({'success': False, 'message': "Sign in failed"})

# sign up new user
@app.route('/sign-up',methods = ['POST'])
def sign_up():
    email = request.json['email']
    password = request.json['password']
    firstname = request.json['firstname']
    familyname = request.json['familyname']
    gender = request.json['gender']
    city = request.json['city']
    country = request.json['country']

    if len(password) < 4:
        return json.dumps({'success': False, 'message': "Password must be at least 4 characters long"})

    if not database_helper.user_exist(email):
        if (len(email) == 0 or
            len(password) ==  0 or
            len(firstname) == 0 or
            len(familyname) == 0 or
            len(gender) == 0 or
            len(city) == 0 or
            len(country) == 0):

            return jsonify({'success': False, 'message': "Form data missing or incorrect type."})
        else:

            user = database_helper.register(email, password, firstname, familyname, gender, city, country)

            if user is not False:
                return jsonify({'success': True, 'message': "Successfully created a new user."})
            else:
                return jsonify({'success': False, 'message': "Something went wrong"})
    else:
        return jsonify({'success': False, 'message': "User already exists"})

#sign out current user
@app.route('/sign-out', methods = ['POST'])
def sign_out():
    token = request.headers["Authorization"]
    data = database_helper.tokenToEmail(token)
    print(data)
    if data is not False:
        if data['token'] == token:
            database_helper.remove_user(token)
            jsonify(database_helper.allLoggedInUsers())
            return jsonify({'success': True, 'message': "Successfully signed out"})
        else :
            return jsonify({'success': False, 'message': "You are not signed in"})
    else:
        return jsonify({'success': False, 'message': "Sign out failed"})

# change password
@app.route('/change-password',methods = ['PUT'])
def change_password():
    token = request.headers["Authorization"]
    oldPassword = request.json['oldPassword']
    newPassword = request.json['newPassword']

    result = database_helper.change_password(token,newPassword,oldPassword)
    if result:
        return jsonify({'success': True, 'message': "Password changed"})
    else:
        return jsonify({'success': False, 'message': "Wrong password"})

@app.route('/getdatatoken', methods = ['GET'])
def get_user_data_by_token():
    token = request.headers["Authorization"]
    data = database_helper.tokenToEmail(token)

    if data is not False:
        result = database_helper.get_user_data_by_email(data['email'])
        return jsonify({'success': True, 'message': "User data retrieved", 'data': result})
    else:
        return jsonify({'success': False, 'message': "No such user"})


@app.route('/getdataemail', methods = ['GET'])
def get_user_data_by_email():
    token = request.headers["Authorization"]
    email = request.json['email']
    data = database_helper.tokenToEmail(token)

    if data['email'] == email and data['token'] == token:
        result = database_helper.get_user_data_by_email(email)
        return jsonify({'success': True, 'message': "User messages retrieved", 'data': result})
    else:
        return jsonify({'success': False, 'message': "No such user"})

@app.route('/getmessagestoken',methods = ['GET'])
def get_user_messages_by_token():
    token = request.headers["Authorization"]
    data = database_helper.tokenToEmail(token)

    if data is not False:
        result = database_helper.get_user_messages_by_token(data['email'])
        return jsonify({'success': True, 'message': "User messages retrieved", 'data': result})
    else :
        return jsonify({'success': False, 'message': "No such user"})

@app.route('/getmessagesemail',methods = ['GET'])
def get_user_messages_by_email():
    token = request.headers["Authorization"]
    toEmail = request.json['email']
    data = database_helper.tokenToEmail(token)

    if data is not False:
        result = database_helper.get_user_messages_by_email(toEmail)
        return jsonify({'success': True, 'message': "User messages retrieved", 'data': result})
    else :
        return jsonify({'success': False, 'message': "No such user"})

@app.route('/post-message',methods = ['POST'])
def post_message():
    token = request.headers["Authorization"]
    message = request.json['message']
    toEmail = request.json['email']
    fromEmail = database_helper.tokenToEmail(token)

    if fromEmail is not False:
        data = database_helper.post_message(fromEmail['email'], message, toEmail)
        return jsonify(database_helper.print_all_messages())
        #return jsonify({'success': True, 'message': "Message posted"})
    else:
        return jsonify({'success': False, 'message': "No such user"})
