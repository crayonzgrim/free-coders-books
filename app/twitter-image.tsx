import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Free Coders Books - Free Programming Resources";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          backgroundImage:
            "radial-gradient(circle at 25% 25%, #1a1a2e 0%, transparent 50%), radial-gradient(circle at 75% 75%, #16213e 0%, transparent 50%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 40,
          }}
        >
          <svg
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#f97316"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            <path d="M8 7h8" />
            <path d="M8 11h6" />
          </svg>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h1
            style={{
              fontSize: 64,
              fontWeight: 800,
              background: "linear-gradient(to right, #f97316, #fb923c)",
              backgroundClip: "text",
              color: "transparent",
              margin: 0,
              padding: 0,
            }}
          >
            Free Coders Books
          </h1>
          <p
            style={{
              fontSize: 28,
              color: "#a1a1aa",
              marginTop: 20,
              textAlign: "center",
              maxWidth: 800,
            }}
          >
            Discover thousands of free programming books in 50+ languages
          </p>
        </div>
        <div
          style={{
            display: "flex",
            gap: 20,
            marginTop: 40,
          }}
        >
          {["JavaScript", "Python", "Java", "Go", "Rust"].map((lang) => (
            <div
              key={lang}
              style={{
                padding: "10px 24px",
                backgroundColor: "rgba(249, 115, 22, 0.1)",
                border: "1px solid rgba(249, 115, 22, 0.3)",
                borderRadius: 9999,
                color: "#f97316",
                fontSize: 18,
              }}
            >
              {lang}
            </div>
          ))}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 40,
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: "#71717a",
            fontSize: 16,
          }}
        >
          <span>Built for developers, by the community</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
