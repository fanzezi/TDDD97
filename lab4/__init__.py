from flask import Flask
import Twidder.server
from gevent.pywsgi import WSGIServer
from geventwebsocket.handler import WebSocketHandler
from Twidder.server import app

#app = Flask(__name__)
if __name__=='__main__':
    #app.run()
    http_server = WSGIServer(('', 5000), app, handler_class=WebSocketHandler)
    http_server.serve_forever()
