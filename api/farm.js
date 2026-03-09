export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { farmId } = req.query;
  if (!farmId) return res.status(400).json({ error: 'farmId requerido' });

  // Probar los endpoints conocidos de sfl.world en orden
  const endpoints = [
    `https://www.sfl.world/api/farm/${farmId}`,
    `https://api.sfl.world/farm/${farmId}`,
    `https://sfl.world/api/farm/${farmId}`,
    `https://www.sfl.world/api/farms/${farmId}`,
  ];

  for (const url of endpoints) {
    try {
      const r = await fetch(url, {
        headers: { 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0' }
      });
      const body = await r.text();
      console.log(`[${url}] status: ${r.status} — body: ${body.slice(0, 150)}`);
      if (r.ok) {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'public, s-maxage=60');
        return res.status(200).send(body);
      }
    } catch(e) {
      console.log(`[${url}] error: ${e.message}`);
    }
  }

  return res.status(502).json({ error: 'Ningún endpoint de sfl.world respondió', endpoints });
}
