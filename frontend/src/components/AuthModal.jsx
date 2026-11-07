
import { useState } from "react";
import axios from "axios";
import "./AuthModal.css";

function AuthModal({ mode = "login", onClose, onSuccess }) {
  const [formMode, setFormMode] = useState(mode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const switchMode = (nextMode) => {
    setFormMode(nextMode);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (formMode === "register" && password !== passwordConfirmation) {
      setError("Konfirmasi password tidak sama.");
      return;
    }

    setLoading(true);

    try {
      const endpoint =
        formMode === "register" ? "/register" : "/login";

      const payload =
        formMode === "register"
          ? {
              name,
              email,
              password,
              password_confirmation: passwordConfirmation,
            }
          : {
              email,
              password,
            };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}${endpoint}`,
        payload,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      const { token, user } = response.data;

      localStorage.setItem("startiva_token", token);
      localStorage.setItem("startiva_user", JSON.stringify(user));

      setSuccess(response.data.message || "Berhasil!");

      onSuccess(user, token);
    } catch (err) {
      const responseData = err.response?.data;

      if (responseData?.errors) {
        const firstError = Object.values(responseData.errors)[0];
        setError(Array.isArray(firstError) ? firstError[0] : firstError);
      } else {
        setError(
          responseData?.message ||
            "Tidak dapat terhubung ke server. Coba lagi."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div
        className="auth-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <button className="auth-close" onClick={onClose} type="button">
          ×
        </button>

        <div className="auth-brand">
          startiva<span>.</span>
        </div>

        <div className="auth-heading">
          <span className="auth-label">
            {formMode === "register" ? "JOIN STARTIVA" : "WELCOME BACK"}
          </span>

          <h2>
            {formMode === "register"
              ? "Start your journey."
              : "Let's get started."}
          </h2>

          <p>
            {formMode === "register"
              ? "Buat akun dan mulai kenali potensi bisnismu."
              : "Masuk untuk melanjutkan perjalanan bisnismu."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {formMode === "register" && (
            <div className="auth-field">
              <label>Nama Lengkap</label>
              <input
                type="text"
                placeholder="Masukkan nama lengkap"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </div>
          )}

          <div className="auth-field">
            <label>Email</label>
            <input
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <label>Password</label>
            <input
              type="password"
              placeholder="Minimal 8 karakter"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={8}
              required
            />
          </div>

          {formMode === "register" && (
            <div className="auth-field">
              <label>Konfirmasi Password</label>
              <input
                type="password"
                placeholder="Masukkan ulang password"
                value={passwordConfirmation}
                onChange={(event) =>
                  setPasswordConfirmation(event.target.value)
                }
                minLength={8}
                required
              />
            </div>
          )}

          {error && <div className="auth-message error">{error}</div>}
          {success && <div className="auth-message success">{success}</div>}

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading
              ? "Memproses..."
              : formMode === "register"
              ? "Buat Akun"
              : "Masuk"}
            {!loading && <span>→</span>}
          </button>
        </form>

        <div className="auth-switch">
          {formMode === "register" ? (
            <>
              Sudah punya akun?{" "}
              <button type="button" onClick={() => switchMode("login")}>
                Masuk
              </button>
            </>
          ) : (
            <>
              Belum punya akun?{" "}
              <button type="button" onClick={() => switchMode("register")}>
                Daftar sekarang
              </button>
            </>
          )}
        </div>

        <div className="auth-footnote">
          Assess. Consult. Grow.
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
