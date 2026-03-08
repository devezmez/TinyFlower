export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { farmId } = req.query;

  if (!farmId) {
    return res.status(400).json({ error: "farmId requerido" });
  }

  try {
    const sflRes = await fetch(
      `https://api.sunflower-land.com/community/farms/${farmId}`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0",
          Accept: "application/json",
        },
      }
    );

    if (!sflRes.ok) {
      return res
        .status(sflRes.status)
        .json({ error: `SFL API respondió ${sflRes.status}` });
    }

    const data = await sflRes.json();

    res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=30");
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
