import { GoogleGenAI, Type } from "@google/genai";
import { DeveloperProfile, GitHubRepo, SkillCategory } from '../types';

export const analyzeProfileWithGemini = async (
  username: string,
  repos: GitHubRepo[]
): Promise<DeveloperProfile> => {
  
  // FILTER: Only keep repos updated in 2025
  const repos2025 = repos.filter(r => r.updated_at.startsWith('2025'));

  if (repos2025.length === 0) {
      throw new Error("No activity found in 2025. This analysis only tracks work done this year.");
  }

  // OPTIMIZATION: Reduce from 50 to 30 to prevent Vercel 504 Timeouts
  // A smaller prompt processes faster.
  const slicedRepos = repos2025.slice(0, 30);
  
  const repoSummary = slicedRepos.map(r => ({
    n: r.name,
    d: r.description ? r.description.substring(0, 150) : null, // Truncate description further
    l: r.language,
    t: r.topics ? r.topics.slice(0, 3) : [], // Limit topics further
    u: r.updated_at
  }));

  // HYBRID MODE: 
  // If API_KEY is present (Local Dev), use Client-side SDK. 
  // If missing (Vercel Production), use Serverless API route to protect key.
  
  if (!process.env.API_KEY) {
      // Server-side path (Vercel)
      try {
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                repoSummary
            })
        });

        if (!response.ok) {
            let errorMsg = `Server Error: ${response.status}`;
            try {
                const errData = await response.json();
                if (errData.error) errorMsg = errData.error;
            } catch { 
                // If JSON parse fails, it might be a 504 HTML page
                if (response.status === 504) {
                    errorMsg = "Analysis timed out. Try fewer repositories or try again later.";
                }
            }
            throw new Error(errorMsg);
        }

        return await response.json();
      } catch (err: any) {
          console.error("API Route Error:", err);
          throw new Error(err.message || "Failed to contact analysis server");
      }
  }

  // Client-side path (Local Dev with .env)
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    Analyze this GitHub user's 2025 activity.
    1. Identify skills (Languages, Frameworks, Tools) used in 2025.
    2. Assign usageScore (0-100).
    3. Create a fun "Archetype" name.
    4. Write a brief 2-sentence summary.
    5. Calculate top language % by usage.
    
    Return ONLY JSON matching the schema.
  `;

  const userPrompt = `Generate a 2025 Developer Recap for user "${username}" based on these repositories:\n\n${JSON.stringify(repoSummary)}`;

  try {
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
        throw new Error("Gemini returned an empty response.");
    }

    const data = JSON.parse(responseText) as DeveloperProfile;
    
    // Fallback sort if model didn't sort perfectly
    data.skills.sort((a, b) => b.usageScore - a.usageScore);
    
    return data;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    if (error instanceof Error) {
        throw new Error(`AI Analysis failed: ${error.message}`);
    }
    throw new Error("Failed to analyze profile with AI.");
  }
};