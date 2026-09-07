// GRAVORA — single-file Cloudflare Pages Worker
// Authorized direct-media URLs only. No DRM/access-control bypass.

const HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#06080d">
<title>GRAVORA — Save authorized media</title>
<link rel="stylesheet" href="/style.css">
</head>
<body>
<div class="ambient ambient-a"></div>
<div class="ambient ambient-b"></div>

<header class="topbar">
  <a class="brand" href="/" aria-label="GRAVORA home">
    <span class="brand-mark">G</span>
    <span class="brand-word">gravora</span>
  </a>
  <div class="top-actions">
    <span class="secure-dot"></span>
    <span class="top-label">AUTHORIZED MEDIA</span>
  </div>
</header>

<main class="shell">
  <section class="hero">
    <div class="eyebrow"><span class="eyebrow-line"></span> MEDIA SAVER <span class="eyebrow-line"></span></div>
    <h1>Grab it.<br><span>Keep it.</span></h1>
    <p class="sub">A cleaner way to save media you own or are authorized to download — with the source deciding what’s actually available.</p>
  </section>

  <section class="grab-card">
    <div class="card-glow"></div>
    <div class="card-head">
      <div>
        <div class="mini-label">PASTE SOURCE</div>
        <h2>Drop your media link</h2>
      </div>
      <div class="link-icon" aria-hidden="true">↗</div>
    </div>

    <form id="mediaForm">
      <label class="sr-only" for="url">Media URL</label>
      <div class="url-wrap">
        <span class="url-prefix">URL</span>
        <input id="url" type="url" inputmode="url" autocomplete="url" placeholder="Paste a video link or direct media URL" required>
        <button id="inspectBtn" type="submit">Check source <span>→</span></button>
      </div>
      <p class="hint"><span>●</span> Direct video, audio, image and subtitle sources are supported.</p>
    </form>
  </section>

  <section id="result" class="result-panel hidden" aria-live="polite">
    <div class="result-top">
      <div>
        <div class="status-label"><span class="pulse"></span> SOURCE DETECTED</div>
        <h2 id="sourceName">Source</h2>
        <div id="meta" class="meta"></div>
      </div>
      <span id="sourceType" class="type-badge">—</span>
    </div>

    <div class="preview-media">
      <img id="previewImage" alt="Video preview" loading="lazy">
      <div id="previewFallback" class="preview-fallback">G</div>
    </div>
    <div class="preview-info">
      <div class="preview-kicker">VIDEO PREVIEW</div>
      <h3 id="previewTitle">Media preview</h3>
      <p id="previewMeta">Paste a supported link to preview available metadata.</p>
    </div>

    <div class="options-title">SAVE AS</div>
    <div class="options">
      <button class="option active" data-kind="video"><span class="option-icon">▶</span><span><b>Video</b><small>MP4 preference</small></span></button>
      <button class="option" data-kind="audio"><span class="option-icon">♪</span><span><b>Audio</b><small>Audio preference</small></span></button>
      <button class="option" data-kind="thumbnail"><span class="option-icon">▧</span><span><b>Thumbnail</b><small>Preview image</small></span></button>
      <button class="option" data-kind="captions"><span class="option-icon">CC</span><span><b>Captions</b><small>If supplied by source</small></span></button>
    </div>

    <div class="options-title quality-title">QUALITY PREFERENCE</div>
    <div class="quality-options">
      <button class="quality active" data-quality="auto">Auto</button>
      <button class="quality" data-quality="high">High</button>
      <button class="quality" data-quality="standard">Standard</button>
    </div>
    <div id="availability" class="availability"></div>
    <button id="downloadBtn" class="download" type="button">
      <span class="download-main">Continue to download</span>
      <span class="download-arrow">↓</span>
    </button>
    <p class="preview-note">Preview only — this build does not retrieve or download third-party platform media.</p>
  </section>

  <section id="error" class="error-panel hidden">
    <div class="error-mark">!</div>
    <div class="error-copy">
      <b id="errorTitle">Couldn’t process that link</b>
      <p id="errorText"></p>
    </div>
    <button id="retryBtn" type="button">Retry</button>
  </section>

  <div class="legal"><span>LOCKED DOWN</span> Only download media you own or have permission to download. GRAVORA does not bypass access controls, DRM, or platform restrictions.</div>

  <section class="how">
    <div class="section-kicker">HOW IT WORKS</div>
    <div class="how-grid">
      <article><span>01</span><div><h3>Paste</h3><p>Put an authorized direct media URL into GRAVORA.</p></div></article>
      <article><span>02</span><div><h3>Check</h3><p>We inspect the source and show what it really provides.</p></div></article>
      <article><span>03</span><div><h3>Save</h3><p>Download the original source without fake quality choices.</p></div></article>
    </div>
  </section>
</main>

<footer>
  <div class="footer-brand"><span class="brand-mark small">G</span><span>gravora</span></div>
  <div class="footer-right"><span>Save. Simple. Fast.</span><small>Crafted by Anubhav Verma</small></div>
</footer>

<script src="/app.js"></script>
</body>
</html>`;
const CSS = `*{box-sizing:border-box}
:root{--bg:#06080d;--panel:rgba(13,17,25,.72);--line:rgba(146,163,187,.16);--text:#f5f7fa;--muted:#8995a7;--soft:#aeb8c7;--accent:#e9edf3}
html{background:var(--bg);scroll-behavior:smooth}
body{margin:0;min-height:100vh;color:var(--text);font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Segoe UI",sans-serif;background:
radial-gradient(900px 500px at 50% -10%,rgba(77,104,139,.16),transparent 65%),
radial-gradient(600px 450px at 90% 45%,rgba(44,65,91,.10),transparent 70%),
#06080d;overflow-x:hidden}
body:before{content:"";position:fixed;inset:0;pointer-events:none;opacity:.035;background-image:linear-gradient(rgba(255,255,255,.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.6) 1px,transparent 1px);background-size:48px 48px;mask-image:linear-gradient(to bottom,black,transparent 75%)}
.ambient{position:fixed;border-radius:50%;filter:blur(70px);pointer-events:none;opacity:.18}
.ambient-a{width:260px;height:260px;left:-140px;top:280px;background:#304762}
.ambient-b{width:220px;height:220px;right:-120px;top:520px;background:#263c57}
.topbar{height:78px;border-bottom:1px solid rgba(170,185,204,.10);display:flex;align-items:center;justify-content:space-between;padding:0 max(20px,calc((100vw - 1120px)/2));position:relative;z-index:2;backdrop-filter:blur(18px);background:rgba(6,8,13,.55)}
.brand{display:flex;align-items:center;gap:11px;color:var(--text);text-decoration:none;font-size:21px;font-weight:780;letter-spacing:-.5px}
.brand-mark{width:37px;height:37px;border-radius:11px;background:linear-gradient(145deg,#fff,#cfd6df);color:#10151c;display:grid;place-items:center;font-size:19px;font-weight:900;box-shadow:0 8px 25px rgba(255,255,255,.08)}
.top-actions{display:flex;align-items:center;gap:9px;border:1px solid rgba(160,175,195,.15);padding:8px 12px;border-radius:999px;background:rgba(15,20,29,.55)}
.secure-dot{width:6px;height:6px;border-radius:50%;background:#39d98a;box-shadow:0 0 12px rgba(57,217,138,.75)}
.top-label{font-size:9px;letter-spacing:1.8px;color:#a5afbd;font-weight:800}
.shell{width:min(930px,100%);margin:auto;padding:86px 22px 80px;position:relative;z-index:1}
.hero{text-align:center;max-width:760px;margin:0 auto 46px}
.eyebrow{display:flex;align-items:center;justify-content:center;gap:12px;color:#8794a6;font-size:10px;letter-spacing:2.8px;font-weight:850;margin-bottom:18px}
.eyebrow-line{width:26px;height:1px;background:#526071;opacity:.6}
.hero h1{font-size:clamp(54px,10vw,88px);line-height:.88;letter-spacing:-5px;margin:0;font-weight:850}
.hero h1 span{color:#9da9b9}
.sub{max-width:620px;margin:25px auto 0;color:#8995a7;font-size:15px;line-height:1.7}
.grab-card,.result-panel{position:relative;background:linear-gradient(145deg,rgba(19,25,35,.86),rgba(8,12,18,.78));border:1px solid var(--line);border-radius:26px;box-shadow:0 30px 100px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.035);overflow:hidden}
.grab-card{padding:25px}
.card-glow{position:absolute;width:330px;height:180px;right:-120px;top:-100px;border-radius:50%;background:#5d7692;filter:blur(80px);opacity:.11}
.card-head{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:20px}
.mini-label,.options-title,.section-kicker{font-size:9px;letter-spacing:2px;color:#748196;font-weight:850}
.card-head h2{font-size:20px;letter-spacing:-.5px;margin:7px 0 0}
.link-icon{width:38px;height:38px;border:1px solid var(--line);border-radius:12px;display:grid;place-items:center;color:#aeb8c6;background:rgba(255,255,255,.025)}
.url-wrap{display:flex;align-items:center;gap:0;border:1px solid #354154;border-radius:16px;background:rgba(4,7,12,.78);padding:6px;box-shadow:inset 0 1px 20px rgba(0,0,0,.2),0 0 0 4px rgba(125,146,171,.025)}
.url-prefix{font-size:9px;font-weight:850;letter-spacing:1px;color:#647184;padding:0 12px}
.url-wrap input{min-width:0;flex:1;border:0;outline:0;background:transparent;color:#eef2f6;font-size:14px;padding:13px 5px}
.url-wrap input::placeholder{color:#596577}
.url-wrap button{border:0;border-radius:11px;background:linear-gradient(180deg,#f4f6f8,#dce1e7);color:#0b0f15;font-weight:850;font-size:12px;padding:13px 16px;white-space:nowrap;cursor:pointer;transition:.2s}
.url-wrap button:hover{transform:translateY(-1px)}
.url-wrap button:disabled{opacity:.55;transform:none}
.hint{font-size:11px;color:#667386;margin:12px 4px 0}.hint span{font-size:7px;color:#8998aa;margin-right:5px}
.result-panel{margin-top:16px;padding:25px}
.result-top{display:flex;align-items:flex-start;justify-content:space-between;gap:18px}
.status-label{display:flex;align-items:center;gap:7px;font-size:9px;letter-spacing:1.8px;color:#8b99ab;font-weight:850;margin-bottom:9px}
.pulse{width:6px;height:6px;border-radius:50%;background:#aeb9c6;box-shadow:0 0 12px rgba(190,205,225,.55)}
.result-top h2{margin:0;font-size:24px;letter-spacing:-.8px;max-width:570px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.meta{margin-top:7px;color:#687587;font-size:11px;word-break:break-all}
.type-badge{flex:none;border:1px solid #354154;background:rgba(255,255,255,.025);border-radius:999px;padding:8px 11px;color:#aab5c3;font-size:10px}
.source-strip{display:flex;align-items:center;gap:13px;margin:24px 0 22px;padding:13px;border:1px solid rgba(160,175,195,.10);border-radius:16px;background:rgba(255,255,255,.018)}
.source-art{width:42px;height:42px;border-radius:12px;background:linear-gradient(145deg,#202b3a,#0e141d);display:grid;place-items:center;color:#d9e0e8;font-weight:900;border:1px solid rgba(255,255,255,.06)}
.source-copy strong,.source-copy span{display:block}.source-copy strong{font-size:12px}.source-copy span{font-size:10px;color:#687587;margin-top:3px}
.options-title{margin-bottom:10px}
.options{display:grid;grid-template-columns:repeat(4,1fr);gap:9px}
.option{min-width:0;display:flex;align-items:center;gap:10px;background:rgba(5,9,14,.65);border:1px solid rgba(143,160,182,.13);color:#c9d1dc;border-radius:15px;padding:13px 11px;text-align:left;cursor:pointer;transition:.2s}
.option:hover{border-color:rgba(180,195,212,.3);background:rgba(255,255,255,.035)}
.option.active{border-color:#77869a;background:linear-gradient(145deg,rgba(105,123,144,.20),rgba(20,27,37,.7));box-shadow:0 10px 28px rgba(0,0,0,.16)}
.option-icon{width:28px;height:28px;border-radius:9px;display:grid;place-items:center;background:#111923;color:#aeb9c7;font-size:11px;font-weight:850;flex:none}
.option b,.option small{display:block;white-space:nowrap}.option b{font-size:11px}.option small{font-size:9px;color:#687587;margin-top:4px}
.availability{min-height:28px;padding:13px 2px 7px;color:#7e8b9d;font-size:10px;line-height:1.5}
.download{height:52px;width:100%;border-radius:15px;background:linear-gradient(180deg,#f5f7f9,#dfe4e9);color:#090d13;text-decoration:none;display:flex;align-items:center;justify-content:space-between;padding:0 17px;font-size:13px;font-weight:850;transition:.2s}
.download:hover{transform:translateY(-1px);box-shadow:0 12px 30px rgba(0,0,0,.22)}
.download-arrow{font-size:18px}
.download[aria-disabled="true"]{opacity:.42;pointer-events:none;filter:saturate(.5)}
.error-panel{margin-top:16px;display:flex;align-items:center;gap:12px;padding:15px;border:1px solid rgba(164,93,93,.25);background:rgba(54,25,29,.35);border-radius:16px}
.error-mark{width:30px;height:30px;border-radius:9px;display:grid;place-items:center;border:1px solid rgba(210,130,130,.25);color:#d7a0a0;font-weight:900}
.error-copy{flex:1;min-width:0}.error-copy b{font-size:12px}.error-copy p{font-size:10px;color:#9a7e82;margin:4px 0 0;line-height:1.4}
.error-panel button{border:1px solid rgba(180,195,212,.16);background:#111721;color:#d4dbe3;border-radius:10px;padding:9px 12px;font-weight:750;font-size:10px}
.legal{text-align:center;max-width:700px;margin:19px auto 0;color:#5e6a7b;font-size:9px;line-height:1.55}.legal span{letter-spacing:1.3px;font-weight:850;color:#778497;margin-right:5px}
.how{margin-top:78px}.section-kicker{text-align:center;margin-bottom:17px}
.how-grid{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.how-grid article{display:flex;gap:14px;padding:23px 18px;border-right:1px solid var(--line)}.how-grid article:last-child{border-right:0}
.how-grid article>span{font-size:9px;letter-spacing:1px;color:#5f6c7e;padding-top:3px}.how-grid h3{margin:0;font-size:15px;letter-spacing:-.2px}.how-grid p{margin:6px 0 0;color:#667386;font-size:10px;line-height:1.5}
footer{border-top:1px solid rgba(170,185,204,.09);padding:24px max(20px,calc((100vw - 1120px)/2)) 32px;display:flex;align-items:center;justify-content:space-between;color:#697688;font-size:11px;position:relative;z-index:1}
.footer-brand{display:flex;align-items:center;gap:9px;font-weight:800;color:#9aa6b5}.brand-mark.small{width:27px;height:27px;border-radius:8px;font-size:13px}.footer-right{display:flex;align-items:center;gap:16px}.footer-right small{color:#505d6e}
.hidden{display:none}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
@media(max-width:700px){
.topbar{height:68px;padding:0 16px}.brand{font-size:19px}.brand-mark{width:34px;height:34px}.top-label{font-size:8px}
.shell{padding:68px 15px 55px}.hero{margin-bottom:35px}.hero h1{font-size:58px;letter-spacing:-4px}.sub{font-size:13px;line-height:1.6;margin-top:20px}
.grab-card,.result-panel{border-radius:22px;padding:19px}.card-head h2{font-size:18px}
.url-wrap{display:block;padding:6px}.url-prefix{display:none}.url-wrap input{width:100%;padding:13px 11px}.url-wrap button{width:100%;margin-top:4px;height:46px}
.result-top h2{max-width:250px;font-size:20px}.type-badge{font-size:9px;padding:7px 9px}
.source-strip{margin-top:20px}.options{grid-template-columns:repeat(2,1fr)}.option{padding:12px 10px}.option-icon{width:27px;height:27px}
.how{margin-top:58px}.how-grid{grid-template-columns:1fr}.how-grid article{border-right:0;border-bottom:1px solid var(--line);padding:19px 4px}.how-grid article:last-child{border-bottom:0}
footer{padding:24px 16px 30px;display:block;text-align:center}.footer-brand{justify-content:center}.footer-right{display:block;margin-top:12px}.footer-right small{display:block;margin-top:6px}
}
@media(max-width:380px){.hero h1{font-size:51px}.top-label{display:none}}
`;
const JS = `const form=document.querySelector("#mediaForm"),urlInput=document.querySelector("#url"),result=document.querySelector("#result"),errorBox=document.querySelector("#error"),errorText=document.querySelector("#errorText"),errorTitle=document.querySelector("#errorTitle"),inspectBtn=document.querySelector("#inspectBtn"),retryBtn=document.querySelector("#retryBtn"),sourceName=document.querySelector("#sourceName"),sourceType=document.querySelector("#sourceType"),meta=document.querySelector("#meta"),availability=document.querySelector("#availability"),downloadBtn=document.querySelector("#downloadBtn"),options=[...document.querySelectorAll(".option")],qualities=[...document.querySelectorAll(".quality")],previewImage=document.querySelector("#previewImage"),previewFallback=document.querySelector("#previewFallback"),previewTitle=document.querySelector("#previewTitle"),previewMeta=document.querySelector("#previewMeta");let currentKind="video",currentQuality="auto";
function showError(t,m){result.classList.add("hidden");errorBox.classList.remove("hidden");errorTitle.textContent=t;errorText.textContent=m}function hideError(){errorBox.classList.add("hidden")}
function isYouTube(raw){try{const h=new URL(raw).hostname.toLowerCase();return /(^|\.)youtube\.com$|(^|\.)youtu\.be$/.test(h)}catch{return false}}
function setKind(kind){currentKind=kind;options.forEach(b=>b.classList.toggle("active",b.dataset.kind===kind));availability.textContent=kind==="thumbnail"?"Thumbnail preview is shown when the source provides one.":kind==="captions"?"Captions depend on the source and are not fetched in preview mode.":kind==="audio"?"Audio is shown as a format preference only in this preview build.":"Video quality is a preference only; actual formats are not fetched in preview mode."}
options.forEach(b=>b.addEventListener("click",()=>setKind(b.dataset.kind)));qualities.forEach(b=>b.addEventListener("click",()=>{currentQuality=b.dataset.quality;qualities.forEach(q=>q.classList.toggle("active",q===b));}));retryBtn.addEventListener("click",()=>form.requestSubmit());
downloadBtn.addEventListener("click",()=>{showError("Download is disabled in preview mode","GRAVORA can show the video preview and selection flow here, but this build does not retrieve or download third-party platform media.")});
form.addEventListener("submit",async e=>{e.preventDefault();hideError();result.classList.add("hidden");const raw=urlInput.value.trim();let u;try{u=new URL(raw)}catch{showError("Invalid URL","Please paste a complete http:// or https:// media URL.");return}if(!/^https?:$/.test(u.protocol)){showError("Unsupported URL","Only http:// and https:// sources are supported.");return}inspectBtn.disabled=true;inspectBtn.textContent="Checking…";try{let data={contentType:"link",contentLength:null};if(!isYouTube(raw)){const r=await fetch('/api/inspect?url='+encodeURIComponent(raw));const d=await r.json();if(!r.ok)throw new Error(d.error||"The source could not be inspected.");data=d}const p=await fetch('/api/preview?url='+encodeURIComponent(raw));const pd=await p.json();if(!p.ok)throw new Error(pd.error||"Preview metadata could not be loaded.");sourceName.textContent=pd.title||"Media preview";sourceType.textContent=isYouTube(raw)?"YouTube":"MEDIA LINK";meta.textContent=isYouTube(raw)?(pd.author?pd.author+" • Preview metadata":"Preview metadata"):[data.contentType,data.contentLength?data.contentLength+" bytes":null].filter(Boolean).join(" • ");previewTitle.textContent=pd.title||"Media preview";previewMeta.textContent=isYouTube(raw)?((pd.author?"By "+pd.author+" • ":"")+"Preview only — source media is not retrieved."):(data.contentType+" • Preview only");if(pd.thumbnail){previewImage.src=pd.thumbnail;previewImage.classList.add("loaded");previewFallback.classList.add("hidden")}else{previewImage.removeAttribute("src");previewImage.classList.remove("loaded");previewFallback.classList.remove("hidden")}result.classList.remove("hidden");setKind("video")}catch(err){showError("Couldn’t prepare that preview",err.message)}finally{inspectBtn.disabled=false;inspectBtn.innerHTML='Get Media <span>→</span>'}});
`;

function json(data, status=200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
}

function validTarget(raw) {
  try {
    const u = new URL(raw);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function withCors(headers={}) {
  const h = new Headers(headers);
  h.set("Access-Control-Allow-Origin", "*");
  return h;
}

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") return new Response(null, {headers: withCors()});

    if (url.pathname === "/" || url.pathname === "/index.html") {
      return new Response(HTML, {headers: withCors({"content-type":"text/html; charset=utf-8"})});
    }
    if (url.pathname === "/style.css") {
      return new Response(CSS, {headers: withCors({"content-type":"text/css; charset=utf-8"})});
    }
    if (url.pathname === "/app.js") {
      return new Response(JS, {headers: withCors({"content-type":"application/javascript; charset=utf-8"})});
    }

    if (url.pathname === "/api/preview") {
      const target = url.searchParams.get("url");
      if (!target || !validTarget(target)) return json({error:"A valid http/https URL is required."},400);
      try {
        const u = new URL(target);
        const isYouTube = /(^|\.)youtube\.com$|(^|\.)youtu\.be$/.test(u.hostname);
        if (!isYouTube) return json({ok:true,kind:"generic",title:"Media preview",thumbnail:null});
        const o = await fetch("https://www.youtube.com/oembed?url=" + encodeURIComponent(target) + "&format=json", {redirect:"follow"});
        if (!o.ok) return json({error:"YouTube metadata could not be loaded."},502);
        const data = await o.json();
        return json({ok:true,kind:"youtube",title:data.title || "YouTube video",author:data.author_name || "YouTube",thumbnail:data.thumbnail_url || null});
      } catch {
        return json({error:"Preview metadata could not be loaded."},502);
      }
    }

    if (url.pathname === "/api/inspect") {
      const target = url.searchParams.get("url");
      if (!target || !validTarget(target)) return json({error:"A valid http/https media URL is required."},400);
      try {
        const upstream = await fetch(target, {method:"HEAD", redirect:"follow"});
        if (!upstream.ok) return json({error:`Source returned HTTP ${upstream.status}.`},502);
        const contentType = (upstream.headers.get("content-type") || "application/octet-stream").toLowerCase();
        const contentLength = upstream.headers.get("content-length");
        return json({ok:true, contentType, contentLength:contentLength ? Number(contentLength) : null, finalUrl:upstream.url});
      } catch {
        return json({error:"The source could not be reached. It may block server requests or require authorization."},502);
      }
    }

    if (url.pathname === "/api/download") {
      const target = url.searchParams.get("url");
      if (!target || !validTarget(target)) return new Response("Invalid source URL.",{status:400,headers:withCors()});
      try {
        const upstream = await fetch(target, {redirect:"follow"});
        if (!upstream.ok) return new Response(`Source returned HTTP ${upstream.status}.`,{status:502,headers:withCors()});
        const headers = withCors(upstream.headers);
        headers.set("Content-Disposition",'attachment; filename="gravora-media"');
        return new Response(upstream.body, {status:200,headers});
      } catch {
        return new Response("Unable to fetch the source.",{status:502,headers:withCors()});
      }
    }

    return new Response("Not found",{status:404,headers:withCors({"content-type":"text/plain"})});
  }
};
