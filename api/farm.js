export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { farmId } = req.query;

  // Read apiKey from header (safer than query param — evita problemas de encoding)
  const apiKey = req.headers['x-api-key'];

  if (!farmId) return res.status(400).json({ error: 'farmId requerido' });

  console.log('farmId:', farmId);
  console.log('apiKey:', apiKey ? `${apiKey.slice(0, 15)}...` : 'NINGUNA');

  if (!apiKey) {
    return res.status(401).json({ error: 'Header x-api-key no recibido' });
  }

  try {
    const r = await fetch(
      `https://api.sunflower-land.com/community/farms/${farmId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0',
        }
      }
    );

    const body = await r.text();
    console.log('SFL status:', r.status, '— body:', body.slice(0, 200));

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-store');
    return res.status(r.status).send(body);

  } catch (e) {
    console.error('Error fetch SFL:', e.message);
    return res.status(500).json({ error: e.message });
  }
}
