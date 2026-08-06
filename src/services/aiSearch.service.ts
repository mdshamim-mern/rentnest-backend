import { GoogleGenerativeAI } from "@google/generative-ai";

export const parseSearchText = async (text: string) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      Extract the following details from the text: location, propertyType, beds, and maxPrice.
      If the location has a typo, correct it to the nearest valid Dhaka location (e.g., Banani, Gulshan, Dhanmondi, Bashundhara, Mirpur, Mohammadpur, Uttara, Shyamoli, Badda, Khilgaon).
      Return the output strictly as a JSON object with keys: "location", "propertyType", "beds", "maxPrice".
      Do not include any markdown tags.
      Text: "${text}"
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();

    return JSON.parse(responseText);
  } catch (error) {
    return {};
  }
};

export const AISearchService = {
  parseSearchText
};