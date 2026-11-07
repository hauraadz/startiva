import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const assessmentSections = [
  {
    title: "Kesiapan Produk",
    description: "Menilai kesiapan produk kuliner yang akan ditawarkan.",
    questions: [
      "Saya sudah memiliki produk makanan atau minuman yang akan dijual.",
      "Saya sudah menentukan keunikan atau keunggulan produk dibandingkan kompetitor.",
      "Saya sudah memiliki standar kualitas dan rasa produk yang konsisten.",
    ],
  },
  {
    title: "Kesiapan Pasar",
    description: "Menilai pemahaman terhadap pelanggan dan peluang pasar.",
    questions: [
      "Saya sudah mengetahui siapa target pelanggan bisnis saya.",
      "Saya sudah memahami kebutuhan dan preferensi target pelanggan.",
      "Saya sudah melakukan riset terhadap kompetitor bisnis kuliner.",
    ],
  },
  {
    title: "Kesiapan Pemasaran",
    description: "Menilai strategi promosi dan pemasaran bisnis.",
    questions: [
      "Saya sudah memiliki strategi untuk mempromosikan produk.",
      "Saya sudah menentukan media pemasaran yang akan digunakan.",
      "Saya sudah memiliki rencana untuk menarik dan mempertahankan pelanggan.",
    ],
  },
  {
    title: "Kesiapan Keuangan",
    description: "Menilai perencanaan dan pengelolaan keuangan bisnis.",
    questions: [
      "Saya sudah mengetahui kebutuhan modal awal bisnis.",
      "Saya sudah memperkirakan biaya produksi dan operasional.",
      "Saya sudah menentukan harga jual berdasarkan biaya dan keuntungan yang diharapkan.",
    ],
  },
  {
    title: "Kesiapan Operasional",
    description: "Menilai kesiapan proses dan pengelolaan bisnis.",
    questions: [
      "Saya sudah memiliki rencana proses produksi produk.",
      "Saya sudah mengetahui kebutuhan bahan baku dan pemasok.",
      "Saya sudah memiliki rencana pengelolaan pesanan dan pelayanan pelanggan.",
    ],
  },
];

const answerOptions = [
  { value: 1, label: "Sangat Tidak Setuju" },
  { value: 2, label: "Tidak Setuju" },
  { value: 3, label: "Setuju" },
  { value: 4, label: "Sangat Setuju" },
];

function BusinessAssessment() {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const totalQuestions = assessmentSections.reduce(
    (total, section) => total + section.questions.length,
    0
  );

  const answeredCount = Object.keys(answers).length;
  const progress = Math.round(
    (answeredCount / totalQuestions) * 100
  );

  const handleAnswer = (questionKey, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionKey]: value,
    }));
  };

  const calculateResult = () => {
    let totalScore = 0;
    const aspectResults = [];

    assessmentSections.forEach((section, sectionIndex) => {
      let sectionScore = 0;

      section.questions.forEach((_, questionIndex) => {
        const key = `${sectionIndex}-${questionIndex}`;
        sectionScore += Number(answers[key]);
      });

      totalScore += sectionScore;

      const maxSectionScore = section.questions.length * 4;

      const percentage = Math.round(
        (sectionScore / maxSectionScore) * 100
      );

      aspectResults.push({
        title: section.title,
        score: sectionScore,
        percentage,
      });
    });

    const maxScore = totalQuestions * 4;

    const percentage = Math.round(
      (totalScore / maxScore) * 100
    );

    let category;
    let description;

    if (percentage >= 80) {
      category = "Sangat Siap";
      description =
        "Bisnis kamu menunjukkan tingkat kesiapan yang sangat baik. Pertahankan kekuatan yang sudah dimiliki dan mulai persiapkan pengembangan bisnis.";
    } else if (percentage >= 65) {
      category = "Siap";
      description =
        "Bisnis kamu sudah memiliki beberapa aspek kesiapan yang baik. Masih terdapat beberapa hal yang perlu ditingkatkan.";
    } else if (percentage >= 45) {
      category = "Cukup Siap";
      description =
        "Bisnis kamu sudah memiliki dasar untuk dikembangkan, tetapi masih membutuhkan persiapan pada beberapa aspek.";
    } else {
      category = "Belum Siap";
      description =
        "Bisnis kamu masih membutuhkan persiapan lebih lanjut sebelum dijalankan atau dikembangkan.";
    }

    setResult({
      totalScore,
      maxScore,
      percentage,
      category,
      description,
      aspects: aspectResults,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (answeredCount !== totalQuestions) {
      alert("Silakan jawab seluruh pertanyaan terlebih dahulu.");
      return;
    }

    calculateResult();
  };

  const handleReset = () => {
    setAnswers({});
    setResult(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getRecommendations = () => {
    if (!result) return [];

    const recommendations = [];

    result.aspects.forEach((aspect) => {
      if (aspect.percentage < 65) {
        switch (aspect.title) {
          case "Kesiapan Produk":
            recommendations.push(
              "Evaluasi kualitas produk, tentukan keunggulan produk, dan buat standar produksi yang konsisten."
            );
            break;

          case "Kesiapan Pasar":
            recommendations.push(
              "Lakukan riset target pelanggan, pelajari kebutuhan pasar, dan analisis kompetitor."
            );
            break;

          case "Kesiapan Pemasaran":
            recommendations.push(
              "Susun strategi promosi, manfaatkan media sosial, dan tentukan cara mendapatkan pelanggan."
            );
            break;

          case "Kesiapan Keuangan":
            recommendations.push(
              "Buat perencanaan modal, hitung biaya produksi, dan tentukan harga jual yang sesuai."
            );
            break;

          case "Kesiapan Operasional":
            recommendations.push(
              "Susun alur produksi, tentukan pemasok bahan baku, dan buat sistem pengelolaan pesanan."
            );
            break;

          default:
            break;
        }
      }
    });

    return recommendations;
  };

  return (
    <div className="assessment-page">
      <style>{`
        .assessment-page {
          max-width: 950px;
          margin: 0 auto;
          padding: 32px 20px;
          color: #292d36;
        }

        .assessment-header {
          margin-bottom: 28px;
        }

        .assessment-header h1 {
          font-size: 27px;
          margin-bottom: 10px;
        }

        .assessment-header p {
          color: #777;
          line-height: 1.7;
        }

        .assessment-progress {
          background: white;
          border: 1px solid #eee;
          border-radius: 14px;
          padding: 20px;
          margin-bottom: 25px;
        }

        .progress-track {
          height: 9px;
          background: #eeeaf8;
          border-radius: 20px;
          overflow: hidden;
          margin-top: 12px;
        }

        .progress-fill {
          height: 100%;
          background: #8068c9;
          transition: width .3s ease;
        }

        .assessment-section {
          background: white;
          border: 1px solid #eee;
          border-radius: 15px;
          padding: 24px;
          margin-bottom: 20px;
        }

        .assessment-section h3 {
          margin: 0 0 8px;
          font-size: 19px;
        }

        .assessment-section > p {
          color: #888;
          font-size: 14px;
          margin-bottom: 24px;
        }

        .assessment-question {
          padding: 18px 0;
          border-top: 1px solid #f0edf4;
        }

        .assessment-question h4 {
          font-size: 15px;
          font-weight: 500;
          line-height: 1.6;
          margin: 0 0 15px;
        }

        .answer-options {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 9px;
        }

        .answer-option {
          border: 1px solid #e6e2ed;
          border-radius: 9px;
          padding: 11px 7px;
          text-align: center;
          cursor: pointer;
          font-size: 12px;
          color: #666;
          transition: .2s;
        }

        .answer-option input {
          display: block;
          margin: 0 auto 8px;
          accent-color: #8068c9;
        }

        .answer-option.selected {
          border-color: #8068c9;
          background: #f4f0ff;
          color: #7157bd;
        }

        .assessment-submit {
          width: 100%;
          border: none;
          border-radius: 10px;
          background: #8068c9;
          color: white;
          padding: 15px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 10px;
        }

        .assessment-submit:hover {
          background: #7057b7;
        }

        .assessment-submit:disabled {
          opacity: .5;
          cursor: not-allowed;
        }

        .result-card {
          background: white;
          border: 1px solid #eee;
          border-radius: 16px;
          padding: 28px;
        }

        .result-score {
          text-align: center;
          padding: 25px 10px;
          background: #f7f4ff;
          border-radius: 13px;
          margin: 20px 0;
        }

        .result-score strong {
          display: block;
          font-size: 48px;
          color: #8068c9;
        }

        .result-score h2 {
          color: #7157bd;
          margin: 8px 0;
        }

        .aspect-result {
          margin: 20px 0;
        }

        .aspect-result p {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          font-size: 14px;
        }

        .recommendation-list {
          padding-left: 20px;
          line-height: 1.8;
          color: #666;
        }

        .reset-button {
          width: 100%;
          padding: 14px;
          border: 1px solid #8068c9;
          background: white;
          color: #8068c9;
          border-radius: 10px;
          cursor: pointer;
          margin-top: 20px;
          font-weight: 600;
        }

        @media (max-width: 600px) {
          .answer-options {
            grid-template-columns: repeat(2, 1fr);
          }

          .assessment-section {
            padding: 17px;
          }

          .assessment-header h1 {
            font-size: 23px;
          }
        }
      `}</style>

      {!result ? (
        <>
          <div className="assessment-header">
            <h1>Business Readiness Assessment</h1>
            <p>
              Kenali tingkat kesiapan bisnis kuliner kamu melalui
              penilaian beberapa aspek penting sebelum memulai
              atau mengembangkan bisnis.
            </p>
          </div>

          <div className="assessment-progress">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 10,
              }}
            >
              <strong>Progress Assessment</strong>
              <span>{progress}%</span>
            </div>

            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>

            <small>
              {answeredCount} dari {totalQuestions} pertanyaan dijawab
            </small>
          </div>

          <form onSubmit={handleSubmit}>
            {assessmentSections.map((section, sectionIndex) => (
              <div className="assessment-section" key={section.title}>
                <h3>
                  {sectionIndex + 1}. {section.title}
                </h3>

                <p>{section.description}</p>

                {section.questions.map((question, questionIndex) => {
                  const questionKey = `${sectionIndex}-${questionIndex}`;

                  return (
                    <div
                      className="assessment-question"
                      key={questionKey}
                    >
                      <h4>
                        {questionIndex + 1}. {question}
                      </h4>

                      <div className="answer-options">
                        {answerOptions.map((option) => (
                          <label
                            key={option.value}
                            className={`answer-option ${
                              answers[questionKey] === option.value
                                ? "selected"
                                : ""
                            }`}
                          >
                            <input
                              type="radio"
                              name={questionKey}
                              value={option.value}
                              checked={
                                answers[questionKey] === option.value
                              }
                              onChange={() =>
                                handleAnswer(
                                  questionKey,
                                  option.value
                                )
                              }
                            />

                            {option.label}
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}

            <button
              type="submit"
              className="assessment-submit"
              disabled={answeredCount !== totalQuestions}
            >
              Lihat Hasil Assessment
            </button>
          </form>
        </>
      ) : (
        <div className="result-card">
          <h1>Hasil Assessment Bisnis</h1>

          <p>
            Berikut hasil penilaian kesiapan bisnis berdasarkan
            jawaban yang telah kamu berikan.
          </p>

          <div className="result-score">
            <strong>{result.percentage}%</strong>
            <h2>{result.category}</h2>
            <p>{result.description}</p>
            <small>
              Total skor: {result.totalScore} / {result.maxScore}
            </small>
          </div>

          <h3>Hasil Setiap Aspek</h3>

          {result.aspects.map((aspect) => (
            <div className="aspect-result" key={aspect.title}>
              <p>
                <strong>{aspect.title}</strong>
                <span>{aspect.percentage}%</span>
              </p>

              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${aspect.percentage}%` }}
                />
              </div>
            </div>
          ))}

          <h3>Rekomendasi Pengembangan</h3>

          {getRecommendations().length > 0 ? (
            <ul className="recommendation-list">
              {getRecommendations().map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          ) : (
            <p>
              Pertahankan kesiapan bisnis yang sudah baik dan
              lanjutkan pengembangan strategi bisnis kamu.
            </p>
          )}

          <button
            className="reset-button"
            onClick={handleReset}
          >
            Ulangi Assessment
          </button>
        </div>
      )}
    </div>
  );
}

export default BusinessAssessment;
