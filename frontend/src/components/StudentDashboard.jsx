
import {
  LayoutDashboard,
  UserRound,
  ClipboardCheck,
  History,
  MessageCircleHeart,
  Sparkles,
  LogOut,
  ArrowUpRight,
  ArrowRight,
  Heart,
  ShieldCheck,
  Compass,
  BookOpenCheck,
} from "lucide-react";

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
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      action: null,
      active: true,
    },
    {
      label: "Profil Saya",
      icon: UserRound,
      action: onOpenProfile,
    },
    {
      label: "RICE Assessment",
      icon: ClipboardCheck,
      action: onOpenAssessment,
    },
    {
      label: "Riwayat Assessment",
      icon: History,
      action: onOpenHistory,
    },
    {
      label: "Konsultasi",
      icon: MessageCircleHeart,
      action: onOpenConsultation,
    },
    {
      label: "Hermes AI",
      icon: Sparkles,
      action: onOpenAI,
    },
  ];

  const features = [
    {
      number: "01",
      icon: ClipboardCheck,
      category: "KENALI DIRI",
      title: "RICE Assessment",
      description:
        "Isi assessment untuk mengenali kondisi dan kebutuhan dukunganmu. Jawab setiap pertanyaan dengan jujur dan nyaman.",
      actionLabel: "Mulai assessment",
      action: onOpenAssessment,
      className: "assessment-feature",
    },
    {
      number: "02",
      icon: History,
      category: "PERJALANANMU",
      title: "Riwayat Assessment",
      description:
        "Lihat kembali hasil assessment yang pernah kamu isi dan pantau perjalananmu dari waktu ke waktu.",
      actionLabel: "Lihat riwayat",
      action: onOpenHistory,
      className: "history-feature",
    },
    {
      number: "03",
      icon: MessageCircleHeart,
      category: "DUKUNGAN SESAMA",
      title: "Konsultasi Konselor",
      description:
        "Ajukan sesi konsultasi dengan konselor sebaya untuk berbagi cerita dan mendapatkan dukungan.",
      actionLabel: "Ajukan konsultasi",
      action: onOpenConsultation,
      className: "consultation-feature",
    },
    {
      number: "04",
      icon: Sparkles,
      category: "AI COMPANION",
      title: "Hermes AI",
      description:
        "Punya sesuatu yang ingin diceritakan? Mulai percakapan dengan teman AI yang siap mendengarkan.",
      actionLabel: "Mulai bercerita",
      action: onOpenAI,
      className: "ai-feature",
    },
    {
      number: "05",
      icon: UserRound,
      category: "AKUNMU",
      title: "Profil Saya",
      description:
        "Periksa dan kelola informasi akunmu agar pengalaman menggunakan Startiva tetap nyaman.",
      actionLabel: "Lihat profil",
      action: onOpenProfile,
      className: "profile-feature",
    },
  ];

  const journeySteps = [
    {
      number: "01",
      icon: Compass,
      title: "Kenali dirimu",
      description:
        "Mulai dengan mengisi RICE Assessment untuk mengenali kondisi dan kebutuhanmu.",
      button: "Isi assessment",
      action: onOpenAssessment,
    },
    {
      number: "02",
      icon: BookOpenCheck,
      title: "Pahami hasilnya",
      description:
        "Pelajari hasil assessment dan temukan gambaran awal mengenai kebutuhan dukunganmu.",
      button: "Lihat riwayat",
      action: onOpenHistory,
    },
    {
      number: "03",
      icon: Heart,
      title: "Temukan dukungan",
      description:
        "Jika membutuhkan teman berbagi, kamu dapat mengajukan konsultasi dengan konselor sebaya.",
      button: "Cari dukungan",
      action: onOpenConsultation,
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
          <span className="brand-caption">
            PEER SUPPORT PLATFORM
          </span>
        </div>

        <div className="sidebar-label">MENU UTAMA</div>

        <nav className="sidebar-menu" aria-label="Navigasi utama">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                type="button"
                className={`sidebar-link ${item.active ? "active" : ""}`}
                onClick={item.action || undefined}
                aria-current={item.active ? "page" : undefined}
              >
                <span className="sidebar-link-icon">
                  <Icon size={18} strokeWidth={1.8} />
                </span>

                <span>{item.label}</span>

                {item.active && (
                  <span className="active-indicator" />
                )}
              </button>
            );
          })}
        </nav>

        {/* AI HELP CARD */}
        <div className="sidebar-help">
          <div className="sidebar-help-icon">
            <Sparkles size={17} strokeWidth={1.8} />
          </div>

          <strong>Butuh teman cerita?</strong>

          <p>
            Kamu bisa mulai bercerita dengan Hermes AI kapan pun
            kamu membutuhkan ruang untuk berbagi.
          </p>

          <button type="button" onClick={onOpenAI}>
            Chat Hermes AI
            <ArrowUpRight size={13} />
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
              <small>Mahasiswa</small>
            </div>
          </div>

          <button
            type="button"
            className="sidebar-logout"
            onClick={onLogout}
          >
            <LogOut size={16} strokeWidth={1.8} />
            Keluar
          </button>

        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="dashboard-main" id="dashboard">

        {/* HEADER */}
        <header className="dashboard-header">

          <div className="header-heading">
            <span className="dashboard-breadcrumb">
              STARTIVA <span>/</span> DASHBOARD
            </span>

            <h1>Dashboard</h1>

            <p>
              Ruang aman untuk mengenali diri dan menemukan dukungan.
            </p>
          </div>

          <div className="header-profile">

            <div className="header-user-info">
              <strong>{fullName}</strong>
              <small>Mahasiswa</small>
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
              YOU ARE NOT ALONE
            </span>

            <h2>
              Halo, {firstName}.
              <br />
              Your feelings matter.
            </h2>

            <p>
              Setiap orang punya cerita dan perjalanan masing-masing.
              Di Startiva, kamu bisa mengenali dirimu, memahami kebutuhanmu,
              dan menemukan dukungan tanpa harus merasa sendirian.
            </p>

            <div className="welcome-actions">

              <button
                type="button"
                className="welcome-primary-button"
                onClick={onOpenAssessment}
              >
                Mulai RICE Assessment
                <ArrowUpRight size={15} />
              </button>

              <button
                type="button"
                className="welcome-secondary-button"
                onClick={onOpenConsultation}
              >
                Temukan dukungan
              </button>

            </div>
          </div>

          {/* HERO DECORATION */}
          <div className="hero-art" aria-hidden="true">

            <div className="hero-orbit orbit-one" />
            <div className="hero-orbit orbit-two" />
            <div className="hero-orbit orbit-three" />

            <div className="hero-center">
              <Heart size={24} strokeWidth={1.5} />
              <small>STARTIVA</small>
            </div>

            <span className="hero-spark spark-one">
              ✧
            </span>

            <span className="hero-spark spark-two">
              ✦
            </span>

            <span className="hero-spark spark-three">
              ✧
            </span>

            <span className="hero-dot dot-one" />
            <span className="hero-dot dot-two" />

          </div>

          <div className="hero-index">
            STARTIVA / 001
          </div>

        </section>

        {/* JOURNEY SECTION */}
        <section className="dashboard-section journey-section">

          <div className="section-heading">
            <div>
              <span className="section-eyebrow">
                YOUR JOURNEY
              </span>

              <h2>Mulai dari langkah kecil</h2>

              <p>
                Tidak perlu terburu-buru. Jalani setiap proses sesuai
                kenyamananmu.
              </p>
            </div>
          </div>

          <div className="journey-grid">

            {journeySteps.map((step) => {
              const Icon = step.icon;

              return (
                <article className="journey-step" key={step.number}>

                  <div className="journey-step-top">

                    <span className="journey-step-icon">
                      {step.number}
                    </span>

                    <span className="journey-step-symbol">
                      <Icon size={21} strokeWidth={1.7} />
                    </span>

                  </div>

                  <h3>{step.title}</h3>

                  <p>{step.description}</p>

                  <button
                    type="button"
                    onClick={step.action}
                  >
                    {step.button}
                    <ArrowRight size={14} />
                  </button>

                </article>
              );
            })}

          </div>
        </section>

        {/* FEATURE SECTION */}
        <section className="dashboard-section explore-section">

          <div className="section-heading feature-heading">
            <div>
              <span className="section-eyebrow">
                EXPLORE STARTIVA
              </span>

              <h2>Ruang dukunganmu</h2>

              <p>
                Temukan fitur yang dapat membantumu dalam perjalanan
                mengenali diri dan mencari dukungan.
              </p>
            </div>
          </div>

          <div className="dashboard-feature-grid">

            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  className={`dashboard-feature-card ${feature.className}`}
                  key={feature.number}
                >

                  <div className="feature-card-top">

                    <div className="feature-icon">
                      <Icon size={21} strokeWidth={1.7} />
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
                    <ArrowUpRight size={15} />
                  </button>

                </article>
              );
            })}

          </div>
        </section>

        {/* SUPPORT MESSAGE */}
        <section className="dashboard-bottom-card">

          <div className="bottom-message-icon">
            <ShieldCheck size={22} strokeWidth={1.7} />
          </div>

          <div className="bottom-message-content">

            <span className="section-eyebrow">
              A GENTLE REMINDER
            </span>

            <h2>
              Kamu tidak harus menghadapi semuanya sendirian.
            </h2>

            <p>
              Tidak apa-apa untuk beristirahat, bercerita, atau meminta
              bantuan. Mengenali perasaan dan mencari dukungan juga
              merupakan bentuk keberanian.
            </p>

          </div>
        </section>

        {/* FOOTER */}
        <footer className="dashboard-footer">

          <a href="#dashboard" className="footer-logo">
            startiva<span>.</span>
          </a>

          <small>
            A safe space to understand yourself. © 2026 Startiva.
          </small>

        </footer>

      </main>
    </div>
  );
}

export default StudentDashboard;
