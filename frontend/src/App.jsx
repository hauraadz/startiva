
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

          {currentPage === "dashboard" && isKonselor && (
            <CounselorDashboard
              user={currentUser}
              onLogout={handleLogout}
              onOpenConsultation={() => navigateTo("consultation")}
              onOpenStatistics={() => navigateTo("assessment-statistics")}
            />
          )}

          {currentPage === "business-profile" && isMahasiswa && (
            <StudentProfile user={currentUser} />
          )}

          {currentPage === "business-assessment" && isMahasiswa && (
            <BusinessAssessment />
          )}

          {currentPage === "assessment-history" && isMahasiswa && (
            <AssessmentHistory />
          )}

          {currentPage === "consultation" && isMahasiswa && (
            <Consultation />
          )}

          {currentPage === "consultation" && isKonselor && (
            <div className="page-placeholder">
              <h2>Pengajuan Konsultasi</h2>
              <p>
                Kamu dapat melihat dan mengelola pengajuan konsultasi
                melalui Dashboard Konselor.
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

          {currentPage === "assessment-statistics" && isKonselor && (
            <AssessmentStatistics />
          )}

          {currentPage === "ai-assistant" && isMahasiswa && (
            <AIChat />
          )}

          {!hasPageAccess && (
            <div className="page-placeholder">
              <h2>Halaman Tidak Tersedia</h2>
              <p>
                Maaf, akun kamu tidak memiliki akses untuk membuka
                halaman ini.
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

      <header className="landing-navbar">
        <div className="navbar-inner">
          <a href="#beranda" className="landing-logo">
            startiva<span>.</span>
          </a>

          <nav className="landing-menu">
            <a href="#beranda">Beranda</a>
            <a href="#tentang">Tentang</a>
            <a href="#fitur">Layanan</a>
            <a href="#alur">Cara Kerja</a>
          </nav>

          <div className="landing-nav-actions">
            <button
              type="button"
              className="landing-login"
              onClick={() => setAuthMode("login")}
            >
              Masuk
            </button>

            <button
              type="button"
              className="landing-button landing-button-primary nav-register"
              onClick={() => setAuthMode("register")}
            >
              Daftar Sekarang <span>↗</span>
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* HERO */}

        <section className="wellness-hero" id="beranda">
          <div className="hero-background-shape shape-left" />
          <div className="hero-background-shape shape-right" />

          <div className="hero-inner">
            <div className="hero-copy">
              <div className="hero-eyebrow">
                <span className="eyebrow-icon">✳</span>
                STUDENT WELL-BEING PLATFORM
              </div>

              <h1>
                You deserve
                <br />
                to be <span>heard.</span>
              </h1>

              <p className="hero-description">
                Setiap perasaan punya cerita. Kenali dirimu,
                pahami kebutuhanmu, dan temukan dukungan yang
                tepat melalui Startiva.
              </p>

              <div className="hero-buttons">
                <button
                  type="button"
                  className="landing-button landing-button-primary"
                  onClick={() => setAuthMode("register")}
                >
                  Mulai Perjalananmu
                  <span>↗</span>
                </button>

                <a href="#tentang" className="landing-button landing-button-outline">
                  Kenali Startiva
                  <span>↓</span>
                </a>
              </div>

              <div className="hero-reassurance">
                <span className="reassurance-heart">♡</span>
                A gentle space to understand yourself.
              </div>
            </div>

            {/* HERO ARTWORK */}

            <div className="hero-artwork">
              <div className="artwork-halo" />

              <div className="artwork-orbit orbit-one" />
              <div className="artwork-orbit orbit-two" />

              <div className="artwork-main">
                <div className="artwork-outer">
                  <div className="artwork-middle">
                    <div className="artwork-center">
                      <span className="heart-symbol">♡</span>
                      <span className="heart-sparkle sparkle-a">✦</span>
                      <span className="heart-sparkle sparkle-b">✧</span>
                    </div>
                  </div>
                </div>

                <div className="artwork-caption">
                  <span>YOUR STORY</span>
                  <strong>MATTERS.</strong>
                </div>
              </div>

              <div className="floating-note note-top">
                <div className="floating-note-icon">♡</div>
                <div>
                  <strong>You are not alone</strong>
                  <small>Every feeling matters</small>
                </div>
              </div>

              <div className="floating-note note-bottom">
                <div className="floating-avatar">S</div>
                <div>
                  <strong>A little support</strong>
                  <small>Can make a difference.</small>
                </div>
                <span className="floating-check">✓</span>
              </div>

              <span className="artwork-star star-one">✳</span>
              <span className="artwork-star star-two">✧</span>
              <span className="artwork-star star-three">✦</span>
            </div>
          </div>

          <div className="hero-bottom-line">
            <span>UNDERSTAND YOURSELF</span>
            <span className="line-dot">✳</span>
            <span>CONNECT WITH OTHERS</span>
            <span className="line-dot">✳</span>
            <span>GROW AT YOUR OWN PACE</span>
          </div>
        </section>

        {/* ABOUT */}

        <section className="about-section" id="tentang">
          <div className="about-decoration">“</div>

          <div className="section-kicker">
            <span /> A LITTLE ABOUT US
          </div>

          <h2>
            You don't have to
            <br />
            figure everything out
            <br />
            <span>on your own.</span>
          </h2>

          <p>
            Startiva adalah platform konseling sebaya yang membantu
            mahasiswa mengenali kondisi dirinya melalui RICE Assessment,
            memahami hasil asesmen, serta mendapatkan dukungan melalui
            konselor sebaya dan AI Companion.
          </p>

          <div className="about-signature">
            <span>♡</span> A safe space, just for you.
          </div>
        </section>

        {/* FEATURES */}

        <section className="features-section" id="fitur">
          <div className="section-container">
            <div className="features-heading">
              <div>
                <div className="section-kicker">
                  <span /> WHAT WE OFFER
                </div>

                <h2>
                  A little help can
                  <br />
                  make a <span>big difference.</span>
                </h2>
              </div>

              <p>
                Temukan cara untuk memahami dirimu, terhubung
                dengan orang lain, dan mendapatkan dukungan
                dalam perjalananmu.
              </p>
            </div>

            <div className="wellness-feature-grid">
              <article className="wellness-card card-assessment">
                <div className="wellness-card-top">
                  <span>01 / SELF DISCOVERY</span>
                  <span className="card-arrow">↗</span>
                </div>

                <div className="wellness-icon icon-heart">♡</div>

                <h3>RICE Assessment</h3>

                <p>
                  Mulai dengan mengenali kondisi dan kebutuhan
                  dirimu melalui asesmen yang terstruktur.
                </p>

                <div className="card-bottom">
                  <span>Know yourself better</span>
                  <span>01</span>
                </div>
              </article>

              <article className="wellness-card card-counseling">
                <div className="wellness-card-top">
                  <span>02 / HUMAN CONNECTION</span>
                  <span className="card-arrow">↗</span>
                </div>

                <div className="wellness-icon icon-flower">✿</div>

                <h3>Konseling Sebaya</h3>

                <p>
                  Temukan ruang aman untuk bercerita dan
                  mendapatkan dukungan dari konselor sebaya.
                </p>

                <div className="card-bottom">
                  <span>You deserve to be heard</span>
                  <span>02</span>
                </div>
              </article>

              <article className="wellness-card card-ai">
                <div className="wellness-card-top">
                  <span>03 / AI COMPANION</span>
                  <span className="card-arrow">↗</span>
                </div>

                <div className="wellness-icon icon-sparkle">✧</div>

                <h3>AI Companion</h3>

                <p>
                  Teman refleksi untuk membantumu memahami
                  hasil asesmen dan menemukan langkah awal.
                </p>

                <div className="card-bottom">
                  <span>One step at a time</span>
                  <span>03</span>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* QUOTE / MESSAGE */}

        <section className="quote-section">
          <div className="quote-inner">
            <div className="quote-decoration quote-left">✳</div>

            <div className="quote-content">
              <span className="quote-mark">“</span>

              <h2>
                Taking care of yourself
                <br />
                is not selfish. It's <span>necessary.</span>
              </h2>

              <p>
                Tidak ada perjalanan yang harus diselesaikan
                dalam satu hari. Mulailah dari langkah kecil.
              </p>
            </div>

            <div className="quote-decoration quote-right">✿</div>
          </div>
        </section>

        {/* WORKFLOW */}

        <section className="workflow-section" id="alur">
          <div className="section-container">
            <div className="workflow-heading">
              <div className="section-kicker">
                <span /> YOUR JOURNEY WITH STARTIVA
              </div>

              <h2>
                Start with a small step,
                <br />
                <span>grow at your own pace.</span>
              </h2>

              <p>
                Perjalanan memahami diri dimulai dari satu langkah
                sederhana. Ikuti prosesnya bersama Startiva.
              </p>
            </div>

            <div className="journey-steps">
              <article className="journey-step">
                <div className="journey-number">01</div>
                <div className="journey-symbol">♡</div>
                <h3>Create Account</h3>
                <p>
                  Daftarkan akun mahasiswa untuk memulai
                  perjalananmu bersama Startiva.
                </p>
              </article>

              <article className="journey-step">
                <div className="journey-number">02</div>
                <div className="journey-symbol">✿</div>
                <h3>Complete Assessment</h3>
                <p>
                  Isi RICE Assessment untuk mengenali kondisi
                  dan kebutuhan dirimu.
                </p>
              </article>

              <article className="journey-step">
                <div className="journey-number">03</div>
                <div className="journey-symbol">✧</div>
                <h3>Understand Your Result</h3>
                <p>
                  Pelajari hasil asesmen dan rekomendasi
                  pendampingan yang tersedia.
                </p>
              </article>

              <article className="journey-step">
                <div className="journey-number">04</div>
                <div className="journey-symbol">♡</div>
                <h3>Get Support</h3>
                <p>
                  Hubungi konselor sebaya atau gunakan AI
                  Companion untuk mendapatkan dukungan.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* CTA */}

        <section className="landing-cta">
          <div className="cta-decoration cta-decoration-one">✿</div>
          <div className="cta-decoration cta-decoration-two">✧</div>

          <div className="cta-content">
            <div className="cta-kicker">
              <span /> YOUR STORY MATTERS
            </div>

            <h2>
              You are worthy
              <br />
              of <span>being understood.</span>
            </h2>

            <p>
              Tidak apa-apa untuk berhenti sejenak, mengenali diri,
              dan mencari dukungan. Startiva ada untuk menemanimu.
            </p>

            <button
              type="button"
              className="landing-button cta-button"
              onClick={() => setAuthMode("register")}
            >
              Mulai Bersama Startiva
              <span>↗</span>
            </button>
          </div>
        </section>
      </main>

      {/* FOOTER */}

      <footer className="landing-footer">
        <div className="footer-main">
          <div className="footer-brand">
            <a href="#beranda" className="landing-logo">
              startiva<span>.</span>
            </a>

            <p>
              Understand. Connect.
              <br />
              Grow at your own pace.
            </p>
          </div>

          <div className="footer-links">
            <span>EXPLORE</span>
            <a href="#beranda">Beranda</a>
            <a href="#tentang">Tentang Kami</a>
            <a href="#fitur">Layanan</a>
            <a href="#alur">Cara Kerja</a>
          </div>

          <div className="footer-message">
            <span>A LITTLE REMINDER</span>
            <p>
              Your feelings are valid.
              <br />
              Your story matters. ♡
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Startiva. All rights reserved.</span>
          <span>Made with care for every student. ♡</span>
        </div>
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
