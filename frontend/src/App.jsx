
import { useState } from "react";
import "./App.css";

import ApiStatus from "./components/ApiStatus";
import AuthModal from "./components/AuthModal";
import StudentDashboard from "./components/StudentDashboard";
import BusinessProfile from "./components/BusinessProfile";

function App() {
  const [authMode, setAuthMode] = useState(null);
  const [currentPage, setCurrentPage] = useState("dashboard");

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("startiva_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  // LOGIN / REGISTER BERHASIL
  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    setCurrentPage("dashboard");
    setAuthMode(null);
  };

  // LOGOUT
  const handleLogout = async () => {
    const token = localStorage.getItem("startiva_token");

    try {
      if (token) {
        await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    }

    localStorage.removeItem("startiva_token");
    localStorage.removeItem("startiva_user");

    setCurrentUser(null);
    setCurrentPage("dashboard");
    setAuthMode(null);
  };

  // JIKA SUDAH LOGIN
  if (currentUser) {

    // HALAMAN PROFIL BISNIS
    if (currentPage === "business-profile") {
      return (
        <div>
          <button
            type="button"
            onClick={() => setCurrentPage("dashboard")}
            style={{
              margin: "20px",
              padding: "10px 18px",
              border: "none",
              borderRadius: "10px",
              background: "#7965c8",
              color: "white",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            ← Kembali ke Dashboard
          </button>

          <BusinessProfile />
        </div>
      );
    }

    // HALAMAN DASHBOARD
    return (
      <StudentDashboard
        user={currentUser}
        onLogout={handleLogout}
        onOpenProfile={() => setCurrentPage("business-profile")}
      />
    );
  }

  // JIKA BELUM LOGIN, TAMPILKAN LANDING PAGE
  return (
    <div className="app">

      {/* NAVBAR */}
      <header className="navbar">
        <a href="#beranda" className="logo">
          startiva<span>.</span>
        </a>

        <nav>
          <a href="#beranda">Beranda</a>
          <a href="#tentang">Tentang</a>
          <a href="#fitur">Fitur</a>
          <a href="#alur">Cara Kerja</a>
        </nav>

        <div className="nav-actions">
          <button
            type="button"
            className="login-link"
            onClick={() => setAuthMode("login")}
          >
            Masuk
          </button>

          <button
            type="button"
            className="btn-primary small"
            onClick={() => setAuthMode("register")}
          >
            Daftar Sekarang
          </button>
        </div>
      </header>

      <main>

        {/* HERO */}
        <section className="hero" id="beranda">
          <div className="hero-content">
            <div className="eyebrow">
              <span className="status-dot"></span>
              STUDENT BUSINESS PLATFORM
            </div>

            <h1>
              Your idea deserves
              <br />
              <span>a great beginning.</span>
            </h1>

            <p>
              Kenali potensi, ukur kesiapan, dan kembangkan
              ide bisnis digital serta kreatifmu bersama Startiva.
            </p>

            <div className="hero-actions">
              <button
                type="button"
                className="btn-primary"
                onClick={() => setAuthMode("register")}
              >
                Mulai Perjalanan
                <span>→</span>
              </button>

              <a href="#tentang" className="btn-secondary">
                Pelajari Lebih Lanjut
              </a>
            </div>

            <div className="hero-note">
              <span>✦</span>
              Start small, grow with confidence.
            </div>
          </div>

          <div className="hero-visual">
            <div className="visual-glow"></div>

            <div className="floating-card top-card">
              <span className="card-icon">✦</span>
              <div>
                <strong>Business Potential</strong>
                <small>Discover your strength</small>
              </div>
            </div>

            <div className="main-illustration">
              <div className="illustration-circle">
                <div className="inner-circle">
                  <span className="bulb">✧</span>
                  <div className="sparkle one">✦</div>
                  <div className="sparkle two">✧</div>
                  <div className="sparkle three">✦</div>
                </div>
              </div>

              <div className="illustration-label">
                <span>01</span>
                <strong>IDEA TO REALITY</strong>
              </div>
            </div>

            <div className="floating-card bottom-card">
              <div className="mini-avatar">S</div>
              <div>
                <strong>Your next chapter</strong>
                <small>Starts here.</small>
              </div>
              <span className="check-icon">✓</span>
            </div>

            <span className="decor decor-one">✳</span>
            <span className="decor decor-two">✧</span>
          </div>
        </section>

        {/* ABOUT */}
        <section className="about section" id="tentang">
          <div className="section-label">ABOUT STARTIVA</div>

          <h2>
            Every big business
            <br />
            starts with <span>one idea.</span>
          </h2>

          <p>
            Startiva merupakan platform digital yang membantu mahasiswa
            memahami kesiapan bisnis melalui asesmen dan mendapatkan
            arahan pengembangan melalui layanan konsultasi.
          </p>
        </section>

        {/* FEATURES */}
        <section className="features section" id="fitur">
          <div className="section-heading">
            <div>
              <div className="section-label">WHAT YOU CAN DO</div>
              <h2>
                Build your business <span>with direction.</span>
              </h2>
            </div>

            <p>
              Mulai dari menemukan ide hingga memahami langkah
              pengembangan bisnis.
            </p>
          </div>

          <div className="feature-grid">

            <article className="feature-card purple">
              <div className="feature-number">01 / ASSESSMENT</div>
              <div className="feature-icon">◈</div>

              <h3>Business Assessment</h3>

              <p>
                Kenali tingkat kesiapan dan potensi bisnis melalui
                asesmen yang terstruktur.
              </p>

              <a href="#alur">Explore feature ↗</a>
            </article>

            <article className="feature-card peach">
              <div className="feature-number">02 / CONSULTATION</div>
              <div className="feature-icon">✳</div>

              <h3>Business Consultation</h3>

              <p>
                Dapatkan arahan untuk mengembangkan ide, produk,
                pemasaran, dan pengelolaan bisnis.
              </p>

              <a href="#alur">Explore feature ↗</a>
            </article>

            <article className="feature-card green">
              <div className="feature-number">03 / DEVELOPMENT</div>
              <div className="feature-icon">↗</div>

              <h3>Growth Direction</h3>

              <p>
                Pahami hasil asesmen dan temukan area yang perlu
                ditingkatkan dalam perjalanan bisnismu.
              </p>

              <a href="#alur">Explore feature ↗</a>
            </article>

          </div>
        </section>

        {/* WORKFLOW */}
        <section className="workflow section" id="alur">
          <div className="section-label">SIMPLE PROCESS</div>

          <h2>
            Start with a step, <span>grow with purpose.</span>
          </h2>

          <div className="steps">

            <div className="step">
              <span>01</span>
              <h3>Create Account</h3>
              <p>Daftar dan lengkapi profil mahasiswa.</p>
            </div>

            <div className="step">
              <span>02</span>
              <h3>Take Assessment</h3>
              <p>Isi asesmen sesuai kondisi dan kebutuhanmu.</p>
            </div>

            <div className="step">
              <span>03</span>
              <h3>View Your Result</h3>
              <p>
                Pahami hasil dan aspek bisnis yang perlu dikembangkan.
              </p>
            </div>

            <div className="step">
              <span>04</span>
              <h3>Get Consultation</h3>
              <p>Ajukan konsultasi untuk langkah berikutnya.</p>
            </div>

          </div>
        </section>

        {/* CTA */}
        <section className="cta section" id="daftar">
          <div>
            <div className="section-label">
              YOUR JOURNEY STARTS HERE
            </div>

            <h2>
              Ready to turn your
              <br />
              idea into <span>something real?</span>
            </h2>

            <p>
              Tidak harus sudah punya bisnis. Kamu bisa mulai
              dari ide, potensi, dan rasa ingin tahu.
            </p>
          </div>

          <button
            type="button"
            className="btn-light"
            onClick={() => setAuthMode("register")}
          >
            Get Started
            <span>→</span>
          </button>
        </section>

      </main>

      {/* API STATUS */}
      <ApiStatus />

      {/* FOOTER */}
      <footer className="footer">
        <a href="#beranda" className="logo">
          startiva<span>.</span>
        </a>

        <p>Assess. Consult. Grow.</p>

        <small>© 2026 Startiva. All rights reserved.</small>
      </footer>

      {/* LOGIN & REGISTER MODAL */}
      {authMode && (
        <AuthModal
          mode={authMode}
          onClose={() => setAuthMode(null)}
          onSuccess={handleAuthSuccess}
        />
      )}

    </div>
  );
}

export default App;
