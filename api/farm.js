export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { farmId } = req.query;
  if (!farmId) return res.status(400).json({ error: 'farmId requerido' });

  const endpoints = [
    `https://www.sfl.world/api/farm/${farmId}`,
    `https://api.sfl.world/farm/${farmId}`,
    `https://sfl.world/api/farm/${farmId}`,
    `https://www.sfl.world/api/farms/${farmId}`,
    `https://www.sfl.world/farm/${farmId}`,
  ];

  const debug = [];

  for (const url of endpoints) {
    try {
      const r = await fetch(url, {
        headers: { 
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0',
        },
        redirect: 'follow',
      });
      const body = await r.text();
      const preview = body.slice(0, 200);
      debug.push({ url, status: r.status, preview });
      console.log(`[${r.status}] ${url} → ${preview}`);

      // Si es JSON válido y tiene datos de farm
      if (r.ok) {
        try {
          const json = JSON.parse(body);
          // Verificar que tiene estructura de farm
          if (json && (json.inventory || json.balance || json.bumpkin || json.farm)) {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Cache-Control', 'public, s-maxage=60');
            return res.status(200).json(json);
          }
        } catch(e) {
          debug[debug.length-1].parseError = e.message;
        }
      }
    } catch(e) {
      debug.push({ url, error: e.message });
      console.log(`[ERR] ${url} → ${e.message}`);
    }
  }

  // Devolver debug para diagnosticar
  return res.status(502).json({ 
    error: 'Ningún endpoint devolvió datos válidos de farm',
    debug 
  });
}
