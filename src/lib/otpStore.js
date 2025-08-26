import { connectToDatabase } from "@/lib/mongodb";

export async function setOtp(email, otp) {
  const db = await connectToDatabase();
  
  email = email.toLowerCase().trim();
  otp = otp.trim();
  
  const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes TTL
  
  await db.collection("otp").updateOne(
    { email },
    {
      $set: {
        email,
        otp,
        expiresAt,
      },
    },
    { upsert: true }
  );
}

export async function verifyOtp(email, enteredOtp) {
  const db = await connectToDatabase();
  
  email = email.toLowerCase().trim();
  enteredOtp = enteredOtp.trim();

  // console.log("Verifying OTP for:", email);
  // console.log("Stored OTP record:", record);
  // console.log("Entered OTP:", enteredOtp);
  
  const record = await db.collection("otp").findOne({ email });
  
  if (!record) return false;
  
  return (record.otp === enteredOtp && new Date(record.expiresAt) > new Date());
}
