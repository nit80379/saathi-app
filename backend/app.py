from flask import Flask, jsonify
from extensions import db, jwt, cors
from config.config import Config


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Init extensions
    db.init_app(app)
    jwt.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}})

    # Register blueprints
    from routes.auth import auth_bp
    from routes.services import services_bp
    from routes.bookings import bookings_bp
    from routes.reviews import reviews_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(services_bp)
    app.register_blueprint(bookings_bp)
    app.register_blueprint(reviews_bp)

    # Health check
    @app.route("/")
    def health():
        return jsonify({"status": "ok", "app": "Saathi API"}), 200

    # Create tables + seed categories
    with app.app_context():
        db.create_all()
        seed_categories()

    return app


def seed_categories():
    from models.models import ServiceCategory
    if ServiceCategory.query.count() > 0:
        return

    categories = [
        {
            "name": "Saman Uthana",
            "description": "Bhari cheezein uthane mein madad — groceries, luggage, boxes",
            "icon": "package",
            "base_price": 100,
            "unit": "per trip"
        },
        {
            "name": "Saman Pahunchana",
            "description": "Kisi jagah saman drop karna ya deliver karna",
            "icon": "truck-delivery",
            "base_price": 100,
            "unit": "per trip"
        },
        {
            "name": "Saath Chalna (Safar)",
            "description": "Shopping, hospital, station — saath aana aur madad karna",
            "icon": "walk",
            "base_price": 200,
            "unit": "per hour"
        },
        {
            "name": "Body Guard / Suraksha",
            "description": "Personal security ke liye saath rehna",
            "icon": "shield-check",
            "base_price": 300,
            "unit": "per hour"
        },
        {
            "name": "Ghar Ka Kaam",
            "description": "Saaf safai, bartan, kapde — chhota mota ghar ka kaam",
            "icon": "home",
            "base_price": 150,
            "unit": "per hour"
        },
        {
            "name": "Khaana Lana",
            "description": "Restaurant ya dukaan se khana laana",
            "icon": "tools-kitchen-2",
            "base_price": 80,
            "unit": "per trip"
        },
        {
            "name": "Dawa Lana",
            "description": "Medical store se dawai laana",
            "icon": "pill",
            "base_price": 80,
            "unit": "per trip"
        },
        {
            "name": "Auto / Cab Book Karna",
            "description": "Transport book karne mein help karna ya saath aana",
            "icon": "car",
            "base_price": 100,
            "unit": "per task"
        },
    ]

    for c in categories:
        cat = ServiceCategory(**c)
        db.session.add(cat)
    db.session.commit()


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5000)
