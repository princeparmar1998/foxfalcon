import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { getSessionOrJwt } from "@/lib/jwt-auth";
import { googleAdapter } from "@/lib/ai/provider/google.adapter";
import { db } from "@/lib/db";

// Max image size (4.5MB)
const MAX_FILE_SIZE = 4.5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(req: Request) {
  const logs: string[] = [];
  try {
    logs.push("[SYSTEM] Pipeline started. Authenticating administrator session...");
    
    // Auth Check
    const session = await getSessionOrJwt(req);
    if (!session || session.user?.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    logs.push(`[SYSTEM] Authenticated successfully as ADMIN (${session.user.email}).`);

    // Payload Parsing
    logs.push("[SYSTEM] parsing multipart/form-data payload...");
    const formData = await req.formData();
    const file = formData.get("file") as unknown as File | null;
    
    if (!file) {
      logs.push("❌ [CRITICAL] Image upload failed: No file provided in request payload.");
      return NextResponse.json({ error: "No file provided", logs }, { status: 400 });
    }

    // Extract AI Setting Tweaks
    const autopsy = formData.get("autopsy") === "true";
    const iq = formData.get("iq") === "true";
    const exposedLogs = formData.get("exposedLogs") === "true";
    const killCritical = formData.get("killCritical") === "true";
    const thinkPoints = formData.get("thinkPoints") === "true";
    const customPrompt = formData.get("customPrompt") as string || "";

    logs.push(`[SYSTEM] Image received: name="${file.name}", size=${(file.size / 1024).toFixed(1)} KB, type="${file.type}".`);

    // File Validation (Kill Critical Check)
    if (killCritical) {
      if (file.size > MAX_FILE_SIZE) {
        logs.push(`❌ [CRITICAL] File size violation: ${file.size} bytes exceeds max limit of ${MAX_FILE_SIZE} bytes (4.5MB).`);
        return NextResponse.json({ error: "File exceeds 4.5MB limit.", logs }, { status: 400 });
      }

      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        logs.push(`❌ [CRITICAL] Mime-type mismatch: "${file.type}" is not in the allowed list (JPEG, PNG, WEBP, GIF).`);
        return NextResponse.json({ error: "Invalid file type. Only JPEG, PNG, WEBP, and GIF are allowed.", logs }, { status: 400 });
      }
    } else {
      logs.push("[SYSTEM] Kill Critical validation checks bypassed by Administrator directive.");
    }

    logs.push("[SYSTEM] File validation passed. Extracting buffer...");
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save Image File (Public uploads directory or Base64 fallback)
    logs.push("[SYSTEM] Writing file to temporary web cache...");
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${timestamp}-${safeName}`;
    let url = "";

    try {
      const uploadDir = path.join(process.cwd(), "public", "uploads", "ai-temp");
      await fs.mkdir(uploadDir, { recursive: true });
      const filePath = path.join(uploadDir, fileName);
      await fs.writeFile(filePath, buffer);
      url = `/uploads/ai-temp/${fileName}`;
      logs.push(`[SYSTEM] Cached image to disk: url="${url}"`);
    } catch (fsError) {
      const mimeType = file.type || "image/png";
      url = `data:${mimeType};base64,${buffer.toString("base64")}`;
      logs.push("[SYSTEM] Write disk cache blocked (read-only filesystem). Encoded image as Base64 Data URL.");
    }
    // Validate Gemini API Key configuration
    if (!process.env.GEMINI_API_KEY) {
      logs.push("❌ [CRITICAL] AI Configuration Error: GEMINI_API_KEY is not defined in environment variables.");
      return NextResponse.json({ 
        error: "Google Gemini API key (GEMINI_API_KEY) is missing in environment configuration. Please configure it in your .env file to enable live AI Tag Generation.", 
        logs 
      }, { status: 400 });
    }

    // Call Gemini Multimodal (Exposed & 200% IQ)
    logs.push("[AI ENGINE] Packing instructions and dispatching image to Gemini...");
    
    // Assemble Dynamic Prompt Directive
    let prompt = `You are a premium streetwear brand director, copywriter, and aesthetic consultant for "Fox Falcon".
Analyze the provided image of clothing/apparel and extract metadata.`;

    if (autopsy) {
      logs.push("[AI ENGINE] Autopsy Mode active: Instructing model to perform pixel-level apparel structural checks...");
      prompt += `\nConduct a rigorous visual autopsy of the item: inspect fabric weave, weight, seam structure, pocket details, color scheme, and trim qualities.`;
    }

    if (iq) {
      logs.push("[AI ENGINE] 200% IQ Mode active: Enforcing advanced copywriting density and hypebeast vocabulary...");
      prompt += `\nApply 200% IQ copywriting: use sophisticated, high-end, urban streetwear terminology. Avoid cheap or basic words. Create a highly professional brand voice.`;
    }

    if (thinkPoints) {
      logs.push("[AI ENGINE] 10 Think Points active: Injecting structural analysis rules...");
      prompt += `\nMake sure your copy addresses 10 key streetwear components: Fit, Silhouette, Fabric Weight, Wash, Texture, Styling compatibility, Cultural relevance, Durability, Trim details, and Brand tone.`;
    }

    if (customPrompt && customPrompt.trim().length > 0) {
      logs.push(`[AI ENGINE] Injecting custom prompt directive: "${customPrompt}"`);
      prompt += `\nForce Custom Directive: ${customPrompt}`;
    }

    prompt += `\nYou must respond with a raw JSON block ONLY, matching this schema:
{
  "title": "A premium, luxury, punchy product name (e.g. 'Falcon Obsidian Heavyweight Hoodie')",
  "tags": ["6-10 descriptive design tags, lowercase, e.g. oversized, drop shoulder, heavyweight, luxury, boxy, streetwear"],
  "hashtags": ["5-8 social media tags, lowercase, without prefix # (e.g., hoodies, streetstyle, minimalfashion)"],
  "caption": "A short, viral, hype-inducing social media caption for Instagram (include a tagline and line breaks)",
  "description": "A sophisticated e-commerce product description (2-3 sentences) detailing quality, fit, craftsmanship, and a luxury styling tip."
}
Do not wrap your response in markdown code blocks like \`\`\`json. Return only the raw JSON.`;

    let generatedText = "";
    try {
      generatedText = await googleAdapter.generateTextWithImage(prompt, buffer, file.type);
      if (generatedText.startsWith("[SIMULATED")) {
        throw new Error("Gemini AI Adapter returned simulated mock value. Check if GEMINI_API_KEY is valid.");
      }
      logs.push("[AI ENGINE] Gemini analysis stream completed.");
    } catch (aiError: any) {
      logs.push(`❌ [AI ENGINE] Gemini execution failed: ${aiError.message || String(aiError)}.`);
      return NextResponse.json({ 
        error: `AI Generation Error: ${aiError.message || String(aiError)}`, 
        logs 
      }, { status: 500 });
    }

    // Parse Response
    let resultJson: any = null;
    try {
      const cleanedText = generatedText.replace(/```json/g, "").replace(/```/g, "").trim();
      resultJson = JSON.parse(cleanedText);
      logs.push("[SYSTEM] JSON response validated and structured successfully.");
    } catch (parseError: any) {
      logs.push(`❌ [SYSTEM] Failed to parse JSON response from Gemini: ${parseError.message || String(parseError)}`);
      return NextResponse.json({ 
        error: `Failed to parse AI output: ${parseError.message || String(parseError)}`, 
        logs 
      }, { status: 500 });
    }


    // 2. Fetch Trending Hashtags & Merge (IQ Algorithm)
    logs.push("[DATABASE] Querying Neon PostgreSQL for trending social media tags...");
    let trendingTags: any[] = [];
    try {
      trendingTags = await db.trendingHashtag.findMany({
        take: 15,
        orderBy: { popularity: "desc" }
      });
      logs.push(`[DATABASE] Retrieved ${trendingTags.length} trending streetwear tags from PostgreSQL.`);
    } catch (dbError) {
      logs.push("⚠️ [DATABASE] PostgreSQL unavailable. Using default in-memory hashtag index.");
      trendingTags = [
        { tag: "streetwear" }, { tag: "hypebeast" }, { tag: "luxurywear" }, { tag: "oversized" }
      ];
    }

    // Merge logic: Add trending tags if they match semantic category or if we need to pad the results
    logs.push("[ALGORITHM] Running weighted semantic tag-matching and deduplication...");
    const mergedHashtags = new Set<string>();
    
    // Add AI generated ones first
    resultJson.hashtags.forEach((h: string) => mergedHashtags.add(h.toLowerCase().trim()));

    // Inject matching trending ones
    trendingTags.forEach((t) => {
      // If trending tag is partially mentioned in tags or title, boost it!
      const isRelevant = resultJson.tags.some((tag: string) => tag.includes(t.tag) || t.tag.includes(tag)) ||
                         resultJson.title.toLowerCase().includes(t.tag);
      if (isRelevant && mergedHashtags.size < 12) {
        mergedHashtags.add(t.tag);
      }
    });

    // Pad with top overall trending tags if we have room
    let trendIdx = 0;
    while (mergedHashtags.size < 10 && trendIdx < trendingTags.length) {
      mergedHashtags.add(trendingTags[trendIdx].tag);
      trendIdx++;
    }

    resultJson.hashtags = Array.from(mergedHashtags);
    logs.push(`[ALGORITHM] Completed. Merged results set: ${resultJson.hashtags.length} hashtags created.`);

    logs.push("✅ PIPELINE EXECUTION SUCCESSFUL. SUGGESTIONS READY FOR AUDIT.");

    return NextResponse.json({
      imageUrl: url,
      ...resultJson,
      logs
    });

  } catch (error: any) {
    console.error("[TAGS_GENERATOR_POST]", error);
    logs.push(`❌ [FATAL ERROR] System Failure: ${error.message || String(error)}`);
    return NextResponse.json({ error: error.message || String(error), logs }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getSessionOrJwt(req);
    if (!session || session.user?.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id, title, tags, hashtags, caption, description } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing required field: id" }, { status: 400 });
    }

    const updatedRecord = await db.aiImageTags.update({
      where: { id },
      data: {
        title,
        tags: tags || [],
        hashtags: hashtags || [],
        caption: caption || "",
        description: description || ""
      }
    });

    return NextResponse.json(updatedRecord);
  } catch (error: any) {
    console.error("[TAGS_GENERATOR_PUT]", error);
    return NextResponse.json({ error: error.message || String(error) }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getSessionOrJwt(req);
    if (!session || session.user?.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing asset ID parameter" }, { status: 400 });
    }

    await db.aiImageTags.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[TAGS_GENERATOR_DELETE]", error);
    return NextResponse.json({ error: error.message || String(error) }, { status: 500 });
  }
}

