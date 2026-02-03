import fs from "fs";
import path from "path";
import { marked } from "marked";

export interface ArticleFrontmatter {
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

export interface Article extends ArticleFrontmatter {
  slug: string;
  content: string;
}

export interface ArticlePreview extends ArticleFrontmatter {
  slug: string;
}

const articlesDirectory = path.join(process.cwd(), "content/articles");

function parseFrontmatter(fileContent: string): {
  frontmatter: ArticleFrontmatter;
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
      if (isArray && currentKey) {
        frontmatter[currentKey] = arrayItems;
        arrayItems = [];
      }

      currentKey = keyValueMatch[1];
      const value = keyValueMatch[2].trim();

      if (value === "") {
        isArray = true;
      } else if (value.startsWith("[") && value.endsWith("]")) {
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

  if (isArray && currentKey) {
    frontmatter[currentKey] = arrayItems;
  }

  return {
    frontmatter: frontmatter as unknown as ArticleFrontmatter,
    content,
  };
}

export async function getAllArticles(): Promise<ArticlePreview[]> {
  if (!fs.existsSync(articlesDirectory)) {
    return [];
  }

  const files = fs.readdirSync(articlesDirectory);
  const articles: ArticlePreview[] = [];

  for (const filename of files) {
    if (!filename.endsWith(".md")) continue;

    const filePath = path.join(articlesDirectory, filename);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { frontmatter } = parseFrontmatter(fileContent);
    const slug = filename.replace(/\.md$/, "");

    articles.push({
      ...frontmatter,
      slug,
    });
  }

  articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return articles;
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const filePath = path.join(articlesDirectory, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { frontmatter, content } = parseFrontmatter(fileContent);

  const htmlContent = await marked(content);

  return {
    ...frontmatter,
    slug,
    content: htmlContent,
  };
}

export function getAllArticleSlugs(): string[] {
  if (!fs.existsSync(articlesDirectory)) {
    return [];
  }

  const files = fs.readdirSync(articlesDirectory);
  return files
    .filter((filename) => filename.endsWith(".md"))
    .map((filename) => filename.replace(/\.md$/, ""));
}
