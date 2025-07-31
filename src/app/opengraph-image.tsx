import { ImageResponse } from "next/og";
import {
  PROJECT_TITLE,
  PROJECT_DESCRIPTION,
  PROJECT_AVATAR_URL,
} from "~/lib/constants";

export const alt = PROJECT_TITLE;
export const contentType = "image/png";
export const size = {
  width: 1200,
  height: 630,
};

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          backgroundColor: "#0a0a0a",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Modern gradient background */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(135deg, #0066ff 0%, #8b5cf6 50%, #06b6d4 100%)",
            opacity: 0.95,
          }}
        />

        {/* Abstract geometric pattern overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              radial-gradient(circle at 15% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 40%),
              radial-gradient(circle at 85% 75%, rgba(255, 255, 255, 0.08) 0%, transparent 40%),
              linear-gradient(45deg, transparent 45%, rgba(255, 255, 255, 0.03) 49%, rgba(255, 255, 255, 0.03) 51%, transparent 55%)
            `,
          }}
        />

        {/* Main content - centered in 630x630 safe zone */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            padding: "80px 60px",
            position: "relative",
            zIndex: 10,
          }}
        >
          {/* Brand icon/avatar with modern styling */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "48px",
              position: "relative",
            }}
          >
            {/* Subtle glow effect */}
            <div
              style={{
                position: "absolute",
                width: "120px",
                height: "120px",
                borderRadius: "24px",
                background: "radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%)",
                filter: "blur(16px)",
              }}
            />
            {/* Avatar container with modern border radius */}
            <div
              style={{
                width: "96px",
                height: "96px",
                borderRadius: "20px",
                overflow: "hidden",
                border: "4px solid rgba(255, 255, 255, 0.9)",
                backgroundColor: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.25)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={PROJECT_AVATAR_URL}
                alt="Creator avatar"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          </div>

          {/* Project title - mobile-readable 48px+ */}
          <h1
            style={{
              fontSize: "68px",
              fontWeight: "900",
              color: "#ffffff",
              textAlign: "center",
              marginBottom: "32px",
              lineHeight: 1.1,
              letterSpacing: "-2.5px",
              textShadow: "0 4px 16px rgba(0, 0, 0, 0.4)",
              maxWidth: "900px",
              fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
            }}
          >
            {PROJECT_TITLE}
          </h1>

          {/* Project description - mobile-readable 28px+ */}
          <p
            style={{
              fontSize: "28px",
              fontWeight: "600",
              color: "rgba(255, 255, 255, 0.92)",
              textAlign: "center",
              marginBottom: "48px",
              lineHeight: 1.4,
              textShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
              maxWidth: "720px",
              fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
            }}
          >
            {PROJECT_DESCRIPTION}
          </p>

          {/* Technology badges */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {/* Farcaster badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "16px 24px",
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                borderRadius: "16px",
                border: "2px solid rgba(255, 255, 255, 0.3)",
                backdropFilter: "blur(8px)",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
              }}
            >
              <div
                style={{
                  width: "24px",
                  height: "24px",
                  backgroundColor: "#7c65c1",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    backgroundColor: "white",
                    borderRadius: "2px",
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#ffffff",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                }}
              >
                Farcaster
              </span>
            </div>

            {/* Base badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "16px 24px",
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                borderRadius: "16px",
                border: "2px solid rgba(255, 255, 255, 0.3)",
                backdropFilter: "blur(8px)",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
              }}
            >
              <div
                style={{
                  width: "24px",
                  height: "24px",
                  backgroundColor: "#0052ff",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    backgroundColor: "white",
                    borderRadius: "50%",
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#ffffff",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                }}
              >
                Base
              </span>
            </div>
          </div>
        </div>

        {/* Subtle bottom overlay for depth */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "160px",
            background: "linear-gradient(to top, rgba(0, 0, 0, 0.2) 0%, transparent 100%)",
          }}
        />
      </div>
    ),
    {
      ...size,
    },
  );
}
