import { useState, useEffect, useCallback, useRef } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

// ── Firebase ──────────────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyDlvO89p8rD4olaj1XZ-9pJiOfEb_6DRpg",
  authDomain: "ruru-portfolio.firebaseapp.com",
  projectId: "ruru-portfolio",
  storageBucket: "ruru-portfolio.firebasestorage.app",
  messagingSenderId: "147362244031",
  appId: "1:147362244031:web:4a731a1566b3dacc74ad0a"
};
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

async function loadFromFirestore(key, fallback) {
  try {
    const snap = await getDoc(doc(db, "portfolio", key));
    return snap.exists() ? snap.data().value : fallback;
  } catch { return fallback; }
}

async function saveToFirestore(key, value) {
  try {
    await setDoc(doc(db, "portfolio", key), { value });
  } catch(e) { console.warn("Firestore save failed", e); }
}

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
      .reveal{opacity:1;transform:translateY(0);}
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

function useReveal(loading) { /* disabled */ }

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


// ── GAInput ───────────────────────────────────────────────────────────────────
function GAInput() {
  const [val, setVal] = useState("");
  useEffect(()=>{ try{ setVal(localStorage.getItem(GA_KEY)||""); }catch{} },[]);
  const save = () => {
    try{ localStorage.setItem(GA_KEY, val.trim()); alert("GA ID 已儲存，重新整理後生效"); }catch{}
  };
  return (
    <div style={{display:"flex",alignItems:"center",gap:"6px",flexShrink:0}}>
      <span style={{fontFamily:"'Noto Sans TC',sans-serif",fontSize:"10px",fontWeight:300,letterSpacing:".1em",color:"rgba(242,237,230,.4)",whiteSpace:"nowrap"}}>GA ID</span>
      <input type="text" value={val} onChange={e=>setVal(e.target.value)} placeholder="G-XXXXXXXXXX"
        style={{width:"140px",height:"30px",background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.2)",color:"#fff",padding:"0 8px",fontSize:"11px",letterSpacing:".06em"}}/>
      <button className="e-btn" onClick={save} style={{color:"rgba(242,237,230,.5)",borderColor:"rgba(255,255,255,.15)",padding:"4px 10px",fontSize:"10px"}}>套用</button>
    </div>
  );
}

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
        <>
          <span style={{fontFamily:"'Noto Sans TC',sans-serif",fontSize:"11px",fontWeight:300,letterSpacing:".12em",color:"rgba(242,237,230,.6)"}}>輸入密碼進入編輯模式</span>
          <input type="password" placeholder="密碼" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&tryLogin()} style={{width:"160px",height:"34px",background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.2)",color:"#fff",padding:"0 10px"}}/>
          <button className="e-btn primary" onClick={tryLogin}>確認</button>
          <button className="e-btn" onClick={()=>setShowPw(false)} style={{color:"rgba(242,237,230,.4)",borderColor:"rgba(255,255,255,.15)"}}>取消</button>
          {err && <span style={{fontFamily:"'Noto Sans TC',sans-serif",fontSize:"11px",color:C.brick,letterSpacing:".08em"}}>密碼錯誤</span>}
        </>
      )}
    </div>
  );
}

// ── Nav ───────────────────────────────────────────────────────────────
function Nav({ active, setShowPw, editMode }) {
  const [open,setOpen]=useState(false);
  const {isMobile}=useBreakpoint();
  const links=[{id:"about",label:"關於"},{id:"experience",label:"經歷"},{id:"works",label:"作品"},{id:"videos",label:"影音"},{id:"journal",label:"日誌"},{id:"contact",label:"聯絡"}];
  const go=id=>{document.getElementById(id)?.scrollIntoView({behavior:"smooth"});setOpen(false);};
  return (
    <>
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:200,height:"52px",display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0 20px",background:"rgba(242,237,230,0.94)",backdropFilter:"blur(12px)",borderBottom:`1px solid ${C.rule}`}}>
        <span style={{fontFamily:"'Noto Sans TC',sans-serif",fontSize:"13px",fontWeight:500,letterSpacing:".14em",color:C.ink}}>璐璐 Ruru</span>
        <div style={{display:"flex",alignItems:"center",gap:"20px"}}>
          {!isMobile && links.map(l=><button key={l.id} className={`nav-btn${active===l.id?" on":""}`} onClick={()=>go(l.id)}>{l.label}</button>)}
          <button onClick={()=>setShowPw(true)} style={{background:"none",border:`1px solid ${editMode?C.brick:C.rule}`,padding:"5px 10px",cursor:"pointer",fontFamily:"'Noto Sans TC',sans-serif",fontSize:"10px",fontWeight:300,letterSpacing:".12em",color:editMode?C.brick:C.inkFaint,transition:"all .2s"}}>
            {editMode?"編輯中":"編輯"}
          </button>
          {isMobile && (
            <button onClick={()=>setOpen(true)} style={{background:"none",border:`1px solid ${C.rule}`,padding:"6px 10px",cursor:"pointer",display:"flex",flexDirection:"column",gap:"4px"}}>
              {[0,1,2].map(i=><div key={i} style={{width:"16px",height:"1px",background:C.ink}}/>)}
            </button>
          )}
        </div>
      </nav>
      {open&&(
        <div className="mob-menu">
          <button onClick={()=>setOpen(false)} style={{position:"absolute",top:"20px",right:"20px",background:"none",border:"1px solid rgba(255,255,255,.2)",color:"rgba(255,255,255,.6)",padding:"8px 16px",fontFamily:"'Noto Sans TC',sans-serif",fontSize:"12px",cursor:"pointer"}}>✕</button>
          {links.map(l=><button key={l.id} onClick={()=>go(l.id)} style={{background:"none",border:"none",cursor:"pointer",fontFamily:"'Noto Sans TC',sans-serif",fontSize:"28px",fontWeight:300,letterSpacing:".12em",color:"rgba(242,237,230,.9)"}}>{l.label}</button>)}
        </div>
      )}
    </>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────
function Hero({ c, set, editMode }) {
  const {isMobile}=useBreakpoint();
  const px=isMobile?"20px":"48px";
  const tf={fontFamily:"'Noto Sans TC',sans-serif",fontSize:"13px",fontWeight:300,color:C.inkMid};
  return (
    <section id="hero" style={{minHeight:"100svh",background:C.bg,display:"flex",flexDirection:"column",justifyContent:"flex-end",padding:`52px ${px} ${isMobile?"60px":"72px"}`,position:"relative"}}>
      {!isMobile&&<div style={{position:"absolute",top:"72px",right:"48px",textAlign:"right"}}><p style={{fontFamily:"'Noto Sans TC',sans-serif",fontSize:"10px",fontWeight:300,letterSpacing:".22em",color:C.inkFaint,lineHeight:2}}>MARKETING PORTFOLIO<br/>2025 · NEW TAIPEI</p></div>}
      <div style={{position:"absolute",top:"50%",left:isMobile?"0":"48px",transform:"translateY(-58%)",fontFamily:"'EB Garamond',serif",fontSize:isMobile?"36vw":"clamp(120px,24vw,260px)",fontWeight:400,color:"rgba(30,26,23,0.04)",lineHeight:1,userSelect:"none",letterSpacing:"-0.06em",pointerEvents:"none"}}>RURU</div>
      <div style={{position:"relative",zIndex:1}}>
        <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"24px"}}>
          <div style={{width:"24px",height:"1px",background:C.brick}}/>
          <EF value={c.eyebrow} onChange={v=>set("eyebrow",v)} editMode={editMode} style={{fontFamily:"'Noto Sans TC',sans-serif",fontSize:"10px",fontWeight:300,letterSpacing:".32em",color:C.brick,textTransform:"uppercase"}}/>
        </div>
        <h1 style={{fontFamily:"'Noto Sans TC',sans-serif",fontSize:isMobile?"clamp(34px,10vw,46px)":"clamp(44px,7.5vw,84px)",fontWeight:300,lineHeight:1.35,color:C.ink,marginBottom:"32px"}}>
          <EF value={c.line1} onChange={v=>set("line1",v)} editMode={editMode} style={{display:"block",fontWeight:300}}/> 
          <EF value={c.line2} onChange={v=>set("line2",v)} editMode={editMode} style={{display:"block",fontWeight:500}}/>
        </h1>
        <Rule style={{marginBottom:"28px",maxWidth:isMobile?"100%":"440px"}}/>
        <div style={{display:"flex",flexDirection:isMobile?"column":"row",gap:isMobile?"6px":"24px",alignItems:isMobile?"flex-start":"center"}}>
          {c.meta.map((t,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:"8px"}}>
              {i>0&&!isMobile&&<div style={{width:"1px",height:"12px",background:C.rule}}/>}
              <EF value={t} onChange={v=>{const m=[...c.meta];m[i]=v;set("meta",m);}} editMode={editMode} style={{fontFamily:"'Noto Sans TC',sans-serif",fontSize:"11px",fontWeight:300,letterSpacing:".1em",color:C.inkLight}}/>
            </div>
          ))}
        </div>
      </div>
      {/* Resume download */}
      <ResumeBtn isMobile={isMobile} editMode={editMode}/>

      <div style={{position:"absolute",right:isMobile?"20px":"48px",bottom:isMobile?"24px":"60px",display:"flex",flexDirection:"column",alignItems:"center",gap:"6px"}}>
        <div style={{width:"1px",height:"40px",background:`linear-gradient(to bottom,transparent,${C.inkFaint})`}}/>
        <span style={{fontFamily:"'Noto Sans TC',sans-serif",fontSize:"8px",letterSpacing:".3em",textTransform:"uppercase",color:C.inkFaint,writingMode:"vertical-rl"}}>scroll</span>
      </div>
    </section>
  );
}

// ── ResumeBtn ─────────────────────────────────────────────────────────
function ResumeBtn({ isMobile, editMode }) {
  const fileRef = useRef(null);
  const [resumeUrl, setResumeUrl] = useState(() => {
    try { return localStorage.getItem(RESUME_KEY) || ""; } catch { return ""; }
  });

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setResumeUrl(ev.target.result);
      try { localStorage.setItem(RESUME_KEY, ev.target.result); } catch {}
    };
    reader.readAsDataURL(file);
  };

  if (!resumeUrl && !editMode) return null;

  return (
    <div style={{ position:"relative", zIndex:1, marginTop:"24px", display:"flex", alignItems:"center", gap:"12px", flexWrap:"wrap" }}>
      {resumeUrl ? (
        <a href={resumeUrl} download="Ruru_Resume.pdf" style={{
          display:"inline-flex", alignItems:"center", gap:"8px",
          padding:"10px 24px",
          border:`1px solid ${C.rule}`,
          background:"none",
          fontFamily:"'Noto Sans TC',sans-serif",
          fontSize:"11px", fontWeight:300,
          letterSpacing:".16em", color:C.inkMid,
          textDecoration:"none",
          transition:"border-color .2s, color .2s",
        }}
        onMouseOver={e=>{e.currentTarget.style.borderColor=C.brick;e.currentTarget.style.color=C.brick;}}
        onMouseOut={e=>{e.currentTarget.style.borderColor=C.rule;e.currentTarget.style.color=C.inkMid;}}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Download Resume
        </a>
      ) : null}
      {editMode && (
        <>
          <input type="file" ref={fileRef} accept=".pdf" onChange={handleFile} style={{display:"none"}}/>
          <button className="e-btn" onClick={()=>fileRef.current?.click()}>
            {resumeUrl ? "更換 Resume PDF" : "上傳 Resume PDF"}
          </button>
          {resumeUrl && (
            <button className="e-btn danger" onClick={()=>{setResumeUrl("");localStorage.removeItem(RESUME_KEY);}}>移除</button>
          )}
        </>
      )}
    </div>
  );
}

// ── About ─────────────────────────────────────────────────────────────
function About({ c, set, editMode }) {
  const {isMobile}=useBreakpoint();
  const px=isMobile?"20px":"48px", py=isMobile?"72px":"112px";
  const avatarRef=useRef(null);

  const [avatar,setAvatar]=useState(()=>{
    try{return localStorage.getItem(AVATAR_KEY)||"";}catch{return "";}
  });

  const handleAvatar=(e)=>{
    const file=e.target.files[0];
    if(!file)return;
    const reader=new FileReader();
    reader.onload=(ev)=>{
      setAvatar(ev.target.result);
      try{localStorage.setItem(AVATAR_KEY,ev.target.result);}catch{}
    };
    reader.readAsDataURL(file);
  };

  return (
    <section id="about" className="reveal" style={{padding:`${py} ${px}`,background:C.bg,borderTop:`1px solid ${C.rule}`}}>
      <PageNum n={1} label="About Me"/>
      <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:isMobile?"44px":"72px",alignItems:"start"}}>
        {/* Left: avatar + text */}
        <div>
          {/* Avatar */}
          <div style={{display:"flex",alignItems:isMobile?"center":"flex-start",gap:"24px",marginBottom:"28px",flexDirection:isMobile?"column":"row"}}>
            <div style={{position:"relative",flexShrink:0}}>
              <div style={{width:isMobile?"96px":"112px",height:isMobile?"96px":"112px",borderRadius:"50%",overflow:"hidden",border:`2px solid ${C.rule}`,background:C.bgDark,display:"flex",alignItems:"center",justifyContent:"center"}}>
                {avatar
                  ? <img src={avatar} alt="avatar" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                  : <span style={{fontFamily:"'EB Garamond',serif",fontSize:"36px",color:C.inkFaint,fontStyle:"italic"}}>R</span>
                }
              </div>
              {editMode&&(
                <>
                  <input type="file" ref={avatarRef} accept="image/*" onChange={handleAvatar} style={{display:"none"}}/>
                  <button onClick={()=>avatarRef.current?.click()} style={{position:"absolute",bottom:0,right:0,width:"28px",height:"28px",borderRadius:"50%",background:C.brick,border:"2px solid "+C.bg,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:"14px"}}>＋</button>
                </>
              )}
            </div>
            <div style={{textAlign:isMobile?"center":"left"}}>
              <h2 style={{fontFamily:"'Noto Sans TC',sans-serif",fontSize:isMobile?"24px":"clamp(22px,2.8vw,36px)",fontWeight:300,lineHeight:1.55,color:C.ink,letterSpacing:".02em"}}>
                <EF value={c.heading1} onChange={v=>set("heading1",v)} editMode={editMode} style={{display:"block",fontWeight:300}}/>
                <EF value={c.heading2} onChange={v=>set("heading2",v)} editMode={editMode} style={{display:"block",fontWeight:500}}/>
              </h2>
            </div>
          </div>
          <EF value={c.para1} onChange={v=>set("para1",v)} editMode={editMode} rows={4} style={{fontFamily:"'Noto Sans TC',sans-serif",fontSize:"14px",fontWeight:300,lineHeight:2.2,color:C.inkMid,marginBottom:"16px",letterSpacing:".05em",display:"block"}}/>
          <EF value={c.para2} onChange={v=>set("para2",v)} editMode={editMode} rows={4} style={{fontFamily:"'Noto Sans TC',sans-serif",fontSize:"14px",fontWeight:300,lineHeight:2.2,color:C.inkMid,letterSpacing:".05em",display:"block"}}/>
        </div>
        {/* Right: skills */}
        <div>
          <p style={{fontFamily:"'Noto Sans TC',sans-serif",fontSize:"10px",fontWeight:300,letterSpacing:".28em",textTransform:"uppercase",color:C.inkFaint,marginBottom:"14px"}}>Skills</p>
          {c.skills.map(([label,detail],i)=>(
            <div key={i} style={{display:"flex",flexDirection:isMobile?"column":"row",justifyContent:"space-between",alignItems:isMobile?"flex-start":"baseline",gap:isMobile?"2px":"16px",padding:"13px 0",borderBottom:`1px solid ${C.rule}`}}>
              <EF value={label} onChange={v=>{const s=[...c.skills];s[i]=[v,s[i][1]];set("skills",s);}} editMode={editMode} style={{fontFamily:"'Noto Sans TC',sans-serif",fontSize:"13px",fontWeight:400,color:C.ink,whiteSpace:"nowrap"}}/>
              <EF value={detail} onChange={v=>{const s=[...c.skills];s[i]=[s[i][0],v];set("skills",s);}} editMode={editMode} style={{fontFamily:"'Noto Sans TC',sans-serif",fontSize:"12px",fontWeight:300,color:C.inkLight,letterSpacing:".04em"}}/>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Experience ────────────────────────────────────────────────────────
function Experience({ c, set, editMode }) {
  const [active,setActive]=useState(0);
  const {isMobile}=useBreakpoint();
  const px=isMobile?"20px":"48px", py=isMobile?"72px":"112px";
  const jobs=c.jobs;
  const job=jobs[Math.max(0,active)];
  const updJob=(i,field,val)=>{const j=[...jobs];j[i]={...j[i],[field]:val};set("jobs",j);};
  const updBullet=(ji,bi,val)=>{const j=[...jobs];const b=[...j[ji].bullets];b[bi]=val;j[ji]={...j[ji],bullets:b};set("jobs",j);};
  return (
    <section id="experience" className="reveal" style={{padding:`${py} ${px}`,background:C.bgAlt,borderTop:`1px solid ${C.rule}`}}>
      <PageNum n={2} label="Experience"/>
      {isMobile?(
        <div>
          {jobs.map((j,i)=>(
            <div key={i}>
              <button onClick={()=>setActive(active===i?-1:i)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",background:"none",border:"none",cursor:"pointer",padding:"16px 0",borderBottom:`1px solid ${C.rule}`}}>
                <div style={{textAlign:"left"}}>
                  <p style={{fontFamily:"'Noto Sans TC',sans-serif",fontSize:"14px",fontWeight:active===i?500:300,color:active===i?C.ink:C.inkMid,letterSpacing:".04em",marginBottom:"2px"}}>{j.company}</p>
                  <p style={{fontFamily:"'Noto Sans TC',sans-serif",fontSize:"10px",fontWeight:300,color:C.inkFaint,letterSpacing:".1em"}}>{j.period}</p>
                </div>
                <span style={{fontFamily:"'EB Garamond',serif",fontSize:"20px",color:active===i?C.brick:C.inkFaint,transform:active===i?"rotate(45deg)":"none",transition:"transform .2s,color .2s"}}>+</span>
              </button>
              {active===i&&(
                <div style={{padding:"20px 0 8px"}}>
                  <EF value={j.role} onChange={v=>updJob(i,"role",v)} editMode={editMode} style={{fontFamily:"'Noto Sans TC',sans-serif",fontSize:"16px",fontWeight:500,color:C.ink,letterSpacing:".04em",display:"block",marginBottom:"8px"}}/>
                  <p style={{fontFamily:"'Noto Sans TC',sans-serif",fontSize:"11px",fontWeight:300,color:C.brick,letterSpacing:".1em",marginBottom:"14px"}}>{j.company} · {j.period}</p>
                  <EF value={j.desc} onChange={v=>updJob(i,"desc",v)} editMode={editMode} rows={3} style={{fontFamily:"'Noto Sans TC',sans-serif",fontSize:"13px",fontWeight:300,lineHeight:2,color:C.inkMid,marginBottom:"16px",letterSpacing:".04em",display:"block"}}/>
                  <ul style={{listStyle:"none"}}>
                    {j.bullets.map((b,bi)=>(
                      <li key={bi} style={{display:"flex",gap:"10px",marginBottom:"10px",alignItems:"flex-start"}}>
                        <BrickDot/>
                        <EF value={b} onChange={v=>updBullet(i,bi,v)} editMode={editMode} style={{fontFamily:"'Noto Sans TC',sans-serif",fontSize:"13px",fontWeight:300,lineHeight:1.8,color:C.inkMid,letterSpacing:".04em",flex:1}}/>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      ):(
        <div style={{display:"grid",gridTemplateColumns:"220px 1fr"}}>
          <div style={{borderRight:`1px solid ${C.rule}`}}>
            {jobs.map((j,i)=>(
              <button key={i} className={`exp-tab${active===i?" on":""}`} onClick={()=>setActive(i)}>
                <span style={{fontFamily:"'Noto Sans TC',sans-serif",fontSize:"13px",fontWeight:active===i?500:300,color:active===i?C.ink:C.inkMid,letterSpacing:".04em",marginBottom:"4px",transition:"all .2s"}}>{j.company}</span>
                <span style={{fontFamily:"'Noto Sans TC',sans-serif",fontSize:"10px",fontWeight:300,color:C.inkFaint,letterSpacing:".1em"}}>{j.period}</span>
              </button>
            ))}
          </div>
          <div style={{padding:"8px 48px"}}>
            <div style={{display:"flex",alignItems:"baseline",gap:"12px",marginBottom:"6px",flexWrap:"wrap"}}>
              <EF value={job.role} onChange={v=>updJob(active,"role",v)} editMode={editMode} style={{fontFamily:"'Noto Sans TC',sans-serif",fontSize:"24px",fontWeight:500,color:C.ink,letterSpacing:".04em"}}/>
              <span style={{fontFamily:"'Noto Sans TC',sans-serif",fontSize:"10px",fontWeight:300,color:C.inkLight,border:`1px solid ${C.rule}`,padding:"2px 8px",letterSpacing:".1em"}}>{job.type}</span>
            </div>
            <p style={{fontFamily:"'Noto Sans TC',sans-serif",fontSize:"11px",fontWeight:300,color:C.brick,letterSpacing:".1em",marginBottom:"20px"}}>{job.company} · {job.period}</p>
            <EF value={job.desc} onChange={v=>updJob(active,"desc",v)} editMode={editMode} rows={3} style={{fontFamily:"'Noto Sans TC',sans-serif",fontSize:"14px",fontWeight:300,lineHeight:2.1,color:C.inkMid,marginBottom:"24px",letterSpacing:".04em",display:"block"}}/>
            <Rule style={{marginBottom:"20px"}}/>
            <ul style={{listStyle:"none"}}>
              {job.bullets.map((b,bi)=>(
                <li key={bi} style={{display:"flex",gap:"12px",marginBottom:"12px",alignItems:"flex-start"}}>
                  <BrickDot/>
                  <EF value={b} onChange={v=>updBullet(active,bi,v)} editMode={editMode} style={{fontFamily:"'Noto Sans TC',sans-serif",fontSize:"13px",fontWeight:300,lineHeight:1.8,color:C.inkMid,letterSpacing:".04em",flex:1}}/>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}

// ── Works ─────────────────────────────────────────────────────────────
function Works({ c, set, editMode }) {
  const {isMobile}=useBreakpoint();
  const px=isMobile?"20px":"48px", py=isMobile?"72px":"112px";
  const updWork=(i,field,val)=>{const w=[...c.items];w[i]={...w[i],[field]:val};set("items",w);};
  return (
    <section id="works" className="reveal" style={{padding:`${py} ${px}`,background:C.bg,borderTop:`1px solid ${C.rule}`}}>
      <PageNum n={3} label="Works"/>
      <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"repeat(2,1fr)",gap:"1px",background:C.rule,border:`1px solid ${C.rule}`}}>
        {c.items.map((w,i)=>(
          <div key={w.id} className={`wcard${editMode?" no-hover":""}${w.link&&!editMode?" cp":""}`} onClick={()=>!editMode&&w.link&&window.open(w.link,"_blank")}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:"14px"}}>
              <EF value={w.category} onChange={v=>updWork(i,"category",v)} editMode={editMode} className="wc-cat" style={{fontFamily:"'Noto Sans TC',sans-serif",fontSize:"10px",fontWeight:300,letterSpacing:".22em",textTransform:"uppercase",color:C.inkFaint,transition:"color .3s"}}/>
              {!editMode&&<span className="wc-arr" style={{fontFamily:"'EB Garamond',serif",fontSize:"16px",color:C.brick,opacity:w.link?.6:0,transition:"opacity .3s"}}>↗</span>}
            </div>
            <EF value={w.title} onChange={v=>updWork(i,"title",v)} editMode={editMode} className="wc-title" style={{fontFamily:"'Noto Sans TC',sans-serif",fontSize:isMobile?"17px":"19px",fontWeight:500,color:C.ink,marginBottom:"4px",letterSpacing:".04em",transition:"color .3s",display:"block"}}/>
            <EF value={w.sub} onChange={v=>updWork(i,"sub",v)} editMode={editMode} className="wc-sub" style={{fontFamily:"'Noto Sans TC',sans-serif",fontSize:"11px",fontWeight:300,color:C.inkLight,letterSpacing:".1em",marginBottom:"14px",transition:"color .3s",display:"block"}}/>
            <Rule style={{marginBottom:"14px"}}/>
            <EF value={w.desc} onChange={v=>updWork(i,"desc",v)} editMode={editMode} rows={2} className="wc-desc" style={{fontFamily:"'Noto Sans TC',sans-serif",fontSize:"13px",fontWeight:300,lineHeight:1.9,color:C.inkMid,marginBottom:"18px",letterSpacing:".04em",transition:"color .3s",display:"block"}}/>
            {editMode ? (
              <div>
                <p style={{fontFamily:"'Noto Sans TC',sans-serif",fontSize:"10px",color:C.inkFaint,marginBottom:"4px",letterSpacing:".1em"}}>標籤（逗號分隔）</p>
                <input type="text" value={w.tags} onChange={e=>updWork(i,"tags",e.target.value)} style={{marginBottom:"8px"}}/>
                <p style={{fontFamily:"'Noto Sans TC',sans-serif",fontSize:"10px",color:C.inkFaint,marginBottom:"4px",letterSpacing:".1em"}}>連結 URL（選填）</p>
                <input type="text" value={w.link} onChange={e=>updWork(i,"link",e.target.value)}/>
              </div>
            ):(
              <div style={{display:"flex",gap:"6px",flexWrap:"wrap"}}>
                {w.tags.split(",").map(t=>t.trim()).filter(Boolean).map(t=>(
                  <span key={t} className="wc-tag" style={{padding:"2px 9px",border:`1px solid ${C.rule}`,fontFamily:"'Noto Sans TC',sans-serif",fontSize:"10px",fontWeight:300,color:C.inkFaint,letterSpacing:".08em",transition:"all .3s"}}>{t}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Videos ───────────────────────────────────────────────────────────────────
function Videos({ editMode }) {
  const { isMobile } = useBreakpoint();
  const px = isMobile ? "20px" : "48px", py = isMobile ? "72px" : "112px";
  const fileRef = useRef(null);

  const [videos, setVideos] = useState(DEFAULT_VIDEOS);
  const [adding, setAdding] = useState(false);
  const [playing, setPlaying] = useState(null);
  const [newV, setNewV] = useState({ type:"reel", title:"", desc:"", tag:"", url:"", videoSrc:"" });

  useEffect(()=>{ loadFromFirestore("videos", DEFAULT_VIDEOS).then(setVideos); },[]);
  useEffect(()=>{ if(videos!==DEFAULT_VIDEOS) saveToFirestore("videos", videos); },[videos]);

  const addVideo = () => {
    if (!newV.title.trim()) return;
    setVideos(prev => [{ ...newV, id: Date.now() }, ...prev]);
    setNewV({ type:"reel", title:"", desc:"", tag:"", url:"", videoSrc:"" });
    setAdding(false);
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setNewV(p => ({ ...p, videoSrc: ev.target.result, type:"upload" }));
    reader.readAsDataURL(file);
  };

  const IGIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/>
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
    </svg>
  );

  return (
    <section id="videos" className="reveal" style={{ padding:`${py} ${px}`, background:C.bg, borderTop:`1px solid ${C.rule}` }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:"32px", flexWrap:"wrap", gap:"12px" }}>
        <PageNum n={4} label="Videos" mb={0}/>
        {editMode && !adding && (
          <button className="e-btn" onClick={() => setAdding(true)}>＋ 新增影音</button>
        )}
      </div>

      {adding && editMode && (
        <div style={{ marginBottom:"24px", padding:"24px", background:C.white, border:`1px solid ${C.brick}`, display:"flex", flexDirection:"column", gap:"10px" }}>
          <p style={{ fontFamily:"'Noto Sans TC',sans-serif", fontSize:"12px", fontWeight:500, color:C.ink, letterSpacing:".08em" }}>新增影音作品</p>
          <div style={{ display:"flex", gap:"8px" }}>
            {["reel","upload"].map(t => (
              <button key={t} onClick={() => setNewV(p=>({...p,type:t}))} className="e-btn" style={{ borderColor: newV.type===t ? C.brick:"", color: newV.type===t ? C.brick:"" }}>
                {t==="reel" ? "IG Reel 連結" : "上傳影片"}
              </button>
            ))}
          </div>
          <input type="text" placeholder="標題" value={newV.title} onChange={e=>setNewV(p=>({...p,title:e.target.value}))}/>
          <input type="text" placeholder="標籤（例：社群行銷）" value={newV.tag} onChange={e=>setNewV(p=>({...p,tag:e.target.value}))}/>
          <textarea rows={2} placeholder="簡短說明" value={newV.desc} onChange={e=>setNewV(p=>({...p,desc:e.target.value}))}/>
          {newV.type === "reel" ? (
            <input type="text" placeholder="Instagram Reel 網址（https://www.instagram.com/reel/...）" value={newV.url} onChange={e=>setNewV(p=>({...p,url:e.target.value}))}/>
          ) : (
            <div>
              <input type="file" ref={fileRef} accept="video/*" onChange={handleFile} style={{ display:"none" }}/>
              <button className="e-btn" onClick={() => fileRef.current?.click()}>
                {newV.videoSrc ? "✓ 已選擇影片" : "選擇影片檔案"}
              </button>
              {newV.videoSrc && <p style={{ fontFamily:"'Noto Sans TC',sans-serif", fontSize:"11px", color:C.brick, marginTop:"6px" }}>影片已載入</p>}
            </div>
          )}
          <div style={{ display:"flex", gap:"8px" }}>
            <button className="e-btn primary" onClick={addVideo}>新增</button>
            <button className="e-btn" onClick={() => { setAdding(false); setNewV({type:"reel",title:"",desc:"",tag:"",url:"",videoSrc:""}); }}>取消</button>
          </div>
        </div>
      )}

      <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap:"1px", background:C.rule, border:`1px solid ${C.rule}` }}>
        {videos.map(v => (
          <div key={v.id} style={{ background:C.white, display:"flex", flexDirection:"column" }}>
            <div style={{ position:"relative", aspectRatio:"9/16", background:C.bgDark, overflow:"hidden", cursor: v.type==="upload" && v.videoSrc ? "pointer" : "default" }}
              onClick={() => v.type==="upload" && v.videoSrc && setPlaying(playing===v.id ? null : v.id)}>

              {v.type === "upload" && v.videoSrc ? (
                playing === v.id ? (
                  <video src={v.videoSrc} autoPlay controls style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                ) : (
                  <>
                    <video src={v.videoSrc} style={{ width:"100%", height:"100%", objectFit:"cover" }} muted/>
                    <div style={{ position:"absolute", inset:0, background:"rgba(30,26,23,0.4)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <div style={{ width:"52px", height:"52px", borderRadius:"50%", background:"rgba(184,92,56,0.85)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21"/></svg>
                      </div>
                    </div>
                  </>
                )
              ) : v.type === "reel" && v.url && !v.url.includes("xxxxxx") ? (
                <a href={v.url} target="_blank" rel="noreferrer" style={{ display:"block", width:"100%", height:"100%", textDecoration:"none" }}>
                  <div style={{ width:"100%", height:"100%", background:`linear-gradient(135deg,${C.bgAlt},${C.bgDark})`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"12px" }}>
                    <div style={{ color:C.brick, opacity:.8 }}><IGIcon/></div>
                    <p style={{ fontFamily:"'Noto Sans TC',sans-serif", fontSize:"11px", fontWeight:300, color:C.inkLight, letterSpacing:".1em", textAlign:"center" }}>點擊前往<br/>Instagram Reel</p>
                    <span style={{ fontSize:"18px", color:C.inkFaint }}>↗</span>
                  </div>
                </a>
              ) : (
                <div style={{ width:"100%", height:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"8px", opacity:.35 }}>
                  <span style={{ fontSize:"24px", color:C.inkFaint }}>▶</span>
                  <p style={{ fontFamily:"'Noto Sans TC',sans-serif", fontSize:"10px", fontWeight:300, color:C.inkFaint, letterSpacing:".12em" }}>{editMode ? "新增模式中" : "影片待補"}</p>
                </div>
              )}

              {v.tag && (
                <div style={{ position:"absolute", top:"10px", left:"10px", padding:"2px 8px", background:"rgba(184,92,56,0.85)", fontFamily:"'Noto Sans TC',sans-serif", fontSize:"9px", fontWeight:300, color:"#fff", letterSpacing:".1em" }}>
                  {v.tag}
                </div>
              )}
            </div>

            <div style={{ padding:"16px", flex:1 }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:"8px" }}>
                <p style={{ fontFamily:"'Noto Sans TC',sans-serif", fontSize:"13px", fontWeight:500, color:C.ink, letterSpacing:".04em", lineHeight:1.4, flex:1 }}>{v.title}</p>
                <div style={{ display:"flex", gap:"6px", alignItems:"center", flexShrink:0 }}>
                  {v.type==="reel" && v.url && !v.url.includes("xxxxxx") && (
                    <a href={v.url} target="_blank" rel="noreferrer" style={{ color:C.brick, display:"flex" }} title="前往 Instagram"><IGIcon/></a>
                  )}
                  {editMode && <button className="e-btn danger" onClick={() => setVideos(p=>p.filter(x=>x.id!==v.id))} style={{ fontSize:"10px", padding:"2px 8px" }}>刪除</button>}
                </div>
              </div>
              {v.desc && <p style={{ fontFamily:"'Noto Sans TC',sans-serif", fontSize:"12px", fontWeight:300, color:C.inkLight, lineHeight:1.7, letterSpacing:".04em", marginTop:"6px" }}>{v.desc}</p>}
            </div>
          </div>
        ))}
      </div>

      {videos.length === 0 && (
        <div style={{ padding:"48px", textAlign:"center", border:`1px solid ${C.rule}`, background:C.white }}>
          <p style={{ fontFamily:"'Noto Sans TC',sans-serif", fontSize:"13px", fontWeight:300, color:C.inkFaint, letterSpacing:".08em" }}>
            {editMode ? "點擊「新增影音」開始上傳" : "影音作品即將推出"}
          </p>
        </div>
      )}
    </section>
  );
}

// ── Journal ───────────────────────────────────────────────────────────
function Journal({ editMode }) {
  const {isMobile}=useBreakpoint();
  const px=isMobile?"20px":"48px", py=isMobile?"72px":"112px";
  const [posts,setPosts]=useState(DEFAULT_POSTS);
  const [adding,setAdding]=useState(false);
  const [expanded,setExpanded]=useState(null);
  const [newPost,setNewPost]=useState({tag:"",title:"",body:""});
  useEffect(()=>{ loadFromFirestore("journal", DEFAULT_POSTS).then(setPosts); },[]);
  useEffect(()=>{ if(posts!==DEFAULT_POSTS) saveToFirestore("journal", posts); },[posts]);
  const addPost=()=>{if(!newPost.title.trim()||!newPost.body.trim())return;const p={id:Date.now(),date:new Date().toISOString().slice(0,7).replace("-","."),tag:newPost.tag||"筆記",title:newPost.title,body:newPost.body};setPosts(prev=>[p,...prev]);setNewPost({tag:"",title:"",body:""});setAdding(false);};
  return (
    <section id="journal" className="reveal" style={{padding:`${py} ${px}`,background:C.bgAlt,borderTop:`1px solid ${C.rule}`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:"32px",flexWrap:"wrap",gap:"12px"}}>
        <PageNum n={5} label="Journal" mb={0}/>
        {editMode&&(
          <div style={{display:"flex",gap:"8px"}}>
            {!adding&&<button className="e-btn" onClick={()=>setAdding(true)}>＋ 新增</button>}
          </div>
        )}
      </div>
      {adding&&editMode&&(
        <div style={{marginBottom:"20px",padding:"20px",background:C.white,border:`1px solid ${C.brick}`,display:"flex",flexDirection:"column",gap:"10px"}}>
          <p style={{fontFamily:"'Noto Sans TC',sans-serif",fontSize:"12px",fontWeight:500,color:C.ink,letterSpacing:".08em"}}>新增文章</p>
          <input type="text" placeholder="標籤（例：行銷觀察）" value={newPost.tag} onChange={e=>setNewPost(p=>({...p,tag:e.target.value}))}/>
          <input type="text" placeholder="標題" value={newPost.title} onChange={e=>setNewPost(p=>({...p,title:e.target.value}))}/>
          <textarea rows={5} placeholder="內文" value={newPost.body} onChange={e=>setNewPost(p=>({...p,body:e.target.value}))}/>
          <div style={{display:"flex",gap:"8px"}}>
            <button className="e-btn primary" onClick={addPost}>發布</button>
            <button className="e-btn" onClick={()=>{setAdding(false);setNewPost({tag:"",title:"",body:""});}}>取消</button>
          </div>
        </div>
      )}
      <div style={{display:"flex",flexDirection:"column",gap:"1px",background:C.rule,border:`1px solid ${C.rule}`}}>
        {posts.map(p=>(
          <div key={p.id} className="blog-card">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"10px"}}>
              <div style={{display:"flex",alignItems:"center",gap:"10px",flexWrap:"wrap"}}>
                <span className="blog-tag">{p.tag}</span>
                <span style={{fontFamily:"'Noto Sans TC',sans-serif",fontSize:"10px",fontWeight:300,color:C.inkFaint,letterSpacing:".12em"}}>{p.date}</span>
              </div>
              {editMode&&<button className="e-btn danger" onClick={()=>setPosts(prev=>prev.filter(x=>x.id!==p.id))} style={{fontSize:"10px",padding:"3px 10px",flexShrink:0}}>刪除</button>}
            </div>
            <h3 style={{fontFamily:"'Noto Sans TC',sans-serif",fontSize:isMobile?"16px":"18px",fontWeight:500,color:C.ink,marginBottom:"10px",letterSpacing:".04em",lineHeight:1.5}}>{p.title}</h3>
            <p style={{fontFamily:"'Noto Sans TC',sans-serif",fontSize:"13px",fontWeight:300,lineHeight:2,color:C.inkMid,letterSpacing:".04em",display:expanded===p.id?"block":"-webkit-box",WebkitLineClamp:expanded===p.id?undefined:3,WebkitBoxOrient:"vertical",overflow:expanded===p.id?"visible":"hidden"}}>{p.body}</p>
            <button onClick={()=>setExpanded(expanded===p.id?null:p.id)} style={{background:"none",border:"none",cursor:"pointer",fontFamily:"'Noto Sans TC',sans-serif",fontSize:"11px",fontWeight:300,color:C.brick,letterSpacing:".1em",marginTop:"10px",padding:0}}>
              {expanded===p.id?"收合 ↑":"閱讀更多 →"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Contact ───────────────────────────────────────────────────────────
function Contact({ c, set, editMode }) {
  const {isMobile}=useBreakpoint();
  const px=isMobile?"20px":"48px", py=isMobile?"72px":"112px";
  return (
    <section id="contact" className="reveal" style={{padding:`${py} ${px} ${isMobile?"60px":"80px"}`,background:C.bgAlt,borderTop:`1px solid ${C.rule}`}}>
      <PageNum n={6} label="Contact"/>
      <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:isMobile?"40px":"72px",alignItems:"start"}}>
        <div>
          <h2 style={{fontFamily:"'Noto Sans TC',sans-serif",fontSize:isMobile?"28px":"clamp(28px,3.8vw,48px)",fontWeight:300,lineHeight:1.5,color:C.ink,marginBottom:"20px",letterSpacing:".02em"}}>
            <EF value={c.heading1} onChange={v=>set("heading1",v)} editMode={editMode} style={{display:"block",fontWeight:300}}/>
            <EF value={c.heading2} onChange={v=>set("heading2",v)} editMode={editMode} style={{display:"block",fontWeight:500}}/>
          </h2>
          <EF value={c.intro} onChange={v=>set("intro",v)} editMode={editMode} rows={2} style={{fontFamily:"'Noto Sans TC',sans-serif",fontSize:"14px",fontWeight:300,lineHeight:2.2,color:C.inkMid,letterSpacing:".05em",display:"block"}}/>
        </div>
        <div>
          {[
            {label:"Instagram", field:"ig", href:`https://instagram.com/${c.ig?.replace("@","")}`},
            {label:"Email",     field:"email", href:`mailto:${c.email}`},
            {label:"Location",  field:"location", href:null},
          ].map(item=>(
            <div key={item.label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"18px 0",borderBottom:`1px solid ${C.rule}`,gap:"12px"}}>
              <span style={{fontFamily:"'Noto Sans TC',sans-serif",fontSize:"10px",fontWeight:300,letterSpacing:".24em",textTransform:"uppercase",color:C.inkFaint,flexShrink:0}}>{item.label}</span>
              {editMode
                ? <input type="text" value={c[item.field]} onChange={e=>set(item.field,e.target.value)} style={{textAlign:"right",flex:1,maxWidth:"220px"}}/>
                : item.href
                  ? <a href={item.href} target="_blank" rel="noreferrer" className="ul-link" style={{fontFamily:"'Noto Sans TC',sans-serif",fontSize:"14px",fontWeight:300,color:C.ink,letterSpacing:".06em"}}>{c[item.field]}</a>
                  : <span style={{fontFamily:"'Noto Sans TC',sans-serif",fontSize:"14px",fontWeight:300,color:C.inkMid,letterSpacing:".06em"}}>{c[item.field]}</span>
              }
            </div>
          ))}
          <div style={{marginTop:"40px"}}>
            <Rule style={{marginBottom:"16px"}}/>
            <p style={{fontFamily:"'Noto Sans TC',sans-serif",fontSize:"10px",fontWeight:300,letterSpacing:".18em",color:C.inkFaint,lineHeight:2}}>© 2025 璐璐 Ruru<br/>Built with intention · New Taipei City</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Root ──────────────────────────────────────────────────────────────
export default function Portfolio() {
  const [active,setActive]=useState("hero");
  const [editMode,setEditMode]=useState(false);
  const [showPw,setShowPw]=useState(false);
  const [loading,setLoading]=useState(true);

  const [siteContent,setSiteContent]=useState(DEFAULT_CONTENT);
  const setSection=(section)=>(field,val)=>setSiteContent(prev=>({...prev,[section]:{...prev[section],[field]:val}}));

  // Load from Firestore on mount
  useEffect(()=>{
    loadFromFirestore("content", DEFAULT_CONTENT).then(data=>{
      setSiteContent(data);
      setLoading(false);
    });
  },[]);

  const saveContent = async () => {
    await saveToFirestore("content", siteContent);
    alert("已儲存到雲端！所有裝置都會更新。");
  };

  const resetContent = async () => {
    if(window.confirm("確定還原所有文字到預設內容？")){
      setSiteContent(DEFAULT_CONTENT);
      await saveToFirestore("content", DEFAULT_CONTENT);
    }
  };

  useStyles();
  useReveal(loading); // no-op

  // Google Analytics
  useEffect(()=>{
    try {
      const gaId = localStorage.getItem(GA_KEY);
      if(!gaId) return;
      const s1=document.createElement("script");
      s1.async=true;
      s1.src=`https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(s1);
      const s2=document.createElement("script");
      s2.textContent=`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`;
      document.head.appendChild(s2);
    } catch(e) { console.warn("GA init failed", e); }
  },[]);

  useEffect(()=>{
    const ids=["hero","about","experience","works","videos","journal","contact"];
    const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)setActive(e.target.id);}),{threshold:.25});
    ids.forEach(id=>{const el=document.getElementById(id);if(el)obs.observe(el);});
    return()=>obs.disconnect();
  },[]);

  if(loading) return (
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <p style={{fontFamily:"'Noto Sans TC',sans-serif",fontSize:"13px",fontWeight:300,letterSpacing:".2em",color:C.inkFaint}}>載入中…</p>
    </div>
  );

  return (
    <div style={{background:C.bg,minHeight:"100vh",paddingBottom:editMode||showPw?"64px":"0"}}>
      <Nav active={active} setShowPw={setShowPw} editMode={editMode}/>
      <Hero    c={siteContent.hero}       set={setSection("hero")}       editMode={editMode} resumeEdit={editMode}/>
      <About   c={siteContent.about}      set={setSection("about")}      editMode={editMode}/>
      <Experience c={siteContent.experience} set={setSection("experience")} editMode={editMode}/>
      <Works   c={siteContent.works}      set={setSection("works")}      editMode={editMode}/>
      <Videos  editMode={editMode}/>
      <Journal editMode={editMode}/>
      <Contact c={siteContent.contact}    set={setSection("contact")}    editMode={editMode}/>
      <EditBar editMode={editMode} setEditMode={setEditMode} showPw={showPw} setShowPw={setShowPw} onSave={saveContent} onReset={resetContent}/>
    </div>
  );
}