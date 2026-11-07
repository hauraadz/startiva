
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

    // Simpan riwayat sebelum pesan terbaru ditambahkan.
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

      // Tangani respons yang bukan JSON.
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

  return (
    <div className="ai-chat-page">
      <div className="ai-chat-header">
        <div className="ai-avatar">S</div>

        <div>
          <span className="ai-label">STARTIVA AI</span>
          <h2>Business Assistant</h2>
          <p>Teman diskusi untuk perjalanan bisnismu</p>
        </div>

        <span
          className={`ai-status ${
            connectionStatus === "connected"
              ? "connected"
              : connectionStatus === "error"
              ? "disconnected"
              : ""
          }`}
        >
          <span />
          {connectionStatus === "connected"
            ? "Terhubung"
            : connectionStatus === "error"
            ? "Perlu diperiksa"
            : connectionStatus === "connecting"
            ? "Menghubungkan"
            : "Siap"}
        </span>
      </div>

      <div className="ai-chat-content">
        <div className="ai-welcome">
          <span className="ai-welcome-icon">✦</span>
          <h3>Let's grow your idea.</h3>
          <p>
            Ceritakan ide, tantangan, atau rencana bisnismu.
            Kita cari langkah pengembangannya bersama.
          </p>
        </div>

        <div className="ai-message-list" ref={messageListRef}>
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

              <div className="ai-message-bubble">
                {item.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="ai-message-row assistant-row">
              <div className="ai-message-avatar">S</div>

              <div className="ai-message-bubble ai-typing">
                Sedang menyiapkan jawaban...
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="ai-chat-input-area">
        <form
          onSubmit={sendMessage}
          className="ai-chat-form"
        >
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tulis pertanyaan bisnis kamu..."
            disabled={loading}
            maxLength={3000}
          />

          <button
            type="submit"
            disabled={!message.trim() || loading}
          >
            {loading ? "Mengirim..." : "Kirim"}
            <span> →</span>
          </button>
        </form>

        <small>
          AI dapat memberikan saran yang perlu disesuaikan
          dengan kondisi bisnis sebenarnya.
        </small>
      </div>
    </div>
  );
}

export default AIChat;
