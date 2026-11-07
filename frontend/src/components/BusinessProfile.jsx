
import { useEffect, useState } from "react";
import axios from "axios";
import "./BusinessProfile.css";

const API_URL = import.meta.env.VITE_API_URL;

const initialForm = {
  business_name: "",
  business_stage: "exploring",
  business_category: "",
  business_idea: "",
  product_description: "",
  target_market: "",
};

const stageOptions = [
  { value: "exploring", label: "Masih mencari ide bisnis" },
  { value: "idea_only", label: "Baru memiliki ide bisnis" },
  { value: "starting", label: "Sedang memulai bisnis" },
  { value: "operating", label: "Sudah menjalankan bisnis" },
];

function BusinessProfile() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBusinessProfile = async () => {
      const token = localStorage.getItem("startiva_token");

      if (!API_URL) {
        setError("API URL belum dikonfigurasi. Periksa file .env.");
        setLoading(false);
        return;
      }

      if (!token) {
        setError("Sesi login tidak ditemukan. Silakan login kembali.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${API_URL}/business-profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        const data = response.data?.data;

        if (data) {
          setForm({
            business_name: data.business_name || "",
            business_stage: data.business_stage || "exploring",
            business_category: data.business_category || "",
            business_idea: data.business_idea || "",
            product_description: data.product_description || "",
            target_market: data.target_market || "",
          });
        }
      } catch (err) {
        console.error("Fetch business profile error:", err);

        if (err.response?.status === 401) {
          setError("Sesi login telah berakhir. Silakan login kembali.");
        } else if (err.response?.status === 404) {
          setForm(initialForm);
        } else {
          setError(
            err.response?.data?.message ||
            "Gagal mengambil data profil bisnis."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setMessage("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    const token = localStorage.getItem("startiva_token");

    if (!token) {
      setError("Sesi login tidak ditemukan. Silakan login kembali.");
      return;
    }

    if (!API_URL) {
      setError("API URL belum dikonfigurasi.");
      return;
    }

    setSaving(true);

    try {
      const response = await axios.post(
        `${API_URL}/business-profile`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      setMessage(
        response.data?.message || "Profil bisnis berhasil disimpan!"
      );

      if (response.data?.data) {
        const data = response.data.data;

        setForm({
          business_name: data.business_name || "",
          business_stage: data.business_stage || "exploring",
          business_category: data.business_category || "",
          business_idea: data.business_idea || "",
          product_description: data.product_description || "",
          target_market: data.target_market || "",
        });
      }
    } catch (err) {
      console.error("Save business profile error:", err);

      if (err.response?.status === 401) {
        setError("Sesi login telah berakhir. Silakan login kembali.");
      } else if (err.response?.status === 422) {
        const validationErrors = err.response.data?.errors;

        if (validationErrors) {
          setError(
            Object.values(validationErrors).flat().join(" ")
          );
        } else {
          setError(
            err.response.data?.message || "Data profil tidak valid."
          );
        }
      } else {
        setError(
          err.response?.data?.message ||
          "Terjadi kesalahan saat menyimpan profil."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="business-profile-page">
        <div className="profile-loading">
          <div className="profile-loader"></div>
          <p>Memuat profil bisnis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="business-profile-page">
      <div className="business-profile-container">

        <div className="profile-page-header">
          <div>
            <span className="profile-eyebrow">STARTIVA / BUSINESS PROFILE</span>
            <h1>Profil Bisnis</h1>
            <p>
              Kenali dan ceritakan bisnis yang ingin kamu bangun.
              Mulai dari ide sederhana hingga bisnis yang sudah berjalan.
            </p>
          </div>

          <div className="profile-header-icon">
            <span>BP</span>
          </div>
        </div>

        <div className="profile-info-banner">
          <div className="profile-info-icon">i</div>
          <div>
            <strong>Mengapa profil bisnis penting?</strong>
            <p>
              Informasi ini membantu Startiva memahami kondisi bisnismu
              dan menjadi dasar dalam proses penilaian kesiapan bisnis
              serta rekomendasi pengembangannya.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="business-profile-form">

          <div className="profile-section">
            <div className="profile-section-heading">
              <div className="section-number">01</div>
              <div>
                <h3>Informasi Dasar</h3>
                <p>Kenali identitas dan tahap perkembangan bisnismu.</p>
              </div>
            </div>

            <div className="profile-form-grid">
              <div className="form-group">
                <label htmlFor="business_name">
                  Nama Bisnis
                  <span className="optional-label">Opsional</span>
                </label>
                <input
                  id="business_name"
                  type="text"
                  name="business_name"
                  value={form.business_name}
                  onChange={handleChange}
                  placeholder="Contoh: Startiva Creative Studio"
                />
              </div>

              <div className="form-group">
                <label htmlFor="business_category">
                  Kategori Bisnis
                  <span className="optional-label">Opsional</span>
                </label>
                <input
                  id="business_category"
                  type="text"
                  name="business_category"
                  value={form.business_category}
                  onChange={handleChange}
                  placeholder="Contoh: Kuliner, Fashion, Digital"
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="business_stage">
                  Status Bisnis <span className="required-label">*</span>
                </label>
                <select
                  id="business_stage"
                  name="business_stage"
                  value={form.business_stage}
                  onChange={handleChange}
                  required
                >
                  {stageOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <small>
                  Pilih kondisi yang paling menggambarkan bisnismu saat ini.
                </small>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <div className="profile-section-heading">
              <div className="section-number">02</div>
              <div>
                <h3>Tentang Bisnismu</h3>
                <p>Jelaskan ide serta produk atau layanan yang ditawarkan.</p>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="business_idea">
                Ide Bisnis
                <span className="optional-label">Opsional</span>
              </label>
              <textarea
                id="business_idea"
                name="business_idea"
                value={form.business_idea}
                onChange={handleChange}
                placeholder="Ceritakan ide bisnis yang ingin kamu kembangkan..."
                rows={4}
              />
            </div>

            <div className="form-group">
              <label htmlFor="product_description">
                Deskripsi Produk atau Layanan
                <span className="optional-label">Opsional</span>
              </label>
              <textarea
                id="product_description"
                name="product_description"
                value={form.product_description}
                onChange={handleChange}
                placeholder="Jelaskan produk atau layanan yang ditawarkan, termasuk keunggulannya..."
                rows={4}
              />
            </div>
          </div>

          <div className="profile-section">
            <div className="profile-section-heading">
              <div className="section-number">03</div>
              <div>
                <h3>Target Pasar</h3>
                <p>Tentukan siapa calon pelanggan yang ingin kamu jangkau.</p>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="target_market">
                Target Pasar
                <span className="optional-label">Opsional</span>
              </label>
              <textarea
                id="target_market"
                name="target_market"
                value={form.target_market}
                onChange={handleChange}
                placeholder="Contoh: Mahasiswa, pekerja muda, atau masyarakat umum..."
                rows={4}
              />
            </div>
          </div>

          {(message || error) && (
            <div
              className={`profile-feedback ${error ? "feedback-error" : "feedback-success"}`}
              role={error ? "alert" : "status"}
            >
              <span className="feedback-icon">
                {error ? "!" : "✓"}
              </span>
              <p>{error || message}</p>
            </div>
          )}

          <div className="profile-form-footer">
            <div className="profile-footer-note">
              <span>*</span>
              Status bisnis wajib diisi.
            </div>

            <button
              type="submit"
              className="profile-save-button"
              disabled={saving}
            >
              {saving ? (
                <>
                  <span className="button-spinner"></span>
                  Menyimpan...
                </>
              ) : (
                <>
                  Simpan Profil
                  <span>→</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default BusinessProfile;
