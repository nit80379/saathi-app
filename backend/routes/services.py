from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from extensions import db
from models.models import ServiceCategory, AgentService, User

services_bp = Blueprint("services", __name__, url_prefix="/api/services")


@services_bp.route("/categories", methods=["GET"])
def get_categories():
    cats = ServiceCategory.query.filter_by(is_active=True).all()
    return jsonify([c.to_dict() for c in cats]), 200


@services_bp.route("/agents", methods=["GET"])
def get_agents():
    city = request.args.get("city")
    area = request.args.get("area")
    category_id = request.args.get("category_id")

    query = User.query.filter_by(is_agent=True, is_active=True)
    if city:
        query = query.filter(User.city.ilike(f"%{city}%"))
    if area:
        query = query.filter(User.area.ilike(f"%{area}%"))

    agents = query.all()

    result = []
    for agent in agents:
        agent_data = agent.to_dict()
        agent_services = AgentService.query.filter_by(agent_id=agent.id, is_available=True)
        if category_id:
            agent_services = agent_services.filter_by(category_id=category_id)
        agent_services = agent_services.all()
        if category_id and not agent_services:
            continue
        agent_data["services"] = [s.to_dict() for s in agent_services]
        result.append(agent_data)

    return jsonify(result), 200


@services_bp.route("/agent-services", methods=["GET"])
@jwt_required()
def get_my_services():
    user_id = get_jwt_identity()
    services = AgentService.query.filter_by(agent_id=user_id).all()
    return jsonify([s.to_dict() for s in services]), 200


@services_bp.route("/agent-services", methods=["POST"])
@jwt_required()
def add_service():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user or not user.is_agent:
        return jsonify({"error": "Sirf agents hi service add kar sakte hain"}), 403

    data = request.get_json()
    if not data.get("category_id"):
        return jsonify({"error": "Category select karo"}), 400

    existing = AgentService.query.filter_by(
        agent_id=user_id, category_id=data["category_id"]
    ).first()
    if existing:
        return jsonify({"error": "Yeh service already add hai"}), 409

    service = AgentService(
        agent_id=user_id,
        category_id=data["category_id"],
        custom_price=data.get("custom_price"),
        description=data.get("description"),
        is_available=True
    )
    db.session.add(service)
    db.session.commit()
    return jsonify(service.to_dict()), 201


@services_bp.route("/agent-services/<int:sid>", methods=["PUT"])
@jwt_required()
def update_service(sid):
    user_id = get_jwt_identity()
    service = AgentService.query.filter_by(id=sid, agent_id=user_id).first()
    if not service:
        return jsonify({"error": "Service nahi mili"}), 404

    data = request.get_json()
    for field in ["custom_price", "description", "is_available"]:
        if field in data:
            setattr(service, field, data[field])

    db.session.commit()
    return jsonify(service.to_dict()), 200


@services_bp.route("/agent-services/<int:sid>", methods=["DELETE"])
@jwt_required()
def delete_service(sid):
    user_id = get_jwt_identity()
    service = AgentService.query.filter_by(id=sid, agent_id=user_id).first()
    if not service:
        return jsonify({"error": "Service nahi mili"}), 404

    db.session.delete(service)
    db.session.commit()
    return jsonify({"message": "Service hata di"}), 200
