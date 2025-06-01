// “Here is src/app/api/verify-otp/route.js ⬇️”
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(req) {
  try {
    const { studentId, otp } = await req.json();
    const email = `${studentId.toLowerCase()}@nitjsr.ac.in`;

    const db = await connectToDatabase();

    const record = await db.collection('otp').findOne({ email: email });

    if (!record) {
      return new Response(JSON.stringify({ success: false, error: 'OTP not found or expired' }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (record.otp !== otp) {
      return new Response(JSON.stringify({ success: false, error: 'Invalid OTP' }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Delete the OTP after successful verification
    // await db.collection('otp').deleteOne({ email: email });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    return new Response(JSON.stringify({ success: false, error: 'Server error' }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
