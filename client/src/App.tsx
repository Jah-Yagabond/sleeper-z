import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { Activity, Flame, Gauge, Home as HomeIcon, ListChecks, Menu, Trophy, X, Zap } from "lucide-react";
import Home from "./pages/Home";
import Quizzes from "./pages/Quizzes";
import Leaderboard from "./pages/Leaderboard";
import Support from "./pages/Support";
import WhatsThatAnime from "./pages/WhatsThatAnime";
import NotFound from "./pages/NotFound";
import { SleeperLogo } from "./components/SleeperLogo";
import {
  CompletionPayload,
  CompletionResult,
  getLevelFromXp,
  getLevelPercent,
  getTodayKey,
  initialProgress,
  Progress,
  XP_PER_LEVEL,
} from "./lib/game";

const STORAGE_KEY = "sleeper-z-progress-v1";

function readProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialProgress;
    const parsed = JSON.parse(raw) as Partial<Progress>;
    return {
      ...initialProgress,
      ...parsed,
      xp: typeof parsed.xp === "number" ? parsed.xp : initialProgress.xp,
      level: getLevelFromXp(typeof parsed.xp === "number" ? parsed.xp : initialProgress.xp),
      achievements: Array.isArray(parsed.achievements) ? parsed.achievements : [],
      completedChallenges: Array.isArray(parsed.completedChallenges) ? parsed.completedChallenges : [],
    };
  } catch {
    return initialProgress;
  }
}

function NavItem({ href, label, icon: Icon, onNavigate }: { href: string; label: string; icon: typeof HomeIcon; onNavigate: () => void }) {
  const [location] = useLocation();
  const active = href === "/" ? location === "/" : location.startsWith(href);
  return (
    <Link href={href} onClick={onNavigate} className={`nav-item ${active ? "is-active" : ""}`} aria-current={active ? "page" : undefined}>
      <Icon size={17} strokeWidth={1.8} />
      <span>{label}</span>
      {active && <i className="nav-pip" aria-hidden="true" />}
    </Link>
  );
}

export default function App() {
  const [location, navigate] = useLocation();
  const [progress, setProgress] = useState<Progress>(initialProgress);
  const [ready, setReady] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setProgress(readProgress());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress, ready]);

  const levelPercent = getLevelPercent(progress.xp);
  const nextLevelXp = XP_PER_LEVEL - (progress.xp % XP_PER_LEVEL);

  const completeChallenge = useCallback((payload: CompletionPayload): CompletionResult => {
    const today = getTodayKey();
    const beforeLevel = progress.level;
    const nextXp = progress.xp + payload.earnedXp;
    const nextLevel = getLevelFromXp(nextXp);
    const unlocked = new Set(progress.achievements);
    if (payload.score > 0) unlocked.add("first-win");
    if (payload.score === payload.total) unlocked.add("flawless");
    const nextStreak = progress.lastPlayed === today ? progress.streak : progress.streak + 1;
    if (nextStreak >= 3) unlocked.add("on-fire");
    if (payload.challengeId === "daily") unlocked.add("daily-discipline");
    const result: CompletionResult = {
      earnedXp: payload.earnedXp,
      newLevel: nextLevel,
      leveledUp: nextLevel > beforeLevel,
      unlocked: [...unlocked].filter((item) => !progress.achievements.includes(item)),
    };
    setProgress((current) => {
      const currentUnlocked = new Set(current.achievements);
      if (payload.score > 0) currentUnlocked.add("first-win");
      if (payload.score === payload.total) currentUnlocked.add("flawless");
      const currentStreak = current.lastPlayed === today ? current.streak : current.streak + 1;
      if (currentStreak >= 3) currentUnlocked.add("on-fire");
      if (payload.challengeId === "daily") currentUnlocked.add("daily-discipline");
      return {
        ...current,
        xp: current.xp + payload.earnedXp,
        level: getLevelFromXp(current.xp + payload.earnedXp),
        streak: currentStreak,
        lastPlayed: today,
        dailyCompletedDate: payload.challengeId === "daily" ? today : current.dailyCompletedDate,
        achievements: [...currentUnlocked],
        completedChallenges: current.completedChallenges.includes(payload.challengeId)
          ? current.completedChallenges
          : [...current.completedChallenges, payload.challengeId],
      };
    });
    return result;
  }, [progress]);

  const updateDisplayName = useCallback((displayName: string) => {
    setProgress((current) => ({ ...current, displayName: displayName.trim().slice(0, 16).toUpperCase() || "KAI" }));
  }, []);

  const content = useMemo(() => {
    if (location === "/") return <Home progress={progress} onStart={(id) => navigate(`/quizzes?challenge=${id}`)} />;
    if (location.startsWith("/quizzes")) return <Quizzes progress={progress} onComplete={completeChallenge} onNavigate={navigate} />;
    if (location === "/whats-that-anime") return <WhatsThatAnime progress={progress} onComplete={completeChallenge} onNavigate={navigate} />;
    if (location === "/leaderboard") return <Leaderboard progress={progress} onDisplayNameChange={updateDisplayName} />;
    if (location === "/support") return <Support />;
    if (location === "/404") return <NotFound />;
    return <NotFound />;
  }, [completeChallenge, location, navigate, progress, updateDisplayName]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? "is-open" : ""}`}>
        <div className="brand-lockup">
          <Link href="/" className="brand-mark" onClick={closeMobile} aria-label="Sleeper-Z home">
            <SleeperLogo variant="header" />
          </Link>
          <span className="brand-subtitle">ANIME QUIZ DOJO / 001</span>
        </div>
        <div className="sidebar-rule" />
        <nav className="primary-nav" aria-label="Primary navigation">
          <p className="nav-label">COMMAND DECK</p>
          <NavItem href="/" label="Home" icon={HomeIcon} onNavigate={closeMobile} />
          <NavItem href="/quizzes" label="Quizzes" icon={ListChecks} onNavigate={closeMobile} />
          <NavItem href="/whats-that-anime" label="WHAT’S THAT ANIME?" icon={Zap} onNavigate={closeMobile} />
          <NavItem href="/leaderboard" label="Leaderboard" icon={Trophy} onNavigate={closeMobile} />
          <NavItem href="/support" label="Support" icon={Activity} onNavigate={closeMobile} />
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-status"><span className="status-dot" /> SYSTEM ONLINE <span className="status-code">v1.0</span></div>
          <div className="side-streak"><Flame size={16} /><span><strong>{progress.streak} day</strong> streak</span></div>
          <p className="sidebar-note">Train with intent.<br />Rest without guilt.</p>
        </div>
      </aside>
      {mobileOpen && <button className="mobile-scrim" aria-label="Close menu" onClick={closeMobile} />}
      <div className="app-main-wrap">
        <header className="mobile-header">
          <Link href="/" className="mobile-brand" onClick={closeMobile} aria-label="Sleeper-Z home"><SleeperLogo variant="header" /></Link>
          <button className="icon-button" onClick={() => setMobileOpen((open) => !open)} aria-label={mobileOpen ? "Close navigation" : "Open navigation"}>{mobileOpen ? <X size={20} /> : <Menu size={20} />}</button>
        </header>
        <main className="app-main">
          <div className="topbar">
            <div className="topbar-path"><span className="topbar-dot" /> LIVE TRAINING / {location === "/" ? "HOME" : location.slice(1).toUpperCase()}</div>
            <div className="topbar-meta"><span>PROGRESS SAVED LOCALLY</span><span className="topbar-level"><Gauge size={14} /> LVL {progress.level}</span></div>
          </div>
          {content}
        </main>
        <footer className="site-footer"><span>SLEEPER-Z / TRAIN SMARTER, NOT LONGER</span><span>© 2026 / ORIGINAL QUIZ CONTENT</span></footer>
      </div>
      <div className="xp-dock" aria-label="Current progress">
        <div className="xp-dock__row"><span>LEVEL {progress.level}</span><strong>{progress.xp} XP</strong></div>
        <div className="xp-track"><span style={{ width: `${levelPercent}%` }} /></div>
        <div className="xp-dock__caption"><span>{nextLevelXp} XP to next rank</span><Zap size={12} /></div>
      </div>
    </div>
  );
}
