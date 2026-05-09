from datetime import datetime
from extensions import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    phone = db.Column(db.String(15), nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    area = db.Column(db.String(100), nullable=False)
    is_agent = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    services = db.relationship("AgentService", backref="agent", lazy=True)
    bookings_as_customer = db.relationship("Booking", foreign_keys="Booking.customer_id", backref="customer", lazy=True)
    bookings_as_agent = db.relationship("Booking", foreign_keys="Booking.agent_id", backref="agent", lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "city": self.city,
            "area": self.area,
            "is_agent": self.is_agent,
            "created_at": self.created_at.isoformat()
        }


class ServiceCategory(db.Model):
    __tablename__ = "service_categories"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    icon = db.Column(db.String(50))       # icon name e.g. "package", "shield"
    base_price = db.Column(db.Integer, nullable=False)  # in INR
    unit = db.Column(db.String(50))       # e.g. "per trip", "per hour"
    is_active = db.Column(db.Boolean, default=True)

    agent_services = db.relationship("AgentService", backref="category", lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "icon": self.icon,
            "base_price": self.base_price,
            "unit": self.unit
        }


class AgentService(db.Model):
    __tablename__ = "agent_services"
    id = db.Column(db.Integer, primary_key=True)
    agent_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey("service_categories.id"), nullable=False)
    custom_price = db.Column(db.Integer)   # override base price if needed
    is_available = db.Column(db.Boolean, default=True)
    description = db.Column(db.Text)

    def to_dict(self):
        return {
            "id": self.id,
            "agent_id": self.agent_id,
            "category_id": self.category_id,
            "category": self.category.to_dict() if self.category else None,
            "custom_price": self.custom_price,
            "is_available": self.is_available,
            "description": self.description
        }


class Booking(db.Model):
    __tablename__ = "bookings"
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    agent_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey("service_categories.id"), nullable=False)

    # Guest booking (no account needed)
    guest_name = db.Column(db.String(100))
    guest_phone = db.Column(db.String(15))
    guest_email = db.Column(db.String(150))

    address = db.Column(db.Text, nullable=False)
    description = db.Column(db.Text)
    scheduled_at = db.Column(db.DateTime)
    price = db.Column(db.Integer, nullable=False)

    status = db.Column(
        db.Enum("pending", "accepted", "in_progress", "completed", "cancelled"),
        default="pending"
    )
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    category = db.relationship("ServiceCategory", backref="bookings", lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "customer_id": self.customer_id,
            "agent_id": self.agent_id,
            "category": self.category.to_dict() if self.category else None,
            "guest_name": self.guest_name,
            "guest_phone": self.guest_phone,
            "guest_email": self.guest_email,
            "address": self.address,
            "description": self.description,
            "scheduled_at": self.scheduled_at.isoformat() if self.scheduled_at else None,
            "price": self.price,
            "status": self.status,
            "created_at": self.created_at.isoformat()
        }


class Review(db.Model):
    __tablename__ = "reviews"
    id = db.Column(db.Integer, primary_key=True)
    booking_id = db.Column(db.Integer, db.ForeignKey("bookings.id"), nullable=False)
    reviewer_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    agent_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    rating = db.Column(db.Integer, nullable=False)  # 1-5
    comment = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "booking_id": self.booking_id,
            "agent_id": self.agent_id,
            "rating": self.rating,
            "comment": self.comment,
            "created_at": self.created_at.isoformat()
        }
