
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
  const fullName = user?.name || "Mahasiswa";

  const navigation = [
    { label: "Dashboard", icon: "⌂", action: null, active: true },
    { label: "Business Profile", icon: "◇", action: onOpenProfile },
    { label: "Business Assessment", icon: "▤", action: onOpenAssessment },
    { label: "Assessment History", icon: "◷", action: onOpenHistory },
    { label: "Assessment Statistics", icon: "▥", action: onOpenStatistics },
    { label: "Consultation", icon: "◌", action: onOpenConsultation },
    { label: "AI Assistant", icon: "✧", action: onOpenAI },
  ];

  const features = [
    {
      number: "01",
      icon: "◇",
      category: "BUSINESS SETUP",
      title: "Business Profile",
      description:
        "Kenalkan bisnismu melalui informasi ide, kategori, produk, dan target pasar.",
      actionLabel: "Kelola profil",
      action: onOpenProfile,
      className: "profile-feature",
    },
    {
      number: "02",
      icon: "▤",
      category: "SELF ASSESSMENT",
      title: "Business Assessment",
      description:
        "Evaluasi kesiapan bisnis dari aspek produk, pasar, pemasaran, keuangan, dan operasional.",
      actionLabel: "Mulai assessment",
      action: onOpenAssessment,
      className: "assessment-feature",
    },
    {
      number: "03",
      icon: "◷",
      category: "YOUR DEVELOPMENT",
      title: "Assessment History",
      description:
        "Tinjau hasil assessment sebelumnya dan pantau perkembangan kesiapan bisnismu.",
      actionLabel: "Lihat riwayat",
      action: onOpenHistory,
      className: "history-feature",
    },
    {
      number: "04",
      icon: "▥",
      category: "BUSINESS INSIGHTS",
      title: "Assessment Statistics",
      description:
        "Pelajari ringkasan skor, distribusi jawaban, dan statistik hasil assessment.",
      actionLabel: "Lihat statistik",
      action: onOpenStatistics,
      className: "statistics-feature",
    },
    {
      number: "05",
      icon: "◌",
      category: "PERSONAL GUIDANCE",
      title: "Business Consultation",
      description:
        "Dapatkan arahan untuk mengembangkan ide, menentukan pasar, dan strategi bisnis.",
      actionLabel: "Buka konsultasi",
      action: onOpenConsultation,
      className: "consultation-feature",
    },
    {
      number: "06",
      icon: "✧",
      category: "AI POWERED",
      title: "AI Business Assistant",
      description:
        "Diskusikan ide bisnis dan dapatkan rekomendasi pengembangan berdasarkan profil serta assessment-mu.",
      actionLabel: "Mulai diskusi",
      action: onOpenAI,
      className: "ai-feature",
    },
  ];

  return (
    <div className="dashboard">
      {/* SIDEBAR */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">
          <a href="#dashboard" className="dashboard-logo">
            startiva<span>.</span>
          </a>
          <span className="brand-caption">BUSINESS COMPANION</span>
        </div>

        <div className="sidebar-label">WORKSPACE</div>

        <nav className="sidebar-menu" aria-label="Main navigation">
          {navigation.map((item) => (
            <button
              key={item.label}
              type="button"
              className={`sidebar-link ${item.active ? "active" : ""}`}
              onClick={item.action || undefined}
              aria-current={item.active ? "page" : undefined}
            >
              <span className="sidebar-link-icon">{item.icon}</span>
              <span>{item.label}</span>
              {item.active && <span className="active-indicator" />}
            </button>
          ))}
        </nav>

        <div className="sidebar-help">
          <div className="sidebar-help-icon">✦</div>
          <strong>Keep growing!</strong>
          <p>Small steps can lead to meaningful progress.</p>
          <button type="button" onClick={onOpenAI}>
            Talk with AI <span>↗</span>
          </button>
        </div>

        {/* USER ACCOUNT */}
        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <div className="user-avatar">
              {firstName.charAt(0).toUpperCase()}
            </div>

            <div className="user-info">
              <strong title={fullName}>{fullName}</strong>
              <small>Student account</small>
            </div>
          </div>

          <button
            type="button"
            className="sidebar-logout"
            onClick={onLogout}
          >
            <span>↪</span>
            Sign out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="dashboard-main" id="dashboard">
        {/* TOP HEADER */}
        <header className="dashboard-header">
          <div className="header-heading">
            <span className="dashboard-breadcrumb">
              WORKSPACE <span>/</span> OVERVIEW
            </span>
            <h1>Dashboard</h1>
            <p>Manage your business journey in one place.</p>
          </div>

          <div className="header-profile">
            <div className="header-user-info">
              <strong>{fullName}</strong>
              <small>Student workspace</small>
            </div>
            <div className="user-avatar header-avatar">
              {firstName.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* WELCOME HERO */}
        <section className="welcome-banner">
          <div className="welcome-content">
            <span className="welcome-label">
              YOUR BUSINESS JOURNEY STARTS HERE
            </span>

            <h2>
              Hello, {firstName}.
              <br />
              Let's build something meaningful.
            </h2>

            <p>
              Punya ide bisnis? Saatnya mengenali potensinya,
              mengevaluasi kesiapan, dan menemukan langkah
              pengembangan yang tepat bersama Startiva.
            </p>

            <div className="welcome-actions">
              <button
                type="button"
                className="welcome-primary-button"
                onClick={onOpenAssessment}
              >
                Explore assessment <span>↗</span>
              </button>

              <button
                type="button"
                className="welcome-secondary-button"
                onClick={onOpenProfile}
              >
                Set up business profile
              </button>
            </div>
          </div>

          <div className="hero-art" aria-hidden="true">
            <div className="hero-orbit orbit-one" />
            <div className="hero-orbit orbit-two" />
            <div className="hero-orbit orbit-three" />

            <div className="hero-center">
              <span>✦</span>
              <strong>grow</strong>
              <small>YOUR IDEA</small>
            </div>

            <span className="hero-spark spark-one">✧</span>
            <span className="hero-spark spark-two">✦</span>
            <span className="hero-spark spark-three">✧</span>
            <span className="hero-dot dot-one" />
            <span className="hero-dot dot-two" />
          </div>

          <div className="hero-index">STARTIVA / 001</div>
        </section>

        {/* JOURNEY SECTION */}
        <section className="dashboard-section journey-section">
          <div className="section-heading">
            <div>
              <span className="section-eyebrow">GETTING STARTED</span>
              <h2>Your business journey</h2>
              <p>
                Three simple steps to understand and develop your business.
              </p>
            </div>
          </div>

          <div className="journey-grid">
            <article className="journey-step">
              <div className="journey-step-top">
                <span className="journey-step-icon">01</span>
                <span className="journey-step-symbol">◇</span>
              </div>
              <h3>Build your profile</h3>
              <p>
                Ceritakan ide, produk, dan target pasar yang ingin kamu
                kembangkan.
              </p>
              <button type="button" onClick={onOpenProfile}>
                Complete profile <span>→</span>
              </button>
            </article>

            <article className="journey-step">
              <div className="journey-step-top">
                <span className="journey-step-icon">02</span>
                <span className="journey-step-symbol">▤</span>
              </div>
              <h3>Assess your readiness</h3>
              <p>
                Kenali kesiapan bisnismu melalui lima aspek penilaian.
              </p>
              <button type="button" onClick={onOpenAssessment}>
                Take assessment <span>→</span>
              </button>
            </article>

            <article className="journey-step">
              <div className="journey-step-top">
                <span className="journey-step-icon">03</span>
                <span className="journey-step-symbol">✧</span>
              </div>
              <h3>Grow your business</h3>
              <p>
                Gunakan hasil penilaian dan konsultasi untuk menentukan
                langkah berikutnya.
              </p>
              <button type="button" onClick={onOpenAI}>
                Explore recommendations <span>→</span>
              </button>
            </article>
          </div>
        </section>

        {/* FEATURE SECTION */}
        <section className="dashboard-section explore-section">
          <div className="section-heading feature-heading">
            <div>
              <span className="section-eyebrow">EXPLORE YOUR WORKSPACE</span>
              <h2>Everything you need to grow</h2>
              <p>
                Pilih layanan yang sesuai dengan kebutuhan pengembangan
                bisnismu.
              </p>
            </div>
          </div>

          <div className="dashboard-feature-grid">
            {features.map((feature) => (
              <article
                className={`dashboard-feature-card ${feature.className}`}
                key={feature.number}
              >
                <div className="feature-card-top">
                  <div className="feature-icon">
                    {feature.icon}
                  </div>
                  <span className="feature-number">
                    {feature.number}
                  </span>
                </div>

                <span className="feature-category">
                  {feature.category}
                </span>

                <h3>{feature.title}</h3>
                <p>{feature.description}</p>

                <button
                  type="button"
                  className="dashboard-feature-button"
                  onClick={feature.action}
                >
                  {feature.actionLabel}
                  <span>↗</span>
                </button>
              </article>
            ))}
          </div>
        </section>

        {/* BOTTOM MESSAGE */}
        <section className="dashboard-bottom-card">
          <div className="bottom-message-icon">✦</div>

          <div className="bottom-message-content">
            <span className="section-eyebrow">A NOTE FOR YOU</span>
            <h2>Start small. Grow with confidence.</h2>
            <p>
              Kamu tidak harus memiliki bisnis yang sempurna untuk memulai.
              Setiap langkah kecil adalah bagian dari proses bertumbuh.
            </p>
          </div>

          <div className="bottom-decoration" aria-hidden="true">
            <span>✧</span>
            <span>✦</span>
            <span>✧</span>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="dashboard-footer">
          <a href="#dashboard" className="footer-logo">
            startiva<span>.</span>
          </a>
          <small>Assess. Consult. Grow. © 2026 Startiva.</small>
        </footer>
      </main>
    </div>
  );
}

export default StudentDashboard;
