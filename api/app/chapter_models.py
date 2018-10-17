from app import db

from sqlalchemy import Text

from sqlalchemy.dialects.postgresql import JSON, JSONB

class Chapter(db.Model):
    __tablename__ = 'chapter'

    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(JSONB(astext_type=Text()))
    storyId = db.Column('storyId', db.Integer, db.ForeignKey('story.id'))

    def __init__(self, description):
        self.description = description

    def save(self):
        db.session.add(self)
        db.session.commit()

    @staticmethod
    def get_all():
        return Chapter.query

    @staticmethod
    def delete_all():
        db.session.query(Chapter).delete()
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def __repr__(self):
        return "<Chapter: {}>".format(self.id)

    def serialise(self):

        return  {
                   'id': self.id,
                   'description' : self.description
                }



