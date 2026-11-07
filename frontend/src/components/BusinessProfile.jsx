
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
          // Profil belum tersedia, gunakan form kosong.
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

      // Perbarui form jika API mengembalikan data terbaru.
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
            Object.values(validationErrors)
              .flat()
              .join(" ")
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
        <div className="business-profile-card">
          <p>Memuat profil bisnis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="business-profile-page">
      <div className="business-profile-card">
        <h2>Profil Bisnis</h2>

        <p>
          Ceritakan tentang bisnis atau ide yang ingin kamu kembangkan.
          Informasi ini akan digunakan sebagai dasar penilaian kesiapan
          bisnis.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="business_name">
              Nama Bisnis
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
            <label htmlFor="business_stage">
              Status Bisnis <span>*</span>
            </label>

            <select
              id="business_stage"
              name="business_stage"
              value={form.business_stage}
              onChange={handleChange}
              required
            >
              <option value="exploring">
                Masih mencari ide bisnis
              </option>

              <option value="idea_only">
                Baru memiliki ide bisnis
              </option>

              <option value="starting">
                Sedang memulai bisnis
              </option>

              <option value="operating">
                Sudah menjalankan bisnis
              </option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="business_category">
              Kategori Bisnis
            </label>

            <input
              id="business_category"
              type="text"
              name="business_category"
              value={form.business_category}
              onChange={handleChange}
              placeholder="Contoh: Kuliner, Fashion, Digital Services"
            />
          </div>

          <div className="form-group">
            <label htmlFor="business_idea">
              Ide Bisnis
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
            </label>

            <textarea
              id="product_description"
              name="product_description"
              value={form.product_description}
              onChange={handleChange}
              placeholder="Jelaskan produk atau layanan yang ditawarkan..."
              rows={4}
            />
          </div>

          <div className="form-group">
            <label htmlFor="target_market">
              Target Pasar
            </label>

            <textarea
              id="target_market"
              name="target_market"
              value={form.target_market}
              onChange={handleChange}
              placeholder="Siapa target pengguna atau pelanggan bisnis kamu?"
              rows={4}
            />
          </div>

          {message && (
            <p className="success-message" role="status">
              {message}
            </p>
          )}

          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}

          <button type="submit" disabled={saving}>
            {saving ? "Menyimpan..." : "Simpan Profil"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default BusinessProfile;
