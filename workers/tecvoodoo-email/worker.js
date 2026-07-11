export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Only allow POST
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    try {
      const body = await request.json();

      // --- Cloudflare Turnstile verification -------------------------------
      // Closes the open relay: every request must carry a valid Turnstile token
      // minted by a real browser on an allowed domain. A direct POST (curl or a
      // script) cannot produce one, so it can no longer relay email via Resend.
      const turnstileToken = body.turnstileToken;
      if (!turnstileToken) {
        return new Response(JSON.stringify({ error: 'Missing Turnstile token' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }
      const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          secret: env.TURNSTILE_SECRET_KEY,
          response: turnstileToken,
          remoteip: request.headers.get('CF-Connecting-IP') || '',
        }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyData.success) {
        return new Response(
          JSON.stringify({ error: 'Turnstile verification failed', codes: verifyData['error-codes'] || [] }),
          { status: 403, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }
      // ---------------------------------------------------------------------

      // Route based on email type
      if (body.type === 'beta-reader') {
        return handleBetaReaderSignup(body, env, corsHeaders);
      } else {
        return handleGameInvite(body, env, corsHeaders);
      }
    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
  },
};

async function handleBetaReaderSignup(body, env, corsHeaders) {
  const { email, name, bookTitle } = body;

  // Validate required fields
  if (!email || !bookTitle) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  const displayName = name ? name : 'Not provided';

  // Send notification email to Stephen
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'TecVooDoo Games <noreply@tecvoodoo.com>',
      to: ['stephenmbrandon@tecvoodoo.com'],
      subject: `New Beta Reader Signup: ${bookTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #00f0c0;">New Beta Reader Signup!</h2>
          <p>Someone has signed up to beta read:</p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;"><strong>Book:</strong> ${bookTitle}</p>
            <p style="margin: 0 0 10px 0;"><strong>Name:</strong> ${displayName}</p>
            <p style="margin: 0;"><strong>Email:</strong> ${email}</p>
          </div>
          <p style="color: #666; font-size: 14px;">
            Create a folder in Google Drive for this reader and share the manuscript with them.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px;">TecVooDoo Beta Reader System</p>
        </div>
      `,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error('Resend error:', data);
    return new Response(JSON.stringify({ error: data.message || 'Email send failed' }), {
      status: res.status,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  return new Response(JSON.stringify({ success: true, id: data.id }), {
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
}

async function handleGameInvite(body, env, corsHeaders) {
  const { to, playerName, gameCode, gameLink, gameName } = body;

  // Validate required fields
  if (!to || !gameCode || !gameLink) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  // Default to Dots and Boxes if no game name provided
  const game = gameName || 'Dots and Boxes';
  const sender = playerName || 'Someone';

  // Send email via Resend
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'TecVooDoo Games <noreply@tecvoodoo.com>',
      to: [to],
      subject: `${sender} invited you to play ${game}!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">You've been invited to play!</h2>
          <p>${sender} wants to challenge you to a game of ${game} on TecVooDoo Games.</p>
          <p><strong>Game Code:</strong> ${gameCode}</p>
          <p style="margin: 30px 0;">
            <a href="${gameLink}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Join Game
            </a>
          </p>
          <p style="color: #666; font-size: 14px;">Or copy this link: ${gameLink}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px;">TecVooDoo Games - tecvoodoo.com</p>
        </div>
      `,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error('Resend error:', data);
    return new Response(JSON.stringify({ error: data.message || 'Email send failed' }), {
      status: res.status,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  return new Response(JSON.stringify({ success: true, id: data.id }), {
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
}
