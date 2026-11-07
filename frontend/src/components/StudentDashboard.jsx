
import "./StudentDashboard.css";

function StudentDashboard({
  user,
  onLogout,
  onOpenProfile,
  onOpenAssessment,
  onOpenHistory,
  onOpenConsultation,
  onOpenStatistics,
  onOpenAI,
}) {
  const firstName = user?.name?.split(" ")[0] || "Mahasiswa";

  return (
    <div className="dashboard">
      {/* SIDEBAR */}
      <aside className="dashboard-sidebar">
        <a href="#dashboard" className="dashboard-logo">
          startiva<span>.</span>
        </a>

        <div className="sidebar-label">MENU UTAMA</div>

        <nav className="sidebar-menu">
          <a
            href="#dashboard"
            className="active"
            onClick={(e) => e.preventDefault()}
          >
            <span>⌂</span>
            Dashboard
          </a>

          <a
            href="#business-profile"
            onClick={(e) => {
              e.preventDefault();
              onOpenProfile?.();
            }}
          >
            <span>○</span>
            Business Profile
          </a>

          <a
            href="#assessment"
            onClick={(e) => {
              e.preventDefault();
              onOpenAssessment?.();
            }}
          >
            <span>◈</span>
            Business Assessment
          </a>

          <a
            href="#assessment-history"
            onClick={(e) => {
              e.preventDefault();
              onOpenHistory?.();
            }}
          >
            <span>▤</span>
            Assessment History
          </a>

          <a
            href="#assessment-statistics"
            onClick={(e) => {
              e.preventDefault();
              onOpenStatistics?.();
            }}
          >
            <span>▥</span>
            Assessment Statistics
          </a>

          <a
            href="#consultation"
            onClick={(e) => {
              e.preventDefault();
              onOpenConsultation?.();
            }}
          >
            <span>✳</span>
            Consultation
          </a>

          {/* AI BUSINESS ASSISTANT */}
          <a
            href="#ai-assistant"
            onClick={(e) => {
              e.preventDefault();
              onOpenAI?.();
            }}
          >
            <span>✧</span>
            AI Business Assistant
          </a>

          <a
            href="#profile"
            onClick={(e) => {
              e.preventDefault();
              onOpenProfile?.();
            }}
          >
            <span>○</span>
            My Profile
          </a>
        </nav>

        {/* SIDEBAR USER */}
        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <div className="user-avatar">
              {firstName.charAt(0).toUpperCase()}
            </div>

            <div className="user-info">
              <strong>{user?.name || "Mahasiswa"}</strong>
              <small>Student Account</small>
            </div>
          </div>

          <button
            type="button"
            className="sidebar-logout"
            onClick={onLogout}
          >
            ↪ Keluar
          </button>
        </div>
      </aside>

      {/* MAIN DASHBOARD */}
      <main className="dashboard-main" id="dashboard">

        {/* HEADER */}
        <header className="dashboard-header">
          <div>
            <span className="dashboard-date">
              STUDENT WORKSPACE
            </span>

            <h1>Dashboard</h1>
          </div>

          <div className="header-profile">
            <div className="user-avatar">
              {firstName.charAt(0).toUpperCase()}
            </div>

            <span>{user?.name || "Mahasiswa"}</span>
          </div>
        </header>

        {/* WELCOME */}
        <section className="welcome-banner">
          <div className="welcome-content">
            <span className="welcome-label">
              WELCOME TO YOUR JOURNEY
            </span>

            <h2>
              Hello, {firstName}!
              <br />
              Ready to grow your idea?
            </h2>

            <p>
              Setiap bisnis dimulai dari satu langkah kecil.
              Kenali potensimu dan mulai kembangkan ide bisnismu
              bersama Startiva.
            </p>

            <button
              type="button"
              className="profile-action-button"
              onClick={onOpenProfile}
            >
              Lengkapi Profil Bisnis →
            </button>
          </div>

          <div className="welcome-decoration">
            <span>✦</span>
            <strong>01</strong>
            <small>YOUR JOURNEY</small>
          </div>
        </section>

        {/* BUSINESS JOURNEY */}
        <section className="dashboard-section">
          <div className="dashboard-section-heading">
            <div>
              <span className="dashboard-eyebrow">
                YOUR PROGRESS
              </span>

              <h2>Business Journey</h2>
            </div>
          </div>

          <div className="progress-card">
            <div className="progress-icon">◈</div>

            <div className="progress-content">
              <h3>Your business journey starts here</h3>

              <p>
                Lengkapi profil dan ikuti asesmen untuk mengetahui
                kesiapan serta potensi bisnis yang ingin kamu kembangkan.
              </p>

              <div className="progress-track">
                <div className="progress-fill"></div>
              </div>

              <small>
                Belum ada asesmen yang diselesaikan
              </small>
            </div>

            <span className="progress-status">
              Not started
            </span>
          </div>
        </section>

        {/* EXPLORE STARTIVA */}
        <section className="dashboard-section">
          <div className="dashboard-section-heading">
            <div>
              <span className="dashboard-eyebrow">
                EXPLORE STARTIVA
              </span>

              <h2>What would you like to do?</h2>
            </div>
          </div>

          <div className="dashboard-feature-grid">

            {/* BUSINESS PROFILE */}
            <article className="dashboard-feature-card assessment-card">
              <div className="dashboard-card-top">
                <span className="dashboard-card-icon">○</span>
                <span className="dashboard-card-number">01</span>
              </div>

              <h3>Business Profile</h3>

              <p>
                Lengkapi informasi bisnis, mulai dari ide,
                kategori, produk atau layanan, hingga target pasar.
              </p>

              <button
                type="button"
                className="dashboard-feature-button"
                onClick={onOpenProfile}
              >
                Lengkapi Profil →
              </button>
            </article>

            {/* BUSINESS ASSESSMENT */}
            <article className="dashboard-feature-card consultation-card">
              <div className="dashboard-card-top">
                <span className="dashboard-card-icon">◈</span>
                <span className="dashboard-card-number">02</span>
              </div>

              <h3>Business Assessment</h3>

              <p>
                Kenali kesiapan bisnismu melalui asesmen yang
                mencakup produk, pasar, pemasaran, keuangan,
                dan operasional bisnis.
              </p>

              <button
                type="button"
                className="dashboard-feature-button"
                onClick={onOpenAssessment}
              >
                Mulai Assessment →
              </button>
            </article>

            {/* ASSESSMENT HISTORY */}
            <article className="dashboard-feature-card assessment-card">
              <div className="dashboard-card-top">
                <span className="dashboard-card-icon">▤</span>
                <span className="dashboard-card-number">03</span>
              </div>

              <h3>Assessment History</h3>

              <p>
                Lihat kembali hasil assessment sebelumnya,
                skor kesiapan, dan perkembangan bisnismu.
              </p>

              <button
                type="button"
                className="dashboard-feature-button"
                onClick={onOpenHistory}
              >
                Lihat Riwayat →
              </button>
            </article>

            {/* ASSESSMENT STATISTICS */}
            <article className="dashboard-feature-card consultation-card">
              <div className="dashboard-card-top">
                <span className="dashboard-card-icon">▥</span>
                <span className="dashboard-card-number">04</span>
              </div>

              <h3>Assessment Statistics</h3>

              <p>
                Lihat ringkasan hasil asesmen, rata-rata skor,
                distribusi jawaban, dan analisis kesiapan bisnis.
              </p>

              <button
                type="button"
                className="dashboard-feature-button"
                onClick={onOpenStatistics}
              >
                Lihat Statistik →
              </button>
            </article>

            {/* BUSINESS CONSULTATION */}
            <article className="dashboard-feature-card assessment-card">
              <div className="dashboard-card-top">
                <span className="dashboard-card-icon">✳</span>
                <span className="dashboard-card-number">05</span>
              </div>

              <h3>Business Consultation</h3>

              <p>
                Temukan arahan untuk mengembangkan ide,
                menentukan target pasar, strategi pemasaran,
                hingga pengelolaan bisnis.
              </p>

              <button
                type="button"
                className="dashboard-feature-button"
                onClick={onOpenConsultation}
              >
                Ajukan Konsultasi →
              </button>
            </article>

            {/* AI BUSINESS ASSISTANT */}
            <article className="dashboard-feature-card ai-assistant-card">
              <div className="dashboard-card-top">
                <span className="dashboard-card-icon">✧</span>
                <span className="dashboard-card-number">06</span>
              </div>

              <h3>AI Business Assistant</h3>

              <p>
                Diskusikan ide bisnis, temukan inspirasi produk,
                dan dapatkan rekomendasi pengembangan bisnis
                bersama asisten AI Startiva.
              </p>

              <button
                type="button"
                className="dashboard-feature-button"
                onClick={onOpenAI}
              >
                Mulai Diskusi AI →
              </button>
            </article>

          </div>
        </section>

        {/* REMINDER */}
        <section className="dashboard-bottom-card">
          <div>
            <span className="dashboard-eyebrow">
              A LITTLE REMINDER
            </span>

            <h2>Start small. Grow with confidence.</h2>

            <p>
              Kamu tidak harus memiliki bisnis yang sempurna
              untuk memulai. Mulailah dengan mengenali potensimu.
            </p>
          </div>

          <span className="bottom-decoration">✧</span>
        </section>

        {/* FOOTER */}
        <footer className="dashboard-footer">
          <span>startiva.</span>
          <small>Assess. Consult. Grow. © 2026</small>
        </footer>

      </main>
    </div>
  );
}

export default StudentDashboard;
