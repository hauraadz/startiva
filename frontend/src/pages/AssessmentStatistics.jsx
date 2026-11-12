
import { useCallback, useEffect, useState } from "react";
import {
  Activity,
  BarChart3,
  ClipboardList,
  RefreshCw,
  Users,
  Calculator,
  CalendarDays,
  AlertCircle,
  ChartNoAxesColumn,
} from "lucide-react";

import "./AssessmentStatistics.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

// =====================================
// FORMAT ANGKA
// =====================================

function formatNumber(value, digits = 2) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number.toLocaleString("id-ID", {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
      })
    : "0,00";
}

// =====================================
// FORMAT TANGGAL
// =====================================

function formatDate(date) {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleString("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  });
}

// =====================================
// KOMPONEN UTAMA
// =====================================

export default function AssessmentStatistics() {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // =====================================
  // AMBIL DATA STATISTIK
  // =====================================

  const fetchStatistics = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const token = localStorage.getItem("startiva_token");

      if (!token) {
        throw new Error("Silakan login terlebih dahulu.");
      }

      const response = await fetch(
        `${API_URL.replace(/\/$/, "")}/konselor/assessment-statistics/latest`,
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
      console.error("Statistics error:", err);

      setError(
        err.message ||
          "Terjadi kesalahan saat mengambil data statistik."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  // =====================================
  // DATA FREKUENSI
  // =====================================

  const frequency = statistics?.frequency || {};

  const frequencyData = [1, 2, 3, 4].map((score) => ({
    score,
    count: Math.max(
      0,
      Number(frequency[String(score)] || 0)
    ),
    label: {
      1: "Sangat Tidak Setuju",
      2: "Tidak Setuju",
      3: "Setuju",
      4: "Sangat Setuju",
    }[score],
  }));

  const maxFrequency = Math.max(
    ...frequencyData.map((item) => item.count),
    1
  );

  // =====================================
  // KARTU RINGKASAN
  // =====================================

  const summaryCards = [
    {
      label: "Total Asesmen",
      value: statistics?.total_assessments ?? 0,
      description: "Jumlah asesmen yang terkumpul",
      icon: ClipboardList,
      style: "red",
    },
    {
      label: "Total Jawaban",
      value: statistics?.total_responses ?? 0,
      description: "Seluruh jawaban responden",
      icon: Users,
      style: "peach",
    },
    {
      label: "Rata-rata Skor",
      value: `${formatNumber(
        statistics?.average_score_percentage,
        2
      )}%`,
      description: "Persentase skor asesmen",
      icon: Activity,
      style: "rose",
    },
    {
      label: "Mean",
      value: formatNumber(statistics?.mean),
      description: "Rata-rata seluruh skor jawaban",
      icon: Calculator,
      style: "dark",
    },
  ];

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <div className="statistics-page">
        <div className="statistics-loading">
          <div className="statistics-loader" />

          <h3>Memuat Data Statistik</h3>

          <p>
            Sedang mengambil hasil pengolahan RICE Assessment...
          </p>
        </div>
      </div>
    );
  }

  // =====================================
  // ERROR
  // =====================================

  if (error && !statistics) {
    return (
      <div className="statistics-page">
        <div className="statistics-header">
          <div>
            <span className="statistics-eyebrow">
              STARTIVA ANALYTICS
            </span>

            <h1>Dashboard Statistik</h1>

            <p>
              Pantau ringkasan hasil RICE Assessment mahasiswa.
            </p>
          </div>
        </div>

        <div className="statistics-message">
          <div className="statistics-message-icon">
            <AlertCircle size={23} />
          </div>

          <div>
            <h3>Data belum dapat dimuat</h3>

            <p>{error}</p>

            <button
              type="button"
              className="statistics-refresh"
              onClick={() => fetchStatistics()}
            >
              <RefreshCw size={15} />
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =====================================
  // BELUM ADA DATA
  // =====================================

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
              Pantau ringkasan hasil RICE Assessment mahasiswa.
            </p>
          </div>

          <button
            type="button"
            className="statistics-refresh"
            onClick={() => fetchStatistics(true)}
            disabled={refreshing}
          >
            <RefreshCw
              size={15}
              className={refreshing ? "refresh-spinning" : ""}
            />
            Refresh Data
          </button>
        </div>

        <div className="statistics-empty">
          <div className="statistics-empty-icon">
            <ChartNoAxesColumn size={30} />
          </div>

          <h3>Belum Ada Data Statistik</h3>

          <p>
            Statistik akan ditampilkan setelah data RICE Assessment
            berhasil diproses melalui workflow n8n.
          </p>
        </div>
      </div>
    );
  }

  // =====================================
  // DASHBOARD STATISTIK
  // =====================================

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
            Ringkasan hasil pengolahan RICE Assessment mahasiswa.
            Pantau distribusi jawaban dan perhitungan statistik.
          </p>
        </div>

        <button
          type="button"
          className="statistics-refresh"
          onClick={() => fetchStatistics(true)}
          disabled={refreshing}
        >
          <RefreshCw
            size={15}
            className={refreshing ? "refresh-spinning" : ""}
          />

          {refreshing ? "Memperbarui..." : "Refresh Data"}
        </button>
      </header>

      {/* PESAN ERROR SAAT REFRESH */}

      {error && (
        <div className="statistics-inline-error">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* SUMMARY CARDS */}

      <section className="statistics-grid">
        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <article
              className="statistics-card"
              key={card.label}
            >
              <div className="statistics-card-top">
                <span>{card.label}</span>

                <div className={`statistics-card-icon ${card.style}`}>
                  <Icon size={19} />
                </div>
              </div>

              <h2>{card.value}</h2>

              <p>{card.description}</p>
            </article>
          );
        })}
      </section>

      {/* HEADING ANALISIS */}

      <section className="statistics-section-heading">
        <div>
          <span className="statistics-eyebrow">
            DATA OVERVIEW
          </span>

          <h2>Analisis Hasil Assessment</h2>

          <p>
            Visualisasi distribusi jawaban dan ringkasan
            perhitungan statistik responden.
          </p>
        </div>
      </section>

      {/* STATISTICS CONTENT */}

      <div className="statistics-content-grid">

        {/* DISTRIBUSI FREKUENSI */}

        <section className="statistics-panel frequency-panel">
          <div className="statistics-panel-header">
            <div>
              <span className="panel-kicker">
                RESPONSE DISTRIBUTION
              </span>

              <h3>Distribusi Jawaban</h3>

              <p>
                Frekuensi jawaban berdasarkan skala penilaian 1–4.
              </p>
            </div>

            <div className="panel-header-icon">
              <BarChart3 size={20} />
            </div>
          </div>

          <div className="frequency-chart">
            {frequencyData.map((item) => {
              const width =
                (item.count / maxFrequency) * 100;

              return (
                <div
                  className="frequency-row"
                  key={item.score}
                >
                  <div className="frequency-label">
                    <span
                      className={`score-number score-${item.score}`}
                    >
                      {item.score}
                    </span>

                    <span>Skor {item.score}</span>
                  </div>

                  <div
                    className="frequency-track"
                    role="progressbar"
                    aria-label={`Frekuensi ${item.label}`}
                    aria-valuenow={item.count}
                    aria-valuemin={0}
                    aria-valuemax={maxFrequency}
                  >
                    <div
                      className={`frequency-bar bar-${item.score}`}
                      style={{
                        width: `${width}%`,
                      }}
                    />
                  </div>

                  <strong className="frequency-count">
                    {item.count.toLocaleString("id-ID")}
                  </strong>
                </div>
              );
            })}
          </div>

          <div className="frequency-legend">
            {frequencyData.map((item) => (
              <div key={item.score}>
                <span
                  className={`legend-dot dot-${item.score}`}
                />

                <span>
                  {item.score} — {item.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ANALISIS STATISTIK */}

        <section className="statistics-panel analysis-panel">
          <div className="statistics-panel-header">
            <div>
              <span className="panel-kicker">
                STATISTICAL SUMMARY
              </span>

              <h3>Analisis Statistik</h3>

              <p>
                Ringkasan perhitungan dari seluruh jawaban asesmen.
              </p>
            </div>

            <div className="panel-header-icon">
              <Calculator size={20} />
            </div>
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
                <strong>Rata-rata Skor</strong>
                <small>Persentase skor asesmen</small>
              </div>

              <span>
                {formatNumber(
                  statistics.average_score_percentage
                )}%
              </span>
            </div>

            <div className="analysis-item">
              <div>
                <strong>Total Asesmen</strong>
                <small>Jumlah asesmen terkumpul</small>
              </div>

              <span>
                {statistics.total_assessments ?? 0}
              </span>
            </div>

            <div className="analysis-item">
              <div>
                <strong>Total Jawaban</strong>
                <small>Jumlah seluruh jawaban</small>
              </div>

              <span>
                {statistics.total_responses ?? 0}
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* FOOTER */}

      <footer className="statistics-footer">
        <div className="statistics-footer-status">
          <span className="statistics-status-dot" />
          Data statistik tersimpan
        </div>

        <div className="statistics-footer-date">
          <CalendarDays size={14} />

          <span>
            Terakhir diperbarui:{" "}
            {formatDate(statistics.calculated_at)}
          </span>
        </div>
      </footer>
    </div>
  );
}
