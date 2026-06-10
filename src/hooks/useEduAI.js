import { useState, useCallback } from "react";

const API_URL = "https://models.inference.ai.azure.com/chat/completions";
const MODEL = "gpt-4o";

const MASTER_PROMPT = `Role: Engaging educational storyteller. Your task is to explain the student's query in a crisp, highly interesting, and visually appealing article format. Reject non-academic queries by returning ONLY:
{"error":"I am an Educational AI Assistant designed exclusively for Class 5–12, JEE, and NEET learning. Please ask an academic question."}

CRITICAL INSTRUCTIONS:
1. SHORT & PUNCHY: Keep the explanation concise (around 250-300 words total). Cut out all fluff and filler words. Explain the concept deeply but in fewer words.
2. VISUAL LAYOUT (BOLDING): Frequently use bold text (**like this**) for key scientific terms, definitions, and laws so the text is instantly scannable and interesting to look at.
3. ARTICLE SUBHEADINGS: Divide the content into 3 short sections using catchy markdown subheadings (### Subheading).
4. NO BULLET POINTS: Do not use bullet points or numbered lists. Rely purely on short, punchy paragraphs.
5. JSON OUTPUT ONLY: Output ONLY a valid JSON object. Never include extra text or markdown formatting outside the JSON object.

JSON Schema:
{
  "context": {
    "class": "[Class eg. 10]",
    "subject": "[Subject]",
    "topic": "[Topic]"
  },
  "title": "A compelling and relevant title for the topic",
  "content": "Your highly detailed, multi-paragraph essay text goes here. Use \\n\\n for paragraph breaks.",
  "important_facts": ["Exactly 5 facts"],
  "real_world_applications": [{"category": "Daily Life|Technology|Science|Industry|Healthcare|Business", "description": "Application"}],
  "refs": {
    "align": "NCERT/CBSE standards",
    "url": "https://www.google.com/search?q=site:vedantu.com+OR+site:ncert.nic.in+{topic}+class+{class}"
  },
  "img_prompt": "Flat 2D vector textbook diagram of {topic}, line art style, white background, black labels, sharp outlines. Avoid: 3D, photo, fire, smoke, dark background, logos, watermarks.",
  "practice_questions": {
    "easy": ["3 questions"],
    "medium": ["2 questions"],
    "advanced": ["1 question"]
  },
  "youtube_queries": ["3 search strings"],
  "revision_notes": ["Max 5 items"],
  "revision_summary": "2-3 line summary"
}

Constraints: 'refs.url' MUST strictly embed the exact core topic and class, formatted with '+' for spaces. No empty fields. Strictly enforce array counts.
CRITICAL: Write a concise, in-depth article using 3 subheadings (###) and bold keywords (**text**), strictly with NO bullet points. For math/science, ensure a clear academic diagram or schematic is used instead of generic photos.`;

const cache = new Map();
const imageCache = new Map();

// Blacklist patterns for irrelevant Wikipedia images
const IMAGE_BLACKLIST = [
  "commons-logo", "edit-ltr", "wikiquote", "wiktionary", "wikisource",
  "wikibooks", "wikiversity", "wikinews", "wikidata", "wikivoyage",
  "folder_hexagonal", "symbol_", "question_book", "ambox", "padlock",
  "semi-protection", "crystal_clear", "nuvola", "portal-puzzle",
  "icon", "logo", "stub", "flag_of", "coat_of_arms"
];

export function useEduAI(apiKey) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusMsg, setStatusMsg] = useState("");
  const [pipeState, setPipeState] = useState({});
  
  const sp = useCallback((id, state) => setPipeState(prev => ({ ...prev, [id]: state })), []);

  async function callAPI(system, user, jsonMode = false, tokens = 4096) {
    if (!apiKey) throw new Error("API Key is required.");
    const useURL = 'https://models.inference.ai.azure.com/chat/completions';
    
    const bodyObj = {
      model: MODEL,
      max_tokens: tokens,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user }
      ],
    };
    if (jsonMode) bodyObj.response_format = { type: "json_object" };

    const r = await fetch(useURL, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json", 
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify(bodyObj),
    });
    
    if (!r.ok) {
      const e = await r.json().catch(() => ({}));
      throw new Error(e?.error?.message || `API error ${r.status}`);
    }
    const d = await r.json();
    return d.choices?.[0]?.message?.content || "";
  }

  async function generateContent(q) {
    const raw = await callAPI(MASTER_PROMPT, `Student question: "${q}"\n\nReturn ONLY the JSON object.`, true);
    let clean = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
    const s = clean.indexOf("{"), e = clean.lastIndexOf("}");
    if (s === -1 || e === -1) throw new Error("Invalid JSON format returned from AI.");
    try {
        const parsed = JSON.parse(clean.slice(s, e + 1));
        if (parsed.error) throw new Error(parsed.error);
        return parsed;
    } catch(err) {
        if (err.message.includes("Educational AI Assistant")) throw err;
        throw new Error("Failed to parse JSON: " + err.message);
    }
  }

  // Fetch the best educational image using Wikipedia's robust search engine
  async function fetchWikipediaImage(searchQuery) {
    try {
      // Use Wikipedia's search to handle synonyms, plurals, and complex topics
      // Requesting 1200px thumbs ensures crisp, high-resolution graphics (SVGs rendered as 1200px PNGs)
      const url = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(searchQuery)}&gsrlimit=3&prop=pageimages&pithumbsize=1200&format=json&origin=*`;
      const res = await fetch(url);
      const data = await res.json();
      
      const pages = Object.values(data?.query?.pages || {});
      if (!pages.length) return null;

      // Find the first page that has a high-quality thumbnail, excluding portraits or icons if possible
      for (const page of pages) {
        if (page.thumbnail && page.thumbnail.source) {
          const src = page.thumbnail.source.toLowerCase();
          // STRICTLY forbid real-life photos (.jpg) to guarantee educational diagrams (.svg or .png)
          if (!src.includes("portrait") && !src.includes("logo") && !src.includes("icon") && !src.includes(".jpg") && !src.includes(".jpeg")) {
            if (src.includes(".svg") || src.includes(".png")) {
              return page.thumbnail.source;
            }
          }
        }
      }
      
      // Fallback: just return the first available thumbnail if all were filtered
      return pages.find(p => p.thumbnail)?.thumbnail?.source || null;
    } catch (e) {
      console.warn("Wikipedia image fetch failed:", e);
    }
    return null;
  }

  // Local pre-generated 3D assets for common topics
  function getLocalAsset(topic) {
    const ck = (topic || "").toLowerCase().trim();
    if (ck.includes("water cycle")) return "/assets/water_cycle.png";
    if (ck.includes("ohm's law") || ck.includes("ohms law")) return "/assets/ohms_law.png";
    if (ck.includes("dna replication")) return "/assets/dna_replication.png";
    if (ck.includes("food chain")) return "/assets/food_chain.png";
    if (ck.includes("newton's first law") || ck.includes("newtons first law") || ck.includes("inertia")) return "/assets/newtons_first_law.png";
    return null;
  }

  const runQuery = async (query) => {
    setLoading(true);
    setError(null);
    setStatusMsg("Starting...");
    setPipeState({});
    const sleep = ms => new Promise(r => setTimeout(r, ms));

    try {
      const ck = query.toLowerCase();
      let eduData;

      if (cache.has(ck)) {
        eduData = cache.get(ck);
        sp("api", "done"); sp("gen", "done");
        setStatusMsg("Loaded from cache");
      } else {
        sp("api", "active");
        setStatusMsg("Connecting to API...");
        await sleep(200);
        sp("gen", "active");
        setStatusMsg("Generating full educational package...");
        eduData = await generateContent(query);
        cache.set(ck, eduData);
        sp("api", "done"); sp("gen", "done");
      }

      // Fetch Real Image
      sp("img", "active"); sp("res", "active");
      setStatusMsg("Finding high-quality educational image...");

      let imageUrl = imageCache.get(ck) || null;
      if (!imageUrl) {
        const actualTopic = eduData?.context?.topic || eduData?.topic;
        
        // Priority 1: Local pre-generated 3D assets
        imageUrl = getLocalAsset(actualTopic);

        // Priority 2: High-resolution, crisp, logo-free SVG diagrams from Wikipedia Search
        if (!imageUrl) {
          imageUrl = await fetchWikipediaImage(actualTopic);
        }

        // Cache the successful image URL
        if (imageUrl) {
          imageCache.set(ck, imageUrl);
        }
      }
      
      sp("img", imageUrl ? "done" : "err");
      sp("res", "done");
      
      sp("fmt", "active");
      setStatusMsg("Formatting...");
      await sleep(150);
      sp("fmt", "done");
      setStatusMsg("Complete!");
      
      return { eduData, imageUrl };

    } catch (err) {
      setError(err.message);
      return { error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return { runQuery, loading, error, statusMsg, pipeState };
}
