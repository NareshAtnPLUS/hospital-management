from flask import Blueprint,render_template,jsonify, url_for, flash, redirect, request
from datetime import datetime, timedelta
from hospital_management import webapp, db, bcrypt
from flask_login import login_user, current_user, logout_user, login_required
from .utils import *
from datetime import datetime
doctors = Blueprint('doctors',__name__)


@doctors.route("/home")
def home():
    return jsonify({"message":"Hello World"})
@doctors.route("/getDoctors")
def list_doctors():
    return jsonify({"doctors":query_doctors()})
@doctors.route("/getAppointments/<doctorName>")
def list_appointments(doctorName):
    return jsonify({"appointments":query_appointments(doctorName)})
@doctors.route("/register_appointment",methods=['GET', 'POST'])
def add_appointment():
    appointment_fixing_time = datetime.now()

    time_stamp = appointment_fixing_time.strftime("%d/%m/%Y %H:%M:%S")
    if book_appointment(request.json,time_stamp):
        return jsonify({"success":True})
    else:
        return jsonify({"success":False})
@doctors.route("/register",methods=['GET', 'POST'])
def register():
    if request.method == "POST":
        print(request.json)
        register_doctor(request.json)
        return jsonify({
            "success":True
            })
@doctors.route("/authenticate",methods=['GET', 'POST'])
def login():
    if request.method == "POST":
        login_util,user = login_doctor_util(request.json)
        if login_util:
            return jsonify({
                "success":True,
                "user":user
                })
        else:
            return jsonify({
                "success":False
                })