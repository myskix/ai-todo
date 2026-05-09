import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const { description } = await req.json();

    if (!description || typeof description !== "string") {
      return NextResponse.json({ error: "description is required" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "GEMINI_API_KEY is not configured" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const now = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
    const systemPrompt = `You are a productivity assistant. Extract actionable tasks from the user's free-form description.
Return ONLY valid JSON, no markdown, no backticks, no explanations.
The JSON must be an object with a "tasks" array containing objects with these exact fields:
- title (string, max 80 chars, clear and actionable, IN INDONESIAN)
- description (string, optional details from the text, IN INDONESIAN)
- suggestedCategory ("work" | "personal" | "health" | "learning" | "other")
- suggestedPriority ("high" | "medium" | "low")
- suggestedDeadline (ISO 8601 string, provide a logical deadline date and time based on the task description and current time, IN INDONESIAN timezone. If no time/date mentioned, suggest a reasonable one.)`;

    const result = await model.generateContent(`Current time in Jakarta: ${now}\n\nSystem: ${systemPrompt}\n\nUser description: ${description}`);
    const text = result.response.text().trim();
    
    // Clean up potential markdown code block formatting
    const jsonStr = text.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();

    let parsedResult;
    try {
      parsedResult = JSON.parse(jsonStr);
    } catch {
      console.error("Failed to parse Gemini output:", text);
      throw new Error("Failed to parse generated tasks as JSON");
    }

    return NextResponse.json({ tasks: parsedResult.tasks || [] });
  } catch (error) {
    console.error("AI Generation Error:", error);
    const message = error instanceof Error ? error.message : "Failed to generate tasks";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
