import { connectToMongoDB } from "@/app/api/lib/mongodb";
import User from "@/app/api/models/User";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { username, email, password } = await req.json(); // Get data from request

    // Validate input
    if (!username || !email || !password) {
      return NextResponse.json({ error: "All fields are required!" }, { status: 400 });
    }

    await connectToMongoDB(); // Connect to DB

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json({ error: "Username already in use!" }, { status: 400 });
    }
    const existingUserEmail = await User.findOne({ email });
    if (existingUserEmail) {
      return NextResponse.json({ error: "Email already in use!" }, { status: 400 });
    }

    // Create new user
    const newUser = new User({ username, email, password });
    await newUser.save();

    return NextResponse.json({ message: "User registered successfully!", user: newUser }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong!" }, { status: 500 });
  }
}
