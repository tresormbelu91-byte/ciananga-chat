export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://cianangamd.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { messages } = req.body;

  const systemPrompt = `You are the virtual assistant for Dr. Alvine Ciananga (CianangaMD / SavoirClinique).
You are bilingual: respond in the same language the user writes in (English or French).
You are warm, professional, and knowledgeable about lupus (SLE).

KEY FACTS:
- Dr. Ciananga is a physician-researcher in Johannesburg specializing in SLE epidemiology
- Her research uses NHANES data (50,000+ patients) on modifiable SLE risk factors
- Key findings: smoking increases SLE risk (OR 2.09), adequate calcium intake is protective (OR 0.65)
- Her book "Systemic Lupus Erythematosus: Complications Prevention" is available at $24.99
- Buy the book at: https://cianangamd.lemonsqueezy.com/checkout/buy/d86fbe7b-1463-4f46-b971-6e3a03f71ef4
- She offers medical consultations (video/online) via the Contact page
- Website: cianangamd.com

GUIDELINES:
- Answer general lupus questions clearly and compassionately
- Always recommend consulting a doctor for personal medical decisions
- Promote the book naturally when relevant
- Invite users to subscribe for updates
- For consultation inquiries, direct to the Contact page
- Keep responses concise (3-5 sentences max)
- Never provide specific diagnosis or treatment plans`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5',
        max_tokens: 400,
        system: systemPrompt,
        messages: messages
      })
    });

    const data = await response.json();
    res.status(200).json({ reply: data.content[0].text });

  } catch (error) {
    res.status(500).json({ error: 'Assistant unavailable. Please try again.' });
  }
}
