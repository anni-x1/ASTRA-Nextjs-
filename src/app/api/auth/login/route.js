import { connectToMongoDB } from "@/app/api/lib/mongodb";
import User from "@/app/api/models/User";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { username, password } = await req.json(); // Get data from request
    // Validate input
    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required!" }, { status: 400 });
    }

    await connectToMongoDB(); // Connect to DB

    // Find user by email
    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json({ error: "User not found!" }, { status: 404 });
    }

    // Check password (without encryption)
    if (user.password !== password) {
      return NextResponse.json({ error: "Invalid password!" }, { status: 401 });
    }

    return NextResponse.json({ message: "Login successful!", user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong!" }, { status: 500 });
  }
}
