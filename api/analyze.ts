import { GoogleGenAI, Type } from "@google/genai";

export const config = {
  runtime: 'edge',
};

// Define the Schema Enum values manually
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

    // Optimization: The prompt is shorter and more direct to ensure speed
    const systemInstruction = `
      Analyze this GitHub user's 2025 activity.
      1. Identify skills (Languages, Frameworks, Tools) used in 2025.
      2. Assign usageScore (0-100).
      3. Create a fun "Archetype" name.
      4. Write a brief 2-sentence summary.
      5. Calculate top language % by usage.
      
      Return ONLY JSON matching the schema.
    `;

    // Limit the payload context window to prevent processing timeouts
    // We expect the client to have already sliced, but we double-check here
    // A smaller prompt yields a faster response.
    const limitedSummary = Array.isArray(repoSummary) ? repoSummary.slice(0, 30) : [];
    
    const userPrompt = `User: ${username}. Repos: ${JSON.stringify(limitedSummary)}`;

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
    
    if (data.skills) {
        data.skills.sort((a: any, b: any) => b.usageScore - a.usageScore);
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error("Server Analysis Error:", error);
    // Return a 500 but as JSON so the client can read it
    return new Response(JSON.stringify({ error: error.message || "Internal Server Error" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}