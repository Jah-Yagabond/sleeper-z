import { useState } from "react";
import { Check, Crown, Medal, Pencil, Shield, Trophy, Users } from "lucide-react";
import { getLevelFromXp, Progress } from "../lib/game";

type LeaderboardProps = { progress: Progress; onDisplayNameChange: (name: string) => void };

export default function Leaderboard({ progress, onDisplayNameChange }: LeaderboardProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(progress.displayName);
  const saveName = () => { onDisplayNameChange(draft); setEditing(false); };
  const slots = ["OPEN RANK", "OPEN RANK", "OPEN RANK", "OPEN RANK"];

  return (
    <div className="page page-leaderboard">
      <section className="page-intro">
        <div>
          <p className="eyebrow">THE CLIMB / <span>03</span></p>
          <h1>CLIMB THE<br /><span>LEADERBOARD.</span></h1>
        </div>
        <p className="page-intro__copy">
          Competition is more useful when the rules are visible. This preview tracks your local run now; real shared standings need account identity and a production data layer.
        </p>
      </section>

      <div className="leaderboard-layout">
        <section className="rank-panel">
          <div className="rank-panel__head">
            <div>
              <p className="eyebrow">SEASON 001 / PREVIEW BOARD</p>
              <h2>LOCAL DOJO<br /><span>STANDINGS.</span></h2>
            </div>
            <div className="rank-season"><Crown size={17} /> OPEN SEASON</div>
          </div>

          <div className="rank-table-head">
            <span>RANK</span><span>PLAYER</span><span>LEVEL</span><span>XP</span>
          </div>

          <div className="rank-row rank-row--you">
            <span className="rank-number"><Crown size={15} /> 01</span>
            <span className="rank-player">
              <span className="avatar avatar--you">{progress.displayName.slice(0, 1)}</span>
              <span><strong>{progress.displayName}</strong><small>YOUR LOCAL SESSION</small></span>
            </span>
            <span className="rank-level">LVL {getLevelFromXp(progress.xp)}</span>
            <strong className="rank-xp">{progress.xp} XP</strong>
          </div>

          {slots.map((slot, index) => (
            <div className="rank-row rank-row--empty" key={index}>
              <span className="rank-number">0{index + 2}</span>
              <span className="rank-player">
                <span className="avatar avatar--empty"><Users size={15} /></span>
                <span><strong>{slot}</strong><small>SYNCED ACCOUNT REQUIRED</small></span>
              </span>
              <span className="rank-level">—</span>
              <strong className="rank-xp">—</strong>
            </div>
          ))}

          <div className="rank-panel__foot">
            <Crown size={14} /> Shared rankings are intentionally not fabricated in this preview.
          </div>
        </section>

        <aside className="leaderboard-side">
          <div className="profile-card">
            <div className="profile-card__top">
              <span className="eyebrow">YOUR CALLSIGN</span>
              <Pencil size={14} />
            </div>

            {editing ? (
              <div className="name-edit">
                <input value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={16} autoFocus />
                <button onClick={saveName}><Check size={15} /></button>
              </div>
            ) : (
              <button className="profile-name" onClick={() => { setDraft(progress.displayName); setEditing(true); }}>
                {progress.displayName}<Pencil size={14} />
              </button>
            )}

            <div className="profile-card__meta">
              <span><Trophy size={14} /> LVL {progress.level}</span>
              <span><Shield size={14} /> {progress.achievements.length}/4 BADGES</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}