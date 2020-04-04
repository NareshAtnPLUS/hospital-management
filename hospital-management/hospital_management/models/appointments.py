from hospital_management import db

class Appoinments(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_username = db.Column(db.String(20),nullable=False)    
    doctor_username = db.Column(db.String(20),nullable=False)
    patient_age = db.Column(db.String(5),nullable=False)
    appointment_time = db.Column(db.String(20),nullable=False)
    visit_date =  db.Column(db.String(20),nullable=False)
    visit_time =  db.Column(db.String(20),nullable=False)
    end_time =  db.Column(db.String(20),nullable=False)
    reason = db.Column(db.String(20),nullable=False)
    reason_description = db.Column(db.String(100),nullable=False)
