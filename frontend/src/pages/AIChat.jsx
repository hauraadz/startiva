
import { useState, useRef, useEffect } from "react";
import "./AIChat.css";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api"
).replace(/\/+$/, "");

const INITIAL_MESSAGE = {
  role: "assistant",
  content:
    "Halo! Aku Startiva AI Business Assistant. Aku siap membantu kamu mengembangkan ide dan merencanakan bisnis. Apa yang ingin kamu diskusikan hari ini?",
};

function AIChat() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("ready");

  const messageListRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop =
        messageListRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async (event) => {
    event?.preventDefault();

    const text = message.trim();

    if (!text || loading) return;

    const token = localStorage.getItem("startiva_token");

    if (!token) {
      setConnectionStatus("error");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sesi login kamu sudah tidak tersedia. Silakan login kembali untuk menggunakan Startiva AI.",
        },
      ]);
      return;
    }

    const history = messages
      .filter(
        (item) =>
          ["user", "assistant"].includes(item.role) &&
          typeof item.content === "string"
      )
      .slice(-20)
      .map((item) => ({
        role: item.role,
        content: item.content,
      }));

    setMessages((prev) => [
      ...prev,
      { role: "user", content: text },
    ]);

    setMessage("");
    setLoading(true);
    setConnectionStatus("connecting");

    try {
      const response = await fetch(`${API_URL}/ai/chat`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: text,
          history,
        }),
      });

      const responseText = await response.text();

      let data;

      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch {
        throw new Error(
          `Server memberikan respons yang tidak valid (HTTP ${response.status}).`
        );
      }

      if (response.status === 401 || response.status === 419) {
        throw new Error(
          "Sesi login tidak valid atau sudah berakhir. Silakan login kembali."
        );
      }

      if (response.status === 403) {
        throw new Error(
          "Akses ditolak. Periksa autentikasi akun kamu."
        );
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
          `Server mengalami kendala (HTTP ${response.status}).`
        );
      }

      if (!data.success) {
        throw new Error(
          data.message || "Hermes belum dapat memproses pesan."
        );
      }

      if (
        typeof data.reply !== "string" ||
        !data.reply.trim()
      ) {
        throw new Error("AI memberikan jawaban kosong.");
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply.trim(),
        },
      ]);

      setConnectionStatus("connected");
    } catch (error) {
      console.error("Startiva AI Error:", error);

      setConnectionStatus("error");

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Maaf, terjadi kendala: ${error.message}`,
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage(event);
    }
  };

  const statusLabel = {
    ready: "Siap digunakan",
    connecting: "Menghubungkan...",
    connected: "Terhubung",
    error: "Perlu diperiksa",
  };

  return (
    <main className="ai-chat-page">

      {/* Header */}
      <header className="ai-chat-header">
        <div className="ai-header-identity">
          <div className="ai-avatar">S</div>

          <div className="ai-header-text">
            <span className="ai-label">STARTIVA AI</span>
            <h2>Business Assistant</h2>
            <p>Teman diskusi untuk perjalanan bisnismu</p>
          </div>
        </div>

        <div className={`ai-status ${connectionStatus}`}>
          <span className="ai-status-dot"></span>
          {statusLabel[connectionStatus]}
        </div>
      </header>

      {/* Chat Content */}
      <section className="ai-chat-content">

        <div className="ai-welcome">
          <div className="ai-welcome-icon">S</div>

          <span className="ai-welcome-label">
            YOUR BUSINESS COMPANION
          </span>

          <h3>Let's grow your idea.</h3>

          <p>
            Setiap bisnis dimulai dari sebuah ide.
            Ceritakan rencanamu, tanyakan hal yang ingin kamu ketahui,
            dan temukan langkah pengembangan bisnis bersama Startiva AI.
          </p>
        </div>

        {/* Messages */}
        <div
          className="ai-message-list"
          ref={messageListRef}
          aria-live="polite"
        >
          {messages.map((item, index) => (
            <div
              key={index}
              className={`ai-message-row ${
                item.role === "user"
                  ? "user-row"
                  : "assistant-row"
              }`}
            >
              {item.role === "assistant" && (
                <div className="ai-message-avatar">S</div>
              )}

              <div className="ai-message-content">
                <span className="ai-message-sender">
                  {item.role === "user" ? "Kamu" : "Startiva AI"}
                </span>

                <div className="ai-message-bubble">
                  {item.content}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="ai-message-row assistant-row">
              <div className="ai-message-avatar">S</div>

              <div className="ai-message-content">
                <span className="ai-message-sender">
                  Startiva AI
                </span>

                <div className="ai-message-bubble ai-typing">
                  <span></span>
                  <span></span>
                  <span></span>
                  <small>Sedang menyiapkan jawaban...</small>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Input */}
      <footer className="ai-chat-input-area">
        <form onSubmit={sendMessage} className="ai-chat-form">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tulis pertanyaan bisnis kamu..."
            disabled={loading}
            maxLength={3000}
            aria-label="Pesan untuk Startiva AI"
          />

          <button
            type="submit"
            disabled={!message.trim() || loading}
          >
            {loading ? (
              "Mengirim..."
            ) : (
              <>
                Kirim
                <span>→</span>
              </>
            )}
          </button>
        </form>

        <div className="ai-input-footer">
          <span>Tekan Enter untuk mengirim pesan</span>
          <span>{message.length}/3000</span>
        </div>

        <small className="ai-disclaimer">
          AI dapat memberikan saran yang perlu disesuaikan
          dengan kondisi bisnis sebenarnya.
        </small>
      </footer>
    </main>
  );
}

export default AIChat;
