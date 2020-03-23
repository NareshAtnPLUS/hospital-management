from flask import Blueprint,render_template,jsonify,url_for, flash, redirect, request
from hospital_management import webapp,db,bcrypt
from hospital_management.models import Users
from flask_login import login_user, current_user, logout_user, login_required
from .utils import *
users = Blueprint('users',__name__)

@users.route("/home")
def home():
    return jsonify({"message":"Hello World!"})


@users.route("/register",methods=['GET', 'POST'])
def register():
    if request.method == "POST":
        print(request.json)
        register_user(request.json)
        return jsonify({
            "success":True
            })
@users.route("/authenticate",methods=['GET', 'POST'])
def login():
    if request.method == "POST":
        login_util,user = login_user_util(request.json,account_type="User")
        if login_util:
            return jsonify({
                "success":True,
                "user":user
                })
        else:
            return jsonify({
                "success":False
                })