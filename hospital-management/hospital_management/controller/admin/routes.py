from flask import Blueprint,render_template,jsonify, url_for, flash, redirect, request
from datetime import datetime, timedelta
from hospital_management import webapp, db, bcrypt
from flask_login import login_user, current_user, logout_user, login_required
from hospital_management.models import Users

admin = Blueprint('admin',__name__)


@admin.route("/home")
def home():
    return jsonify({"message":"Hello World"})
