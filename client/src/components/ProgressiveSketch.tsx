
import { useEffect, useMemo, useRef, useState } from "react";

type ProgressiveSketchProps = {
  subject?: string;
  replayKey?: string;
  onComplete?: () => void;
  className?: string;
};

type Stroke = {
  d: string;
  width?: number;
};

function normalizeSubject(subject?: string): string {
  return (subject ?? "unknown-anime")
    .trim()
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "unknown-anime";
}

function hashSubject(value: string): number {
  let hash = 2166136261;

  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function createRandom(seed: number) {
  let value = seed || 1;

  return () => {
    value = (Math.imul(value, 1664525) + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function createDrawing(subject: string): Stroke[] {
  const id = normalizeSubject(subject);
  const random = createRandom(hashSubject(id));
  const strokes: Stroke[] = [];

  const add = (d: string, width = 2) => strokes.push({ d, width });

  // Draw recognizable objects first.
  if (id.includes("book") || id.includes("death-note")) {
    add("M30 28 L69 39 L110 26 L110 126 L69 140 L30 126 Z");
    add("M30 28 L69 42 L69 140 M110 26 L69 42");
    add("M40 54 L60 60 M40 66 L60 72 M40 78 L60 84");
    add("M78 56 L99 49 M78 69 L99 62 M78 82 L99 75");
    add("M45 105 L94 90");
    return strokes;
  }

  if (id.includes("ball") || id.includes("dragon-ball")) {
    add("M70 25 A45 45 0 1 1 69.9 25");
    const stars = id.includes("four-star") ? 4 : 1 + Math.floor(random() * 4);

    for (let i = 0; i < stars; i++) {
      const x = 52 + (i % 2) * 30;
      const y = 52 + Math.floor(i / 2) * 30;
      add(`M${x} ${y - 7} L${x + 3} ${y - 2} L${x + 9} ${y} L${x + 3} ${y + 3} L${x} ${y + 9} L${x - 3} ${y + 3} L${x - 9} ${y} L${x - 3} ${y - 2} Z`, 1.5);
    }

    return strokes;
  }

  if (id.includes("sword") || id.includes("nichirin")) {
    add("M29 117 L101 35 L109 42 L37 124 Z");
    add("M29 117 L20 126 L28 134 L37 124 Z");
    add("M19 123 L31 135 M22 119 L35 131 M27 115 L39 127");
    add("M101 35 L108 25 L116 32 L109 42");
    return strokes;
  }

  if (id.includes("kunai")) {
    add("M70 25 L91 59 L70 81 L49 59 Z");
    add("M70 81 L70 120");
    add("M62 120 L78 120 L78 133 L62 133 Z");
    add("M70 127 A8 8 0 1 1 69.9 127");
    return strokes;
  }

  if (id.includes("volleyball")) {
    add("M70 25 A43 43 0 1 1 69.9 25");
    add("M40 38 Q70 58 100 38");
    add("M34 73 Q70 88 106 73");
    add("M57 28 Q42 70 57 112");
    add("M83 28 Q98 70 83 112");
    return strokes;
  }

  if (id.includes("license") || id.includes("emblem") || id.includes("banner")) {
    add("M27 34 L113 34 L113 116 L27 116 Z");
    add("M36 43 L104 43 L104 107 L36 107 Z");
    add("M48 60 L92 60 M48 73 L92 73 M48 86 L81 86");
    add("M70 46 L70 56 M64 51 L76 51");
    return strokes;
  }

  if (id.includes("game-boy") || id.includes("gameboy")) {
    add("M45 16 Q40 16 40 24 L40 138 Q40 146 48 146 L92 146 Q100 146 100 138 L100 24 Q100 16 92 16 Z");
    add("M50 31 L90 31 L90 63 L50 63 Z");
    add("M51 91 L69 91 M60 82 L60 108");
    add("M81 90 A5 5 0 1 1 80.9 90");
    add("M92 102 A5 5 0 1 1 91.9 102");
    return strokes;
  }

  if (id.includes("gamecube")) {
    add("M39 40 L91 40 L111 57 L111 111 L58 111 L39 94 Z");
    add("M39 40 L58 57 L111 57 M58 57 L58 111");
    add("M58 57 L91 40 L111 57 L76 75 Z");
    add("M76 75 L76 103 M86 88 L99 88");
    return strokes;
  }

  if (id.includes("ship") || id.includes("going-merry") || id.includes("thousand-sunny")) {
    add("M17 105 L123 105 L103 132 L39 132 Z");
    add("M68 105 L68 27 L72 27 L72 105");
    add("M72 34 L102 72 L72 72 Z");
    add("M64 47 L39 77 L64 77 Z");
    add("M24 105 L115 105 M42 139 L99 139");

    if (id.includes("sunny")) {
      add("M60 27 L70 13 L80 27 M64 19 L76 19");
    }

    if (id.includes("merry")) {
      add("M66 34 L53 21 L43 35 L54 41");
    }

    return strokes;
  }

  if (id.includes("capsule")) {
    add("M48 35 A20 20 0 0 1 88 35 L101 103 A20 20 0 0 1 61 111 Z");
    add("M48 35 L101 103");
    add("M51 63 L89 92");
    return strokes;
  }

  if (id.includes("bean") || id.includes("senzu")) {
    add("M44 103 Q25 70 52 43 Q74 25 91 48 Q112 80 82 107 Q62 123 44 103 Z");
    add("M43 103 Q68 81 91 48");
    return strokes;
  }

  if (id.includes("gear")) {
    add("M49 33 L60 24 L79 24 L90 33 L101 32 L109 45 L104 57 L110 70 L104 84 L109 96 L96 106 L84 101 L70 110 L56 102 L44 107 L33 96 L37 83 L29 70 L36 57 L31 45 L42 33 Z");
    add("M70 43 A27 27 0 1 1 69.9 43");
    add("M70 54 A16 16 0 1 1 69.9 54");
    return strokes;
  }

  if (id.includes("radar")) {
    add("M35 30 L105 30 L105 119 L35 119 Z");
    add("M45 40 L95 40 L95 94 L45 94 Z");
    add("M70 67 L70 42 M70 67 L91 80 M70 67 L51 83");
    add("M51 104 L89 104 M60 112 L80 112");
    return strokes;
  }

  // Deterministic character sketch. Each subject ID produces its own variation.
  const hairStyle = Math.floor(random() * 5);
  const faceWidth = 25 + Math.floor(random() * 9);
  const faceTop = 45 + Math.floor(random() * 8);
  const faceBottom = 88 + Math.floor(random() * 8);
  const eyeY = 64 + Math.floor(random() * 5);
  const eyeGap = 9 + Math.floor(random() * 5);
  const eyeStyle = Math.floor(random() * 3);
  const hairHeight = 15 + Math.floor(random() * 18);
  const center = 70;

  if (hairStyle === 0) {
    add(`M${center - faceWidth} ${faceTop + 4} L${center - faceWidth - 7} ${faceTop - hairHeight} L${center - 12} ${faceTop - 3} L${center - 3} ${faceTop - hairHeight - 12} L${center + 7} ${faceTop - 2} L${center + 22} ${faceTop - hairHeight} L${center + faceWidth + 5} ${faceTop + 4} L${center + faceWidth - 3} ${faceBottom - 9} Q${center} ${faceBottom + 17} ${center - faceWidth + 3} ${faceBottom - 9} Z`);
  } else if (hairStyle === 1) {
    add(`M${center - faceWidth} ${faceTop + 8} Q${center - faceWidth - 8} ${faceTop - 25} ${center} ${faceTop - hairHeight} Q${center + faceWidth + 8} ${faceTop - 25} ${center + faceWidth} ${faceTop + 8} L${center + faceWidth - 3} ${faceBottom - 9} Q${center} ${faceBottom + 17} ${center - faceWidth + 3} ${faceBottom - 9} Z`);
  } else if (hairStyle === 2) {
    add(`M${center - faceWidth} ${faceTop + 8} L${center - faceWidth - 9} ${faceTop - 12} L${center - 10} ${faceTop - hairHeight} L${center} ${faceTop - 4} L${center + 15} ${faceTop - hairHeight - 7} L${center + faceWidth + 9} ${faceTop - 9} L${center + faceWidth} ${faceTop + 8} L${center + faceWidth - 3} ${faceBottom - 9} Q${center} ${faceBottom + 17} ${center - faceWidth + 3} ${faceBottom - 9} Z`);
  } else if (hairStyle === 3) {
    add(`M${center - faceWidth} ${faceTop + 12} Q${center - faceWidth - 8} ${faceTop - 15} ${center} ${faceTop - hairHeight} Q${center + faceWidth + 8} ${faceTop - 15} ${center + faceWidth} ${faceTop + 12} L${center + faceWidth - 3} ${faceBottom - 9} Q${center} ${faceBottom + 17} ${center - faceWidth + 3} ${faceBottom - 9} Z`);
    add(`M${center - faceWidth + 4} ${faceTop + 10} Q${center} ${faceTop + 24} ${center + faceWidth - 3} ${faceTop + 5}`, 1.5);
  } else {
    add(`M${center - faceWidth} ${faceTop + 7} L${center - faceWidth - 5} ${faceTop - 8} L${center - 12} ${faceTop - hairHeight} L${center} ${faceTop - 10} L${center + 16} ${faceTop - hairHeight - 5} L${center + faceWidth + 7} ${faceTop - 6} L${center + faceWidth} ${faceTop + 7} L${center + faceWidth - 3} ${faceBottom - 9} Q${center} ${faceBottom + 17} ${center - faceWidth + 3} ${faceBottom - 9} Z`);
  }

  const strandCount = 2 + Math.floor(random() * 4);

  for (let i = 0; i < strandCount; i++) {
    const x = 49 + Math.floor(random() * 42);
    const y = faceTop - 3 + Math.floor(random() * 8);
    const bend = Math.floor(random() * 14) - 7;
    add(`M${x} ${y} Q${x + bend} ${y + 12} ${x + bend / 2} ${y + 20}`, 1.4);
  }

  // Face, ears and eyes.
  add(`M${center - faceWidth + 3} ${faceTop + 10} Q${center - faceWidth - 1} ${faceTop + 30} ${center - faceWidth + 5} ${faceBottom - 10} Q${center} ${faceBottom + 15} ${center + faceWidth - 5} ${faceBottom - 10} Q${center + faceWidth + 1} ${faceTop + 30} ${center + faceWidth - 3} ${faceTop + 10}`, 1.7);
  add(`M${center - faceWidth + 3} ${faceTop + 30} Q${center - faceWidth - 7} ${faceTop + 26} ${center - faceWidth + 2} ${faceTop + 43}`, 1.5);
  add(`M${center + faceWidth - 3} ${faceTop + 30} Q${center + faceWidth + 7} ${faceTop + 26} ${center + faceWidth - 2} ${faceTop + 43}`, 1.5);

  if (eyeStyle === 0) {
    add(`M${center - eyeGap - 8} ${eyeY} Q${center - eyeGap} ${eyeY - 6} ${center - eyeGap + 7} ${eyeY} M${center + eyeGap - 7} ${eyeY} Q${center + eyeGap} ${eyeY - 6} ${center + eyeGap + 8} ${eyeY}`);
  } else if (eyeStyle === 1) {
    add(`M${center - eyeGap - 7} ${eyeY - 3} L${center - eyeGap + 6} ${eyeY} L${center - eyeGap - 5} ${eyeY + 4} Z`);
    add(`M${center + eyeGap - 6} ${eyeY} L${center + eyeGap + 7} ${eyeY - 3} L${center + eyeGap + 5} ${eyeY + 4} Z`);
  } else {
    add(`M${center - eyeGap - 7} ${eyeY} L${center - eyeGap + 6} ${eyeY}`);
    add(`M${center + eyeGap - 6} ${eyeY} L${center + eyeGap + 7} ${eyeY}`);
  }

  add(`M70 ${eyeY + 4} L${68 + Math.floor(random() * 5)} ${eyeY + 15}`);
  add(`M${64 + Math.floor(random() * 4)} ${eyeY + 24} Q70 ${eyeY + 28 + Math.floor(random() * 4)} ${77 + Math.floor(random() * 4)} ${eyeY + 23}`, 1.5);

  // Neck and jacket.
  add(`M${59 + Math.floor(random() * 3)} ${faceBottom - 2} L58 117 L70 128 L83 117 L${80 + Math.floor(random() * 3)} ${faceBottom - 2}`);
  add("M58 116 L42 124 L25 151 L47 159 L70 145 L93 159 L115 151 L98 124 L82 116");
  add("M58 117 L70 135 L82 117", 1.5);

  // Subject-specific details.
  if (id.includes("luffy") || id.includes("monkey-d")) {
    add("M43 39 Q70 27 97 39 M43 39 L48 47 M97 39 L92 47");
    add("M53 83 Q70 93 87 83", 1.5);
    add("M48 132 L92 132", 1.5);
  } else if (id.includes("naruto")) {
    add("M43 55 L56 60 L43 65 M56 60 L43 60");
    add("M84 55 L97 60 L84 65 M97 60 L84 60");
    add("M48 43 L92 43 M50 47 L90 47", 1.5);
  } else if (id.includes("tanjiro")) {
    add("M45 44 L56 48 L50 54 L60 56");
    add("M87 42 L96 49 L88 54");
    add("M52 132 L62 140 L57 148");
  } else if (id.includes("killua")) {
    add("M49 46 L59 52 L65 44 M81 44 L89 51 L96 43");
    add("M52 91 Q70 99 88 91");
  } else if (id.includes("vegeta") || id.includes("goku")) {
    add("M39 40 L51 45 L58 33 M62 32 L71 42 L82 30 L94 40");
    add("M50 132 L70 144 L91 132");
  } else if (id.includes("senku")) {
    add("M43 38 L55 28 L65 40 L75 28 L85 39 L97 30");
    add("M48 50 L61 55 M79 55 L92 50");
  } else if (id.includes("hisoka")) {
    add("M55 45 L65 52 L55 58 Z M85 45 L75 52 L85 58 Z");
    add("M64 78 L70 82 L76 78");
  } else if (id.includes("kakashi")) {
    add("M43 51 L97 51 M46 52 L51 70 L88 70 L94 52");
    add("M47 132 L70 148 L93 132");
  } else {
    const markCount = 2 + Math.floor(random() * 3);

    for (let i = 0; i < markCount; i++) {
      const x = 43 + Math.floor(random() * 54);
      const y = 107 + Math.floor(random() * 24);
      const length = 4 + Math.floor(random() * 10);
      add(`M${x} ${y} l${length} ${-3 + Math.floor(random() * 7)}`, 1.3);
    }
  }

  // Small unique signature for this puzzle.
  const signature = hashSubject(id);
  const sx = 19 + (signature % 14);
  const sy = 19 + ((signature >>> 5) % 12);
  add(`M${sx} ${sy} l5 -3 l4 4 l-5 3 Z`, 1.1);

  return strokes;
}

export function ProgressiveSketch({
  subject,
  replayKey = "",
  onComplete,
  className = "",
}: ProgressiveSketchProps) {
  const safeSubject = subject ?? "unknown-anime";
  const normalized = normalizeSubject(safeSubject);

  const [visibleCount, setVisibleCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const completionRef = useRef(onComplete);

  useEffect(() => {
    completionRef.current = onComplete;
  }, [onComplete]);

  const strokes = useMemo(() => createDrawing(normalized), [normalized]);

  useEffect(() => {
    setVisibleCount(0);
    setFinished(false);

    let count = 0;

    const interval = window.setInterval(() => {
      count += 1;
      setVisibleCount(count);

      if (count >= strokes.length) {
        window.clearInterval(interval);
        setFinished(true);
        completionRef.current?.();
      }
    }, 170);

    return () => window.clearInterval(interval);
  }, [strokes, normalized, replayKey]);

  return (
    <div
      key={`${replayKey}-${normalized}`}
      className={`relative flex w-full items-center justify-center overflow-hidden bg-black ${className}`}
      style={{ minHeight: 260 }}
      aria-label={`Progressive line-art sketch of ${safeSubject}`}
      role="img"
    >
      <svg
        viewBox="0 0 140 170"
        className="block w-full max-w-sm"
        style={{ height: "auto", minHeight: 240, maxHeight: 360 }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {strokes.slice(0, visibleCount).map((stroke, index) => (
          <path
            key={`${normalized}-${index}`}
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

export default ProgressiveSketch;
