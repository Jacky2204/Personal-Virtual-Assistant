import axios from "axios";

const geminiResponse = async (command, assistantName, userName) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set in environment variables");
    }

    // Correct API endpoint (your curl version)
    const api = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`;

    const prompt = `
You are a virtual assistant named ${assistantName} created by ${userName}.
You are not Google. You will now behave like a voice-enabled assistant.

Your task is to understand the user's natural language input and respond with a JSON object like this:

{
    "type": "general" | "google-search" | "youtube-search" | "youtube-play" | "play-song" |
             "get-time" | "get-date" | "get-day" | "get-month" |
             "calculator-open" |
             "open-google" | "open-youtube" | "instagram-open" | "facebook-open" | "open-twitter" |
             "open-linkedin" | "open-naukri" | "open-unstop" |
             "open-whatsapp" | "open-whatsapp-chat" | "open-telegram" |
             "open-github" | "open-reddit" | "open-stackoverflow" |
             "open-amazon" | "open-flipkart" | "open-snapdeal" |
             "open-netflix" | "open-spotify" |
             "open-wikipedia" | "open-quora" | "open-medium" |
             "open-swiggy" | "open-zomato" |
             "weather-show",

    "userInput": "<original user input without assistant name; if search request, include only search text>",
    "response": "<short voice-friendly message>"
}

Instructions:
- "type": determine user's intent.
- "userInput": original spoken sentence (remove assistant name if mentioned).
- If the user asks to search on Google or YouTube, "userInput" must contain ONLY the actual search text.
- "response": a short spoken-friendly reply like "Sure, here you go", "Opening YouTube", "Playing the song", etc.

Type meanings:
- "general": for general or factual questions. aur agar koi aisa question puchata hai jiska answer tumhe pta hai usko bhi general ki category me rakho bas short answer dena.
- "google-search": if user wants to search something on Google.
- "youtube-search": if user wants to search something on YouTube.
- "youtube-play": if user wants to directly play a video.
- "play-song": if user wants to play a song.
- "weather-show": if user asks about weather.

Time and Date:
- "get-time": user wants current time.
- "get-date": user wants today’s date.
- "get-day": user wants the day.
- "get-month": user wants the month.

Apps & Websites:
- "calculator-open": open Calculator.
- "instagram-open": open Instagram.
- "facebook-open": open Facebook.
- "open-google": open Google home.
- "open-youtube": open YouTube home.
- "open-twitter": open Twitter.
- "open-linkedin": open LinkedIn.
- "open-naukri": open Naukri job portal.
- "open-unstop": open Unstop.
- "open-whatsapp": open WhatsApp Web.
- "open-whatsapp-chat": open WhatsApp chat with number.
- "open-telegram": open Telegram Web.
- "open-github": open GitHub.
- "open-reddit": open Reddit.
- "open-stackoverflow": open StackOverflow.
- "open-amazon": open Amazon.
- "open-flipkart": open Flipkart.
- "open-snapdeal": open Snapdeal.
- "open-netflix": open Netflix.
- "open-spotify": open Spotify.
- "open-wikipedia": open Wikipedia.
- "open-quora": open Quora.
- "open-medium": open Medium.
- "open-swiggy": open Swiggy.
- "open-zomato": open Zomato.

Important:
- Use "{author name}" if anyone asks "who created you".
- Only respond with the JSON object: NO extra text.

now your userInput - ${command}
`;

    // console.log("Sending request to Gemini API with prompt:", prompt);

    const result = await axios.post(
      api,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey, // IMPORTANT: use header instead of ?key=
        },
      }
    );

    console.log(
      "Gemini API response:",
      JSON.stringify(
        result?.data?.candidates?.[0]?.content?.parts?.[0]?.text,
        null,
        2
      )
    );

    // Safely return text
    return result?.data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
  } catch (error) {
    console.log("Error in geminiResponse:", error.message);
    if (error.response) {
      console.log("Gemini API error response:", error.response.data);
    }
    throw error;
  }
};

export default geminiResponse;
