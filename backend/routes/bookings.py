from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from extensions import db
from models.models import Booking, AgentService, ServiceCategory, User

bookings_bp = Blueprint("bookings", __name__, url_prefix="/api/bookings")


@bookings_bp.route("", methods=["POST"])
def create_booking():
    # Guest ya logged-in dono book kar sakte hain
    try:
        verify_jwt_in_request(optional=True)
        from flask_jwt_extended import get_jwt_identity
        user_id = get_jwt_identity()
    except Exception:
        user_id = None

    data = request.get_json()

    # Validate agent and category
    agent = User.query.filter_by(id=data.get("agent_id"), is_agent=True).first()
    if not agent:
        return jsonify({"error": "Agent nahi mila"}), 404

    cat = ServiceCategory.query.get(data.get("category_id"))
    if not cat:
        return jsonify({"error": "Service category nahi mili"}), 404

    if not data.get("address"):
        return jsonify({"error": "Address daalna zaroori hai"}), 400

    # Guest validation
    if not user_id:
        if not data.get("guest_name") or not data.get("guest_phone"):
            return jsonify({"error": "Guest ke liye naam aur phone zaroori hai"}), 400

    price = data.get("price", cat.base_price)

    booking = Booking(
        customer_id=int(user_id) if user_id else None,
        agent_id=data["agent_id"],
        category_id=data["category_id"],
        guest_name=data.get("guest_name"),
        guest_phone=data.get("guest_phone"),
        guest_email=data.get("guest_email"),
        address=data["address"],
        description=data.get("description"),
        price=price,
        status="pending"
    )
    db.session.add(booking)
    db.session.commit()
    return jsonify(booking.to_dict()), 201


@bookings_bp.route("/my", methods=["GET"])
@jwt_required()
def my_bookings():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if user.is_agent:
        bookings = Booking.query.filter_by(agent_id=user_id).order_by(Booking.created_at.desc()).all()
    else:
        bookings = Booking.query.filter_by(customer_id=user_id).order_by(Booking.created_at.desc()).all()

    return jsonify([b.to_dict() for b in bookings]), 200


@bookings_bp.route("/<int:bid>/status", methods=["PUT"])
@jwt_required()
def update_status(bid):
    user_id = get_jwt_identity()
    booking = Booking.query.get(bid)
    if not booking:
        return jsonify({"error": "Booking nahi mili"}), 404

    if str(booking.agent_id) != str(user_id):
        return jsonify({"error": "Sirf assigned agent hi status change kar sakta hai"}), 403

    data = request.get_json()
    valid_statuses = ["accepted", "in_progress", "completed", "cancelled"]
    if data.get("status") not in valid_statuses:
        return jsonify({"error": "Invalid status"}), 400

    booking.status = data["status"]
    db.session.commit()
    return jsonify(booking.to_dict()), 200
