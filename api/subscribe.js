export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    return res.status(500).json({ error: 'Webhook URL not configured' });
  }

  const payload = {
    username: "iMono Waitlist Bot",
    embeds: [{
      title: "✨ New iMono Waitlist Entry",
      color: 0,
      fields: [
        { name: "User Email", value: `\`${email}\``, inline: false },
        { name: "Source", value: "iMono Public Site", inline: true },
        { name: "Timestamp", value: new Date().toLocaleString(), inline: true }
      ],
      footer: { text: "Planned since 2020 • SECURE API MODE" }
    }]
  };

  try {
    const discordResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (discordResponse.ok) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(500).json({ error: 'Discord rejected the request' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
