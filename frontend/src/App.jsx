
import { useState } from "react";
import "./App.css";

import ApiStatus from "./components/ApiStatus";
import AuthModal from "./components/AuthModal";
import StudentDashboard from "./components/StudentDashboard";
import CounselorDashboard from "./components/CounselorDashboard";

import BusinessAssessment from "./pages/BusinessAssessment";
import AssessmentHistory from "./pages/AssessmentHistory";
import Consultation from "./pages/Consultation";
import AssessmentStatistics from "./pages/AssessmentStatistics";
import AIChat from "./pages/AIChat";
import StudentProfile from "./pages/StudentProfile";

const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

function App() {
  const [authMode, setAuthMode] = useState(null);
  const [currentPage, setCurrentPage] = useState("dashboard");

  // =====================================
  // DATA PENGGUNA
  // =====================================

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("startiva_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error("Gagal membaca data pengguna:", error);
      localStorage.removeItem("startiva_user");
      return null;
    }
  });

  // =====================================
  // LOGIN / REGISTER BERHASIL
  // =====================================

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    setCurrentPage("dashboard");
    setAuthMode(null);

    localStorage.setItem("startiva_user", JSON.stringify(user));
  };

  // =====================================
  // LOGOUT
  // =====================================

  const handleLogout = async () => {
    const token = localStorage.getItem("startiva_token");

    try {
      if (token) {
        await fetch(`${API_URL.replace(/\/$/, "")}/logout`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("startiva_token");
      localStorage.removeItem("startiva_user");

      setCurrentUser(null);
      setCurrentPage("dashboard");
      setAuthMode(null);
    }
  };

  // =====================================
  // NAVIGASI
  // =====================================

  const navigateTo = (page) => {
    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleBackToDashboard = () => {
    navigateTo("dashboard");
  };

  // =====================================
  // CEK ROLE
  // =====================================

  const isMahasiswa = currentUser?.role === "mahasiswa";
  const isKonselor = currentUser?.role === "konselor";

  // =====================================
  // HALAMAN SETELAH LOGIN
  // =====================================

  if (currentUser) {
    const allowedPages = isMahasiswa
      ? [
          "dashboard",
          "business-profile",
          "business-assessment",
          "assessment-history",
          "consultation",
          "ai-assistant",
        ]
      : isKonselor
        ? [
            "dashboard",
            "consultation",
            "assessment-statistics",
          ]
        : [];

    const hasPageAccess = allowedPages.includes(currentPage);

    return (
      <div className="app authenticated-app">

        {/* =====================================
            NAVIGASI KEMBALI
        ===================================== */}

        {currentPage !== "dashboard" && (
          <div className="page-navigation">
            <button
              type="button"
              className="back-dashboard-button"
              onClick={handleBackToDashboard}
            >
              <span className="back-arrow">←</span>
              Kembali ke Dashboard
            </button>
          </div>
        )}

        <main className="authenticated-content">

          {/* =====================================
              DASHBOARD MAHASISWA
          ===================================== */}

          {currentPage === "dashboard" && isMahasiswa && (
            <StudentDashboard
              user={currentUser}
              onLogout={handleLogout}
              onOpenProfile={() => navigateTo("business-profile")}
              onOpenAssessment={() => navigateTo("business-assessment")}
              onOpenHistory={() => navigateTo("assessment-history")}
              onOpenConsultation={() => navigateTo("consultation")}
              onOpenAI={() => navigateTo("ai-assistant")}
            />
          )}

          {/* =====================================
              DASHBOARD KONSELOR
          ===================================== */}

          {currentPage === "dashboard" && isKonselor && (
            <CounselorDashboard
              user={currentUser}
              onLogout={handleLogout}
              onOpenConsultation={() => navigateTo("consultation")}
              onOpenStatistics={() => navigateTo("assessment-statistics")}
            />
          )}

          {/* =====================================
              PROFIL MAHASISWA
          ===================================== */}

          {currentPage === "business-profile" && isMahasiswa && (
            <StudentProfile user={currentUser} />
          )}

          {/* =====================================
              RICE ASSESSMENT MAHASISWA
          ===================================== */}

          {currentPage === "business-assessment" && isMahasiswa && (
            <BusinessAssessment />
          )}

          {/* =====================================
              RIWAYAT ASSESSMENT MAHASISWA
          ===================================== */}

          {currentPage === "assessment-history" && isMahasiswa && (
            <AssessmentHistory />
          )}

          {/* =====================================
              KONSULTASI MAHASISWA
          ===================================== */}

          {currentPage === "consultation" && isMahasiswa && (
            <Consultation />
          )}

          {/* =====================================
              PENGELOLAAN KONSULTASI KONSELOR
          ===================================== */}

          {currentPage === "consultation" && isKonselor && (
            <div className="page-placeholder">
              <h2>Pengajuan Konsultasi</h2>

              <p>
                Kamu dapat melihat dan mengelola pengajuan
                konsultasi melalui Dashboard Konselor.
              </p>

              <button
                type="button"
                className="btn-primary"
                onClick={handleBackToDashboard}
              >
                Kembali ke Dashboard
              </button>
            </div>
          )}

          {/* =====================================
              STATISTIK ASSESSMENT KONSELOR
          ===================================== */}

          {currentPage === "assessment-statistics" && isKonselor && (
            <AssessmentStatistics />
          )}

          {/* =====================================
              AI COMPANION MAHASISWA
          ===================================== */}

          {currentPage === "ai-assistant" && isMahasiswa && (
            <AIChat />
          )}

          {/* =====================================
              AKSES TIDAK DIIZINKAN
          ===================================== */}

          {!hasPageAccess && (
            <div className="page-placeholder">
              <h2>Halaman Tidak Tersedia</h2>

              <p>
                Maaf, akun kamu tidak memiliki akses
                untuk membuka halaman ini.
              </p>

              <button
                type="button"
                className="btn-primary"
                onClick={handleBackToDashboard}
              >
                Kembali ke Dashboard
              </button>
            </div>
          )}

        </main>

        <ApiStatus />
      </div>
    );
  }

  // =====================================
  // LANDING PAGE SEBELUM LOGIN
  // =====================================

  return (
    <div className="app landing-app">

      {/* NAVBAR */}

      <header className="navbar">
        <a href="#beranda" className="logo">
          startiva<span>.</span>
        </a>

        <nav className="navbar-menu">
          <a href="#beranda">Beranda</a>
          <a href="#tentang">Tentang</a>
          <a href="#fitur">Layanan</a>
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
              <span className="status-dot" />
              STUDENT WELL-BEING PLATFORM
            </div>

            <h1>
              You deserve
              <br />
              <span>to be heard.</span>
            </h1>

            <p>
              Kenali kondisi dirimu, pahami kebutuhan emosional,
              dan temukan dukungan melalui layanan konseling
              sebaya bersama Startiva.
            </p>

            <div className="hero-actions">
              <button
                type="button"
                className="btn-primary"
                onClick={() => setAuthMode("register")}
              >
                Mulai Sekarang
                <span>→</span>
              </button>

              <a href="#tentang" className="btn-secondary">
                Pelajari Lebih Lanjut
              </a>
            </div>

            <div className="hero-note">
              <span>✦</span>
              A safe space to understand yourself.
            </div>
          </div>

          {/* HERO VISUAL */}

          <div className="hero-visual">
            <div className="visual-glow" />

            <div className="floating-card top-card">
              <span className="card-icon">♡</span>

              <div>
                <strong>You are not alone</strong>
                <small>Every feeling matters</small>
              </div>
            </div>

            <div className="main-illustration">
              <div className="illustration-circle">
                <div className="inner-circle">
                  <span className="bulb">♡</span>

                  <div className="sparkle one">✦</div>
                  <div className="sparkle two">✧</div>
                  <div className="sparkle three">✦</div>
                </div>
              </div>

              <div className="illustration-label">
                <span>01</span>
                <strong>YOUR STORY MATTERS</strong>
              </div>
            </div>

            <div className="floating-card bottom-card">
              <div className="mini-avatar">S</div>

              <div>
                <strong>A little support</strong>
                <small>Can make a difference.</small>
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
            Everyone deserves
            <br />
            to feel <span>understood.</span>
          </h2>

          <p>
            Startiva merupakan platform konseling sebaya yang
            membantu mahasiswa mengenali kondisi dirinya melalui
            asesmen, memahami hasilnya, dan memperoleh dukungan
            dari konselor sebaya maupun pendampingan AI.
          </p>
        </section>

        {/* FEATURES */}

        <section className="features section" id="fitur">
          <div className="section-heading">
            <div>
              <div className="section-label">WHAT STARTIVA OFFERS</div>

              <h2>
                Understand yourself,
                <span> one step at a time.</span>
              </h2>
            </div>

            <p>
              Ruang untuk mengenali diri, mendapatkan dukungan,
              dan mengambil langkah positif.
            </p>
          </div>

          <div className="feature-grid">
            <article className="feature-card purple">
              <div className="feature-number">01 / SELF ASSESSMENT</div>
              <div className="feature-icon">♡</div>

              <h3>RICE Assessment</h3>

              <p>
                Kenali kondisi dan kebutuhan dirimu melalui
                asesmen yang terstruktur.
              </p>

              <a href="#alur">Explore feature ↗</a>
            </article>

            <article className="feature-card peach">
              <div className="feature-number">02 / PEER COUNSELING</div>
              <div className="feature-icon">✳</div>

              <h3>Konseling Sebaya</h3>

              <p>
                Dapatkan ruang bercerita dan dukungan dari
                konselor sebaya yang tersedia.
              </p>

              <a href="#alur">Explore feature ↗</a>
            </article>

            <article className="feature-card green">
              <div className="feature-number">03 / AI COMPANION</div>
              <div className="feature-icon">✧</div>

              <h3>AI Companion</h3>

              <p>
                Teman refleksi untuk membantu memahami hasil
                asesmen dan menemukan langkah awal.
              </p>

              <a href="#alur">Explore feature ↗</a>
            </article>
          </div>
        </section>

        {/* WORKFLOW */}

        <section className="workflow section" id="alur">
          <div className="section-label">HOW IT WORKS</div>

          <h2>
            A small step toward
            <span> a better you.</span>
          </h2>

          <div className="steps">
            <div className="step">
              <span>01</span>
              <h3>Create Account</h3>
              <p>
                Buat akun mahasiswa untuk memulai perjalananmu
                bersama Startiva.
              </p>
            </div>

            <div className="step">
              <span>02</span>
              <h3>Complete Assessment</h3>
              <p>
                Isi RICE Assessment untuk mengenali kondisi
                dan kebutuhan dirimu.
              </p>
            </div>

            <div className="step">
              <span>03</span>
              <h3>Understand Your Result</h3>
              <p>
                Pelajari hasil asesmen dan rekomendasi
                pendampingan yang tersedia.
              </p>
            </div>

            <div className="step">
              <span>04</span>
              <h3>Get Support</h3>
              <p>
                Ajukan konsultasi dengan konselor sebaya
                atau gunakan AI Companion.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}

        <section className="cta section" id="daftar">
          <div>
            <div className="section-label">
              YOUR STORY MATTERS
            </div>

            <h2>
              You don't have to
              <br />
              figure it all <span>out alone.</span>
            </h2>

            <p>
              Mulai dengan mengenali dirimu. Tidak apa-apa
              untuk bercerita dan mencari dukungan.
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

      {/* FOOTER */}

      <footer className="footer">
        <a href="#beranda" className="logo">
          startiva<span>.</span>
        </a>

        <p>Understand. Connect. Grow.</p>

        <small>© 2026 Startiva. All rights reserved.</small>
      </footer>

      <ApiStatus />

      {/* AUTH MODAL */}

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
