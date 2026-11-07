
import { useCallback, useEffect, useState } from "react";
import "./AssessmentStatistics.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

function formatNumber(value, digits = 2) {
  const number = Number(value);
  return Number.isFinite(number) ? number.toFixed(digits) : "0.00";
}

function formatDate(date) {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "-";

  return parsedDate.toLocaleString("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  });
}

export default function AssessmentStatistics() {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStatistics = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("startiva_token");

      if (!token) {
        throw new Error("Silakan login terlebih dahulu.");
      }

      const response = await fetch(
        `${API_URL.replace(/\/$/, "")}/assessment-statistics/latest`,
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
          result.message || "Gagal mengambil data statistik."
        );
      }

      setStatistics(result.data || null);
    } catch (err) {
      setError(
        err.message || "Terjadi kesalahan saat mengambil data statistik."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  const frequency = statistics?.frequency || {};

  const maxFrequency = Math.max(
    ...[1, 2, 3, 4].map((score) =>
      Number(frequency[String(score)] || 0)
    ),
    1
  );

  const cards = [
    {
      label: "Total Assessment",
      value: statistics?.total_assessments ?? 0,
      description: "Assessment yang telah dikerjakan",
      icon: "01",
      style: "red",
    },
    {
      label: "Total Jawaban",
      value: statistics?.total_responses ?? 0,
      description: "Seluruh jawaban responden",
      icon: "02",
      style: "peach",
    },
    {
      label: "Rata-rata Kesiapan",
      value: `${formatNumber(statistics?.average_score_percentage)}%`,
      description: "Persentase kesiapan bisnis",
      icon: "%",
      style: "rose",
    },
    {
      label: "Mean",
      value: formatNumber(statistics?.mean),
      description: "Rata-rata skor jawaban",
      icon: "μ",
      style: "dark",
    },
  ];

  if (loading) {
    return (
      <div className="statistics-page">
        <div className="statistics-loading">
          <div className="statistics-loader" />
          <h3>Memuat data statistik</h3>
          <p>Mohon tunggu sebentar...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="statistics-page">
        <div className="statistics-header">
          <div>
            <span className="statistics-eyebrow">
              STARTIVA ANALYTICS
            </span>
            <h1>Dashboard Statistik</h1>
            <p>
              Ringkasan hasil pengolahan Business Assessment Startiva.
            </p>
          </div>
        </div>

        <div className="statistics-error">
          <div className="statistics-error-icon">!</div>
          <div>
            <h3>Data belum dapat dimuat</h3>
            <p>{error}</p>
            <button
              type="button"
              className="statistics-refresh"
              onClick={fetchStatistics}
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className="statistics-page">
        <div className="statistics-header">
          <div>
            <span className="statistics-eyebrow">
              STARTIVA ANALYTICS
            </span>
            <h1>Dashboard Statistik</h1>
            <p>
              Ringkasan hasil pengolahan Business Assessment Startiva.
            </p>
          </div>
        </div>

        <div className="statistics-empty">
          <div className="statistics-empty-icon">01</div>
          <h3>Belum ada data statistik</h3>
          <p>
            Data statistik akan ditampilkan setelah hasil assessment
            berhasil diproses.
          </p>
          <button
            type="button"
            className="statistics-refresh"
            onClick={fetchStatistics}
          >
            Refresh Data
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="statistics-page">
      {/* HEADER */}
      <header className="statistics-header">
        <div>
          <span className="statistics-eyebrow">
            STARTIVA ANALYTICS
          </span>

          <h1>Dashboard Statistik</h1>

          <p>
            Ringkasan hasil pengolahan Business Assessment Startiva.
            Pantau data dan distribusi jawaban responden.
          </p>
        </div>

        <button
          type="button"
          className="statistics-refresh"
          onClick={fetchStatistics}
          disabled={loading}
        >
          <span className="refresh-icon">↻</span>
          Refresh Data
        </button>
      </header>

      {/* SUMMARY CARDS */}
      <section className="statistics-grid">
        {cards.map((card) => (
          <article
            className="statistics-card"
            key={card.label}
          >
            <div className="statistics-card-top">
              <span>{card.label}</span>
              <div className={`statistics-card-icon ${card.style}`}>
                {card.icon}
              </div>
            </div>

            <h2>{card.value}</h2>
            <p>{card.description}</p>
          </article>
        ))}
      </section>

      {/* SECTION TITLE */}
      <div className="statistics-section-heading">
        <div>
          <span className="statistics-eyebrow">
            DATA OVERVIEW
          </span>
          <h2>Analisis Hasil Assessment</h2>
          <p>
            Visualisasi distribusi jawaban dan ringkasan perhitungan statistik.
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="statistics-content-grid">
        {/* FREQUENCY CHART */}
        <section className="statistics-panel frequency-panel">
          <div className="statistics-panel-header">
            <div>
              <span className="panel-kicker">RESPONSE DISTRIBUTION</span>
              <h3>Distribusi Jawaban</h3>
              <p>
                Frekuensi jawaban berdasarkan skala penilaian 1–4.
              </p>
            </div>

            <div className="panel-header-icon">▥</div>
          </div>

          <div className="frequency-chart">
            {[1, 2, 3, 4].map((score) => {
              const count = Number(frequency[String(score)] || 0);
              const width = (count / maxFrequency) * 100;

              return (
                <div className="frequency-row" key={score}>
                  <div className="frequency-label">
                    <span className={`score-number score-${score}`}>
                      {score}
                    </span>
                    <span>Skor {score}</span>
                  </div>

                  <div
                    className="frequency-track"
                    role="progressbar"
                    aria-label={`Frekuensi skor ${score}`}
                    aria-valuenow={count}
                    aria-valuemin="0"
                    aria-valuemax={maxFrequency}
                  >
                    <div
                      className={`frequency-bar bar-${score}`}
                      style={{ width: `${width}%` }}
                    />
                  </div>

                  <strong className="frequency-count">
                    {count}
                  </strong>
                </div>
              );
            })}
          </div>

          <div className="frequency-legend">
            <div>
              <span className="legend-dot dot-1" />
              <span>1 — Sangat Tidak Setuju</span>
            </div>
            <div>
              <span className="legend-dot dot-2" />
              <span>2 — Tidak Setuju</span>
            </div>
            <div>
              <span className="legend-dot dot-3" />
              <span>3 — Setuju</span>
            </div>
            <div>
              <span className="legend-dot dot-4" />
              <span>4 — Sangat Setuju</span>
            </div>
          </div>
        </section>

        {/* STATISTICAL ANALYSIS */}
        <section className="statistics-panel analysis-panel">
          <div className="statistics-panel-header">
            <div>
              <span className="panel-kicker">STATISTICAL SUMMARY</span>
              <h3>Analisis Statistik</h3>
              <p>
                Ringkasan perhitungan dari seluruh jawaban assessment.
              </p>
            </div>

            <div className="panel-header-icon">∑</div>
          </div>

          <div className="analysis-list">
            <div className="analysis-item">
              <div>
                <strong>Mean</strong>
                <small>Rata-rata skor jawaban</small>
              </div>
              <span>{formatNumber(statistics.mean)}</span>
            </div>

            <div className="analysis-item">
              <div>
                <strong>Standar Deviasi</strong>
                <small>Persebaran nilai jawaban</small>
              </div>
              <span>
                {formatNumber(statistics.standard_deviation)}
              </span>
            </div>

            <div className="analysis-item">
              <div>
                <strong>Rata-rata Kesiapan</strong>
                <small>Persentase kesiapan bisnis</small>
              </div>
              <span>
                {formatNumber(statistics.average_score_percentage)}%
              </span>
            </div>

            <div className="analysis-item">
              <div>
                <strong>Total Assessment</strong>
                <small>Jumlah assessment terkumpul</small>
              </div>
              <span>{statistics.total_assessments ?? 0}</span>
            </div>

            <div className="analysis-item">
              <div>
                <strong>Total Jawaban</strong>
                <small>Jumlah seluruh jawaban</small>
              </div>
              <span>{statistics.total_responses ?? 0}</span>
            </div>
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <footer className="statistics-footer">
        <div className="statistics-footer-status">
          <span className="status-dot" />
          Data statistik tersimpan
        </div>

        <span>
          Terakhir diperbarui: {formatDate(statistics.calculated_at)}
        </span>
      </footer>
    </div>
  );
}
