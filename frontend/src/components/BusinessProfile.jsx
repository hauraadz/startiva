
import { useEffect, useState } from "react";
import axios from "axios";
import "./BusinessProfile.css";

const API_URL = import.meta.env.VITE_API_URL;

function BusinessProfile() {
  const [form, setForm] = useState({
    business_name: "",
    business_stage: "exploring",
    business_category: "",
    business_idea: "",
    product_description: "",
    target_market: "",
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("startiva_token");

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };

  useEffect(() => {
    axios
      .get(`${API_URL}/business-profile`, { headers })
      .then((response) => {
        if (response.data.data) {
          setForm({
            ...form,
            ...response.data.data,
            business_name: response.data.data.business_name || "",
            business_category: response.data.data.business_category || "",
            business_idea: response.data.data.business_idea || "",
            product_description: response.data.data.product_description || "",
            target_market: response.data.data.target_market || "",
          });
        }
      })
      .catch(() => setError("Gagal mengambil data profil bisnis."))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await axios.post(`${API_URL}/business-profile`, form, { headers });
      setMessage("Profil bisnis berhasil disimpan!");
    } catch (err) {
      setError(
        err.response?.data?.message || "Terjadi kesalahan saat menyimpan profil."
      );
    }
  };

  if (loading) return <p>Memuat profil bisnis...</p>;

  return (
    <div className="business-profile-page">
      <div className="business-profile-card">
        <h2>Profil Bisnis</h2>
        <p>Ceritakan tentang bisnis atau ide yang ingin kamu kembangkan.</p>

        <form onSubmit={handleSubmit}>
          <label>Nama Bisnis</label>
          <input
            name="business_name"
            value={form.business_name}
            onChange={handleChange}
            placeholder="Contoh: Startiva Creative Studio"
          />

          <label>Status Bisnis *</label>
          <select
            name="business_stage"
            value={form.business_stage}
            onChange={handleChange}
            required
          >
            <option value="operating">Sudah menjalankan bisnis</option>
            <option value="starting">Sedang memulai bisnis</option>
            <option value="idea_only">Baru memiliki ide bisnis</option>
            <option value="exploring">Masih mencari ide bisnis</option>
          </select>

          <label>Kategori Bisnis</label>
          <input
            name="business_category"
            value={form.business_category}
            onChange={handleChange}
            placeholder="Contoh: Digital Services"
          />

          <label>Ide Bisnis</label>
          <textarea
            name="business_idea"
            value={form.business_idea}
            onChange={handleChange}
            placeholder="Ceritakan ide bisnis kamu..."
          />

          <label>Deskripsi Produk atau Layanan</label>
          <textarea
            name="product_description"
            value={form.product_description}
            onChange={handleChange}
            placeholder="Jelaskan produk atau layanan yang ditawarkan..."
          />

          <label>Target Pasar</label>
          <textarea
            name="target_market"
            value={form.target_market}
            onChange={handleChange}
            placeholder="Siapa target pengguna atau pelanggan kamu?"
          />

          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}

          <button type="submit">Simpan Profil</button>
        </form>
      </div>
    </div>
  );
}

export default BusinessProfile;
