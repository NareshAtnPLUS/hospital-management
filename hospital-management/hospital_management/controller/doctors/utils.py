from hospital_management import db,bcrypt
from hospital_management.models import Doctors
from flask_login import login_user, logout_user
def register_doctor(req_json,account_type="Doctor"):
    hashed_password = bcrypt.generate_password_hash(req_json["password"]).decode('utf-8')
    user = Doctors(
        first_name = req_json["firstName"],last_name = req_json["lastName"],
        door_no = req_json["address"]["doorNo"],street = req_json["address"]["street"],
        district = req_json["address"]["district"],state = req_json["address"]["state"],
        username = req_json["userName"],email = req_json["email"],
        password = hashed_password,Account_type="Doctor",
        age = req_json["age"],dob=req_json["dob"],
        specialist = req_json["specialist"],qualifications = req_json["qualifications"],
        surgeries = req_json["surgeries"]
    )
    db.session.add(user)
    db.session.commit()
def login_doctor_util(req_json,account_type="Doctor"):
    user = Doctors.query.filter_by(username=req_json["userName"],Account_type=account_type).first()
    if user and bcrypt.check_password_hash(user.password,req_json["password"]):
        login_user(user)
        userObject = { "firstName":user.first_name,"lastName":user.last_name,"userName":user.username }
        return True,userObject
    else:
        return False,"No User Found with given login credentials"
