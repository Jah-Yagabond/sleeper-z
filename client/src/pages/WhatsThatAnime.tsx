import { useEffect, useMemo, useState } from "react";

type ProgressiveSketchProps = {
  subject?: string | null;
  replayKey?: string;
  onComplete?: () => void;
  className?: string;
};

type Stroke = {
  d: string;
  width?: number;
};

const drawings: Record<string, Stroke[]> = {
  goku: [
    { d: "M65 30 L48 12 L57 39 L36 25 L47 50 L27 43 L42 62 L25 65 L45 78 L39 98 L55 91 L64 111 L75 92 L91 102 L89 80 L108 69 L91 60 L100 43 L81 48 L78 25 Z" },
    { d: "M49 52 Q43 70 53 89 L70 101 L88 84 Q96 67 82 52 Z" },
    { d: "M51 65 L64 69 L58 73 M76 68 L87 64 L82 73 M63 83 L77 82" },
    { d: "M51 90 L48 116 L70 130 L91 113 L87 88" },
    { d: "M48 116 L24 129 L15 154 L47 149 L68 132 M91 113 L114 128 L124 153 L93 149 L70 132" },
  ],
  vegeta: [
    { d: "M43 40 L25 17 L51 29 L49 9 L70 27 L91 12 L88 34 L109 26 L96 52 L99 75 L86 93 L68 101 L48 88 L38 69 Z" },
    { d: "M45 52 Q44 70 54 84 L69 94 L84 79 L88 53 Z" },
    { d: "M47 61 L64 65 L57 70 M75 65 L87 60 L80 70 M60 81 L78 80" },
    { d: "M52 91 L50 116 L69 128 L88 114 L83 88" },
    { d: "M50 116 L25 130 L19 155 L68 139 L88 114 L112 130 L120 155 L71 139" },
  ],
  "gon-freecss": [
    { d: "M40 43 L31 15 L49 30 L55 7 L68 29 L89 14 L87 35 L105 27 L92 52 L93 73 L79 91 L61 98 L44 84 L36 65 Z" },
    { d: "M43 51 Q42 70 52 83 L65 92 L81 77 L84 52 Z" },
    { d: "M44 62 L59 65 L53 70 M71 65 L83 61 L76 70 M54 79 L72 79" },
    { d: "M51 90 L49 116 L66 129 L84 114 L80 88" },
    { d: "M49 116 L23 132 L18 155 L66 139 L84 114 L110 132 L117 155 L69 139" },
  ],
  "killua-zoldyck": [
    { d: "M40 42 L33 19 L52 31 L60 12 L72 30 L90 17 L86 39 L101 31 L91 53 L93 73 L79 89 L63 96 L46 82 L38 65 Z" },
    { d: "M44 51 Q43 69 53 82 L66 91 L81 77 L84 52 Z" },
    { d: "M45 62 L59 65 L53 70 M72 65 L83 61 L76 70 M55 80 L73 79" },
    { d: "M51 90 L49 116 L67 128 L85 114 L81 88" },
    { d: "M49 116 L23 132 L18 155 L67 139 L85 114 L111 132 L118 155 L70 139" },
  ],
  "light-yagami": [
    { d: "M40 43 L34 23 L50 31 L57 15 L70 31 L88 21 L86 41 L99 35 L90 54 L91 75 L77 91 L61 96 L45 83 L38 65 Z" },
    { d: "M43 52 Q42 70 53 83 L65 91 L80 77 L83 52 Z" },
    { d: "M44 62 L58 65 L52 70 M70 65 L82 61 L75 70 M55 80 L72 79" },
    { d: "M50 91 L48 116 L66 129 L84 114 L80 89" },
    { d: "M48 116 L23 132 L18 155 L66 139 L84 114 L111 132 L118 155 L69 139" },
  ],
  "death-note-book": [
    { d: "M34 30 L91 19 L112 35 L112 122 L56 139 L34 123 Z" },
    { d: "M34 30 L56 46 L112 35 M56 46 L56 139" },
    { d: "M64 62 L98 54 M64 75 L98 67 M64 88 L98 80 M64 101 L91 93" },
  ],
  "tanjiro-kamado": [
    { d: "M39 44 L31 25 L49 33 L56 14 L70 31 L91 21 L87 42 L99 35 L90 56 L92 74 L78 90 L61 98 L44 84 L37 64 Z" },
    { d: "M43 52 Q42 70 52 83 L65 92 L81 77 L84 52 Z" },
    { d: "M44 62 L59 65 L53 70 M72 65 L83 61 L76 70 M55 80 L73 79" },
    { d: "M50 91 L48 116 L66 129 L85 114 L80 89" },
    { d: "M48 116 L22 132 L17 155 L66 139 L85 114 L112 132 L119 155 L69 139" },
  ],
  "monkey-d-luffy": [
    { d: "M42 41 L34 23 L51 31 L58 14 L72 31 L90 21 L88 43 L99 35 L91 57 L92 74 L78 90 L62 97 L45 84 L38 64 Z" },
    { d: "M44 52 Q42 70 53 83 L66 92 L81 77 L84 52 Z" },
    { d: "M45 62 L59 65 L53 70 M72 65 L83 61 L76 70 M55 80 L73 79" },
    { d: "M50 91 L48 116 L66 129 L85 114 L80 89" },
    { d: "M48 116 L22 132 L17 155 L66 139 L85 114 L112 132 L119 155 L69 139" },
    { d: "M35 23 L29 17 L45 20 M90 21 L99 18" },
  ],
  naruto: [
    { d: "M40 42 L31 22 L48 31 L55 12 L69 29 L88 17 L87 39 L102 31 L92 54 L93 74 L79 90 L62 98 L44 84 L37 64 Z" },
    { d: "M43 52 Q42 70 53 83 L66 92 L81 77 L84 52 Z" },
    { d: "M44 62 L59 65 L53 70 M72 65 L83 61 L76 70 M55 80 L73 79" },
    { d: "M50 91 L48 116 L66 129 L85 114 L80 89" },
    { d: "M48 116 L22 132 L17 155 L66 139 L85 114 L112 132 L119 155 L69 139" },
    { d: "M42 57 L48 60 M55 58 L61 61 M73 58 L79 55 M85 56 L90 53" },
  ],
  "dragon-ball": [
    { d: "M70 24 A43 43 0 1 1 69.9 24" },
    { d: "M57 53 L63 44 L69 53 L63 62 Z M80 49 L86 40 L92 49 L86 58 Z M68 76 L74 67 L80 76 L74 85 Z" },
  ],
  "four-star-dragon-ball": [
    { d: "M70 24 A43 43 0 1 1 69.9 24" },
    { d: "M55 48 L61 39 L67 48 L61 57 Z M76 48 L82 39 L88 48 L82 57 Z M55 72 L61 63 L67 72 L61 81 Z M76 72 L82 63 L88 72 L82 81 Z" },
  ],
  "straw-hat-jolly-roger": [
    { d: "M35 73 Q42 42 70 38 Q98 42 105 73 L35 73 Z" },
    { d: "M29 75 Q70 85 111 75 L105 84 Q70 94 35 84 Z" },
    { d: "M70 39 L70 20 M70 22 L83 29 L70 35" },
    { d: "M48 100 L92 118 M92 100 L48 118 M56 104 L56 114 M84 104 L84 114" },
  ],
  "going-merry": [
    { d: "M18 104 L121 104 L104 128 L40 128 Z" },
    { d: "M67 104 L67 29 L70 29 L70 104" },
    { d: "M70 36 L101 72 L70 72 Z M64 47 L39 76 L64 76 Z" },
    { d: "M24 104 L114 104 M42 136 L98 136" },
  ],
  "game-boy": [
    { d: "M48 15 L91 15 Q99 15 99 24 L99 136 Q99 145 91 145 L48 145 Q40 145 40 136 L40 24 Q40 15 48 15 Z" },
    { d: "M50 30 L89 30 L89 62 L50 62 Z" },
    { d: "M52 88 L68 88 L68 104 L52 104 Z M60 80 L60 112 M44 96 L76 96" },
    { d: "M80 88 A5 5 0 1 1 79.9 88 M91 100 A5 5 0 1 1 90.9 100" },
  ],
  gamecube: [
    { d: "M40 40 L92 40 L110 57 L110 111 L58 111 L40 94 Z" },
    { d: "M40 40 L58 57 L110 57 M58 57 L58 111" },
    { d: "M58 57 L92 40 L110 57 L75 75 Z" },
    { d: "M75 75 L75 105 M85 88 L99 88" },
  ],
  "hunter-license": [
    { d: "M34 38 L106 38 L106 113 L34 113 Z" },
    { d: "M42 48 L98 48 L98 74 L42 74 Z" },
    { d: "M45 86 L95 86 M45 96 L80 96 M45 105 L70 105" },
    { d: "M70 54 L70 68 M63 61 L77 61" },
  ],
  "blue-lock-ball": [
    { d: "M70 25 A43 43 0 1 1 69.9 25" },
    { d: "M70 25 L84 40 L76 57 L57 55 L49 38 Z" },
    { d: "M49 38 L34 40 M57 55 L51 76 M76 57 L94 70 M84 40 L96 34 M51 76 L67 91 L86 87" },
  ],
  "haikyuu-volleyball": [
    { d: "M70 25 A43 43 0 1 1 69.9 25" },
    { d: "M40 38 Q70 58 100 38 M34 73 Q70 88 106 73 M57 28 Q42 70 57 112 M83 28 Q98 70 83 112" },
  ],
  "nichirin-sword": [
    { d: "M29 117 L101 35 L109 42 L37 124 Z" },
    { d: "M29 117 L20 126 L28 134 L37 124 Z" },
    { d: "M19 123 L31 135 M22 119 L35 131 M27 115 L39 127" },
    { d: "M101 35 L108 25 L116 32 L109 42" },
  ],
  kunai: [
    { d: "M70 25 L91 59 L70 81 L49 59 Z" },
    { d: "M70 81 L70 120" },
    { d: "M62 120 L78 120 L78 133 L62 133 Z" },
    { d: "M62 127 A8 8 0 1 1 61.9 127" },
  ],
  "senzu-bean": [
    { d: "M44 103 Q25 70 52 43 Q74 25 91 48 Q112 80 82 107 Q62 123 44 103 Z" },
    { d: "M43 103 Q68 81 91 48" },
  ],
};

const drawingAliases: Record<string, string> = {
  goku: "goku",
  "son-goku": "goku",
  vegeta: "vegeta",
  gon: "gon-freecss",
  "gon-freecss": "gon-freecss",
  killua: "killua-zoldyck",
  "killua-zoldyck": "killua-zoldyck",
  "light-yagami": "light-yagami",
  "l-lawliet": "light-yagami",
  "death-note": "death-note-book",
  "death-note-book": "death-note-book",
  "shoyo-hinata": "haikyuu-volleyball",
  "hinata-shoyo": "haikyuu-volleyball",
  tanjiro: "tanjiro-kamado",
  "tanjiro-kamado": "tanjiro-kamado",
  "monkey-d-luffy": "monkey-d-luffy",
  luffy: "monkey-d-luffy",
  naruto: "naruto",
  "naruto-uzumaki": "naruto",
  "dragon-ball-object": "dragon-ball",
  "dragon-ball": "dragon-ball",
  "four-star-dragon-ball": "four-star-dragon-ball",
  "straw-hat-jolly-roger": "straw-hat-jolly-roger",
  "going-merry": "going-merry",
  "game-boy": "game-boy",
  gamecube: "gamecube",
  "hunter-license": "hunter-license",
  "hunter-license-bonus": "hunter-license",
  "blue-lock-ball": "blue-lock-ball",
  "haikyuu-volleyball": "haikyuu-volleyball",
  "nichirin-sword": "nichirin-sword",
  "senzu-bean": "senzu-bean",
  "capsule-corporation-capsule": "senzu-bean",
};

const fallbackDrawing: Stroke[] = [
  { d: "M42 44 Q42 22 70 22 Q98 22 98 44 L94 74 Q88 94 70 99 Q52 94 46 74 Z" },
  { d: "M48 57 L63 61 L56 66 M77 61 L91 57 L84 66" },
  { d: "M60 80 Q70 85 80 80" },
  { d: "M51 97 L47 121 L70 136 L93 121 L89 97" },
  { d: "M47 121 L22 138 L18 158 L70 143 L122 158 L118 138 L93 121" },
];

function normalizeSubject(subject?: string | null): string {
  return (subject ?? "")
    .trim()
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function ProgressiveSketch({
  subject,
  replayKey = "",
  onComplete,
  className = "",
}: ProgressiveSketchProps) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const safeSubject = subject ?? "unknown";
  const normalized = normalizeSubject(safeSubject);

  const strokes = useMemo(() => {
    const drawingId = drawingAliases[normalized] ?? normalized;
    return drawings[drawingId] ?? fallbackDrawing;
  }, [normalized]);

  useEffect(() => {
    setVisibleCount(0);
    setFinished(false);

    let count = 0;
    let interval: number | undefined;

    interval = window.setInterval(() => {
      count += 1;
      setVisibleCount(count);

      if (count >= strokes.length) {
        if (interval !== undefined) {
          window.clearInterval(interval);
        }
        setFinished(true);
        onComplete?.();
      }
    }, 170);

    return () => {
      if (interval !== undefined) {
        window.clearInterval(interval);
      }
    };
  }, [strokes, safeSubject, replayKey, onComplete]);

  return (
    <div
      key={replayKey || safeSubject}
      className={`flex items-center justify-center bg-black ${className}`}
      aria-label={`Progressive line-art sketch of ${safeSubject}`}
      role="img"
    >
      <svg
        viewBox="0 0 140 170"
        className="h-full w-full max-w-sm"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {strokes.slice(0, visibleCount).map((stroke, index) => (
          <path
            key={`${replayKey}-${safeSubject}-${index}`}
            d={stroke.d}
            stroke="white"
            strokeWidth={stroke.width ?? 2}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength="1"
            strokeDasharray="1"
            strokeDashoffset="0"
          />
        ))}
        {finished && (
          <circle
            cx="126"
            cy="153"
            r="2"
            stroke="white"
            strokeWidth="1"
          />
        )}
      </svg>
    </div>
  );
}