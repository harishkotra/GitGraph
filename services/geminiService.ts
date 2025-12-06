import { GoogleGenAI, Type } from "@google/genai";
import { DeveloperProfile, GitHubRepo, SkillCategory } from '../types';

const getAiClient = () => {
    if (!process.env.API_KEY) {
        throw new Error("API Key not found in environment variables");
    }
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const analyzeProfileWithGemini = async (
  username: string,
  repos: GitHubRepo[]
): Promise<DeveloperProfile> => {
  const ai = getAiClient();

  // FILTER: Only keep repos updated in 2025
  const repos2025 = repos.filter(r => r.updated_at.startsWith('2025'));

  if (repos2025.length === 0) {
      throw new Error("No activity found in 2025. This analysis only tracks work done this year.");
  }

  // Limit to top 50 recently updated repos to keep payload manageable and relevant
  // Truncate descriptions to save tokens
  const slicedRepos = repos2025.slice(0, 50);
  const repoSummary = slicedRepos.map(r => ({
    n: r.name,
    d: r.description ? r.description.substring(0, 200) : null,
    l: r.language,
    t: r.topics ? r.topics.slice(0, 5) : [], // Limit topics
    u: r.updated_at
  }));

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