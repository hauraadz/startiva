
import { useState, useRef, useEffect } from "react";
import "./AIChat.css";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api"
).replace(/\/$/, "");

const CHAT_ENDPOINT = `${API_URL}/mahasiswa/ai/chat`;

const INITIAL_MESSAGE = {
  role: "assistant",
  content:
    "Halo! Senang kamu mampir ke sini. Kamu nggak harus punya semua jawaban sekarang. Kita bisa mulai dari hal kecil yang sedang ada di pikiranmu. Aku siap mendengarkan.",
  time: new Date(),
};

const TOPICS = [
  {
    title: "Lagi banyak pikiran",
    description: "Ceritakan apa yang sedang memenuhi pikiranmu.",
    prompt: "Aku sedang banyak pikiran dan ingin cerita.",
  },
  {
    title: "Kehilangan motivasi",
    description: "Saat rasanya sulit untuk memulai sesuatu.",
    prompt: "Akhir-akhir ini aku kehilangan motivasi.",
  },
  {
    title: "Mengatur waktu",
    description: "Ketika tugas dan aktivitas terasa menumpuk.",
    prompt: "Aku kesulitan mengatur waktu dan aktivitas.",
  },
  {
    title: "Memahami diriku",
    description: "Kenali apa yang sedang kamu rasakan.",
    prompt: "Aku ingin lebih memahami diriku sendiri.",
  },
];

export default function AIChat() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("ready");

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, loading]);

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const startNewConversation = () => {
    if (loading) return;

    setMessages([
      {
        ...INITIAL_MESSAGE,
        time: new Date(),
      },
    ]);

    setMessage("");
    setConnectionStatus("ready");
    inputRef.current?.focus();
  };

  const sendMessage = async (text = message) => {
    const content = text.trim();

    if (!content || loading) return;

    const token = localStorage.getItem("startiva_token");

    if (!token) {
      setConnectionStatus("error");

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sesi login kamu sepertinya sudah berakhir. Silakan login kembali untuk melanjutkan percakapan.",
          time: new Date(),
        },
      ]);

      return;
    }

    const userMessage = {
      role: "user",
      content,
      time: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setLoading(true);
    setConnectionStatus("connecting");

    try {
      const history = messages
        .filter(
          (item) =>
            item.role === "user" || item.role === "assistant"
        )
        .slice(-20)
        .map(({ role, content }) => ({
          role,
          content,
        }));

      const response = await fetch(CHAT_ENDPOINT, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: content,
          history,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.status === 401 || response.status === 419) {
        throw new Error(
          "Sesi login berakhir. Silakan login kembali."
        );
      }

      if (response.status === 403) {
        throw new Error(
          "Kamu tidak memiliki akses ke fitur ini."
        );
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Belum bisa mengirim pesan. Coba lagi sebentar, ya."
        );
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            data.reply ||
            "Maaf, aku belum bisa memberikan respons.",
          time: new Date(),
        },
      ]);

      setConnectionStatus("ready");
    } catch (error) {
      setConnectionStatus("error");

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            error.message ||
            "Terjadi kendala. Silakan coba lagi.",
          time: new Date(),
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const isInitialConversation = messages.length === 1;

  return (
    <main className="inner-space-page">
      <section className="inner-space-container">

        {/* HEADER */}
        <header className="inner-space-header">
          <div className="inner-space-brand">
            <div>
              <span className="inner-space-eyebrow">
                STARTIVA
              </span>
              <h1>Inner Space</h1>
            </div>
          </div>

          <button
            type="button"
            className="inner-space-new-chat"
            onClick={startNewConversation}
            disabled={loading}
          >
            Percakapan baru
          </button>
        </header>

        <div className="inner-space-content">

          {/* INTRODUCTION */}
          <div className="inner-space-intro">
            <span className="inner-space-intro-label">
              A LITTLE SPACE FOR YOU
            </span>

            <h2>
              Kamu boleh berhenti
              <br />
              <span>sejenak di sini.</span>
            </h2>

            <p>
              Tidak semua hal harus diselesaikan hari ini.
              Ceritakan apa yang sedang kamu rasakan, kita mulai
              dari satu hal kecil.
            </p>
          </div>

          {/* TOPIC CARDS */}
          {isInitialConversation && (
            <section className="inner-space-topics">
              <div className="inner-space-section-heading">
                <div>
                  <span className="inner-space-section-label">
                    MULAI DARI SINI
                  </span>

                  <h3>
                    Apa yang sedang kamu rasakan?
                  </h3>
                </div>

                <span className="topic-count">
                  01 — 04
                </span>
              </div>

              <div className="inner-space-topic-grid">
                {TOPICS.map((topic, index) => (
                  <button
                    type="button"
                    className={`inner-space-topic topic-${index + 1}`}
                    key={topic.title}
                    onClick={() => sendMessage(topic.prompt)}
                    disabled={loading}
                  >
                    <span className="topic-title">
                      {topic.title}
                    </span>

                    <span className="topic-description">
                      {topic.description}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* CONVERSATION */}
          <section className="inner-space-conversation">
            <div className="conversation-heading">
              <div>
                <span className="inner-space-section-label">
                  YOUR CONVERSATION
                </span>

                <h3>
                  {isInitialConversation
                    ? "Mulai percakapan"
                    : "Percakapan kita"}
                </h3>
              </div>

              <span className="conversation-status">
                <span
                  className={`status-indicator ${
                    connectionStatus === "error"
                      ? "status-error"
                      : ""
                  }`}
                />

                {connectionStatus === "connecting"
                  ? "Sedang merespons"
                  : connectionStatus === "error"
                  ? "Ada kendala"
                  : "Siap mendengarkan"}
              </span>
            </div>

            <div className="inner-space-message-list">
              {messages.map((item, index) => (
                <div
                  key={`${index}-${item.time}`}
                  className={`inner-space-message ${
                    item.role === "user"
                      ? "message-user"
                      : "message-companion"
                  }`}
                >
                  <div className="message-body">
                    {item.role === "assistant" && (
                      <span className="message-author">
                        INNER SPACE
                      </span>
                    )}

                    <div
                      className={`message-bubble ${
                        item.isError ? "message-error" : ""
                      }`}
                    >
                      {item.content}
                    </div>

                    <span className="message-time">
                      {formatTime(item.time)}
                    </span>
                  </div>
                </div>
              ))}

              {/* LOADING */}
              {loading && (
                <div className="inner-space-message message-companion">
                  <div className="message-body">
                    <span className="message-author">
                      INNER SPACE
                    </span>

                    <div className="message-bubble typing-bubble">
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </section>
        </div>

        {/* MESSAGE INPUT */}
        <footer className="inner-space-composer">
          <form
            className="inner-space-form"
            onSubmit={handleSubmit}
          >
            <textarea
              ref={inputRef}
              value={message}
              onChange={(event) =>
                setMessage(event.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="Tulis apa pun yang ingin kamu ceritakan..."
              rows={1}
              disabled={loading}
            />

            <button
              type="submit"
              className="inner-space-send"
              disabled={!message.trim() || loading}
            >
              Kirim
            </button>
          </form>

          <div className="composer-footer">
            <span>
              Tekan Enter untuk mengirim · Shift + Enter untuk baris baru
            </span>

            <span>A space without judgment</span>
          </div>

          <p className="inner-space-disclaimer">
            Inner Space adalah pendamping refleksi diri, bukan
            pengganti konselor profesional. Jika kamu membutuhkan
            dukungan lebih lanjut, kamu dapat menghubungi konselor
            sebaya Startiva.
          </p>
        </footer>
      </section>
    </main>
  );
}
