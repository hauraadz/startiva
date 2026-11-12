
import { useEffect, useState } from "react";
import "./AssessmentHistory.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

// =====================================
// HELPER FUNCTIONS
// =====================================

function formatDate(date) {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "-";

  return parsedDate.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatScore(value) {
  const score = Number(value);

  return Number.isFinite(score) ? score.toFixed(1) : "0.0";
}

function formatValue(value) {
  if (value === null || value === undefined) return "-";

  if (typeof value === "object") {
    return JSON.stringify(value, null, 2);
  }

  return String(value);
}

function getAnswerLabel(value) {
  const labels = {
    1: "Sangat Tidak Setuju",
    2: "Tidak Setuju",
    3: "Setuju",
    4: "Sangat Setuju",
  };

  return labels[value] || formatValue(value);
}

function getAspectEntries(aspectScores) {
  if (!aspectScores || typeof aspectScores !== "object") {
    return [];
  }

  if (Array.isArray(aspectScores)) {
    return aspectScores.map((item, index) => [
      item.aspect || item.name || `Aspek ${index + 1}`,
      item.score ?? item.mean ?? item.value ?? item,
    ]);
  }

  return Object.entries(aspectScores);
}

function getAnswerEntries(answers) {
  if (!answers || typeof answers !== "object") {
    return [];
  }

  if (Array.isArray(answers)) {
    return answers.map((item, index) => [
      item.question || item.question_text || `Pertanyaan ${index + 1}`,
      item.answer ?? item.value ?? item.score ?? item,
    ]);
  }

  return Object.entries(answers);
}

// =====================================
// RECOMMENDATION PARSER
// =====================================

function parseRecommendations(data) {
  if (!data) return [];

  // Jika data sudah berbentuk array
  if (Array.isArray(data)) {
    return data
      .map((item) => {
        if (typeof item === "string") {
          try {
            return JSON.parse(item);
          } catch {
            return {
              title: "Rekomendasi",
              description: item,
            };
          }
        }

        return item;
      })
      .filter(
        (item) =>
          item &&
          typeof item === "object" &&
          !Array.isArray(item)
      );
  }

  // Jika data berbentuk object
  if (typeof data === "object") {
    return Object.entries(data).map(([title, value]) => {
      if (typeof value === "object" && value !== null) {
        return {
          title: value.title || title,
          description:
            value.description || value.recommendation || "",
          score: value.score,
        };
      }

      return {
        title,
        description: String(value),
      };
    });
  }

  // Jika data berbentuk string Markdown
  if (typeof data === "string") {
    let cleaned = data
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    // Coba parsing langsung sebagai JSON
    try {
      const parsed = JSON.parse(cleaned);

      return parseRecommendations(parsed);
    } catch {
      // Lanjutkan parsing Markdown
    }

    // Hapus heading Recommendations
    cleaned = cleaned.replace(
      /^#{1,6}\s*recommendations\s*/im,
      ""
    );

    // Ambil objek JSON dari teks Markdown
    const matches = cleaned.match(/\{[^{}]*\}/g);

    if (matches && matches.length > 0) {
      const parsedItems = matches
        .map((item) => {
          try {
            return JSON.parse(item);
          } catch {
            return null;
          }
        })
        .filter(Boolean);

      if (parsedItems.length > 0) {
        return parsedItems;
      }
    }

    // Fallback jika teks bukan JSON
    return cleaned
      .split("\n")
      .map((line) =>
        line.replace(/^[-*]\s*/, "").trim()
      )
      .filter(Boolean)
      .map((line) => ({
        title: "Rekomendasi",
        description: line,
      }));
  }

  return [];
}

// =====================================
// MAIN COMPONENT
// =====================================

function AssessmentHistory() {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAssessment, setSelectedAssessment] = useState(null);

  // =====================================
  // FETCH ASSESSMENT HISTORY
  // =====================================

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("startiva_token");

        if (!token) {
          throw new Error(
            "Sesi login tidak ditemukan. Silakan login kembali."
          );
        }

        const response = await fetch(
          `${API_URL}/mahasiswa/assessment`,
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
            result.message || "Gagal mengambil riwayat assessment."
          );
        }

        const data = Array.isArray(result.data)
          ? result.data
          : [];

        const sortedData = [...data].sort(
          (a, b) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
        );

        setAssessments(sortedData);
      } catch (err) {
        console.error("Assessment History Error:", err);

        setError(
          err.message || "Terjadi kesalahan saat mengambil data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // =====================================
  // CLOSE MODAL WITH ESCAPE
  // =====================================

  useEffect(() => {
    if (!selectedAssessment) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setSelectedAssessment(null);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [selectedAssessment]);

  // =====================================
  // STATISTICS
  // =====================================

  const latestAssessment = assessments[0];

  const averageScore =
    assessments.length > 0
      ? assessments.reduce(
          (total, item) =>
            total + Number(item.score_percentage || 0),
          0
        ) / assessments.length
      : 0;

  const latestScore = Number(
    latestAssessment?.score_percentage || 0
  );

  const progressValue = Math.min(
    100,
    Math.max(0, latestScore)
  );

  // =====================================
  // MODAL HANDLERS
  // =====================================

  const openDetail = (assessment) => {
    setSelectedAssessment(assessment);
  };

  const closeDetail = () => {
    setSelectedAssessment(null);
  };

  // =====================================
  // RENDER
  // =====================================

  return (
    <div className="history-page">
      <div className="history-container">

        {/* PAGE HEADER */}

        <header className="history-header">
          <div className="history-header-content">
            <span className="history-eyebrow">
              YOUR WELL-BEING JOURNEY
            </span>

            <h1>Assessment History</h1>

            <p>
              Lihat kembali hasil Student Well-being Assessment
              dan refleksi yang telah kamu lakukan selama ini.
            </p>
          </div>

          <div
            className="history-header-decoration"
            aria-hidden="true"
          >
            <span>STARTIVA</span>
            <strong>01</strong>
            <div className="decoration-circle" />
          </div>
        </header>

        {/* LOADING */}

        {loading && (
          <div className="history-state">
            <div className="history-loader" />
            <p>Memuat riwayat assessment...</p>
          </div>
        )}

        {/* ERROR */}

        {!loading && error && (
          <div className="history-error">
            <div className="history-error-icon">!</div>

            <div>
              <h3>Data belum dapat dimuat</h3>
              <p>{error}</p>

              <button
                type="button"
                onClick={() => window.location.reload()}
              >
                Coba Lagi
              </button>
            </div>
          </div>
        )}

        {!loading && !error && (
          <>

            {/* STATISTICS */}

            <section className="history-stats">

              <article className="history-stat-card">
                <div className="history-stat-top">
                  <span>Total Assessment</span>
                  <div className="history-stat-icon red-icon">
                    01
                  </div>
                </div>

                <h2>{assessments.length}</h2>

                <p>
                  Assessment yang telah diselesaikan
                </p>
              </article>

              <article className="history-stat-card">
                <div className="history-stat-top">
                  <span>Latest Score</span>
                  <div className="history-stat-icon peach-icon">
                    ↗
                  </div>
                </div>

                <h2>
                  {latestAssessment
                    ? formatScore(latestScore)
                    : "—"}
                </h2>

                <p>
                  Skor assessment terakhir
                </p>
              </article>

              <article className="history-stat-card">
                <div className="history-stat-top">
                  <span>Average Score</span>
                  <div className="history-stat-icon rose-icon">
                    %
                  </div>
                </div>

                <h2>
                  {assessments.length > 0
                    ? formatScore(averageScore)
                    : "—"}
                </h2>

                <p>
                  Rata-rata skor ternormalisasi
                </p>
              </article>

            </section>

            {/* LATEST ASSESSMENT */}

            {latestAssessment && (
              <section className="latest-assessment-section">

                <div className="history-section-heading">
                  <div>
                    <span className="history-eyebrow">
                      MOST RECENT RESULT
                    </span>

                    <h2>Latest Assessment</h2>
                  </div>
                </div>

                <article className="latest-assessment-card">

                  <div className="latest-assessment-main">
                    <span className="latest-result-label">
                      YOUR ASSESSMENT SCORE
                    </span>

                    <div className="latest-score">
                      {formatScore(latestScore)}
                      <span>/ 100</span>
                    </div>

                    <div
                      className="latest-progress-track"
                      role="progressbar"
                      aria-label="Skor assessment ternormalisasi"
                      aria-valuenow={progressValue}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      <div
                        className="latest-progress-fill"
                        style={{
                          width: `${progressValue}%`,
                        }}
                      />
                    </div>

                    <p>
                      Total skor jawaban:{" "}
                      {latestAssessment.total_score ?? "-"}
                    </p>

                    <small>
                      Skor ternormalisasi, bukan persentase
                      kesehatan mental.
                    </small>
                  </div>

                  <div className="latest-assessment-divider" />

                  <div className="latest-assessment-info">
                    <span className="latest-result-label">
                      HASIL ASSESSMENT
                    </span>

                    <span className="history-level level-neutral">
                      {latestAssessment.readiness_level ||
                        "Refleksi mandiri"}
                    </span>

                    <div className="latest-date">
                      <span>Assessment date</span>

                      <strong>
                        {formatDate(latestAssessment.created_at)}
                      </strong>
                    </div>

                    <button
                      type="button"
                      className="history-detail-button"
                      onClick={() =>
                        openDetail(latestAssessment)
                      }
                    >
                      View Result <span>→</span>
                    </button>
                  </div>

                </article>
              </section>
            )}

            {/* HISTORY LIST */}

            <section className="history-list-section">

              <div className="history-section-heading">
                <div>
                  <span className="history-eyebrow">
                    YOUR RECORDS
                  </span>

                  <h2>Previous Assessments</h2>

                  <p>
                    Semua hasil Student Well-being Assessment
                    yang pernah kamu kerjakan.
                  </p>
                </div>

                <span className="history-total">
                  {assessments.length} Records
                </span>
              </div>

              {/* EMPTY STATE */}

              {assessments.length === 0 ? (
                <div className="history-empty">
                  <div className="empty-icon">01</div>

                  <h3>Belum ada assessment</h3>

                  <p>
                    Kamu belum memiliki riwayat assessment.
                    Mulai assessment pertamamu untuk melakukan
                    refleksi terhadap kondisi akademik,
                    emosional, sosial, dan pengelolaan diri.
                  </p>
                </div>
              ) : (

                /* HISTORY TABLE */

                <div className="history-table-wrapper">
                  <table className="history-table">

                    <thead>
                      <tr>
                        <th>Assessment</th>
                        <th>Date</th>
                        <th>Score</th>
                        <th>Hasil</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {assessments.map((item, index) => (
                        <tr key={item.id}>
                          <td>
                            <div className="history-name">
                              <div className="history-row-icon">
                                A
                              </div>

                              <div>
                                <strong>
                                  Student Well-being Assessment
                                </strong>

                                <small>
                                  Assessment #{assessments.length - index}
                                </small>
                              </div>
                            </div>
                          </td>

                          <td>
                            <span className="history-date">
                              {formatDate(item.created_at)}
                            </span>
                          </td>

                          <td>
                            <strong className="history-score">
                              {formatScore(item.score_percentage)}
                            </strong>
                          </td>

                          <td>
                            <span className="history-level level-neutral">
                              {item.readiness_level ||
                                "Refleksi mandiri"}
                            </span>
                          </td>

                          <td>
                            <button
                              type="button"
                              className="history-view-button"
                              onClick={() => openDetail(item)}
                            >
                              Details <span>→</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>

                  </table>
                </div>
              )}

            </section>

            {/* DETAIL MODAL */}

            {selectedAssessment && (
              <div
                className="history-modal-overlay"
                onClick={closeDetail}
                role="presentation"
              >
                <div
                  className="history-modal"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="history-modal-title"
                  onClick={(event) => event.stopPropagation()}
                >

                  {/* MODAL HEADER */}

                  <div className="history-modal-header">
                    <div>
                      <span className="history-eyebrow">
                        ASSESSMENT RESULT
                      </span>

                      <h2 id="history-modal-title">
                        Assessment Details
                      </h2>
                    </div>

                    <button
                      type="button"
                      className="history-modal-close"
                      onClick={closeDetail}
                      aria-label="Tutup detail"
                    >
                      ×
                    </button>
                  </div>

                  {/* SCORE */}

                  <div className="modal-result-score">
                    <span>Skor Assessment</span>

                    <h3>
                      {formatScore(
                        selectedAssessment.score_percentage
                      )}
                      <small> / 100</small>
                    </h3>

                    <span className="history-level level-neutral">
                      {selectedAssessment.readiness_level ||
                        "Refleksi mandiri"}
                    </span>

                    <p>
                      Skor ini merupakan indikator ternormalisasi
                      dari jawaban assessment, bukan diagnosis
                      atau persentase kesehatan mental.
                    </p>
                  </div>

                  {/* GENERAL INFORMATION */}

                  <div className="modal-detail-row">
                    <span>Assessment Date</span>

                    <strong>
                      {formatDate(selectedAssessment.created_at)}
                    </strong>
                  </div>

                  <div className="modal-detail-row">
                    <span>Total Score</span>

                    <strong>
                      {selectedAssessment.total_score ?? "-"}
                    </strong>
                  </div>

                  {/* ASPECT SCORES */}

                  {getAspectEntries(
                    selectedAssessment.aspect_scores
                  ).length > 0 && (
                    <div className="modal-aspects">
                      <h3>Aspect Scores</h3>

                      {getAspectEntries(
                        selectedAssessment.aspect_scores
                      ).map(([aspect, score], index) => (
                        <div
                          className="modal-aspect-item"
                          key={`${aspect}-${index}`}
                        >
                          <div>
                            <span>{aspect}</span>

                            <strong>
                              {formatValue(score)}
                            </strong>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* RECOMMENDATIONS */}

                  {(() => {
                    const recommendations = parseRecommendations(
                      selectedAssessment.recommendations
                    );

                    return recommendations.length > 0 ? (
                      <div className="modal-recommendations">
                        <h3>Rekomendasi untuk Kamu</h3>

                        <p className="recommendations-subtitle">
                          Beberapa langkah yang bisa kamu
                          pertimbangkan berdasarkan hasil refleksimu.
                        </p>

                        <div className="recommendations-list">
                          {recommendations.map(
                            (recommendation, index) => (
                              <article
                                className="recommendation-card"
                                key={index}
                              >
                                <div className="recommendation-card-header">
                                  <span className="recommendation-number">
                                    {String(index + 1).padStart(2, "0")}
                                  </span>

                                  <h4>
                                    {recommendation.title ||
                                      `Rekomendasi ${index + 1}`}
                                  </h4>
                                </div>

                                <p>
                                  {recommendation.description ||
                                    recommendation.recommendation ||
                                    "Belum ada deskripsi rekomendasi."}
                                </p>

                                {recommendation.score !== undefined &&
                                  recommendation.score !== null && (
                                    <span className="recommendation-score">
                                      Skor: {recommendation.score}
                                    </span>
                                  )}
                              </article>
                            )
                          )}
                        </div>
                      </div>
                    ) : null;
                  })()}

                  {/* ANSWERS */}

                  {getAnswerEntries(
                    selectedAssessment.answers
                  ).length > 0 && (
                    <div className="modal-aspects">
                      <h3>Jawaban Assessment</h3>

                      {getAnswerEntries(
                        selectedAssessment.answers
                      ).map(([question, answer], index) => (
                        <div
                          className="modal-aspect-item"
                          key={`${question}-${index}`}
                        >
                          <div>
                            <span>{question}</span>

                            <strong>
                              {getAnswerLabel(answer)}
                            </strong>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="history-modal-footer">
                    <button
                      type="button"
                      onClick={closeDetail}
                    >
                      Tutup
                    </button>
                  </div>

                </div>
              </div>
            )}

          </>
        )}
      </div>
    </div>
  );
}

export default AssessmentHistory;
