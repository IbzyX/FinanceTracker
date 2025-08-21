from flask import render_template, Blueprint, request, redirect, flash, session, url_for
from flask_login import login_user, logout_user, login_required, current_user
from app import db
from app.models import User

main = Blueprint('main', __name__)

@main.route('/')
def home_page():
    return render_template('home.html')

@main.route('/dashboard')
def dashboard_page():
    return render_template('dashboard.html')




@main.route('/authen')
def authen_page():
    return render_template('authen.html')

# --- Profile : SIGNUP ---
@main.route('/signup', methods=['POST'])
def signup():
    email = request.form.get('email')
    password = request.form.get('password')
    username = request.form.get('username')

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        flash("User already exists.", "error")
        return redirect(url_for('main.authen_page') + '#login')

    new_user = User(email=email, username=username)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    flash("Signup successful! You can now log in.", "success")
    return redirect(url_for('main.authen_page') + '#login')


# --- Profile : LOGIN ---
@main.route('/login', methods=['POST'])
def login():
    email = request.form.get('email')
    password = request.form.get('password')

    user = User.query.filter_by(email=email).first()
    if user and user.check_password(password):
        login_user(user)
        flash("Logged in successfully.", "success")
        return redirect(url_for('main.dashboard_page'))

    flash("Invalid email or password.", "error")
    return redirect(url_for('main.authen_page') + '#login')


# --- Logout ---
@main.route('/logout')
def logout():
    logout_user()
    flash("You have been logged out.", "logout")
    return redirect(url_for('main.home_page'))