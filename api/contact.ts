import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const payload = req.body || {};
    if (!payload.email || !payload.name) {
      return res.status(400).json({ message: "Missing required fields: name and email" });
    }

    // Forward to your external API. Set API_URL in Vercel Environment Variables (e.g. https://api.example.com)
    const apiUrl = process.env.API_URL;
    if (!apiUrl) {
      console.warn("API_URL not set — not forwarding, just logging");
      console.log("Received contact submission:", JSON.stringify(payload));
      return res.status(200).json({ ok: true, received: payload });
    }

    const forwardRes = await fetch(`${apiUrl}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const body = await forwardRes.text();
    // Pass through status and body (try to parse JSON)
    try {
      return res.status(forwardRes.status).json(JSON.parse(body));
    } catch {
      return res.status(forwardRes.status).send(body);
    }
  } catch (err: any) {
    console.error("api/contact error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
