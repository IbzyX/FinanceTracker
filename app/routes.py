from flask import render_template, Blueprint

main = Blueprint('main', __name__)

@main.route('/')
def home_page():
    return render_template('home.html')
