
import { useState } from "react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

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
  { value: 1, label: "Sangat Tidak Setuju", short: "STS" },
  { value: 2, label: "Tidak Setuju", short: "TS" },
  { value: 3, label: "Setuju", short: "S" },
  { value: 4, label: "Sangat Setuju", short: "SS" },
];

const totalQuestions = assessmentSections.reduce(
  (total, section) => total + section.questions.length,
  0
);

function BusinessAssessment() {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const answeredCount = Object.keys(answers).length;

  const progress = Math.round(
    (answeredCount / totalQuestions) * 100
  );

  const completedSections = assessmentSections.filter(
    (_, sectionIndex) =>
      assessmentSections[sectionIndex].questions.every(
        (_, questionIndex) =>
          answers[`${sectionIndex}-${questionIndex}`] !== undefined
      )
  ).length;

  const handleAnswer = (questionKey, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionKey]: value,
    }));

    if (error) setError("");
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

    return {
      totalScore,
      maxScore,
      percentage,
      category,
      description,
      aspects: aspectResults,
    };
  };

  const getRecommendations = (assessmentResult) => {
    if (!assessmentResult) return [];

    const recommendations = [];

    assessmentResult.aspects.forEach((aspect) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (answeredCount !== totalQuestions) {
      setError("Silakan jawab seluruh pertanyaan terlebih dahulu.");
      return;
    }

    const token = localStorage.getItem("startiva_token");

    if (!token) {
      setError("Sesi login tidak ditemukan. Silakan login kembali.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const calculatedResult = calculateResult();
      const recommendations = getRecommendations(calculatedResult);

      const payload = {
        answers,
        aspect_scores: calculatedResult.aspects,
        recommendations,
      };

      const response = await fetch(
        `${API_URL.replace(/\/$/, "")}/business-assessment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const validationErrors = data.errors
          ? Object.values(data.errors).flat().join(" ")
          : "";

        throw new Error(
          validationErrors ||
            data.message ||
            "Gagal menyimpan hasil assessment."
        );
      }

      if (!data.success) {
        throw new Error(
          data.message || "Hasil assessment gagal disimpan."
        );
      }

      setResult({
        ...calculatedResult,
        recommendations,
        assessmentId: data.data.id,
        createdAt: data.data.created_at,
        n8nStatus: data.n8n_status || "not_configured",
      });

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Assessment error:", err);

      setError(
        err.message || "Terjadi kesalahan saat menyimpan assessment."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setResult(null);
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const getN8nStatus = () => {
    switch (result?.n8nStatus) {
      case "sent":
        return {
          title: "Data berhasil dikirim ke n8n",
          description:
            "Hasil assessment berhasil diteruskan ke sistem pengolahan n8n.",
          className: "n8n-success",
          symbol: "✓",
        };

      case "failed":
        return {
          title: "Pengiriman ke n8n gagal",
          description:
            "Hasil assessment tetap berhasil disimpan di database Laravel, tetapi belum berhasil diteruskan ke n8n.",
          className: "n8n-failed",
          symbol: "!",
        };

      case "not_configured":
      default:
        return {
          title: "Integrasi n8n belum terhubung",
          description:
            "Hasil assessment berhasil disimpan, tetapi URL Webhook n8n belum dikonfigurasi atau belum terbaca oleh Laravel.",
          className: "n8n-pending",
          symbol: "i",
        };
    }
  };

  return (
    <div className="assessment-page">
      <style>{`
        .assessment-page {
          --as-primary: #A94442;
          --as-primary-dark: #853936;
          --as-light: #FBECE9;
          --as-blush: #F7E4DF;
          --as-text: #382A29;
          --as-muted: #8D7D7B;
          --as-border: #F0E7E4;
          --as-bg: #FAF7F5;

          width: 100%;
          max-width: 1050px;
          margin: 0 auto;
          padding: 32px 24px 55px;
          color: var(--as-text);
          font-family: "Plus Jakarta Sans", sans-serif;
        }

        .assessment-page * {
          box-sizing: border-box;
        }

        .assessment-page button {
          font-family: inherit;
        }

        /* HEADER */

        .assessment-topline {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--as-muted);
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.4px;
          margin-bottom: 12px;
        }

        .assessment-topline span {
          color: var(--as-primary);
        }

        .assessment-header {
          margin-bottom: 25px;
        }

        .assessment-header h1 {
          margin: 0 0 9px;
          font-size: clamp(23px, 3vw, 30px);
          font-weight: 800;
          letter-spacing: -1.1px;
        }

        .assessment-header p {
          max-width: 650px;
          margin: 0;
          color: var(--as-muted);
          font-size: 12px;
          line-height: 1.8;
        }

        .assessment-note {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 15px 17px;
          margin-top: 20px;
          border: 1px solid #F0DCD7;
          border-radius: 11px;
          background: #FFF8F5;
        }

        .assessment-note-icon {
          width: 29px;
          height: 29px;
          flex-shrink: 0;
          display: grid;
          place-items: center;
          border-radius: 9px;
          background: var(--as-light);
          color: var(--as-primary);
          font-size: 13px;
          font-weight: 800;
        }

        .assessment-note strong {
          display: block;
          font-size: 10px;
          margin-bottom: 4px;
        }

        .assessment-note p {
          margin: 0;
          color: var(--as-muted);
          font-size: 9px;
          line-height: 1.7;
        }

        /* PROGRESS */

        .assessment-progress {
          position: sticky;
          top: 10px;
          z-index: 5;
          padding: 18px 20px;
          margin-bottom: 23px;
          border: 1px solid var(--as-border);
          border-radius: 13px;
          background: rgba(255,255,255,.96);
          box-shadow: 0 5px 20px rgba(56,42,41,.04);
          backdrop-filter: blur(10px);
        }

        .progress-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
        }

        .progress-top strong {
          font-size: 11px;
          font-weight: 800;
        }

        .progress-percentage {
          color: var(--as-primary);
          font-size: 16px;
          font-weight: 800;
        }

        .progress-track {
          width: 100%;
          height: 7px;
          overflow: hidden;
          margin: 11px 0 9px;
          border-radius: 20px;
          background: #F2EAE7;
        }

        .progress-fill {
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #A94442, #D17B70);
          transition: width .3s ease;
        }

        .progress-bottom {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          color: var(--as-muted);
          font-size: 9px;
        }

        /* SECTION */

        .assessment-section {
          padding: 23px;
          margin-bottom: 17px;
          border: 1px solid var(--as-border);
          border-radius: 14px;
          background: white;
          box-shadow: 0 3px 15px rgba(56,42,41,.025);
        }

        .assessment-section-heading {
          display: flex;
          align-items: flex-start;
          gap: 13px;
          margin-bottom: 21px;
        }

        .section-number {
          width: 37px;
          height: 37px;
          flex-shrink: 0;
          display: grid;
          place-items: center;
          border-radius: 11px;
          background: var(--as-light);
          color: var(--as-primary);
          font-size: 12px;
          font-weight: 800;
        }

        .section-heading-content {
          flex: 1;
          min-width: 0;
        }

        .section-heading-content h3 {
          margin: 1px 0 5px;
          font-size: 14px;
          font-weight: 800;
        }

        .section-heading-content p {
          margin: 0;
          color: var(--as-muted);
          font-size: 10px;
          line-height: 1.7;
        }

        .section-complete {
          padding: 5px 9px;
          border-radius: 20px;
          background: #EDF7F0;
          color: #43805A;
          font-size: 8px;
          font-weight: 800;
          white-space: nowrap;
        }

        .section-incomplete {
          padding: 5px 9px;
          border-radius: 20px;
          background: #F7F2EF;
          color: #927D75;
          font-size: 8px;
          font-weight: 700;
          white-space: nowrap;
        }

        /* QUESTIONS */

        .assessment-question {
          padding: 18px 0;
          border-top: 1px solid #F3ECE9;
        }

        .question-heading {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          margin-bottom: 14px;
        }

        .question-number {
          width: 23px;
          height: 23px;
          flex-shrink: 0;
          display: grid;
          place-items: center;
          border-radius: 7px;
          background: #F8F3F0;
          color: var(--as-muted);
          font-size: 9px;
          font-weight: 800;
        }

        .question-heading h4 {
          flex: 1;
          margin: 2px 0 0;
          font-size: 11px;
          font-weight: 600;
          line-height: 1.8;
        }

        .question-answered {
          color: #43805A;
          font-size: 9px;
          font-weight: 800;
        }

        /* ANSWER OPTIONS */

        .answer-options {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 9px;
          padding-left: 32px;
        }

        .answer-option {
          min-width: 0;
          min-height: 53px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 9px 7px;
          border: 1px solid #EDE5E2;
          border-radius: 9px;
          background: #FFFFFF;
          color: #817573;
          cursor: pointer;
          text-align: center;
          font-size: 9px;
          font-weight: 600;
          line-height: 1.5;
          transition: .2s ease;
        }

        .answer-option:hover {
          border-color: #D9AAA3;
          background: #FFF9F7;
        }

        .answer-option.selected {
          border: 1.5px solid var(--as-primary);
          background: var(--as-light);
          color: var(--as-primary-dark);
          font-weight: 800;
        }

        .answer-option input {
          width: 13px;
          height: 13px;
          flex-shrink: 0;
          margin: 0;
          accent-color: var(--as-primary);
        }

        /* SUBMIT */

        .assessment-submit-area {
          padding: 20px;
          margin-top: 20px;
          border: 1px solid var(--as-border);
          border-radius: 13px;
          background: white;
        }

        .submit-information {
          margin-bottom: 14px;
        }

        .submit-information strong {
          display: block;
          margin-bottom: 5px;
          font-size: 11px;
        }

        .submit-information p {
          margin: 0;
          color: var(--as-muted);
          font-size: 9px;
          line-height: 1.7;
        }

        .assessment-submit {
          width: 100%;
          min-height: 47px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          border: 0;
          border-radius: 9px;
          background: var(--as-primary);
          color: white;
          font-size: 11px;
          font-weight: 800;
          cursor: pointer;
          transition: .2s ease;
        }

        .assessment-submit:hover:not(:disabled) {
          background: var(--as-primary-dark);
          transform: translateY(-1px);
          box-shadow: 0 5px 15px #A9444225;
        }

        .assessment-submit:disabled {
          background: #CDB8B3;
          cursor: not-allowed;
        }

        .error-message {
          display: flex;
          gap: 10px;
          align-items: flex-start;
          padding: 13px 15px;
          margin: 15px 0;
          border: 1px solid #F2CACA;
          border-radius: 9px;
          background: #FFF1F1;
          color: #B63D3D;
          font-size: 10px;
          line-height: 1.7;
        }

        /* RESULT */

        .result-card {
          padding: 27px;
          border: 1px solid var(--as-border);
          border-radius: 16px;
          background: white;
          box-shadow: 0 5px 25px rgba(56,42,41,.04);
        }

        .result-header-label {
          color: var(--as-primary);
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.6px;
        }

        .result-card > h1 {
          margin: 9px 0 7px;
          font-size: 24px;
          font-weight: 800;
          letter-spacing: -.8px;
        }

        .result-description {
          margin: 0;
          color: var(--as-muted);
          font-size: 11px;
          line-height: 1.8;
        }

        .saved-info {
          padding: 14px 16px;
          margin: 20px 0 12px;
          border: 1px solid #D4EADD;
          border-radius: 10px;
          background: #F0F8F2;
          color: #34744B;
          font-size: 10px;
          line-height: 1.8;
        }

        .saved-info strong {
          display: block;
          margin-bottom: 3px;
          font-size: 11px;
        }

        .n8n-status {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          padding: 14px 16px;
          margin: 12px 0 22px;
          border-radius: 10px;
          font-size: 10px;
          line-height: 1.7;
        }

        .n8n-status-symbol {
          width: 25px;
          height: 25px;
          flex-shrink: 0;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #FFFFFF80;
          font-weight: 800;
        }

        .n8n-status strong {
          display: block;
          margin-bottom: 3px;
          font-size: 11px;
        }

        .n8n-success {
          background: #EFF8F1;
          border: 1px solid #D1E8D7;
          color: #34744B;
        }

        .n8n-failed {
          background: #FFF5ED;
          border: 1px solid #F1D7C4;
          color: #A85B27;
        }

        .n8n-pending {
          background: #FFF8EF;
          border: 1px solid #F0E0C8;
          color: #91672E;
        }

        /* SCORE */

        .result-score {
          position: relative;
          overflow: hidden;
          padding: 29px 20px;
          border: 1px solid #EFD7D1;
          border-radius: 14px;
          background:
            radial-gradient(circle at 90% 10%, #EBC2B9 0, transparent 35%),
            linear-gradient(120deg, #FBEBE7, #FFF8F5);
          text-align: center;
        }

        .result-score-label {
          color: var(--as-primary-dark);
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.4px;
        }

        .result-score strong {
          display: block;
          margin: 12px 0 4px;
          color: var(--as-primary);
          font-size: clamp(45px, 8vw, 58px);
          font-weight: 800;
          letter-spacing: -2px;
        }

        .result-score h2 {
          margin: 4px 0 9px;
          color: var(--as-primary-dark);
          font-size: 19px;
          font-weight: 800;
        }

        .result-score p {
          max-width: 510px;
          margin: 0 auto 13px;
          color: #806B67;
          font-size: 10px;
          line-height: 1.8;
        }

        .result-score small {
          color: #967B75;
          font-size: 9px;
          font-weight: 700;
        }

        /* RESULT ASPECTS */

        .result-section {
          margin-top: 29px;
        }

        .result-section h3 {
          margin: 0 0 7px;
          font-size: 14px;
          font-weight: 800;
        }

        .result-section-description {
          margin: 0 0 17px;
          color: var(--as-muted);
          font-size: 10px;
          line-height: 1.7;
        }

        .aspect-result {
          padding: 13px 0;
          border-bottom: 1px solid #F3ECE9;
        }

        .aspect-result:last-child {
          border-bottom: 0;
        }

        .aspect-result-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          margin-bottom: 9px;
        }

        .aspect-result-top strong {
          font-size: 10px;
        }

        .aspect-result-top span {
          color: var(--as-primary);
          font-size: 11px;
          font-weight: 800;
        }

        .aspect-result .progress-track {
          margin: 0;
          height: 7px;
        }

        /* RECOMMENDATIONS */

        .recommendation-list {
          display: grid;
          gap: 10px;
          padding: 0;
          margin: 15px 0 0;
          list-style: none;
        }

        .recommendation-list li {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 13px 14px;
          border: 1px solid #F0E5E1;
          border-radius: 9px;
          background: #FFFAF8;
          color: #705C58;
          font-size: 10px;
          line-height: 1.8;
        }

        .recommendation-bullet {
          width: 21px;
          height: 21px;
          flex-shrink: 0;
          display: grid;
          place-items: center;
          border-radius: 7px;
          background: var(--as-light);
          color: var(--as-primary);
          font-size: 10px;
          font-weight: 800;
        }

        .recommendation-empty {
          padding: 16px;
          border-radius: 9px;
          background: #F5F8F3;
          color: #617B5D;
          font-size: 10px;
          line-height: 1.8;
        }

        .result-footer {
          padding-top: 22px;
          margin-top: 25px;
          border-top: 1px solid var(--as-border);
        }

        .reset-button {
          width: 100%;
          min-height: 45px;
          padding: 12px;
          border: 1px solid var(--as-primary);
          border-radius: 9px;
          background: white;
          color: var(--as-primary);
          font-size: 10px;
          font-weight: 800;
          cursor: pointer;
          transition: .2s ease;
        }

        .reset-button:hover {
          background: var(--as-light);
        }

        .assessment-page button:focus-visible,
        .assessment-page input:focus-visible {
          outline: 3px solid #E5B3AA;
          outline-offset: 3px;
        }

        /* RESPONSIVE */

        @media (max-width: 760px) {
          .assessment-page {
            padding: 25px 17px 40px;
          }

          .assessment-section {
            padding: 18px;
          }

          .answer-options {
            padding-left: 0;
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .answer-option {
            min-height: 45px;
            font-size: 9px;
          }

          .assessment-progress {
            top: 5px;
          }
        }

        @media (max-width: 480px) {
          .assessment-page {
            padding: 20px 13px 35px;
          }

          .assessment-header h1 {
            font-size: 22px;
          }

          .assessment-header p {
            font-size: 10px;
          }

          .assessment-section {
            padding: 15px;
          }

          .assessment-section-heading {
            gap: 9px;
          }

          .section-heading-content h3 {
            font-size: 12px;
          }

          .section-complete,
          .section-incomplete {
            font-size: 7px;
            padding: 5px 7px;
          }

          .question-heading h4 {
            font-size: 10px;
          }

          .result-card {
            padding: 18px;
          }

          .result-card > h1 {
            font-size: 21px;
          }

          .progress-bottom {
            font-size: 8px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .assessment-page *,
          .assessment-page *::before,
          .assessment-page *::after {
            transition-duration: .01ms !important;
          }
        }
      `}</style>

      {!result ? (
        <>
          <div className="assessment-topline">
            STARTIVA <span>/</span> BUSINESS ASSESSMENT
          </div>

          <div className="assessment-header">
            <h1>Business Readiness Assessment</h1>

            <p>
              Kenali tingkat kesiapan bisnis kuliner kamu melalui
              penilaian beberapa aspek penting sebelum memulai
              atau mengembangkan bisnis.
            </p>

            <div className="assessment-note">
              <div className="assessment-note-icon">i</div>
              <div>
                <strong>Sebelum memulai assessment</strong>
                <p>
                  Bacalah setiap pernyataan dengan cermat dan pilih
                  jawaban yang paling sesuai dengan kondisi bisnis
                  kamu saat ini. Seluruh pertanyaan wajib dijawab.
                </p>
              </div>
            </div>
          </div>

          <div className="assessment-progress">
            <div className="progress-top">
              <strong>Progress Assessment</strong>
              <span className="progress-percentage">{progress}%</span>
            </div>

            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="progress-bottom">
              <span>
                {answeredCount} dari {totalQuestions} pertanyaan dijawab
              </span>
              <span>
                {completedSections} dari {assessmentSections.length} bagian selesai
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {assessmentSections.map((section, sectionIndex) => {
              const sectionAnswered = section.questions.filter(
                (_, questionIndex) =>
                  answers[`${sectionIndex}-${questionIndex}`] !== undefined
              ).length;

              const sectionComplete =
                sectionAnswered === section.questions.length;

              return (
                <section
                  className="assessment-section"
                  key={section.title}
                >
                  <div className="assessment-section-heading">
                    <div className="section-number">
                      {String(sectionIndex + 1).padStart(2, "0")}
                    </div>

                    <div className="section-heading-content">
                      <h3>{section.title}</h3>
                      <p>{section.description}</p>
                    </div>

                    <span
                      className={
                        sectionComplete
                          ? "section-complete"
                          : "section-incomplete"
                      }
                    >
                      {sectionComplete ? "Selesai" : `${sectionAnswered}/${section.questions.length}`}
                    </span>
                  </div>

                  {section.questions.map((question, questionIndex) => {
                    const questionKey = `${sectionIndex}-${questionIndex}`;

                    const selectedAnswer = answers[questionKey];

                    return (
                      <div
                        className="assessment-question"
                        key={questionKey}
                      >
                        <div className="question-heading">
                          <span className="question-number">
                            {questionIndex + 1}
                          </span>

                          <h4>{question}</h4>

                          {selectedAnswer !== undefined && (
                            <span className="question-answered">
                              ✓
                            </span>
                          )}
                        </div>

                        <div
                          className="answer-options"
                          role="radiogroup"
                          aria-label={question}
                        >
                          {answerOptions.map((option) => (
                            <label
                              key={option.value}
                              className={`answer-option ${
                                selectedAnswer === option.value
                                  ? "selected"
                                  : ""
                              }`}
                            >
                              <input
                                type="radio"
                                name={questionKey}
                                value={option.value}
                                checked={selectedAnswer === option.value}
                                onChange={() =>
                                  handleAnswer(questionKey, option.value)
                                }
                              />

                              {option.label}
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </section>
              );
            })}

            {error && (
              <div className="error-message" role="alert">
                <strong>!</strong>
                <span>{error}</span>
              </div>
            )}

            <div className="assessment-submit-area">
              <div className="submit-information">
                <strong>
                  {answeredCount === totalQuestions
                    ? "Semua pertanyaan sudah dijawab!"
                    : "Selesaikan seluruh pertanyaan"}
                </strong>

                <p>
                  {answeredCount === totalQuestions
                    ? "Kirim jawaban kamu untuk melihat hasil dan rekomendasi kesiapan bisnis."
                    : `Masih ada ${totalQuestions - answeredCount} pertanyaan yang belum dijawab.`}
                </p>
              </div>

              <button
                type="submit"
                className="assessment-submit"
                disabled={answeredCount !== totalQuestions || loading}
              >
                {loading
                  ? "Menyimpan Hasil Assessment..."
                  : "Lihat Hasil Assessment"}
                {!loading && <span>→</span>}
              </button>
            </div>
          </form>
        </>
      ) : (
        <div className="result-card">
          <div className="result-header-label">
            STARTIVA / ASSESSMENT RESULT
          </div>

          <h1>Hasil Assessment Bisnis</h1>

          <p className="result-description">
            Berikut hasil penilaian kesiapan bisnis berdasarkan
            jawaban yang telah kamu berikan.
          </p>

          <div className="saved-info">
            <strong>✓ Hasil assessment berhasil disimpan.</strong>
            Data telah tersimpan di database Laravel.
            <br />
            ID Assessment: #{result.assessmentId}
          </div>

          {(() => {
            const status = getN8nStatus();

            return (
              <div className={`n8n-status ${status.className}`}>
                <div className="n8n-status-symbol">
                  {status.symbol}
                </div>
                <div>
                  <strong>{status.title}</strong>
                  {status.description}
                </div>
              </div>
            );
          })()}

          <div className="result-score">
            <div className="result-score-label">
              BUSINESS READINESS SCORE
            </div>

            <strong>{result.percentage}%</strong>

            <h2>{result.category}</h2>

            <p>{result.description}</p>

            <small>
              Total skor: {result.totalScore} / {result.maxScore}
            </small>
          </div>

          <div className="result-section">
            <h3>Hasil Setiap Aspek</h3>

            <p className="result-section-description">
              Berikut tingkat kesiapan bisnis berdasarkan lima aspek penilaian.
            </p>

            {result.aspects.map((aspect) => (
              <div className="aspect-result" key={aspect.title}>
                <div className="aspect-result-top">
                  <strong>{aspect.title}</strong>
                  <span>{aspect.percentage}%</span>
                </div>

                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: `${aspect.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="result-section">
            <h3>Rekomendasi Pengembangan</h3>

            <p className="result-section-description">
              Beberapa hal yang dapat kamu lakukan untuk meningkatkan kesiapan bisnis.
            </p>

            {result.recommendations.length > 0 ? (
              <ul className="recommendation-list">
                {result.recommendations.map((item, index) => (
                  <li key={index}>
                    <span className="recommendation-bullet">
                      {index + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="recommendation-empty">
                Seluruh aspek bisnis kamu sudah menunjukkan kesiapan
                yang baik. Pertahankan kondisi ini dan lanjutkan
                pengembangan strategi bisnis.
              </div>
            )}
          </div>

          <div className="result-footer">
            <button
              className="reset-button"
              onClick={handleReset}
              type="button"
            >
              Ulangi Assessment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BusinessAssessment;
