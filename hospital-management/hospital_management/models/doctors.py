from datetime import datetime,timedelta
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer
from hospital_management import db, login_manager, webapp
from flask_login import UserMixin

@login_manager.user_loader
def load_user(user_id):
    return Doctors.query.get(int(user_id))

class Doctors(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(20),nullable=False)    
    last_name = db.Column(db.String(20),nullable=False)
    door_no = db.Column(db.String(3),nullable=False)    
    street = db.Column(db.String(70),nullable=False)
    district = db.Column(db.String(20),nullable=False)
    state = db.Column(db.String(20),nullable=False)
    username = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)
    specialist = db.Column(db.String(15),nullable=False)
    qualifications = db.Column(db.String(20),nullable=False)
    surgeries = db.Column(db.String(20),nullable=False)
    age = db.Column(db.String(5),nullable=False)
    dob = db.Column(db.String(100),nullable=False)
    Account_type = db.Column(db.String(20),nullable = False)


    def get_reset_token(self,expires_sec = 1800):
        s = Serializer(webapp.config['SECRET_KEY'],expires_sec)
        return s.dumps({str(id):self.id}).decode('utf-8')
    
    @staticmethod
    def verify_reset_token(user_id):
        s = Serializer(webapp.config['SECRET_KEY'])
        try:
            user_id = s.loads(token)['user_id']
        except:
            return None
        return User.query.get(user_id)