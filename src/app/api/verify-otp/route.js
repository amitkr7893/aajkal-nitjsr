import { verifyOtp } from "@/lib/otpStore";

export async function POST(req) {
  try {
    const { studentId, otp } = await req.json();
    const email = `${studentId.toLowerCase().trim()}@nitjsr.ac.in`;

    //Verify OTP
    const isOtpValid = await verifyOtp(email, otp);
    if (!isOtpValid) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 401 });
    }

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
