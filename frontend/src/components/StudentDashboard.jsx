
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
  Menu,
  X,
} from "lucide-react";

import { useState } from "react";
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const firstName = user?.name?.trim()?.split(" ")[0] || "Mahasiswa";
  const fullName = user?.name || "Mahasiswa";
  const initial = firstName.charAt(0).toUpperCase();

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
        "Kamu bisa mengajukan konsultasi dengan konselor sebaya saat membutuhkan teman berbagi.",
      button: "Cari dukungan",
      action: onOpenConsultation,
    },
  ];

  const features = [
    {
      number: "01",
      icon: ClipboardCheck,
      category: "KENALI DIRI",
      title: "RICE Assessment",
      description:
        "Kenali kondisi dan kebutuhan dukunganmu melalui serangkaian pertanyaan reflektif.",
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
        "Lihat kembali hasil assessment yang pernah kamu isi dan perjalananmu dari waktu ke waktu.",
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
        "Berbagi cerita dan ajukan sesi konsultasi bersama konselor sebaya.",
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
        "Mulai percakapan dengan teman AI ketika kamu membutuhkan ruang untuk bercerita.",
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

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="dashboard">
      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <button
          type="button"
          className="sidebar-overlay"
          aria-label="Tutup menu"
          onClick={closeSidebar}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`dashboard-sidebar ${
          sidebarOpen ? "sidebar-open" : ""
        }`}
      >
        <div className="sidebar-top">
          <div className="sidebar-brand">
            <a href="#dashboard" className="dashboard-logo">
              startiva<span>.</span>
            </a>

            <span className="brand-caption">
              PEER SUPPORT PLATFORM
            </span>

            <button
              type="button"
              className="sidebar-close"
              onClick={closeSidebar}
              aria-label="Tutup navigasi"
            >
              <X size={20} />
            </button>
          </div>

          <div className="sidebar-label">MENU UTAMA</div>

          <nav className="sidebar-menu" aria-label="Navigasi utama">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.label}
                  type="button"
                  className={`sidebar-link ${
                    item.active ? "active" : ""
                  }`}
                  onClick={() => {
                    if (item.action) item.action();
                    closeSidebar();
                  }}
                  aria-current={item.active ? "page" : undefined}
                >
                  <Icon size={18} strokeWidth={1.8} />
                  <span>{item.label}</span>
                  {item.active && (
                    <span className="active-indicator" />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="sidebar-help">
            <div className="sidebar-help-icon">
              <Sparkles size={17} />
            </div>

            <span className="help-eyebrow">RUANG CERITA</span>
            <h3>Butuh teman cerita?</h3>

            <p>
              Hermes AI siap menemanimu ketika kamu membutuhkan ruang
              untuk berbagi.
            </p>

            <button type="button" onClick={onOpenAI}>
              Chat Hermes AI
              <ArrowUpRight size={15} />
            </button>
          </div>
        </div>

        {/* ACCOUNT */}
        <div className="sidebar-bottom">
          <button
            type="button"
            className="sidebar-user"
            onClick={onOpenProfile}
          >
            <div className="user-avatar">{initial}</div>

            <div className="user-info">
              <strong title={fullName}>{fullName}</strong>
              <small>Mahasiswa</small>
            </div>

            <ArrowUpRight
              size={15}
              className="user-profile-arrow"
            />
          </button>

          <button
            type="button"
            className="sidebar-logout"
            onClick={onLogout}
          >
            <LogOut size={16} />
            Keluar dari akun
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="dashboard-main" id="dashboard">
        {/* HEADER */}
        <header className="dashboard-header">
          <div className="header-left">
            <button
              type="button"
              className="mobile-menu-button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Buka navigasi"
            >
              <Menu size={21} />
            </button>

            <div>
              <div className="dashboard-breadcrumb">
                STARTIVA <span>/</span> DASHBOARD
              </div>
              <h1>Dashboard</h1>
            </div>
          </div>

          <button
            type="button"
            className="header-profile"
            onClick={onOpenProfile}
          >
            <div className="header-user-info">
              <strong>{fullName}</strong>
              <small>Mahasiswa</small>
            </div>

            <div className="user-avatar header-avatar">
              {initial}
            </div>
          </button>
        </header>

        {/* WELCOME */}
        <section className="welcome-banner">
          <div className="welcome-content">
            <span className="welcome-label">
              <span className="welcome-label-dot" />
              A LITTLE SPACE FOR YOU
            </span>

            <h2>
              Halo, {firstName}.
              <br />
              Senang kamu ada di sini.
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
                <ArrowUpRight size={16} />
              </button>

              <button
                type="button"
                className="welcome-secondary-button"
                onClick={onOpenConsultation}
              >
                Temukan dukungan
                <ArrowRight size={15} />
              </button>
            </div>
          </div>

          {/* PNG IMAGE */}
          <div className="welcome-art" aria-hidden="true">
            <img
              src="/images/startiva-illustration.png"
              alt=""
              className="welcome-image"
            />
          </div>
        </section>

        {/* INTRO */}
        <section className="dashboard-intro">
          <div>
            <span className="section-eyebrow">
              A GENTLE BEGINNING
            </span>

            <h2>Perjalananmu dimulai dari sini.</h2>

            <p>
              Tidak perlu terburu-buru. Ambil satu langkah kecil yang
              terasa nyaman untukmu hari ini.
            </p>
          </div>

          <div className="intro-decoration">
            <span>01</span>
            <div />
            <span>03</span>
          </div>
        </section>

        {/* JOURNEY */}
        <section className="journey-section">
          <div className="journey-grid">
            {journeySteps.map((step) => {
              const Icon = step.icon;

              return (
                <article
                  className="journey-step"
                  key={step.number}
                >
                  <div className="journey-step-top">
                    <span className="journey-number">
                      {step.number}
                    </span>

                    <div className="journey-icon">
                      <Icon size={21} strokeWidth={1.6} />
                    </div>
                  </div>

                  <h3>{step.title}</h3>
                  <p>{step.description}</p>

                  <button
                    type="button"
                    onClick={step.action}
                    disabled={!step.action}
                  >
                    {step.button}
                    <ArrowRight size={15} />
                  </button>
                </article>
              );
            })}
          </div>
        </section>

        {/* FEATURES */}
        <section className="explore-section">
          <div className="section-heading">
            <div>
              <span className="section-eyebrow">
                EXPLORE STARTIVA
              </span>

              <h2>Temukan ruang yang kamu butuhkan.</h2>

              <p>
                Berbagai fitur untuk membantumu memahami diri dan
                mendapatkan dukungan.
              </p>
            </div>
          </div>

          <div className="dashboard-feature-list">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  className={`dashboard-feature-card ${feature.className}`}
                  key={feature.number}
                >
                  <div className="feature-number">
                    {feature.number}
                  </div>

                  <div className="feature-icon">
                    <Icon size={22} strokeWidth={1.6} />
                  </div>

                  <div className="feature-main">
                    <span className="feature-category">
                      {feature.category}
                    </span>

                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </div>

                  <button
                    type="button"
                    className="dashboard-feature-button"
                    onClick={feature.action}
                    disabled={!feature.action}
                    aria-label={feature.actionLabel}
                  >
                    <span>{feature.actionLabel}</span>
                    <ArrowUpRight size={17} />
                  </button>
                </article>
              );
            })}
          </div>
        </section>

        {/* REMINDER */}
        <section className="dashboard-bottom-card">
          <div className="bottom-message-icon">
            <ShieldCheck size={25} strokeWidth={1.5} />
          </div>

          <div className="bottom-message-content">
            <span className="section-eyebrow">
              A NOTE FOR YOU
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

          <div className="bottom-heart" aria-hidden="true">
            <Heart size={42} strokeWidth={1} />
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

          <span className="footer-note">MADE WITH CARE</span>
        </footer>
      </main>
    </div>
  );
}

export default StudentDashboard;
