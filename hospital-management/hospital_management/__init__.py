import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand

MySQLDataBase = {
    'user': 'root',
    'pw': 'nplus12.3',
    'db': 'hospital_management',
    'host': 'localhost',
    'port': '3306',
}
webapp = Flask(__name__)
CORS(webapp)
webapp.config['SECRET_KEY'] = '5791628bb0b13ce0c676dfde280ba245'
webapp.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://%(user)s:\
%(pw)s@%(host)s:%(port)s/%(db)s' % MySQLDataBase
db = SQLAlchemy(webapp)
bcrypt = Bcrypt(webapp)
login_manager = LoginManager(webapp)
# migrate = Migrate(webapp, db)
# manager = Manager(webapp)
# manager.add_command('db', MigrateCommand)
# manager.add_command('debugserver',webapp.run(debug=True))
from hospital_management.controller.users.routes import users
from hospital_management.controller.doctors.routes import doctors
from hospital_management.controller.admin.routes import admin
webapp.register_blueprint(users,url_prefix='/user')
webapp.register_blueprint(doctors,url_prefix='/doctor')
webapp.register_blueprint(admin,url_prefix='/admin')
