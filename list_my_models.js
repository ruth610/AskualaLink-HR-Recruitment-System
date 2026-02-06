import dotenv from "dotenv";
dotenv.config();

async function check() {
  const key = process.env.GEMINI_API_KEY;
  // Use the stable v1 endpoint to see if that works better
  const url = `https://generativelanguage.googleapis.com/v1/models?key=${key}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.models) {
      console.log("✅ YOUR KEY CAN SEE THESE MODELS:");
      data.models.forEach(m => console.log(`- ${m.name}`));
    } else {
      console.log("❌ No models found. Response:", data);
    }
  } catch (e) {
    console.error("Network error:", e.message);
  }
}
check();