// Simple Vercel serverless login function.
// Expects POST { password }
// Compare against process.env.SITE_PASSWORD and set an HttpOnly cookie on success.

module.exports = (req, res) => {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  let body = "";
  req.on("data", (chunk) => (body += chunk));
  req.on("end", () => {
    try {
      const parsed = JSON.parse(body || "{}");
      const pw = (parsed.password || "").trim();
      const secret = process.env.SITE_PASSWORD || "";

      if (!secret) {
        res.status(500).json({ ok: false, error: "Server not configured" });
        return;
      }

      if (pw === secret) {
        // Set HttpOnly cookie for 1 hour
        const maxAge = 60 * 60; // seconds
        res.setHeader(
          "Set-Cookie",
          `site_auth=1; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Strict; Secure`,
        );
        res.status(200).json({ ok: true });
      } else {
        res.status(401).json({ ok: false });
      }
    } catch (err) {
      res.status(400).json({ ok: false, error: "Bad request" });
    }
  });
};
