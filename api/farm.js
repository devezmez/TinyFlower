module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  if (req.method === "OPTIONS") return res.status(200).end();

  const { farmId } = req.query;
  if (!farmId) return res.status(400).json({ error: "farmId requerido" });

  const upstream = await fetch(
    `https://api.sunflower-land.com/community/farms/${farmId}`,
    { headers: { "User-Agent": "Mozilla/5.0", Accept: "application/json" } }
  );

  const body = await upstream.text();
  res.setHeader("Cache-Control", "public, s-maxage=60");
  return res.status(upstream.status).send(body);
};
