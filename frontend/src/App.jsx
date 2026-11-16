
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    setCurrentPage("dashboard");
    setAuthMode(null);
    localStorage.setItem("startiva_user", JSON.stringify(user));
  };

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

  const navigateTo = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToDashboard = () => {
    navigateTo("dashboard");
  };

  const isMahasiswa = currentUser?.role === "mahasiswa";
  const isKonselor = currentUser?.role === "konselor";

  // =====================================================
  // HALAMAN SETELAH LOGIN
  // =====================================================

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
        ? ["dashboard", "consultation", "assessment-statistics"]
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
              <div className="placeholder-icon">♡</div>
              <span className="placeholder-eyebrow">RUANG KONSELOR</span>
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

          {currentPage === "ai-assistant" && isMahasiswa && <AIChat />}

          {!hasPageAccess && (
            <div className="page-placeholder">
              <div className="placeholder-icon">✦</div>
              <span className="placeholder-eyebrow">OOPS, SOMETHING WENT WRONG</span>
              <h2>Halaman Tidak Tersedia</h2>
              <p>
                Maaf, akun kamu tidak memiliki akses untuk membuka halaman ini.
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

  // =====================================================
  // LANDING PAGE SEBELUM LOGIN
  // =====================================================

  return (
    <div className="app landing-app">
      {/* NAVBAR */}
      <header className="navbar">
        <a href="#beranda" className="logo" aria-label="Startiva home">
          startiva<span>.</span>
        </a>

        <nav className={`navbar-menu ${mobileMenuOpen ? "is-open" : ""}`}>
          <a href="#beranda" onClick={() => setMobileMenuOpen(false)}>
            Beranda
          </a>
          <a href="#tentang" onClick={() => setMobileMenuOpen(false)}>
            Tentang
          </a>
          <a href="#layanan" onClick={() => setMobileMenuOpen(false)}>
            Layanan
          </a>
          <a href="#alur" onClick={() => setMobileMenuOpen(false)}>
            Cara Kerja
          </a>
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
            className="btn-primary nav-register"
            onClick={() => setAuthMode("register")}
          >
            Daftar Sekarang <span>↗</span>
          </button>
        </div>

        <button
          type="button"
          className={`mobile-menu-toggle ${mobileMenuOpen ? "active" : ""}`}
          aria-label="Buka menu navigasi"
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>
      </header>

      <main>
        {/* HERO */}
        <section className="hero" id="beranda">
          <div className="hero-copy">
            <div className="hero-eyebrow">
              <span className="eyebrow-line" />
              A LITTLE SPACE FOR YOURSELF
            </div>

            <h1>
              Your feelings
              <br />
              <em>deserve a</em>
              <br />
              safe space.
            </h1>

            <p className="hero-description">
              Ada banyak hal yang mungkin sedang kamu pikirkan. Di Startiva,
              kamu bisa mulai mengenali diri, bercerita, dan menemukan
              dukungan tanpa harus merasa sendirian.
            </p>

            <div className="hero-buttons">
              <button
                type="button"
                className="btn-primary hero-primary"
                onClick={() => setAuthMode("register")}
              >
                Mulai Perjalananmu <span>↗</span>
              </button>

              <a href="#tentang" className="text-link">
                Kenali Startiva <span>↓</span>
              </a>
            </div>

            <div className="hero-trust">
              <div className="trust-avatars">
                <span>♡</span>
                <span>✿</span>
                <span>✦</span>
              </div>
              <div>
                <strong>A space to be yourself.</strong>
                <small>Setiap cerita layak untuk didengarkan.</small>
              </div>
            </div>
          </div>

          <div className="hero-photo-area">
            <div className="hero-photo-frame">
              <img
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1100&q=85"
                alt="Sekelompok mahasiswa menghabiskan waktu bersama"
                className="hero-photo"
              />
              <div className="photo-overlay" />
              <div className="photo-caption">
                <span className="caption-mark">“</span>
                <p>
                  You are allowed
                  <br />
                  to feel everything.
                </p>
                <small>STARTIVA COMMUNITY</small>
              </div>
            </div>

            <div className="floating-note note-top">
              <span className="note-icon">♡</span>
              <div>
                <strong>You are heard.</strong>
                <small>Your feelings matter.</small>
              </div>
            </div>

            <div className="floating-note note-bottom">
              <span className="note-icon green-icon">✳</span>
              <div>
                <strong>One step at a time</strong>
                <small>It's okay to ask for help.</small>
              </div>
            </div>

            <span className="hero-decoration decoration-a">✳</span>
            <span className="hero-decoration decoration-b">✧</span>
            <div className="hero-side-label">UNDERSTAND · CONNECT · GROW</div>
          </div>

          <div className="hero-bottom-label">
            <span>01</span>
            <span className="hero-bottom-line" />
            <span>LET'S BEGIN WITH YOU</span>
          </div>
        </section>

        {/* INTRO STRIP */}
        <section className="intro-strip">
          <div className="intro-strip-item">
            <span>01</span>
            <p>Kenali apa yang sedang kamu rasakan.</p>
          </div>
          <div className="intro-strip-item">
            <span>02</span>
            <p>Temukan ruang aman untuk bercerita.</p>
          </div>
          <div className="intro-strip-item">
            <span>03</span>
            <p>Mulai langkah kecil untuk dirimu.</p>
          </div>
        </section>

        {/* ABOUT */}
        <section className="about-section" id="tentang">
          <div className="about-image-wrap">
            <img
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=85"
              alt="Mahasiswa sedang belajar dan berinteraksi"
              loading="lazy"
            />
            <div className="about-image-tag">
              <span>✿</span>
              A place to pause
            </div>
            <div className="about-image-number">01 / 04</div>
          </div>

          <div className="about-copy">
            <span className="section-kicker">A LITTLE ABOUT US</span>
            <h2>
              You don't have
              <br />
              to be <em>okay</em>
              <br />
              all the time.
            </h2>
            <p>
              Masa kuliah bukan hanya tentang tugas, nilai, dan pencapaian.
              Ada tekanan, perubahan, dan perasaan yang terkadang sulit
              dijelaskan.
            </p>
            <p>
              Startiva hadir sebagai platform pendampingan mahasiswa untuk
              membantu mengenali kondisi diri melalui RICE Assessment,
              mendapatkan dukungan konseling sebaya, dan memulai refleksi
              bersama AI Companion.
            </p>
            <a href="#layanan" className="underlined-link">
              Kenali layanan kami <span>↗</span>
            </a>

            <div className="about-signature">
              <span className="signature-flower">✳</span>
              <span>Understand. Connect. Grow.</span>
            </div>
          </div>
        </section>

        {/* QUOTE BAND */}
        <section className="quote-band">
          <span className="quote-decoration">“</span>
          <p>
            Asking for help is not a sign of weakness.
            <br />
            <em>It is a way of taking care of yourself.</em>
          </p>
          <span className="quote-credit">A GENTLE REMINDER FROM STARTIVA</span>
        </section>

        {/* SERVICES */}
        <section className="services-section" id="layanan">
          <div className="services-heading">
            <div>
              <span className="section-kicker">HERE FOR YOUR JOURNEY</span>
              <h2>
                Find the support
                <br />
                <em>you need.</em>
              </h2>
            </div>
            <p>
              Setiap orang punya perjalanan yang berbeda. Mulai dari
              memahami diri sendiri hingga menemukan seseorang untuk
              diajak bercerita.
            </p>
          </div>

          <div className="service-grid">
            <article className="service-card assessment-card">
              <div className="service-card-top">
                <span>01 / SELF DISCOVERY</span>
                <span className="service-arrow">↗</span>
              </div>
              <div className="service-visual assessment-visual">
                <div className="assessment-paper">
                  <span className="paper-line long" />
                  <span className="paper-line medium" />
                  <div className="paper-checks">
                    <i>✓</i><i>✓</i><i />
                  </div>
                  <span className="paper-line short" />
                </div>
                <span className="visual-sparkle">✳</span>
              </div>
              <div className="service-card-copy">
                <h3>RICE Assessment</h3>
                <p>
                  Mulai dengan mengenali kondisi dan kebutuhan dirimu
                  melalui asesmen yang terstruktur.
                </p>
                <span className="service-tag">Know yourself better</span>
              </div>
            </article>

            <article className="service-card counseling-card">
              <div className="service-card-top">
                <span>02 / PEER SUPPORT</span>
                <span className="service-arrow">↗</span>
              </div>
              <div className="service-visual counseling-visual">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=85"
                  alt="Suasana pendampingan dan percakapan"
                  loading="lazy"
                />
                <div className="counseling-photo-label">
                  A listening ear
                </div>
              </div>
              <div className="service-card-copy">
                <h3>Konseling Sebaya</h3>
                <p>
                  Temukan ruang untuk bercerita dan mendapatkan dukungan
                  dari konselor sebaya.
                </p>
                <span className="service-tag">You can talk about it</span>
              </div>
            </article>

            <article className="service-card companion-card">
              <div className="service-card-top">
                <span>03 / AI COMPANION</span>
                <span className="service-arrow">↗</span>
              </div>
              <div className="service-visual companion-visual">
                <div className="chat-bubble bubble-one">
                  Hai, apa yang sedang kamu rasakan hari ini?
                </div>
                <div className="chat-bubble bubble-two">
                  Aku sedang merasa sedikit kewalahan.
                </div>
                <div className="chat-sparkle">✦</div>
              </div>
              <div className="service-card-copy">
                <h3>AI Companion</h3>
                <p>
                  Teman refleksi untuk membantumu memahami perasaan dan
                  menemukan langkah awal.
                </p>
                <span className="service-tag">A gentle conversation</span>
              </div>
            </article>
          </div>
        </section>

        {/* COUNSELING HIGHLIGHT */}
        <section className="counseling-highlight">
          <div className="highlight-photo">
            <img
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1100&q=85"
              alt="Dua orang sedang berbincang dengan nyaman"
              loading="lazy"
            />
            <div className="highlight-photo-caption">
              <span>✳</span>
              A conversation can be a beginning.
            </div>
          </div>

          <div className="highlight-copy">
            <span className="section-kicker">YOU DON'T HAVE TO DO IT ALONE</span>
            <h2>
              Sometimes,
              <br />
              all you need is
              <br />
              <em>someone to listen.</em>
            </h2>
            <p>
              Tidak semua hal harus kamu hadapi sendiri. Melalui layanan
              konseling sebaya, kamu bisa mengajukan konsultasi dan
              berbicara dengan pendamping yang tersedia.
            </p>
            <button
              type="button"
              className="btn-primary"
              onClick={() => setAuthMode("register")}
            >
              Temukan Dukungan <span>↗</span>
            </button>
            <small className="highlight-note">
              Ceritamu berharga. Mulai dari langkah kecil.
            </small>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="workflow-section" id="alur">
          <div className="workflow-heading">
            <span className="section-kicker">A SIMPLE WAY TO BEGIN</span>
            <h2>
              Your journey,
              <br />
              <em>one step at a time.</em>
            </h2>
            <p>
              Kamu tidak harus menyelesaikan semuanya hari ini. Mulai
              perlahan, sesuai dengan kebutuhanmu.
            </p>
          </div>

          <div className="workflow-list">
            <article className="workflow-step">
              <span className="workflow-number">01</span>
              <div>
                <h3>Create your account</h3>
                <p>
                  Daftar dan buat akun untuk memulai perjalananmu bersama
                  Startiva.
                </p>
              </div>
              <span className="workflow-symbol">↗</span>
            </article>

            <article className="workflow-step">
              <span className="workflow-number">02</span>
              <div>
                <h3>Get to know yourself</h3>
                <p>
                  Isi RICE Assessment untuk membantu mengenali kondisi dan
                  kebutuhan dirimu.
                </p>
              </div>
              <span className="workflow-symbol">♡</span>
            </article>

            <article className="workflow-step">
              <span className="workflow-number">03</span>
              <div>
                <h3>Understand your result</h3>
                <p>
                  Pelajari hasil asesmen dan pahami pilihan dukungan yang
                  bisa kamu ambil.
                </p>
              </div>
              <span className="workflow-symbol">✳</span>
            </article>

            <article className="workflow-step">
              <span className="workflow-number">04</span>
              <div>
                <h3>Find your support</h3>
                <p>
                  Ajukan konsultasi dengan konselor sebaya atau mulai
                  refleksi bersama AI Companion.
                </p>
              </div>
              <span className="workflow-symbol">✦</span>
            </article>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="final-cta">
          <div className="cta-decoration cta-decoration-one">✳</div>
          <div className="cta-decoration cta-decoration-two">✧</div>

          <div className="cta-content">
            <span className="section-kicker">A NOTE JUST FOR YOU</span>
            <h2>
              Your story
              <br />
              <em>matters here.</em>
            </h2>
            <p>
              Tidak apa-apa untuk berhenti sejenak, mengenali perasaan,
              dan meminta bantuan. Kamu selalu bisa memulai dari sini.
            </p>
            <button
              type="button"
              className="btn-light"
              onClick={() => setAuthMode("register")}
            >
              Mulai Bersama Startiva <span>↗</span>
            </button>
          </div>

          <div className="cta-side-note">
            <span>WITH CARE,</span>
            <strong>startiva.</strong>
            <small>Understand · Connect · Grow</small>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-main">
          <div className="footer-brand">
            <a href="#beranda" className="logo">
              startiva<span>.</span>
            </a>
            <p>
              A safe space to understand yourself, connect with others,
              and grow at your own pace.
            </p>
          </div>

          <div className="footer-links">
            <span>EXPLORE</span>
            <a href="#beranda">Beranda</a>
            <a href="#tentang">Tentang Startiva</a>
            <a href="#layanan">Layanan</a>
            <a href="#alur">Cara Kerja</a>
          </div>

          <div className="footer-links">
            <span>GET STARTED</span>
            <button type="button" onClick={() => setAuthMode("login")}>
              Masuk
            </button>
            <button type="button" onClick={() => setAuthMode("register")}>
              Buat Akun
            </button>
          </div>

          <div className="footer-note">
            <span className="footer-flower">✳</span>
            <p>Take your time.</p>
            <small>You are doing just fine.</small>
          </div>
        </div>

        <div className="footer-bottom">
          <small>© 2026 Startiva. All rights reserved.</small>
          <small>Made with care for every story.</small>
        </div>
      </footer>

      <ApiStatus />

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
