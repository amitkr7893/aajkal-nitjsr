// Here is lib/otpStore.js
import { connectToDatabase } from "@/lib/mongodb";

export async function setOtp(email, otp) {
  const db = await connectToDatabase(); 
  
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes TTL
  
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

  email = email.toLowerCase(); 
  
  const record = await db.collection("otp").findOne({ email });
  
    console.log("Verifying OTP for:", email);
    console.log("Stored OTP record:", record);
    console.log("Entered OTP:", enteredOtp);
  
    if (!record) return false;
  
    const isValid =
      record.otp === enteredOtp && new Date(record.expiresAt) > new Date();
  
    // if (isValid) {
    //   await db.collection("otp").deleteOne({ email }); // Ensure one-time usage
    // }
  
    return isValid;
  }