'use client'

import { useRef } from 'react'

/**
 * "A day in my life" — an orbital command center. A glass-framed silhouette clip
 * is the sun; glass capsules orbit it on three invisible concentric rings, each a
 * different radius, speed and direction. Faint orbital rings + radial links sit
 * behind; the cursor drives a subtle parallax; hovering a capsule pauses its ring
 * and expands a mini-card. Upright labels via per-node counter-rotation.
 *
 * Pure CSS keyframes (no animation libs). Video: /public/coding-silhouette.mp4.
 */

const VIDEO_SRC = '/coding-silhouette.mp4'

type Node = { label: string; sub: string; angle: number; accent?: boolean }

// three rings → slow / medium / slow, alternating direction (see CSS)
const RING1: Node[] = [
  { label: 'AI / ML', sub: 'Building intelligent products', angle: 90, accent: true },
  { label: 'Backend', sub: 'APIs that scale', angle: 210 },
  { label: 'DSA · 400+', sub: 'Problems solved', angle: 330, accent: true },
]
const RING2: Node[] = [
  { label: 'Engineering', sub: 'CSE — the core', angle: 45 },
  { label: 'Open Source', sub: 'Contributing & shipping', angle: 135 },
  { label: 'Hackathons', sub: '₹70K+ won', angle: 225 },
  { label: 'College', sub: 'B.Tech CSE (AI/ML)', angle: 315 },
]
const RING3: Node[] = [
  { label: 'Learning', sub: 'Always leveling up', angle: 25, accent: true },
  { label: 'Curiosity', sub: 'What if…?', angle: 150 },
  { label: 'Night Owl 🌙', sub: 'Best code after midnight', angle: 270 },
]

export default function LifeScene() {
  const ref = useRef<HTMLDivElement>(null)

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', String((e.clientX - r.left) / r.width - 0.5))
    el.style.setProperty('--my', String((e.clientY - r.top) / r.height - 0.5))
  }
  const onLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--mx', '0')
    el.style.setProperty('--my', '0')
  }

  return (
    <div className="mt-10 sm:mt-14">
      <p className="mb-4 font-mono text-xs tracking-[0.25em] text-brand-300">$ ./a-day-in-my-life --loop</p>

      <div ref={ref} className="ls-scene" onMouseMove={onMove} onMouseLeave={onLeave}>
        <style>{CSS}</style>

        {/* depth layer: grid + central glow (parallax) */}
        <div className="ls-bg" />

        <div className="ls-field">
          {/* invisible orbital rings */}
          <div className="ls-path ls-path1" />
          <div className="ls-path ls-path2" />
          <div className="ls-path ls-path3" />

          {/* the sun: glass-framed video */}
          <div className="ls-sun">
            <video className="ls-video" src={VIDEO_SRC} autoPlay loop muted playsInline preload="metadata" />
          </div>

          {/* orbiting capsules */}
          <Ring className="ls-ring ls-ring1" nodes={RING1} />
          <Ring className="ls-ring ls-ring2" nodes={RING2} />
          <Ring className="ls-ring ls-ring3" nodes={RING3} />
        </div>
      </div>
    </div>
  )
}

function Ring({ className, nodes }: { className: string; nodes: Node[] }) {
  return (
    <div className={className} aria-hidden>
      {nodes.map((n) => (
        <div key={n.label} className="ls-node" style={{ '--a': `${n.angle}deg` } as React.CSSProperties}>
          <span className="ls-link" />
          <div className="ls-spin">
            <div className="ls-upright">
              <div className={`ls-cap${n.accent ? ' ls-acc' : ''}`}>
                <span className="ls-label">{n.label}</span>
                <span className="ls-sub">{n.sub}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

const CSS = `
.ls-scene{
  /* ---- theme ---- */
  --acc:#22ff99;
  --glass:rgba(255,255,255,0.045);
  --glass-bd:rgba(255,255,255,0.10);
  --ink:#e9f1ed;
  --ink-dim:#8aa39a;
  --bg:#05070a;

  /* ---- geometry (desktop) — full-size inner orbit ---- */
  --field:640px;
  --sun:270px;
  --r1:200px; --r2:252px; --r3:300px;

  position:relative;
  display:flex; align-items:center; justify-content:center;
  /* outer panel hugs the orbit (was field + 40px) so the container is shorter
     while the inner orbit stays full size; +12px keeps parallax from clipping
     the top/bottom capsules */
  min-height:calc(var(--field) + 12px);
  overflow:hidden;
  border:1px solid var(--border);
  border-radius:var(--r-lg);
  background:
    radial-gradient(120% 100% at 50% 46%, #0b1013 0%, var(--bg) 70%);
}
@media (max-width:680px){
  .ls-scene{ --field:430px; --sun:178px; --r1:132px; --r2:170px; --r3:206px; }
  .ls-sub{ display:none; }
}

/* background grid + glow, deepest parallax layer */
.ls-bg{
  position:absolute; inset:-40px;
  background-image:
    radial-gradient(40% 40% at 50% 46%, rgba(34,255,153,0.10), transparent 70%),
    linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
  background-size: 100% 100%, 38px 38px, 38px 38px;
  transform: translate(calc(var(--mx,0)*6px), calc(var(--my,0)*6px));
  transition: transform .35s ease-out;
}

/* orbital field — middle parallax layer */
.ls-field{
  position:relative;
  width:var(--field); height:var(--field);
  transform: translate(calc(var(--mx,0)*-12px), calc(var(--my,0)*-12px));
  transition: transform .35s ease-out;
}

/* invisible orbital paths */
.ls-path{
  position:absolute; top:50%; left:50%;
  border:1px solid rgba(255,255,255,0.05);
  border-radius:50%;
  transform:translate(-50%,-50%);
}
.ls-path1{ width:calc(var(--r1)*2); height:calc(var(--r1)*2); }
.ls-path2{ width:calc(var(--r2)*2); height:calc(var(--r2)*2); }
.ls-path3{ width:calc(var(--r3)*2); height:calc(var(--r3)*2); }

/* the sun — glass-framed video */
.ls-sun{
  position:absolute; top:50%; left:50%;
  width:var(--sun); aspect-ratio:16/9;
  transform:translate(-50%,-50%) translate(calc(var(--mx,0)*5px), calc(var(--my,0)*5px));
  transition: transform .35s ease-out;
  border-radius:18px;
  padding:1px;
  background:linear-gradient(180deg, rgba(34,255,153,0.25), rgba(255,255,255,0.06));
  box-shadow:0 30px 80px -30px rgba(0,0,0,.9), 0 0 60px -20px rgba(34,255,153,.25);
}
.ls-video{
  width:100%; height:100%; display:block; object-fit:cover; border-radius:17px;
  -webkit-mask-image:radial-gradient(125% 130% at 50% 44%, #000 58%, transparent 92%);
  mask-image:radial-gradient(125% 130% at 50% 44%, #000 58%, transparent 92%);
}

/* rings spin; nodes counter-spin to stay upright */
.ls-ring{ position:absolute; inset:0; pointer-events:none; transform-origin:50% 50%; }
.ls-ring1{ animation:ls-orbit 26s linear infinite; }
.ls-ring2{ animation:ls-orbit 38s linear infinite reverse; }
.ls-ring3{ animation:ls-orbit 52s linear infinite; }
.ls-ring1 .ls-spin{ animation:ls-orbit 26s linear infinite reverse; }
.ls-ring2 .ls-spin{ animation:ls-orbit 38s linear infinite; }
.ls-ring3 .ls-spin{ animation:ls-orbit 52s linear infinite reverse; }

/* hovering a capsule freezes only its own ring */
.ls-ring:has(.ls-node:hover){ animation-play-state:paused; }
.ls-ring:has(.ls-node:hover) .ls-spin{ animation-play-state:paused; }

.ls-node{
  position:absolute; top:50%; left:50%;
  transform:translate(-50%,-50%) rotate(var(--a)) translateX(var(--r));
  transform-origin:50% 50%;
  pointer-events:auto;
}
.ls-ring1 .ls-node{ --r:var(--r1); }
.ls-ring2 .ls-node{ --r:var(--r2); }
.ls-ring3 .ls-node{ --r:var(--r3); }

/* radial link from capsule back to the sun (stays radial, not counter-rotated) */
.ls-link{
  position:absolute; top:50%; right:50%;
  width:var(--r); height:1px;
  transform:translateY(-50%);
  background:linear-gradient(to left, rgba(34,255,153,0.18), rgba(34,255,153,0.02) 60%, transparent);
  pointer-events:none;
}
.ls-spin{ transform-origin:50% 50%; }
.ls-upright{ transform:rotate(calc(-1 * var(--a))); }

/* glass capsule */
.ls-cap{
  display:flex; flex-direction:column; align-items:center; gap:1px;
  padding:8px 16px; border-radius:999px;
  border:1px solid var(--glass-bd); background:var(--glass);
  -webkit-backdrop-filter:blur(10px); backdrop-filter:blur(10px);
  color:var(--ink); white-space:nowrap; cursor:default;
  box-shadow:0 8px 30px -12px rgba(0,0,0,.7);
  transition:border-color .25s ease, box-shadow .25s ease, transform .25s ease;
}
.ls-cap:hover{
  border-color:var(--acc);
  box-shadow:0 0 26px -4px rgba(34,255,153,.55);
  transform:translateY(-1px) scale(1.05);
}
.ls-acc{ border-color:rgba(34,255,153,0.28); }
.ls-label{ font-size:13px; font-weight:600; letter-spacing:.01em; }
.ls-sub{
  max-height:0; opacity:0; overflow:hidden;
  font-size:10.5px; font-weight:500; color:var(--ink-dim);
  transition:max-height .3s ease, opacity .3s ease, margin-top .3s ease;
}
.ls-cap:hover .ls-sub{ max-height:18px; opacity:.85; margin-top:3px; }

@keyframes ls-orbit{ to{ transform:rotate(360deg); } }

@media (prefers-reduced-motion: reduce){
  .ls-ring, .ls-ring .ls-spin{ animation:none !important; }
  .ls-bg, .ls-field, .ls-sun{ transform:none !important; transition:none !important; }
}
`
