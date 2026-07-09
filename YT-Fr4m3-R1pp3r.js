// ==UserScript==
// @name         YT Fr4m3 R1pp3r [By H3l!0s_T3k]
// @name:ar      YT Fr4m3 R1pp3r [By H3l!0s_T3k]
// @name:en      YT Fr4m3 R1pp3r [By H3l!0s_T3k]
// @name:fr      YT Fr4m3 R1pp3r [By H3l!0s_T3k]
// @name:he      YT Fr4m3 R1pp3r [By H3l!0s_T3k]
// @name:zh      YT Fr4m3 R1pp3r [By H3l!0s_T3k]
// @name:ru      YT Fr4m3 R1pp3r [By H3l!0s_T3k]
// @name:hi      YT Fr4m3 R1pp3r [By H3l!0s_T3k]
// @name:ja      YT Fr4m3 R1pp3r [By H3l!0s_T3k]
// @name:zgh     YT Fr4m3 R1pp3r [By H3l!0s_T3k]
// @name:de      YT Fr4m3 R1pp3r [By H3l!0s_T3k]
//
// @description  High-Precision YouTube Frame Extractor for Video Analysis, Digital Forensics, and Media Investigation.
// @description:ar  مستخرج إطارات يوتيوب عالي الدقة لتحليل الفيديو، التحقيق الرقمي، وتحليل الوسائط.
// @description:en  High-Precision YouTube Frame Extractor for Video Analysis, Digital Forensics, and Media Investigation.
// @description:fr  Extracteur de cadres YouTube haute précision pour l'analyse vidéo, la forensique numérique et l'investigation des médias.
// @description:he  מחלץ מסגרות יוטיוב בדיוק גבוה לניתוח וידאו, חקירה דיגיטלית וחקירת מדיה.
// @description:zh  用于视频分析、数字取证和媒体调查的高精度 YouTube 帧提取器。
// @description:ru  Высокоточный экстрактор кадров YouTube для анализа видео, цифровой криминалистики и расследования медиа.
// @description:hi  वीडियो विश्लेषण, डिजिटल फोरेंसिक और मीडिया जांच के लिए उच्च-परिशुद्धता YouTube फ्रेम एक्सट्रैक्टर।
// @description:ja  ビデオ分析、デジタルフォレンジック、メディア調査のための高精度YouTubeフレーム抽出ツール。
// @description:zgh Afeckan n tkalitin n YouTube s teɣzut meqqren i usnflul n uvidyu, tussna tatiknikt d uѕnml n umidyat.
// @description:de  Hochpräziser YouTube-Frame-Extraktor für Videoanalyse, digitale Forensik und Medienuntersuchung.
//
// @namespace    http://tampermonkey.net/
// @version      5.1
// @author       H3l!0s_T3k
// @homepageURL  https://github.com/Ismail-Benali
// @match        *://*.youtube.com/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';
    if (window.__ytFr4m3R1pp3rInit) return;
    window.__ytFr4m3R1pp3rInit = true;

    const isZipAvailable = typeof JSZip !== 'undefined';

    let settings;
    try { const s = localStorage.getItem('ripperSettings'); settings = s ? JSON.parse(s) : null; } catch(e) { settings = null; }
    if (!settings) settings = { quality: 0.85, format: 'image/jpeg', interval: 0.5, maxRamMB: 1500, panelPos: null };
    function saveSettings() { try { localStorage.setItem('ripperSettings', JSON.stringify(settings)); } catch(e){} }

    let captureState = 'idle', captureCallbackId = null, fallbackInterval = null, lastCaptureTime = -1;
    let pendingBlobs = 0, lastFrameTime = 0, currentFps = 0, captureStartTime = null;
    let zip = null, framesFolder = null, canvas, ctx;

    const SHEET_IMGS = 1024, SHEET_COLS = 32, SHEET_ROWS = 32, THUMB_W = 192, THUMB_H = 108;
    let currentSheetCanvas, currentSheetCtx, sheetIndex = 0, imgInSheet = 0, sheetX = 0, sheetY = 0, sheetBlobs = [];
    let frameCount = 0, totalBytes = 0, framesData = [], fpsHistory = [];

    let uiContainer, uiBody, startBtn, pauseBtn, stopBtn, manualBtn, statusTxt, statsTxt, captureProgressBar, zipProgressBar;
    let intervalSelect, formatSelect, qualitySelect, maxRamInput, settingsToggle, collapseBtn;

    function getVideo() { return document.querySelector('video'); }
    function getExt() { return settings.format === 'image/png' ? 'png' : settings.format === 'image/webp' ? 'webp' : 'jpg'; }
    function formatBytes(b) { if(b===0) return '0 KB'; const k=1024,s=['Bytes','KB','MB','GB'],i=Math.floor(Math.log(b)/Math.log(k)); return parseFloat((b/Math.pow(k,i)).toFixed(2))+' '+s[i]; }
    function formatTime(s) { if(isNaN(s)) return "00:00:00"; return `${Math.floor(s/3600).toString().padStart(2,'0')}:${Math.floor((s%3600)/60).toString().padStart(2,'0')}:${Math.floor(s%60).toString().padStart(2,'0')}`; }
    function formatDurationForName(s) { if(isNaN(s)) return "000000"; return `${Math.floor(s/3600).toString().padStart(2,'0')}${Math.floor((s%3600)/60).toString().padStart(2,'0')}${Math.floor(s%60).toString().padStart(2,'0')}`; }

    function updateUIState() {
        if(!startBtn) return;
        startBtn.style.display = captureState === 'idle' ? 'block' : 'none';
        pauseBtn.style.display = captureState === 'running' ? 'block' : 'none';
        pauseBtn.innerText = '⏸ PAUSE';
        stopBtn.style.display = captureState !== 'idle' ? 'block' : 'none';
        manualBtn.style.display = captureState === 'idle' ? 'block' : 'none';
    }

    function updateStats(video) {
        if(!video || !statsTxt) return;
        const res=`${video.videoWidth}x${video.videoHeight}`, timeStr=`${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
        if(video.duration>0 && captureProgressBar){ const p=Math.min(((video.currentTime/video.duration)*100),100).toFixed(1); captureProgressBar.style.width=`${p}%`; captureProgressBar.style.background=p>80?'#d00':'#0f0'; }
        statsTxt.innerText=`Res: ${res} | FPS: ${currentFps}\n${timeStr} | Captured: ${frameCount}\nCache: ${formatBytes(totalBytes)} / ${settings.maxRamMB} MB`;
    }

    function initSheetCanvas() { currentSheetCanvas=document.createElement('canvas'); currentSheetCanvas.width=SHEET_COLS*THUMB_W; currentSheetCanvas.height=SHEET_ROWS*THUMB_H; currentSheetCtx=currentSheetCanvas.getContext('2d'); currentSheetCtx.fillStyle='#000'; currentSheetCtx.fillRect(0,0,currentSheetCanvas.width,currentSheetCanvas.height); sheetX=0;sheetY=0;imgInSheet=0; }
    async function saveCurrentSheet() { const b=await new Promise(r=>currentSheetCanvas.toBlob(r,'image/jpeg',0.85)); if(b) sheetBlobs.push({name:`ContactSheet_${sheetIndex.toString().padStart(2,'0')}.jpg`,blob:b}); sheetIndex++; initSheetCanvas(); }
    function drawToContactSheet() { currentSheetCtx.drawImage(canvas,sheetX,sheetY,THUMB_W,THUMB_H); imgInSheet++; sheetX+=THUMB_W; if(sheetX>=SHEET_COLS*THUMB_W){sheetX=0;sheetY+=THUMB_H;} if(imgInSheet>=SHEET_IMGS) saveCurrentSheet(); }

    function captureFrame(video, now) {
        try {
            if(!canvas){ canvas=document.createElement('canvas'); ctx=canvas.getContext('2d'); }
            canvas.width=video.videoWidth; canvas.height=video.videoHeight;
            ctx.drawImage(video,0,0,canvas.width,canvas.height);

            if(lastFrameTime>0&&now>0){const d=(now-lastFrameTime)/1000;if(d>0){fpsHistory.push(d);if(fpsHistory.length>20)fpsHistory.shift();currentFps=Math.round(1/(fpsHistory.reduce((a,b)=>a+b,0)/fpsHistory.length));}}
            lastFrameTime=now;

            if(totalBytes>=(settings.maxRamMB*1024*1024)){if(statusTxt)statusTxt.innerText='[ WARN: RAM Limit ]';downloadZip();return;}

            pendingBlobs++;
            canvas.toBlob((fB)=>{
                if(fB&&captureState==='running'){
                    const ext=getExt(),tS=video.currentTime.toFixed(3).padStart(7,'0'),dS=formatDurationForName(video.duration),fS=frameCount.toString().padStart(6,'0'),fN=`${fS}_${dS}_${tS}.${ext}`;
                    framesFolder.file(fN,fB);
                    framesData.push({frame:fN,time:tS,size_bytes:fB.size});
                    totalBytes+=fB.size; frameCount++;
                    if(statusTxt)statusTxt.innerText=`[ Ripping... ${frameCount} ]`;
                }
                pendingBlobs--;
            },settings.format,settings.quality);

            drawToContactSheet();
        } catch(e){ console.error("Capture Error:",e); if(statusTxt)statusTxt.innerText='[ ERROR: CORS ]'; setCaptureState('idle'); }
    }

    function processVideoFrame(now) { if(captureState!=='running')return; const v=getVideo();if(!v)return; updateStats(v); if(v.currentTime-lastCaptureTime>=settings.interval||lastCaptureTime===-1){lastCaptureTime=v.currentTime;if(!v.paused&&!v.ended)captureFrame(v,now);} captureCallbackId=v.requestVideoFrameCallback(processVideoFrame); }

    let lastTime=0;
    function fallbackLoop() { if(captureState!=='running')return; const v=getVideo();if(!v)return; const now=performance.now();updateStats(v); if(now-lastTime>=(settings.interval*1000)){lastTime=now;if(!v.paused&&!v.ended&&(v.currentTime-lastCaptureTime>=settings.interval||lastCaptureTime===-1)){lastCaptureTime=v.currentTime;captureFrame(v,now);}} }

    function setCaptureState(nS) {
        captureState=nS; const v=getVideo();
        if(nS==='idle'){if(v){if(captureCallbackId&&v.cancelVideoFrameCallback)v.cancelVideoFrameCallback(captureCallbackId);v.removeEventListener('error',vidErrorHandler);v.removeEventListener('abort',vidErrorHandler);v.removeEventListener('stalled',vidStalledHandler);}if(fallbackInterval)clearInterval(fallbackInterval);captureCallbackId=null;fallbackInterval=null;if(statusTxt)statusTxt.innerText=frameCount>0?`[ Stopped. ${frameCount} Frames ]`:'[ Analysis Ready ]';}
        else if(nS==='running'){if(statusTxt)statusTxt.innerText=`[ Ripping @ ${settings.interval}s... ]`;if('requestVideoFrameCallback' in HTMLVideoElement.prototype)captureCallbackId=v.requestVideoFrameCallback(processVideoFrame);else{lastTime=performance.now();fallbackInterval=setInterval(fallbackLoop,50);}}
        else if(nS==='paused'){if(statusTxt)statusTxt.innerText=`[ Paused at ${frameCount} ]`;if(v){if(captureCallbackId&&v.cancelVideoFrameCallback)v.cancelVideoFrameCallback(captureCallbackId);if(fallbackInterval)clearInterval(fallbackInterval);}}
        updateUIState();
    }

    function vidErrorHandler(){if(statusTxt)statusTxt.innerText='[ FATAL: Video Error ]';setCaptureState('idle');}
    function vidStalledHandler(){if(statusTxt)statusTxt.innerText='[ WARN: Stalled ]';}

    function startCapture() {
        if(!isZipAvailable) return alert("Error: JSZip is blocked! Disable AdBlock/VPN.");
        const v=getVideo();if(!v)return alert("Video not found!");if(v.readyState<2)return alert("Video not loaded yet.");
        zip=new JSZip();framesFolder=zip.folder("Frames");framesData=[];sheetBlobs=[];sheetIndex=1;frameCount=0;totalBytes=0;lastCaptureTime=-1;pendingBlobs=0;lastFrameTime=0;currentFps=0;fpsHistory.length=0;captureStartTime=new Date();
        initSheetCanvas();v.addEventListener('error',vidErrorHandler);v.addEventListener('abort',vidErrorHandler);v.addEventListener('stalled',vidStalledHandler);setCaptureState('running');
    }

    function pauseCapture(){setCaptureState('paused');}
    function captureSingleFrame() {
        if(!isZipAvailable) return alert("Error: JSZip is blocked!");
        const v=getVideo();if(!v||v.readyState<2)return alert("Video not ready.");
        if(!zip){zip=new JSZip();framesFolder=zip.folder("Frames");framesData=[];sheetBlobs=[];sheetIndex=1;initSheetCanvas();if(!captureStartTime)captureStartTime=new Date();v.addEventListener('error',vidErrorHandler);v.addEventListener('abort',vidErrorHandler);}
        captureFrame(v,performance.now());if(statusTxt)statusTxt.innerText=`[ Manual: ${frameCount} ]`;
    }

    function waitForPendingBlobs(){return new Promise(r=>{if(pendingBlobs===0)return r();const c=setInterval(()=>{if(pendingBlobs===0){clearInterval(c);r();}},50);});}

    async function downloadZip() {
        if(frameCount===0&&captureState==='idle'){if(statusTxt)statusTxt.innerText='[ No Frames ]';return;}
        if(statusTxt)statusTxt.innerText='[ Finalizing... ]';setCaptureState('idle');await waitForPendingBlobs();if(imgInSheet>0)await saveCurrentSheet();
        if(statusTxt)statusTxt.innerText='[ Structuring... ]';const v=getVideo(),ext=getExt(),rF=zip.folder("Reports"),sF=zip.folder("ContactSheets");
        zip.file("manifest.json",JSON.stringify({"tool":"YT Fr4m3 R1pp3r","version":"5.1","author":"H3l!0s_T3k","browser":navigator.userAgent,"date":new Date().toISOString()},null,2));
        const t=document.querySelector('h1.ytd-video-primary-info-renderer')?document.querySelector('h1.ytd-video-primary-info-renderer').innerText:"Unknown";
        rF.file("report.json",JSON.stringify({"youtube_url":window.location.href,"video_title":t.replace(/[^\x20-\x7E]/g,''),"duration":formatTime(v.duration),"frames_extracted":frameCount,"resolution":`${v.videoWidth}x${v.videoHeight}`,"format":ext.toUpperCase(),"quality":`${Math.round(settings.quality*100)}%`,"engine":('requestVideoFrameCallback' in HTMLVideoElement.prototype)?"rVFC":"Fallback","userAgent":navigator.userAgent,"interval":settings.interval,"start":captureStartTime.toISOString(),"end":new Date().toISOString()},null,2));
        let csv="frame,time,size_bytes\n";framesData.forEach(f=>{csv+=`${f.frame},${f.time},${f.size_bytes}\n`;});rF.file("frames_data.csv",csv);sheetBlobs.forEach(s=>sF.file(s.name,s.blob));
        if(zipProgressBar)zipProgressBar.parentElement.style.display='block';if(statusTxt)statusTxt.innerText='[ Zipping... ]';
        try{const c=await zip.generateAsync({type:"blob",compression:"DEFLATE",compressionOptions:{level:6}},(m)=>{if(zipProgressBar)zipProgressBar.style.width=`${m.percent.toFixed(0)}%`;if(statusTxt)statusTxt.innerText=`[ Zipping: ${m.percent.toFixed(0)}% ]`;});const l=document.createElement("a");l.href=URL.createObjectURL(c);l.download="Analysis_Frames.zip";document.body.appendChild(l);l.click();document.body.removeChild(l);URL.revokeObjectURL(l.href);if(statusTxt)statusTxt.innerText=`[ Done: ${frameCount} | ${formatBytes(c.size)} ]`;zip=null;framesFolder=null;frameCount=0;totalBytes=0;framesData=[];sheetBlobs=[];if(captureProgressBar)captureProgressBar.style.width='0%';if(zipProgressBar){zipProgressBar.style.width='0%';zipProgressBar.parentElement.style.display='none';}}catch(e){if(statusTxt)statusTxt.innerText='[ ZIP Error! ]';console.error(e);}
    }

    function initUI() {
        if(document.getElementById('yt-frame-extractor-ui')) return;

        uiContainer = document.createElement('div');
        uiContainer.id = 'yt-frame-extractor-ui';
        uiContainer.style.cssText = 'position:fixed;z-index:999999;display:flex;flex-direction:column;gap:6px;background:rgba(15,15,15,0.95);padding:12px;border-radius:8px;border:1px solid #333;min-width:280px;color:#ddd;box-shadow:0 4px 15px rgba(0,0,0,0.5);font-family:Segoe UI,system-ui,sans-serif;';
        if (settings.panelPos) {
            uiContainer.style.left = settings.panelPos.x + 'px';
            uiContainer.style.top = settings.panelPos.y + 'px';
            uiContainer.style.right = 'auto';
        } else {
            uiContainer.style.top = '80px';
            uiContainer.style.right = '20px';
        }

        const header = document.createElement('div');
        header.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;border-bottom:1px solid #333;padding-bottom:6px;cursor:grab;user-select:none;';
        header.title = 'اسحب لنقل اللوحة';

        const titleWrap = document.createElement('div');
        titleWrap.style.cssText = 'display:flex;align-items:center;gap:8px;';

        const icon = document.createElement('span');
        icon.innerText = '🎥'; icon.style.fontSize = '18px';

        const titleText = document.createElement('span');
        titleText.style.cssText = 'font-weight:bold;font-size:14px;color:#fff;';
        titleText.innerText = 'YTFR 5.1';

        titleWrap.appendChild(icon); titleWrap.appendChild(titleText);

        collapseBtn = document.createElement('div');
        collapseBtn.innerText = '[-]';
        collapseBtn.style.cssText = 'cursor:pointer;color:#888;font-size:12px;';
        collapseBtn.onclick = () => { const h=uiBody.style.display==='none'; uiBody.style.display=h?'flex':'none'; collapseBtn.innerText=h?'[-]':'[+]'; };

        header.appendChild(titleWrap); header.appendChild(collapseBtn);
        uiContainer.appendChild(header);

        // Drag functionality
        let isDragging = false, dragOffX = 0, dragOffY = 0;
        header.addEventListener('mousedown', (e) => {
            if (e.target === collapseBtn) return;
            isDragging = true;
            header.style.cursor = 'grabbing';
            const rect = uiContainer.getBoundingClientRect();
            dragOffX = e.clientX - rect.left;
            dragOffY = e.clientY - rect.top;
            e.preventDefault();
        });
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            let nx = e.clientX - dragOffX;
            let ny = e.clientY - dragOffY;
            nx = Math.max(0, Math.min(nx, window.innerWidth - uiContainer.offsetWidth));
            ny = Math.max(0, Math.min(ny, window.innerHeight - uiContainer.offsetHeight));
            uiContainer.style.left = nx + 'px';
            uiContainer.style.top = ny + 'px';
            uiContainer.style.right = 'auto';
        });
        document.addEventListener('mouseup', () => {
            if (!isDragging) return;
            isDragging = false;
            header.style.cursor = 'grab';
            settings.panelPos = { x: parseInt(uiContainer.style.left), y: parseInt(uiContainer.style.top) };
            saveSettings();
        });
        // Touch support
        header.addEventListener('touchstart', (e) => {
            if (e.target === collapseBtn) return;
            isDragging = true;
            const t = e.touches[0];
            const rect = uiContainer.getBoundingClientRect();
            dragOffX = t.clientX - rect.left;
            dragOffY = t.clientY - rect.top;
        }, { passive: true });
        document.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            const t = e.touches[0];
            let nx = t.clientX - dragOffX;
            let ny = t.clientY - dragOffY;
            nx = Math.max(0, Math.min(nx, window.innerWidth - uiContainer.offsetWidth));
            ny = Math.max(0, Math.min(ny, window.innerHeight - uiContainer.offsetHeight));
            uiContainer.style.left = nx + 'px';
            uiContainer.style.top = ny + 'px';
            uiContainer.style.right = 'auto';
        }, { passive: true });
        document.addEventListener('touchend', () => {
            if (!isDragging) return;
            isDragging = false;
            settings.panelPos = { x: parseInt(uiContainer.style.left), y: parseInt(uiContainer.style.top) };
            saveSettings();
        });

        uiBody = document.createElement('div');
        uiBody.style.cssText = 'display:flex;flex-direction:column;gap:6px;';

        statsTxt = document.createElement('div');
        statsTxt.style.cssText = 'font-size:10px;color:#0ff;white-space:pre;background:#111;padding:6px;border-radius:4px;min-height:44px;font-family:monospace;';
        statsTxt.innerText = `Res: -- | FPS: --\n00:00:00 / 00:00:00 | Captured: 0\nCache: 0 KB / ${settings.maxRamMB} MB`;
        uiBody.appendChild(statsTxt);

        const cPC = document.createElement('div'); cPC.style.cssText='width:100%;height:6px;background:#222;border-radius:3px;overflow:hidden;';
        captureProgressBar = document.createElement('div'); captureProgressBar.style.cssText='height:100%;width:0%;background:#0f0;border-radius:3px;transition:width 0.3s linear;';
        cPC.appendChild(captureProgressBar); uiBody.appendChild(cPC);

        const zPC = document.createElement('div'); zPC.style.cssText='width:100%;height:6px;background:#1a3300;border-radius:3px;overflow:hidden;display:none;';
        zipProgressBar = document.createElement('div'); zipProgressBar.style.cssText='height:100%;width:0%;background:#88ff00;border-radius:3px;transition:width 0.3s linear;';
        zPC.appendChild(zipProgressBar); uiBody.appendChild(zPC);

        settingsToggle = document.createElement('div');
        settingsToggle.style.cssText = 'font-size:11px;color:#888;cursor:pointer;text-align:center;border:1px dashed #444;padding:3px;border-radius:3px;';
        settingsToggle.innerText = '⚙️ Settings';
        uiBody.appendChild(settingsToggle);

        const sP = document.createElement('div'); sP.id = 'ripper-settings-panel'; sP.style.cssText = 'max-height:0;overflow:hidden;transition:max-height 0.3s ease-out;';
        settingsToggle.onclick = () => { sP.style.maxHeight = sP.style.maxHeight === '0px' || !sP.style.maxHeight ? '200px' : '0px'; };

        const mS = (l,el) => { const r=document.createElement('div'); r.style.cssText='margin:4px 0;display:flex;justify-content:space-between;align-items:center;font-size:11px;'; const s=document.createElement('span'); s.innerText=l; r.appendChild(s); r.appendChild(el); return r; };
        const bSS = 'background:#1a1a1a;color:white;border:1px solid #444;border-radius:3px;padding:3px;font-size:11px;width:100px;';

        intervalSelect = document.createElement('select'); intervalSelect.style.cssText = bSS;
        intervalSelect.add(new Option("0.25s", "0.25", false, settings.interval===0.25));
        intervalSelect.add(new Option("0.5s", "0.5", false, settings.interval===0.5));
        intervalSelect.add(new Option("1.0s", "1", false, settings.interval===1));
        intervalSelect.add(new Option("2.0s", "2", false, settings.interval===2));
        intervalSelect.onchange = () => { settings.interval = parseFloat(intervalSelect.value); saveSettings(); };

        formatSelect = document.createElement('select'); formatSelect.style.cssText = bSS;
        formatSelect.add(new Option("JPEG", "image/jpeg", false, settings.format==='image/jpeg'));
        formatSelect.add(new Option("PNG", "image/png", false, settings.format==='image/png'));
        formatSelect.add(new Option("WebP", "image/webp", false, settings.format==='image/webp'));
        formatSelect.onchange = () => { settings.format = formatSelect.value; saveSettings(); };

        qualitySelect = document.createElement('select'); qualitySelect.style.cssText = bSS;
        qualitySelect.add(new Option("50%", "0.5", false, settings.quality===0.5));
        qualitySelect.add(new Option("70%", "0.7", false, settings.quality===0.7));
        qualitySelect.add(new Option("85%", "0.85", false, settings.quality===0.85));
        qualitySelect.add(new Option("100%", "1", false, settings.quality===1));
        qualitySelect.onchange = () => { settings.quality = parseFloat(qualitySelect.value); saveSettings(); };

        maxRamInput = document.createElement('input'); maxRamInput.type = 'number'; maxRamInput.min = '500'; maxRamInput.step = '100'; maxRamInput.value = settings.maxRamMB; maxRamInput.style.cssText = bSS;
        maxRamInput.onchange = () => { settings.maxRamMB = parseInt(maxRamInput.value) || 1500; saveSettings(); };

        sP.appendChild(mS('Interval:', intervalSelect)); sP.appendChild(mS('Format:', formatSelect)); sP.appendChild(mS('Quality:', qualitySelect)); sP.appendChild(mS('Max RAM:', maxRamInput));
        uiBody.appendChild(sP);

        const bS = 'padding:10px;border:none;border-radius:4px;cursor:pointer;font-weight:bold;width:100%;font-size:13px;';
        startBtn = document.createElement('button'); startBtn.innerText = '▶ START AUTO-RIP'; startBtn.style.cssText = `${bS}background:#cc0000;color:white;`; startBtn.onclick = startCapture;
        pauseBtn = document.createElement('button'); pauseBtn.innerText = '⏸ PAUSE'; pauseBtn.style.cssText = `${bS}background:#e6a800;color:black;display:none;`; pauseBtn.onclick = pauseCapture;
        stopBtn = document.createElement('button'); stopBtn.innerText = '■ STOP & GET ZIP'; stopBtn.style.cssText = `${bS}background:#111;color:#0f0;border:1px solid #0f0;display:none;`; stopBtn.onclick = () => downloadZip();
        manualBtn = document.createElement('button'); manualBtn.innerText = '📷 CAPTURE CURRENT'; manualBtn.style.cssText = 'padding:8px;background:transparent;color:#aaa;border:1px solid #444;border-radius:4px;cursor:pointer;font-size:11px;width:100%;'; manualBtn.onclick = captureSingleFrame;

        uiBody.appendChild(startBtn); uiBody.appendChild(pauseBtn); uiBody.appendChild(stopBtn); uiBody.appendChild(manualBtn);

        statusTxt = document.createElement('div');
        statusTxt.style.cssText = 'font-size:11px;text-align:center;border-top:1px solid #333;padding-top:6px;font-family:monospace;';

        if (!isZipAvailable) {
            statusTxt.style.color = '#ff4444';
            statusTxt.innerText = '[ ERROR: JSZip Blocked! ]\nDisable AdBlock/Brave Shields';
            startBtn.disabled = true; startBtn.style.background = '#555';
            manualBtn.disabled = true; manualBtn.style.opacity = '0.5';
        } else {
            statusTxt.style.color = '#0f0';
            statusTxt.innerText = '[ 100% Capture Mode ]';
        }

        uiBody.appendChild(statusTxt);

        const gL = document.createElement('a'); gL.href = 'https://github.com/Ismail-Benali'; gL.target = '_blank'; gL.innerText = 'H3l!0s_T3k';
        gL.style.cssText = 'color:#555;font-size:9px;text-decoration:none;text-align:center;';
        uiBody.appendChild(gL);

        uiContainer.appendChild(uiBody);
        document.body.appendChild(uiContainer);
        updateUIState();
    }

    function handleNavigation() {
        if(captureState!=='idle')setCaptureState('idle');zip=null;framesFolder=null;framesData=[];sheetBlobs=[];frameCount=0;totalBytes=0;captureStartTime=null;
        if(statsTxt)statsTxt.innerText=`Res: -- | FPS: --\n00:00:00 / 00:00:00 | Captured: 0\nCache: 0 KB / ${settings.maxRamMB} MB`;
        if(captureProgressBar)captureProgressBar.style.width='0%';if(zipProgressBar){zipProgressBar.style.width='0%';zipProgressBar.parentElement.style.display='none';}
        if(statusTxt && isZipAvailable) statusTxt.innerText='[ 100% Capture Mode ]';
    }

    if(document.body) { initUI(); document.addEventListener('yt-navigate-finish', handleNavigation); }
    else { window.addEventListener('DOMContentLoaded', () => { initUI(); document.addEventListener('yt-navigate-finish', handleNavigation); }); }
})();
