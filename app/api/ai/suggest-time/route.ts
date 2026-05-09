import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const { title, priority, deadline } = await req.json();

    if (!title || typeof title !== "string") {
      return NextResponse.json({ error: "title is required" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "GEMINI_API_KEY is not configured" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const systemPrompt = `You are a productivity expert. Suggest the best time of day to work on this task based on its context.
Return ONLY valid JSON, no markdown, no backticks, no explanations.
The JSON must be an object with one field:
- suggestion (string, short human-readable string, max 15 words, e.g., "Sebaiknya dikerjakan pagi hari" or "Lakukan setelah makan siang", IN INDONESIAN)`;

    const promptContext = `Task: ${title}\nPriority: ${priority || "medium"}\nDeadline: ${deadline || "none"}`;

    const result = await model.generateContent(`${systemPrompt}\n\n${promptContext}`);
    const text = result.response.text().trim();
    
    // Clean up potential markdown code block formatting
    const jsonStr = text.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();

    let parsedResult;
    try {
      parsedResult = JSON.parse(jsonStr);
    } catch {
      console.error("Failed to parse Gemini time output:", text);
      throw new Error("Failed to parse generated suggestion as JSON");
    }

    return NextResponse.json({
      suggestion: parsedResult.suggestion || "Work on this when you have focus time.",
    });
  } catch (error) {
    console.error("AI Suggest Time Error:", error);
    const message = error instanceof Error ? error.message : "Failed to suggest time";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
