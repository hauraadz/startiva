
import { useEffect, useState } from "react";
import {
  HeartHandshake,
  MessageCircle,
  ClipboardList,
  Clock,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import "./Consultation.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

function Consultation() {
  const [form, setForm] = useState({
    topic: "",
    description: "",
    preferred_contact: "WhatsApp",
    contact_detail: "",
  });

  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("startiva_token");

  const request = async (url, options = {}) => {
    const response = await fetch(`${API_URL}${url}`, {
      ...options,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      const validationMessage = result.errors
        ? Object.values(result.errors).flat()[0]
        : null;

      throw new Error(
        validationMessage ||
          result.message ||
          "Terjadi kesalahan. Silakan coba lagi."
      );
    }

    return result;
  };

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await request("/mahasiswa/consultations");
      setConsultations(result.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.topic.trim() || !form.description.trim()) {
      setError("Topik dan deskripsi konsultasi wajib diisi.");
      return;
    }

    setSubmitting(true);

    try {
      await request("/mahasiswa/consultations", {
        method: "POST",
        body: JSON.stringify({
          topic: form.topic.trim(),
          description: form.description.trim(),
          preferred_contact: form.preferred_contact,
          contact_detail: form.contact_detail.trim(),
        }),
      });

      setSuccess("Pengajuan konsultasi berhasil dikirim.");

      setForm({
        topic: "",
        description: "",
        preferred_contact: "WhatsApp",
        contact_detail: "",
      });

      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatus = (status) => {
    const statuses = {
      pending: {
        label: "Menunggu",
        className: "pending",
        description: "Pengajuan sedang menunggu konselor.",
      },
      accepted: {
        label: "Diterima",
        className: "accepted",
        description: "Konselor telah menerima pengajuanmu.",
      },
      rejected: {
        label: "Ditolak",
        className: "rejected",
        description: "Pengajuan konsultasi tidak dapat diterima.",
      },
      completed: {
        label: "Selesai",
        className: "completed",
        description: "Sesi konsultasi telah selesai.",
      },
    };

    return (
      statuses[status?.toLowerCase()] || {
        label: status || "Menunggu",
        className: "pending",
        description: "",
      }
    );
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <main className="consultation-page">
      <div className="consultation-container">

        <section className="consultation-heading">
          <div>
            <span className="consultation-eyebrow">
              STARTIVA / KONSELING
            </span>

            <h1>Konsultasi Konselor Sebaya</h1>

            <p>
              Tidak harus menghadapi semuanya sendirian.
              Ceritakan hal yang sedang kamu alami dan ajukan
              sesi konsultasi bersama konselor sebaya.
            </p>
          </div>

          <div className="consultation-header-icon">
            <HeartHandshake size={31} strokeWidth={1.7} />
          </div>
        </section>

        {error && (
          <div className="consultation-alert error" role="alert">
            <span>!</span>
            {error}
          </div>
        )}

        {success && (
          <div className="consultation-alert success" role="status">
            <CheckCircle2 size={19} />
            {success}
          </div>
        )}

        <div className="consultation-layout">

          {/* FORM PENGAJUAN */}
          <section className="consultation-form-card">
            <div className="consultation-card-heading">
              <div>
                <span className="consultation-step">
                  FORM PENGAJUAN
                </span>

                <h2>Ajukan Konsultasi</h2>

                <p>
                  Ceritakan topik yang ingin kamu diskusikan
                  bersama konselor sebaya.
                </p>
              </div>

              <div className="consultation-heading-icon">
                <MessageCircle size={21} />
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="consultation-field">
                <label htmlFor="topic">
                  Topik Konsultasi <span>*</span>
                </label>

                <input
                  id="topic"
                  name="topic"
                  type="text"
                  placeholder="Contoh: Kesulitan mengelola stres akademik"
                  value={form.topic}
                  onChange={handleChange}
                  maxLength={255}
                  required
                />

                <small>
                  Tuliskan topik utama yang ingin kamu bicarakan.
                </small>
              </div>

              <div className="consultation-field">
                <label htmlFor="description">
                  Ceritakan Kondisimu <span>*</span>
                </label>

                <textarea
                  id="description"
                  name="description"
                  placeholder="Ceritakan situasi atau hal yang sedang kamu hadapi. Tidak perlu terburu-buru, tuliskan senyamanmu..."
                  value={form.description}
                  onChange={handleChange}
                  rows={6}
                  required
                />

                <small>
                  Informasi ini membantu konselor memahami kebutuhanmu.
                </small>
              </div>

              <div className="consultation-contact-section">
                <div className="contact-section-heading">
                  <h3>Informasi Kontak</h3>
                  <p>
                    Pilih metode komunikasi yang dapat digunakan
                    konselor untuk menghubungimu.
                  </p>
                </div>

                <div className="consultation-field-row">
                  <div className="consultation-field">
                    <label htmlFor="preferred_contact">
                      Metode Kontak
                    </label>

                    <select
                      id="preferred_contact"
                      name="preferred_contact"
                      value={form.preferred_contact}
                      onChange={handleChange}
                    >
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="Email">Email</option>
                      <option value="Telepon">Telepon</option>
                    </select>
                  </div>

                  <div className="consultation-field">
                    <label htmlFor="contact_detail">
                      Nomor atau Alamat Kontak
                    </label>

                    <input
                      id="contact_detail"
                      name="contact_detail"
                      type="text"
                      placeholder={
                        form.preferred_contact === "Email"
                          ? "nama@email.com"
                          : "08xxxxxxxxxx"
                      }
                      value={form.contact_detail}
                      onChange={handleChange}
                      maxLength={255}
                    />
                  </div>
                </div>
              </div>

              <div className="consultation-form-footer">
                <div className="consultation-footer-note">
                  <ShieldCheck size={19} />
                  <p>
                    Gunakan informasi kontak yang aktif agar
                    konselor dapat menghubungimu.
                  </p>
                </div>

                <button
                  type="submit"
                  className="consultation-submit"
                  disabled={submitting}
                >
                  {submitting ? "Mengirim..." : "Kirim Pengajuan"}

                  {!submitting && <ArrowRight size={17} />}
                </button>
              </div>
            </form>
          </section>

          {/* INFORMASI PROSES */}
          <aside className="consultation-side-card">
            <div className="consultation-side-icon">
              <HeartHandshake size={21} />
            </div>

            <span className="side-card-eyebrow">
              PANDUAN KONSELING
            </span>

            <h3>Bagaimana proses konsultasi berlangsung?</h3>

            <p className="side-card-description">
              Berikut tahapan yang akan kamu lalui setelah
              mengirim pengajuan konsultasi.
            </p>

            <div className="consultation-process">
              <div className="process-item">
                <span className="process-number">01</span>
                <div>
                  <strong>Kirim Pengajuan</strong>
                  <p>
                    Ceritakan kebutuhan dan topik yang ingin
                    kamu diskusikan.
                  </p>
                </div>
              </div>

              <div className="process-item">
                <span className="process-number">02</span>
                <div>
                  <strong>Menunggu Konselor</strong>
                  <p>
                    Konselor sebaya akan meninjau pengajuan
                    yang masuk.
                  </p>
                </div>
              </div>

              <div className="process-item">
                <span className="process-number">03</span>
                <div>
                  <strong>Mulai Konsultasi</strong>
                  <p>
                    Setelah diterima, konselor dapat
                    menghubungimu melalui kontak yang diberikan.
                  </p>
                </div>
              </div>
            </div>

            <div className="consultation-side-note">
              <strong>Kamu tidak sendirian</strong>
              <p>
                Konseling sebaya merupakan ruang untuk berbagi
                cerita dan mendapatkan dukungan. Jika kamu
                membutuhkan bantuan profesional, konselor dapat
                membantu mengarahkanmu ke layanan yang sesuai.
              </p>
            </div>
          </aside>
        </div>

        {/* RIWAYAT KONSULTASI */}
        <section className="consultation-history">
          <div className="consultation-history-heading">
            <div>
              <span className="consultation-step">
                AKTIVITAS KAMU
              </span>

              <h2>Riwayat Konsultasi</h2>

              <p>
                Pantau status pengajuan konsultasimu di sini.
              </p>
            </div>

            <span className="consultation-count">
              {consultations.length} Pengajuan
            </span>
          </div>

          {loading ? (
            <div className="consultation-empty">
              <div className="consultation-history-loader"></div>
              <p>Memuat riwayat konsultasi...</p>
            </div>
          ) : consultations.length === 0 ? (
            <div className="consultation-empty">
              <div className="empty-history-icon">
                <ClipboardList size={22} />
              </div>

              <h3>Belum Ada Konsultasi</h3>

              <p>
                Pengajuan konsultasi yang kamu kirim akan
                muncul di bagian ini.
              </p>
            </div>
          ) : (
            <div className="consultation-history-list">
              {consultations.map((item) => {
                const status = getStatus(item.status);

                return (
                  <article
                    className="consultation-history-item"
                    key={item.id}
                  >
                    <div className="history-item-main">
                      <div className="history-item-icon">
                        <MessageCircle size={20} />
                      </div>

                      <div className="history-item-content">
                        <h3>{item.topic}</h3>

                        <p className="history-description">
                          {item.description}
                        </p>

                        <span className="history-date">
                          Diajukan {formatDate(item.created_at)}
                        </span>
                      </div>
                    </div>

                    <div className="history-item-status">
                      <span
                        className={`consultation-status ${status.className}`}
                      >
                        {status.label}
                      </span>

                      <span className="history-contact">
                        {status.description}
                      </span>

                      <span className="history-contact">
                        Kontak: {item.preferred_contact || "-"}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default Consultation;
