module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  const { farmId, apiKey } = req.query;
  if (!farmId) return res.status(400).json({ error: "farmId requerido" });

  const headers = {
    "User-Agent": "Mozilla/5.0",
    Accept: "application/json",
  };

  // Si tiene API key, la mandamos como Bearer token
  if (apiKey) {
    headers["Authorization"] = `Bearer ${apiKey}`;
  }

  try {
    const upstream = await fetch(
      `https://api.sunflower-land.com/community/farms/${farmId}`,
      { headers }
    );

    const body = await upstream.text();
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "public, s-maxage=60");
    return res.status(upstream.status).send(body);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
