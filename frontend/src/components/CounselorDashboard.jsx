import { useCallback, useEffect, useState } from "react";

import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Clock3,
  CheckCircle2,
  XCircle,
  LogOut,
  ArrowRight,
  RefreshCw,
  MessageCircle,
  CalendarDays,
  UserRound,
} from "lucide-react";

import "./CounselorDashboard.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

function CounselorDashboard({
  user,
  onLogout,
  onOpenConsultation,
  onOpenStatistics,
}) {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  const token = localStorage.getItem("startiva_token");

  // =========================================
  // MENGAMBIL DATA KONSULTASI
  // =========================================

  const fetchConsultations = useCallback(async (isRefresh = false) => {
    if (!token) {
      setError("Sesi login tidak ditemukan. Silakan login kembali.");
      setLoading(false);
      setRefreshing(false);
      return;
    }

    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const response = await fetch(
        `${API_URL}/konselor/consultations`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.message || "Gagal mengambil data konsultasi."
        );
      }

      const data = Array.isArray(result)
        ? result
        : Array.isArray(result.data)
          ? result.data
          : [];

      setConsultations(data);
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat mengambil data.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  useEffect(() => {
    fetchConsultations();
  }, [fetchConsultations]);


  // =========================================
  // MENGUBAH STATUS KONSULTASI
  // =========================================

  const updateStatus = async (id, status) => {
    const confirmation = window.confirm(
      status === "accepted"
        ? "Terima pengajuan konsultasi ini?"
        : status === "rejected"
          ? "Tolak pengajuan konsultasi ini?"
          : "Tandai konsultasi ini sebagai selesai?"
    );

    if (!confirmation) return;

    setUpdatingId(id);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/konselor/consultations/${id}/status`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.message || "Gagal memperbarui status konsultasi."
        );
      }

      await fetchConsultations(true);

    } catch (err) {
      setError(
        err.message || "Terjadi kesalahan saat memperbarui status."
      );
    } finally {
      setUpdatingId(null);
    }
  };


  // =========================================
  // STATISTIK KONSULTASI
  // =========================================

  const pendingCount = consultations.filter(
    (item) => item.status === "pending"
  ).length;

  const acceptedCount = consultations.filter(
    (item) => item.status === "accepted"
  ).length;

  const completedCount = consultations.filter(
    (item) => item.status === "completed"
  ).length;


  // =========================================
  // FORMAT TANGGAL
  // =========================================

  const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };


  // =========================================
  // LABEL STATUS
  // =========================================

  const getStatusLabel = (status) => {
    const labels = {
      pending: "Menunggu",
      accepted: "Diterima",
      rejected: "Ditolak",
      completed: "Selesai",
    };

    return labels[status] || status;
  };


  // =========================================
  // RENDER DASHBOARD
  // =========================================

  return (
    <div className="counselor-dashboard">

      {/* SIDEBAR */}

      <aside className="counselor-sidebar">

        <a
          href="#dashboard"
          className="counselor-logo"
          onClick={(event) => event.preventDefault()}
        >
          startiva<span>.</span>
        </a>

        <div className="counselor-sidebar-label">
          WORKSPACE
        </div>

        <nav className="counselor-nav">

          <button className="counselor-nav-item active">
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </button>

          <button
            className="counselor-nav-item"
            onClick={onOpenConsultation}
          >
            <ClipboardList size={18} />

            <span>Pengajuan Konsultasi</span>

            {pendingCount > 0 && (
              <span className="counselor-nav-badge">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            className="counselor-nav-item"
            onClick={onOpenStatistics}
          >
            <Users size={18} />
            <span>Statistik Asesmen</span>
          </button>

        </nav>


        {/* SIDEBAR BOTTOM */}

        <div className="counselor-sidebar-bottom">

          <div className="counselor-help-card">

            <div className="counselor-help-icon">
              <MessageCircle size={19} />
            </div>

            <strong>Be a good listener.</strong>

            <p>
              Setiap cerita layak didengarkan dengan empati.
            </p>

          </div>

          <button
            className="counselor-logout"
            onClick={onLogout}
          >
            <LogOut size={17} />
            Keluar
          </button>

        </div>

      </aside>


      {/* MAIN CONTENT */}

      <main className="counselor-main">

        {/* TOPBAR */}

        <header className="counselor-topbar">

          <div>
            <span className="counselor-topbar-label">
              COUNSELOR WORKSPACE
            </span>

            <h2>Dashboard Konselor</h2>
          </div>

          <div className="counselor-user">

            <div className="counselor-user-avatar">
              <UserRound size={20} />
            </div>

            <div>
              <strong>{user?.name || "Konselor"}</strong>
              <span>Konselor Sebaya</span>
            </div>

          </div>

        </header>


        {/* WELCOME SECTION */}

        <section className="counselor-welcome">

          <div>

            <span className="counselor-welcome-label">
              YOUR SPACE TO MAKE A DIFFERENCE
            </span>

            <h1>
              Halo, {user?.name?.split(" ")[0] || "Konselor"}!
            </h1>

            <p>
              Terima kasih sudah menjadi ruang aman bagi mahasiswa
              untuk bercerita dan mendapatkan dukungan.
            </p>

          </div>

          <div className="counselor-welcome-icon">
            <MessageCircle size={48} />
          </div>

        </section>


        {/* STATISTICS */}

        <section className="counselor-stat-grid">

          <article className="counselor-stat-card">

            <div className="counselor-stat-icon pending">
              <Clock3 size={21} />
            </div>

            <span>Pengajuan Menunggu</span>

            <strong>{pendingCount}</strong>

            <small>Perlu ditinjau</small>

          </article>


          <article className="counselor-stat-card">

            <div className="counselor-stat-icon accepted">
              <CheckCircle2 size={21} />
            </div>

            <span>Konsultasi Aktif</span>

            <strong>{acceptedCount}</strong>

            <small>Sudah diterima</small>

          </article>


          <article className="counselor-stat-card">

            <div className="counselor-stat-icon completed">
              <ClipboardList size={21} />
            </div>

            <span>Konsultasi Selesai</span>

            <strong>{completedCount}</strong>

            <small>Telah diselesaikan</small>

          </article>

        </section>


        {/* CONSULTATION MANAGEMENT */}

        <section className="counselor-consultation-section">

          <div className="counselor-section-heading">

            <div>

              <span>CONSULTATION MANAGEMENT</span>

              <h2>Pengajuan Konsultasi</h2>

              <p>
                Tinjau pengajuan dan berikan respons kepada mahasiswa.
              </p>

            </div>

            <button
              className="counselor-refresh-button"
              onClick={() => fetchConsultations(true)}
              disabled={loading || refreshing}
            >
              <RefreshCw
                size={15}
                className={refreshing ? "counselor-loading-icon" : ""}
              />

              {refreshing ? "Memuat..." : "Refresh"}
            </button>

          </div>


          {/* ERROR */}

          {error && (
            <div className="counselor-error">
              {error}
            </div>
          )}


          {/* LOADING */}

          {loading ? (

            <div className="counselor-empty">

              <RefreshCw
                size={25}
                className="counselor-loading-icon"
              />

              <p>Memuat pengajuan konsultasi...</p>

            </div>

          ) : consultations.length === 0 ? (

            /* EMPTY STATE */

            <div className="counselor-empty">

              <div className="counselor-empty-icon">
                <ClipboardList size={30} />
              </div>

              <h3>Belum ada pengajuan konsultasi</h3>

              <p>
                Pengajuan dari mahasiswa akan muncul di sini.
              </p>

            </div>

          ) : (

            /* CONSULTATION LIST */

            <div className="counselor-consultation-list">

              {consultations.map((item) => (

                <article
                  className="counselor-consultation-card"
                  key={item.id}
                >

                  {/* STUDENT INFORMATION */}

                  <div className="counselor-consultation-top">

                    <div className="counselor-student-avatar">
                      <UserRound size={21} />
                    </div>

                    <div className="counselor-student-info">

                      <strong>
                        {item.user?.name || "Mahasiswa"}
                      </strong>

                      <span>
                        {item.user?.email || "Email tidak tersedia"}
                      </span>

                    </div>

                    <span
                      className={`counselor-status ${item.status}`}
                    >
                      {getStatusLabel(item.status)}
                    </span>

                  </div>


                  {/* CONSULTATION DETAIL */}

                  <div className="counselor-consultation-detail">

                    <h3>{item.topic}</h3>

                    <p>{item.description}</p>

                    <div className="counselor-detail-meta">

                      <span>
                        <CalendarDays size={14} />
                        {formatDate(item.created_at)}
                      </span>

                      <span>
                        <MessageCircle size={14} />
                        {item.preferred_contact || "Kontak belum dipilih"}
                      </span>

                    </div>

                    {item.contact_detail && (

                      <div className="counselor-contact-detail">
                        Detail kontak: {item.contact_detail}
                      </div>

                    )}

                  </div>


                  {/* ACTION BUTTONS */}

                  {item.status === "pending" && (

                    <div className="counselor-card-actions">

                      <button
                        className="counselor-reject-button"
                        disabled={updatingId === item.id}
                        onClick={() =>
                          updateStatus(item.id, "rejected")
                        }
                      >
                        <XCircle size={16} />

                        Tolak
                      </button>


                      <button
                        className="counselor-accept-button"
                        disabled={updatingId === item.id}
                        onClick={() =>
                          updateStatus(item.id, "accepted")
                        }
                      >
                        <CheckCircle2 size={16} />

                        {updatingId === item.id
                          ? "Memproses..."
                          : "Terima Pengajuan"}
                      </button>

                    </div>

                  )}


                  {item.status === "accepted" && (

                    <div className="counselor-card-actions">

                      <button
                        className="counselor-accept-button"
                        disabled={updatingId === item.id}
                        onClick={() =>
                          updateStatus(item.id, "completed")
                        }
                      >
                        <CheckCircle2 size={16} />

                        {updatingId === item.id
                          ? "Memproses..."
                          : "Tandai Selesai"}
                      </button>

                    </div>

                  )}

                </article>

              ))}

            </div>

          )}


          {/* VIEW ALL */}

          <button
            className="counselor-view-all"
            onClick={onOpenConsultation}
          >
            Lihat halaman konsultasi
            <ArrowRight size={16} />
          </button>

        </section>

      </main>

    </div>
  );
}

export default CounselorDashboard;
