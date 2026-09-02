export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    // Only allow POST requests
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      const { email } = await request.json();

      // Validate email
      if (!email || typeof email !== 'string') {
        return new Response(
          JSON.stringify({ error: 'Email is required' }),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          }
        );
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return new Response(
          JSON.stringify({ error: 'Invalid email format' }),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          }
        );
      }

      // Call Resend API
      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'Bangpho Coffee <signup@bangpho-coffee.pages.dev>',
          to: ['hello@bangpho-coffee.pages.dev'],
          subject: 'New Waitlist Signup',
          text: `New signup: ${email}`,
        }),
      });

      if (resendResponse.ok) {
        return new Response(
          JSON.stringify({ success: true, message: 'Thanks! You\'re on the list.' }),
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          }
        );
      } else {
        // Even if Resend fails, show success to user (demo mode)
        return new Response(
          JSON.stringify({ success: true, message: 'Thanks! You\'re on the list.' }),
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          }
        );
      }
    } catch (error) {
      // Even if network fails, show success to user (demo mode)
      return new Response(
        JSON.stringify({ success: true, message: 'Thanks! You\'re on the list.' }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }
  },
};

interface Env {
  RESEND_API_KEY: string;
}
