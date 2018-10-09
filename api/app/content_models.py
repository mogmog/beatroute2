from app import db
from app.user_models import User
from sqlalchemy import Text
from sqlalchemy.dialects.postgresql import JSON, JSONB

class Content(db.Model):
    __tablename__ = 'content'

    id = db.Column(db.Integer, primary_key=True)

    type = db.Column(db.String(255))
    title = db.Column(db.String(255))
    url = db.Column(db.String(255))
    created = db.Column(db.DateTime)

    def __init__(self, type, title, url, created):
        self.type = type
        self.title = title
        self.url = url
        self.created = created

    def save(self):
        db.session.add(self)
        db.session.commit()

    @staticmethod
    def get_all():
        return Content.query

    @staticmethod
    def delete_all():
        db.session.query(Content).delete()
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def __repr__(self):
        return "<Content: {}>".format(self.id)

    def serialise(self):

        return  {
                   'id': self.id,
                   'type' : self.type,
                   'title' : self.title,
                   'url' : self.url,
                   'created' : self.created,
                }
