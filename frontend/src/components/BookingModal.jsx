import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { bookings, services } from "../api";
import { useAuth } from "../context/AuthContext";

export default function BookingModal({ agent, categories, onClose }) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    category_id: "",
    address: "",
    description: "",
    guest_name: "",
    guest_phone: "",
    guest_email: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const agentCatIds = agent.services?.map(s => s.category_id) || [];
  const availableCats = categories.filter(c => agentCatIds.includes(c.id));

  const selectedCat = categories.find(c => c.id === parseInt(form.category_id));

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    setError("");
    if (!form.category_id || !form.address) {
      setError("Service aur address zaroori hai");
      return;
    }
    if (!user && (!form.guest_name || !form.guest_phone)) {
      setError("Apna naam aur phone number daalo");
      return;
    }
    setLoading(true);
    try {
      await bookings.create({
        agent_id: agent.id,
        category_id: parseInt(form.category_id),
        address: form.address,
        description: form.description,
        guest_name: form.guest_name || undefined,
        guest_phone: form.guest_phone || undefined,
        guest_email: form.guest_email || undefined,
        price: selectedCat?.base_price || 100,
      });
      setSuccess(true);
    } catch (e) {
      setError(e.response?.data?.error || "Kuch gadbad ho gayi, dobara try karo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 999, padding: "16px"
    }}>
      <div className="card" style={{ width: "100%", maxWidth: "480px", maxHeight: "90vh", overflowY: "auto", position: "relative" }}>
        <button onClick={onClose} style={{
          position: "absolute", top: "16px", right: "16px",
          background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)"
        }}>
          <X size={20} />
        </button>

        {success ? (
          <div style={{ textAlign: "center", padding: "30px 0" }}>
            <div style={{ fontSize: "56px", marginBottom: "16px" }}>✅</div>
            <h3 style={{ fontSize: "22px", marginBottom: "8px" }}>Booking Ho Gayi!</h3>
            <p style={{ color: "var(--text-muted)", marginBottom: "24px" }}>
              {agent.name} ko aapki request bhej di gayi hai. Wo jald hi contact karenge.
            </p>
            <p style={{ fontSize: "13px", background: "var(--teal-light)", color: "var(--teal)", padding: "10px 16px", borderRadius: "8px" }}>
              📞 Direct contact bhi kar sakte ho: <strong>{agent.phone}</strong>
            </p>
            <button className="btn btn-primary" onClick={onClose} style={{ marginTop: "20px" }}>
              Theek Hai
            </button>
          </div>
        ) : (
          <>
            <h3 style={{ fontSize: "20px", marginBottom: "4px", paddingRight: "30px" }}>
              {agent.name} se Book Karo
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "20px" }}>
              {agent.area}, {agent.city}
            </p>

            {!user && (
              <div style={{ background: "var(--blue-light)", borderRadius: "10px", padding: "12px 16px", marginBottom: "16px", fontSize: "13px", color: "var(--blue)" }}>
                ℹ️ Account ke bina bhi book kar sakte ho — bas apna naam aur phone daalo
              </div>
            )}

            <div className="form-group">
              <label>Service Chunno *</label>
              <select value={form.category_id} onChange={e => set("category_id", e.target.value)}>
                <option value="">-- Service Select Karo --</option>
                {(availableCats.length ? availableCats : categories).map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} — ₹{c.base_price} {c.unit}
                  </option>
                ))}
              </select>
            </div>

            {selectedCat && (
              <div style={{ background: "var(--orange-light)", borderRadius: "8px", padding: "10px 14px", marginBottom: "16px", fontSize: "13px" }}>
                💰 <strong>Price: ₹{selectedCat.base_price}</strong> {selectedCat.unit}
              </div>
            )}

            <div className="form-group">
              <label>Address / Location *</label>
              <textarea placeholder="Apna pura address likho..." rows={2}
                value={form.address} onChange={e => set("address", e.target.value)} />
            </div>

            <div className="form-group">
              <label>Koi Khaas Baat? (optional)</label>
              <textarea placeholder="Koi additional details..." rows={2}
                value={form.description} onChange={e => set("description", e.target.value)} />
            </div>

            {!user && (
              <>
                <div className="form-group">
                  <label>Aapka Naam *</label>
                  <input placeholder="Poora naam" value={form.guest_name} onChange={e => set("guest_name", e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input placeholder="10 digit number" value={form.guest_phone} onChange={e => set("guest_phone", e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Email (optional)</label>
                  <input placeholder="aapka@email.com" value={form.guest_email} onChange={e => set("guest_email", e.target.value)} />
                </div>
              </>
            )}

            {error && (
              <div style={{ background: "#FEE2E2", color: "#DC2626", padding: "10px 14px", borderRadius: "8px", marginBottom: "14px", fontSize: "14px" }}>
                ⚠️ {error}
              </div>
            )}

            <button className="btn btn-primary" onClick={submit} disabled={loading} style={{ width: "100%", justifyContent: "center", padding: "12px" }}>
              {loading ? "Book ho rahi hai..." : "✅ Book Karo"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
