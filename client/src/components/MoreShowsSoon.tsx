import { ArrowUpRight, Sparkles } from "lucide-react";
import { SleeperVideo } from "./SleeperVideo";

type MoreShowsSoonProps = { onExplore: () => void };

export function MoreShowsSoon({ onExplore }: MoreShowsSoonProps) {
  return <section className="more-shows" aria-labelledby="more-shows-title">
    <div className="more-shows__texture"><SleeperVideo src="/assets/impact-text.mp4" label="IMPACT" /></div>
    <div className="more-shows__burst more-shows__burst--one" />
    <div className="more-shows__burst more-shows__burst--two" />
    <div className="more-shows__copy">
      <p className="eyebrow"><Sparkles size={13} /> SLEEPER-Z TRANSMISSION / NEXT WAVE</p>
      <h2 id="more-shows-title"><span>MORE</span> SHOWS<br /><b>SOON.</b></h2>
      <p className="more-shows__lede">New quiz worlds are charging into the dojo. Keep your recall sharp — the next drop is already in motion.</p>
      <button className="more-shows__action" type="button" onClick={onExplore}>REPLAY THE CURRENT CATALOG <ArrowUpRight size={15} /></button>
    </div>
    <div className="more-shows__stamp" aria-hidden="true"><span>COMING</span><strong>SOON</strong><i /></div>
  </section>;
}
