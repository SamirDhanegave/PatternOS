import { useState, useRef, useEffect, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════════════════════════ */
const C = {
  bg:"#09090f", surf:"#0f0f1a", surf2:"#14141f", surf3:"#1c1c2e",
  border:"rgba(255,255,255,0.07)", border2:"rgba(255,255,255,0.13)",
  text:"#eeeef5", muted:"#7878a0",
  accent:"#6e6bff", accent2:"#ff6b6b", accent3:"#00d4aa",
  gold:"#f0c060", green:"#4ade80",
};

/* ═══════════════════════════════════════════════════════════
   GLOBAL CSS  — ALL responsiveness lives here via classes
═══════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500&display=swap');

/* ── reset ── */
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:${C.bg};color:${C.text};font-family:'Inter',sans-serif;overflow-x:hidden;-webkit-font-smoothing:antialiased}
button,input{font-family:'Inter',sans-serif;cursor:pointer;border:none;background:none}
a{text-decoration:none;color:inherit}
img{max-width:100%}
::-webkit-scrollbar{width:5px;height:5px}
::-webkit-scrollbar-thumb{background:${C.border2};border-radius:4px}

/* ── animations ── */
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
@keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.fu {animation:fadeUp .4s ease both}
.fu1{animation:fadeUp .4s .08s ease both}
.fu2{animation:fadeUp .4s .16s ease both}
.fu3{animation:fadeUp .4s .24s ease both}
.fu4{animation:fadeUp .4s .32s ease both}

/* ── ticker ── */
.ticker-wrap{overflow:hidden;background:${C.surf};border-top:1px solid ${C.border};border-bottom:1px solid ${C.border};padding:10px 0}
.ticker-inner{animation:ticker 34s linear infinite;display:flex;width:max-content;will-change:transform}
.ticker-inner:hover{animation-play-state:paused}
.ticker-item{padding:0 24px;font-family:'JetBrains Mono',monospace;font-size:.66rem;color:${C.muted};letter-spacing:.12em;text-transform:uppercase;white-space:nowrap;border-right:1px solid ${C.border}}

/* ── code blocks ── */
pre{font-family:'JetBrains Mono',monospace;font-size:.78rem;line-height:1.75;overflow-x:auto;white-space:pre;color:#c9d1d9;padding:18px 20px;max-width:100%;-webkit-overflow-scrolling:touch}
.kw{color:#ff7b72}.fn{color:#d2a8ff}.st{color:#a5d6ff}
.cm{color:#8b949e;font-style:italic}.nm{color:#79c0ff}.cl{color:#ffa657}

/* ══════════════════════════════════════
   NAV
══════════════════════════════════════ */
.nav{
  position:fixed;top:0;left:0;right:0;z-index:300;
  display:flex;align-items:center;justify-content:space-between;
  padding:12px 20px;transition:all .3s;
}
.nav.scrolled{
  background:rgba(9,9,15,.94);backdrop-filter:blur(20px);
  border-bottom:1px solid ${C.border};
}
.nav-logo{
  display:flex;align-items:center;gap:8px;cursor:pointer;
  font-family:'Inter',sans-serif;font-size:1.2rem;font-weight:700;color:${C.text};
  flex-shrink:0;
}
.logo-icon{
  width:28px;height:28px;border-radius:7px;flex-shrink:0;
  background:linear-gradient(135deg,#6e6bff,#a78bff);
  display:flex;align-items:center;justify-content:center;
  font-family:'JetBrains Mono',monospace;font-size:.63rem;color:#fff;
}
.nav-actions{display:flex;align-items:center;gap:16px}
.nav-link{
  font-size:.76rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;
  color:${C.muted};transition:color .2s;background:none;border:none;padding:0;
}
.nav-link:hover{color:${C.text}}
.nav-cta{
  background:${C.accent};color:#fff;padding:8px 16px;border-radius:8px;
  font-size:.76rem;font-weight:700;letter-spacing:.05em;text-transform:uppercase;
  transition:background .2s;
}
.nav-cta:hover{background:#8886ff}
.hamburger{
  background:none;border:1px solid ${C.border};border-radius:8px;
  padding:6px 10px;color:${C.text};font-size:.95rem;line-height:1;
}

/* ══════════════════════════════════════
   MOBILE FULL-SCREEN MENU
══════════════════════════════════════ */
.mob-menu{
  position:fixed;inset:0;background:${C.bg};z-index:400;
  overflow-y:auto;padding:max(70px,env(safe-area-inset-top,70px)) 18px 40px;
  transform:translateX(100%);transition:transform .3s ease;
}
.mob-menu.open{transform:translateX(0)}
.mob-menu-item{
  width:100%;background:${C.surf};border:1px solid ${C.border};
  border-radius:10px;padding:14px 16px;color:${C.text};
  font-size:.88rem;font-weight:700;text-align:left;
  display:flex;align-items:center;gap:10px;margin-bottom:6px;
  transition:background .2s;
}
.mob-menu-item:hover{background:${C.surf2}}
.mob-menu-role{
  width:100%;background:transparent;border:none;
  padding:12px 14px;color:${C.muted};
  font-size:.84rem;font-weight:600;text-align:left;
  display:flex;align-items:center;gap:10px;border-radius:8px;
  transition:background .2s;
}
.mob-menu-role:hover{background:${C.surf};color:${C.text}}

/* ══════════════════════════════════════
   HERO
══════════════════════════════════════ */
.hero{
  min-height:100vh;display:flex;flex-direction:column;
  justify-content:center;align-items:center;text-align:center;
  padding:100px 18px 60px;position:relative;overflow:hidden;
}
.hero-grid{
  position:absolute;inset:0;pointer-events:none;
  background-image:
    linear-gradient(rgba(110,107,255,.04) 1px,transparent 1px),
    linear-gradient(90deg,rgba(110,107,255,.04) 1px,transparent 1px);
  background-size:60px 60px;
  -webkit-mask-image:radial-gradient(ellipse 80% 70% at 50% 50%,black 20%,transparent 100%);
  mask-image:radial-gradient(ellipse 80% 70% at 50% 50%,black 20%,transparent 100%);
}
.hero-orb{
  position:absolute;border-radius:50%;filter:blur(60px);pointer-events:none;
  width:min(500px,120vw);height:min(500px,120vw);top:-100px;left:50%;transform:translateX(-50%);
  background:radial-gradient(circle,rgba(110,107,255,.15) 0%,transparent 70%);
}
.hero-eyebrow{
  position:relative;z-index:2;
  font-family:'JetBrains Mono',monospace;font-size:.6rem;
  letter-spacing:.18em;text-transform:uppercase;color:${C.accent};
  background:rgba(110,107,255,.1);border:1px solid rgba(110,107,255,.22);
  padding:5px 14px;border-radius:100px;margin-bottom:20px;
  max-width:90vw;text-align:center;
}
.hero-title{
  position:relative;z-index:2;
  font-family:'Inter',sans-serif;font-weight:800;
  font-size:clamp(2.4rem,8vw,5.8rem);
  line-height:1.05;letter-spacing:-.04em;max-width:860px;
}
.hero-title em{
  font-style:normal;font-weight:800;
  background:linear-gradient(135deg,#6e6bff 0%,#a78bff 50%,#ff6b6b 100%);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;
  background-clip:text;
}
.hero-sub{
  position:relative;z-index:2;
  font-size:clamp(.9rem,2vw,1.05rem);color:${C.muted};
  max-width:500px;line-height:1.72;margin-top:18px;
}
.hero-btns{
  position:relative;z-index:2;
  display:flex;gap:10px;margin-top:28px;flex-wrap:wrap;justify-content:center;
}
.btn-primary{
  background:${C.accent};color:#fff;padding:12px 26px;
  border-radius:10px;font-size:.87rem;font-weight:700;
  transition:all .2s;white-space:nowrap;
}
.btn-primary:hover{background:#8886ff;transform:translateY(-2px);box-shadow:0 12px 36px rgba(110,107,255,.4)}
.btn-ghost{
  background:transparent;color:${C.text};padding:12px 22px;
  border-radius:10px;border:1px solid ${C.border2};
  font-size:.87rem;font-weight:600;transition:all .2s;white-space:nowrap;
}
.btn-ghost:hover{border-color:${C.accent};color:${C.accent}}

/* ── stats bar ── */
.stats-bar{
  position:relative;z-index:2;
  display:flex;flex-wrap:wrap;justify-content:center;
  margin-top:48px;border:1px solid ${C.border};border-radius:14px;
  background:${C.surf};overflow:hidden;
}
.stat-item{
  padding:16px 24px;text-align:center;
  border-right:1px solid ${C.border};flex:1;min-width:80px;
}
.stat-item:last-child{border-right:none}
.stat-num{
  font-family:'Inter',sans-serif;font-weight:800;font-size:1.75rem;line-height:1;
  background:linear-gradient(135deg,${C.text},${C.muted});
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
}
.stat-lbl{font-size:.62rem;color:${C.muted};margin-top:3px;letter-spacing:.08em;text-transform:uppercase;font-weight:600}

/* ══════════════════════════════════════
   ROLES GRID SECTION
══════════════════════════════════════ */
.section{padding:60px 18px;max-width:1200px;margin:0 auto}
.section-label{font-family:'JetBrains Mono',monospace;font-size:.64rem;color:${C.accent};letter-spacing:.2em;text-transform:uppercase;margin-bottom:10px}
.section-title{font-family:'Inter',sans-serif;font-weight:800;font-size:clamp(1.6rem,4vw,2.6rem);letter-spacing:-.03em;margin-bottom:30px}
.section-title em{font-style:normal;font-weight:400;color:${C.muted}}

.roles-grid{
  display:grid;gap:10px;
  grid-template-columns:repeat(auto-fill,minmax(140px,1fr));
}
.role-card{
  background:${C.surf};border:1px solid ${C.border};border-radius:13px;
  padding:18px 15px;cursor:pointer;position:relative;overflow:hidden;
  transition:all .25s;
}
.role-card:hover{transform:translateY(-4px)}
.role-card-icon{
  width:36px;height:36px;border-radius:9px;
  background:rgba(255,255,255,.05);
  display:flex;align-items:center;justify-content:center;
  font-size:1rem;margin-bottom:12px;
}
.role-card-name{font-size:.84rem;font-weight:700;margin-bottom:4px;line-height:1.3}
.role-card-meta{font-family:'JetBrains Mono',monospace;font-size:.62rem;color:${C.muted}}
.role-card-arrow{position:absolute;top:14px;right:14px;color:${C.muted};font-size:.8rem;opacity:.6}

/* ── how it works ── */
.steps-grid{
  display:grid;gap:2px;
  background:${C.border};border-radius:16px;overflow:hidden;
  grid-template-columns:repeat(auto-fit,minmax(200px,1fr));
}
.step{background:${C.surf};padding:30px 24px;position:relative;transition:background .2s}
.step:hover{background:${C.surf2}}
.step-num{
  position:absolute;top:14px;right:20px;
  font-family:'Inter',sans-serif;font-size:2.8rem;
  color:rgba(255,255,255,.03);pointer-events:none;user-select:none;
}
.step-icon{
  width:42px;height:42px;border-radius:11px;
  background:rgba(110,107,255,.08);border:1px solid rgba(110,107,255,.12);
  display:flex;align-items:center;justify-content:center;
  font-size:1.1rem;margin-bottom:14px;
}
.step-title{font-size:.95rem;font-weight:700;margin-bottom:7px}
.step-desc{font-size:.81rem;color:${C.muted};line-height:1.65}

/* ── CTA ── */
.cta{
  margin:0 18px 60px;
  background:linear-gradient(135deg,rgba(110,107,255,.1) 0%,rgba(0,212,170,.05) 50%,rgba(255,107,107,.07) 100%);
  border:1px solid ${C.border};border-radius:20px;
  padding:54px 24px;text-align:center;
}
.cta-title{
  font-family:'Inter',sans-serif;
  font-size:clamp(1.7rem,5vw,3.4rem);
  line-height:1.05;letter-spacing:-.03em;font-weight:800;
}
.cta-title em{
  font-style:normal;font-weight:800;
  background:linear-gradient(135deg,${C.accent},${C.accent3});
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
}
.cta-sub{font-size:.93rem;color:${C.muted};margin-top:12px;max-width:440px;margin-left:auto;margin-right:auto;line-height:1.65}

/* ── footer ── */
.footer{
  border-top:1px solid ${C.border};
  padding:24px 18px;
  display:flex;align-items:center;justify-content:space-between;
  flex-wrap:wrap;gap:14px;
}
.footer-logo{font-family:'Inter',sans-serif;font-size:1rem;font-weight:700;display:flex;align-items:center;gap:8px}
.footer-copy{font-size:.73rem;color:${C.muted}}
.footer-links{display:flex;gap:18px}
.footer-links a{font-size:.73rem;color:${C.muted};transition:color .2s}
.footer-links a:hover{color:${C.text}}

/* ══════════════════════════════════════
   ROLE DETAIL PAGE
══════════════════════════════════════ */
.role-page{padding-top:70px;min-height:100vh}

/* header */
.role-header{
  padding:28px 18px 22px;
  border-bottom:1px solid ${C.border};
  background:linear-gradient(180deg,rgba(110,107,255,.06) 0%,transparent 100%);
}
.role-header-inner{display:flex;align-items:flex-start;gap:14px;flex-wrap:wrap}
.role-icon-wrap{
  width:52px;height:52px;border-radius:13px;flex-shrink:0;
  background:rgba(110,107,255,.12);border:1px solid rgba(110,107,255,.2);
  display:flex;align-items:center;justify-content:center;font-size:1.5rem;
}
.role-title{font-family:'Inter',sans-serif;font-weight:800;font-size:clamp(1.4rem,5vw,2.2rem);letter-spacing:-.03em;line-height:1.1}
.role-desc{color:${C.muted};font-size:.85rem;line-height:1.65;margin-top:5px;max-width:600px}
.role-badges{display:flex;gap:7px;margin-top:10px;flex-wrap:wrap}

/* body layout */
.role-body{display:flex;position:relative}

/* ── desktop sidebar ── */
.sidebar{
  width:220px;flex-shrink:0;
  border-right:1px solid ${C.border};
  position:sticky;top:70px;
  height:calc(100vh - 70px);overflow-y:auto;
  padding:16px 0;
}
.sidebar-label{
  font-family:'JetBrains Mono',monospace;font-size:.58rem;color:${C.muted};
  letter-spacing:.15em;text-transform:uppercase;
  margin-bottom:6px;padding-left:4px;
}
.sidebar-item{
  display:flex;align-items:center;padding:9px 10px;
  border-radius:8px;cursor:pointer;font-size:.8rem;font-weight:600;
  margin-bottom:2px;transition:all .2s;
  border:1px solid transparent;color:${C.text};
}
.sidebar-item:hover{background:rgba(255,255,255,.04)}
.sidebar-item.active{
  background:rgba(110,107,255,.1);
  border-color:rgba(110,107,255,.22);color:${C.accent};
}
.sidebar-count{font-family:'JetBrains Mono',monospace;font-size:.58rem;color:${C.muted};margin-left:auto}
.sidebar-divider{height:1px;background:${C.border};margin:8px 14px}

/* main content */
.role-content{flex:1;padding:20px 16px;min-width:0;max-width:100%}

/* mobile sidebar button */
.mob-sidebar-btn{
  width:100%;background:${C.surf};border:none;
  border-bottom:1px solid ${C.border};padding:11px 18px;
  cursor:pointer;color:${C.text};font-size:.8rem;font-weight:700;
  display:flex;align-items:center;justify-content:space-between;
}

/* sidebar drawer (mobile) */
.drawer-overlay{
  position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:149;
  opacity:0;pointer-events:none;transition:opacity .3s;
}
.drawer-overlay.open{opacity:1;pointer-events:all}
.sidebar-drawer{
  position:fixed;left:0;top:0;bottom:0;
  width:min(260px,82vw);background:${C.surf};
  border-right:1px solid ${C.border};z-index:150;
  overflow-y:auto;padding-top:70px;
  transform:translateX(-100%);transition:transform .3s ease;
}
.sidebar-drawer.open{transform:translateX(0)}

/* tabs */
.tabs-bar{
  display:flex;gap:3px;margin-bottom:20px;
  background:${C.surf};border:1px solid ${C.border};border-radius:10px;
  padding:3px;width:fit-content;max-width:100%;
}
.tab{
  padding:7px 15px;border-radius:7px;font-size:.79rem;font-weight:700;
  letter-spacing:.04em;transition:all .2s;white-space:nowrap;color:${C.muted};
}
.tab.active{background:${C.accent};color:#fff}

/* topic section */
.topic-header{margin-bottom:14px;padding-top:4px;scroll-margin-top:80px}
.topic-title{font-family:'Inter',sans-serif;font-weight:700;font-size:clamp(1.2rem,3vw,1.6rem);letter-spacing:-.02em;margin-bottom:3px}
.topic-sub{font-size:.8rem;color:${C.muted}}

/* QA card */
.qa-card{
  background:${C.surf};border:1px solid ${C.border};
  border-radius:13px;margin-bottom:9px;overflow:hidden;transition:border-color .2s;
}
.qa-card:hover{border-color:${C.border2}}
.qa-q{
  padding:14px 16px;cursor:pointer;display:flex;
  align-items:flex-start;gap:9px;user-select:none;
}
.qa-num{
  font-family:'JetBrains Mono',monospace;font-size:.57rem;color:${C.accent};
  background:rgba(110,107,255,.1);border:1px solid rgba(110,107,255,.15);
  padding:2px 7px;border-radius:4px;flex-shrink:0;margin-top:3px;
}
.qa-text{font-size:.88rem;font-weight:700;line-height:1.4;flex:1;min-width:0}
.qa-meta{display:flex;gap:5px;align-items:center;flex-shrink:0;margin-left:4px}
.qa-chevron{color:${C.muted};font-size:.7rem;transition:transform .3s;display:inline-block}
.qa-answer{padding:0 16px 15px;border-top:1px solid ${C.border}}
.qa-answer-text{padding-top:12px;font-size:.85rem;color:${C.muted};line-height:1.8;white-space:pre-line;overflow-wrap:break-word;word-break:break-word}
.qa-tip{
  display:flex;gap:9px;margin-top:11px;
  background:rgba(240,192,96,.05);border:1px solid rgba(240,192,96,.15);
  border-radius:8px;padding:9px 11px;
}
.qa-tip-label{font-family:'JetBrains Mono',monospace;font-size:.57rem;color:${C.gold};letter-spacing:.12em;text-transform:uppercase;flex-shrink:0;padding-top:2px}
.qa-tip-text{font-size:.81rem;color:${C.muted};line-height:1.65}

/* challenge card */
.ch-card{background:${C.surf};border:1px solid ${C.border};border-radius:13px;margin-bottom:15px;overflow:hidden}
.ch-header{
  padding:13px 16px;border-bottom:1px solid ${C.border};
  display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:7px;
}
.ch-title{font-size:.9rem;font-weight:700;display:flex;align-items:center;gap:8px}
.ch-body{padding:15px 16px}
.ch-desc{font-size:.84rem;color:${C.muted};line-height:1.72;margin-bottom:11px}
.io-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:11px}
.io-box{background:${C.surf2};border:1px solid ${C.border};border-radius:8px;padding:10px 12px}
.io-label{font-family:'JetBrains Mono',monospace;font-size:.57rem;color:${C.muted};letter-spacing:.12em;text-transform:uppercase;margin-bottom:4px}
.io-val{font-family:'JetBrains Mono',monospace;font-size:.75rem;color:${C.accent3};line-height:1.5;overflow-wrap:break-word;word-break:break-all}
.sol-btn{
  display:inline-flex;align-items:center;gap:7px;
  background:rgba(110,107,255,.1);border:1px solid rgba(110,107,255,.2);
  color:${C.accent};padding:7px 14px;border-radius:8px;
  font-size:.77rem;font-weight:700;letter-spacing:.04em;transition:all .2s;
}
.sol-btn:hover{background:rgba(110,107,255,.18)}
.code-wrap{margin-top:11px;background:#0a0a14;border:1px solid ${C.border2};border-radius:10px;overflow:hidden}
.code-header{
  padding:7px 13px;border-bottom:1px solid ${C.border};
  display:flex;align-items:center;justify-content:space-between;
}
.code-dots{display:flex;gap:5px}
.code-dot{width:9px;height:9px;border-radius:50%}
.code-lang{font-family:'JetBrains Mono',monospace;font-size:.57rem;color:${C.muted}}
.complexity{display:flex;gap:7px;margin-top:8px;flex-wrap:wrap}
.complexity-badge{
  font-family:'JetBrains Mono',monospace;font-size:.62rem;
  padding:3px 9px;border-radius:5px;
  background:rgba(255,255,255,.03);border:1px solid ${C.border};color:${C.muted};
}
.complexity-badge span{color:${C.text}}

/* tip card */
.tip-card{
  background:${C.surf};border:1px solid ${C.border};border-radius:12px;
  margin-bottom:8px;padding:14px 15px;display:flex;gap:10px;align-items:flex-start;
}
.tip-num{
  font-family:'JetBrains Mono',monospace;font-size:.57rem;color:${C.gold};
  background:rgba(240,192,96,.1);border:1px solid rgba(240,192,96,.2);
  padding:2px 7px;border-radius:4px;flex-shrink:0;margin-top:2px;
}
.tip-text{font-size:.85rem;color:${C.muted};line-height:1.72}

/* badge */
.badge{
  display:inline-block;
  font-family:'JetBrains Mono',monospace;font-size:.59rem;
  letter-spacing:.1em;text-transform:uppercase;
  padding:3px 8px;border-radius:5px;white-space:nowrap;
}

/* ══════════════════════════════════════
   RESPONSIVE BREAKPOINTS
══════════════════════════════════════ */

/* ── base mobile-first defaults ── */
.io-grid{display:grid;grid-template-columns:1fr;gap:8px;margin-bottom:11px}
.qa-meta{flex-wrap:wrap;justify-content:flex-end}

/* ── ≥ 480px: two-column io-grid, eyebrow larger ── */
@media(min-width:480px){
  .io-grid{grid-template-columns:1fr 1fr}
  .hero-eyebrow{font-size:.66rem;letter-spacing:.2em}
}

/* ── ≥ 768px (tablets and up) ── */
@media(min-width:768px){
  .nav{padding:14px 32px}
  .hero{padding:110px 32px 70px}
  .section{padding:70px 32px}
  .cta{margin:0 32px 70px;padding:60px 40px}
  .footer{padding:26px 32px}
  .role-header{padding:32px 32px 26px}
  .role-content{padding:24px 28px}
  .roles-grid{grid-template-columns:repeat(auto-fill,minmax(180px,1fr))}
}

/* ── ≥ 900px: show desktop sidebar, hide mobile sidebar ── */
@media(min-width:900px){
  .sidebar{display:flex!important;flex-direction:column}
  .mob-sidebar-btn{display:none!important}
  .sidebar-drawer,.drawer-overlay{display:none!important}
}
@media(max-width:899px){
  .sidebar{display:none!important}
  .mob-sidebar-btn{display:flex!important}
}

/* ── ≥ 900px: desktop nav ── */
@media(min-width:900px){
  .hamburger,.mob-menu{display:none!important}
  .nav-actions{display:flex!important}
}
@media(max-width:899px){
  .nav-actions{display:none!important}
  .hamburger{display:block!important}
}

/* ── small phones ≤ 380px ── */
@media(max-width:380px){
  .hero-title{font-size:2.2rem;letter-spacing:-.02em}
  .hero-btns{flex-direction:column;align-items:stretch}
  .btn-primary,.btn-ghost{text-align:center}
  .stats-bar{border-radius:10px}
  .stat-item{padding:12px 14px;min-width:70px}
  .stat-num{font-size:1.4rem}
  pre{font-size:.7rem;padding:12px}
  .role-icon-wrap{width:42px;height:42px;font-size:1.2rem}
  .role-header-inner{gap:10px}
  .ch-header{flex-direction:column;align-items:flex-start}
  .qa-q{gap:7px;padding:12px 13px}
  .qa-text{font-size:.84rem}
  .hero-orb{width:260px;height:260px}
  .nav-logo span{display:none}
  .cta{margin:0 10px 40px;padding:36px 16px}
  .section{padding:40px 14px}
  .footer{flex-direction:column;align-items:flex-start;gap:10px}
}

/* ── medium phones 381–479px ── */
@media(min-width:381px) and (max-width:479px){
  .hero-btns{flex-direction:column;align-items:center}
  .btn-primary,.btn-ghost{width:100%;max-width:280px;text-align:center}
  .hero-orb{width:320px;height:320px}
}

/* ── landscape phones (short screens) ── */
@media(max-height:500px) and (orientation:landscape){
  .hero{min-height:auto;padding:80px 18px 36px}
  .stats-bar{margin-top:28px}
}
`;

/* ═══════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════ */
const ROLES = [
  {
    id:"frontend", icon:"⚡", name:"Frontend Developer", color:"#6e6bff",
    desc:"HTML, CSS, JavaScript, React, performance, and browser APIs. Covers everything from startups to FAANG.",
    topics:["Core JavaScript","React & Hooks","Performance","Browser APIs"],
    qa:[
      { topic:"Core JavaScript", items:[
        { q:"Explain the difference between var, let, and const.", diff:"easy",
          a:"var is function-scoped and hoisted (initialized as undefined). let and const are block-scoped and live in the temporal dead zone until declared — accessing them before declaration throws a ReferenceError.\n\nconst prevents reassignment but does NOT make objects immutable. You can still mutate object properties. Use const by default, let when you need to reassign, and avoid var entirely in modern code.",
          tip:"Mention the temporal dead zone — most junior devs miss it and interviewers know this." },
        { q:"What is event delegation and why is it useful?", diff:"medium",
          a:"Event delegation attaches one listener to a parent instead of many children. Events bubble up the DOM — a child event propagates to the parent which checks event.target to identify the source.\n\nBenefits: fewer listeners (better memory), works for dynamically added elements without re-binding, and simplifies cleanup.",
          tip:"Give a concrete example: a click handler on <ul> that handles all <li> children." },
        { q:"What is a closure? Give a real-world use case.", diff:"medium",
          a:"A closure is a function that retains access to its outer scope's variables even after the outer function has returned. Every function in JavaScript forms a closure.\n\nReal use cases: data privacy (module pattern), factory functions returning configured functions, memoization caches, and React hooks — useState internally uses closures to retain state between renders.",
          tip:"" },
        { q:"Explain the JavaScript event loop in detail.", diff:"hard",
          a:"JavaScript is single-threaded. The call stack executes synchronous code. Async operations are handled by Web APIs, which push callbacks into queues.\n\nThe event loop drains the microtask queue completely (Promises, queueMicrotask) before picking one macrotask (setTimeout, setInterval). This is why Promise.resolve().then() always runs before setTimeout(fn, 0).",
          tip:"Draw the two queues on a whiteboard — visual thinkers stand out." },
        { q:"How does prototypal inheritance work?", diff:"medium",
          a:"Every JavaScript object has an internal [[Prototype]] link. Property lookup walks this chain until found or null. When you call arr.map(), JS looks: arr → Array.prototype → Object.prototype → null.\n\nES6 classes are syntactic sugar over this chain. Object.create() lets you set the prototype explicitly.",
          tip:"" },
      ]},
      { topic:"React & Hooks", items:[
        { q:"useState vs useReducer — when do you use each?", diff:"medium",
          a:"useState is ideal for simple, independent values. useReducer shines when transitions are complex, depend on previous state, or multiple sub-values change together.\n\nRule of thumb: if you have more than 2–3 setState conditions, or you're passing multiple setters through props, switch to useReducer. It also makes unit testing easier — test the reducer in isolation without React.",
          tip:"" },
        { q:"What does useCallback solve? When is it NOT needed?", diff:"hard",
          a:"useCallback memoizes a function reference so it doesn't change on every render, preventing child re-renders when the function is passed as a prop.\n\nNOT needed for most cases — memoization overhead can exceed the benefit. Only use when: (1) passing to a React.memo-wrapped child, or (2) the function is a useEffect/useMemo dependency. Premature useCallback is a common junior mistake.",
          tip:"Saying 'premature optimization' signals senior-level thinking." },
        { q:"How does React reconciliation work?", diff:"hard",
          a:"React keeps a Virtual DOM. On state change it creates a new VDOM tree and diffs it against the previous one.\n\nKey rules: different element types → entirely different trees; siblings with stable key props → matched by key; same component type at same position → state preserved. React Fiber (v16+) made this incremental and interruptible.",
          tip:"" },
      ]},
      { topic:"Performance", items:[
        { q:"What is code splitting and how do you implement it?", diff:"medium",
          a:"Code splitting divides your JS bundle into smaller chunks loaded on demand. In React, use React.lazy() with Suspense for component-level splitting.\n\nRoute-level splitting is most impactful — React Router supports lazy routes, Next.js splits automatically per page. Also use dynamic import() for heavy optional libraries.",
          tip:"" },
        { q:"Explain the Critical Rendering Path and how to optimize it.", diff:"hard",
          a:"CRP: HTML parsing → DOM → CSSOM → Render Tree → Layout → Paint → Composite.\n\nOptimizations: (1) Eliminate render-blocking resources — defer/async scripts. (2) Inline critical CSS. (3) Preload key assets. (4) Batch DOM reads/writes to avoid layout thrashing. (5) Use transform for GPU-layer animations. (6) Lazy-load images.",
          tip:"" },
      ]},
      { topic:"Browser APIs", items:[
        { q:"localStorage vs sessionStorage vs cookies.", diff:"easy",
          a:"localStorage: persists across sessions, ~5–10MB, never sent to server. sessionStorage: cleared when tab closes, ~5MB, never sent to server. Cookies: sent with every HTTP request, 4KB limit, can be HttpOnly (no JS access), Secure, and SameSite.\n\nFor auth tokens: HttpOnly cookies (XSS-resistant). For UI preferences: localStorage. For tab-specific state: sessionStorage.",
          tip:"" },
      ]},
    ],
    challenges:[
      { title:"Debounce Function", diff:"medium", lang:"JavaScript",
        desc:"Implement <strong>debounce</strong> from scratch — only execute after the user stops calling for a given delay.",
        input:"debounce(fn, 300) called rapidly", output:"fn fires once, 300ms after last call",
        code:`function debounce(fn, delay) {
  let timerId;
  return function (...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Usage — search input
const search = debounce(query => fetchResults(query), 300);
input.addEventListener('input', e => search(e.target.value));`,
        time:"O(1)", space:"O(1)" },
      { title:"Deep Clone with Circular Ref Handling", diff:"hard", lang:"JavaScript",
        desc:"Implement deep clone handling nested objects, arrays, Dates, and <strong>circular references</strong>. JSON.parse/stringify fails on Dates and circular refs.",
        input:"{a:1, b:{c:[1,2]}, d:new Date()}", output:"Identical deep copy, no shared references",
        code:`function deepClone(obj, seen = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (seen.has(obj)) return seen.get(obj); // circular guard
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);
  const clone = Array.isArray(obj) ? [] : {};
  seen.set(obj, clone);
  for (const key of Object.keys(obj)) {
    clone[key] = deepClone(obj[key], seen);
  }
  return clone;
}`,
        time:"O(n)", space:"O(n)" },
      { title:"Promise.all Implementation", diff:"hard", lang:"JavaScript",
        desc:"Implement <strong>Promise.all</strong> from scratch — resolves when all promises resolve, rejects immediately if any reject.",
        input:"[Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)]", output:"[1, 2, 3]",
        code:`function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    if (!promises.length) return resolve([]);
    const results = new Array(promises.length);
    let remaining = promises.length;
    promises.forEach((p, i) => {
      Promise.resolve(p)
        .then(val => {
          results[i] = val;
          if (--remaining === 0) resolve(results);
        })
        .catch(reject); // first rejection wins
    });
  });
}`,
        time:"O(n)", space:"O(n)" },
    ],
    tips:[
      "Always explain your thought process before writing code — interviewers evaluate reasoning, not just output.",
      "For React questions, mention trade-offs. Nothing signals seniority like 'it depends — here's when I'd use X vs Y.'",
      "Know DevTools deeply — performance tab, network waterfall, and Lighthouse are common conversation topics.",
      "Know SSR vs SSG vs ISR vs CSR — product companies ask this constantly.",
      "Prepare a 'war story': a real performance win or tricky bug. Problem → root cause → fix → measurable outcome.",
    ]
  },
  {
    id:"backend", icon:"🔧", name:"Backend Engineer", color:"#00d4aa",
    desc:"APIs, databases, caching, message queues, and scalability patterns for high-growth companies.",
    topics:["REST & APIs","Databases","Caching","System Design"],
    qa:[
      { topic:"REST & APIs", items:[
        { q:"What are the principles of RESTful API design?", diff:"easy",
          a:"REST has 6 constraints: Client-Server, Stateless, Cacheable, Uniform Interface, Layered System, Code on Demand (optional).\n\nPractical rules: use nouns for resources (/users not /getUsers), HTTP verbs for actions, correct status codes (201 Created, 204 No Content, 404 Not Found, 422 Unprocessable), versioning (/api/v1/), and consistent error response shapes.",
          tip:"" },
        { q:"GraphQL vs REST — when would you choose GraphQL?", diff:"medium",
          a:"GraphQL solves over-fetching and under-fetching. Use when: mobile clients need bandwidth efficiency, data is a complex interconnected graph, multiple clients need different data shapes, or frontend must iterate rapidly without backend changes.\n\nDownsides: harder HTTP caching, N+1 risk on resolvers, more complex backend — overkill for simple CRUD.",
          tip:"" },
        { q:"Explain idempotency. Which HTTP methods must be idempotent?", diff:"medium",
          a:"An operation is idempotent if performing it multiple times produces the same result as once. GET, PUT, DELETE, HEAD, OPTIONS are idempotent. POST is NOT — it creates a new resource each time.\n\nThis matters for retry logic: safe to retry GET/PUT/DELETE on timeout. For POST, use idempotency keys (like Stripe's Idempotency-Key header) to make retries safe without duplicate side effects.",
          tip:"" },
      ]},
      { topic:"Databases", items:[
        { q:"SQL vs NoSQL — when do you choose each?", diff:"medium",
          a:"SQL: structured schema, ACID transactions, powerful JOINs, great for relational data.\n\nNoSQL: schema flexibility, horizontal scaling, optimized for specific access patterns. Choose NoSQL when schema changes frequently, you need massive horizontal scale, or data is document/key-value/time-series shaped.",
          tip:"" },
        { q:"How do B-tree database indexes work?", diff:"hard",
          a:"B-tree indexes store sorted keys in a balanced tree where every root-to-leaf path is equal length. Lookups are O(log n). They support equality, range queries, ORDER BY, and prefix matching.\n\nThey do NOT help for: low-cardinality columns, columns inside functions in WHERE, or leading % LIKE searches. Composite indexes follow the leftmost prefix rule.",
          tip:"Drawing the B-tree on a whiteboard signals strong CS fundamentals." },
        { q:"What is the N+1 query problem?", diff:"medium",
          a:"N+1 occurs when you fetch N records then issue 1 query per record. Example: fetch 100 users then query each user's posts = 101 queries.\n\nFixes: (1) SQL JOIN to fetch at once. (2) ORM eager loading. (3) DataLoader — batch and deduplicate per request. (4) Denormalize for read-heavy paths.",
          tip:"" },
      ]},
      { topic:"Caching", items:[
        { q:"Explain cache-aside, write-through, and write-behind.", diff:"hard",
          a:"Cache-aside: app checks cache → miss → fetch DB → populate cache. Only caches what's requested. Risk: stale data after DB updates.\n\nWrite-through: write to cache AND DB atomically. Always consistent, higher write latency.\n\nWrite-behind: write to cache immediately, async flush to DB. Lowest latency, risk of data loss on crash.",
          tip:"" },
      ]},
      { topic:"System Design", items:[
        { q:"How would you design a URL shortener like bit.ly?", diff:"hard",
          a:"Scale: 100M URLs, 1B reads/day (10:1 read-heavy).\n\nCore: Generate short code via base62 encoding of auto-incremented ID. Store in DynamoDB (shortCode → longURL). Cache hot URLs in Redis — 20% of URLs = 80% of traffic. CDN for global low-latency redirects.\n\nAPI: POST /shorten → 201 + shortCode. GET /{code} → 301 redirect. Analytics: async via Kafka — never block the redirect path.",
          tip:"Always mention async analytics — blocking redirect for tracking is a common design mistake." },
      ]},
    ],
    challenges:[
      { title:"LRU Cache", diff:"hard", lang:"JavaScript",
        desc:"Implement a <strong>Least Recently Used Cache</strong> with O(1) get and put — top-5 most asked backend interview question at FAANG.",
        input:"LRUCache(2) → put(1,1), put(2,2), get(1)→1, put(3,3) evicts 2", output:"get(2) → -1 (evicted)",
        code:`class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map(); // insertion-ordered
  }
  get(key) {
    if (!this.cache.has(key)) return -1;
    const val = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, val); // refresh to most-recent
    return val;
  }
  put(key, value) {
    if (this.cache.has(key)) this.cache.delete(key);
    else if (this.cache.size >= this.capacity) {
      // first key = least recently used
      this.cache.delete(this.cache.keys().next().value);
    }
    this.cache.set(key, value);
  }
}`,
        time:"O(1) get/put", space:"O(capacity)" },
      { title:"Rate Limiter — Token Bucket", diff:"medium", lang:"JavaScript",
        desc:"Implement a <strong>token bucket rate limiter</strong> — used by Stripe, AWS API Gateway, and most production systems.",
        input:"new RateLimiter(5, 1000) → 5 req/sec", output:"true×5 then false until tokens refill",
        code:`class RateLimiter {
  constructor(maxTokens, windowMs) {
    this.max = maxTokens;
    this.tokens = maxTokens;
    this.last = Date.now();
    this.windowMs = windowMs;
  }
  refill() {
    const elapsed = Date.now() - this.last;
    const add = Math.floor((elapsed / this.windowMs) * this.max);
    if (add > 0) {
      this.tokens = Math.min(this.max, this.tokens + add);
      this.last = Date.now();
    }
  }
  allow() {
    this.refill();
    if (this.tokens > 0) { this.tokens--; return true; }
    return false;
  }
}`,
        time:"O(1)", space:"O(1)" },
    ],
    tips:[
      "Always discuss trade-offs — never present a single option; interviewers want to see you reason through the design space.",
      "Mention EXPLAIN ANALYZE for database queries — it signals you actually tune queries, not just write them.",
      "Bring up CAP theorem naturally when discussing distributed databases.",
      "Connection pooling is often overlooked — mention it for high-throughput database access.",
      "For API design, discuss backward compatibility and versioning strategy — it shows product engineering maturity.",
    ]
  },
  {
    id:"devops", icon:"🚀", name:"DevOps Engineer", color:"#f0c060",
    desc:"CI/CD, Docker, Kubernetes, cloud infrastructure, monitoring, and SRE. Covers AWS, Terraform, and production reliability.",
    topics:["Docker","Kubernetes","CI/CD","Monitoring"],
    qa:[
      { topic:"Docker", items:[
        { q:"Docker image vs container — what's the difference?", diff:"easy",
          a:"A Docker image is a read-only, layered filesystem snapshot. A container is a running instance of an image — it adds a writable layer on top. One image can spawn many containers.\n\nContainers share the host OS kernel (unlike VMs), making them lightweight and fast to start. Shared base layers are cached — stored only once across images.",
          tip:"" },
        { q:"Explain Docker multi-stage builds.", diff:"medium",
          a:"Multi-stage builds use multiple FROM instructions in one Dockerfile. Each stage selectively copies artifacts from previous stages, discarding all build tooling.\n\nExample: Stage 1 installs deps + builds. Stage 2 is minimal Alpine + only production output. Result: 800MB build image → ~60MB production image. Smaller attack surface, faster deploys, smaller registry storage.",
          tip:"" },
        { q:"How do you secure a Docker container in production?", diff:"hard",
          a:"(1) Run as non-root user (USER directive). (2) Use minimal base images (Alpine, distroless). (3) Never store secrets in Dockerfile. (4) Read-only filesystem where possible. (5) Drop Linux capabilities — --cap-drop ALL, add only what's needed. (6) Scan images with Trivy or Snyk in CI. (7) Multi-stage builds to exclude dev tools.",
          tip:"" },
      ]},
      { topic:"Kubernetes", items:[
        { q:"Explain Deployment vs StatefulSet vs DaemonSet.", diff:"medium",
          a:"Deployment: stateless pods — rolling updates, rollbacks, scaling. Pods are interchangeable.\n\nStatefulSet: stateful workloads (databases, Kafka). Pods get stable network identities, persistent volume claims that survive restarts, ordered graceful scaling.\n\nDaemonSet: one pod per node — for log collectors (Fluentd), metrics agents (Datadog), network plugins.",
          tip:"Quick rule: API server → Deployment. Postgres cluster → StatefulSet. Log shipper → DaemonSet." },
        { q:"What happens when a Kubernetes Pod is OOMKilled?", diff:"hard",
          a:"OOMKilled means the container exceeded its memory limit and the Linux OOM killer terminated it. K8s restarts it based on restartPolicy.\n\nDiagnosis: kubectl describe pod → Last State exit code 137. Review memory metrics for growth. Check if limits are set too low.\n\nFixes: increase memory limits, fix memory leaks, add HPA autoscaling on memory, or use VPA for automatic tuning.",
          tip:"Mentioning exit code 137 specifically impresses interviewers." },
      ]},
      { topic:"CI/CD", items:[
        { q:"Continuous Delivery vs Continuous Deployment.", diff:"easy",
          a:"CI: build and test automatically on every commit.\n\nContinuous Delivery: CI + automatically prepare a deployable artifact, but a human approves production deployment.\n\nContinuous Deployment: every passing commit is automatically deployed to production with zero human gates.\n\nMost mature companies use Continuous Delivery with automated canary/blue-green — automation combined with progressive rollout.",
          tip:"" },
      ]},
      { topic:"Monitoring", items:[
        { q:"What are the four golden signals?", diff:"medium",
          a:"From Google's SRE book: (1) Latency — time to serve a request (distinguish successful vs failed). (2) Traffic — demand on your system (requests/sec). (3) Errors — rate of failed requests. (4) Saturation — how full your service is (CPU %, memory %, queue depth).\n\nMonitor these four and you cover the most critical failure patterns for any service.",
          tip:"Referencing the SRE book signals serious study, not just tutorial-level knowledge." },
      ]},
    ],
    challenges:[
      { title:"Multi-Stage Dockerfile for Node.js", diff:"easy", lang:"Dockerfile",
        desc:"Write a production-ready <strong>multi-stage Dockerfile</strong> optimized for size, security (non-root), and build-layer caching.",
        input:"Node.js Express app with package.json", output:"Secure ~80MB production image",
        code:`# Stage 1: production deps only
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 3: minimal production image
FROM node:20-alpine AS runner
WORKDIR /app
RUN addgroup -S app && adduser -S app -G app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
USER app
EXPOSE 3000
CMD ["node", "dist/server.js"]`,
        time:"N/A", space:"~80MB final" },
    ],
    tips:[
      "Reference '4 golden signals' — latency, traffic, errors, saturation — in every monitoring discussion.",
      "Distinguish resource requests vs limits in Kubernetes — they serve very different purposes.",
      "Mention DORA metrics (deploy frequency, lead time, MTTR, change failure rate) in CI/CD discussions.",
      "Infrastructure as Code is expected at senior level — demonstrate Terraform or Pulumi familiarity.",
      "Blue-green = all-or-nothing switch; canary = progressive rollout. Know the blast radius difference.",
    ]
  },
  {
    id:"data", icon:"📊", name:"Data Scientist", color:"#ff6b6b",
    desc:"Statistics, ML algorithms, model evaluation, SQL, and practical ML system design.",
    topics:["Statistics","Machine Learning","Model Evaluation","SQL"],
    qa:[
      { topic:"Statistics", items:[
        { q:"What does p < 0.05 actually mean?", diff:"medium",
          a:"The p-value is the probability of observing results at least as extreme as those observed, assuming H₀ is true. It is NOT the probability that H₀ is false.\n\np < 0.05 means: if H₀ were true, we'd see this result by chance less than 5% of the time. It does NOT mean the effect is large or important. Effect size and confidence intervals tell you more than the p-value alone.",
          tip:"Knowing the common misinterpretations scores major points — most candidates recite a definition without understanding it." },
        { q:"What is the bias-variance trade-off?", diff:"medium",
          a:"Bias: error from overly simplistic assumptions — underfitting. Variance: sensitivity to training data fluctuations — overfitting.\n\nTotal Error = Bias² + Variance + Irreducible Noise. More complexity: bias decreases, variance increases. Regularization and more data reduce variance. Simpler models increase bias but reduce variance.",
          tip:"" },
        { q:"Explain the Central Limit Theorem and its importance.", diff:"medium",
          a:"The CLT: the distribution of sample means approaches normal as sample size grows, regardless of the population distribution (given i.i.d. samples).\n\nWhy it matters: it's the mathematical foundation for hypothesis testing, confidence intervals, and A/B testing. It's why z-tests and t-tests work even when underlying data isn't normal, as long as n ≥ ~30.",
          tip:"" },
      ]},
      { topic:"Machine Learning", items:[
        { q:"Explain gradient descent: batch, mini-batch, stochastic.", diff:"medium",
          a:"GD updates parameters by stepping in the direction of the negative gradient of the loss.\n\nBatch GD: entire dataset per update — accurate, very slow. SGD: one sample per update — fast, noisy. Mini-batch (32–256 samples): the practical default — balances accuracy and GPU efficiency. Adam and RMSprop adapt per-parameter learning rates — preferred in deep learning.",
          tip:"" },
        { q:"How do you handle a severely imbalanced dataset?", diff:"hard",
          a:"Solutions: (1) Resampling — oversample minority with SMOTE or undersample majority. (2) Class weights — increase penalty for minority misclassification. (3) Threshold tuning — don't blindly use 0.5. (4) Better metrics — F1, PR-AUC, or ROC-AUC, never accuracy alone. (5) Anomaly detection framing for extreme ratios (>100:1).",
          tip:"" },
      ]},
      { topic:"Model Evaluation", items:[
        { q:"What is data leakage and why is it critical to prevent?", diff:"hard",
          a:"Data leakage: information outside the training set influences model training, producing optimistic metrics that don't generalize.\n\nTypes: (1) Target leakage — a feature is a proxy for the target. (2) Train-test contamination — scaling or imputation done before the split.\n\nPrevention: always split BEFORE preprocessing, use sklearn Pipelines, use time-based splits for temporal data.",
          tip:"Mentioning this proactively signals senior-level thinking." },
      ]},
      { topic:"SQL", items:[
        { q:"Explain window functions with a real use case.", diff:"medium",
          a:"Window functions calculate across rows related to the current row without collapsing them. The OVER() clause defines the window.\n\nKey functions: ROW_NUMBER(), RANK(), DENSE_RANK(), LAG(), LEAD(), SUM() OVER(), NTILE().\n\nUse case: top 3 highest-paid employees per department → DENSE_RANK() OVER (PARTITION BY dept ORDER BY salary DESC) then WHERE rank <= 3.",
          tip:"" },
      ]},
    ],
    challenges:[
      { title:"K-Means from Scratch", diff:"hard", lang:"Python",
        desc:"Implement <strong>K-Means clustering</strong> without sklearn — assignment step, update step, and convergence check.",
        input:"points=[[1,2],[1,4],[10,2],[10,4]], k=2", output:"Two clusters: left group and right group",
        code:`import numpy as np

def kmeans(X, k, max_iters=100, tol=1e-4):
    idx = np.random.choice(len(X), k, replace=False)
    centroids = X[idx].copy()

    for _ in range(max_iters):
        # Assignment: each point -> nearest centroid
        dists = np.linalg.norm(X[:, np.newaxis] - centroids, axis=2)
        labels = np.argmin(dists, axis=1)

        # Update: recompute centroids as cluster means
        new_c = np.array([X[labels == i].mean(axis=0) for i in range(k)])

        if np.linalg.norm(new_c - centroids) < tol:
            break  # converged
        centroids = new_c

    return labels, centroids`,
        time:"O(n·k·iterations)", space:"O(n·k)" },
    ],
    tips:[
      "Always ask about the business metric before choosing an ML metric — interviewers want product thinking.",
      "Mention data leakage proactively in evaluation discussions — it separates junior from senior candidates.",
      "For A/B testing: discuss statistical power, minimum detectable effect, sample size, and novelty effects.",
      "L1 vs L2 regularization: L1 produces sparse weights (feature selection); L2 shrinks all weights proportionally.",
      "SQL is still expected — practice window functions, CTEs, and self-joins.",
    ]
  },
  {
    id:"security", icon:"🛡️", name:"Cybersecurity Analyst", color:"#ff6b6b",
    desc:"OWASP Top 10, threat modeling, incident response, cryptography, and network security.",
    topics:["OWASP Top 10","Cryptography","Network Security","Incident Response"],
    qa:[
      { topic:"OWASP Top 10", items:[
        { q:"Explain SQL Injection and how to prevent it.", diff:"easy",
          a:"SQL injection occurs when user input is concatenated into SQL queries, allowing attackers to manipulate query logic.\n\nExample: WHERE name='' OR '1'='1' bypasses authentication. Prevention: (1) Parameterized queries / prepared statements — always. (2) ORM with parameterization. (3) Input validation and allowlisting. (4) Least-privilege DB accounts.",
          tip:"" },
        { q:"What is CSRF and how does SameSite help?", diff:"medium",
          a:"CSRF tricks authenticated users into submitting requests from a malicious page — the browser automatically sends session cookies.\n\nPrevention: (1) CSRF tokens — per-session secret in forms, verified server-side. (2) SameSite=Strict: cookie only sent on same-site requests. SameSite=Lax: sent on top-level GET navigations. (3) Verify Origin/Referer headers for state-changing operations.",
          tip:"" },
        { q:"Explain XSS types and prevention.", diff:"medium",
          a:"XSS allows attackers to inject scripts that execute in victims' browsers.\n\nStored XSS: script saved in DB, served to all users. Reflected XSS: script in URL reflected in response. DOM-based XSS: client-side JS modifies DOM unsafely.\n\nPrevention: context-aware output encoding, Content Security Policy header, use frameworks that auto-escape (React, Vue), HttpOnly cookies.",
          tip:"" },
      ]},
      { topic:"Cryptography", items:[
        { q:"Hashing vs encryption vs encoding.", diff:"medium",
          a:"Encoding: format transformation (Base64, URL) — NOT security, easily reversed.\n\nHashing: one-way irreversible (bcrypt, Argon2 for passwords; SHA-256 for integrity).\n\nEncryption: two-way with a key. Symmetric (AES-256): same key both ways. Asymmetric (RSA/ECC): public encrypts, private decrypts.\n\nFor passwords: ALWAYS hash with bcrypt/Argon2, NEVER encrypt.",
          tip:"" },
      ]},
      { topic:"Network Security", items:[
        { q:"IDS vs IPS — what's the difference?", diff:"medium",
          a:"IDS: passive monitoring — analyzes traffic and generates alerts but does NOT block anything.\n\nIPS: inline monitoring — actively blocks malicious traffic in real time. Risk: false positives can block legitimate traffic.\n\nModern NGFWs combine both. NIDS/NIPS monitors network; HIDS/HIPS monitors the host. Defense-in-depth uses both layers.",
          tip:"" },
      ]},
      { topic:"Incident Response", items:[
        { q:"What are the phases of incident response?", diff:"medium",
          a:"NIST SP 800-61 lifecycle: (1) Preparation — policies, playbooks, tooling, team training. (2) Detection & Analysis — identify IoCs, scope and classify severity. (3) Containment — isolate affected systems. (4) Eradication — remove malware, close vectors, patch. (5) Recovery — restore, validate, monitor. (6) Lessons Learned — post-incident review, update playbooks.",
          tip:"" },
      ]},
    ],
    challenges:[
      { title:"Secure Password Hashing with bcrypt", diff:"medium", lang:"Node.js",
        desc:"Implement <strong>password hashing and verification</strong> correctly. Never store plaintext or MD5/SHA1.",
        input:'password = "hunter2"', output:"bcrypt hash; verify returns true/false",
        code:`const bcrypt = require('bcrypt');
const ROUNDS = 12; // 2^12 iterations

// Registration
async function hashPassword(plaintext) {
  // bcrypt auto-generates & embeds a unique salt
  return bcrypt.hash(plaintext, ROUNDS);
}

// Login
async function verifyPassword(plaintext, storedHash) {
  // constant-time compare — prevents timing attacks
  return bcrypt.compare(plaintext, storedHash);
}

// NEVER do this:
// crypto.createHash('md5').update(pwd).digest('hex')
// MD5: 10 billion guesses/sec on GPU`,
        time:"O(2^rounds)", space:"O(1)" },
    ],
    tips:[
      "Always mention 'defense in depth' — no single control is sufficient.",
      "Know the difference between vulnerability, threat, risk, and exploit — interviewers test this vocabulary.",
      "For cloud security: shared responsibility model, IAM least privilege, encryption at rest vs in transit.",
      "Know STRIDE: Spoofing, Tampering, Repudiation, Info Disclosure, DoS, Elevation of Privilege.",
      "IR lifecycle: Preparation → Detection → Containment → Eradication → Recovery → Lessons learned.",
    ]
  },
  {
    id:"cloud", icon:"☁️", name:"Cloud Architect", color:"#00d4aa",
    desc:"AWS architecture, cost optimization, high availability, disaster recovery, and cloud-native design at scale.",
    topics:["AWS Core","High Availability","Cost Optimization","Serverless"],
    qa:[
      { topic:"AWS Core", items:[
        { q:"Compare EC2, ECS, EKS, and Lambda.", diff:"medium",
          a:"EC2: raw VMs — full control, pay for idle. ECS: managed container orchestration. EKS: managed Kubernetes — more portable. Lambda: serverless, pay per invocation, scale to zero, cold starts.\n\nDecision: Full control? EC2. Containers AWS-native? ECS Fargate. K8s portability? EKS. Event-driven? Lambda. Most new workloads start with ECS Fargate.",
          tip:"" },
        { q:"Explain S3 storage classes.", diff:"medium",
          a:"Standard: frequent access, 99.99% availability. Intelligent-Tiering: auto-moves based on access patterns. Standard-IA: infrequent access — lower storage, retrieval fee. Glacier Instant: archive with ms retrieval. Deep Archive: lowest cost, 12hr retrieval.\n\nLifecycle policies automate transitions: Standard → IA (30d) → Glacier (90d) → Deep Archive (1yr) → Expire.",
          tip:"" },
      ]},
      { topic:"High Availability", items:[
        { q:"Design a highly available web application on AWS.", diff:"hard",
          a:"Core: Route 53 (health checks + failover) → CloudFront (CDN + WAF) → ALB across 2+ AZs → Auto Scaling Group → RDS Multi-AZ → ElastiCache → S3 for static assets.\n\nFor 99.99% SLA: multi-region with Route 53 latency routing, cross-region RDS read replicas, AWS Global Accelerator for anycast edge.",
          tip:"" },
      ]},
      { topic:"Cost Optimization", items:[
        { q:"What are the main AWS cost optimization strategies?", diff:"medium",
          a:"(1) Right-size via CloudWatch + Compute Optimizer. (2) Reserved Instances / Savings Plans: 1–3yr commitment = 30–70% savings. (3) Spot Instances: 90% cheaper for fault-tolerant workloads. (4) Auto Scaling to zero at night. (5) S3 Lifecycle Policies for cold data. (6) Keep traffic within regions/AZs — cross-region transfer adds up.",
          tip:"" },
      ]},
      { topic:"Serverless", items:[
        { q:"Trade-offs of Lambda / serverless architecture.", diff:"medium",
          a:"Pros: no server management, scale to zero, pay per invocation, built-in HA.\n\nCons: cold starts (100ms–2s), 15-min max execution, stateless (external state required), harder local debugging, vendor lock-in.\n\nBest for: event-driven, scheduled jobs, variable-traffic APIs, webhooks. Avoid for: long-running processes or consistent high-throughput (always-on is cheaper at scale).",
          tip:"" },
      ]},
    ],
    challenges:[
      { title:"S3 Event-Driven Lambda Pipeline", diff:"medium", lang:"Python",
        desc:"Write a Lambda handler for a <strong>serverless image processing pipeline</strong>: S3 upload → resize → store thumbnail → SNS notify.",
        input:"S3 PutObject event (image.jpg)", output:"200px thumbnail stored + SNS notification",
        code:`import boto3, io
from PIL import Image

s3  = boto3.client('s3')
sns = boto3.client('sns')

def handler(event, context):
    rec    = event['Records'][0]
    bucket = rec['s3']['bucket']['name']
    key    = rec['s3']['object']['key']

    body = s3.get_object(Bucket=bucket, Key=key)['Body'].read()
    img  = Image.open(io.BytesIO(body))
    img.thumbnail((200, 200), Image.LANCZOS)

    buf = io.BytesIO()
    img.save(buf, 'JPEG', quality=85)
    thumb = f'thumbs/{key}'
    s3.put_object(Bucket=bucket, Key=thumb,
                  Body=buf.getvalue(), ContentType='image/jpeg')

    sns.publish(TopicArn='arn:aws:sns:...:Done',
               Message=f'Ready: {thumb}')
    return {'statusCode': 200}`,
        time:"O(pixels)", space:"O(image size)" },
    ],
    tips:[
      "Always discuss costs — architects are expected to optimize spend, not just architect for performance.",
      "Know the Well-Architected Framework 6 pillars: Operational Excellence, Security, Reliability, Performance, Cost, Sustainability.",
      "For any design, mention observability: CloudWatch metrics, X-Ray tracing, custom dashboards.",
      "IAM: least privilege, roles over users, resource-based vs identity-based policies.",
      "Know when Aurora wins over RDS — 5x performance, shared storage, multi-master.",
    ]
  },
  {
    id:"ml", icon:"🤖", name:"ML Engineer", color:"#a78bff",
    desc:"Production ML systems, MLOps, model serving, feature engineering, and LLMs in the real world.",
    topics:["MLOps","Model Serving","Features","LLMs & GenAI"],
    qa:[
      { topic:"MLOps", items:[
        { q:"What is a feature store and why does it matter?", diff:"medium",
          a:"A feature store centrally computes, stores, and serves ML features consistently.\n\nBenefits: (1) No duplicate feature engineering code. (2) Training-serving consistency — prevents skew. (3) Point-in-time correct retrieval — prevents temporal leakage. (4) Online (low-latency) and offline (batch) serving from the same source.\n\nTools: Feast, Tecton, Vertex AI Feature Store, SageMaker Feature Store.",
          tip:"" },
        { q:"How do you detect and handle training-serving skew?", diff:"hard",
          a:"Training-serving skew: model performs well offline but degrades in production because feature distributions differ.\n\nDetection: (1) Log raw inputs in production. (2) Compare distributions using KS test or PSI. (3) Monitor prediction distributions. (4) Shadow mode before full launch.\n\nPrevention: same feature pipeline code for training and serving — a feature store solves this elegantly.",
          tip:"" },
      ]},
      { topic:"Model Serving", items:[
        { q:"Explain shadow mode, canary, and A/B deployment strategies.", diff:"hard",
          a:"Shadow mode: new model runs in parallel, predictions logged but never shown — zero user risk.\n\nCanary: route small % traffic (1–5%) to new model, increase gradually if metrics hold.\n\nA/B test: statistically rigorous randomized experiment requiring sample size calculation and significance testing.\n\nRecommended flow: Shadow → Canary → A/B Test → Full rollout.",
          tip:"" },
      ]},
      { topic:"Features", items:[
        { q:"What are the most impactful feature engineering techniques?", diff:"medium",
          a:"Numerical: normalization/standardization, log transforms for skewed distributions, polynomial features.\n\nCategorical: one-hot (low cardinality), target encoding (high cardinality), embeddings for DL.\n\nTemporal: lag features, rolling statistics, time-since-event, cyclical encoding (sin/cos for hour/day).\n\nAlways: handle missing values deliberately, treat outliers, validate no data leakage.",
          tip:"" },
      ]},
      { topic:"LLMs & GenAI", items:[
        { q:"RAG vs fine-tuning — when do you choose each?", diff:"medium",
          a:"RAG retrieves relevant documents at inference time and injects them into the prompt context. Use RAG when: knowledge changes frequently, you need citations, knowledge is proprietary, or compute budget is limited.\n\nFine-tuning trains model weights on your data. Use when: you need a specific style/persona, the task is highly specialized, or you need lower latency at very high volume.\n\nBest practice: start with RAG, then fine-tune on top if quality is still insufficient.",
          tip:"" },
      ]},
    ],
    challenges:[
      { title:"Cosine Similarity for Embeddings", diff:"medium", lang:"Python",
        desc:"Implement <strong>cosine similarity</strong> from scratch — core measure in embedding search, recommendations, and RAG retrieval.",
        input:"v1=[1,0,1], v2=[0,1,1]", output:"similarity ≈ 0.5",
        code:`import numpy as np

def cosine_similarity(v1, v2):
    """cos(θ) = dot(v1,v2) / (||v1|| * ||v2||)  range: [-1, 1]"""
    v1 = np.array(v1, dtype=float)
    v2 = np.array(v2, dtype=float)
    denom = np.linalg.norm(v1) * np.linalg.norm(v2)
    return 0.0 if denom == 0 else float(np.dot(v1, v2) / denom)

# Vectorised batch version (for vector DB lookups)
def top_k_similar(query, corpus, k=5):
    q = query / np.linalg.norm(query)
    C = corpus / np.linalg.norm(corpus, axis=1, keepdims=True)
    scores = C @ q          # O(n*d)
    idx    = np.argsort(scores)[::-1][:k]
    return idx, scores[idx]`,
        time:"O(d) single, O(n·d) batch", space:"O(1)" },
    ],
    tips:[
      "Monitor model drift and data drift separately — different root causes and remediation strategies.",
      "For LLM interviews: know prompt engineering patterns — few-shot, chain-of-thought, ReAct agent loops.",
      "MLflow and Weights & Biases are standard — know what experiment tracking operationally solves.",
      "Quantization and ONNX export are key for production deployment efficiency.",
      "Most asked ML system design: recommendation system. Know the two-tower model architecture.",
    ]
  },
  {
    id:"mobile", icon:"📱", name:"Mobile Developer", color:"#4ade80",
    desc:"React Native, iOS, Android, performance optimization, and mobile-specific architecture patterns.",
    topics:["React Native","iOS","Android","Performance"],
    qa:[
      { topic:"React Native", items:[
        { q:"How does the React Native bridge work? What is JSI?", diff:"hard",
          a:"Old architecture: JS thread and Native thread communicate via an async bridge — serializing to JSON and back. High-frequency operations (animations, gestures) suffer a bottleneck.\n\nNew Architecture (JSI — JavaScript Interface): JS holds a direct C++ reference to native objects, enabling synchronous calls without serialization. Built on this: Fabric (new renderer), TurboModules (lazy native loading), Codegen (type-safe interfaces).",
          tip:"" },
        { q:"FlatList vs ScrollView — when to use each?", diff:"easy",
          a:"ScrollView: renders all children at once — fine for small fixed content (<20 items). Never use for lists that could grow — everything mounts regardless of visibility.\n\nFlatList: virtualized — only visible items are mounted. Use getItemLayout for fixed-height items (avoids measurement overhead). FlashList (Shopify) is a drop-in replacement with significantly better performance using recycled views.",
          tip:"" },
      ]},
      { topic:"Performance", items:[
        { q:"How do you identify and fix React Native performance issues?", diff:"medium",
          a:"Identification: Flipper + React DevTools Profiler for JS thread. Look for dropped frames (<60fps) and thread blockage.\n\nFixes: (1) Animate on native thread: useNativeDriver: true or Reanimated 2. (2) Memoize: React.memo, useMemo, useCallback. (3) FlatList tuning: getItemLayout, windowSize, removeClippedSubviews. (4) Avoid inline styles and anonymous functions in render. (5) Hermes engine (default in RN 0.70+).",
          tip:"" },
      ]},
      { topic:"iOS", items:[
        { q:"Explain ARC (Automatic Reference Counting) in Swift.", diff:"medium",
          a:"ARC tracks strong reference counts to each class instance. When count drops to zero, the instance is deallocated. ARC works at compile time — no GC pause at runtime.\n\nPitfall: retain cycles — two objects holding strong references to each other. Fix: use weak or unowned for back-references. Common pattern: [weak self] in closures, weak var delegate in delegate pattern.",
          tip:"" },
      ]},
      { topic:"Android", items:[
        { q:"Explain the Android Activity lifecycle.", diff:"medium",
          a:"Key callbacks: onCreate (init, set layout) → onStart (visible) → onResume (interactive, foreground) → onPause (partially hidden) → onStop (fully hidden) → onDestroy (finishing).\n\nCritical: save state in onPause, release camera/sensors in onStop, use ViewModel to survive config changes (rotation recreates Activity by default).",
          tip:"" },
      ]},
    ],
    challenges:[
      { title:"useDebounce Custom Hook", diff:"easy", lang:"React Native / TypeScript",
        desc:"Build a reusable <strong>useDebounce hook</strong> — used in search inputs to avoid API calls on every keystroke.",
        input:"useDebounce(searchText, 500)", output:"debounced value updates 500ms after user stops typing",
        code:`import { useState, useEffect } from 'react';

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(value);
    }, delay);
    return () => clearTimeout(timer); // cleanup on change
  }, [value, delay]);

  return debounced;
}

// Usage
function SearchScreen() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (debouncedQuery) searchAPI(debouncedQuery);
  }, [debouncedQuery]);
}`,
        time:"O(1)", space:"O(1)" },
    ],
    tips:[
      "Know Expo vs bare React Native and when the complexity of ejecting is justified.",
      "iOS: [weak self] in closures, async/await with Swift concurrency, and ARC retain cycle debugging.",
      "Android: ViewModel + LiveData/StateFlow lifecycle, Kotlin coroutines and their scope.",
      "App startup time: Hermes bytecode, lazy module loading, and splash screen best practices.",
      "State management: Zustand and Jotai are replacing Redux in new RN apps — know when context alone is enough.",
    ]
  },
];

/* ═══════════════════════════════════════════════════════════
   TINY SHARED COMPONENTS
═══════════════════════════════════════════════════════════ */
function Badge({ children, color = C.accent, bg }) {
  return (
    <span className="badge" style={{
      background: bg || `${color}18`,
      border: `1px solid ${color}33`,
      color,
    }}>{children}</span>
  );
}

function DiffBadge({ diff }) {
  const map = { easy: C.green, medium: C.gold, hard: C.accent2 };
  return <Badge color={map[diff] || C.gold}>{diff}</Badge>;
}

/* ═══════════════════════════════════════════════════════════
   QA CARD
═══════════════════════════════════════════════════════════ */
function QACard({ item, idx }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="qa-card">
      <div className="qa-q" onClick={() => setOpen(o => !o)}>
        <span className="qa-num">Q{String(idx + 1).padStart(2, "0")}</span>
        <span className="qa-text">{item.q}</span>
        <div className="qa-meta">
          <DiffBadge diff={item.diff} />
          <span className="qa-chevron" style={{ transform: open ? "rotate(180deg)" : "none" }}>▼</span>
        </div>
      </div>
      {open && (
        <div className="qa-answer">
          <div className="qa-answer-text">{item.a}</div>
          {item.tip && (
            <div className="qa-tip">
              <span className="qa-tip-label">💡 Tip</span>
              <span className="qa-tip-text">{item.tip}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   CHALLENGE CARD
═══════════════════════════════════════════════════════════ */
function ChallengeCard({ ch }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="ch-card">
      <div className="ch-header">
        <div className="ch-title"><span>💻</span>{ch.title}</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <DiffBadge diff={ch.diff} />
          <Badge color={C.muted} bg="rgba(255,255,255,0.04)">{ch.lang}</Badge>
        </div>
      </div>
      <div className="ch-body">
        <p className="ch-desc" dangerouslySetInnerHTML={{ __html: ch.desc }} />
        <div className="io-grid">
          {[["Input", ch.input], ["Output", ch.output]].map(([l, v]) => (
            <div key={l} className="io-box">
              <div className="io-label">{l}</div>
              <div className="io-val">{v}</div>
            </div>
          ))}
        </div>
        <button className="sol-btn" onClick={() => setOpen(o => !o)}>
          {open ? "▼ Hide Solution" : "▶ Show Solution"}
        </button>
        {open && (
          <div className="code-wrap">
            <div className="code-header">
              <div className="code-dots">
                {["#ff5f56", "#ffbd2e", "#27c93f"].map(col => (
                  <div key={col} className="code-dot" style={{ background: col }} />
                ))}
              </div>
              <span className="code-lang">{ch.lang}</span>
            </div>
            <pre dangerouslySetInnerHTML={{ __html: ch.code }} />
            <div className="complexity" style={{ padding: "0 14px 14px" }}>
              {[["Time", ch.time], ["Space", ch.space]].map(([k, v]) => (
                <span key={k} className="complexity-badge">{k}: <span>{v}</span></span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SIDEBAR CONTENTS (shared between drawer + desktop)
═══════════════════════════════════════════════════════════ */
function SidebarNav({ role, activeTopic, onTopic, onJump }) {
  return (
    <div style={{ padding: "16px 12px" }}>
      <div className="sidebar-label">Topics</div>
      {role.topics.map(t => {
        const count = role.qa.find(s => s.topic === t)?.items.length || 0;
        return (
          <div key={t} className={`sidebar-item${activeTopic === t ? " active" : ""}`}
            onClick={() => onTopic(t)}>
            <span style={{ flex: 1 }}>{t}</span>
            {count > 0 && <span className="sidebar-count">{count}</span>}
          </div>
        );
      })}
      <div className="sidebar-divider" />
      <div className="sidebar-label">Jump to</div>
      {[["coding", "💻 Coding Challenges"], ["tips", "🎯 Interview Tips"]].map(([id, lbl]) => (
        <div key={id} className="sidebar-item" onClick={() => onJump(id)}>{lbl}</div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ROLE PAGE
═══════════════════════════════════════════════════════════ */
function RolePage({ role, onBack }) {
  const [tab, setTab] = useState("qa");
  const [activeTopic, setActiveTopic] = useState(role.topics[0]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const topicRefs = useRef({});
  const totalQ = role.qa.reduce((s, t) => s + t.items.length, 0);

  useEffect(() => { window.scrollTo(0, 0); setDrawerOpen(false); }, [role]);

  const goTopic = (t) => {
    setActiveTopic(t); setTab("qa"); setDrawerOpen(false);
    setTimeout(() => topicRefs.current[t]?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  };
  const jump = (id) => { setTab(id); setDrawerOpen(false); window.scrollTo({ top: 180, behavior: "smooth" }); };

  return (
    <div className="role-page">
      {/* Header */}
      <div className="role-header">
        <button onClick={onBack} className="nav-link" style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 7 }}>
          ← Back to All Roles
        </button>
        <div className="role-header-inner">
          <div className="role-icon-wrap">{role.icon}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="role-title">{role.name}</div>
            <div className="role-desc">{role.desc}</div>
            <div className="role-badges">
              <Badge color={C.accent}>📋 {totalQ} Questions</Badge>
              <Badge color={C.accent3}>💻 {role.challenges.length} Challenges</Badge>
              <Badge color={C.gold}>🎯 {role.topics.length} Topics</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar button */}
      <button className="mob-sidebar-btn" onClick={() => setDrawerOpen(true)}>
        <span>☰ Topics & Navigation</span><span style={{ color: C.muted }}>▼</span>
      </button>

      {/* Drawer (mobile) */}
      <div className={`drawer-overlay${drawerOpen ? " open" : ""}`} onClick={() => setDrawerOpen(false)} />
      <div className={`sidebar-drawer${drawerOpen ? " open" : ""}`}>
        <div style={{ padding: "10px 12px 6px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: ".6rem", color: C.muted, letterSpacing: ".15em", textTransform: "uppercase" }}>Navigate</span>
          <button onClick={() => setDrawerOpen(false)} style={{ background: "none", border: "none", color: C.muted, fontSize: "1rem", cursor: "pointer" }}>✕</button>
        </div>
        <SidebarNav role={role} activeTopic={activeTopic} onTopic={goTopic} onJump={jump} />
      </div>

      <div className="role-body">
        {/* Desktop sidebar */}
        <div className="sidebar">
          <SidebarNav role={role} activeTopic={activeTopic} onTopic={goTopic} onJump={jump} />
        </div>

        {/* Content */}
        <div className="role-content">
          {/* Tabs */}
          <div className="tabs-bar">
            {[["qa", "Q & A"], ["coding", "Coding"], ["tips", "Tips"]].map(([id, lbl]) => (
              <button key={id} className={`tab${tab === id ? " active" : ""}`} onClick={() => setTab(id)}>{lbl}</button>
            ))}
          </div>

          {/* Q&A */}
          {tab === "qa" && (
            <div className="fu">
              {role.qa.map(section => (
                <div key={section.topic} ref={el => topicRefs.current[section.topic] = el} className="topic-header">
                  <div className="topic-title">{section.topic}</div>
                  <div className="topic-sub">{section.items.length} questions covering core concepts asked in real interviews.</div>
                  <div style={{ height: 12 }} />
                  {section.items.map((item, i) => <QACard key={i} item={item} idx={i} />)}
                  <div style={{ height: 16 }} />
                </div>
              ))}
            </div>
          )}

          {/* Coding */}
          {tab === "coding" && (
            <div className="fu">
              <div className="topic-header">
                <div className="topic-title">Coding Challenges</div>
                <div className="topic-sub">Hands-on problems asked in technical screens. Understand the pattern, not just the answer.</div>
              </div>
              <div style={{ height: 12 }} />
              {role.challenges.map((ch, i) => <ChallengeCard key={i} ch={ch} />)}
            </div>
          )}

          {/* Tips */}
          {tab === "tips" && (
            <div className="fu">
              <div className="topic-header">
                <div className="topic-title">Interview Tips</div>
                <div className="topic-sub">Insider advice from engineers who've interviewed at top companies for this role.</div>
              </div>
              <div style={{ height: 12 }} />
              {role.tips.map((tip, i) => (
                <div key={i} className="tip-card">
                  <span className="tip-num">TIP {String(i + 1).padStart(2, "0")}</span>
                  <span className="tip-text">{tip}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   HOME PAGE
═══════════════════════════════════════════════════════════ */
function HomePage({ onSelectRole }) {
  const rolesRef = useRef(null);
  const scrollToRoles = () => rolesRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <div className="hero-grid" />
        <div className="hero-orb" />
        <div className="hero-eyebrow fu">🎯 Real Questions · Real Answers · Real Jobs</div>
        <h1 className="hero-title fu1">
          Ace Every<br />
          <em>IT Interview</em><br />
          You Walk Into
        </h1>
        <p className="hero-sub fu2">
          Role-specific Q&A banks and coding challenges curated from real interviews at top tech companies.
          Pick your role, study smart, land the offer.
        </p>
        <div className="hero-btns fu3">
          <button className="btn-primary" onClick={scrollToRoles}>Explore All Roles →</button>
          <button className="btn-ghost" onClick={() => onSelectRole("frontend")}>See Sample Q&A</button>
        </div>
        <div className="stats-bar fu4">
          {[["8", "Roles"], ["120+", "Questions"], ["20+", "Challenges"], ["5", "Tips/Role"]].map(([n, l], i, arr) => (
            <div key={l} className="stat-item" style={{ borderRight: i < arr.length - 1 ? `1px solid ${C.border}` : "none" }}>
              <div className="stat-num">{n}</div>
              <div className="stat-lbl">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Ticker */}
      <div className="ticker-wrap">
        <div className="ticker-inner">
          {[...ROLES, ...ROLES].map((r, i) => (
            <div key={i} className="ticker-item">
              <span style={{ color: C.accent, marginRight: 7 }}>✦</span>{r.name}
            </div>
          ))}
        </div>
      </div>

      {/* Roles grid */}
      <div className="section" ref={rolesRef}>
        <div className="section-label">// choose your path</div>
        <h2 className="section-title">Browse by <em>Role</em></h2>
        <div className="roles-grid">
          {ROLES.map(r => {
            const tq = r.qa.reduce((s, t) => s + t.items.length, 0);
            return (
              <div key={r.id} className="role-card"
                onClick={() => onSelectRole(r.id)}
                onMouseEnter={e => Object.assign(e.currentTarget.style, { borderColor: `${r.color}55`, boxShadow: `0 16px 46px ${r.color}22` })}
                onMouseLeave={e => Object.assign(e.currentTarget.style, { borderColor: C.border, boxShadow: "none" })}>
                <div className="role-card-icon">{r.icon}</div>
                <div className="role-card-name">{r.name}</div>
                <div className="role-card-meta">{tq}q · {r.challenges.length} challenges</div>
                <div className="role-card-arrow">↗</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* How it works */}
      <div className="section" style={{ paddingTop: 0 }}>
        <div className="section-label">// the process</div>
        <h2 className="section-title">How It <em>Works</em></h2>
        <div className="steps-grid">
          {[
            ["🎯", "Pick Your Role", "Browse 8 IT roles from frontend to cloud security. Find the one matching your target job."],
            ["📖", "Study Topic by Topic", "Work through curated Q&A and coding challenges — from fundamentals to senior-level depth."],
            ["✅", "Crack the Interview", "Walk in knowing exactly what to expect and the depth of answer that impresses at every level."],
          ].map(([icon, title, desc], i) => (
            <div key={i} className="step">
              <div className="step-num">0{i + 1}</div>
              <div className="step-icon">{icon}</div>
              <div className="step-title">{title}</div>
              <p className="step-desc">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="cta">
        <h2 className="cta-title">Ready to Forge Your<br /><em>Dream Offer?</em></h2>
        <p className="cta-sub">Pick a role and start studying questions from real interviews — completely free.</p>
        <div style={{ marginTop: 24 }}>
          <button className="btn-primary" onClick={scrollToRoles}>Start Now →</button>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-logo">
          <div className="logo-icon">PO</div>
          PatternOS
        </div>
        <div className="footer-copy">© 2026 PatternOS. Built for ambitious IT folks.</div>
        <div className="footer-links">
          {["Privacy", "Terms", "Contact"].map(l => <a key={l} href="#">{l}</a>)}
        </div>
      </footer>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   NAVBAR
═══════════════════════════════════════════════════════════ */
function Navbar({ currentRole, onBack, onExplore }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobOpen, setMobOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => setMobOpen(false), [currentRole]);

  return (
    <>
      <nav className={`nav${scrolled || currentRole ? " scrolled" : ""}`}>
        <div className="nav-logo" onClick={onBack}>
          <div className="logo-icon">PO</div>
          <span>PatternOS</span>
        </div>

        {/* Desktop links */}
        <div className="nav-actions">
          <button className="nav-link" onClick={currentRole ? onBack : onExplore}>
            {currentRole ? "← All Roles" : "Roles"}
          </button>
          <button className="nav-cta" onClick={onExplore}>
            {currentRole ? "All Roles" : "Explore →"}
          </button>
        </div>

        {/* Mobile hamburger */}
        <button className="hamburger" onClick={() => setMobOpen(o => !o)}>
          {mobOpen ? "✕" : "☰"}
        </button>
      </nav>

      {/* Mobile menu */}
      <div className={`mob-menu${mobOpen ? " open" : ""}`}>
        <button className="mob-menu-item" onClick={() => { onBack(); setMobOpen(false); }}>🏠 Home</button>
        <button className="mob-menu-item" onClick={() => { onExplore(); setMobOpen(false); }}>📚 All Roles</button>
        <div style={{ height: 1, background: C.border, margin: "4px 0 8px" }} />
        {ROLES.map(r => (
          <button key={r.id} className="mob-menu-role"
            onClick={() => { document.dispatchEvent(new CustomEvent("selectRole", { detail: r.id })); setMobOpen(false); }}>
            <span>{r.icon}</span><span>{r.name}</span>
          </button>
        ))}
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   ROOT
═══════════════════════════════════════════════════════════ */
export default function App() {
  const [role, setRole] = useState(null);

  const selectRole = useCallback(id => {
    const r = ROLES.find(x => x.id === id);
    if (r) { setRole(r); window.scrollTo(0, 0); }
  }, []);

  const goHome = useCallback(() => { setRole(null); window.scrollTo(0, 0); }, []);

  const exploreRoles = useCallback(() => {
    setRole(null);
    setTimeout(() => document.querySelector(".roles-grid")?.scrollIntoView({ behavior: "smooth" }), 80);
  }, []);

  useEffect(() => {
    const h = e => selectRole(e.detail);
    document.addEventListener("selectRole", h);
    return () => document.removeEventListener("selectRole", h);
  }, [selectRole]);

  return (
    <>
      <style>{CSS}</style>
      <Navbar currentRole={role} onBack={goHome} onExplore={exploreRoles} />
      {role
        ? <RolePage key={role.id} role={role} onBack={goHome} />
        : <HomePage onSelectRole={selectRole} />
      }
    </>
  );
}
