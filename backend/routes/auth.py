from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from extensions import db
from models.models import User

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    required = ["name", "email", "phone", "password", "city", "area"]
    if not all(k in data for k in required):
        return jsonify({"error": "Sabhi fields bharna zaroori hai"}), 400

    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "Yeh email already registered hai"}), 409

    user = User(
        name=data["name"],
        email=data["email"],
        phone=data["phone"],
        city=data["city"],
        area=data["area"],
        is_agent=data.get("is_agent", False)
    )
    user.set_password(data["password"])
    db.session.add(user)
    db.session.commit()

    token = create_access_token(identity=str(user.id))
    return jsonify({"token": token, "user": user.to_dict()}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data.get("email")).first()
    if not user or not user.check_password(data.get("password", "")):
        return jsonify({"error": "Email ya password galat hai"}), 401

    token = create_access_token(identity=str(user.id))
    return jsonify({"token": token, "user": user.to_dict()}), 200


@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User nahi mila"}), 404
    return jsonify(user.to_dict()), 200


@auth_bp.route("/me", methods=["PUT"])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User nahi mila"}), 404

    data = request.get_json()
    for field in ["name", "phone", "city", "area"]:
        if field in data:
            setattr(user, field, data[field])

    db.session.commit()
    return jsonify(user.to_dict()), 200
