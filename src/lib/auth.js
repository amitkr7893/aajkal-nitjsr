// lib/auth file
import { connectToDatabase } from "./mongodb";
import bcrypt from "bcrypt";

export async function findUserById(studentId) {
  const db = await connectToDatabase();
  return await db.collection("users").findOne({ studentId });
}

export async function createUser({ studentId, name, pass, email }) {

  const hashedPassword = await bcrypt.hash(pass, 10);

  const db = await connectToDatabase();
  return await db.collection("users").insertOne({ studentId, name, pass : hashedPassword, email });
}

export async function loginUser(studentId, password) {
  const db = await connectToDatabase();
  const user = await db.collection("users").findOne({ studentId });

  if (!user || !user.pass) return null; // User not found or password missing

  const isMatch = await bcrypt.compare(password, user.pass);
  if (!isMatch) return null; // Password incorrect

  return user; // ✅ Return the user if login successful
}

export async function updatePassword(studentId, newPassword) {
  const db = await connectToDatabase();
  const hashed = await bcrypt.hash(newPassword, 10);
  
  await db.collection('users').updateOne(
    { studentId },
    { $set: { pass: hashed } }
  );
}