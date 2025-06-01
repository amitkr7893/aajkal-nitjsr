// “Here is src/app/api/send-otp/route.js ⬇️”
import { sendOTPEmail } from '@/lib/mailer';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(req) {
  try {
    const { studentId } = await req.json();
    const { searchParams } = new URL(req.url);
    const purpose = searchParams.get('purpose');
    const email = `${studentId.toLowerCase()}@nitjsr.ac.in`;

    const db = await connectToDatabase();

    // Check user existence ONLY IF purpose is "reset"
    if (purpose === 'reset') {
      const existingUser = await db.collection('users').findOne({ studentId });
      if (!existingUser) {
        return new Response(JSON.stringify({ error: 'User not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete any previous OTPs for this email
    await db.collection('otp').deleteMany({ email: email });

    // Insert new OTP with expiration time (5 mins)
    await db.collection('otp').insertOne({
      email: email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes TTL
    });

    // Send OTP
    await sendOTPEmail(email, otp);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('OTP send error:', error);
    return new Response(JSON.stringify({ error: 'Failed to send OTP' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
