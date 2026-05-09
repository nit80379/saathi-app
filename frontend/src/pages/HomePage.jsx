import { Link } from "react-router-dom";
import { Package, Truck, Users, Shield, Home, UtensilsCrossed, Pill, Car } from "lucide-react";

const ICONS = {
  package: Package, "truck-delivery": Truck, walk: Users,
  "shield-check": Shield, home: Home, "tools-kitchen-2": UtensilsCrossed,
  pill: Pill, car: Car
};

const CATEGORIES = [
  { icon: "package", name: "Saman Uthana", price: "₹100", desc: "Bhari cheezein uthane mein madad" },
  { icon: "truck-delivery", name: "Saman Pahunchana", price: "₹100", desc: "Kisi jagah drop ya deliver karna" },
  { icon: "walk", name: "Saath Chalna", price: "₹200/hr", desc: "Shopping, hospital, station — saath aana" },
  { icon: "shield-check", name: "Body Guard", price: "₹300/hr", desc: "Personal security ke liye saath rehna" },
  { icon: "home", name: "Ghar Ka Kaam", price: "₹150/hr", desc: "Saaf safai, bartan, chhote kaam" },
  { icon: "tools-kitchen-2", name: "Khaana Lana", price: "₹80", desc: "Restaurant ya dukaan se khana laana" },
  { icon: "pill", name: "Dawa Lana", price: "₹80", desc: "Medical store se dawai laana" },
  { icon: "car", name: "Cab Book Karna", price: "₹100", desc: "Transport book karne mein help" },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%)",
        color: "white",
        padding: "60px 20px",
        textAlign: "center"
      }}>
        <h1 style={{ fontSize: "clamp(32px, 6vw, 56px)", fontWeight: 800, marginBottom: "16px", lineHeight: 1.2 }}>
          Thaka Hua Ho? <br />
          <span style={{ opacity: 0.9 }}>Saathi Hai Na! 🤝</span>
        </h1>
        <p style={{ fontSize: "18px", opacity: 0.9, maxWidth: "500px", margin: "0 auto 32px", lineHeight: 1.6 }}>
          Ghar ka saman uthana ho, khaana laana ho, ya sirf saath chahiye —
          apne area ke Saathi se on-demand madad lo.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/search" className="btn" style={{
            background: "white", color: "var(--orange)", fontSize: "17px", padding: "12px 28px", fontWeight: 700
          }}>
            🔍 Saathi Dhundo
          </Link>
          <Link to="/register?agent=true" className="btn" style={{
            background: "rgba(255,255,255,0.2)", color: "white",
            border: "2px solid white", fontSize: "17px", padding: "12px 28px"
          }}>
            Saathi Bano & Kamao
          </Link>
        </div>
      </div>

      {/* How it works */}
      <div style={{ background: "white", padding: "50px 20px", textAlign: "center" }}>
        <h2 style={{ fontSize: "30px", marginBottom: "8px" }}>Kaise Kaam Karta Hai?</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "40px" }}>3 aasaan steps mein madad pao</p>
        <div style={{ display: "flex", gap: "24px", justifyContent: "center", flexWrap: "wrap", maxWidth: "800px", margin: "0 auto" }}>
          {[
            { step: "1", title: "Service Chunno", desc: "Apni zaroorat ke hisaab se category select karo" },
            { step: "2", title: "Saathi Dhundo", desc: "Apne area ke available Saathi dekho, contact karo" },
            { step: "3", title: "Kaam Ho Gaya!", desc: "Fixed rate pe service lo, koi bargaining nahi" },
          ].map(({ step, title, desc }) => (
            <div key={step} style={{ flex: "1 1 200px", maxWidth: "240px" }}>
              <div style={{
                width: "56px", height: "56px", background: "var(--orange-light)",
                borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 16px", fontSize: "22px", fontWeight: 800, color: "var(--orange)", fontFamily: "'Baloo 2', cursive"
              }}>{step}</div>
              <h3 style={{ fontSize: "18px", marginBottom: "8px" }}>{title}</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: 1.5 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="page">
        <h2 style={{ fontSize: "28px", marginBottom: "8px", textAlign: "center" }}>Hamari Services</h2>
        <p style={{ color: "var(--text-muted)", textAlign: "center", marginBottom: "32px" }}>Fixed price — koi surprise nahi</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px" }}>
          {CATEGORIES.map((cat) => {
            const Icon = ICONS[cat.icon] || Package;
            return (
              <Link key={cat.name} to={`/search?category=${cat.name}`} style={{ textDecoration: "none" }}>
                <div className="card" style={{ cursor: "pointer", transition: "all 0.2s", textAlign: "center" }}
                  onMouseOver={e => e.currentTarget.style.transform = "translateY(-4px)"}
                  onMouseOut={e => e.currentTarget.style.transform = "translateY(0)"}
                >
                  <div style={{
                    width: "52px", height: "52px", background: "var(--orange-light)",
                    borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 12px"
                  }}>
                    <Icon size={24} color="var(--orange)" />
                  </div>
                  <h3 style={{ fontSize: "16px", marginBottom: "6px" }}>{cat.name}</h3>
                  <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "12px", lineHeight: 1.4 }}>{cat.desc}</p>
                  <span className="badge badge-orange" style={{ fontSize: "14px", padding: "5px 14px" }}>{cat.price}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* CTA Agent */}
      <div style={{ background: "var(--teal)", color: "white", padding: "50px 20px", textAlign: "center", marginTop: "40px" }}>
        <h2 style={{ fontSize: "32px", marginBottom: "12px" }}>Khali Waqt Mein Paise Kamao 💰</h2>
        <p style={{ fontSize: "16px", opacity: 0.9, marginBottom: "28px" }}>
          Apne area mein Saathi bano. Apni services set karo, aur logo ki madad karo.
        </p>
        <Link to="/register?agent=true" className="btn" style={{
          background: "white", color: "var(--teal)", fontSize: "16px", padding: "12px 28px", fontWeight: 700
        }}>
          Abhi Saathi Bano →
        </Link>
      </div>
    </div>
  );
}
