import axios from 'axios';

const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export async function askGemini(prompt) {
  if (!API_KEY) {
    console.error("Gemini API Key is missing. Set NEXT_PUBLIC_GEMINI_API_KEY.");
    return "API key not configured.";
  }

  try {
    const response = await axios.post(
      `${API_URL}?key=${API_KEY}`,
      {
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const text = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return text || "No content generated.";
  } catch (error) {
    console.error("Error calling Gemini API:", error?.response?.data || error.message);
    return "Failed to generate content.";
  }
}
