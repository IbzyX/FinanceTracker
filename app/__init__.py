from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager
import os
from config import Config
from dotenv import load_dotenv


print("Loaded DB URI: ", os.getenv("DATABASE_URL"))

load_dotenv()

db = SQLAlchemy()
migrate = Migrate()
login_manager = LoginManager()

login_manager.login_view = 'main.authen_page'


def create_app():
    app = Flask(__name__)

    app.config.from_object('config.Config')
    app.secret_key = app.config["SECRET_KEY"]

    db.init_app(app)
    migrate.init_app(app, db)
    login_manager.init_app(app)

    from app.models import User

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))
    
    with app.app_context():
        db.create_all()



    from app.routes import main
    app.register_blueprint(main)
    return app 
