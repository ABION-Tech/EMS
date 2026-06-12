import { useState, useEffect, useRef, useCallback } from "react";

// ── CONFIG ──────────────────────────────────────────────────
const GAS_URL = "https://script.google.com/macros/s/AKfycbx6RU2hcrNv9ig33c1tp-OGvw1-Wx_BkwSjfzm1_8zvGeKRcQB82VbYYgJOfJ3l3l1LeQ/exec";

// ── COLOURS ─────────────────────────────────────────────────
const C = {
  green     : "#2DB94D",
  greenLight: "#E8F8ED",
  white     : "#FFFFFF",
  bg        : "#F4F6F8",
  border    : "#E5E7EB",
  text      : "#111827",
  sub       : "#6B7280",
  critical  : "#EF4444",
  moderate  : "#F97316",
  low       : "#6B7280",
  liveDot   : "#EF4444",
};

// ── STAT CARD ICONS ───────────────────────────────────────────
const AlertTriangleIcon = ({ color }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M12 3L2 20h20L12 3z" stroke={color} strokeWidth="2" strokeLinejoin="round" fill="none"/>
    <line x1="12" y1="9" x2="12" y2="13" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="16.5" r="1" fill={color}/>
  </svg>
);
const MapPinStatIcon = ({ color }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M12 21C12 21 19 15 19 10C19 6.13 15.87 3 12 3C8.13 3 5 6.13 5 10C5 15 12 21 12 21Z" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
    <circle cx="12" cy="10" r="2.5" fill={color}/>
  </svg>
);
const DocStatIcon = ({ color }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
    <path d="M14 2v6h6" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
    <line x1="8" y1="13" x2="16" y2="13" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <line x1="8" y1="17" x2="13" y2="17" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
const SirenStatIcon = ({ color }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M12 2C9 2 6 4.5 6 9v6h12V9c0-4.5-3-7-6-7z" stroke={color} strokeWidth="2" strokeLinejoin="round"/>
    <line x1="4" y1="15" x2="20" y2="15" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <line x1="4" y1="19" x2="20" y2="19" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <line x1="12" y1="2" x2="12" y2="0.5" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// ── NIGERIA STATE LAT/LNG (real coordinates) ─────────────────
const STATE_LATLNG = {
  "Lagos"       : [6.46,   3.40 ],
  "Ogun"        : [6.99,   3.47 ],
  "Oyo"         : [8.00,   3.93 ],
  "Osun"        : [7.60,   4.58 ],
  "Ondo"        : [7.25,   5.20 ],
  "Ekiti"       : [7.72,   5.31 ],
  "Edo"         : [6.34,   5.63 ],
  "Delta"       : [5.68,   5.68 ],
  "Rivers"      : [4.78,   7.01 ],
  "Bayelsa"     : [4.77,   6.07 ],
  "Cross River" : [5.87,   8.60 ],
  "Akwa Ibom"   : [5.01,   7.85 ],
  "Enugu"       : [6.54,   7.51 ],
  "Anambra"     : [6.21,   6.94 ],
  "Imo"         : [5.57,   7.06 ],
  "Abia"        : [5.45,   7.50 ],
  "Ebonyi"      : [6.26,   8.01 ],
  "Benue"       : [7.34,   8.74 ],
  "Kogi"        : [7.80,   6.74 ],
  "Kwara"       : [8.49,   4.56 ],
  "Niger"       : [9.93,   6.55 ],
  "FCT"         : [9.06,   7.49 ],
  "Nasarawa"    : [8.50,   8.52 ],
  "Plateau"     : [9.22,   9.52 ],
  "Taraba"      : [7.87,  10.99 ],
  "Adamawa"     : [9.33,  12.40 ],
  "Borno"       : [11.84,  13.16],
  "Yobe"        : [12.29,  11.44],
  "Gombe"       : [10.36,  11.19],
  "Bauchi"      : [10.31,   9.84],
  "Jigawa"      : [12.23,   9.56],
  "Kano"        : [12.00,   8.52],
  "Kaduna"      : [10.52,   7.44],
  "Katsina"     : [12.99,   7.61],
  "Kebbi"       : [11.50,   4.20],
  "Sokoto"      : [13.07,   5.24],
  "Zamfara"     : [12.17,   6.66],
};

// ── MOCK DATA — realistic 2027 Nigerian general election incidents ──
// mediaRef: Google Drive share links (image/video). Dashboard renders them inline.
const MOCK_INCIDENTS = [
  {
    refId:"INC-831", reportType:"IMAGE", state:"Lagos", lga:"Alimosho LGA",
    severity:"critical",
    description:"Armed thugs attempted to snatch ballot box at PU 007, Ayobo Ward. INEC officials fled. Voting suspended. Police contacted but yet to arrive.",
    reporter:"Adaeze Okonkwo (OBS-ADA-8831)", timestamp:new Date(Date.now()-4*60000).toISOString(),
    status:"pending", lat:6.59, lng:3.25,
    mediaRef:"https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/320px-Cat03.jpg",
  },
  {
    refId:"INC-744", reportType:"SOS", state:"Kano", lga:"Nassarawa LGA",
    severity:"critical",
    description:"SOS — Observer Malam Garba Musa reports he is trapped inside polling unit by a mob. Windows smashed. Requesting immediate police intervention. Coords attached.",
    reporter:"Garba Musa (OBS-GAR-7744)", timestamp:new Date(Date.now()-7*60000).toISOString(),
    status:"pending", lat:12.01, lng:8.54,
    mediaRef:"",
  },
  {
    refId:"INC-692", reportType:"VIDEO", state:"Rivers", lga:"Port Harcourt LGA",
    severity:"critical",
    description:"Video evidence of pre-marked ballot papers being distributed to voters at St. Joseph Primary School polling unit, D/Line Ward. Approx 60 ballots visible.",
    reporter:"Chidinma Eze (OBS-CHI-6692)", timestamp:new Date(Date.now()-11*60000).toISOString(),
    status:"pending", lat:4.79, lng:7.02,
    mediaRef:"https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    refId:"INC-615", reportType:"IMAGE", state:"Borno", lga:"Maiduguri Municipal",
    severity:"critical",
    description:"Polling unit burnt down at Government Science School, Baga Road before accreditation could commence. Security forces on scene. Over 400 registered voters disenfranchised.",
    reporter:"Fatima Bulama (OBS-FAT-6615)", timestamp:new Date(Date.now()-15*60000).toISOString(),
    status:"pending", lat:11.83, lng:13.15,
    mediaRef:"https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/280px-PNG_transparency_demonstration_1.png",
  },
  {
    refId:"INC-588", reportType:"AUDIO", state:"Kano", lga:"Kano Municipal LGA",
    severity:"moderate",
    description:"Audio report of party agents openly directing voters on how to vote inside the booth at PU 012, Fagge Ward. INEC presiding officer appears aware but not acting.",
    reporter:"Usman Yusuf (OBS-USM-5588)", timestamp:new Date(Date.now()-19*60000).toISOString(),
    status:"pending", lat:12.00, lng:8.52,
    mediaRef:"",
  },
  {
    refId:"INC-541", reportType:"TEXT", state:"FCT", lga:"Bwari Area Council",
    severity:"moderate",
    description:"Card reader malfunctions at 4 consecutive polling units in Dutse Ward. INEC technician called but ETR unknown. Approx 230 voters waiting in queue since 8:30am.",
    reporter:"Ngozi Obiechina (OBS-NGO-5541)", timestamp:new Date(Date.now()-24*60000).toISOString(),
    status:"pending", lat:9.08, lng:7.35,
    mediaRef:"",
  },
  {
    refId:"INC-503", reportType:"IMAGE", state:"Kaduna", lga:"Kaduna North LGA",
    severity:"moderate",
    description:"Underage individuals observed in voter queue at PU 018, Kawo Ward. Estimated ages 14–16. Image attached. INEC officials notified verbally. No action taken yet.",
    reporter:"Grace Ishaya (OBS-GRA-5503)", timestamp:new Date(Date.now()-31*60000).toISOString(),
    status:"pending", lat:10.54, lng:7.45,
    mediaRef:"https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Gatto_europeo4.jpg/320px-Gatto_europeo4.jpg",
  },
  {
    refId:"INC-477", reportType:"TEXT", state:"Delta", lga:"Warri South LGA",
    severity:"moderate",
    description:"Protest by supporters of APC candidate blocking access road to St. Andrews Secondary School polling unit, Edjeba Ward. Road blocked with burning tyres. Voters unable to pass.",
    reporter:"Emeka Uchenna (OBS-EME-4477)", timestamp:new Date(Date.now()-38*60000).toISOString(),
    status:"pending", lat:5.52, lng:5.76,
    mediaRef:"",
  },
  {
    refId:"INC-449", reportType:"VIDEO", state:"Anambra", lga:"Awka South LGA",
    severity:"moderate",
    description:"Video shows a vehicle unloading what appears to be ballot materials outside an uncertified premises near PU 022, Amawbia Ward, approximately 1.2km from designated collation centre.",
    reporter:"Obiageli Nwosu (OBS-OBI-4449)", timestamp:new Date(Date.now()-43*60000).toISOString(),
    status:"pending", lat:6.21, lng:7.07,
    mediaRef:"https://www.w3schools.com/html/mov_bbb.mp4",
  },
  {
    refId:"INC-412", reportType:"IMAGE", state:"Osun", lga:"Osogbo LGA",
    severity:"moderate",
    description:"Result sheet (Form EC8A) partially completed and left unattended on desk at PU 004, Oke-Fia Ward. Presiding officer absent from table for 20+ minutes. Photo evidence attached.",
    reporter:"Tolu Adeyemi (OBS-TOL-4412)", timestamp:new Date(Date.now()-52*60000).toISOString(),
    status:"pending", lat:7.77, lng:4.56,
    mediaRef:"https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/320px-Cat03.jpg",
  },
  {
    refId:"INC-388", reportType:"AUDIO", state:"Akwa Ibom", lga:"Uyo LGA",
    severity:"moderate",
    description:"Audio recording of individuals offering cash payments (reported as ₦3,000 per voter) outside PU 031, Itam Ward. Exchange happening approximately 80m from polling unit entrance.",
    reporter:"Patience Udoh (OBS-PAT-3388)", timestamp:new Date(Date.now()-58*60000).toISOString(),
    status:"pending", lat:5.03, lng:7.91,
    mediaRef:"",
  },
  {
    refId:"INC-355", reportType:"LOCATION", state:"Plateau", lga:"Jos North LGA",
    severity:"low",
    description:"Observer location check-in. Situation calm at PU 009, Tudun Wada Ward. Accreditation proceeding normally. Queue orderly. INEC staff present and professional. No incidents.",
    reporter:"Danjuma Pam (OBS-DAN-3355)", timestamp:new Date(Date.now()-67*60000).toISOString(),
    status:"resolved", lat:9.90, lng:8.86,
    mediaRef:"",
  },
  {
    refId:"INC-327", reportType:"TEXT", state:"Oyo", lga:"Ibadan North LGA",
    severity:"low",
    description:"Minor delay at PU 003, Agodi Ward — polling commenced 52 minutes late due to late arrival of electoral materials. Situation now normalised; accreditation ongoing.",
    reporter:"Biodun Adeleke (OBS-BIO-3327)", timestamp:new Date(Date.now()-74*60000).toISOString(),
    status:"resolved", lat:7.40, lng:3.90,
    mediaRef:"",
  },
  {
    refId:"INC-298", reportType:"LOCATION", state:"Enugu", lga:"Enugu North LGA",
    severity:"low",
    description:"Observer check-in from PU 017, Independence Layout. Voting underway without incident. High turnout — queue extends approximately 200m. INEC officials managing flow well.",
    reporter:"Nkechi Eze (OBS-NKE-2298)", timestamp:new Date(Date.now()-83*60000).toISOString(),
    status:"resolved", lat:6.45, lng:7.50,
    mediaRef:"",
  },
  {
    refId:"INC-271", reportType:"TEXT", state:"Edo", lga:"Oredo LGA",
    severity:"low",
    description:"PU 011, Ring Road Ward — one polling booth collapsed due to heavy rain. INEC quickly relocated voters to adjacent structure. Brief disruption of approx 15 minutes. Voting resumed.",
    reporter:"Osaze Idehen (OBS-OSA-2271)", timestamp:new Date(Date.now()-91*60000).toISOString(),
    status:"resolved", lat:6.34, lng:5.63,
    mediaRef:"",
  },
];

// ── ALERT TICKER ─────────────────────────────────────────────
const TICKER_ALERTS = [
  "🔴 SOS — observer trapped by mob · Nassarawa LGA, Kano — 7 mins ago",
  "🔴 Ballot box snatching attempt · Alimosho LGA, Lagos — image filed",
  "🔴 Polling unit set ablaze · Maiduguri Municipal, Borno — critical",
  "🔴 Pre-marked ballots distributed · D/Line Ward, Port Harcourt — video evidence",
  "🟠 Party agents directing voters inside booth · Fagge Ward, Kano",
  "🟠 Card readers down at 4 units · Bwari, FCT — 230 voters waiting",
  "🟠 Access road blocked · Warri South LGA — burning tyres",
  "🟠 Underage voters observed in queue · Kawo Ward, Kaduna — image attached",
  "🟠 Result sheet left unattended · Oke-Fia Ward, Osun — photo evidence",
  "🟠 Suspected vote buying reported · Itam Ward, Uyo — audio filed",
  "🟢 Observer check-in · Jos North LGA — situation calm",
  "🟢 Voting underway normally · Independence Layout, Enugu — high turnout",
];

function AlertTicker() {
  const [idx, setIdx]       = useState(0);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setInterval(() => {
      setVisible(false);
      setTimeout(() => { setIdx(i => (i + 1) % TICKER_ALERTS.length); setVisible(true); }, 300);
    }, 3000);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{background:"#111827",padding:"6px 24px",display:"flex",alignItems:"center",gap:12,overflow:"hidden"}}>
      <span style={{fontSize:10,fontWeight:700,color:"#EF4444",textTransform:"uppercase",
        letterSpacing:1.2,flexShrink:0}}>LIVE</span>
      <div style={{width:1,height:12,background:"#374151",flexShrink:0}}/>
      <div style={{flex:1,overflow:"hidden"}}>
        <div style={{fontSize:12,fontWeight:500,color:"#F9FAFB",
          opacity:visible?1:0,transition:"opacity 0.3s ease",
          whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
          {TICKER_ALERTS[idx]}
        </div>
      </div>
    </div>
  );
}

// ── HELPERS ──────────────────────────────────────────────────
function timeAgo(iso) {
  const diff = Math.floor((Date.now() - new Date(iso)) / 60000);
  if (diff < 1)  return "Just now";
  if (diff < 60) return `${diff} mins ago`;
  return `${Math.floor(diff/60)}h ago`;
}

function incidentTitle(inc) {
  if (!inc?.description) return "Incident Report";
  const d = inc.description.toLowerCase();
  if (d.includes("ballot box"))   return "Ballot Box Snatching";
  if (d.includes("violence"))     return "Violence Outbreak";
  if (d.includes("intimidation")) return "Voter Intimidation";
  if (d.includes("technical"))    return "Technical Issues";
  if (d.includes("protest"))      return "Protest";
  if (d.includes("irregular"))    return "Irregularities";
  if (d.includes("sos") || inc.reportType === "SOS") return "SOS Emergency";
  const map = { IMAGE:"Image Evidence Filed", VIDEO:"Video Evidence Filed",
    AUDIO:"Audio Report Filed", TEXT:"Text Report Filed",
    LOCATION:"Location Shared", SOS:"SOS Emergency Alert" };
  return map[inc.reportType] || "Incident Report";
}

function reportCount(inc) {
  const map = {
    "INC-831":1420, "INC-744":1850, "INC-692":1380, "INC-615":1650,
    "INC-588":760,  "INC-541":580,  "INC-503":490,  "INC-477":530,
    "INC-449":620,  "INC-412":440,  "INC-388":380,  "INC-355":90,
    "INC-327":110,  "INC-298":130,  "INC-271":95,
  };
  return map[inc.refId] || Math.floor(Math.abs((inc.refId?.charCodeAt(4)||1) * 137) + 50);
}

// ── SEVERITY BADGE ───────────────────────────────────────────
function SeverityBadge({ sev }) {
  const cfg = {
    critical:{ bg:"#EF4444", label:"Critical" },
    moderate:{ bg:"#F97316", label:"Moderate" },
    low:     { bg:"#6B7280", label:"Low"      },
  };
  const { bg, label } = cfg[sev] || cfg.low;
  return (
    <span style={{fontSize:11,fontWeight:700,color:"#fff",background:bg,
      padding:"3px 9px",borderRadius:5,whiteSpace:"nowrap",flexShrink:0}}>
      {label}
    </span>
  );
}

// ── MEDIA LIGHTBOX ────────────────────────────────────────────
function MediaLightbox({ src, isVideo, onClose }) {
  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:9999,
      background:"rgba(0,0,0,0.92)",display:"flex",flexDirection:"column",
      alignItems:"center",justifyContent:"center",padding:20}}>
      <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:780,
        display:"flex",flexDirection:"column",gap:0}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
          padding:"8px 12px",background:"#111827",borderRadius:"12px 12px 0 0"}}>
          <span style={{fontSize:11,fontWeight:700,color:"#9CA3AF",textTransform:"uppercase",letterSpacing:0.8}}>
            {isVideo ? "▶ Video Evidence" : "🖼 Image Evidence"}
          </span>
          <button onClick={onClose} style={{background:"none",border:"none",color:"#9CA3AF",
            fontSize:20,cursor:"pointer",lineHeight:1,padding:"0 4px"}}>×</button>
        </div>
        {isVideo
          ? <video src={src} controls autoPlay style={{width:"100%",maxHeight:"75vh",
              display:"block",background:"#000",borderRadius:"0 0 12px 12px"}}/>
          : <img src={src} alt="Evidence" style={{width:"100%",maxHeight:"75vh",
              objectFit:"contain",display:"block",background:"#000",borderRadius:"0 0 12px 12px"}}/>
        }
      </div>
      <div style={{marginTop:10,fontSize:12,color:"#6B7280"}}>Click outside to close</div>
    </div>
  );
}

// ── MEDIA VIEWER ─────────────────────────────────────────────
function MediaViewer({ mediaRef, reportType }) {
  const [lightbox, setLightbox] = useState(false);
  if (!mediaRef || !mediaRef.startsWith("http")) return null;
  const isVideo = reportType === "VIDEO" || /\.(mp4|webm|mov|avi)(\?|$)/i.test(mediaRef);
  return (
    <>
      <div style={{marginBottom:10,borderRadius:10,overflow:"hidden",border:`1px solid ${C.border}`,background:"#000",cursor:"pointer"}}
        onClick={()=>setLightbox(true)}>
        {isVideo
          ? <video src={mediaRef} style={{width:"100%",maxHeight:220,display:"block",background:"#000",pointerEvents:"none"}}/>
          : <img src={mediaRef} alt="Evidence" style={{width:"100%",maxHeight:220,objectFit:"cover",display:"block"}}
              onError={e=>{e.target.style.display="none";}}/>
        }
        <div style={{padding:"5px 10px",background:"#111827",display:"flex",alignItems:"center",gap:6}}>
          <span style={{fontSize:10,fontWeight:700,color:"#9CA3AF",textTransform:"uppercase",letterSpacing:0.8}}>
            {isVideo ? "▶ Video Evidence" : "🖼 Image Evidence"}
          </span>
          <span style={{marginLeft:"auto",fontSize:10,color:C.green,fontWeight:600}}>
            {isVideo ? "▶ Play" : "🔍 Expand"}
          </span>
        </div>
      </div>
      {lightbox && <MediaLightbox src={mediaRef} isVideo={isVideo} onClose={()=>setLightbox(false)}/>}
    </>
  );
}

// ── INCIDENT DETAIL POPUP ─────────────────────────────────────
function IncidentPopup({ state, incidents, onClose }) {
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",zIndex:300,
      display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:C.white,borderRadius:16,
        width:"100%",maxWidth:480,maxHeight:"80vh",overflowY:"auto",
        boxShadow:"0 20px 60px rgba(0,0,0,0.2)"}}>
        <div style={{padding:"20px 20px 16px",display:"flex",justifyContent:"space-between",
          alignItems:"center",borderBottom:`1px solid ${C.border}`}}>
          <div>
            <div style={{fontSize:17,fontWeight:700,color:C.text}}>{state}</div>
            <div style={{fontSize:13,color:C.sub}}>{incidents.length} incident{incidents.length!==1?"s":""} reported</div>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:22,color:C.sub,cursor:"pointer"}}>×</button>
        </div>
        <div style={{padding:"16px 20px"}}>
          {incidents.map((inc,i)=>(
            <div key={i} style={{borderBottom:i<incidents.length-1?`1px solid ${C.border}`:"none",
              paddingBottom:i<incidents.length-1?14:0,marginBottom:i<incidents.length-1?14:0}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                <div style={{fontWeight:700,fontSize:14,color:C.text}}>{incidentTitle(inc)}</div>
                <SeverityBadge sev={inc.severity}/>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                <ReportTypeBadge type={inc.reportType}/>
                <span style={{fontSize:13,color:C.sub}}>{inc.lga}</span>
              </div>
              <div style={{fontSize:11,fontWeight:700,color:C.sub,textTransform:"uppercase",
                letterSpacing:0.6,marginBottom:3}}>Report Details</div>
              <div style={{fontSize:13,color:C.text,lineHeight:1.5,marginBottom:6,
                background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 10px"}}>
                {inc.description || "No additional details provided."}
              </div>
              <MediaViewer mediaRef={inc.mediaRef} reportType={inc.reportType}/>
              <div style={{display:"flex",gap:16,fontSize:12,color:C.sub,flexWrap:"wrap"}}>
                <span>🕐 {timeAgo(inc.timestamp)}</span>
                <span>👤 {inc.reporter}</span>
                <span style={{fontFamily:"monospace",color:C.green}}>{inc.refId}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── VIEW ALL REPORTS MODAL ───────────────────────────────────
function AllReportsModal({ incidents, onClose }) {
  const [filter, setFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");
  const states = ["all", ...new Set(incidents.map(i=>i.state).filter(Boolean))].sort();
  const filtered = incidents
    .filter(i => filter === "all" || i.severity === filter)
    .filter(i => stateFilter === "all" || i.state === stateFilter);

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",zIndex:300,
      display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:C.white,borderRadius:16,width:"100%",
        maxWidth:680,maxHeight:"88vh",display:"flex",flexDirection:"column",
        boxShadow:"0 20px 60px rgba(0,0,0,0.2)"}}>
        <div style={{padding:"20px 20px 16px",borderBottom:`1px solid ${C.border}`,
          display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
          <div>
            <div style={{fontSize:18,fontWeight:700,color:C.text}}>All Incident Reports</div>
            <div style={{fontSize:13,color:C.sub}}>{filtered.length} of {incidents.length} reports</div>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:22,color:C.sub,cursor:"pointer"}}>×</button>
        </div>
        {/* Filters */}
        <div style={{padding:"10px 20px",borderBottom:`1px solid ${C.border}`,flexShrink:0}}>
          <div style={{display:"flex",gap:6,marginBottom:8,flexWrap:"wrap"}}>
            {[["all","All"],["critical","Critical"],["moderate","Moderate"],["low","Low"]].map(([k,l])=>(
              <button key={k} onClick={()=>setFilter(k)} style={{padding:"5px 12px",borderRadius:20,
                fontSize:12,fontWeight:600,cursor:"pointer",
                border:`1.5px solid ${filter===k?C.green:C.border}`,
                background:filter===k?C.greenLight:C.white,
                color:filter===k?C.green:C.sub}}>
                {l}
              </button>
            ))}
          </div>
          <select value={stateFilter} onChange={e=>setStateFilter(e.target.value)}
            style={{fontSize:12,padding:"5px 10px",borderRadius:8,border:`1.5px solid ${C.border}`,
              color:C.text,background:C.white,cursor:"pointer",outline:"none"}}>
            {states.map(s=><option key={s} value={s}>{s==="all"?"All States":s}</option>)}
          </select>
        </div>
        <div style={{overflowY:"auto",flex:1,padding:"0 20px"}}>
          {filtered.map((inc,i)=>(
            <div key={i} style={{borderBottom:`1px solid ${C.border}`,padding:"14px 0"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                <div style={{fontWeight:700,fontSize:14,color:C.text}}>{incidentTitle(inc)}</div>
                <SeverityBadge sev={inc.severity}/>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                <ReportTypeBadge type={inc.reportType}/>
                <span style={{fontSize:13,color:C.sub}}>{inc.state} · {inc.lga}</span>
              </div>
              <div style={{fontSize:13,color:C.text,lineHeight:1.5,marginBottom:4}}>{inc.description}</div>
              <MediaViewer mediaRef={inc.mediaRef} reportType={inc.reportType}/>
              <div style={{display:"flex",gap:16,fontSize:12,color:C.sub,flexWrap:"wrap"}}>
                <span>🕐 {timeAgo(inc.timestamp)}</span>
                <span>👤 {inc.reporter}</span>
                <span style={{fontFamily:"monospace",color:C.green}}>{inc.refId}</span>
              </div>
            </div>
          ))}
          {filtered.length===0 && (
            <div style={{textAlign:"center",padding:"32px 0",color:C.sub,fontSize:14}}>
              No incidents match these filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── VIEW BY STATE MODAL ───────────────────────────────────────
function ViewByStateModal({ incidents, onClose, onStateClick }) {
  const byState = {};
  incidents.forEach(inc => {
    if (!byState[inc.state]) byState[inc.state] = [];
    byState[inc.state].push(inc);
  });
  const sorted = Object.entries(byState).sort((a,b)=>b[1].length-a[1].length);

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.45)",zIndex:300,
      display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:C.white,borderRadius:16,width:"100%",
        maxWidth:440,maxHeight:"80vh",display:"flex",flexDirection:"column",
        boxShadow:"0 20px 60px rgba(0,0,0,0.2)"}}>
        <div style={{padding:"20px 20px 16px",borderBottom:`1px solid ${C.border}`,
          display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
          <div style={{fontSize:17,fontWeight:700,color:C.text}}>Incidents by State</div>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:22,color:C.sub,cursor:"pointer"}}>×</button>
        </div>
        <div style={{overflowY:"auto",flex:1,padding:"8px 0"}}>
          {sorted.map(([state, incs])=>{
            const hasCritical = incs.some(i=>i.severity==="critical");
            const hasModerate = incs.some(i=>i.severity==="moderate");
            const color = hasCritical ? C.critical : hasModerate ? C.moderate : C.low;
            return (
              <button key={state} onClick={()=>{onStateClick(state,incs);onClose();}}
                style={{width:"100%",padding:"12px 20px",background:"none",border:"none",
                  cursor:"pointer",display:"flex",alignItems:"center",gap:12,textAlign:"left",
                  borderBottom:`1px solid ${C.border}`}}>
                <div style={{width:10,height:10,borderRadius:"50%",background:color,flexShrink:0}}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:14,fontWeight:600,color:C.text}}>{state}</div>
                  <div style={{fontSize:12,color:C.sub,marginTop:2}}>
                    {incs.length} incident{incs.length!==1?"s":""}
                    {hasCritical?" · 🔴 Critical":""}
                  </div>
                </div>
                <span style={{fontSize:12,color:C.sub}}>→</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── LEAFLET INCIDENT MAP ──────────────────────────────────────
function LeafletIncidentMap({ incidents, onMarkerClick }) {
  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const markersRef = useRef([]);
  const tileLayerRef = useRef(null);
  const [satellite, setSatellite] = useState(false);

  const buildMap = useCallback(() => {
    if (!window.L || !mapRef.current || leafletMap.current) return;

    const map = window.L.map(mapRef.current, {
      center: [9.0, 8.0], zoom: 5.6,
      attributionControl: false, zoomControl: true,
    });

    // OpenStreetMap street tiles (default)
    tileLayerRef.current = window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19, attribution: "© OpenStreetMap"
    }).addTo(map);

    // Add small attribution in corner
    window.L.control.attribution({ position: "bottomleft" })
      .addAttribution("© OpenStreetMap").addTo(map);

    leafletMap.current = map;
    return map;
  }, []);

  const addMarkers = useCallback((map, incsData) => {
    // Clear old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // Group by state
    const byState = {};
    incsData.forEach(inc => {
      if (!byState[inc.state]) byState[inc.state] = [];
      byState[inc.state].push(inc);
    });

    Object.entries(byState).forEach(([state, incs]) => {
      const ll = STATE_LATLNG[state];
      if (!ll) return;

      const hasCritical = incs.some(i => i.severity === "critical");
      const hasModerate = incs.some(i => i.severity === "moderate");
      const color = hasCritical ? "#EF4444" : hasModerate ? "#F97316" : "#9CA3AF";
      const count = incs.reduce((s, i) => s + reportCount(i), 0);
      const size = count >= 1000 ? 36 : count >= 400 ? 28 : 20;
      const border = hasCritical ? "3px solid #fff" : "2px solid #fff";

      const icon = window.L.divIcon({
        className: "",
        html: `<div class="ems-dot" style="
          width:${size}px;height:${size}px;border-radius:50%;
          background:${color};border:${border};
          box-shadow:0 2px 8px rgba(0,0,0,0.35);
          display:flex;align-items:center;justify-content:center;
          color:white;font-size:${size>26?11:9}px;font-weight:700;
          cursor:pointer;position:relative;
          ${hasCritical?`animation:emsPulse 1.8s ease infinite;`:""}
        ">${incs.length}</div>`,
        iconSize: [size, size], iconAnchor: [size/2, size/2],
      });

      const marker = window.L.marker(ll, { icon })
        .addTo(map)
        .on("click", () => onMarkerClick(state, incs));

      // Tooltip
      marker.bindTooltip(
        `<b>${state}</b> · ${incs.length} incident${incs.length!==1?"s":""}<br/>`
        + (hasCritical ? "🔴 Critical" : hasModerate ? "🟠 Moderate" : "🔵 Low"),
        { direction:"top", offset:[0,-size/2], className:"ems-tooltip" }
      );

      markersRef.current.push(marker);
    });
  }, [onMarkerClick]);

  useEffect(() => {
    // Load Leaflet CSS
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
      document.head.appendChild(link);
    }

    const init = () => {
      const map = buildMap();
      if (map) addMarkers(map, incidents);
    };

    if (window.L) { init(); return; }
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
    script.onload = init;
    document.head.appendChild(script);

    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
        markersRef.current = [];
      }
    };
  }, []);

  // Swap tile layer when satellite toggle changes
  useEffect(() => {
    if (!leafletMap.current || !window.L) return;
    if (tileLayerRef.current) { tileLayerRef.current.remove(); tileLayerRef.current = null; }
    const url = satellite
      ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    tileLayerRef.current = window.L.tileLayer(url, { maxZoom: 19 }).addTo(leafletMap.current);
    tileLayerRef.current.bringToBack();
  }, [satellite]);

  // Update markers when incidents change
  useEffect(() => {
    if (leafletMap.current && window.L) addMarkers(leafletMap.current, incidents);
  }, [incidents, addMarkers]);

  return (
    <>
      <style>{`
        @keyframes emsPulse {
          0%,100%{box-shadow:0 2px 8px rgba(239,68,68,0.35),0 0 0 0 rgba(239,68,68,0.4)}
          50%{box-shadow:0 2px 8px rgba(239,68,68,0.35),0 0 0 10px rgba(239,68,68,0)}
        }
        .ems-tooltip { background:#111827 !important; border:none !important; color:#fff !important; font-size:12px !important; border-radius:6px !important; padding:6px 10px !important; }
        .ems-tooltip::before { display:none !important; }
        .leaflet-tooltip-top.ems-tooltip::before { border-top-color:#111827 !important; display:block !important; }
      `}</style>
      <div ref={mapRef} style={{width:"100%",height:"100%"}}/>
      {/* Map type toggle */}
      <button onClick={()=>setSatellite(s=>!s)}
        style={{position:"absolute",top:10,right:10,zIndex:400,
          background:"rgba(255,255,255,0.92)",backdropFilter:"blur(4px)",
          border:"1px solid #ddd",borderRadius:8,padding:"5px 10px",
          fontSize:11,fontWeight:700,cursor:"pointer",color:"#111827",
          boxShadow:"0 1px 4px rgba(0,0,0,0.15)"}}>
        {satellite ? "🗺 Street" : "🛰 Satellite"}
      </button>
    </>
  );
}

// ── STAT CARD ─────────────────────────────────────────────────
function StatCard({ label, value, sub, icon, color }) {
  return (
    <div style={{flex:1,background:C.white,border:`1px solid ${C.border}`,borderRadius:10,
      padding:"16px 18px",minWidth:0,position:"relative",display:"flex",
      flexDirection:"column",justifyContent:"space-between"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
        <div style={{fontSize:12,color:C.sub,fontWeight:500}}>{label}</div>
        <div style={{width:34,height:34,borderRadius:9,flexShrink:0,
          background:color?`${color}1A`:C.greenLight,
          display:"flex",alignItems:"center",justifyContent:"center"}}>
          {icon}
        </div>
      </div>
      <div>
        <div style={{fontSize:26,fontWeight:800,color:C.text,lineHeight:1}}>{value}</div>
        <div style={{fontSize:12,color:C.sub,marginTop:5}}>{sub}</div>
      </div>
    </div>
  );
}

// ── INCIDENT ROW ──────────────────────────────────────────────
// ── REPORT TYPE BADGE ─────────────────────────────────────────
function ReportTypeBadge({ type }) {
  const cfg = {
    AUDIO:    { label:"Audio",    color:"#8B5CF6", icon:(
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
        <rect x="9" y="2" width="6" height="12" rx="3" fill="#8B5CF6"/>
        <path d="M5 11a7 7 0 0014 0" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" fill="none"/>
        <line x1="12" y1="18" x2="12" y2="22" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round"/>
      </svg>) },
    VIDEO:    { label:"Video",    color:"#EC4899", icon:(
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="5" width="14" height="14" rx="2" fill="#EC4899"/>
        <path d="M16 10l6-3v10l-6-3z" fill="#EC4899"/>
      </svg>) },
    IMAGE:    { label:"Image",    color:"#3B82F6", icon:(
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="3" width="20" height="16" rx="2" fill="#3B82F6"/>
        <circle cx="8" cy="9" r="2" fill="#fff"/>
        <path d="M2 17l5-5 4 4 5-6 6 7H2z" fill="#fff" opacity="0.9"/>
      </svg>) },
    TEXT:     { label:"Text",     color:"#6B7280", icon:(
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
        <path d="M5 3h11l3 3v15H5z" fill="#6B7280"/>
        <line x1="8" y1="11" x2="16" y2="11" stroke="#fff" strokeWidth="1.5"/>
        <line x1="8" y1="15" x2="13" y2="15" stroke="#fff" strokeWidth="1.5"/>
      </svg>) },
    LOCATION: { label:"Location", color:"#10B981", icon:(
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
        <path d="M12 22s8-7 8-12a8 8 0 10-16 0c0 5 8 12 8 12z" fill="#10B981"/>
        <circle cx="12" cy="10" r="2.5" fill="#fff"/>
      </svg>) },
    SOS:      { label:"SOS",      color:"#EF4444", icon:(
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L2 21h20L12 2z" fill="#EF4444"/>
        <line x1="12" y1="9" x2="12" y2="14" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="12" cy="17" r="1" fill="#fff"/>
      </svg>) },
  };
  const c = cfg[type] || cfg.TEXT;
  return (
    <span style={{display:"inline-flex",alignItems:"center",gap:4,
      background:`${c.color}1A`,color:c.color,fontSize:10,fontWeight:700,
      borderRadius:6,padding:"2px 7px",flexShrink:0}}>
      {c.icon}{c.label}
    </span>
  );
}

function IncidentRow({ inc, onClick }) {
  const title = incidentTitle(inc);
  const count = reportCount(inc);
  return (
    <button onClick={onClick} style={{width:"100%",background:"none",border:"none",cursor:"pointer",
      textAlign:"left",borderBottom:`1px solid ${C.border}`,padding:"11px 0"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:5,gap:6}}>
        <span style={{fontSize:13,fontWeight:600,color:C.text,flex:1,paddingRight:4}}>{title}</span>
        <SeverityBadge sev={inc.severity}/>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:5}}>
        <ReportTypeBadge type={inc.reportType}/>
        <span style={{fontSize:12,color:C.sub}}>{inc.state} · {inc.lga}</span>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontSize:11,color:C.sub}}>🕐 {timeAgo(inc.timestamp)}</span>
        <span style={{fontSize:11,fontWeight:600,color:C.text}}>{count.toLocaleString()} reports</span>
      </div>
    </button>
  );
}

// ── API FETCH ─────────────────────────────────────────────────
async function fetchIncidents(signal) {
  const res = await fetch(GAS_URL + "?action=get", { signal });
  if (!res.ok) throw new Error(`GAS returned HTTP ${res.status}`);
  const text = await res.text();
  // GAS sometimes wraps response — strip any leading junk before {
  const clean = text.slice(text.indexOf("{"));
  if (!clean) throw new Error("GAS response was not JSON");
  const data = JSON.parse(clean);
  if (!data.success) throw new Error(data.error || "GAS returned success:false");

  // Normalise field names — GAS doGet returns camelCase already,
  // but guard against any sheet rows that come back with empty keys
  const incidents = (data.incidents || []).map(r => ({
    timestamp  : r.timestamp   || "",
    refId      : r.refId       || "",
    reporter   : r.reporter    || "Unknown",
    reportType : (r.reportType || "TEXT").toUpperCase(),
    state      : r.state       || "",
    lga        : r.lga         || "",
    severity   : (r.severity   || "low").toLowerCase(),
    description: r.description || "",
    lat        : parseFloat(r.lat) || 0,
    lng        : parseFloat(r.lng) || 0,
    status     : r.status      || "pending",
    mediaRef   : r.mediaRef    || "",
  })).filter(r => r.state); // drop empty header rows if any

  return { success: true, incidents, summary: data.summary };
}

// ── DASHBOARD ROOT ────────────────────────────────────────────
export default function Dashboard() {
  const [incidents,  setIncidents]  = useState(MOCK_INCIDENTS);
  const [summary,    setSummary]    = useState({
    total   : MOCK_INCIDENTS.length,
    critical: MOCK_INCIDENTS.filter(i=>i.severity==="critical").length,
    moderate: MOCK_INCIDENTS.filter(i=>i.severity==="moderate").length,
    low     : MOCK_INCIDENTS.filter(i=>i.severity==="low").length,
    states  : 36,
  });
  const [loading,    setLoading]    = useState(true);
  const [fetchErr,   setFetchErr]   = useState("");
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [popup,      setPopup]      = useState(null);   // { state, incidents }
  const [mapFullscreen, setMapFullscreen] = useState(false);
  const [showAll,    setShowAll]    = useState(false);
  const [showByState,setShowByState]= useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      // 12s timeout — GAS can be slow on cold start
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 12000);
      const data = await fetchIncidents(controller.signal);
      clearTimeout(timer);
      // Only replace mock data if we actually got real rows back
      if (data.incidents.length > 0) {
        setIncidents(data.incidents);
        setSummary(data.summary || null);
      }
      setLastUpdate(new Date());
      setFetchErr("");
    } catch(e) {
      const msg = e.name === "AbortError"
        ? "Live data timed out — showing last known data"
        : `Could not reach live data: ${e.message}`;
      console.warn("load failed:", msg);
      setFetchErr(msg);
      // incidents stay as-is (mock or previously loaded live data)
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(load, 30000);
    return () => { clearInterval(t); };
  }, [load]);

  const handleMarkerClick = (state, incs) => setPopup({ state, incs });

  const recent = [...incidents]
    .sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 7);

  const criticalCount = incidents.filter(i=>i.severity==="critical").length;
  const totalReports  = incidents.reduce((s,i)=>s+reportCount(i), 0);

  return (
    <div style={{fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif",
      background:C.bg,height:"100vh",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-track{background:#f1f1f1}
        ::-webkit-scrollbar-thumb{background:#ccc;border-radius:3px}
        @keyframes livePulse{
          0%,100%{box-shadow:0 0 0 3px rgba(239,68,68,0.2)}
          50%{box-shadow:0 0 0 6px rgba(239,68,68,0.05)}
        }
      `}</style>

      {/* ── Splash Screen ── */}
      {/* ── Top Bar ── */}
      <div style={{flexShrink:0,background:C.white,borderBottom:`1px solid ${C.border}`,
        padding:"14px 24px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{display:"inline-block",border:"2px solid #2DB94D",borderRadius:4,padding:"2px 8px",marginBottom:4}}>
            <span style={{fontSize:18,fontWeight:800,color:C.green}}>EMS Dashboard</span>
          </div>
          <div style={{fontSize:13,color:C.sub}}>Real-time election monitoring and incident tracking</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          {loading && <span style={{fontSize:12,color:C.sub}}>Refreshing…</span>}
          {!loading && fetchErr && (
            <span style={{fontSize:11,color:"#EF4444",background:"#FEF2F2",border:"1px solid #FECACA",
              borderRadius:6,padding:"3px 8px",maxWidth:260,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}
              title={fetchErr}>⚠ {fetchErr}</span>
          )}
          <button onClick={load} style={{padding:"6px 12px",borderRadius:8,fontSize:12,fontWeight:600,
            border:`1px solid ${C.border}`,background:C.white,color:C.text,cursor:"pointer"}}>
            ↻ Refresh
          </button>
          <div style={{display:"flex",alignItems:"center",gap:6,background:C.white,
            border:`1px solid ${C.border}`,borderRadius:20,padding:"5px 14px"}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:C.liveDot,flexShrink:0,
              animation:"livePulse 1.5s ease infinite"}}/>
            <span style={{fontSize:13,fontWeight:600,color:C.text}}>Live</span>
          </div>
        </div>
      </div>

      {/* ── Alert Ticker ── */}
      <div style={{flexShrink:0}}>
        <AlertTicker/>
      </div>

      <div style={{padding:"18px 24px",flex:1,minHeight:0,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        {/* ── Stat Cards ── */}
        <div style={{display:"flex",gap:14,marginBottom:18,flexShrink:0}}>
          <StatCard label="Number of Occurrences" value={totalReports.toLocaleString()}
            sub="+12% from last week" color={C.moderate} icon={<AlertTriangleIcon color={C.moderate}/>}/>
          <StatCard label="Location of Election"  value={`${summary?.states ?? new Set(incidents.map(i=>i.state).filter(Boolean)).size} States`}
            sub="774 LGAs monitored" color={C.green} icon={<MapPinStatIcon color={C.green}/>}/>
          <StatCard label="Incident Reports" value={incidents.length.toLocaleString()}
            sub={`Updated ${timeAgo(lastUpdate.toISOString())}`} color="#3B82F6" icon={<DocStatIcon color="#3B82F6"/>}/>
          <StatCard label="Critical Alerts" value={criticalCount}
            sub={`${incidents.filter(i=>i.severity==="moderate").length} moderate`} color={C.critical} icon={<SirenStatIcon color={C.critical}/>}/>
        </div>

        {/* ── Main Layout ── */}
        <div style={{display:"flex",gap:18,alignItems:"stretch",flex:1,minHeight:0}}>

          {/* Left: Map */}
          <div style={{flex:"1 1 0",minWidth:0,background:C.white,border:`1px solid ${C.border}`,
            borderRadius:10,padding:16,display:"flex",flexDirection:"column",
            position:"relative",zIndex:0,isolation:"isolate",minHeight:0}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10,flexShrink:0}}>
              <span style={{fontSize:14,fontWeight:600,color:C.text}}>Incident Distribution Map</span>
              <div style={{display:"flex",alignItems:"center",gap:14,fontSize:12,color:C.sub}}>
                <span style={{display:"flex",alignItems:"center",gap:4}}>
                  <span style={{width:10,height:10,borderRadius:"50%",background:"#9CA3AF",display:"inline-block"}}/>
                  Low
                </span>
                <span style={{display:"flex",alignItems:"center",gap:4}}>
                  <span style={{width:12,height:12,borderRadius:"50%",background:C.moderate,display:"inline-block"}}/>
                  Moderate
                </span>
                <span style={{display:"flex",alignItems:"center",gap:4}}>
                  <span style={{width:14,height:14,borderRadius:"50%",background:C.critical,display:"inline-block"}}/>
                  Critical
                </span>
                <button onClick={()=>setMapFullscreen(true)}
                  title="Fullscreen map"
                  style={{marginLeft:6,padding:"4px 8px",borderRadius:6,border:`1px solid ${C.border}`,
                    background:C.white,cursor:"pointer",display:"flex",alignItems:"center",gap:5,
                    fontSize:11,fontWeight:600,color:C.text}}>
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                    <path d="M1 6V1h5M10 1h5v5M15 10v5h-5M6 15H1v-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Expand
                </button>
              </div>
            </div>
            {/* Real Leaflet map */}
            <div style={{position:"relative",zIndex:0,borderRadius:8,overflow:"hidden",flex:1,minHeight:0,border:`1px solid ${C.border}`}}>
              <LeafletIncidentMap incidents={incidents} onMarkerClick={handleMarkerClick}/>
            </div>
          </div>

          {/* Fullscreen map overlay */}
          {mapFullscreen && (
            <div style={{position:"fixed",inset:0,zIndex:9999,background:C.white,display:"flex",flexDirection:"column"}}>
              <div style={{flexShrink:0,padding:"12px 20px",borderBottom:`1px solid ${C.border}`,
                display:"flex",justifyContent:"space-between",alignItems:"center",background:C.white}}>
                <div style={{display:"flex",alignItems:"center",gap:16}}>
                  <span style={{fontSize:15,fontWeight:700,color:C.text}}>Incident Distribution Map</span>
                  <div style={{display:"flex",alignItems:"center",gap:12,fontSize:12,color:C.sub}}>
                    <span style={{display:"flex",alignItems:"center",gap:4}}>
                      <span style={{width:10,height:10,borderRadius:"50%",background:"#9CA3AF",display:"inline-block"}}/>Low
                    </span>
                    <span style={{display:"flex",alignItems:"center",gap:4}}>
                      <span style={{width:12,height:12,borderRadius:"50%",background:C.moderate,display:"inline-block"}}/>Moderate
                    </span>
                    <span style={{display:"flex",alignItems:"center",gap:4}}>
                      <span style={{width:14,height:14,borderRadius:"50%",background:C.critical,display:"inline-block"}}/>Critical
                    </span>
                  </div>
                </div>
                <button onClick={()=>setMapFullscreen(false)}
                  style={{padding:"7px 16px",borderRadius:8,border:`1px solid ${C.border}`,
                    background:C.white,cursor:"pointer",display:"flex",alignItems:"center",gap:6,
                    fontSize:13,fontWeight:600,color:C.text}}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path d="M6 1v5H1M10 1v5h5M1 10h5v5M15 10h-5v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Exit Fullscreen
                </button>
              </div>
              <div style={{flex:1,minHeight:0,position:"relative"}}>
                <LeafletIncidentMap incidents={incidents} onMarkerClick={(s,incs)=>{setPopup({state:s,incs});setMapFullscreen(false);}}/>
              </div>
            </div>
          )}

          {/* Right: Reports panel */}
          <div style={{width:310,flexShrink:0,background:C.white,border:`1px solid ${C.border}`,
            borderRadius:10,display:"flex",flexDirection:"column",minHeight:0}}>
            <div style={{padding:"14px 16px",borderBottom:`1px solid ${C.border}`,
              display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
              <span style={{fontSize:13,fontWeight:600,color:C.text}}>Recent Incident Reports</span>
              <button onClick={()=>setShowByState(true)}
                style={{background:C.green,color:"#fff",border:"none",borderRadius:6,
                  padding:"5px 10px",fontSize:11,fontWeight:600,cursor:"pointer"}}>
                View By State
              </button>
            </div>

            <div style={{flex:1,overflowY:"auto",padding:"0 16px",minHeight:0}}>
              {recent.map((inc,i)=>(
                <IncidentRow key={i} inc={inc}
                  onClick={()=>setPopup({ state:inc.state, incs:[inc] })}/>
              ))}
            </div>

            <div style={{padding:"12px 16px",borderTop:`1px solid ${C.border}`,flexShrink:0}}>
              <button onClick={()=>setShowAll(true)}
                style={{width:"100%",padding:"12px",background:C.green,color:"#fff",border:"none",
                  borderRadius:8,fontSize:14,fontWeight:700,cursor:"pointer"}}>
                View All Reports
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {popup && <IncidentPopup state={popup.state} incidents={popup.incs} onClose={()=>setPopup(null)}/>}
      {showAll && <AllReportsModal incidents={incidents} onClose={()=>setShowAll(false)}/>}
      {showByState && (
        <ViewByStateModal incidents={incidents}
          onClose={()=>setShowByState(false)}
          onStateClick={(s,incs)=>setPopup({state:s,incs})}/>
      )}
    </div>
  );
}