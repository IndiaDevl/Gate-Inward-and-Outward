import React, { useRef, useState } from "react";
import jsQR from "jsqr";

export default function QRUpload() {
  const canvasRef = useRef(null);
  const [decodedText, setDecodedText] = useState("");
  const [parsed, setParsed] = useState(null);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  // simple parser for your sample (split by '|')
  const parseQRText = (text) => {
    // splits and trims each part, ignoring empty parts
    const parts = text.split("|").map(p => p.trim()).filter(Boolean);
    // adapt mapping to your BO fields
    return {
      gateEntryId: parts[0] || null,
      referenceId: parts[1] || null,
      weight: parts[2] || null,
      timestamp: parts[3] || null,
      vehicle: parts[4] || null,
      transporter: parts[5] || null,
      material: parts[6] || null,
      grade: parts[7] || null,
      mtId: parts[8] || null,
      location: parts[9] || null
    };
  };

  const handleFile = async (e) => {
    setError("");
    setDecodedText("");
    setParsed(null);

    const file = e.target.files?.[0];
    if (!file) return;

    const img = new Image();
    img.onload = () => {
      // draw to canvas
      const canvas = canvasRef.current;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      // get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      if (!code) {
        setError("QR code not found or unreadable. Try a higher resolution photo.");
        return;
      }
      setDecodedText(code.data);
      setParsed(parseQRText(code.data));
    };

    img.onerror = () => setError("Failed to load image file.");
    img.src = URL.createObjectURL(file);
  };

  const handleSend = async () => {
    if (!parsed) {
      setError("No parsed data to send.");
      return;
    }
    setSending(true);
    setError("");
    try {
      const response = await fetch("http://localhost:5000/api/gate-entries/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Server Error");
      alert("Created record. ID: " + (result.id || result.auditId || "n/a"));
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to create record");
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h3>Upload QR Image</h3>
      <input type="file" accept="image/*" onChange={handleFile} />
      <canvas ref={canvasRef} style={{ display: "none" }} />
      {error && <div style={{ color: "crimson", marginTop: 8 }}>{error}</div>}

      {decodedText && (
        <div style={{ marginTop: 12 }}>
          <h4>Decoded text</h4>
          <pre style={{ whiteSpace: "pre-wrap", background: "#f6f6f6", padding: 8 }}>{decodedText}</pre>

          <h4>Parsed fields (confirm)</h4>
          <div style={{ background: "#fafafa", padding: 10 }}>
            {Object.entries(parsed).map(([k, v]) => (
              <div key={k}><strong>{k}:</strong> {v || "—"}</div>
            ))}
          </div>

          <div style={{ marginTop: 12 }}>
            <button onClick={handleSend} disabled={sending} style={{ padding: "8px 12px" }}>
              {sending ? "Sending…" : "Create Gate Entry"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
