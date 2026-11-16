
import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = (
  import.meta.env.VITE_API_URL ||
  "https://startiva-production.up.railway.app/api"
).replace(/\/+$/, "");

function ApiStatus() {
  const [status, setStatus] = useState("Memeriksa koneksi...");
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    let isMounted = true;

    console.log("API STATUS URL:", `${API_URL}/test`);

    axios
      .get(`${API_URL}/test`, {
        timeout: 15000,
        headers: {
          Accept: "application/json",
        },
      })
      .then((response) => {
        if (!isMounted) return;

        setStatus(
          response.data?.message || "Backend berhasil terhubung."
        );
        setConnected(true);
      })
      .catch((error) => {
        if (!isMounted) return;

        console.error("API STATUS ERROR:", error);

        setStatus(
          error.response
            ? `Server merespons dengan status ${error.response.status}.`
            : "Tidak dapat menghubungi server Laravel Railway."
        );

        setConnected(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div
      style={{
        padding: "16px",
        margin: "20px auto",
        maxWidth: "500px",
        borderRadius: "12px",
        background: connected ? "#e9f8ef" : "#fff0f0",
        color: connected ? "#237a45" : "#b42318",
        textAlign: "center",
      }}
    >
      <strong>
        {connected ? "Backend Connected" : "Backend Status"}
      </strong>

      <p>{status}</p>
    </div>
  );
}

export default ApiStatus;
