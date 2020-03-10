import sqlite3
from flask import Flask, request, jsonify, send_from_directory, render_template
import Twidder.database_helper
import json
from gevent.pywsgi import WSGIServer
from geventwebsocket.handler import WebSocketHandler
from Twidder import database_helper

#app = Flask(__name__)
app = Flask(__name__)
app.debug = True
active_sockets = dict()

@app.teardown_request
def after_request(exception):
    database_helper.disconnect_db()

@app.route('/')
def root():
    #return send_from_directory('static', 'client.html')
    #return app.send_static_file('client.html')
    return render_template('client.html')

@app.route('/api')
def api():
    if request.environ.get('wsgi.webscoket'):
        ws = request.environ['wsgi.websocket']
        msg = ws.recieve()
        data = json.loads(msg)
        print(data)

        user_id = database_helper.tokenToEmail(data["token"])

        if not user_id:
            ws.send(json.dumps({"success": False, "message": "no such email"}))


        if user_id in active_sockets:
            active_sockets[user_id].close()
            active_sockets.pop(user_id)
        active_sockets[user_id] = ws
        ws.send(json.dumps({"success": True, "message": "Welcome"}))

        while True:
            object = ws.recieve()
            if object == None:
                ws.close()
                return ''
    return ''

# sign in existing user
@app.route('/sign-in',methods = ['POST'])
def sign_in():
    email = request.json['email']
    password = request.json['password']
    user = database_helper.get_user(email)

    # if user is True
    if user is not False:
        #if email and password is true
        if email and password:
            #if email is in user and password is in user
            if user['email'] == email and user['password'] == password:
                token = database_helper.generate_token()
                result = database_helper.sign_in(token, email)

                #if result is true
                if result:
                    #return jsonify(database_helper.allLoggedInUsers()) # see all loggedInUsers
                    return jsonify({'success': True, 'message': "Successfully signed in", 'data': token})
                else: # result is false
                    return jsonify({'success': False, 'message': "Sign in failed"})
            else: #email and password is not in user
                return jsonify({'success': False, 'message': "Wrong username or password!"})
        else: #field is empty or password and email is not true
            return jsonify({'success': False, 'message': "Form data missing or incorrect type"})
    else: # if user is false
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

    #if password is less than 4 characters
    if len(password) < 4:
        return json.dumps({'success': False, 'message': "Password must be at least 4 characters long"})

    # if user do not already exist
    if not database_helper.user_exist(email):
        #if one field or more is empty
        if (len(email) == 0 or
            len(password) ==  0 or
            len(firstname) == 0 or
            len(familyname) == 0 or
            len(gender) == 0 or
            len(city) == 0 or
            len(country) == 0):

            return jsonify({'success': False, 'message': "Form data missing or incorrect type."})
        else: #if all fields are not empty
            #register new user
            user = database_helper.register(email, password, firstname, familyname, gender, city, country)
            #if user is true
            if user is not False:
                return jsonify({'success': True, 'message': "Successfully created a new user."})
            else: #if user is false
                return jsonify({'success': False, 'message': "Something went wrong"})
    else: #if user already exists
        return jsonify({'success': False, 'message': "User already exists"})

#sign out current user
@app.route('/sign-out', methods = ['DELETE'])
def sign_out():
    token = request.headers["Authorization"]
    data = database_helper.tokenToEmail(token)
    print(data)
    if data is not False:
        #if token is in data
        if data['token'] == token:
            database_helper.remove_user(token) #remove user from system
            #return jsonify(database_helper.allLoggedInUsers())
            return jsonify({'success': True, 'message': "Successfully signed out"})
        else: #if token is not in data
            return jsonify({'success': False, 'message': "You are not signed in"})
    else:
        return jsonify({'success': False, 'message': "Sign out failed"})

# change password
@app.route('/change-password',methods = ['PUT'])
def change_password():
    token = request.headers["Authorization"]
    oldPassword = request.json['oldPassword']
    newPassword = request.json['newPassword']

    #if password is less than 4 characters
    if len(newPassword) < 4:
        return json.dumps({'success': False, 'message': "Password must be at least 4 characters long"})


    #change current password to new password
    result = database_helper.change_password(token,newPassword,oldPassword)
    if result: #if result true
        return jsonify({'success': True, 'message': "Password changed"})
    else: #if old password is wrong
        return jsonify({'success': False, 'message': "Wrong old password"})

@app.route('/getdatatoken', methods = ['GET'])
def get_user_data_by_token():
    token = request.headers["Authorization"]
    data = database_helper.tokenToEmail(token)

    #if data is true
    if data is not False:
        #fetch user data by email in data
        result = database_helper.get_user_data_by_email(data['email'])
        return jsonify({'success': True, 'message': "User data retrieved", 'data': result})
    else: #if data is false
        return jsonify({'success': False, 'message': "No such user"})


@app.route('/getdataemail', methods = ['GET'])
def get_user_data_by_email():
    token = request.headers["Authorization"]
    email = request.json['email']
    data = database_helper.tokenToEmail(token)

    # if email in data and token in data
    if data['email'] == email and data['token'] == token:
        #fetch user data by email
        result = database_helper.get_user_data_by_email(email)
        if result:
            return jsonify({'success': True, 'message': "User messages retrieved", 'data': result})
        else:
            return jsonify({'success': False, 'message': "No such user"})
    else: #if email and token not in data
        return jsonify({'success': False, 'message': "No such user"})

@app.route('/getmessagestoken',methods = ['GET'])
def get_user_messages_by_token():
    token = request.headers["Authorization"]
    data = database_helper.tokenToEmail(token)

    #if data is true
    if data is not False:
        #fetch user messages by token
        result = database_helper.get_user_messages_by_token(data['email'])
        return jsonify({'success': True, 'message': "User messages retrieved", 'data': result})
    else: #if data is false
        return jsonify({'success': False, 'message': "No such user"})

@app.route('/getmessagesemail',methods = ['GET'])
def get_user_messages_by_email():
    token = request.headers["Authorization"]
    toEmail = request.json['email']
    data = database_helper.tokenToEmail(token)

    #if data is true
    if data is not False:
        #fetch user messages by email (reciever)
        result = database_helper.get_user_messages_by_email(toEmail)
        if result:
            return jsonify({'success': True, 'message': "User messages retrieved", 'data': result})
        else:
            return jsonify({'success': False, 'message': "No such user"})
    else: #if data is false
        return jsonify({'success': False, 'message': "No such user"})

@app.route('/post-message',methods = ['POST'])
def post_message():
    token = request.headers["Authorization"]
    message = request.json['message']
    toEmail = request.json['email']
    fromEmail = database_helper.tokenToEmail(token)

    #if email sender is true
    if fromEmail is not False:
        #post message
        data = database_helper.post_message(fromEmail['email'], message, toEmail)
        #print messages
        return jsonify(database_helper.print_all_messages(toEmail))
        #return jsonify({'success': True, 'message': "Message posted"})
    else: #if email sender is false
        return jsonify({'success': False, 'message': "No such user"})

# if __name__=='__main__':
#     #app.run()
#     http_server = WSGIServer(('', 5000), app, handler_class=WebSocketHandler)
#     http_server.serve_forever()
