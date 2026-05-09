import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const { title, description, deadline } = await req.json();

    if (!title || typeof title !== "string") {
      return NextResponse.json({ error: "title is required" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "GEMINI_API_KEY is not configured" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const systemPrompt = `You are a productivity expert. Analyze the task and determine its urgency/priority.
Return ONLY valid JSON, no markdown, no backticks, no explanations.
The JSON must be an object with these exact fields:
- priority ("high" | "medium" | "low")
- reason (string, max 15 words explaining why, IN INDONESIAN)`;

    const promptContext = `Task: ${title}\nDescription: ${description || "none"}\nDeadline: ${deadline || "none"}`;

    const result = await model.generateContent(`${systemPrompt}\n\n${promptContext}`);
    const text = result.response.text().trim();
    
    // Clean up potential markdown code block formatting
    const jsonStr = text.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();

    let parsedResult;
    try {
      parsedResult = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("Failed to parse Gemini priority output:", text);
      throw new Error("Failed to parse generated priority as JSON");
    }

    return NextResponse.json({
      priority: parsedResult.priority || "medium",
      reason: parsedResult.reason || "Determined based on task details.",
    });
  } catch (error) {
    console.error("AI Priority Error:", error);
    const message = error instanceof Error ? error.message : "Failed to analyze priority";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
