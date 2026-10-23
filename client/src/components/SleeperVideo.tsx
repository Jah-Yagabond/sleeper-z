import type { CSSProperties } from "react";

type SleeperVideoProps = {
  src: string;
  label: string;
  className?: string;
  style?: CSSProperties;
};

export function SleeperVideo({ src, label, className = "", style }: SleeperVideoProps) {
  return (
    <span className={`sleeper-video ${className}`} aria-hidden="true" style={style}>
      <video
        className="sleeper-video__clip"
        src={src}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-label={`${label} supplied text animation`}
      />
      <span className="sleeper-video__fallback">{label}</span>
    </span>
  );
}
