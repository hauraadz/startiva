
import { useState } from "react";
import axios from "axios";
import {
  X,
  Eye,
  EyeOff,
  GraduationCap,
  Users,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import "./AuthModal.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

function AuthModal({ mode = "login", onClose, onSuccess }) {
  const [formMode, setFormMode] = useState(mode);
  const [role, setRole] = useState("mahasiswa");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [registrationCode, setRegistrationCode] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const isRegister = formMode === "register";
  const isCounselor = role === "konselor";

  const switchMode = (nextMode) => {
    setFormMode(nextMode);
    setError("");
    setFieldErrors({});
    setPassword("");
    setPasswordConfirmation("");
    setRegistrationCode("");
  };

  const handleRoleChange = (nextRole) => {
    setRole(nextRole);
    setError("");
    setFieldErrors({});
    setRegistrationCode("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setFieldErrors({});

    if (isRegister && password !== passwordConfirmation) {
      setError("Konfirmasi password tidak sama.");
      return;
    }

    if (isRegister && isCounselor && !registrationCode.trim()) {
      setError("Kode registrasi konselor wajib diisi.");
      return;
    }

    setLoading(true);

    try {
      let endpoint = "/login";
      let payload = {
        email: email.trim(),
        password,
      };

      if (isRegister) {
        endpoint = isCounselor
          ? "/register/counselor"
          : "/register";

        payload = {
          name: name.trim(),
          email: email.trim(),
          password,
          password_confirmation: passwordConfirmation,
        };

        if (isCounselor) {
          payload.registration_code = registrationCode.trim();
        }
      }

      const response = await axios.post(
        `${API_URL}${endpoint}`,
        payload,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      const { token, user } = response.data;

      if (!token || !user) {
        throw new Error("Respons autentikasi dari server tidak lengkap.");
      }

      localStorage.setItem("startiva_token", token);
      localStorage.setItem("startiva_user", JSON.stringify(user));

      onSuccess(user, token);
    } catch (err) {
      const responseData = err.response?.data;

      if (responseData?.errors) {
        setFieldErrors(responseData.errors);

        const firstError = Object.values(responseData.errors)[0];

        setError(
          Array.isArray(firstError)
            ? firstError[0]
            : String(firstError)
        );
      } else {
        setError(
          responseData?.message ||
            err.message ||
            "Tidak dapat terhubung ke server. Silakan coba lagi."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const getFieldError = (field) => {
    const value = fieldErrors[field];

    if (!value) return null;

    return Array.isArray(value) ? value[0] : value;
  };

  return (
    <div
      className="auth-overlay"
      onClick={onClose}
    >
      <div
        className="auth-modal"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
      >
        <button
          className="auth-close"
          type="button"
          onClick={onClose}
          aria-label="Tutup"
        >
          <X size={20} />
        </button>

        {/* BRAND */}
        <div className="auth-brand">
          startiva<span>.</span>
        </div>

        {/* HEADING */}
        <div className="auth-heading">
          <span className="auth-label">
            {isRegister ? "JOIN STARTIVA" : "WELCOME BACK"}
          </span>

          <h2 id="auth-title">
            {isRegister
              ? "Start your journey."
              : "Welcome back."}
          </h2>

          <p>
            {isRegister
              ? "Bergabunglah dan temukan dukungan yang kamu butuhkan."
              : "Masuk dan lanjutkan perjalananmu bersama Startiva."}
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="auth-form"
        >
          {/* PILIH ROLE */}
          {isRegister && (
            <div className="auth-role-section">
              <label className="auth-role-label">
                Daftar sebagai
              </label>

              <div className="auth-role-options">
                <button
                  type="button"
                  className={`auth-role-option ${
                    role === "mahasiswa" ? "selected" : ""
                  }`}
                  onClick={() => handleRoleChange("mahasiswa")}
                >
                  <GraduationCap size={20} />

                  <span>
                    <strong>Mahasiswa</strong>
                    <small>Mengikuti asesmen</small>
                  </span>
                </button>

                <button
                  type="button"
                  className={`auth-role-option ${
                    role === "konselor" ? "selected" : ""
                  }`}
                  onClick={() => handleRoleChange("konselor")}
                >
                  <Users size={20} />

                  <span>
                    <strong>Konselor</strong>
                    <small>Memberikan pendampingan</small>
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* NAMA */}
          {isRegister && (
            <div className="auth-field">
              <label htmlFor="auth-name">
                Nama Lengkap
              </label>

              <input
                id="auth-name"
                type="text"
                placeholder="Masukkan nama lengkap"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                required
              />

              {getFieldError("name") && (
                <small className="auth-field-error">
                  {getFieldError("name")}
                </small>
              )}
            </div>
          )}

          {/* EMAIL */}
          <div className="auth-field">
            <label htmlFor="auth-email">
              Email
            </label>

            <input
              id="auth-email"
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />

            {getFieldError("email") && (
              <small className="auth-field-error">
                {getFieldError("email")}
              </small>
            )}
          </div>

          {/* PASSWORD */}
          <div className="auth-field">
            <label htmlFor="auth-password">
              Password
            </label>

            <div className="auth-password-wrapper">
              <input
                id="auth-password"
                type={showPassword ? "text" : "password"}
                placeholder="Minimal 8 karakter"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete={
                  isRegister ? "new-password" : "current-password"
                }
                minLength={8}
                required
              />

              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={
                  showPassword ? "Sembunyikan password" : "Tampilkan password"
                }
              >
                {showPassword
                  ? <EyeOff size={18} />
                  : <Eye size={18} />}
              </button>
            </div>

            {getFieldError("password") && (
              <small className="auth-field-error">
                {getFieldError("password")}
              </small>
            )}
          </div>

          {/* KONFIRMASI PASSWORD */}
          {isRegister && (
            <div className="auth-field">
              <label htmlFor="auth-confirm-password">
                Konfirmasi Password
              </label>

              <div className="auth-password-wrapper">
                <input
                  id="auth-confirm-password"
                  type={showConfirmation ? "text" : "password"}
                  placeholder="Masukkan ulang password"
                  value={passwordConfirmation}
                  onChange={(event) =>
                    setPasswordConfirmation(event.target.value)
                  }
                  autoComplete="new-password"
                  minLength={8}
                  required
                />

                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() =>
                    setShowConfirmation(!showConfirmation)
                  }
                  aria-label={
                    showConfirmation
                      ? "Sembunyikan konfirmasi password"
                      : "Tampilkan konfirmasi password"
                  }
                >
                  {showConfirmation
                    ? <EyeOff size={18} />
                    : <Eye size={18} />}
                </button>
              </div>
            </div>
          )}

          {/* KODE REGISTRASI KONSELOR */}
          {isRegister && isCounselor && (
            <div className="auth-field">
              <label htmlFor="auth-registration-code">
                Kode Registrasi Konselor
              </label>

              <div className="auth-password-wrapper">
                <input
                  id="auth-registration-code"
                  type="password"
                  placeholder="Masukkan kode registrasi"
                  value={registrationCode}
                  onChange={(event) =>
                    setRegistrationCode(event.target.value)
                  }
                  autoComplete="off"
                  required
                />
                <ShieldCheck size={18} />
              </div>

              <small className="auth-helper-text">
                Kode ini diberikan oleh administrator Startiva.
              </small>

              {getFieldError("registration_code") && (
                <small className="auth-field-error">
                  {getFieldError("registration_code")}
                </small>
              )}
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div
              className="auth-message error"
              role="alert"
            >
              {error}
            </div>
          )}

          {/* SUBMIT */}
          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading
              ? "Memproses..."
              : isRegister
                ? "Buat Akun"
                : "Masuk"}

            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        {/* SWITCH MODE */}
        <div className="auth-switch">
          {isRegister ? (
            <>
              Sudah punya akun?{" "}
              <button
                type="button"
                onClick={() => switchMode("login")}
              >
                Masuk
              </button>
            </>
          ) : (
            <>
              Belum punya akun?{" "}
              <button
                type="button"
                onClick={() => switchMode("register")}
              >
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
