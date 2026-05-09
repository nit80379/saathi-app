from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from extensions import db
from models.models import Review, Booking, User
from sqlalchemy import func

reviews_bp = Blueprint("reviews", __name__, url_prefix="/api/reviews")


@reviews_bp.route("/agent/<int:agent_id>", methods=["GET"])
def get_agent_reviews(agent_id):
    reviews = Review.query.filter_by(agent_id=agent_id).order_by(Review.created_at.desc()).all()
    avg = db.session.query(func.avg(Review.rating)).filter_by(agent_id=agent_id).scalar()
    return jsonify({
        "reviews": [r.to_dict() for r in reviews],
        "average_rating": round(float(avg), 1) if avg else 0,
        "total": len(reviews)
    }), 200


@reviews_bp.route("", methods=["POST"])
def add_review():
    try:
        verify_jwt_in_request(optional=True)
        from flask_jwt_extended import get_jwt_identity
        user_id = get_jwt_identity()
    except Exception:
        user_id = None

    data = request.get_json()
    booking = Booking.query.get(data.get("booking_id"))
    if not booking or booking.status != "completed":
        return jsonify({"error": "Completed booking par hi review de sakte ho"}), 400

    if not (1 <= int(data.get("rating", 0)) <= 5):
        return jsonify({"error": "Rating 1 se 5 ke beech honi chahiye"}), 400

    review = Review(
        booking_id=booking.id,
        reviewer_id=int(user_id) if user_id else None,
        agent_id=booking.agent_id,
        rating=data["rating"],
        comment=data.get("comment")
    )
    db.session.add(review)
    db.session.commit()
    return jsonify(review.to_dict()), 201
