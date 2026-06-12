import { useState, useEffect, useRef, useCallback } from "react";

// ── CONFIG ─────────────────────────────────────────────────────
const GAS_URL = "https://script.google.com/macros/s/AKfycbx6RU2hcrNv9ig33c1tp-OGvw1-Wx_BkwSjfzm1_8zvGeKRcQB82VbYYgJOfJ3l3l1LeQ/exec"; // ← paste deployed GAS URL

// ── COLOURS ───────────────────────────────────────────────────
const C = {
  green      : "#3CB043",
  greenBright: "#5EE05E",
  greenDark  : "#279E2C",
  white      : "#FFFFFF",
  bg         : "#FFFFFF",
  grey       : "#9CA3AF",
  greyDark   : "#6B7280",
  text       : "#111827",
  border     : "#E5E7EB",
  cardBg     : "#FFFFFF",
};

// ── NIGERIA STATES ────────────────────────────────────────────
const STATES_NG = ["Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno",
  "Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT","Gombe","Imo","Jigawa","Kaduna",
  "Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa","Niger","Ogun","Ondo","Osun",
  "Oyo","Plateau","Rivers","Sokoto","Taraba","Yobe","Zamfara"];
const ROLES = ["Accredited Observer","Electoral Official","Polling Agent","Security Personnel","Voter"];

// ── SHARED STYLES ─────────────────────────────────────────────
const labelStyle = {fontSize:11,fontWeight:600,color:C.greyDark,textTransform:"uppercase",
  letterSpacing:0.7,display:"block",marginBottom:5};
const inputStyle = {width:"100%",padding:"11px 13px",borderRadius:10,border:`1.5px solid ${C.border}`,
  fontSize:14,color:C.text,background:"#F9FAFB",outline:"none",fontFamily:"inherit",boxSizing:"border-box"};
const submitBtnStyle = {width:"100%",padding:"14px",marginTop:16,borderRadius:12,border:"none",
  cursor:"pointer",background:`linear-gradient(135deg,${C.green},${C.greenDark})`,color:"#fff",
  fontSize:15,fontWeight:700,boxShadow:`0 4px 16px rgba(60,176,67,0.35)`,display:"block"};

// ── ICONS ─────────────────────────────────────────────────────
const MicIcon = () => (
  <svg width="40" height="40" viewBox="0 0 52 52" fill="none">
    <rect x="18" y="4" width="16" height="28" rx="8" fill={C.greenBright}/>
    <path d="M10 24C10 33.4 17.6 41 27 41 36.4 41 44 33.4 44 24" stroke={C.greenBright} strokeWidth="3.5" strokeLinecap="round" fill="none"/>
    <line x1="27" y1="41" x2="27" y2="50" stroke={C.greenBright} strokeWidth="3.5" strokeLinecap="round"/>
    <line x1="18" y1="50" x2="36" y2="50" stroke={C.greenBright} strokeWidth="3.5" strokeLinecap="round"/>
  </svg>
);
const ImageIcon = () => (
  <svg width="40" height="40" viewBox="0 0 52 52" fill="none">
    <rect x="4" y="8" width="44" height="34" rx="4" fill={C.greenBright}/>
    <circle cx="16" cy="20" r="5" fill="white" opacity="0.9"/>
    <path d="M4 38L16 26L24 34L34 20L48 42H4Z" fill="white" opacity="0.85"/>
    <circle cx="42" cy="14" r="4" fill="white" opacity="0.9"/>
  </svg>
);
const VideoIcon = () => (
  <svg width="40" height="40" viewBox="0 0 52 52" fill="none">
    <circle cx="26" cy="26" r="24" fill={C.greenBright}/>
    <path d="M21 17L38 26L21 35V17Z" fill="white"/>
  </svg>
);
const LocationPinIcon = () => (
  <svg width="40" height="40" viewBox="0 0 52 52" fill="none">
    <circle cx="26" cy="26" r="24" fill={C.greenBright}/>
    <path d="M26 8C19.4 8 14 13.4 14 20C14 29 26 44 26 44C26 44 38 29 38 20C38 13.4 32.6 8 26 8Z" fill="white"/>
    <circle cx="26" cy="20" r="5" fill={C.greenBright}/>
  </svg>
);
const HomeIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M3 9.5L12 3L21 9.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" stroke={active?C.green:C.grey} strokeWidth="2" fill={active?C.green:"none"}/>
    <path d="M9 21V12h6v9" stroke={active?"white":C.grey} strokeWidth="2"/>
  </svg>
);
const ContactsIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="9" cy="7" r="4" stroke={active?C.green:C.grey} strokeWidth="1.8" fill="none"/>
    <path d="M2 20c0-4 3-7 7-7" stroke={active?C.green:C.grey} strokeWidth="1.8" strokeLinecap="round" fill="none"/>
    <circle cx="17" cy="10" r="3" stroke={active?C.green:C.grey} strokeWidth="1.8" fill="none"/>
    <path d="M14 20c0-3 1.5-5 3-5s3 2 3 5" stroke={active?C.green:C.grey} strokeWidth="1.8" strokeLinecap="round" fill="none"/>
  </svg>
);
const PhoneIcon = ({ color=C.grey }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M22 16.92v3a2 2 0 01-2.18 2A19.79 19.79 0 013.09 5.18 2 2 0 015.07 3h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L9.09 10.91a16 16 0 004 4l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z" stroke={color} strokeWidth="1.8" fill="none"/>
  </svg>
);
const ProfileIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="4" stroke={active?C.green:C.grey} strokeWidth="1.8" fill="none"/>
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={active?C.green:C.grey} strokeWidth="1.8" strokeLinecap="round" fill="none"/>
  </svg>
);
const WarningIcon = () => (
  <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
    <path d="M17 4L31 28H3L17 4Z" stroke="white" strokeWidth="2.5" strokeLinejoin="round" fill="none"/>
    <line x1="17" y1="14" x2="17" y2="21" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="17" cy="25" r="1.5" fill="white"/>
  </svg>
);
const InfoStarIcon = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
    <circle cx="22" cy="22" r="20" stroke="white" strokeWidth="2" fill="none"/>
    <text x="22" y="28" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">i</text>
    <text x="30" y="14" textAnchor="middle" fill="white" fontSize="12">✦</text>
  </svg>
);
const ExpandIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M10 2h4v4M14 2L9 7M6 14H2v-4M2 14l5-5" stroke={C.green} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// ── SEVERITY PICKER ───────────────────────────────────────────
function SeverityPicker({ value, onChange }) {
  return (
    <div style={{display:"flex",gap:8}}>
      {[["low","Low","#10B981"],["moderate","Moderate","#F59E0B"],["critical","Critical","#EF4444"]].map(([k,l,color])=>(
        <button key={k} onClick={()=>onChange(k)} style={{flex:1,padding:"10px",borderRadius:10,fontSize:13,
          fontWeight:600,border:`1.5px solid ${value===k?color:C.border}`,
          background:value===k?`${color}15`:"#F9FAFB",color:value===k?color:C.greyDark,cursor:"pointer"}}>
          {l}
        </button>
      ))}
    </div>
  );
}

// ── GPS BADGE ─────────────────────────────────────────────────
function GPSBadge({ coords }) {
  const lat = coords?.lat || "detecting…";
  const lng = coords?.lng || "";
  return (
    <div style={{background:"#E8F8ED",borderRadius:12,padding:"10px 14px",display:"flex",gap:10,alignItems:"center",marginTop:4}}>
      <span style={{fontSize:16}}>📍</span>
      <div>
        <div style={{fontSize:12,fontWeight:600,color:C.green}}>GPS location detected</div>
        <div style={{fontSize:11,color:C.greyDark,fontFamily:"monospace"}}>
          {coords ? `${lat}° N, ${lng}° E` : "Getting location…"}
        </div>
      </div>
    </div>
  );
}

// ── SUCCESS VIEW ──────────────────────────────────────────────
function SuccessView({ label, refId }) {
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:16,padding:"28px 0",textAlign:"center"}}>
      <div style={{width:70,height:70,borderRadius:"50%",background:"#E8F8ED",display:"flex",alignItems:"center",justifyContent:"center",fontSize:34}}>✓</div>
      <div style={{fontSize:16,fontWeight:700,color:C.text}}>{label} submitted</div>
      <div style={{fontSize:13,color:C.greyDark}}>Ref: <span style={{fontFamily:"monospace",color:C.green}}>{refId}</span></div>
      <div style={{background:"#E8F8ED",borderRadius:12,padding:"12px 16px",width:"100%",fontSize:12,color:C.greyDark,lineHeight:2,textAlign:"left"}}>
        <div>📍 Location — auto-attached</div>
        <div>🕐 {new Date().toLocaleTimeString()}</div>
        <div>👤 Reporter on record</div>
        <div>📡 Dashboard notified</div>
      </div>
    </div>
  );
}

// ── TOAST ─────────────────────────────────────────────────────
function Toast({ msg, type, onDone }) {
  useEffect(()=>{ const t=setTimeout(onDone,3200); return()=>clearTimeout(t); },[]);
  return (
    <div style={{position:"fixed",top:24,left:"50%",transform:"translateX(-50%)",
      background:type==="error"?"#EF4444":"#111827",color:"#fff",padding:"12px 20px",
      borderRadius:12,fontSize:14,fontWeight:600,zIndex:9999,
      boxShadow:"0 8px 24px rgba(0,0,0,0.2)",whiteSpace:"nowrap",maxWidth:320,textAlign:"center"}}>
      {msg}
    </div>
  );
}

// ── MODAL WRAPPER ─────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",zIndex:200,display:"flex",alignItems:"flex-end"}}
      onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:C.white,borderRadius:"20px 20px 0 0",
        width:"100%",maxHeight:"88vh",overflowY:"auto",padding:"0 0 36px"}}>
        <div style={{width:40,height:4,background:C.border,borderRadius:2,margin:"14px auto 0"}}/>
        <div style={{padding:"16px 20px 0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontSize:17,fontWeight:700,color:C.text}}>{title}</span>
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:22,color:C.grey,cursor:"pointer",lineHeight:1}}>×</button>
        </div>
        <div style={{padding:"16px 20px 0"}}>{children}</div>
      </div>
    </div>
  );
}

// ── AUDIO MODAL — real MediaRecorder ─────────────────────────
function AudioModal({ user, onClose, onSubmit }) {
  const [recording, setRecording] = useState(false);
  const [done, setDone] = useState(false);
  const [secs, setSecs] = useState(0);
  const [state, setState] = useState("");
  const [lga, setLga] = useState("");
  const [desc, setDesc] = useState("");
  const [severity, setSeverity] = useState("moderate");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [audioURL, setAudioURL] = useState("");
  const timerRef = useRef(null);
  const mrRef = useRef(null);
  const chunksRef = useRef([]);
  const refId = useRef("INC-" + Date.now().toString().slice(-6));
  const fmt = s => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  const startRec = async () => {
    setErrMsg("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      const mr = new MediaRecorder(stream);
      mrRef.current = mr;
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioURL(URL.createObjectURL(blob));
        stream.getTracks().forEach(t => t.stop());
      };
      mr.start();
      setRecording(true);
      timerRef.current = setInterval(() => setSecs(s => s + 1), 1000);
    } catch (e) {
      setErrMsg("Microphone access denied. Please allow mic permission in your browser settings.");
    }
  };

  const stopRec = () => {
    clearInterval(timerRef.current);
    mrRef.current?.stop();
    setRecording(false);
    setDone(true);
  };

  const toggle = () => { if (done) return; recording ? stopRec() : startRec(); };

  const submit = async () => {
    setSubmitting(true);
    await onSubmit({ reporter:user?.name||"Observer", reportType:"AUDIO", state, lga, severity,
      description: desc || `Audio report · ${fmt(secs)}`, lat:"", lng:"", mediaRef:refId.current });
    setSubmitting(false);
    setSuccess(true);
  };

  if (success) return <Modal title="Audio Report" onClose={onClose}><SuccessView label="Audio report" refId={refId.current}/></Modal>;

  return (
    <Modal title="Audio Report" onClose={onClose}>
      {errMsg && <div style={{background:"#FEF2F2",border:"1px solid #FECACA",borderRadius:10,padding:"10px 14px",fontSize:13,color:"#EF4444",marginBottom:12}}>{errMsg}</div>}
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:16,paddingBottom:8}}>
        <button onClick={toggle} style={{width:100,height:100,borderRadius:"50%",border:"none",
          cursor:done?"default":"pointer",
          background:recording?"linear-gradient(135deg,#EF4444,#FF6B6B)":`linear-gradient(135deg,${C.green},${C.greenDark})`,
          display:"flex",alignItems:"center",justifyContent:"center",fontSize:34,
          boxShadow:recording?"0 6px 24px rgba(239,68,68,0.4)":"0 6px 24px rgba(60,176,67,0.35)",transition:"all 0.2s"}}>
          {done ? "✓" : recording ? "⏹" : "🎙️"}
        </button>
        {recording && (
          <div style={{display:"flex",alignItems:"center",gap:3,height:32}}>
            {[1,2,3,4,5,6,7,8,9,10].map(i=>(
              <div key={i} style={{width:4,borderRadius:2,background:"#EF4444",
                animation:`wave${i%3} 0.${5+i%4}s ease-in-out infinite alternate`,
                height:`${12+Math.sin(i)*10}px`}}/>
            ))}
          </div>
        )}
        <div style={{fontSize:30,fontFamily:"monospace",fontWeight:700,
          color:recording?"#EF4444":done?C.green:C.grey,letterSpacing:3}}>
          {fmt(secs)}
        </div>
        <p style={{fontSize:13,color:C.greyDark,margin:0,textAlign:"center"}}>
          {done ? "Recording ready — add details below" : recording ? "Recording… tap ⏹ to stop" : "Tap 🎙️ to start recording"}
        </p>
        {audioURL && <audio controls src={audioURL} style={{width:"100%",marginTop:4,borderRadius:8}}/>}
      </div>
      {done && (
        <>
          <div style={{marginTop:12}}>
            <label style={labelStyle}>State</label>
            <select style={inputStyle} value={state} onChange={e=>setState(e.target.value)}>
              <option value="">Select state…</option>
              {STATES_NG.map(s=><option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div style={{marginTop:10}}>
            <label style={labelStyle}>LGA</label>
            <input style={inputStyle} placeholder="e.g. Ikeja LGA" value={lga} onChange={e=>setLga(e.target.value)}/>
          </div>
          <div style={{marginTop:10}}>
            <label style={labelStyle}>Severity</label>
            <SeverityPicker value={severity} onChange={setSeverity}/>
          </div>
          <div style={{marginTop:10}}>
            <label style={labelStyle}>Additional notes (optional)</label>
            <textarea style={{...inputStyle,minHeight:70,resize:"none"}} placeholder="What happened?" value={desc} onChange={e=>setDesc(e.target.value)}/>
          </div>
          <button onClick={submit} disabled={submitting||!state} style={{...submitBtnStyle,opacity:state?1:0.5}}>
            {submitting ? "Submitting…" : "Submit Audio Report"}
          </button>
        </>
      )}
      <style>{`
        @keyframes wave0{from{height:8px}to{height:28px}}
        @keyframes wave1{from{height:16px}to{height:6px}}
        @keyframes wave2{from{height:12px}to{height:24px}}
      `}</style>
    </Modal>
  );
}

// ── IMAGE MODAL — real camera capture ─────────────────────────
function ImageModal({ user, onClose, onSubmit }) {
  const [state, setState] = useState("");
  const [lga, setLga] = useState("");
  const [desc, setDesc] = useState("");
  const [severity, setSeverity] = useState("moderate");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [preview, setPreview] = useState(null);
  const [fileObj, setFileObj] = useState(null);
  const [coords, setCoords] = useState(null);
  const fileRef = useRef(null);
  const galleryRef = useRef(null);
  const refId = useRef("INC-" + Date.now().toString().slice(-6));

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      p => setCoords({ lat: p.coords.latitude.toFixed(5), lng: p.coords.longitude.toFixed(5) }),
      () => setCoords({ lat: "6.52438", lng: "3.37921" })
    );
  }, []);

  const onFile = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileObj(file);
    const reader = new FileReader();
    reader.onload = ev => setPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const openCamera = () => fileRef.current?.click();

  const submit = async () => {
    setSubmitting(true);
    // Upload image to Drive if we have a file, get back a shareable URL
    let mediaUrl = "";
    if (fileObj) {
      mediaUrl = await uploadMediaToDrive(fileObj, fileObj.type || "image/jpeg", `${refId.current}.jpg`);
    }
    await onSubmit({ reporter:user?.name||"Observer", reportType:"IMAGE", state, lga, severity,
      description: desc || "Image evidence captured",
      lat: coords?.lat || "", lng: coords?.lng || "", mediaRef: mediaUrl || refId.current });
    setSubmitting(false);
    setSuccess(true);
  };

  if (success) return <Modal title="Image Report" onClose={onClose}><SuccessView label="Image report" refId={refId.current}/></Modal>;

  return (
    <Modal title="Image Report" onClose={onClose}>
      {/* Hidden file input — opens camera on mobile */}
      <input ref={fileRef} type="file" accept="image/*" capture="environment"
        style={{display:"none"}} onChange={onFile}/>
      {/* Hidden file input — gallery / file picker (no capture) */}
      <input ref={galleryRef} type="file" accept="image/*"
        style={{display:"none"}} onChange={onFile}/>

      <div style={{background:"#F4F6F8",border:`2px dashed ${preview?C.green:C.border}`,
        borderRadius:16,overflow:"hidden",marginBottom:12,minHeight:180,
        display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",
        gap:12,cursor:"pointer",position:"relative"}} onClick={openCamera}>
        {preview
          ? <img src={preview} alt="captured" style={{width:"100%",maxHeight:260,objectFit:"cover",display:"block"}}/>
          : <>
              <div style={{fontSize:52}}>📷</div>
              <p style={{fontSize:14,color:C.greyDark,textAlign:"center",margin:"0 20px"}}>
                Tap to open <strong style={{color:C.green}}>camera</strong><br/>
                <span style={{fontSize:12}}>GPS + timestamp auto-attached</span>
              </p>
            </>
        }
        {preview && (
          <div style={{position:"absolute",bottom:8,right:8,background:"rgba(0,0,0,0.55)",
            color:"#fff",fontSize:11,padding:"4px 10px",borderRadius:20,fontWeight:600}}>
            Tap to retake
          </div>
        )}
      </div>

      <div style={{display:"flex",gap:8,marginTop:0}}>
        <button onClick={openCamera} style={{...submitBtnStyle,flex:1,
          background:preview?"#F9FAFB":"linear-gradient(135deg,#3B82F6,#2563EB)",
          color:preview?C.text:"#fff",border:preview?`1.5px solid ${C.border}`:"none",fontSize:14}}>
          {preview ? "📷 Retake" : "📷 Camera"}
        </button>
        <button onClick={()=>galleryRef.current?.click()} style={{...submitBtnStyle,flex:1,
          background:"#F9FAFB",color:C.text,border:`1.5px solid ${C.border}`,fontSize:14}}>
          🖼 Pick File
        </button>
      </div>

      {preview && (
        <>
          <GPSBadge coords={coords}/>
          <div style={{marginTop:12}}>
            <label style={labelStyle}>State</label>
            <select style={inputStyle} value={state} onChange={e=>setState(e.target.value)}>
              <option value="">Select state…</option>
              {STATES_NG.map(s=><option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div style={{marginTop:10}}>
            <label style={labelStyle}>LGA</label>
            <input style={inputStyle} placeholder="e.g. Ikeja LGA" value={lga} onChange={e=>setLga(e.target.value)}/>
          </div>
          <div style={{marginTop:10}}>
            <label style={labelStyle}>Severity</label>
            <SeverityPicker value={severity} onChange={setSeverity}/>
          </div>
          <div style={{marginTop:10}}>
            <label style={labelStyle}>Description</label>
            <textarea style={{...inputStyle,minHeight:70,resize:"none"}} placeholder="Describe what was captured…" value={desc} onChange={e=>setDesc(e.target.value)}/>
          </div>
          <button onClick={submit} disabled={submitting||!state} style={{...submitBtnStyle,opacity:state?1:0.5}}>
            {submitting ? "Submitting…" : "Submit Image Report"}
          </button>
        </>
      )}
    </Modal>
  );
}

// ── VIDEO MODAL — file picker (camera on mobile) ──────────────
function VideoModal({ user, onClose, onSubmit }) {
  const [recording, setRecording] = useState(false);
  const [done, setDone] = useState(false);
  const [secs, setSecs] = useState(0);
  const [videoURL, setVideoURL] = useState(null);
  const [videoBlob, setVideoBlob] = useState(null);
  const [state, setState] = useState("");
  const [lga, setLga] = useState("");
  const [desc, setDesc] = useState("");
  const [severity, setSeverity] = useState("moderate");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [videoSizeWarn, setVideoSizeWarn] = useState("");
  const [useCamera, setUseCamera] = useState(false);
  const timerRef = useRef(null);
  const mrRef = useRef(null);
  const chunksRef = useRef([]);
  const videoRef = useRef(null);
  const fileRef = useRef(null);
  const refId = useRef("INC-" + Date.now().toString().slice(-6));
  const fmt = s => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  const startLiveRec = async () => {
    setErrMsg("");
    try {
      // Constrain to 720p max — reduces file size significantly vs 1080p/4K
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280, max: 1280 }, height: { ideal: 720, max: 720 }, frameRate: { ideal: 24, max: 30 } },
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play(); }
      chunksRef.current = [];

      // Pick best supported codec, with low bitrate (1Mbps video + 64kbps audio ≈ ~7MB/min)
      const mimeOptions = [
        "video/webm;codecs=vp9",
        "video/webm;codecs=vp8",
        "video/webm",
        "video/mp4",
      ];
      const mime = mimeOptions.find(m => MediaRecorder.isTypeSupported(m)) || "";
      const mr = new MediaRecorder(stream, {
        ...(mime ? { mimeType: mime } : {}),
        videoBitsPerSecond: 1_000_000,   // 1 Mbps
        audioBitsPerSecond:    64_000,   // 64 kbps
      });
      mrRef.current = mr;
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mime || "video/webm" });
        setVideoBlob(blob);
        setVideoURL(URL.createObjectURL(blob));
        stream.getTracks().forEach(t => t.stop());
        if (videoRef.current) videoRef.current.srcObject = null;
      };
      mr.start();
      setRecording(true);
      timerRef.current = setInterval(() => setSecs(s => s + 1), 1000);
    } catch (e) {
      setErrMsg("Camera/mic access denied. Use the file picker option below instead.");
    }
  };

  const stopLiveRec = () => {
    clearInterval(timerRef.current);
    mrRef.current?.stop();
    setRecording(false);
    setDone(true);
  };

  const onFileVideo = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Warn if picked file exceeds 50MB — browser can't re-encode video, record live instead
    const WARN_BYTES = 50 * 1024 * 1024;
    if (file.size > WARN_BYTES) {
      setVideoSizeWarn(`This video is ${(file.size / (1024*1024)).toFixed(1)} MB — it may be too large to upload. For best results, use live recording (≤ ~7 MB/min).`);
    } else {
      setVideoSizeWarn("");
    }
    setVideoBlob(file);
    setVideoURL(URL.createObjectURL(file));
    setSecs(0);
    setDone(true);
  };

  const submit = async () => {
    setSubmitting(true);
    // Upload video to Drive if we have a blob, get back a shareable URL
    let mediaUrl = "";
    if (videoBlob) {
      mediaUrl = await uploadMediaToDrive(videoBlob, videoBlob.type || "video/webm", `${refId.current}.webm`);
    }
    await onSubmit({ reporter:user?.name||"Observer", reportType:"VIDEO", state, lga, severity,
      description: desc || `Video evidence · ${fmt(secs)}`, lat:"", lng:"", mediaRef: mediaUrl || refId.current });
    setSubmitting(false);
    setSuccess(true);
  };

  if (success) return <Modal title="Video Report" onClose={onClose}><SuccessView label="Video report" refId={refId.current}/></Modal>;

  return (
    <Modal title="Video Report" onClose={onClose}>
      {errMsg && <div style={{background:"#FEF2F2",border:"1px solid #FECACA",borderRadius:10,padding:"10px 14px",fontSize:13,color:"#EF4444",marginBottom:12}}>{errMsg}</div>}
      {videoSizeWarn && <div style={{background:"#FFFBEB",border:"1px solid #FCD34D",borderRadius:10,padding:"10px 14px",fontSize:13,color:"#92400E",marginBottom:12}}>⚠️ {videoSizeWarn}</div>}
      {/* Hidden file input */}
      <input ref={fileRef} type="file" accept="video/*" capture="environment"
        style={{display:"none"}} onChange={onFileVideo}/>

      {/* Live camera preview while recording */}
      <div style={{background:"#111",borderRadius:16,overflow:"hidden",marginBottom:12,position:"relative",minHeight:180,display:"flex",alignItems:"center",justifyContent:"center"}}>
        {recording
          ? <video ref={videoRef} muted style={{width:"100%",maxHeight:240,display:"block",objectFit:"cover"}}/>
          : videoURL
            ? <video src={videoURL} controls style={{width:"100%",maxHeight:240,display:"block"}}/>
            : (
              <div style={{textAlign:"center",padding:20}}>
                <div style={{fontSize:48,marginBottom:8}}>🎥</div>
                <div style={{color:"#888",fontSize:13}}>Choose how to record</div>
              </div>
            )
        }
        {recording && (
          <div style={{position:"absolute",top:10,right:10,display:"flex",alignItems:"center",gap:6,
            background:"rgba(0,0,0,0.7)",borderRadius:20,padding:"4px 10px"}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:"#EF4444",animation:"livepulse 1s ease infinite"}}/>
            <span style={{color:"#fff",fontSize:12,fontFamily:"monospace",fontWeight:700}}>{fmt(secs)}</span>
          </div>
        )}
      </div>

      {!done && !recording && (
        <div style={{display:"flex",gap:10,marginBottom:12}}>
          <button onClick={startLiveRec} style={{...submitBtnStyle,marginTop:0,flex:1,fontSize:13}}>
            🎥 Record Live
          </button>
          <button onClick={()=>fileRef.current?.click()} style={{...submitBtnStyle,marginTop:0,flex:1,
            background:"linear-gradient(135deg,#6366F1,#4F46E5)",fontSize:13}}>
            📁 Pick Video
          </button>
        </div>
      )}
      {recording && (
        <button onClick={stopLiveRec} style={{...submitBtnStyle,marginTop:0,
          background:"linear-gradient(135deg,#EF4444,#DC2626)"}}>
          ⏹ Stop Recording
        </button>
      )}

      {done && (
        <>
          <div style={{display:"flex",gap:8,marginBottom:4}}>
            <button onClick={()=>{setDone(false);setVideoURL(null);setVideoBlob(null);setSecs(0);setVideoSizeWarn("");chunksRef.current=[];}}
              style={{...submitBtnStyle,marginTop:0,flex:1,fontSize:12,
                background:"#F9FAFB",color:C.text,border:`1.5px solid ${C.border}`,boxShadow:"none"}}>
              🔄 Re-record
            </button>
            <button onClick={()=>fileRef.current?.click()}
              style={{...submitBtnStyle,marginTop:0,flex:1,fontSize:12,
                background:"#F9FAFB",color:C.text,border:`1.5px solid ${C.border}`,boxShadow:"none"}}>
              📁 Pick Different
            </button>
          </div>
          <div style={{marginTop:4}}>
            <label style={labelStyle}>State</label>
            <select style={inputStyle} value={state} onChange={e=>setState(e.target.value)}>
              <option value="">Select state…</option>
              {STATES_NG.map(s=><option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div style={{marginTop:10}}>
            <label style={labelStyle}>LGA</label>
            <input style={inputStyle} placeholder="e.g. Ikeja LGA" value={lga} onChange={e=>setLga(e.target.value)}/>
          </div>
          <div style={{marginTop:10}}>
            <label style={labelStyle}>Severity</label>
            <SeverityPicker value={severity} onChange={setSeverity}/>
          </div>
          <div style={{marginTop:10}}>
            <label style={labelStyle}>Description</label>
            <textarea style={{...inputStyle,minHeight:70,resize:"none"}} placeholder="Describe what was recorded…" value={desc} onChange={e=>setDesc(e.target.value)}/>
          </div>
          <button onClick={submit} disabled={submitting||!state} style={{...submitBtnStyle,opacity:state?1:0.5}}>
            {submitting ? "Submitting…" : "Submit Video Report"}
          </button>
        </>
      )}
      <style>{`@keyframes livepulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
    </Modal>
  );
}

// ── LOCATION MODAL — real GPS + OSM map ──────────────────────
function LocationModal({ user, onClose, onSubmit }) {
  const [state, setState] = useState("");
  const [lga, setLga] = useState("");
  const [desc, setDesc] = useState("");
  const [severity, setSeverity] = useState("moderate");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [coords, setCoords] = useState(null);
  const [locErr, setLocErr] = useState("");
  const [loading, setLoading] = useState(false);
  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const markerRef = useRef(null);
  const refId = "INC-" + Date.now().toString().slice(-6);

  const getLocation = () => {
    setLoading(true);
    setLocErr("");
    if (!navigator.geolocation) {
      setLocErr("Geolocation not supported by this browser.");
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        const lat = parseFloat(pos.coords.latitude.toFixed(5));
        const lng = parseFloat(pos.coords.longitude.toFixed(5));
        setCoords({ lat, lng });
        setLoading(false);
      },
      () => {
        // Fall back to Abuja - Mabushi, Kingsfen Plaza coordinates for demo
        setCoords({ lat: 9.06785, lng: 7.42053 });
        setLoading(false);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Init Leaflet map when coords arrive
  useEffect(() => {
    if (!coords || !mapRef.current) return;
    if (leafletMap.current) {
      leafletMap.current.setView([coords.lat, coords.lng], 15);
      if (markerRef.current) markerRef.current.setLatLng([coords.lat, coords.lng]);
      return;
    }
    // Dynamically load Leaflet CSS + JS
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
      document.head.appendChild(link);
    }
    const initMap = () => {
      if (!window.L || !mapRef.current || leafletMap.current) return;
      const map = window.L.map(mapRef.current, { zoomControl: true, attributionControl: false });
      window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors", maxZoom: 19
      }).addTo(map);
      map.setView([coords.lat, coords.lng], 15);
      const greenIcon = window.L.divIcon({
        className: "",
        html: `<div style="width:36px;height:36px;border-radius:50%;background:${C.green};border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;font-size:18px">📍</div>`,
        iconSize: [36, 36], iconAnchor: [18, 18]
      });
      const m = window.L.marker([coords.lat, coords.lng], { icon: greenIcon }).addTo(map);
      m.bindPopup(`<b>Your Location</b><br/>${coords.lat}° N, ${coords.lng}° E`).openPopup();
      leafletMap.current = map;
      markerRef.current = m;
    };
    if (window.L) { initMap(); return; }
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
    script.onload = initMap;
    document.head.appendChild(script);
  }, [coords]);

  const submit = async () => {
    setSubmitting(true);
    await onSubmit({ reporter:user?.name||"Observer", reportType:"LOCATION", state, lga, severity,
      description: desc || "Location shared", lat: coords?.lat || "", lng: coords?.lng || "", mediaRef: refId });
    setSubmitting(false);
    setSuccess(true);
  };

  if (success) return <Modal title="Share Location" onClose={onClose}><SuccessView label="Location" refId={refId}/></Modal>;

  return (
    <Modal title="Share Location" onClose={onClose}>
      {!coords
        ? (
          <div style={{textAlign:"center",padding:"24px 0"}}>
            <div style={{fontSize:52,marginBottom:12}}>📍</div>
            <p style={{fontSize:14,color:C.greyDark,marginBottom:8}}>
              Share your precise GPS location with the monitoring centre.
            </p>
            {locErr && <p style={{fontSize:13,color:"#EF4444",marginBottom:12}}>{locErr}</p>}
            <button onClick={getLocation} disabled={loading} style={submitBtnStyle}>
              {loading ? "Getting location…" : "📍 Share My Location"}
            </button>
          </div>
        )
        : (
          <>
            <div style={{background:"#E8F8ED",borderRadius:12,padding:"12px 14px",marginBottom:12,display:"flex",gap:10,alignItems:"center"}}>
              <span style={{fontSize:20}}>📍</span>
              <div>
                <div style={{fontSize:12,fontWeight:600,color:C.green}}>Location captured</div>
                <div style={{fontSize:11,color:C.greyDark,fontFamily:"monospace"}}>{coords.lat}° N, {coords.lng}° E</div>
              </div>
            </div>
            {/* Live OSM map */}
            <div ref={mapRef} style={{height:200,borderRadius:12,overflow:"hidden",marginBottom:12,
              border:`1px solid ${C.border}`}}/>
            <div style={{marginTop:4}}>
              <label style={labelStyle}>State</label>
              <select style={inputStyle} value={state} onChange={e=>setState(e.target.value)}>
                <option value="">Select state…</option>
                {STATES_NG.map(s=><option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div style={{marginTop:10}}>
              <label style={labelStyle}>LGA</label>
              <input style={inputStyle} placeholder="e.g. Ikeja LGA" value={lga} onChange={e=>setLga(e.target.value)}/>
            </div>
            <div style={{marginTop:10}}>
              <label style={labelStyle}>Severity</label>
              <SeverityPicker value={severity} onChange={setSeverity}/>
            </div>
            <div style={{marginTop:10}}>
              <label style={labelStyle}>Notes (optional)</label>
              <textarea style={{...inputStyle,minHeight:60,resize:"none"}} placeholder="Any notes about this location?" value={desc} onChange={e=>setDesc(e.target.value)}/>
            </div>
            <button onClick={submit} disabled={submitting||!state} style={{...submitBtnStyle,opacity:state?1:0.5}}>
              {submitting ? "Submitting…" : "Submit Location Report"}
            </button>
          </>
        )
      }
    </Modal>
  );
}

// ── SOS MODAL ─────────────────────────────────────────────────
function SOSModal({ user, onClose, onSubmit }) {
  const [phase, setPhase] = useState("confirm"); // confirm → sending → sent
  const [coords, setCoords] = useState(null);
  const refId = "SOS-" + Date.now().toString().slice(-6);

  const triggerSOS = async () => {
    setPhase("sending");
    navigator.geolocation?.getCurrentPosition(
      p => setCoords({ lat: p.coords.latitude.toFixed(5), lng: p.coords.longitude.toFixed(5) }),
      () => setCoords({ lat: "6.52438", lng: "3.37921" })
    );
    await new Promise(r => setTimeout(r, 1800));
    await onSubmit({
      reporter: user?.name || "Observer", reportType:"SOS", state:"", lga:"",
      severity:"critical", description:"EMERGENCY SOS — location broadcast",
      lat: coords?.lat || "", lng: coords?.lng || "", mediaRef: refId,
    });
    setPhase("sent");
  };

  return (
    <Modal title="🚨 SOS Alert" onClose={onClose}>
      <div style={{textAlign:"center",padding:"24px 0"}}>
        {phase === "confirm" && (
          <>
            <div style={{fontSize:64,marginBottom:12}}>🚨</div>
            <div style={{fontSize:16,fontWeight:700,color:"#EF4444",marginBottom:8}}>Send Emergency Alert?</div>
            <div style={{fontSize:13,color:C.greyDark,marginBottom:24,lineHeight:1.6}}>
              This will immediately broadcast your location<br/>to the monitoring centre and field team.
            </div>
            <button onClick={triggerSOS} style={{...submitBtnStyle,background:"linear-gradient(135deg,#EF4444,#DC2626)",marginTop:0}}>
              🚨 Send SOS Now
            </button>
            <button onClick={onClose} style={{...submitBtnStyle,background:"transparent",color:C.greyDark,
              boxShadow:"none",border:`1.5px solid ${C.border}`}}>
              Cancel
            </button>
          </>
        )}
        {phase === "sending" && (
          <>
            <div style={{fontSize:52,animation:"pulse 0.8s ease infinite"}}>🚨</div>
            <div style={{fontSize:16,fontWeight:700,color:"#EF4444",marginTop:12}}>Broadcasting your location…</div>
            <div style={{fontSize:13,color:C.greyDark,marginTop:6}}>Emergency alert being sent to all contacts</div>
          </>
        )}
        {phase === "sent" && (
          <>
            <div style={{fontSize:52}}>✅</div>
            <div style={{fontSize:16,fontWeight:700,color:C.green,marginTop:12}}>SOS Sent Successfully</div>
            <div style={{fontSize:13,color:C.greyDark,marginTop:6}}>Help is on the way</div>
            <div style={{fontSize:12,color:C.greyDark,fontFamily:"monospace",marginTop:4}}>Ref: <span style={{color:C.green}}>{refId}</span></div>
            <div style={{background:"#E8F8ED",borderRadius:12,padding:"12px 16px",marginTop:16,fontSize:12,color:C.greyDark,lineHeight:2,textAlign:"left"}}>
              <div>🚨 Alert type — SOS Emergency</div>
              <div>📍 Location — broadcast to dashboard</div>
              <div>🕐 {new Date().toLocaleTimeString()}</div>
              <div>📡 Monitoring centre notified</div>
            </div>
            <button onClick={onClose} style={{...submitBtnStyle,marginTop:16}}>Close</button>
          </>
        )}
      </div>
      <style>{`@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.15)}}`}</style>
    </Modal>
  );
}

// ── TRACK LOCATION MAP (Leaflet OSM, home screen) ─────────────
function TrackLocationMap({ expanded, onCollapse }) {
  const mapRef    = useRef(null);
  const fsMapRef  = useRef(null);      // fullscreen map container
  const leafletMap   = useRef(null);   // inline map instance
  const leafletMapFS = useRef(null);   // fullscreen map instance
  const coordsRef = useRef({ lat: 6.52438, lng: 3.37921 });

  const buildMarker = (L, lat, lng) => {
    const icon = L.divIcon({
      className: "",
      html: `<div style="display:flex;flex-direction:column;align-items:center">
        <div style="width:38px;height:38px;border-radius:50%;border:3px solid ${C.green};background:#e8f8ed;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 2px 6px rgba(0,0,0,0.3)">👤</div>
        <div style="background:${C.green};color:#fff;font-size:10px;font-weight:700;padding:2px 8px;border-radius:8px;margin-top:2px;white-space:nowrap">You</div>
      </div>`,
      iconSize: [44, 56], iconAnchor: [22, 56],
    });
    return icon;
  };

  const initLeaflet = (container, lat, lng, interactive) => {
    if (!window.L || !container) return null;
    const map = window.L.map(container, {
      zoomControl: true, attributionControl: false,
      dragging: true, scrollWheelZoom: true, doubleClickZoom: true,
      touchZoom: true,
    });
    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      { maxZoom: 19 }).addTo(map);
    map.setView([lat, lng], 15);
    window.L.marker([lat, lng], { icon: buildMarker(window.L, lat, lng) })
      .addTo(map).bindPopup("Your current location");
    return map;
  };

  // Load Leaflet once, then init inline map
  useEffect(() => {
    const load = (lat, lng) => {
      coordsRef.current = { lat, lng };
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css"; link.rel = "stylesheet";
        link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
        document.head.appendChild(link);
      }
      const doInit = () => {
        leafletMap.current = initLeaflet(mapRef.current, lat, lng, false);
      };
      if (window.L) { doInit(); return; }
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
      s.onload = doInit;
      document.head.appendChild(s);
    };
    navigator.geolocation?.getCurrentPosition(
      p => load(p.coords.latitude, p.coords.longitude),
      () => load(6.52438, 3.37921)
    );
    return () => {
      leafletMap.current?.remove(); leafletMap.current = null;
    };
  }, []);

  // When expanded opens, init a fresh fullscreen map instance
  useEffect(() => {
    if (expanded) {
      // Small delay so the DOM node is mounted
      const t = setTimeout(() => {
        const { lat, lng } = coordsRef.current;
        leafletMapFS.current = initLeaflet(fsMapRef.current, lat, lng, true);
      }, 80);
      return () => clearTimeout(t);
    } else {
      leafletMapFS.current?.remove();
      leafletMapFS.current = null;
    }
  }, [expanded]);

  return (
    <>
      {/* ── Inline (collapsed) map ── */}
      <div style={{position:"relative",zIndex:0,borderRadius:14,overflow:"hidden",
        border:`1px solid ${C.border}`,height:"100%",minHeight:120}}>
        <div ref={mapRef} style={{width:"100%",height:"100%"}}/>
      </div>

      {/* ── Fullscreen overlay (expanded) ── */}
      {expanded && (
        <div style={{position:"fixed",inset:0,zIndex:500,background:"#000"}}>
          <div ref={fsMapRef} style={{width:"100%",height:"100%"}}/>
          {/* Close button */}
          <button onClick={onCollapse}
            style={{position:"absolute",top:16,right:16,zIndex:501,
              background:"rgba(0,0,0,0.65)",backdropFilter:"blur(4px)",
              border:"none",borderRadius:12,padding:"10px 16px",
              color:"#fff",fontSize:14,fontWeight:700,cursor:"pointer",
              display:"flex",alignItems:"center",gap:6}}>
            ✕ Collapse
          </button>
          <div style={{position:"absolute",bottom:16,left:"50%",transform:"translateX(-50%)",
            background:"rgba(0,0,0,0.55)",backdropFilter:"blur(4px)",borderRadius:20,
            padding:"6px 16px",fontSize:11,color:"rgba(255,255,255,0.8)",zIndex:501,
            whiteSpace:"nowrap"}}>
            Live map · OpenStreetMap
          </div>
        </div>
      )}
    </>
  );
}

// ── REPORT CARD ───────────────────────────────────────────────
function ReportCard({ icon, label, onClick }) {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      onClick={onClick}
      onPointerDown={()=>setPressed(true)}
      onPointerUp={()=>setPressed(false)}
      onPointerLeave={()=>setPressed(false)}
      style={{background:C.white,border:`1.5px solid ${pressed?C.green:C.border}`,
        borderRadius:14,padding:"16px 10px 12px",display:"flex",flexDirection:"column",
        alignItems:"center",gap:8,cursor:"pointer",touchAction:"manipulation",
        WebkitTapHighlightColor:"transparent",
        transform:pressed?"scale(0.97)":"scale(1)",transition:"transform 0.1s,border-color 0.1s",
        boxShadow:pressed?`0 0 0 3px rgba(60,176,67,0.15)`:"0 1px 4px rgba(0,0,0,0.06)"}}>
      {icon}
      <span style={{fontSize:12,fontWeight:500,color:C.text,textAlign:"center"}}>{label}</span>
    </button>
  );
}

// ── HOME PAGE ─────────────────────────────────────────────────
function HomePage({ user, onModal }) {
  const [mapExpanded, setMapExpanded] = useState(false);
  return (
    // Full viewport column — no overflow, everything must fit
    <div style={{
      display:"flex", flexDirection:"column",
      height:"calc(100dvh - 56px)",   // 56px = bottom nav
      overflow:"hidden",
      background:C.bg,
    }}>
      {/* ── Header ── */}
      <div style={{flexShrink:0, padding:"14px 16px 10px",
        display:"flex",alignItems:"center",justifyContent:"space-between",
        borderBottom:`1px solid ${C.border}`}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:40,height:40,borderRadius:10,
            background:`linear-gradient(135deg,${C.green},${C.greenDark})`,
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:11,color:"#fff",fontWeight:800,flexShrink:0,letterSpacing:0.5,
            fontFamily:"monospace"}}>
            ID
          </div>
          <div>
            <div style={{fontSize:10,color:C.greyDark,lineHeight:1,textTransform:"uppercase",letterSpacing:0.8}}>Field Observer</div>
            <div style={{fontSize:15,fontWeight:800,color:C.text,lineHeight:1.2,fontFamily:"monospace",letterSpacing:0.5}}>
              {user?.observerId || ("OBS-" + (user?.name||"OBS").slice(0,3).toUpperCase() + "-" + (user?.phone||"0000").slice(-4))}
            </div>
          </div>
        </div>
        <div style={{textAlign:"right",lineHeight:1}}>
          <div style={{fontSize:24,fontWeight:900,color:C.green,letterSpacing:-1}}>EMS</div>
          <div style={{fontSize:10,color:C.greyDark,fontWeight:600,marginTop:-2}}>ELECTION MONITORING</div>
        </div>
      </div>

      {/* ── 2×2 Report Grid ── */}
      <div style={{flexShrink:0, padding:"10px 16px",
        display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <ReportCard icon={<MicIcon/>}         label="Audio Report"   onClick={()=>onModal("audio")}/>
        <ReportCard icon={<ImageIcon/>}       label="Image Report"   onClick={()=>onModal("image")}/>
        <ReportCard icon={<VideoIcon/>}       label="Video Report"   onClick={()=>onModal("video")}/>
        <ReportCard icon={<LocationPinIcon/>} label="Share Location" onClick={()=>onModal("location")}/>
      </div>

      {/* ── Live Stats Strip ── */}
      <div style={{flexShrink:0, margin:"0 16px",
        background:"#111827",borderRadius:12,padding:"10px 14px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:7}}>
          <span style={{fontSize:11,fontWeight:700,color:"#F9FAFB"}}>Field Activity — Today</span>
          <div style={{display:"flex",alignItems:"center",gap:5}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:"#EF4444",
              animation:"livePulseHome 1.4s ease infinite"}}/>
            <span style={{fontSize:10,color:"#EF4444",fontWeight:700}}>LIVE</span>
          </div>
        </div>
        <div style={{display:"flex"}}>
          {[
            {label:"Reports",  value:"247", color:"#5EE05E"},
            {label:"Observers",value:"183", color:"#60A5FA"},
            {label:"SOS",      value:"9",   color:"#EF4444"},
            {label:"States",   value:"31",  color:"#F59E0B"},
          ].map((s,i)=>(
            <div key={i} style={{flex:1,textAlign:"center",
              borderLeft:i>0?`1px solid #374151`:undefined,padding:"2px 0"}}>
              <div style={{fontSize:20,fontWeight:900,color:s.color,letterSpacing:-0.5}}>{s.value}</div>
              <div style={{fontSize:9,color:"#9CA3AF",marginTop:1,fontWeight:500}}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes livePulseHome{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(1.4)}}`}</style>

      {/* ── Track Location — fills remaining space ── */}
      <div style={{flex:1,minHeight:0,margin:"10px 16px 10px",display:"flex",flexDirection:"column"}}>
        <div style={{flexShrink:0,display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
          <span style={{fontSize:13,fontWeight:700,color:C.text}}>Track Location</span>
          <button onClick={()=>setMapExpanded(true)}
            style={{background:"none",border:"none",display:"flex",alignItems:"center",gap:4,
              color:C.green,fontSize:12,fontWeight:600,cursor:"pointer",padding:0}}>
            <ExpandIcon/> Expand
          </button>
        </div>
        {/* Map fills all remaining flex space */}
        <div style={{flex:1,minHeight:0,position:"relative",zIndex:0}}>
          <TrackLocationMap expanded={mapExpanded} onCollapse={()=>setMapExpanded(false)}/>
        </div>
        <p style={{flexShrink:0,fontSize:10,color:C.grey,marginTop:4,textAlign:"center"}}>
          Live map · OpenStreetMap
        </p>
      </div>
    </div>
  );
}

// ── CONTACTS PAGE ─────────────────────────────────────────────
function ContactsPage() {
  const [baseContact, setBaseContact] = useState({ name:"", phone:"" });
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ name:"", phone:"" });

  // EMS team contacts
  const teamContacts = [
    {name:"NEMA",              role:"National Emergency Mgmt Agency · 112", initials:"NE", tel:"tel:112"},
    {name:"EMS Field Team",   role:"Election Monitoring & Safety", initials:"EF", tel:"tel:+2348000000003"},
    {name:"Control Room",     role:"24/7 Emergency Line",           initials:"CR", tel:"tel:+2348000000004"},
  ];

  const openEdit = () => { setDraft(baseContact); setEditing(true); };
  const saveEdit = () => { setBaseContact(draft); setEditing(false); };

  return (
    <div style={{padding:"20px 16px",paddingBottom:80}}>
      <div style={{fontSize:18,fontWeight:700,color:C.text,marginBottom:4}}>Contacts</div>
      <div style={{fontSize:13,color:C.greyDark,marginBottom:20}}>Your base contact & INEC team directory</div>

      {/* ── Personal Base Contact ── */}
      <div style={{marginBottom:18}}>
        <div style={{fontSize:11,fontWeight:700,color:C.green,textTransform:"uppercase",
          letterSpacing:1,marginBottom:8}}>Your Base Contact</div>
        <div style={{background:"#F0FDF4",border:`1.5px solid ${C.green}`,borderRadius:14,
          padding:"14px 16px",boxShadow:"0 1px 6px rgba(60,176,67,0.12)"}}>
          {!editing ? (
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:44,height:44,borderRadius:"50%",
                background:`linear-gradient(135deg,${C.green},${C.greenDark})`,
                display:"flex",alignItems:"center",justifyContent:"center",
                color:"#fff",fontWeight:700,fontSize:15,flexShrink:0}}>
                {baseContact.name ? baseContact.name[0].toUpperCase() : "?"}
              </div>
              <div style={{flex:1}}>
                {baseContact.name
                  ? <>
                      <div style={{fontSize:14,fontWeight:700,color:C.text}}>{baseContact.name}</div>
                      <div style={{fontSize:12,color:C.green,fontWeight:600,marginTop:2}}>
                        🔒 Receives your SOS location
                      </div>
                    </>
                  : <div style={{fontSize:13,color:C.greyDark,lineHeight:1.5}}>
                      Add a trusted person — they'll receive your SOS alerts and report confirmations.
                    </div>
                }
              </div>
              <div style={{display:"flex",gap:8,flexShrink:0}}>
                {baseContact.phone &&
                  <a href={`tel:${baseContact.phone}`}
                    style={{background:"#E8F8ED",borderRadius:10,padding:"8px 10px",
                      display:"flex",alignItems:"center",justifyContent:"center",textDecoration:"none"}}>
                    <PhoneIcon color={C.green}/>
                  </a>
                }
                <button onClick={openEdit}
                  style={{background:C.green,color:"#fff",border:"none",borderRadius:10,
                    padding:"8px 12px",fontSize:12,fontWeight:700,cursor:"pointer"}}>
                  {baseContact.name ? "Edit" : "+ Add"}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:12}}>
                Set Your Base Contact
              </div>
              <div style={{marginBottom:10}}>
                <label style={labelStyle}>Full Name</label>
                <input style={inputStyle} placeholder="e.g. Aisha Mohammed"
                  value={draft.name} onChange={e=>setDraft(d=>({...d,name:e.target.value}))}/>
              </div>
              <div style={{marginBottom:14}}>
                <label style={labelStyle}>Phone Number</label>
                <input style={inputStyle} type="tel" placeholder="e.g. 08012345678"
                  value={draft.phone} onChange={e=>setDraft(d=>({...d,phone:e.target.value}))}/>
              </div>
              <div style={{background:"#FFF9C4",borderRadius:8,padding:"8px 12px",fontSize:12,
                color:"#92400E",marginBottom:14,lineHeight:1.5}}>
                ⚡ This person will be alerted when you send an SOS. Make it someone who can act fast.
              </div>
              <div style={{display:"flex",gap:10}}>
                <button onClick={()=>setEditing(false)}
                  style={{flex:1,padding:"10px",borderRadius:10,border:`1px solid ${C.border}`,
                    background:C.white,color:C.greyDark,fontSize:13,fontWeight:600,cursor:"pointer"}}>
                  Cancel
                </button>
                <button onClick={saveEdit} disabled={!draft.name.trim()}
                  style={{flex:2,padding:"10px",borderRadius:10,border:"none",
                    background:C.green,color:"#fff",fontSize:13,fontWeight:700,
                    cursor:draft.name.trim()?"pointer":"default",
                    opacity:draft.name.trim()?1:0.5}}>
                  Save Contact
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── EMS Team ── */}
      <div style={{fontSize:11,fontWeight:700,color:C.greyDark,textTransform:"uppercase",
        letterSpacing:1,marginBottom:8}}>INEC Team</div>
      {teamContacts.map((c,i)=>(
        <div key={i} style={{display:"flex",alignItems:"center",gap:14,background:C.white,
          border:`1px solid ${C.border}`,borderRadius:14,padding:"14px 16px",marginBottom:10,
          boxShadow:"0 1px 3px rgba(0,0,0,0.05)"}}>
          <div style={{width:44,height:44,borderRadius:"50%",background:C.green,display:"flex",
            alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:15,flexShrink:0}}>
            {c.initials}
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:14,fontWeight:600,color:C.text}}>{c.name}</div>
            <div style={{fontSize:12,color:C.greyDark,marginTop:2}}>{c.role}</div>
          </div>
          <a href={c.tel} style={{background:"#E8F8ED",borderRadius:10,padding:"8px 10px",
            display:"flex",alignItems:"center",justifyContent:"center",textDecoration:"none"}}>
            <PhoneIcon color={C.green}/>
          </a>
        </div>
      ))}
    </div>
  );
}

// ── HELPLINES PAGE ────────────────────────────────────────────
function HelplinePage() {
  const lines = [
    {name:"INEC Emergency Line",         number:"0800-000-0000", type:"Electoral",  color:"#3CB043", tel:"tel:08000000000"},
    {name:"Nigeria Police Force",        number:"112",           type:"Security",   color:"#EF4444", tel:"tel:112"},
    {name:"NSCDC Command Centre",        number:"0800-225-5672", type:"Security",   color:"#EF4444", tel:"tel:08002255672"},
    {name:"Civil Society Observer Hub",  number:"0700-111-2233", type:"Observer",   color:"#3B82F6", tel:"tel:07001112233"},
    {name:"Electoral Violence Hotline",  number:"0800-333-4455", type:"Emergency",  color:"#F59E0B", tel:"tel:08003334455"},
    {name:"RescueTap Emergency",         number:"0800-RESCUE-1", type:"Emergency",  color:"#F59E0B", tel:"tel:08007372831"},
  ];
  return (
    <div style={{padding:"20px 16px",paddingBottom:80}}>
      <div style={{fontSize:18,fontWeight:700,color:C.text,marginBottom:4}}>Helplines</div>
      <div style={{fontSize:13,color:C.greyDark,marginBottom:20}}>Verified emergency contacts — tap to call</div>
      {lines.map((h,i)=>(
        <a key={i} href={h.tel} style={{textDecoration:"none",display:"block",marginBottom:10}}>
          <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,padding:"14px 16px",
            display:"flex",alignItems:"center",gap:14,boxShadow:"0 1px 3px rgba(0,0,0,0.05)"}}>
            <div style={{width:44,height:44,borderRadius:12,background:`${h.color}18`,display:"flex",
              alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <PhoneIcon color={h.color}/>
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:600,color:C.text}}>{h.name}</div>
              <div style={{fontSize:13,color:C.green,fontWeight:700,marginTop:2}}>{h.number}</div>
            </div>
            <span style={{fontSize:11,background:`${h.color}15`,color:h.color,padding:"3px 8px",
              borderRadius:20,fontWeight:600,whiteSpace:"nowrap"}}>{h.type}</span>
          </div>
        </a>
      ))}
    </div>
  );
}

// ── PROFILE PAGE ──────────────────────────────────────────────
function ProfilePage({ user, onLogout }) {
  const obsId = user?.observerId || ("OBS-" + (user?.name||"OBS").slice(0,3).toUpperCase() + "-" + (user?.phone||"0000").slice(-4));
  return (
    <div style={{padding:"20px 16px",paddingBottom:80}}>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"24px 0 28px"}}>
        <div style={{width:80,height:80,borderRadius:16,
          background:`linear-gradient(135deg,${C.green},${C.greenDark})`,
          display:"flex",alignItems:"center",justifyContent:"center",
          fontSize:13,color:"#fff",fontWeight:900,marginBottom:12,
          fontFamily:"monospace",letterSpacing:1}}>
          OBS
        </div>
        <div style={{fontSize:22,fontWeight:900,color:C.text,fontFamily:"monospace",letterSpacing:1}}>{obsId}</div>
        <div style={{fontSize:12,color:C.greyDark,marginTop:4}}>{user?.role||"Field Observer"} · {user?.state||"Nigeria"}</div>
        <div style={{display:"flex",alignItems:"center",gap:6,marginTop:8}}>
          <div style={{width:8,height:8,borderRadius:"50%",background:C.green}}/>
          <span style={{fontSize:12,color:C.green,fontWeight:600}}>Active · INEC Accredited</span>
        </div>
      </div>
      <div style={{background:C.white,borderRadius:14,border:`1px solid ${C.border}`,overflow:"hidden",marginBottom:16}}>
        {[
          ["Observer ID", obsId],
          ["Full Name",   user?.name||"—"],
          ["Role",        user?.role||"Field Observer"],
          ["State",       user?.state||"Not set"],
          ["Reports Filed","0"],
        ].map(([k,v],i)=>(
          <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"14px 16px",
            borderBottom:i<4?`1px solid ${C.border}`:"none"}}>
            <span style={{fontSize:13,color:C.greyDark}}>{k}</span>
            <span style={{fontSize:13,fontWeight:600,color:k==="Observer ID"?C.green:C.text,
              fontFamily:k==="Observer ID"?"monospace":undefined}}>{v}</span>
          </div>
        ))}
      </div>
      <button onClick={onLogout} style={{...submitBtnStyle,background:"#FEF2F2",color:"#EF4444",
        boxShadow:"none",border:"1px solid #FECACA"}}>
        Log Out
      </button>
    </div>
  );
}

// ── BOTTOM NAV ────────────────────────────────────────────────
function BottomNav({ tab, onChange }) {
  const tabs = [
    { key:"home",      icon: t => <HomeIcon active={t}/>,     label:"Home"     },
    { key:"contacts",  icon: t => <ContactsIcon active={t}/>,  label:"Contacts" },
    { key:"helplines", icon: t => <PhoneIcon color={t?C.green:C.grey}/>, label:"Helplines"},
    { key:"profile",   icon: t => <ProfileIcon active={t}/>,   label:"Profile"  },
  ];
  return (
    <nav style={{position:"fixed",bottom:0,left:0,right:0,maxWidth:430,margin:"0 auto",
      background:C.white,borderTop:`1px solid ${C.border}`,display:"flex",zIndex:50,
      paddingBottom:"env(safe-area-inset-bottom,6px)"}}>
      {tabs.map(({key,icon,label})=>{
        const active = tab === key;
        return (
          <button key={key} onClick={()=>onChange(key)} style={{flex:1,padding:"10px 0 6px",
            display:"flex",flexDirection:"column",alignItems:"center",gap:3,
            background:"none",border:"none",cursor:"pointer"}}>
            {icon(active)}
            <span style={{fontSize:10,fontWeight:active?700:400,color:active?C.green:C.grey}}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}

// ── SOS FLOATING BUTTON ───────────────────────────────────────
function SOSFloatingButton({ onPress }) {
  const [pressed, setPressed] = useState(false);
  return (
    <div style={{position:"fixed",bottom:72,left:"50%",transform:"translateX(-50%)",zIndex:100}}>
      <button
        onClick={onPress}
        onPointerDown={()=>setPressed(true)}
        onPointerUp={()=>setPressed(false)}
        onPointerLeave={()=>setPressed(false)}
        style={{width:70,height:70,borderRadius:"50%",border:"none",touchAction:"manipulation",WebkitTapHighlightColor:"transparent",
          background:`radial-gradient(circle at 35% 35%, #4EE44E, ${C.green} 60%, ${C.greenDark})`,
          boxShadow:`0 0 0 5px #d0d0d0, 0 0 0 8px #b8b8b8, 0 6px 20px rgba(0,0,0,0.35)`,
          cursor:"pointer",transform:pressed?"scale(0.93)":"scale(1)",transition:"transform 0.1s",
          display:"flex",alignItems:"center",justifyContent:"center"}}>
        <WarningIcon/>
      </button>
      <div style={{fontSize:9,fontWeight:700,color:C.greyDark,textAlign:"center",marginTop:3,letterSpacing:0.5}}>SOS</div>
    </div>
  );
}

// ── API CALL ──────────────────────────────────────────────────
async function submitReport(data) {
  if (GAS_URL.includes("YOUR_GAS")) {
    await new Promise(r => setTimeout(r, 900));
    return { success: true, refId: "INC-" + Date.now().toString().slice(-6) };
  }
  const res = await fetch(GAS_URL, { method:"POST",
    headers:{"Content-Type":"text/plain;charset=utf-8"}, body:JSON.stringify(data) });
  return res.json();
}

// ── MEDIA UPLOAD TO DRIVE VIA GAS ────────────────────────────
// ── IMAGE COMPRESSION ────────────────────────────────────────
// Resizes to max 1280px and re-encodes as JPEG at 75% quality.
// Typical phone photo: 4–8MB → ~250–500KB. Returns a compressed Blob.
async function compressImage(file) {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const MAX = 1280;
      let { width, height } = img;
      if (width > MAX || height > MAX) {
        if (width > height) { height = Math.round(height * MAX / width); width = MAX; }
        else                { width  = Math.round(width  * MAX / height); height = MAX; }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width; canvas.height = height;
      canvas.getContext("2d").drawImage(img, 0, 0, width, height);
      canvas.toBlob(blob => resolve(blob || file), "image/jpeg", 0.75);
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
    img.src = url;
  });
}

// Converts a File/Blob to base64, POSTs to GAS uploadMedia action,
// which saves it to Drive (public share) and returns the URL.
// Images are compressed before upload. Videos are uploaded as-is (compressed at record time).
async function uploadMediaToDrive(fileOrBlob, mimeType, filename) {
  if (GAS_URL.includes("YOUR_GAS")) {
    return "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/320px-Cat03.jpg";
  }
  try {
    let toUpload = fileOrBlob;
    let uploadMime = mimeType;
    let uploadName = filename;

    // Compress images before upload
    if (mimeType.startsWith("image/")) {
      console.log("Compressing image, original size:", fileOrBlob.size, "bytes");
      toUpload = await compressImage(fileOrBlob);
      uploadMime = "image/jpeg";
      uploadName = filename.replace(/\.[^.]+$/, "") + ".jpg";
      console.log("Compressed size:", toUpload.size, "bytes");
    }

    // Hard limit: ~10MB after compression (base64 will be ~13MB, within GAS limits)
    const MAX_BYTES = 10 * 1024 * 1024;
    if (toUpload.size > MAX_BYTES) {
      console.warn("File still too large after compression:", toUpload.size, "bytes");
      return "";
    }

    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(toUpload);
    });

    console.log("Uploading to Drive:", uploadName, uploadMime, "base64 length:", base64.length);
    const res = await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action:"uploadMedia", base64, mimeType:uploadMime, filename:uploadName }),
    });
    const data = await res.json();
    console.log("Drive upload response:", data);
    return data.success ? data.url : "";
  } catch (e) {
    console.error("Media upload failed:", e);
    return "";
  }
}


// ── SPLASH ────────────────────────────────────────────────────
function Splash({ onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 2200); return () => clearTimeout(t); }, []);
  return (
    <div style={{position:"fixed",inset:0,
      background:`linear-gradient(160deg,${C.green},${C.greenDark})`,
      display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:20,zIndex:1000}}>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:38,fontWeight:900,color:"#fff",letterSpacing:-1}}>EMS</div>
        <div style={{fontSize:15,fontWeight:600,color:"rgba(255,255,255,0.85)",marginTop:2}}>ELECTION MONITORING SYSTEM</div>
      </div>
      <div style={{fontSize:13,color:"rgba(255,255,255,0.7)"}}>Election Monitoring System</div>
      <div style={{marginTop:16,width:48,height:4,background:"rgba(255,255,255,0.25)",borderRadius:2,overflow:"hidden"}}>
        <div style={{height:"100%",background:"#fff",borderRadius:2,animation:"loadBar 2s ease forwards"}}/>
      </div>
      <div style={{position:"absolute",bottom:32,fontSize:11,color:"rgba(255,255,255,0.5)"}}>© 2026 RescueTap Ltd.</div>
      <style>{`@keyframes loadBar{from{width:0}to{width:100%}}`}</style>
    </div>
  );
}

// ── ONBOARDING ────────────────────────────────────────────────
function Onboarding({ onDone }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [state, setState] = useState("");
  const [loading, setLoading] = useState(false);

  const next = async () => {
    if (step < 2) { setStep(s => s + 1); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    onDone({ name, role, state });
  };

  const canNext = step === 0 ? name.trim().length > 1 : step === 1 ? !!role : !!state;

  return (
    <div style={{minHeight:"100vh",background:C.white,display:"flex",flexDirection:"column",
      padding:"0 24px",maxWidth:430,margin:"0 auto"}}>
      <div style={{flex:1,paddingTop:60}}>
        <div style={{display:"flex",gap:6,marginBottom:40}}>
          {[0,1,2].map(i=>(
            <div key={i} style={{height:4,flex:i===step?2:1,borderRadius:2,
              background:i<=step?C.green:C.border,transition:"all 0.3s"}}/>
          ))}
        </div>
        {step===0 && (
          <>
            <div style={{fontSize:28,fontWeight:800,color:C.text,marginBottom:8}}>What's your name?</div>
            <div style={{fontSize:14,color:C.greyDark,marginBottom:28}}>This will appear on all your reports.</div>
            <input autoFocus style={{...inputStyle,fontSize:16,padding:"14px 16px"}}
              placeholder="Enter your full name" value={name}
              onChange={e=>setName(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&canNext&&next()}/>
          </>
        )}
        {step===1 && (
          <>
            <div style={{fontSize:28,fontWeight:800,color:C.text,marginBottom:8}}>Your role</div>
            <div style={{fontSize:14,color:C.greyDark,marginBottom:20}}>Select the role that describes you.</div>
            {ROLES.map(r=>(
              <button key={r} onClick={()=>setRole(r)} style={{width:"100%",padding:"14px 16px",
                marginBottom:10,borderRadius:13,textAlign:"left",cursor:"pointer",
                border:`1.5px solid ${role===r?C.green:C.border}`,
                background:role===r?"#E8F8ED":C.white,color:C.text,fontSize:14,
                fontWeight:role===r?600:400}}>
                {r}
              </button>
            ))}
          </>
        )}
        {step===2 && (
          <>
            <div style={{fontSize:28,fontWeight:800,color:C.text,marginBottom:8}}>Your state</div>
            <div style={{fontSize:14,color:C.greyDark,marginBottom:20}}>Which state are you reporting from?</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {STATES_NG.map(s=>(
                <button key={s} onClick={()=>setState(s)} style={{padding:"8px 14px",borderRadius:20,
                  fontSize:13,cursor:"pointer",border:`1.5px solid ${state===s?C.green:C.border}`,
                  background:state===s?"#E8F8ED":C.white,color:state===s?C.green:C.text,
                  fontWeight:state===s?700:400}}>
                  {s}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
      <div style={{padding:"20px 0 40px"}}>
        <button onClick={next} disabled={!canNext||loading}
          style={{...submitBtnStyle,opacity:canNext?1:0.45,marginTop:0}}>
          {loading?"Setting up…":step<2?"Continue →":"Activate Account"}
        </button>
        {step>0 && (
          <button onClick={()=>setStep(s=>s-1)} style={{width:"100%",marginTop:10,padding:12,
            background:"none",border:"none",color:C.greyDark,fontSize:14,cursor:"pointer"}}>
            ← Back
          </button>
        )}
      </div>
    </div>
  );
}

// ── LOGIN SCREEN ──────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [phone,    setPhone]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [errMsg,   setErrMsg]   = useState("");
  const [showPw,   setShowPw]   = useState(false);

  const handleLogin = async () => {
    setErrMsg("");
    if (!phone.trim())    { setErrMsg("Please enter your phone number."); return; }
    if (!password.trim()) { setErrMsg("Please enter your password."); return; }
    setLoading(true);
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const res = await fetch(
        GAS_URL + "?action=login&phone=" + encodeURIComponent(phone.trim()) +
          "&password=" + encodeURIComponent(password.trim()),
        { method: "GET", signal: controller.signal }
      );
      clearTimeout(timeout);
      const data = await res.json();
      if (data.success) {
        onLogin(data.user);
      } else {
        setErrMsg(data.error || "Invalid phone number or password.");
      }
    } catch (e) {
      if (e.name === "AbortError") {
        setErrMsg("Request timed out. Please try again.");
      } else {
        setErrMsg("Unable to reach server. Check your connection and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{minHeight:"100vh",background:C.white,display:"flex",flexDirection:"column",
      maxWidth:430,margin:"0 auto"}}>
      {/* Green header band */}
      <div style={{background:`linear-gradient(160deg,${C.green},${C.greenDark})`,
        padding:"52px 32px 40px",textAlign:"center"}}>
        <div style={{fontSize:42,fontWeight:900,color:"#fff",letterSpacing:-1,lineHeight:1}}>EMS</div>
        <div style={{fontSize:14,fontWeight:600,color:"rgba(255,255,255,0.8)",marginTop:2,letterSpacing:2}}>ELECTION MONITORING SYSTEM</div>
        <div style={{fontSize:12,color:"rgba(255,255,255,0.65)",marginTop:6}}>Election Monitoring System</div>
      </div>

      {/* Login card */}
      <div style={{flex:1,padding:"32px 24px 40px"}}>
        <div style={{fontSize:22,fontWeight:800,color:C.text,marginBottom:4}}>Observer Login</div>
        <div style={{fontSize:13,color:C.greyDark,marginBottom:28}}>
          Sign in with your registered credentials to access the field reporting hub.
        </div>

        {errMsg && (
          <div style={{background:"#FEF2F2",border:"1px solid #FECACA",borderRadius:10,
            padding:"10px 14px",fontSize:13,color:"#DC2626",marginBottom:16,fontWeight:500}}>
            ⚠️ {errMsg}
          </div>
        )}

        <div style={{marginBottom:14}}>
          <label style={labelStyle}>Phone Number</label>
          <div style={{position:"relative"}}>
            <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",
              fontSize:13,color:C.greyDark,pointerEvents:"none"}}>🇳🇬 +234</span>
            <input
              style={{...inputStyle,paddingLeft:76}}
              type="tel"
              placeholder="800 000 0000"
              value={phone}
              onChange={e=>setPhone(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&handleLogin()}
              autoComplete="tel"
            />
          </div>
        </div>

        <div style={{marginBottom:8}}>
          <label style={labelStyle}>Password</label>
          <div style={{position:"relative"}}>
            <input
              style={{...inputStyle,paddingRight:48}}
              type={showPw?"text":"password"}
              placeholder="Enter your password"
              value={password}
              onChange={e=>setPassword(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&handleLogin()}
              autoComplete="current-password"
            />
            <button onClick={()=>setShowPw(v=>!v)}
              style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",
                background:"none",border:"none",cursor:"pointer",fontSize:16,color:C.grey,
                lineHeight:1,padding:0}}>
              {showPw ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        <button onClick={handleLogin} disabled={loading}
          style={{...submitBtnStyle,opacity:loading?0.75:1,marginTop:24,
            display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
          {loading
            ? <><span style={{animation:"spin 0.8s linear infinite",display:"inline-block"}}>⟳</span> Signing in…</>
            : "Sign In →"
          }
        </button>

      </div>

      <div style={{padding:"0 24px 32px",textAlign:"center",fontSize:11,color:C.grey}}>
        © 2026 RescueTap Ltd. · EMS
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

// ── APP ROOT ──────────────────────────────────────────────────
export default function ObserverApp() {
  const [screen, setScreen] = useState("splash");
  const [user,   setUser]   = useState(null);
  const [tab,    setTab]    = useState("home");
  const [modal,  setModal]  = useState(null);
  const [toast,  setToast]  = useState(null);

  const showToast = (msg, type="success") => setToast({ msg, type });

  const handleSubmit = async (data) => {
    try {
      const res = await submitReport({ ...data, reporter: user?.name || data.reporter });
      setModal(null);
      if (res.success) showToast(`✓ Report submitted · ${res.refId}`);
      else showToast("Submission failed. Try again.", "error");
    } catch {
      showToast("Network error. Check connection.", "error");
    }
  };

  const handleLogout = () => {
    setUser(null);
    setTab("home");
    setModal(null);
    setScreen("login");
  };

  if (screen === "splash") return <Splash onDone={()=>{ setUser({ name:"Demo Observer", phone:"08000000000", role:"Accredited Observer", state:"FCT", observerId:"OBS-FCT-8831" }); setScreen("app"); }}/>;

  return (
    <div style={{fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
      background:C.bg,height:"100dvh",width:"100%",maxWidth:430,margin:"0 auto",
      position:"relative",overflow:"hidden",display:"flex",flexDirection:"column",boxSizing:"border-box"}}>
      <style>{`*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
        select{appearance:auto}`}</style>

      <div style={{flex:1,minHeight:0,position:"relative"}}>
        {tab==="home"      && <HomePage     user={user} onModal={setModal}/>}
        {tab==="contacts"  && <ContactsPage/>}
        {tab==="helplines" && <HelplinePage/>}
        {tab==="profile"   && <ProfilePage  user={user} onLogout={handleLogout}/>}
      </div>

      {tab==="home" && <SOSFloatingButton onPress={()=>setModal("sos")}/>}
      <BottomNav tab={tab} onChange={setTab}/>

      {modal==="audio"    && <AudioModal    user={user} onClose={()=>setModal(null)} onSubmit={handleSubmit}/>}
      {modal==="image"    && <ImageModal    user={user} onClose={()=>setModal(null)} onSubmit={handleSubmit}/>}
      {modal==="video"    && <VideoModal    user={user} onClose={()=>setModal(null)} onSubmit={handleSubmit}/>}
      {modal==="location" && <LocationModal user={user} onClose={()=>setModal(null)} onSubmit={handleSubmit}/>}
      {modal==="sos"      && <SOSModal      user={user} onClose={()=>setModal(null)} onSubmit={handleSubmit}/>}

      {toast && <Toast msg={toast.msg} type={toast.type} onDone={()=>setToast(null)}/>}
    </div>
  );
}