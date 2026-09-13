"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, AudioLines, BookOpen, ChartNoAxesCombined, CircleHelp, House, Scissors, Settings2, Target } from "lucide-react";
import { useResource } from "@/lib/api";

export default function Navbar() {
  const pathname = usePathname();
  const { data, error, loading, reload } = useResource<{ status: string; ffmpeg: string; ffprobe: string }>("/api/health");
  const ready = data?.ffmpeg === "available" && data?.ffprobe === "available";
  const items = [
    { label: "Overview", href: "/", icon: House }, { label: "Learn", href: "/learn", icon: BookOpen },
    { label: "Practice", href: "/practice/pacing-01-practice", icon: Target },
    { label: "My skills", href: "/skills", icon: ChartNoAxesCombined }, { label: "Settings", href: "/settings", icon: Settings2 },
  ];
  return <aside className="sidebar">
    <Link href="/" className="brand" aria-label="EditLab home"><span className="brand-icon"><Scissors size={23} strokeWidth={2.2} /></span><span>EditLab<span className="brand-dot">.</span><small>MAKE EVERY CUT COUNT</small></span></Link>
    <div className="nav-caption">YOUR WORKSPACE</div>
    <nav className="main-nav" aria-label="Main navigation">{items.map(({ label, href, icon: Icon }) => {
      const active = href === "/" ? pathname === "/" : pathname.startsWith(`/${href.split("/")[1]}`) || (label === "Practice" && pathname.startsWith("/feedback"));
      return <Link key={href} href={href} className={`nav-item ${active ? "active" : ""}`} aria-current={active ? "page" : undefined}><Icon size={19} /><span>{label}</span>{active && <span className="nav-active-dot" />}</Link>;
    })}</nav>
    <div className="sidebar-bottom"><div className="sidebar-note"><span className="note-icon"><AudioLines size={24} /></span><h3>A little practice.<br />A better editor.</h3><p>Build your instincts, one thoughtful cut at a time.</p><Link href="/learn">Find your next lesson <ArrowUpRight size={15} /></Link></div>
      <Link className="help-link" href="/practice/pacing-01-practice"><CircleHelp size={17} /> How it works <ArrowUpRight size={14} /></Link>
      <div className="workspace-status"><span className={`status-dot ${ready ? "online" : ""}`} /><div><strong>{loading ? "Connecting…" : ready ? "Workspace ready" : error ? "Workspace offline" : "Setup needed"}</strong><span>{ready ? "Your files stay on this device" : loading ? "Checking your connection" : error ? "Start the backend to continue" : "Check tools in Settings"}</span></div>{error && <button onClick={reload} className="text-button">Retry</button>}</div>
    </div>
  </aside>;
}

