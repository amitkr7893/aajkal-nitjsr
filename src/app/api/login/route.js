// api/login/route
import { findUserById } from "@/lib/auth";
import { NextResponse } from "next/server";

import bcrypt from "bcrypt";

export async function POST(request) {
  let { studentId, password } = await request.json();

  studentId = studentId.trim().toLowerCase();
  password = password.trim();

  const user = await findUserById(studentId);

  if (!user) {
    return NextResponse.json({ error: "user is not found" }, { status: 401 });
  }

  // for password matching check
  const isMatch = await bcrypt.compare(password, user.pass);
  if (!isMatch) {
    return NextResponse.json({ error: "password is not correct" }, { status: 402 });
  }

  const res = NextResponse.json({ message: "Login successful" });
  res.cookies.set("studentId", studentId,
    { 
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      httpOnly: false }
    );

    res.cookies.set("name", user.name, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: false
    });

  return res;
}

