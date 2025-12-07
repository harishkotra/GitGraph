import { GoogleGenAI, Type } from "@google/genai";

export const config = {
  runtime: 'edge',
};

// Define the Schema Enum values manually to ensure standalone execution
const SkillCategory = {
  LANGUAGE: 'Language',
  FRAMEWORK: 'Framework',
  TOOL: 'Tool',
  DATABASE: 'Database',
  PLATFORM: 'Platform',
};

export default async function handler(request: Request) {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "API Key not configured on server. Please add API_KEY to Vercel Environment Variables." }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 });
    }

    const { username, repoSummary } = await request.json();

    if (!repoSummary || !username) {
      return new Response(JSON.stringify({ error: "Missing required data" }), { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `
      You are an expert developer profiler creating a "2025 Year in Code" recap. 
      Your task is to analyze a user's GitHub repository list specifically for their work in 2025.
      
      1. Infer skills (Languages, Frameworks, Tools, Databases, Platforms) strictly from the provided 2025 data.
      2. Calculate a "usageScore" (0-100) for each skill based on frequency in 2025.
      3. Determine the "2025 Vibe/Archetype" (e.g., "Shipping Velocity Specialist", "AI Tinkerer 2025", "frontend-2025-final-final").
      4. Write a 2-sentence summary of their 2025 coding journey.
      5. Calculate top language percentages for 2025.
      
      Strictly adhere to the JSON response schema.
    `;

    const userPrompt = `Generate a 2025 Developer Recap for user "${username}" based on these repositories:\n\n${JSON.stringify(repoSummary)}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            archetype: { type: Type.STRING },
            skills: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  category: { 
                    type: Type.STRING, 
                    enum: [
                        SkillCategory.LANGUAGE, 
                        SkillCategory.FRAMEWORK, 
                        SkillCategory.TOOL, 
                        SkillCategory.DATABASE, 
                        SkillCategory.PLATFORM
                    ] 
                  },
                  usageScore: { type: Type.NUMBER },
                },
                required: ["name", "category", "usageScore"]
              }
            },
            topLanguages: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  percentage: { type: Type.NUMBER }
                },
                required: ["name", "percentage"]
              }
            }
          },
          required: ["summary", "archetype", "skills", "topLanguages"]
        }
      }
    });

    const responseText = response.text;
    if (!responseText) {
       throw new Error("Gemini returned an empty response");
    }

    // Parse and return the JSON
    const data = JSON.parse(responseText);
    
    // Sort logic to ensure high quality output
    if (data.skills) {
        data.skills.sort((a: any, b: any) => b.usageScore - a.usageScore);
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error("Server Analysis Error:", error);
    return new Response(JSON.stringify({ error: error.message || "Internal Server Error" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}