import { connectToMongoDB } from "@/app/api/lib/mongodb";
import User from "@/app/api/models/User";
import { NextResponse } from "next/server";

export async function POST(req) {
    const { username } = await req.json();
    await connectToMongoDB();
    try {
        await User.updateOne({ username }, { $set: { history: [] } });
        return NextResponse.json({ message: "Chat history reset successfully." });
    } catch (error) {
        console.error("Error resetting chat history:", error);
        return NextResponse.json({ error: "Failed to reset chat history." }, { status: 500 });
    }
}
