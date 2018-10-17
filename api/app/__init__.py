from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask import request, jsonify, abort, make_response
import os

db = SQLAlchemy()

from instance.config import app_config
from app.story_models import Story
from app.user_models import User, Session

def create_app(config_name):

    app = Flask(__name__)
    app.config.from_object(app_config[config_name])
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # initialize db
    db = SQLAlchemy(app)


    @app.route('/api/real/login/account', methods=['POST'])
    def login():

      password = request.data.get('password', '')
      userName    = request.data.get('userName', '')

      user = User.get_all().filter(User.userName == userName).first()
      print (user)
      if user is not None:
        response = jsonify({'status' : 'ok', 'type' : 'account', 'userId' : user.id, 'currentAuthority': 'admin'})
        loggedinuser = user.id
        session = Session(user.id)
        session.save()

        print ('saved')
        return make_response(response), 200

      return make_response(jsonify({'status': 'error', 'type' : 'account', 'currentAuthority': 'guest'})), 200

    @app.route('/api/real/logout', methods=['POST'])
    def logout():
        Session.delete_all()
        return make_response(jsonify({'status': 'ok'})), 200

    @app.route('/api/real/currentUser', methods=['GET'])
    def currentUser():

        session = Session.get_all().first()

        if session == None:
          return make_response(jsonify({'status': 'ok', 'type' : 'account', 'currentAuthority': 'guest'})), 200

        print (session.userId)
        user = User.get_all().filter(User.id == session.userId).first()

        res = user.serialise()

        response = jsonify(res)
        return make_response(response), 200


    @app.route('/api/real/story', methods=['POST'])
    def create_story():

      userId = request.data.get('userId', 0)
      title = request.data.get('title', 0)

      story = Story(title)
      story.save()

      stories = Story.get_all().all()

      results = []
      for story in stories:
       results.append(story.serialise())

      return make_response(jsonify({ 'list' : results })), 200


    @app.route('/api/real/story', methods=['GET'])
    def list_stories():

      stories = Story.get_all()

      results = []
      for story in stories:
       results.append(story.serialise())

      return make_response(jsonify({ 'list' : results })), 200



    return app


