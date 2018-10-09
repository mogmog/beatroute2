from app import db

class TargetGroup(db.Model):
    __tablename__ = 'targetgroup'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    countryId = db.Column('countryId', db.Integer, db.ForeignKey('country.id'))
    country = db.relationship("Country")

    def __init__(self, name, countryId):
        self.name = name
        self.countryId = countryId

    def save(self):
        db.session.add(self)
        db.session.commit()

    @staticmethod
    def get_all():
        return TargetGroup.query

    @staticmethod
    def delete_all():
        db.session.query(TargetGroup).delete()
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def __repr__(self):
        return "<TargetGroup: {}>".format(self.id)

    def serialise(self):

        return  {
                   'id': self.id,
                   'name': self.name,
                   'country' : self.country.serialise()
                }

