import { useEffect, useState } from "react";
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
  const [businessProfile, setBusinessProfile] = useState(null);
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
      throw new Error(
        result.message || "Terjadi kesalahan. Silakan coba lagi."
      );
    }

    return result;
  };

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [consultationResult, profileResult] = await Promise.all([
        request("/consultations"),
        request("/business-profile").catch(() => null),
      ]);

      setConsultations(consultationResult.data || []);

      const profile = profileResult?.data;
      setBusinessProfile(
        Array.isArray(profile) ? profile[0] || null : profile || null
      );
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
      await request("/consultations", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          business_profile_id: businessProfile?.id || null,
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
      pending: { label: "Menunggu", className: "pending" },
      approved: { label: "Disetujui", className: "approved" },
      accepted: { label: "Disetujui", className: "approved" },
      completed: { label: "Selesai", className: "completed" },
      rejected: { label: "Ditolak", className: "rejected" },
    };

    return (
      statuses[status?.toLowerCase()] || {
        label: status || "Menunggu",
        className: "pending",
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
      <section className="consultation-heading">
        <div>
          <span className="consultation-eyebrow">STARTIVA CONSULTATION</span>
          <h1>Konsultasi Bisnis</h1>
          <p>
            Sampaikan kendala dan kebutuhan bisnismu. Tim konsultan Startiva
            akan membantu memberikan arahan untuk langkah berikutnya.
          </p>
        </div>
      </section>

      {error && <div className="consultation-alert error">{error}</div>}
      {success && (
        <div className="consultation-alert success">{success}</div>
      )}

      <div className="consultation-layout">
        <section className="consultation-form-card">
          <div className="consultation-card-heading">
            <div>
              <span className="consultation-step">FORM PENGAJUAN</span>
              <h2>Ajukan Konsultasi</h2>
              <p>Lengkapi informasi berikut agar kami memahami kebutuhanmu.</p>
            </div>
            <div className="consultation-heading-icon">
              <span>+</span>
            </div>
          </div>

          {businessProfile && (
            <div className="consultation-business-info">
              <span>Bisnis yang terhubung</span>
              <strong>{businessProfile.business_name}</strong>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="consultation-field">
              <label htmlFor="topic">Topik Konsultasi</label>
              <input
                id="topic"
                name="topic"
                type="text"
                placeholder="Contoh: Strategi pemasaran bisnis"
                value={form.topic}
                onChange={handleChange}
                maxLength={255}
                required
              />
            </div>

            <div className="consultation-field">
              <label htmlFor="description">Deskripsi Kebutuhan</label>
              <textarea
                id="description"
                name="description"
                placeholder="Ceritakan kendala atau hal yang ingin kamu diskusikan..."
                value={form.description}
                onChange={handleChange}
                rows={5}
                required
              />
              <span className="field-helper">
                Jelaskan kebutuhanmu secara singkat dan jelas.
              </span>
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
                <label htmlFor="contact_detail">Nomor atau Alamat Kontak</label>
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

            <div className="consultation-form-footer">
              <p>
                Pastikan informasi kontak yang diberikan masih aktif.
              </p>
              <button
                type="submit"
                className="consultation-submit"
                disabled={submitting}
              >
                {submitting ? "Mengirim..." : "Kirim Pengajuan"}
                <span>→</span>
              </button>
            </div>
          </form>
        </section>

        <aside className="consultation-side-card">
          <div className="consultation-side-icon">
            <span>i</span>
          </div>
          <h3>Bagaimana proses konsultasi?</h3>
          <p>
            Setelah pengajuan dikirim, admin akan meninjau kebutuhanmu dan
            menghubungi melalui metode kontak yang dipilih.
          </p>

          <div className="consultation-process">
            <div className="process-item">
              <span className="process-number">01</span>
              <div>
                <strong>Kirim Pengajuan</strong>
                <p>Jelaskan topik dan kebutuhan konsultasimu.</p>
              </div>
            </div>

            <div className="process-item">
              <span className="process-number">02</span>
              <div>
                <strong>Menunggu Tinjauan</strong>
                <p>Admin akan memeriksa pengajuan yang masuk.</p>
              </div>
            </div>

            <div className="process-item">
              <span className="process-number">03</span>
              <div>
                <strong>Hubungi Konsultan</strong>
                <p>Diskusikan kebutuhan bisnis bersama konsultan.</p>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <section className="consultation-history">
        <div className="consultation-history-heading">
          <div>
            <span className="consultation-step">AKTIVITAS KAMU</span>
            <h2>Riwayat Konsultasi</h2>
            <p>Pantau perkembangan pengajuan konsultasimu.</p>
          </div>
          <span className="consultation-count">
            {consultations.length} Pengajuan
          </span>
        </div>

        {loading ? (
          <div className="consultation-empty">Memuat riwayat konsultasi...</div>
        ) : consultations.length === 0 ? (
          <div className="consultation-empty">
            <div className="empty-history-icon">—</div>
            <h3>Belum Ada Konsultasi</h3>
            <p>
              Pengajuan konsultasi yang kamu kirim akan muncul di bagian ini.
            </p>
          </div>
        ) : (
          <div className="consultation-history-list">
            {consultations.map((item) => {
              const status = getStatus(item.status);

              return (
                <article className="consultation-history-item" key={item.id}>
                  <div className="history-item-main">
                    <div className="history-item-icon">C</div>
                    <div>
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
                    <span className={`consultation-status ${status.className}`}>
                      {status.label}
                    </span>
                    <span className="history-contact">
                      {item.preferred_contact || "Kontak belum dipilih"}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default Consultation;