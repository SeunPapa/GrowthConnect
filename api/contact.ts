import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const payload = req.body || {};
    // simple required field check
    if (!payload.email || !payload.name) {
      return res.status(400).json({ message: "Missing required fields: name and email" });
    }

    console.log("Received contact submission:", JSON.stringify(payload));

    // TODO: forward to real backend or persist to DB
    return res.status(200).json({ ok: true, received: payload });
  } catch (err: any) {
    console.error("api/contact error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
