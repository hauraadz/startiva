
import { useEffect, useState } from "react";
import "./AssessmentHistory.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

function formatDate(date) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getLevelColor(level) {
  switch (level) {
    case "Sangat Siap":
      return "level-ready";
    case "Siap":
      return "level-good";
    case "Cukup Siap":
      return "level-medium";
    default:
      return "level-low";
  }
}

function AssessmentHistory() {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAssessment, setSelectedAssessment] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("startiva_token");

        if (!token) {
          throw new Error("Sesi login tidak ditemukan. Silakan login kembali.");
        }

        const response = await fetch(`${API_URL}/business-assessment`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Gagal mengambil riwayat assessment."
          );
        }

        const data = Array.isArray(result.data) ? result.data : [];

        setAssessments(
          data.sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          )
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const latestAssessment = assessments[0];

  const averageScore =
    assessments.length > 0
      ? assessments.reduce(
          (total, item) => total + Number(item.score_percentage || 0),
          0
        ) / assessments.length
      : 0;

  return (
    <div className="history-page">
      <div className="history-container">

        {/* PAGE HEADER */}
        <header className="history-header">
          <div>
            <span className="history-eyebrow">
              YOUR BUSINESS JOURNEY
            </span>

            <h1>Assessment History</h1>

            <p>
              Pantau hasil assessment dan perkembangan kesiapan bisnismu
              melalui riwayat yang telah kamu kerjakan.
            </p>
          </div>

          <div className="history-header-decoration">
            <span>STARTIVA</span>
            <strong>01</strong>
          </div>
        </header>

        {/* LOADING */}
        {loading && (
          <div className="history-state">
            <div className="history-loader"></div>
            <p>Memuat riwayat assessment...</p>
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="history-error">
            <h3>Data belum dapat dimuat</h3>
            <p>{error}</p>

            <button
              type="button"
              onClick={() => window.location.reload()}
            >
              Coba Lagi
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* STATISTICS */}
            <section className="history-stats">

              <article className="history-stat-card">
                <div className="history-stat-top">
                  <span>Total Assessment</span>
                  <div className="history-stat-icon purple-icon">
                    ◈
                  </div>
                </div>

                <h2>{assessments.length}</h2>

                <p>Assessment yang telah diselesaikan</p>
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
                    ? `${Number(
                        latestAssessment.score_percentage
                      ).toFixed(1)}%`
                    : "—"}
                </h2>

                <p>Skor assessment terakhir</p>
              </article>

              <article className="history-stat-card">
                <div className="history-stat-top">
                  <span>Average Score</span>
                  <div className="history-stat-icon green-icon">
                    %
                  </div>
                </div>

                <h2>
                  {assessments.length > 0
                    ? `${averageScore.toFixed(1)}%`
                    : "—"}
                </h2>

                <p>Rata-rata seluruh assessment</p>
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
                    <div className="latest-result-label">
                      YOUR READINESS SCORE
                    </div>

                    <div className="latest-score">
                      {Number(
                        latestAssessment.score_percentage
                      ).toFixed(1)}
                      <span>%</span>
                    </div>

                    <div className="latest-progress-track">
                      <div
                        className="latest-progress-fill"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(
                              0,
                              Number(latestAssessment.score_percentage)
                            )
                          )}%`,
                        }}
                      />
                    </div>

                    <p>
                      Total score: {latestAssessment.total_score}
                    </p>
                  </div>

                  <div className="latest-assessment-divider"></div>

                  <div className="latest-assessment-info">
                    <span className="latest-result-label">
                      READINESS LEVEL
                    </span>

                    <span
                      className={`history-level ${getLevelColor(
                        latestAssessment.readiness_level
                      )}`}
                    >
                      {latestAssessment.readiness_level}
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
                        setSelectedAssessment(latestAssessment)
                      }
                    >
                      View Result
                      <span>→</span>
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
                    Semua hasil assessment yang pernah kamu kerjakan.
                  </p>
                </div>

                <span className="history-total">
                  {assessments.length} Records
                </span>
              </div>

              {assessments.length === 0 ? (
                <div className="history-empty">
                  <div className="empty-icon">◈</div>

                  <h3>No assessment yet</h3>

                  <p>
                    Kamu belum memiliki riwayat assessment.
                    Mulai assessment pertamamu untuk melihat
                    tingkat kesiapan bisnis.
                  </p>
                </div>
              ) : (
                <div className="history-table-wrapper">
                  <table className="history-table">
                    <thead>
                      <tr>
                        <th>Assessment</th>
                        <th>Date</th>
                        <th>Score</th>
                        <th>Readiness Level</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {assessments.map((item, index) => (
                        <tr key={item.id}>
                          <td>
                            <div className="history-name">
                              <div className="history-row-icon">
                                ◈
                              </div>

                              <div>
                                <strong>
                                  Business Assessment
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
                              {Number(
                                item.score_percentage
                              ).toFixed(1)}%
                            </strong>
                          </td>

                          <td>
                            <span
                              className={`history-level ${getLevelColor(
                                item.readiness_level
                              )}`}
                            >
                              {item.readiness_level}
                            </span>
                          </td>

                          <td>
                            <button
                              type="button"
                              className="history-view-button"
                              onClick={() =>
                                setSelectedAssessment(item)
                              }
                            >
                              Details →
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
                onClick={() => setSelectedAssessment(null)}
              >
                <div
                  className="history-modal"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="history-modal-header">
                    <div>
                      <span className="history-eyebrow">
                        ASSESSMENT RESULT
                      </span>

                      <h2>Assessment Details</h2>
                    </div>

                    <button
                      type="button"
                      className="history-modal-close"
                      onClick={() => setSelectedAssessment(null)}
                    >
                      ×
                    </button>
                  </div>

                  <div className="modal-result-score">
                    <span>Readiness Score</span>

                    <h3>
                      {Number(
                        selectedAssessment.score_percentage
                      ).toFixed(1)}
                      %
                    </h3>

                    <span
                      className={`history-level ${getLevelColor(
                        selectedAssessment.readiness_level
                      )}`}
                    >
                      {selectedAssessment.readiness_level}
                    </span>
                  </div>

                  <div className="modal-detail-row">
                    <span>Assessment Date</span>
                    <strong>
                      {formatDate(selectedAssessment.created_at)}
                    </strong>
                  </div>

                  <div className="modal-detail-row">
                    <span>Total Score</span>
                    <strong>
                      {selectedAssessment.total_score}
                    </strong>
                  </div>

                  {selectedAssessment.aspect_scores &&
                    Object.keys(selectedAssessment.aspect_scores).length >
                      0 && (
                      <div className="modal-aspects">
                        <h3>Aspect Scores</h3>

                        {Object.entries(
                          selectedAssessment.aspect_scores
                        ).map(([aspect, score]) => (
                          <div
                            className="modal-aspect-item"
                            key={aspect}
                          >
                            <div>
                              <span>{aspect}</span>
                              <strong>
                                {typeof score === "object"
                                  ? JSON.stringify(score)
                                  : score}
                              </strong>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                  {selectedAssessment.recommendations && (
                    <div className="modal-recommendations">
                      <h3>Recommendations</h3>

                      {Array.isArray(
                        selectedAssessment.recommendations
                      ) ? (
                        <ul>
                          {selectedAssessment.recommendations.map(
                            (recommendation, index) => (
                              <li key={index}>
                                {typeof recommendation === "string"
                                  ? recommendation
                                  : JSON.stringify(recommendation)}
                              </li>
                            )
                          )}
                        </ul>
                      ) : (
                        <p>
                          {JSON.stringify(
                            selectedAssessment.recommendations
                          )}
                        </p>
                      )}
                    </div>
                  )}
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
