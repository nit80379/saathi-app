import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { services } from "../api";
import { Phone, Mail, Star, MapPin, Package, Truck, Users, Shield, Home, UtensilsCrossed, Pill, Car } from "lucide-react";
import BookingModal from "../components/BookingModal";

const ICONS = {
  package: Package, "truck-delivery": Truck, walk: Users,
  "shield-check": Shield, home: Home, "tools-kitchen-2": UtensilsCrossed,
  pill: Pill, car: Car
};

export default function SearchPage() {
  const [params] = useSearchParams();
  const [agents, setAgents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [catId, setCatId] = useState("");
  const [bookingAgent, setBookingAgent] = useState(null);

  useEffect(() => {
    services.categories().then(r => setCategories(r.data));
  }, []);

  const search = async () => {
    setLoading(true);
    try {
      const r = await services.agents({ city, area, category_id: catId });
      setAgents(r.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { search(); }, []);

  return (
    <div className="page">
      <h2 style={{ fontSize: "28px", marginBottom: "6px" }}>🔍 Saathi Dhundo</h2>
      <p style={{ color: "var(--text-muted)", marginBottom: "24px" }}>Apne area mein available Saathi dekho</p>

      {/* Filters */}
      <div className="card" style={{ marginBottom: "24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", alignItems: "end" }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Shehar</label>
            <input placeholder="jaise: Delhi, Noida..." value={city} onChange={e => setCity(e.target.value)} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Area / Mohalla</label>
            <input placeholder="jaise: Lajpat Nagar..." value={area} onChange={e => setArea(e.target.value)} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Service</label>
            <select value={catId} onChange={e => setCatId(e.target.value)}>
              <option value="">Sabhi Services</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <button className="btn btn-primary" onClick={search} disabled={loading}>
            {loading ? "Dhundh raha hai..." : "🔍 Search"}
          </button>
        </div>
      </div>

      {/* Results */}
      {agents.length === 0 && !loading && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted)" }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>😔</div>
          <h3 style={{ marginBottom: "8px" }}>Koi Saathi nahi mila</h3>
          <p>Doosre area ya shehar try karo, ya sabhi services dekho</p>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
        {agents.map(agent => (
          <AgentCard key={agent.id} agent={agent} onBook={() => setBookingAgent(agent)} />
        ))}
      </div>

      {bookingAgent && (
        <BookingModal
          agent={bookingAgent}
          categories={categories}
          onClose={() => setBookingAgent(null)}
        />
      )}
    </div>
  );
}

function AgentCard({ agent, onBook }) {
  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{
          width: "48px", height: "48px", borderRadius: "50%",
          background: "var(--orange-light)", display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: "20px", fontWeight: 700, color: "var(--orange)",
          fontFamily: "'Baloo 2', cursive"
        }}>
          {agent.name[0].toUpperCase()}
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: "16px" }}>{agent.name}</div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", color: "var(--text-muted)" }}>
            <MapPin size={12} /> {agent.area}, {agent.city}
          </div>
        </div>
        <span className="badge badge-teal" style={{ marginLeft: "auto" }}>Active</span>
      </div>

      {/* Services */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        {agent.services?.map(s => {
          const Icon = ICONS[s.category?.icon] || Package;
          return (
            <span key={s.id} style={{
              display: "inline-flex", alignItems: "center", gap: "4px",
              background: "var(--orange-light)", color: "var(--orange-dark)",
              padding: "4px 10px", borderRadius: "8px", fontSize: "12px"
            }}>
              <Icon size={12} />
              {s.category?.name} — ₹{s.custom_price || s.category?.base_price}
            </span>
          );
        })}
        {(!agent.services || agent.services.length === 0) && (
          <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>Koi service listed nahi</span>
        )}
      </div>

      {/* Contact */}
      <div style={{ borderTop: "1px solid var(--border)", paddingTop: "12px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <a href={`tel:${agent.phone}`} className="btn btn-teal" style={{ fontSize: "13px", padding: "7px 14px" }}>
          <Phone size={14} /> {agent.phone}
        </a>
        <a href={`mailto:${agent.email}`} className="btn btn-outline" style={{ fontSize: "13px", padding: "7px 14px" }}>
          <Mail size={14} /> Email
        </a>
        <button onClick={onBook} className="btn btn-primary" style={{ fontSize: "13px", padding: "7px 14px", marginLeft: "auto" }}>
          Book Karo
        </button>
      </div>
    </div>
  );
}
