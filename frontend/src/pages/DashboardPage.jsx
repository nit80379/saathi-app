import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { services, bookings } from "../api";
import { Plus, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [myBookings, setMyBookings] = useState([]);
  const [myServices, setMyServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addForm, setAddForm] = useState({ category_id: "", description: "", custom_price: "" });
  const [addError, setAddError] = useState("");

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    const load = async () => {
      try {
        const [bk, cats] = await Promise.all([bookings.mine(), services.categories()]);
        setMyBookings(bk.data);
        setCategories(cats.data);
        if (user.is_agent) {
          const sv = await services.myServices();
          setMyServices(sv.data);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const addService = async () => {
    setAddError("");
    if (!addForm.category_id) { setAddError("Category chunna zaroori hai"); return; }
    try {
      const r = await services.addService({
        category_id: parseInt(addForm.category_id),
        description: addForm.description,
        custom_price: addForm.custom_price ? parseInt(addForm.custom_price) : undefined
      });
      setMyServices(s => [...s, r.data]);
      setAddForm({ category_id: "", description: "", custom_price: "" });
    } catch (e) {
      setAddError(e.response?.data?.error || "Service add nahi ho payi");
    }
  };

  const toggleAvailability = async (service) => {
    await services.updateService(service.id, { is_available: !service.is_available });
    setMyServices(s => s.map(sv => sv.id === service.id ? { ...sv, is_available: !sv.is_available } : sv));
  };

  const deleteService = async (id) => {
    await services.deleteService(id);
    setMyServices(s => s.filter(sv => sv.id !== id));
  };

  const updateBookingStatus = async (id, status) => {
    await bookings.updateStatus(id, status);
    setMyBookings(b => b.map(bk => bk.id === id ? { ...bk, status } : bk));
  };

  if (loading) return <div className="page" style={{ textAlign: "center", paddingTop: "60px" }}>Loading...</div>;

  return (
    <div className="page">
      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "28px" }}>
        <div style={{
          width: "52px", height: "52px", borderRadius: "50%",
          background: "var(--orange)", display: "flex", alignItems: "center",
          justifyContent: "center", color: "white", fontSize: "22px", fontWeight: 700,
          fontFamily: "'Baloo 2', cursive"
        }}>
          {user?.name?.[0]?.toUpperCase()}
        </div>
        <div>
          <h2 style={{ fontSize: "24px" }}>Namaste, {user?.name}! 👋</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
            {user?.area}, {user?.city} — {user?.is_agent ? "🤝 Saathi (Agent)" : "👤 Customer"}
          </p>
        </div>
      </div>

      {/* Agent: Services Section */}
      {user?.is_agent && (
        <div style={{ marginBottom: "36px" }}>
          <h3 style={{ fontSize: "20px", marginBottom: "16px" }}>Meri Services</h3>

          {/* Add Service Form */}
          <div className="card" style={{ marginBottom: "16px", background: "var(--orange-light)", border: "1px solid #FFD0BC" }}>
            <h4 style={{ marginBottom: "14px", fontSize: "16px" }}>+ Nayi Service Add Karo</h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "10px", alignItems: "end" }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Service *</label>
                <select value={addForm.category_id} onChange={e => setAddForm(f => ({ ...f, category_id: e.target.value }))}>
                  <option value="">-- Category Chunno --</option>
                  {categories.filter(c => !myServices.find(s => s.category_id === c.id)).map(c => (
                    <option key={c.id} value={c.id}>{c.name} (₹{c.base_price})</option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label>Custom Price (optional)</label>
                <input type="number" placeholder="Default price rahegi" value={addForm.custom_price}
                  onChange={e => setAddForm(f => ({ ...f, custom_price: e.target.value }))} />
              </div>
              <button className="btn btn-primary" onClick={addService}>
                <Plus size={16} /> Add Karo
              </button>
            </div>
            {addError && <p style={{ color: "#DC2626", fontSize: "13px", marginTop: "8px" }}>⚠️ {addError}</p>}
          </div>

          {myServices.length === 0 ? (
            <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Abhi koi service add nahi ki. Upar se add karo!</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "12px" }}>
              {myServices.map(s => (
                <div key={s.id} className="card" style={{ display: "flex", alignItems: "center", gap: "12px", opacity: s.is_available ? 1 : 0.6 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: "15px" }}>{s.category?.name}</div>
                    <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                      ₹{s.custom_price || s.category?.base_price} {s.category?.unit}
                    </div>
                  </div>
                  <button onClick={() => toggleAvailability(s)} style={{ background: "none", border: "none", cursor: "pointer", color: s.is_available ? "var(--teal)" : "var(--text-muted)" }}>
                    {s.is_available ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                  </button>
                  <button onClick={() => deleteService(s.id)} className="btn btn-danger" style={{ padding: "6px 10px" }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Bookings */}
      <h3 style={{ fontSize: "20px", marginBottom: "16px" }}>
        {user?.is_agent ? "Mujhe Mile Bookings" : "Meri Bookings"}
      </h3>

      {myBookings.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>📋</div>
          <p>Abhi koi booking nahi hai</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {myBookings.map(bk => (
            <div key={bk.id} className="card" style={{ display: "flex", gap: "16px", alignItems: "flex-start", flexWrap: "wrap" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                  <span style={{ fontWeight: 600 }}>{bk.category?.name}</span>
                  <span className={`status-${bk.status}`}>{statusLabel(bk.status)}</span>
                </div>
                <div style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.6 }}>
                  📍 {bk.address}<br />
                  {bk.guest_name && <>👤 {bk.guest_name} — 📞 {bk.guest_phone}<br /></>}
                  💰 ₹{bk.price} | 🕒 {new Date(bk.created_at).toLocaleDateString("hi-IN")}
                </div>
              </div>
              {user?.is_agent && bk.status === "pending" && (
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <button className="btn btn-teal" style={{ fontSize: "13px", padding: "7px 14px" }}
                    onClick={() => updateBookingStatus(bk.id, "accepted")}>
                    ✅ Accept
                  </button>
                  <button className="btn btn-danger" style={{ fontSize: "13px", padding: "7px 14px" }}
                    onClick={() => updateBookingStatus(bk.id, "cancelled")}>
                    ❌ Cancel
                  </button>
                </div>
              )}
              {user?.is_agent && bk.status === "accepted" && (
                <button className="btn btn-primary" style={{ fontSize: "13px", padding: "7px 14px" }}
                  onClick={() => updateBookingStatus(bk.id, "completed")}>
                  🏁 Complete
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function statusLabel(status) {
  const map = { pending: "Pending", accepted: "Accepted", in_progress: "Chal Raha", completed: "Poora", cancelled: "Cancel" };
  return map[status] || status;
}
