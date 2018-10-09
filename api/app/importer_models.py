from app import db
from sqlalchemy.dialects.postgresql import JSON, JSONB
from sqlalchemy import Text

class Country(db.Model):
    __tablename__ = 'country'

    id        = db.Column(db.Integer, primary_key=True)
    factbook  = db.Column(JSONB(astext_type=Text()))

    def __init__(self, factbook, map):
        self.factbook = factbook

    def save(self):
        db.session.add(self)
        db.session.commit()

    @staticmethod
    def get_all():
        return Country.query

    @staticmethod
    def delete_all():
        db.session.query(Country).delete()
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def __repr__(self):
        return "<Country: {}>".format(self.id)

    def serialise(self):

        return  {
                   'id': self.id
                }


