
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  CircleAlert,
  Clock3,
  Flame,
  LockKeyhole,
  RotateCcw,
  Trophy,
  X,
} from "lucide-react";
import { SleeperVideo } from "../components/SleeperVideo";
import {
  createDailyDojoState,
  getDailyDate,
  getDailyDojoQuestions,
  readDailyDojoState,
  saveDailyDojoState,
  type DailyDojoState,
} from "../lib/daily";
import {
  ChallengeId,
  challengeCatalog,
  CompletionResult,
  getChallenge,
  Progress,
  type Question,
} from "../lib/game";
import { getSeries, seriesCatalog, type SeriesInfo } from "../lib/seriesBanks";
import { useLocation } from "wouter";

type QuizzesProps = {
  progress: Progress;
  onComplete: (payload: {
    challengeId: ChallengeId;
    score: number;
    total: number;
    earnedXp: number;
  }) => CompletionResult;
  onNavigate: (path: string) => void;
};

type ResultState = {
  challenge: ChallengeId;
  score: number;
  total: number;
  earnedXp: number;
  completion: CompletionResult;
};

function nextResetLabel() {
  const tomorrow = new Date();
  tomorrow.setUTCHours(24, 0, 0, 0);
  return tomorrow.toLocaleString([], {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

export default function Quizzes({
  progress,
  onComplete,
  onNavigate,
}: QuizzesProps) {
  const [location] = useLocation();

  const params = new URLSearchParams(
    typeof window === "undefined"
      ? location.split("?")[1] ?? ""
      : window.location.search,
  );

  const queryChallenge = params.get("challenge");
  const querySeries = params.get("series");

  const knownQueryChallenge =
    queryChallenge &&
    challengeCatalog.some((item) => item.id === queryChallenge)
      ? queryChallenge
      : null;

  const knownQuerySeries =
    querySeries && seriesCatalog.some((item) => item.id === querySeries)
      ? querySeries
      : null;

  const today = getDailyDate();

  const [challengeId, setChallengeId] = useState<ChallengeId>(
    knownQueryChallenge ?? "daily",
  );
  const [selectedSeriesId, setSelectedSeriesId] = useState<string | null>(
    knownQuerySeries,
  );
  const [dailyState, setDailyState] = useState<DailyDojoState | null>(() =>
    readDailyDojoState(today),
  );
  const [started, setStarted] = useState(
    Boolean(knownQueryChallenge && knownQueryChallenge !== "daily"),
  );
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState<ResultState | null>(null);
  const [dailyCompletion, setDailyCompletion] =
    useState<CompletionResult | null>(null);

  const isDaily = challengeId === "daily";
  const challenge = useMemo(() => getChallenge(challengeId), [challengeId]);

  const dailyQuestions = useMemo(() => {
    const questions = getDailyDojoQuestions(today);

    if (!dailyState) return questions;

    const byId = new Map(questions.map((question) => [question.id, question]));

    return dailyState.questionIds
      .map((id) => byId.get(id))
      .filter((question): question is Question => Boolean(question));
  }, [dailyState, today]);

  const activeChallenge = isDaily
    ? {
        ...challenge,
        title: "Daily Dojo",
        subtitle: "15 source-linked reads. Same UTC challenge for everyone.",
        category: "DAILY / 15 QUESTIONS",
        duration: "15 min",
        xp: 100,
        questions: dailyQuestions,
      }
    : challenge;

  const question = activeChallenge.questions[questionIndex];

  const correct = selected === question?.answer;

  const progressPercent = activeChallenge.questions.length
    ? ((questionIndex + (locked ? 1 : 0)) /
        activeChallenge.questions.length) *
      100
    : 0;

  useEffect(() => {
    if (knownQueryChallenge) {
      setChallengeId(knownQueryChallenge);
      setStarted(knownQueryChallenge !== "daily");
      setResult(null);
    } else if (knownQuerySeries) {
      setSelectedSeriesId(knownQuerySeries);
      setStarted(false);
      setResult(null);
    } else if (!querySeries) {
      setSelectedSeriesId(null);
      setStarted(false);
    }
  }, [knownQueryChallenge, knownQuerySeries, querySeries]);

  const selectSeries = (id: string) => {
    setSelectedSeriesId(id);
    setChallengeId("daily");
    setStarted(false);
    setResult(null);
    onNavigate(`/quizzes?series=${id}`);
  };

  const selectChallenge = (id: string) => {
    setChallengeId(id);
    setStarted(true);
    setResult(null);
    setQuestionIndex(0);
    setSelected(null);
    setLocked(false);
    setScore(0);
    onNavigate(`/quizzes?challenge=${id}`);
  };

  const beginDaily = () => {
    const next = dailyState ?? createDailyDojoState(today);

    setDailyState(next);
    saveDailyDojoState(next);
    setChallengeId("daily");
    setQuestionIndex(next.currentIndex);
    setScore(next.score);
    setSelected(next.answers[next.questionIds[next.currentIndex]] ?? null);
    setLocked(false);
    setStarted(true);
    onNavigate("/quizzes?challenge=daily");
  };

  const backToShows = () => {
    setSelectedSeriesId(null);
    setStarted(false);
    setResult(null);
    onNavigate("/quizzes");
  };

  const backToUnits = () => {
    setStarted(false);
    setResult(null);
    setSelectedSeriesId(challenge.seriesId ?? null);
    onNavigate(
      challenge.seriesId
        ? `/quizzes?series=${challenge.seriesId}`
        : "/quizzes",
    );
  };

  const restart = () => {
    if (isDaily) {
      beginDaily();
      return;
    }

    setResult(null);
    setQuestionIndex(0);
    setSelected(null);
    setLocked(false);
    setScore(0);
    setStarted(true);
  };

  const lockAnswer = () => {
    if (selected === null || !question) return;

    setLocked(true);

    if (isDaily && dailyState) {
      const next = {
        ...dailyState,
        answers: { ...dailyState.answers, [question.id]: selected },
      };

      setDailyState(next);
      saveDailyDojoState(next);
    }
  };

  const goNext = () => {
    if (!question) return;

    const nextScore = score + (correct ? 1 : 0);

    if (questionIndex === activeChallenge.questions.length - 1) {
      const earnedXp = isDaily
        ? 100 + nextScore * 8
        : activeChallenge.xp +
          nextScore * 12 +
          (nextScore === activeChallenge.questions.length ? 30 : 0);

      if (isDaily && dailyState) {
        const next = {
          ...dailyState,
          score: nextScore,
          currentIndex: questionIndex,
          completed: true,
          rewarded: true,
          earnedXp,
        };

        setDailyState(next);
        saveDailyDojoState(next);

        if (!dailyState.rewarded) {
          setDailyCompletion(
            onComplete({
              challengeId: "daily",
              score: nextScore,
              total: activeChallenge.questions.length,
              earnedXp,
            }),
          );
        }

        setStarted(false);
        return;
      }

      const completion = onComplete({
        challengeId: activeChallenge.id,
        score: nextScore,
        total: activeChallenge.questions.length,
        earnedXp,
      });

      setResult({
        challenge: activeChallenge.id,
        score: nextScore,
        total: activeChallenge.questions.length,
        earnedXp,
        completion,
      });

      return;
    }

    setScore(nextScore);
    setQuestionIndex((index) => index + 1);
    setSelected(null);
    setLocked(false);

    if (isDaily && dailyState) {
      const next = {
        ...dailyState,
        score: nextScore,
        currentIndex: questionIndex + 1,
      };

      setDailyState(next);
      saveDailyDojoState(next);
    }
  };

  if (result) {
    return (
      <QuizResult
        result={result}
        onRestart={restart}
        onLeaderboard={() => onNavigate("/leaderboard")}
        onBack={backToUnits}
      />
    );
  }

  // Only show the Daily Dojo gate when Daily Dojo was explicitly requested.
  if (isDaily && !started && queryChallenge === "daily") {
    return (
      <DailyDojoGate
        state={dailyState}
        onStart={beginDaily}
        onHome={() => onNavigate("/")}
        onImage={() => onNavigate("/whats-that-anime")}
      />
    );
  }

  if (!started) {
    return (
      <div className="page page-quizzes">
        <section className="page-intro">
          <div>
            <p className="eyebrow">
              THE ARENA / <span>02</span>
            </p>
            <h1>
              CHOOSE YOUR
              <br />
              <span>CHALLENGE.</span>
            </h1>
          </div>
          <p className="page-intro__copy">
            Pick a series first. Then choose one of five focused units so every
            run has a clear scope and a fair spoiler boundary.
          </p>
        </section>

        {!selectedSeriesId ? (
          <SeriesPicker onSelect={selectSeries} />
        ) : (
          <UnitPicker
            series={getSeries(selectedSeriesId)}
            progress={progress}
            onSelect={selectChallenge}
            onBack={backToShows}
          />
        )}
      </div>
    );
  }

  return (
    <div className="page page-quizzes">
      <div className="quiz-shell">
        <div className="quiz-topline">
          <button
            className="back-link"
            onClick={isDaily ? () => onNavigate("/") : backToUnits}
          >
            <ArrowLeft size={15} />
            {isDaily
              ? "Back to home"
              : challenge.seriesId
                ? "Back to units"
                : "All challenges"}
          </button>

          <span className="quiz-id">
            RUN / {activeChallenge.category} /{" "}
            {String(questionIndex + 1).padStart(2, "0")}
          </span>

          <span className="quiz-timer">
            <Clock3 size={14} /> SELF-PACED
          </span>
        </div>

        <div className="quiz-progress">
          <span style={{ width: `${progressPercent}%` }} />
        </div>

        <div className="quiz-heading">
          <div>
            <p
              className={`challenge-pill challenge-pill--${activeChallenge.accent}`}
            >
              {activeChallenge.category} / +{activeChallenge.xp} BASE XP
            </p>

            <h2>{activeChallenge.title}</h2>

            {activeChallenge.spoilerLevel && (
              <p className="spoiler-label">
                SPOILERS: {activeChallenge.spoilerLevel}
              </p>
            )}

            {isDaily && (
              <p className="spoiler-label">
                UTC DATE: {today} · ORDER SAVED LOCALLY
              </p>
            )}
          </div>

          <div className="quiz-score">
            <small>RUN SCORE</small>
            <strong>
              {score}
              <span>/{activeChallenge.questions.length}</span>
            </strong>
          </div>
        </div>

        {question && (
          <QuizCard
            question={question}
            questionNumber={questionIndex + 1}
            selected={selected}
            locked={locked}
            correct={correct}
            onSelect={setSelected}
            onLock={lockAnswer}
            onNext={goNext}
            isLast={questionIndex === activeChallenge.questions.length - 1}
          />
        )}
      </div>
    </div>
  );
}

function DailyDojoGate({
  state,
  onStart,
  onHome,
  onImage,
}: {
  state: DailyDojoState | null;
  onStart: () => void;
  onHome: () => void;
  onImage: () => void;
}) {
  const complete = Boolean(state?.completed);

  return (
    <div className="page page-quizzes">
      <section className="page-intro">
        <div>
          <p className="eyebrow">
            <Flame size={14} /> DAILY DOJO / <span>UTC {getDailyDate()}</span>
          </p>
          <h1>
            DAILY
            <br />
            <span>DOJO.</span>
          </h1>
        </div>
        <p className="page-intro__copy">
          Exactly 15 questions, deterministically mixed from approved playable
          banks. Everyone gets the same order today.
        </p>
      </section>

      <section className="daily-gate">
        <div className="daily-gate__icon">
          <LockKeyhole size={30} />
        </div>

        <p className="eyebrow">
          {complete
            ? "COMPLETED TODAY"
            : state
              ? "RUN SAVED LOCALLY"
              : "READY CHECK"}
        </p>

        <h2>
          {complete
            ? `${state?.score}/15 CLEAN READS`
            : state
              ? "RESUME YOUR RUN."
              : "15 QUESTIONS. ONE UTC DAY."}
        </h2>

        <p>
          {complete
            ? `You earned +${state?.earnedXp} XP. The next Daily Dojo unlocks at ${nextResetLabel()}.`
            : state
              ? `Your question order and answers are saved on this browser. Continue from question ${(state?.currentIndex ?? 0) + 1}.`
              : "Start the UTC-seeded challenge. Refreshing or navigating away will not reroll the set."}
        </p>

        {!complete && (
          <button className="button button-primary" onClick={onStart}>
            {state ? "RESUME DAILY DOJO" : "START DAILY DOJO"}
            <ArrowRight size={16} />
          </button>
        )}

        {complete && (
          <button className="button button-outline" onClick={onHome}>
            BACK TO HOME
          </button>
        )}

        <button className="text-button" onClick={onImage}>
          Play WHAT’S THAT ANIME? <ArrowRight size={15} />
        </button>

        <small>
          <LockKeyhole size={12} /> Local browser enforcement only; cross-device
          identity requires a backend account.
        </small>
      </section>
    </div>
  );
}

function QuizCard({
  question,
  questionNumber,
  selected,
  locked,
  correct,
  onSelect,
  onLock,
  onNext,
  isLast,
}: {
  question: Question;
  questionNumber: number;
  selected: number | null;
  locked: boolean;
  correct: boolean;
  onSelect: (index: number) => void;
  onLock: () => void;
  onNext: () => void;
  isLast: boolean;
}) {
  return (
    <>
      <div className="quiz-card">
        <div className="quiz-card__number">
          Q{String(questionNumber).padStart(2, "0")}
        </div>

        <h3>{question.prompt}</h3>

        <div className="answer-grid">
          {question.options.map((option, index) => (
            <button
              key={option}
              className={`answer-option ${
                selected === index ? "is-selected" : ""
              } ${locked && index === question.answer ? "is-correct" : ""} ${
                locked && selected === index && index !== question.answer
                  ? "is-wrong"
                  : ""
              }`}
              onClick={() => !locked && onSelect(index)}
              disabled={locked}
            >
              <span className="answer-letter">
                {String.fromCharCode(65 + index)}
              </span>
              <span>{option}</span>
              {locked && index === question.answer && <Check size={17} />}
              {locked && selected === index && index !== question.answer && (
                <X size={17} />
              )}
            </button>
          ))}
        </div>

        {!locked ? (
          <div className="quiz-card__footer">
            <span className="helper-text">
              Select one answer, then lock your read.
            </span>
            <button
              className="button button-primary"
              onClick={onLock}
              disabled={selected === null}
            >
              LOCK ANSWER <ChevronRight size={16} />
            </button>
          </div>
        ) : (
          <div
            className={`feedback-panel ${correct ? "is-correct" : "is-wrong"}`}
          >
            <div className="feedback-icon">
              {correct ? <Check size={20} /> : <CircleAlert size={20} />}
            </div>

            <div>
              <strong>{correct ? "CLEAN READ." : "NOT THIS TIME."}</strong>
              <p>{question.explanation}</p>

              {question.source && (
                <a
                  className="question-source"
                  href={question.source.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  SOURCE:{" "}
                  {question.source.episodeTitle
                    ? `${question.source.episodeTitle} · `
                    : `EPISODE ${question.source.episode} · `}
                  {question.source.arc} ↗
                </a>
              )}

              {question.source?.status === "verified_secondary" && (
                <small className="source-review">
                  Verified with secondary episode and scene references; not a
                  primary transcript.
                </small>
              )}

              {question.source?.status?.includes("name_not_established") && (
                <small className="source-review">
                  The anime appearance is sourced; the ship name comes from
                  official reference material.
                </small>
              )}
            </div>

            <button className="button button-ghost" onClick={onNext}>
              {isLast ? "SEE RESULT" : "NEXT QUESTION"}
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>

      <div className="quiz-coach-note">
        <Flame size={15} />
        <span>
          Healthy loop: a miss is information. Keep the explanation, then move
          on.
        </span>
      </div>
    </>
  );
}

function SeriesPicker({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <div className="picker-shell">
      <div className="picker-banner">
        <div>
          <p className="eyebrow">
            READY CHECK / <span>SELECT A SERIES</span>
          </p>
          <h2>
            CHOOSE YOUR
            <br />
            <span>WORLD.</span>
          </h2>
        </div>
        <SleeperVideo
          src="/assets/impact-text.mp4"
          label="IMPACT"
          className="banner-video"
        />
      </div>

      <div className="picker-grid">
        {seriesCatalog.map((series, index) => (
          <button
            key={series.id}
            className={`picker-card picker-card--${series.accent} ${
              series.sourceStatus === "unavailable" ? "is-unavailable" : ""
            }`}
            onClick={() =>
              series.sourceStatus !== "unavailable" && onSelect(series.id)
            }
            disabled={series.sourceStatus === "unavailable"}
          >
            <span className="picker-card__index">
              {String(index + 1).padStart(2, "0")} / {series.category}
            </span>
            <strong>{series.title}</strong>
            <p>{series.subtitle}</p>
            <span className="picker-card__bottom">
              {series.units.length ? "5 UNITS / 75 QUESTIONS" : "CONTENT HOLD"}
              <span>
                {series.sourceStatus === "unavailable" ? "VERIFYING" : "OPEN"}
                <ChevronRight size={15} />
              </span>
            </span>
          </button>
        ))}
      </div>

      <p className="picker-footnote">
        Original question banks are scoped to released material. Fan-created
        continuities are labeled separately.
      </p>
    </div>
  );
}

function UnitPicker({
  series,
  progress,
  onSelect,
  onBack,
}: {
  series?: SeriesInfo;
  progress: Progress;
  onSelect: (id: string) => void;
  onBack: () => void;
}) {
  if (!series) return null;

  return (
    <div className="picker-shell">
      <div className="unit-picker-head">
        <button className="back-link" onClick={onBack}>
          <ArrowLeft size={15} /> All series
        </button>

        <div>
          <p className="eyebrow">
            SERIES LOCK / <span>{series.category}</span>
          </p>
          <h2>{series.title}</h2>
          <p>{series.adaptationBoundary}</p>
        </div>
      </div>

      <div className="unit-grid">
        {series.units.map((unit) => {
          const complete = progress.completedChallenges.includes(
            unit.challengeId,
          );

          return (
            <button
              key={unit.challengeId}
              className={`unit-card unit-card--${series.accent}`}
              onClick={() => onSelect(unit.challengeId)}
            >
              <span className="unit-card__number">UNIT {unit.unit}</span>
              <strong>{unit.title}</strong>
              <span className="unit-card__meta">
                {unit.spoilerLevel} · 15 QUESTIONS ·{" "}
                {complete ? "COMPLETE" : "READY"}
              </span>
              <span className="unit-card__arrow">
                <ChevronRight size={17} />
              </span>
            </button>
          );
        })}
      </div>

      <p className="picker-footnote">
        Each unit is isolated to {series.title}. Source references appear after
        every locked answer.
      </p>
    </div>
  );
}

function QuizResult({
  result,
  onRestart,
  onLeaderboard,
  onBack,
}: {
  result: ResultState;
  onRestart: () => void;
  onLeaderboard: () => void;
  onBack: () => void;
}) {
  const percent = Math.round((result.score / result.total) * 100);

  return (
    <div className="result-shell">
      <div className="result-hero">
        <SleeperVideo
          src="/assets/greatness-text.mp4"
          label="GREATNESS"
          className="result-video"
        />
        <p className="eyebrow">
          RUN COMPLETE / {result.challenge.toUpperCase()}
        </p>
        <h1>
          {result.completion.leveledUp
            ? "RANK UP."
            : percent >= 80
              ? "SOLID READ."
              : "KEEP SHARP."}
        </h1>
        <p className="result-sub">
          One round banked. The next answer gets easier because you understand
          more now.
        </p>
      </div>

      <div className="result-grid">
        <div className="result-score-card">
          <span className="result-card-label">FINAL SCORE</span>
          <strong>
            {result.score}
            <small>/{result.total}</small>
          </strong>
          <div
            className="score-ring"
            style={{ ["--score" as string]: `${percent * 3.6}deg` }}
          >
            <span>{percent}%</span>
          </div>
        </div>

        <div className="result-stats-card">
          <div>
            <span>XP EARNED</span>
            <strong>+{result.earnedXp}</strong>
          </div>
          <div>
            <span>NEW LEVEL</span>
            <strong>{result.completion.newLevel}</strong>
          </div>
          <div>
            <span>BADGES OPENED</span>
            <strong>{result.completion.unlocked.length || "—"}</strong>
          </div>
          <p>
            {result.completion.unlocked.length
              ? `Unlocked: ${result.completion.unlocked
                  .map((badge) => badge.replaceAll("-", " "))
                  .join(" · ")}.`
              : "No new badge this run — the next one is still in reach."}
          </p>
        </div>
      </div>

      <div className="result-actions">
        <button className="button button-primary" onClick={onRestart}>
          <RotateCcw size={16} /> RUN IT BACK
        </button>
        <button className="button button-outline" onClick={onBack}>
          <ArrowLeft size={16} /> BACK TO UNITS
        </button>
        <button className="button button-outline" onClick={onLeaderboard}>
          <Trophy size={16} /> LEADERBOARD
        </button>
      </div>
    </div>
  );
}
