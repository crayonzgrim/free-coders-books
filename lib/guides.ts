import fs from "fs";
import path from "path";
import { marked } from "marked";

export interface GuideFrontmatter {
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  author: string;
  date: string;
  category: string;
  tags: string[];
  readingTime: number;
}

export interface Guide extends GuideFrontmatter {
  slug: string;
  content: string;
}

export interface GuidePreview extends GuideFrontmatter {
  slug: string;
}

const guidesDirectory = path.join(process.cwd(), "content/guides");

function parseFrontmatter(fileContent: string): {
  frontmatter: GuideFrontmatter;
  content: string;
} {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = fileContent.match(frontmatterRegex);

  if (!match) {
    throw new Error("Invalid frontmatter format");
  }

  const frontmatterString = match[1];
  const content = match[2];

  const frontmatter: Record<string, unknown> = {};
  const lines = frontmatterString.split("\n");

  let currentKey = "";
  let isArray = false;
  let arrayItems: string[] = [];

  for (const line of lines) {
    const keyValueMatch = line.match(/^(\w+):\s*(.*)$/);

    if (keyValueMatch) {
      // Save previous array if exists
      if (isArray && currentKey) {
        frontmatter[currentKey] = arrayItems;
        arrayItems = [];
      }

      currentKey = keyValueMatch[1];
      const value = keyValueMatch[2].trim();

      if (value === "") {
        // Could be the start of an array
        isArray = true;
      } else if (value.startsWith("[") && value.endsWith("]")) {
        // Inline array
        const items = value
          .slice(1, -1)
          .split(",")
          .map((item) => item.trim().replace(/^["']|["']$/g, ""));
        frontmatter[currentKey] = items;
        isArray = false;
      } else if (value.startsWith('"') && value.endsWith('"')) {
        frontmatter[currentKey] = value.slice(1, -1);
        isArray = false;
      } else if (!isNaN(Number(value))) {
        frontmatter[currentKey] = Number(value);
        isArray = false;
      } else {
        frontmatter[currentKey] = value;
        isArray = false;
      }
    } else if (isArray && line.trim().startsWith("-")) {
      const item = line.trim().slice(1).trim().replace(/^["']|["']$/g, "");
      arrayItems.push(item);
    }
  }

  // Save last array if exists
  if (isArray && currentKey) {
    frontmatter[currentKey] = arrayItems;
  }

  return {
    frontmatter: frontmatter as unknown as GuideFrontmatter,
    content,
  };
}

export async function getAllGuides(): Promise<GuidePreview[]> {
  if (!fs.existsSync(guidesDirectory)) {
    return [];
  }

  const files = fs.readdirSync(guidesDirectory);
  const guides: GuidePreview[] = [];

  for (const filename of files) {
    if (!filename.endsWith(".md")) continue;

    const filePath = path.join(guidesDirectory, filename);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { frontmatter } = parseFrontmatter(fileContent);
    const slug = filename.replace(/\.md$/, "");

    guides.push({
      ...frontmatter,
      slug,
    });
  }

  // Sort by date (newest first)
  guides.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return guides;
}

export async function getGuideBySlug(slug: string): Promise<Guide | null> {
  const filePath = path.join(guidesDirectory, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { frontmatter, content } = parseFrontmatter(fileContent);

  // Parse markdown to HTML
  const htmlContent = await marked(content);

  return {
    ...frontmatter,
    slug,
    content: htmlContent,
  };
}

export async function getGuidesByCategory(category: string): Promise<GuidePreview[]> {
  const allGuides = await getAllGuides();
  return allGuides.filter((guide) => guide.category === category);
}

export function getAllGuideSlugs(): string[] {
  if (!fs.existsSync(guidesDirectory)) {
    return [];
  }

  const files = fs.readdirSync(guidesDirectory);
  return files
    .filter((filename) => filename.endsWith(".md"))
    .map((filename) => filename.replace(/\.md$/, ""));
}
