
import type { SVGProps } from "react";

type SleeperLogoProps = SVGProps<SVGSVGElement> & {
  variant?: "header" | "hero";
};

export function SleeperLogo({
  variant = "header",
  className = "",
  ...props
}: SleeperLogoProps) {
  const hero = variant === "hero";
  const id = hero ? "hero" : "header";
  const titleId = "sleeper-z-title-" + id;
  const faceId = "sleeper-z-face-" + id;
  const ballId = "sleeper-z-ball-" + id;

  const scale = hero ? 1.5 : 0.72;
  const wordX = hero ? 185 : 108;
  const wordY = hero ? 112 : 56;
  const wordWidth = hero ? 510 : 300;
  const fontSize = hero ? 68 : 39;

  return (
    <svg
      className={"sleeper-logo sleeper-logo--" + variant + " " + className}
      viewBox={hero ? "0 0 720 180" : "0 0 420 90"}
      role="img"
      aria-labelledby={titleId}
      {...props}
    >
      <title id={titleId}>SLEEPER-Z</title>

      <defs>
        <linearGradient
          id={faceId}
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop offset="0%" stopColor="#b8fff4" />
          <stop offset="45%" stopColor="#35dfce" />
          <stop offset="100%" stopColor="#087da8" />
        </linearGradient>

        <radialGradient
          id={ballId}
          cx="30%"
          cy="25%"
          r="75%"
        >
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="22%" stopColor="#8bf2ff" />
          <stop offset="60%" stopColor="#168dff" />
          <stop offset="100%" stopColor="#03266f" />
        </radialGradient>
      </defs>

      {/* Angular Z emblem */}
      <g transform={"translate(18 10) scale(" + scale + ")"}>
        <path
          d="M8 8 H94 L36 48 H94 L36 88 H8 L66 48 H8 Z"
          fill="#061522"
          stroke="#02080e"
          strokeWidth="7"
          strokeLinejoin="bevel"
        />

        <path
          d="M8 8 H94 L36 48 H94 L36 88 H8 L66 48 H8 Z"
          fill={"url(#" + faceId + ")"}
          stroke="#9efff1"
          strokeWidth="1.5"
          strokeLinejoin="bevel"
        />

        {/* Orb embedded at the Z intersection */}
        <circle
          cx="49"
          cy="48"
          r="16"
          fill="#04101e"
          stroke="#071a32"
          strokeWidth="3"
        />

        <circle
          cx="49"
          cy="48"
          r="12.5"
          fill={"url(#" + ballId + ")"}
          stroke="#a0f5ff"
          strokeWidth="1.5"
        />

        <ellipse
          cx="45"
          cy="44"
          rx="4"
          ry="2"
          fill="#ffffff"
          opacity=".9"
          transform="rotate(-30 45 44)"
        />

        <path
          d="M49 41 L52 46 L57 46 L53 49 L54.5 55 L49 52 L43.5 55 L45 49 L41 46 L46 46 Z"
          fill="#07328d"
          stroke="#b4f8ff"
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </g>

      {/* One wordmark for consistent spacing */}
      <text
        x={wordX}
        y={wordY}
        fill="#f2fcff"
        fontFamily="Arial Black, Impact, sans-serif"
        fontSize={fontSize}
        fontWeight="900"
        letterSpacing="1"
        textLength={wordWidth}
        lengthAdjust="spacingAndGlyphs"
      >
        SLEEPER-Z
      </text>
    </svg>
  );
}
