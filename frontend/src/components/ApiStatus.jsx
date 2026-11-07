
import { useEffect, useState } from "react";
import axios from "axios";

function ApiStatus() {
  const [status, setStatus] = useState("Memeriksa koneksi...");
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/test`)
      .then((response) => {
        setStatus(response.data.message);
        setConnected(true);
      })
      .catch(() => {
        setStatus("Belum terhubung ke server Laravel.");
        setConnected(false);
      });
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
