from hospital_management import db,bcrypt
from hospital_management.models import Doctors,Appoinments
from flask_login import login_user, logout_user
from datetime import datetime,timedelta
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
        userObject = { "firstName":user.first_name,"lastName":user.last_name,
                "userName":user.username,"qualifications":user.qualifications,"specialist":user.specialist,
                "account_type":user.Account_type,"no_of_surgeries":user.surgeries,
                "door_no":user.door_no,"street":user.street,"state":user.state,"email":user.email,
                "age":user.age }
        return True,userObject
    else:
        return False,"No User Found with given login credentials"

def query_doctors():
    doctors = Doctors.query.all()
    doctorsList = []
    for doctor in doctors:
        doctorObject = { "firstName":doctor.first_name,"lastName":doctor.last_name,
                "qualifications":doctor.qualifications,"specialist":doctor.specialist,
                "no_of_surgeries":doctor.surgeries,"email":doctor.email,
                "userName":doctor.username }
        doctorsList.append(doctorObject)
    return doctorsList
def query_appointments(doctor):
    appointments = Appoinments.query.filter_by(doctor_username=doctor).all()
    appointmentList = []
    for appointment in appointments:    
        appointmentObject={
            "patientUsername":appointment.patient_username,"patientAge":appointment.patient_age,
            "appointmentGivenTime":appointment.appointment_time,
            "appointmentDate":appointment.visit_date,"appointmentTime":appointment.visit_time,
            "appointmentEndTime":appointment.end_time,"reason":appointment.reason,
            "reasonDescription":appointment.reason_description
        }; appointmentList.append(appointmentObject)
    return appointmentList
def book_appointment(patient_request,time_stamp):
    appointment_date_str = patient_request["appointmentDate"][:10]
    appointment_date = datetime.strptime(appointment_date_str,'%m/%d/%Y')
    appointments = Appoinments.query.filter_by(doctor_username=patient_request["doctorName"]).all()
    print((appointments),patient_request["doctorName"],appointment_date,patient_request )
    if len(appointments)>=1: 
        appointment = appointments[-1]
        print(appointments)
        appointment_time_visit = appointment.end_time
        appointment_time_visit = datetime.strptime(appointment_time_visit,'%Y-%m-%d %H:%M:%S')
        appointment_time_end =  appointment_time_visit + timedelta(minutes=15)
    else:
        appointment_date = datetime.strptime(appointment_date_str,'%m/%d/%Y')
        appointment_time_visit   = appointment_date + timedelta(hours=9)
        appointment_time_end = appointment_date  + timedelta(hours=9,minutes=15)
    appointment = Appoinments(
        patient_username = patient_request["patientUsername"],doctor_username = patient_request["doctorName"],
        patient_age = patient_request["patientAge"]  ,appointment_time = time_stamp,
        visit_date = appointment_date_str   ,visit_time=appointment_time_visit,end_time=appointment_time_end,
        reason = patient_request["reason"],reason_description = patient_request["reasonDescription"]
    )
    db.session.add(appointment)
    db.session.commit()
    return True