from flask import Flask, escape, request, redirect
import logging
import requests
import json      

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

app = Flask(__name__)

@app.route('/')
def hello():
    name = request.args.get("name", "World")
    return f'Hello, {escape(name)}!'


@app.route('/upload')
def upload():
    url = 'https://www.strava.com/oauth/authorize?client_id=44623&response_type=code&redirect_uri=http://localhost:5000/upload_activity&approval_prompt=force&scope=read,activity:write'
    logger.info('url = %s' % url)
    return redirect(url)

@app.route('/upload_activity')
def upload_activity():
    logger.info('args are: %s' % request.args)
    data = {'grant_type':'authorization_code',
            'client_id' : '44623',
            'client_secret' : '2b8f90e1995ea9699af363e140f5aeffb5f17939',
            'code' : request.args['code']}
    url = 'http://www.strava.com/oauth/token'
    req = requests.post(url, json=data)
    response_json = req.json()
    logger.info('request url is: %s, data: %s, response: %s' % (url, data, response_json))
    authorization = '%s %s' % (response_json['token_type'], response_json['access_token'])
    url = 'https://www.strava.com/api/v3/uploads'
    headers = {'Authorization': authorization }
    files = {'file': open('output.gpx', 'rb')}
    data = {'name':'upload from api',
            'data_type':'gpx',
            'external_id':'upload_from_api'}
    req = requests.post(url, headers=headers, data=data, files=files)
    response_json = req.json()
    logger.info('upload request url is: %s, response: %s' % (url, response_json))
    activity_id = response_json['id_str']
    return f'Uploaded activiy id: {escape(activity_id)}!'

