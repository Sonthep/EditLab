import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Check, CircleAlert, Film, LoaderCircle, RotateCcw, Upload } from "lucide-react";

export function PageHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description?: string; action?: ReactNode }) {
  return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1>{description && <p>{description}</p>}</div>{action}</div>;
}
export function ResourceState({ loading, error, retry }: { loading: boolean; error?: string; retry: () => void }) {
  return <div className="resource-state" role={error ? "alert" : "status"}>
    <div className="state-icon">{loading ? <LoaderCircle className="spin" /> : <CircleAlert />}</div>
    <h2>{loading ? "Getting your workspace ready" : "Something needs a second look"}</h2>
    <p>{loading ? "Your lessons and edits will be here in a moment." : error || "We couldn’t find this item."}</p>
    {!loading && <div className="button-row"><button className="button button-primary" onClick={retry}><RotateCcw size={16} />Try again</button><Link className="button button-secondary" href="/learn">Browse lessons</Link></div>}
  </div>;
}
export function WorkflowSteps({ active }: { active: number }) {
  return <ol className="workflow" aria-label="Your editing journey">{[
    { title: "Learn the idea", icon: BookOpen }, { title: "Make your cut", icon: Film }, { title: "Review & improve", icon: Upload },
  ].map(({ title, icon: Icon }, index) => <li key={title} className={active === index ? "current" : active > index ? "done" : ""} aria-current={active === index ? "step" : undefined}><span className="step-symbol">{active > index ? <Check size={15} /> : <Icon size={15} />}</span><span><small>STEP 0{index + 1}</small>{title}</span>{index < 2 && <ArrowRight size={16} className="step-arrow" />}</li>)}</ol>;
}
export function SkillBar({ name, score }: { name: string; score: number }) {
  const value = Math.min(100, Math.max(0, score));
  return <div className="skill-bar"><div><span>{name}</span><strong>{Math.round(value)}<small> / 100</small></strong></div><progress value={value} max={100} aria-label={`${name} score`} /></div>;
}
export function EditorArtwork() {
  return <div className="editor-art" aria-hidden="true">
    <div className="editor-top"><span /><span /><span /><small>YOUR NEXT GREAT CUT</small></div>
    <div className="editor-preview"><svg viewBox="0 0 400 165" fill="none"><path d="M0 165V97L83 29L170 115L250 48L400 131V165Z" fill="#526a60"/><path d="M0 165V135L98 76L185 165Z" fill="#9ebba7"/><path d="M119 165L277 78L400 159V165Z" fill="#d0d8b4"/><circle cx="305" cy="36" r="19" fill="#e0efba"/><path d="M199 165L290 103L348 165" fill="#759284"/></svg><span className="preview-corner">FRAME 024</span><span className="preview-play"><Film size={20}/></span></div>
    <div className="editor-ruler"><span>00:00</span><span>00:08</span><span>00:16</span><span>00:24</span></div>
    <div className="editor-tracks"><div className="video-track"><span>Hook</span><span>The story</span><span>Payoff</span></div><div className="audio-track">{Array.from({ length: 52 }, (_, i) => <i key={i} style={{ height: `${5 + ((i * 7 + i % 3 * 5) % 18)}px` }} />)}</div><div className="art-playhead" /></div>
  </div>;
}

