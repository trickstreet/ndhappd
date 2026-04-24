// Simple Vercel serverless login function.
// Expects POST { password }
// Compare against process.env.SITE_PASSWORD and set an HttpOnly cookie on success.

module.exports = (req, res) => {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  function handlePayload(parsed) {
    try {
      const pw = String((parsed && parsed.password) || "").trim();
      const secret = String(process.env.SITE_PASSWORD || "").trim();

      if (!secret) {
        res.status(500).json({ ok: false, error: "Server not configured" });
        return;
      }

      // Keep same behavior as the previous client-side check (case-insensitive).
      const isValid = pw.toLowerCase() === secret.toLowerCase();

      if (isValid) {
        // Set HttpOnly cookie for 1 hour
        const maxAge = 60 * 60; // seconds
        res.setHeader(
          "Set-Cookie",
          `site_auth=1; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Strict; Secure`,
        );
        res.status(200).json({ ok: true });
      } else {
        res.status(401).json({ ok: false, error: "Invalid password" });
      }
    } catch (err) {
      res.status(400).json({ ok: false, error: "Bad request" });
    }
  }

  if (req.body && typeof req.body === "object") {
    handlePayload(req.body);
    return;
  }

  let body = "";
  req.on("data", (chunk) => (body += chunk));
  req.on("end", () => {
    const parsed = body ? JSON.parse(body) : {};
    handlePayload(parsed);
  });
};
