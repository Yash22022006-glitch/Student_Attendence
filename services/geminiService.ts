
import { GoogleGenAI } from "@google/genai";
import { Student } from '../types';

// IMPORTANT: Do not expose this key publicly in a real application.
// This should be handled via environment variables on a secure backend.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. Analytic features will be disabled. Please set process.env.API_KEY.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const generateContent = async (prompt: string): Promise<string> => {
    if (!API_KEY) {
        return "Gemini API key is not configured. Please contact your administrator.";
    }
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return "An error occurred while generating the analysis. Please check the console for details.";
    }
};

export const getAttendanceAnalysis = async (students: Student[]): Promise<string> => {
  const prompt = `
    Analyze the following attendance data for a class and provide a concise summary.
    - Identify the overall attendance rate.
    - List any students with more than 3 absences in the last 30 days.
    - Highlight any emerging patterns (e.g., frequent Monday absences).
    - Conclude with a brief, actionable insight for the teacher.

    Data:
    ${students.map(s => `
      Student: ${s.name}
      Attendance: ${s.attendance.map(a => `${a.date}: ${a.status}`).join(', ')}
    `).join('\n')}
  `;
  return generateContent(prompt);
};

export const generateParentSummary = async (student: Student): Promise<string> => {
  const prompt = `
    Generate a friendly and concise attendance summary for the parents of ${student.name}.
    - Calculate the overall attendance percentage for the last 30 days.
    - Mention any recent absences or late arrivals in a gentle tone.
    - End with a positive and encouraging note.

    Data for ${student.name}:
    ${student.attendance.map(a => `${a.date}: ${a.status}`).join('\n')}
  `;
  return generateContent(prompt);
};
