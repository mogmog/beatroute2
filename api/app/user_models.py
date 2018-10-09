from app import db

class Session(db.Model):
    __tablename__ = 'session'

    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.String(255))

    def __init__(self, userId):
        self.userId = userId

    def save(self):
        db.session.add(self)
        db.session.commit()

    @staticmethod
    def get_all():
        return Session.query

    @staticmethod
    def delete_all():
        db.session.query(Session).delete()
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def __repr__(self):
        return "<Session: {}>".format(self.id)

    def serialise(self):

        return  {
                   'id': self.id,
                   'userId': self.userId
                }


association_table = db.Table('userXCountry', db.Model.metadata,
    db.Column('userId', db.Integer, db.ForeignKey('user.id')),
    db.Column('countryId', db.Integer, db.ForeignKey('country.id'))
)

class User(db.Model):
    __tablename__ = 'user'

    id        = db.Column(db.Integer, primary_key=True)
    userName  = db.Column(db.String(255))
    countries = db.relationship("Country", secondary=association_table)

    def __init__(self, userName):
        self.userName = userName

    def save(self):
        db.session.add(self)
        db.session.commit()

    @staticmethod
    def get_all():
        return User.query

    @staticmethod
    def delete_all():
        db.session.query(User).delete()
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def __repr__(self):
        return "<User: {}>".format(self.id)

    def serialise(self):

        return  {
                   'userid': self.id,
                   'notifyCount': 3,
                   'isAdmin' : True,
                   'countries' : len(self.countries),
                   'name' : self.userName,
                   'avatar': 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
                }
