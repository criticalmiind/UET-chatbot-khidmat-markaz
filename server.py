#!/usr/bin/env python
from flask import Flask, jsonify, abort, request, make_response, url_for
import base64

app = Flask(__name__)

@app.errorhandler(404)
def page_not_found():
    return "404 not found", 404

# Import the routes from all controllers
@app.route('/', methods=['POST'])
def base64_into_blob():
    if not request.json or 'base64' not in request.json:
        return ""
    base64_string = request.json['base64']
    data = base64.b64decode(base64_string.encode("utf-8"))
    return data
app.run(debug=True, host="192.168.1.193", port=8000)