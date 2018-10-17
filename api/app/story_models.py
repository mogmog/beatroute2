from app import db

from app.chapter_models import Chapter

from sqlalchemy import Text

from sqlalchemy.dialects.postgresql import JSON, JSONB

class Story(db.Model):
    __tablename__ = 'story'

    id          = db.Column(db.Integer, primary_key=True)
    title       = db.Column(db.String(255))
    description = db.Column(JSONB(astext_type=Text()))
    chapters    = db.relationship("Chapter")

    def __init__(self, title ):
        self.title = title

    def save(self):
        db.session.add(self)
        db.session.commit()

    @staticmethod
    def get_all():
        return Story.query

    @staticmethod
    def delete_all():
        db.session.query(Story).delete()
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def __repr__(self):
        return "<Story: {}>".format(self.id)

    def serialise(self):

      results = []
      for chapter in self.chapters:
       results.append(chapter.serialise())

      return  {
                'id': self.id,
                'title' : self.title,
                'description' : self.description,
                'chapters' : results
              }



