
import { useCallback, useEffect, useState } from "react";
import {
  UserRound,
  Mail,
  ShieldCheck,
  GraduationCap,
  RefreshCw,
  AlertCircle,
  CalendarDays,
} from "lucide-react";

import "./StudentProfile.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export default function StudentProfile({ user: initialUser }) {
  const [user, setUser] = useState(initialUser || null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchProfile = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const token = localStorage.getItem("startiva_token");

      if (!token) {
        throw new Error("Sesi login tidak ditemukan. Silakan login kembali.");
      }

      const response = await fetch(
        `${API_URL.replace(/\/$/, "")}/user`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Gagal mengambil data profil."
        );
      }

      // Mendukung respons Laravel berbentuk { user: {...} }
      // maupun { data: {...} } atau objek user langsung.
      const profile =
        result.user ||
        result.data?.user ||
        result.data ||
        result;

      if (!profile || !profile.id) {
        throw new Error("Format data profil dari server tidak sesuai.");
      }

      setUser(profile);
      localStorage.setItem("startiva_user", JSON.stringify(profile));
    } catch (err) {
      console.error("Profile error:", err);
      setError(err.message || "Terjadi kesalahan saat memuat profil.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const displayName = user?.name || "Mahasiswa Startiva";
  const displayEmail = user?.email || "-";
  const displayRole = user?.role || "mahasiswa";

  if (loading) {
    return (
      <div className="student-profile-page">
        <div className="student-profile-loading">
          <div className="student-profile-spinner" />
          <h3>Memuat Profil</h3>
          <p>Sedang mengambil informasi akun kamu...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="student-profile-page">
      <header className="student-profile-header">
        <div>
          <span className="student-profile-eyebrow">
            ACCOUNT SETTINGS
          </span>

          <h1>Profil Saya</h1>

          <p>
            Lihat informasi akun dan identitas kamu di Startiva.
          </p>
        </div>

        <button
          type="button"
          className="student-profile-refresh"
          onClick={() => fetchProfile(true)}
          disabled={refreshing}
        >
          <RefreshCw
            size={16}
            className={refreshing ? "profile-spinning" : ""}
          />
          {refreshing ? "Memuat..." : "Refresh Profil"}
        </button>
      </header>

      {error && (
        <div className="student-profile-error">
          <AlertCircle size={19} />
          <div>
            <strong>Profil belum berhasil dimuat</strong>
            <p>{error}</p>
            <button
              type="button"
              onClick={() => fetchProfile(true)}
            >
              Coba Lagi
            </button>
          </div>
        </div>
      )}

      <section className="student-profile-layout">
        {/* PROFILE CARD */}

        <article className="student-profile-card">
          <div className="student-profile-cover" />

          <div className="student-profile-avatar">
            <UserRound size={39} />
          </div>

          <div className="student-profile-identity">
            <h2>{displayName}</h2>
            <p>{displayEmail}</p>

            <span className="student-profile-role">
              <GraduationCap size={15} />
              Mahasiswa
            </span>
          </div>

          <div className="student-profile-card-divider" />

          <div className="student-profile-note">
            <ShieldCheck size={19} />
            <div>
              <strong>Akun Terdaftar</strong>
              <p>
                Kamu terdaftar sebagai pengguna mahasiswa
                di platform Startiva.
              </p>
            </div>
          </div>
        </article>

        {/* ACCOUNT DETAILS */}

        <article className="student-profile-details">
          <div className="student-profile-details-heading">
            <div>
              <span className="student-profile-eyebrow">
                PERSONAL INFORMATION
              </span>
              <h2>Informasi Akun</h2>
              <p>Informasi dasar akun Startiva kamu.</p>
            </div>

            <div className="student-profile-details-icon">
              <UserRound size={21} />
            </div>
          </div>

          <div className="student-profile-field">
            <div className="student-profile-field-icon">
              <UserRound size={18} />
            </div>

            <div>
              <span>Nama Lengkap</span>
              <strong>{displayName}</strong>
            </div>
          </div>

          <div className="student-profile-field">
            <div className="student-profile-field-icon">
              <Mail size={18} />
            </div>

            <div>
              <span>Alamat Email</span>
              <strong>{displayEmail}</strong>
            </div>
          </div>

          <div className="student-profile-field">
            <div className="student-profile-field-icon">
              <GraduationCap size={18} />
            </div>

            <div>
              <span>Jenis Pengguna</span>
              <strong>
                {displayRole === "mahasiswa" ? "Mahasiswa" : displayRole}
              </strong>
            </div>
          </div>

          <div className="student-profile-field">
            <div className="student-profile-field-icon">
              <ShieldCheck size={18} />
            </div>

            <div>
              <span>Status Akun</span>
              <strong className="student-profile-active">
                Aktif
              </strong>
            </div>
          </div>

          <div className="student-profile-info">
            <CalendarDays size={17} />
            <p>
              Data profil ditampilkan berdasarkan informasi akun
              yang tersimpan di server Startiva.
            </p>
          </div>
        </article>
      </section>
    </main>
  );
}
