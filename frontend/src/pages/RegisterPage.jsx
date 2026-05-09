import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const isAgent = params.get("agent") === "true";

  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "",
    city: "", area: "", is_agent: isAgent
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    setError("");
    const required = ["name", "email", "phone", "password", "city", "area"];
    if (required.some(k => !form[k])) {
      setError("Sabhi starred (*) fields bharna zaroori hai");
      return;
    }
    setLoading(true);
    try {
      await register(form);
      navigate("/dashboard");
    } catch (e) {
      setError(e.response?.data?.error || "Registration nahi ho payi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page" style={{ maxWidth: "480px" }}>
      <div className="card" style={{ marginTop: "30px" }}>
        <h2 style={{ fontSize: "26px", marginBottom: "6px", textAlign: "center" }}>
          {form.is_agent ? "Saathi Bano! 🤝" : "Account Banao"}
        </h2>
        <p style={{ color: "var(--text-muted)", textAlign: "center", marginBottom: "20px" }}>
          {form.is_agent ? "Services offer karo, paise kamao" : "Service lo, tracking karo"}
        </p>

        {/* Toggle Customer/Agent */}
        <div style={{ display: "flex", background: "var(--bg)", borderRadius: "10px", padding: "4px", marginBottom: "20px" }}>
          {[
            { label: "👤 Customer", val: false },
            { label: "🤝 Saathi (Agent)", val: true }
          ].map(({ label, val }) => (
            <button key={String(val)} onClick={() => set("is_agent", val)}
              style={{
                flex: 1, padding: "9px", border: "none", cursor: "pointer", borderRadius: "8px", fontSize: "14px",
                fontFamily: "'Hind', sans-serif", fontWeight: 500, transition: "all 0.2s",
                background: form.is_agent === val ? "var(--orange)" : "transparent",
                color: form.is_agent === val ? "white" : "var(--text-muted)"
              }}>
              {label}
            </button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px" }}>
          <div className="form-group" style={{ gridColumn: "1/-1" }}>
            <label>Poora Naam *</label>
            <input placeholder="Aapka naam" value={form.name} onChange={e => set("name", e.target.value)} />
          </div>
          <div className="form-group">
            <label>Email *</label>
            <input type="email" placeholder="email@example.com" value={form.email} onChange={e => set("email", e.target.value)} />
          </div>
          <div className="form-group">
            <label>Phone *</label>
            <input placeholder="10 digit" value={form.phone} onChange={e => set("phone", e.target.value)} />
          </div>
          <div className="form-group">
            <label>Shehar *</label>
            <input placeholder="jaise: Delhi" value={form.city} onChange={e => set("city", e.target.value)} />
          </div>
          <div className="form-group">
            <label>Area / Mohalla *</label>
            <input placeholder="jaise: Lajpat Nagar" value={form.area} onChange={e => set("area", e.target.value)} />
          </div>
          <div className="form-group" style={{ gridColumn: "1/-1" }}>
            <label>Password *</label>
            <input type="password" placeholder="Minimum 6 characters" value={form.password} onChange={e => set("password", e.target.value)} />
          </div>
        </div>

        {form.is_agent && (
          <div style={{ background: "var(--teal-light)", borderRadius: "10px", padding: "12px 16px", marginBottom: "16px", fontSize: "13px", color: "var(--teal)" }}>
            🤝 Saathi banne ke baad Dashboard mein jaake apni services add karo
          </div>
        )}

        {error && (
          <div style={{ background: "#FEE2E2", color: "#DC2626", padding: "10px 14px", borderRadius: "8px", marginBottom: "14px", fontSize: "14px" }}>
            ⚠️ {error}
          </div>
        )}

        <button className="btn btn-primary" onClick={submit} disabled={loading} style={{ width: "100%", justifyContent: "center", padding: "12px", fontSize: "16px" }}>
          {loading ? "Account ban raha hai..." : "✅ Register Karo"}
        </button>

        <p style={{ textAlign: "center", marginTop: "16px", fontSize: "14px", color: "var(--text-muted)" }}>
          Pehle se account hai? <Link to="/login" style={{ color: "var(--orange)", fontWeight: 600 }}>Login Karo</Link>
        </p>
      </div>
    </div>
  );
}
