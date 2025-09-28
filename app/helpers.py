from functools import wraps
from flask import session, redirect, url_for, flash
import json 
import os 

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
USERS_FILE = os.path.join(BASE_DIR, 'users.json')

def load_users():
    if not os.path.exist(USERS_FILE):
        return{}
    with open(USERS_FILE, 'r') as f:
        return json.load(f)
    
    def save_users(users):
        with open(USERS_FILE, 'w') as f:
            json.dump(users, f, indent=2)

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user' not in session:
            flash("Login required to access this page.")
            return redirect(url_for('main.profile_page') + '#login')
        return f(*args, **kwargs)
    return decorated_function