from hospital_management import db,bcrypt
from hospital_management.models import Users
from flask_login import login_user, logout_user
def register_user(req_json):
    hashed_password = bcrypt.generate_password_hash(req_json["password"]).decode('utf-8')
    diseases = []
    for diesease in req_json["diseases"]:
        if diesease is not None:diseases.append(diesease)
    disea = ",".join(diseases) if len(diseases) >1 else diseases[0]
    print(disea)     
    user = Users(
        first_name = req_json["firstName"],last_name = req_json["lastName"],
        door_no = req_json["address"]["doorNo"],street = req_json["address"]["street"],
        district = req_json["address"]["district"],state = req_json["address"]["state"],
        username = req_json["userName"],email = req_json["email"],
        password = hashed_password,Account_type="User",
        age = req_json["age"],dob=req_json["dob"],
        diseases = disea,height = req_json["height"],weight=req_json["weight"]
    )
    db.session.add(user)
    db.session.commit()
def login_user_util(req_json,account_type="User"):
    user = Users.query.filter_by(username=req_json["userName"],Account_type=account_type).first()
    if user and bcrypt.check_password_hash(user.password,req_json["password"]):
        login_user(user)
        userObject = { "firstName":user.first_name,"lastName":user.last_name,
                "userName":user.username,"height":user.height,"weight":user.weight,
                "account_type":user.Account_type,"diseases":user.diseases,
                "door_no":user.door_no,"street":user.street,"state":user.state,"email":user.email,
                "age":user.age }
        return True,userObject
    else:
        return False,"No User Found with given login credentials"
