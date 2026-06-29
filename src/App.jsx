import { useState, useEffect, useCallback, useRef } from "react";

// ── Design Tokens ─────────────────────────────────────────────────────
const C = {
  bg:       "#F2EDE6", bgAlt:"#EAE4DC", bgDark:"#E0D9CF",
  white:    "#FAF8F4", ink:"#1E1A17", inkMid:"#4A3F38",
  inkLight: "#8A7E76", inkFaint:"#B8AFA6",
  brick:    "#B85C38", brickDk:"#8F4429", brickPale:"#F0DDD5",
  rule:     "#D8D0C6",
};
const EDIT_PW = "ruru2025"; // ← 改這裡換密碼

// ── Default content (editable) ────────────────────────────────────────
const DEFAULT_CONTENT = {
  hero: {
    eyebrow: "Social Media Strategist",
    line1:   "用內容說故事，",
    line2:   "用策略創造影響。",
    meta:    ["社群行銷 4+ 年", "KOL 合作・文案企劃", "@fn_ruru213"],
  },
  about: {
    heading1: "不只經營品牌，",
    heading2: "我也是品牌。",
    para1: "畢業於世新大學口語傳播學系。曾在整合行銷公司負責多品牌社群帳號操作、KOL 接洽與文案撰寫。同時以個人 IG 帳號 @fn_ruru213 經營集換式卡牌、公仔收藏與手作穿戴甲。",
    para2: "零售現場的這段時間，我沒有離開行銷——只是在用另一種方式觀察消費者。AI 工具、短影音趨勢、購買決策的瞬間，我都在第一線感受。",
    skills: [
      ["社群經營","Facebook・Instagram・Threads"],
      ["內容企劃","短影音腳本・Reels・活動文案"],
      ["KOL 合作","接洽談判・成效追蹤・合約管理"],
      ["AI 工具","Claude・ChatGPT・Gemini"],
      ["創作品牌","穿戴甲・UV Resin・手工飾品"],
    ],
  },
  experience: {
    jobs: [
      { company:"雙融域 AMBI SPACE", role:"社群行銷專員", period:"2023 – 2024", type:"整合行銷", desc:"核心行銷經歷。負責多品牌 Facebook / Instagram 帳號策略規劃與日常執行，KOL 合作從接洽到成效追蹤全流程管理，同時主導活動文案撰寫與視覺文字規劃。", bullets:["多品牌社群帳號操作與排程","KOL 接洽・合約管理・成效追蹤","活動文案與視覺文字企劃","品牌社群策略提案"] },
      { company:"我識數位整合行銷", role:"整合行銷執行", period:"2022 – 2023", type:"數位行銷", desc:"協助執行客戶品牌整合行銷專案，負責內容企劃、素材溝通與成效報告製作，累積跨產業操作經驗。", bullets:["整合行銷專案執行","內容企劃與素材溝通","數據整理與成效報告"] },
      { company:"野獸國創意", role:"門市 × 社群雙軌", period:"2021 – 2022", type:"零售・內容", desc:"結合門市銷售與社群內容產出，在潮流公仔領域耕耘社群，建立消費者溝通與社群經營的雙向能力。", bullets:["門市銷售與顧客體驗","社群帳號內容產出","潮流玩具社群耕耘"] },
      { company:"寶可夢台灣", role:"門市專員", period:"2025 – 現在", type:"零售", desc:"Pokémon Center 台灣門市。維持對 IP 消費趨勢的第一線觀察，同期積極自學 AI 工具應用與短影音策略，為回歸行銷做準備。", bullets:["門市接待與銷售","消費者行為觀察","AI 工具自主學習"] },
    ],
  },
  works: {
    items: [
      { id:1, category:"Social Media", title:"雙融域品牌社群策略", sub:"多品牌 IG / FB 帳號操作", desc:"內容企劃到排程執行，協助品牌建立一致視覺語言與社群聲量。KOL 合作全流程管理。", tags:"Instagram, Facebook, KOL, 文案", link:"" },
      { id:2, category:"Personal Brand", title:"@fn_ruru213", sub:"個人創作 IG 帳號", desc:"自主經營社群，涵蓋集換式卡牌、公仔收藏與手作穿戴甲。品味一致的個人品牌。", tags:"Instagram, 內容創作, 手作商品", link:"https://instagram.com/fn_ruru213" },
      { id:3, category:"AI Application", title:"AI 輔助行銷工作流", sub:"Claude · ChatGPT · Gemini", desc:"日常使用 AI 工具協助文案發想、競品分析與內容規劃，大幅提升行銷工作效率。", tags:"Claude, ChatGPT, Gemini, Prompt", link:"" },
      { id:4, category:"Creative Business", title:"穿戴甲創作系列", sub:"冰后美學品牌規劃", desc:"冰藍白銀主軸，開發貓眼膠、塑甲延甲等技術，建立手作品牌識別與電商策略。", tags:"穿戴甲, UV Resin, 品牌設計", link:"" },
    ],
  },
  contact: {
    heading1: "讓我們",
    heading2: "一起合作。",
    intro: "歡迎社群顧問、KOL 專案或 AI 行銷工作流相關合作洽詢。",
    email: "your@email.com",
    ig: "@fn_ruru213",
    location: "新北市・台灣",
  },
};

const JOURNAL_KEY = "ruru_journal_v1";
const AVATAR_KEY  = "ruru_avatar_v1";
const RESUME_KEY  = "ruru_resume_v1";
const GA_KEY      = "ruru_ga_id_v1";
const VIDEO_KEY   = "ruru_videos_v1";
const CONTENT_KEY = "ruru_content_v1";
const DEFAULT_VIDEOS = [
  { id:1, type:"reel", title:"品牌社群策略 Reel", desc:"展示社群策略規劃與執行成效的短影音範例。", tag:"社群行銷", url:"https://www.instagram.com/reel/xxxxxx/", videoSrc:"" },
  { id:2, type:"reel", title:"KOL 合作紀錄", desc:"與 KOL 合作的幕後花絮與成效分享。", tag:"KOL 合作", url:"https://www.instagram.com/reel/xxxxxx/", videoSrc:"" },
  { id:3, type:"upload", title:"穿戴甲製作過程", desc:"從甲片設計到完成品的完整製作紀錄。", tag:"手作創作", url:"", videoSrc:"" },
];
const DEFAULT_POSTS = [
  { id:1, date:"2025.06", tag:"行銷觀察", title:"AI 工具正在改變內容創作的節奏", body:"最近在研究如何把 Claude、ChatGPT 導入日常行銷工作流——不是用來取代創意，而是用來加速從「想法」到「成品」的過程。試用了幾種 prompt 框架之後，發現對文案初稿的幫助最大，可以節省大概一半的時間。" },
  { id:2, date:"2025.05", tag:"手作日記", title:"第一批穿戴甲開賣前的準備", body:"從選材到拍攝，花了比預期更多的時間在「怎麼讓甲片在手機螢幕上看起來有質感」這件事上。學到一件事：光線比任何濾鏡都重要。" },
  { id:3, date:"2025.04", tag:"求職紀錄", title:"回到行銷這條路的一些想法", body:"在零售現場待了一段時間之後，我更確定自己想回來做社群策略。不是因為這裡不好，而是因為我發現每次看到別的品牌發 IG 動態，我都會在心裡默默改稿。" },
];

// ── Hooks ─────────────────────────────────────────────────────────────
function useBreakpoint() {
  const [w, setW] = useState(typeof window!=="undefined"?window.innerWidth:375);
  useEffect(()=>{const fn=()=>setW(window.innerWidth);window.addEventListener("resize",fn);return()=>window.removeEventListener("resize",fn);},[]);
  return { isMobile: w<768 };
}

function useStyles(editMode) {
  useEffect(()=>{
    const link=document.createElement("link");
    link.rel="stylesheet";
    link.href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;700&family=EB+Garamond:ital,wght@0,400;1,400&display=swap";
    document.head.appendChild(link);
    const s=document.createElement("style");
    s.textContent=`
      *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
      html{scroll-behavior:smooth;-webkit-text-size-adjust:100%;}
      body{background:${C.bg};color:${C.ink};overflow-x:hidden;}
      ::-webkit-scrollbar{width:2px;}::-webkit-scrollbar-thumb{background:${C.inkFaint};}
      .reveal{opacity:0;transform:translateY(32px);transition:opacity .65s cubic-bezier(.22,1,.36,1),transform .65s cubic-bezier(.22,1,.36,1);}
      .reveal.in{opacity:1;transform:translateY(0);}
      .nav-btn{background:none;border:none;cursor:pointer;font-family:'Noto Sans TC',sans-serif;font-size:12px;font-weight:300;letter-spacing:.16em;color:${C.inkLight};border-bottom:1px solid transparent;padding-bottom:2px;transition:color .2s,border-color .2s;}
      .nav-btn.on{color:${C.ink};border-bottom-color:${C.brick};}
      .exp-tab{display:flex;flex-direction:column;width:100%;text-align:left;background:none;border:none;cursor:pointer;border-left:2px solid transparent;padding:14px 16px;transition:background .2s,border-color .2s;}
      .exp-tab:hover{background:${C.bgDark};}
      .exp-tab.on{border-left-color:${C.brick};background:${C.bgAlt};}
      .wcard{padding:28px 24px;border:1px solid ${C.rule};background:${C.white};transition:background .3s,border-color .3s;}
      .wcard:not(.no-hover):hover{background:${C.ink};border-color:${C.ink};}
      .wcard:not(.no-hover):hover .wc-cat{color:${C.brick}!important;}
      .wcard:not(.no-hover):hover .wc-title{color:${C.bg}!important;}
      .wcard:not(.no-hover):hover .wc-sub{color:${C.inkFaint}!important;}
      .wcard:not(.no-hover):hover .wc-desc{color:#8A847E!important;}
      .wcard:not(.no-hover):hover .wc-tag{border-color:rgba(255,255,255,.1)!important;color:#666!important;}
      .wcard:not(.no-hover):hover .wc-arr{opacity:1!important;}
      .ul-link{position:relative;text-decoration:none;display:inline-block;}
      .ul-link::after{content:'';position:absolute;left:0;bottom:-1px;width:0;height:1px;background:${C.brick};transition:width .3s;}
      .ul-link:hover::after{width:100%;}
      .mob-menu{position:fixed;inset:0;z-index:300;background:${C.ink};display:flex;flex-direction:column;justify-content:center;align-items:center;gap:36px;}
      .e-field{font-family:'Noto Sans TC',sans-serif;font-weight:300;color:${C.ink};background:rgba(184,92,56,0.06);border:1px dashed ${C.brick};outline:none;resize:none;width:100%;padding:4px 6px;border-radius:2px;line-height:inherit;font-size:inherit;letter-spacing:inherit;}
      .e-field:focus{background:rgba(184,92,56,0.1);border-style:solid;}
      .blog-card{background:${C.white};border:1px solid ${C.rule};padding:24px;transition:border-color .2s;}
      .blog-card:hover{border-color:${C.brick};}
      .blog-tag{display:inline-block;padding:2px 10px;background:${C.brickPale};font-family:'Noto Sans TC',sans-serif;font-size:10px;font-weight:300;color:${C.brick};letter-spacing:.1em;}
      .e-btn{background:none;border:1px solid ${C.rule};padding:6px 14px;cursor:pointer;font-family:'Noto Sans TC',sans-serif;font-size:11px;font-weight:300;letter-spacing:.1em;color:${C.inkLight};transition:all .2s;}
      .e-btn:hover{border-color:${C.brick};color:${C.brick};}
      .e-btn.danger:hover{border-color:#c0392b;color:#c0392b;}
      .e-btn.primary{background:${C.brick};border-color:${C.brick};color:#fff;}
      .e-btn.primary:hover{background:${C.brickDk};border-color:${C.brickDk};color:#fff;}
      textarea,input[type=text],input[type=email],input[type=password]{width:100%;font-family:'Noto Sans TC',sans-serif;font-size:13px;font-weight:300;color:${C.ink};background:${C.white};border:1px solid ${C.rule};padding:9px 12px;outline:none;resize:vertical;transition:border-color .2s;letter-spacing:.04em;line-height:1.8;}
      textarea:focus,input:focus{border-color:${C.brick};}
    `;
    document.head.appendChild(s);
  },[]);
}

function useReveal() {
  useEffect(()=>{
    const t=setTimeout(()=>{
      const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");obs.unobserve(e.target);}}),{threshold:.08});
      document.querySelectorAll(".reveal").forEach(el=>obs.observe(el));
      return()=>obs.disconnect();
    },80);
    return()=>clearTimeout(t);
  },[]);
}

// ── Editable field component ──────────────────────────────────────────
function EF({ value, onChange, editMode, tag="span", rows, style={}, className="" }) {
  if (!editMode) return <span className={className} style={style}>{value}</span>;
  if (rows) return <textarea className="e-field" rows={rows} value={value} onChange={e=>onChange(e.target.value)} style={{...style,display:"block"}}/>;
  return <input type="text" className="e-field" value={value} onChange={e=>onChange(e.target.value)} style={style}/>;
}

// ── Shared UI ─────────────────────────────────────────────────────────
const Rule = ({style={}})=><div style={{height:"1px",background:C.rule,...style}}/>;
const PageNum = ({n,label,mb=32})=>(
  <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:mb}}>
    <span style={{fontFamily:"'EB Garamond',serif",fontSize:"11px",color:C.inkFaint,letterSpacing:".16em"}}>0{n}</span>
    <div style={{width:"28px",height:"1px",background:C.rule}}/>
    <span style={{fontFamily:"'Noto Sans TC',sans-serif",fontSize:"10px",fontWeight:300,letterSpacing:".26em",textTransform:"uppercase",color:C.inkLight}}>{label}</span>
  </div>
);
const BrickDot = ()=><span style={{display:"inline-block",width:"5px",height:"5px",background:C.brick,transform:"rotate(45deg)",flexShrink:0,marginTop:"6px"}}/>;

// ── EditBar ───────────────────────────────────────────────────────────
function EditBar({ editMode, setEditMode, showPw, setShowPw, onSave, onReset }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  const tryLogin = () => { if(pw===EDIT_PW){setEditMode(true);setShowPw(false);setPw("");setErr(false);}else{setErr(true);} };

  if (!showPw && !editMode) return null;
  return (
    <div style={{position:"fixed",bottom:0,left:0,right:0,zIndex:500,background:C.ink,borderTop:`2px solid ${C.brick}`,padding:"10px 20px",display:"flex",alignItems:"center",gap:"12px",flexWrap:"wrap"}}>
      {editMode ? (
        <>
          <span style={{fontFamily:"'Noto Sans TC',sans-serif",fontSize:"11px",fontWeight:300,letterSpacing:".12em",color:"rgba(242,237,230,.5)"}}>✏️ 編輯模式</span>
          <GAInput/>
          <div style={{marginLeft:"auto",display:"flex",gap:"8px"}}>
            <button className="e-btn" onClick={onReset} style={{color:"rgba(242,237,230,.4)",borderColor:"rgba(255,255,255,.15)"}}>還原預設</button>
            <button className="e-btn primary" onClick={()=>{onSave();setEditMode(false);}}>儲存並離開</button>
          </div>
        </>
      ) : (