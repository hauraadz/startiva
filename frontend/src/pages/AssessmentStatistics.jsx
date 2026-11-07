
import { useEffect, useState } from "react";
import "./AssessmentStatistics.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export default function AssessmentStatistics() {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("startiva_token");

      if (!token) {
        throw new Error("Silakan login terlebih dahulu.");
      }

      const response = await fetch(
        `${API_URL}/assessment-statistics/latest`,
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

      setStatistics(result.data);
    } catch (err) {
      setError(
        err.message || "Terjadi kesalahan saat mengambil data statistik."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("id-ID", {
      dateStyle: "long",
      timeStyle: "short",
    });
  };

  const frequency = statistics?.frequency || {};

  const maxFrequency = Math.max(
    ...Object.values(frequency).map(Number),
    1
  );

  const cards = [
    {
      label: "Total Assessment",
      value: statistics?.total_assessments ?? 0,
      description: "Assessment yang telah dikerjakan",
    },
    {
      label: "Total Jawaban",
      value: statistics?.total_responses ?? 0,
      description: "Seluruh jawaban responden",
    },
    {
      label: "Rata-rata Kesiapan",
      value: `${Number(
        statistics?.average_score_percentage ?? 0
      ).toFixed(2)}%`,
      description: "Persentase kesiapan bisnis",
    },
    {
      label: "Mean",
      value: Number(statistics?.mean ?? 0).toFixed(2),
      description: "Rata-rata skor jawaban",
    },
  ];

  if (loading) {
    return (
      <div className="statistics-page">
        <div className="statistics-message">
          Memuat data statistik...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="statistics-page">
        <div className="statistics-header">
          <div>
            <h1>Dashboard Statistik</h1>
            <p>
              Ringkasan hasil Business Assessment Startiva.
            </p>
          </div>
        </div>

        <div className="statistics-message error">
          {error}
        </div>

        <button
          type="button"
          className="statistics-refresh"
          onClick={fetchStatistics}
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className="statistics-page">
        <h1>Dashboard Statistik</h1>

        <div className="statistics-message">
          Belum ada data statistik yang tersedia.
        </div>

        <button
          type="button"
          className="statistics-refresh"
          onClick={fetchStatistics}
        >
          Refresh Data
        </button>
      </div>
    );
  }

  return (
    <div className="statistics-page">
      {/* Header */}
      <div className="statistics-header">
        <div>
          <h1>Dashboard Statistik</h1>
          <p>
            Ringkasan hasil pengolahan Business Assessment Startiva.
          </p>
        </div>

        <button
          type="button"
          className="statistics-refresh"
          onClick={fetchStatistics}
          disabled={loading}
        >
          Refresh Data
        </button>
      </div>

      {/* Summary Cards */}
      <div className="statistics-grid">
        {cards.map((card, index) => (
          <div className="statistics-card" key={index}>
            <p>{card.label}</p>
            <h2>{card.value}</h2>
            <span>{card.description}</span>
          </div>
        ))}
      </div>

      {/* Statistics Content */}
      <div className="statistics-content-grid">

        {/* Frequency Chart */}
        <section className="statistics-panel">
          <div className="statistics-panel-header">
            <div>
              <h3>Distribusi Jawaban</h3>
              <p>
                Frekuensi jawaban berdasarkan skala penilaian 1–4.
              </p>
            </div>
          </div>

          <div className="frequency-chart">
            {[1, 2, 3, 4].map((score) => {
              const count = Number(
                frequency[String(score)] || 0
              );

              const width = (count / maxFrequency) * 100;

              return (
                <div className="frequency-row" key={score}>
                  <span className="frequency-label">
                    Skor {score}
                  </span>

                  <div className="frequency-track">
                    <div
                      className="frequency-bar"
                      style={{ width: `${width}%` }}
                    />
                  </div>

                  <strong>{count}</strong>
                </div>
              );
            })}
          </div>

          <div className="frequency-legend">
            <span>1 = Sangat Tidak Setuju</span>
            <span>2 = Tidak Setuju</span>
            <span>3 = Setuju</span>
            <span>4 = Sangat Setuju</span>
          </div>
        </section>

        {/* Statistical Analysis */}
        <section className="statistics-panel">
          <h3>Analisis Statistik</h3>

          <p className="statistics-panel-description">
            Ringkasan perhitungan dari seluruh jawaban assessment.
          </p>

          <div className="analysis-item">
            <span>Mean</span>
            <strong>
              {Number(statistics.mean).toFixed(2)}
            </strong>
          </div>

          <div className="analysis-item">
            <span>Standar Deviasi</span>
            <strong>
              {Number(statistics.standard_deviation).toFixed(2)}
            </strong>
          </div>

          <div className="analysis-item">
            <span>Rata-rata Kesiapan</span>
            <strong>
              {Number(
                statistics.average_score_percentage
              ).toFixed(2)}%
            </strong>
          </div>

          <div className="analysis-item">
            <span>Total Assessment</span>
            <strong>
              {statistics.total_assessments}
            </strong>
          </div>

          <div className="analysis-item">
            <span>Total Jawaban</span>
            <strong>
              {statistics.total_responses}
            </strong>
          </div>
        </section>
      </div>

      {/* Last Update */}
      <div className="statistics-footer">
        Terakhir diperbarui:{" "}
        {formatDate(statistics.calculated_at)}
      </div>
    </div>
  );
}
