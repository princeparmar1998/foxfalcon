import fs from "fs";
import path from "path";

export interface MemoryItem {
  id: string;
  category: string;
  content: string;
  tags?: string[];
  createdAt: string;
}

export class MemoryEngine {
  private static filePath = path.join(process.cwd(), "src/lib/ai/memory.json");

  private static ensureFile() {
    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify(this.getInitialMemory(), null, 2));
    }
  }

  public static getInitialMemory(): MemoryItem[] {
    return [
      {
        id: "1",
        category: "Brand Guidelines",
        content: "Fox Falcon stands for Premium Luxury Streetwear. Aesthetics: Sleek dark theme, high contrast typography, drop shoulders, heavy fabrics (380+ GSM French Terry).",
        tags: ["luxury", "philosophy", "fabric"],
        createdAt: new Date().toISOString()
      },
      {
        id: "2",
        category: "Mistakes",
        content: "Mistake #01: Offering plain white t-shirts without embroidery or drop shoulder fits was rejected by high-end shoppers. Keep premium cuts.",
        tags: ["design", "lessons"],
        createdAt: new Date().toISOString()
      },
      {
        id: "3",
        category: "Lessons learned",
        content: "Meta ads targeting luxury streetwear lookalike audiences (Represent, Fear of God) generated 4.2x ROAS compared to general fashion interest targeting.",
        tags: ["marketing", "ads", "ROAS"],
        createdAt: new Date().toISOString()
      },
      {
        id: "4",
        category: "Color palette",
        content: "Approved Palette: Midnight Black (#000000), Falcon Rust (#D9541E), Luxury Off-White (#F7F6F3), Charcoal Grey (#2A2B2D).",
        tags: ["design", "color"],
        createdAt: new Date().toISOString()
      },
      {
        id: "5",
        category: "Typography",
        content: "Use Outfit for display headers, and Inter for utility and body text. Extreme weights (Thin 100, Black 900) emphasize luxury perception.",
        tags: ["design", "fonts"],
        createdAt: new Date().toISOString()
      }
    ];
  }

  public static getAll(): MemoryItem[] {
    try {
      this.ensureFile();
      const content = fs.readFileSync(this.filePath, "utf-8");
      return JSON.parse(content);
    } catch (e) {
      return this.getInitialMemory();
    }
  }

  public static save(items: MemoryItem[]): void {
    this.ensureFile();
    fs.writeFileSync(this.filePath, JSON.stringify(items, null, 2));
  }

  public static add(category: string, content: string, tags?: string[]): MemoryItem {
    const items = this.getAll();
    const newItem: MemoryItem = {
      id: Math.random().toString(36).substring(2, 9),
      category,
      content,
      tags,
      createdAt: new Date().toISOString()
    };
    items.push(newItem);
    this.save(items);
    return newItem;
  }
}
