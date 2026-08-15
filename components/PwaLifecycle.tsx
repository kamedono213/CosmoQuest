"use client";

import { useEffect, useState } from "react";

export const APP_VERSION=process.env.NEXT_PUBLIC_APP_VERSION??"0.1.0";
export const PWA_VERSION=process.env.NEXT_PUBLIC_PWA_VERSION??"cosmo-quest-v11";
const GUIDE_KEY="cosmo-quest-install-guide-hidden";
const UPDATE_INTERVAL=60*60*1000;

function isStandalone(){return window.matchMedia("(display-mode: standalone)").matches||("standalone" in navigator&&(navigator as Navigator&{standalone?:boolean}).standalone===true)}

export function PwaLifecycle(){
  const[online,setOnline]=useState(()=>typeof navigator==="undefined"||navigator.onLine);
  const[reconnected,setReconnected]=useState(false);
  const[guide,setGuide]=useState(false);
  const[dontShow,setDontShow]=useState(false);
  const[waiting,setWaiting]=useState<ServiceWorker|null>(null);

  useEffect(()=>{
    const bootTimer=setTimeout(()=>document.getElementById("launch-screen")?.remove(),2000);
    queueMicrotask(()=>{if(!isStandalone()&&localStorage.getItem(GUIDE_KEY)!=="1"&&sessionStorage.getItem(`${GUIDE_KEY}-session`)!=="1")setGuide(true)});
    const wentOffline=()=>setOnline(false);
    const wentOnline=()=>{setOnline(true);setReconnected(true);navigator.serviceWorker?.ready.then(r=>r.update()).catch(()=>undefined);setTimeout(()=>setReconnected(false),2600)};
    addEventListener("offline",wentOffline);addEventListener("online",wentOnline);

    let refresh=false;let interval:ReturnType<typeof setInterval>|undefined;
    const controllerChanged=()=>{if(refresh)return;refresh=true;location.reload()};
    navigator.serviceWorker?.addEventListener("controllerchange",controllerChanged);
    if("serviceWorker" in navigator)navigator.serviceWorker.register("/sw.js",{scope:"/",updateViaCache:"none"}).then(reg=>{
      if(reg.waiting)reg.waiting.postMessage({type:"SKIP_WAITING"});
      reg.addEventListener("updatefound",()=>{const worker=reg.installing;worker?.addEventListener("statechange",()=>{if(worker.state==="installed"&&navigator.serviceWorker.controller)setWaiting(worker)})});
      reg.update().catch(()=>undefined);
      interval=setInterval(()=>reg.update().catch(()=>undefined),UPDATE_INTERVAL);
    }).catch(()=>undefined);
    const orientation=screen.orientation as ScreenOrientation&{lock?:(value:"portrait")=>Promise<void>};
    if(isStandalone())orientation.lock?.("portrait").catch(()=>undefined);
    return()=>{clearTimeout(bootTimer);if(interval)clearInterval(interval);removeEventListener("offline",wentOffline);removeEventListener("online",wentOnline);navigator.serviceWorker?.removeEventListener("controllerchange",controllerChanged)};
  },[]);

  const closeGuide=()=>{sessionStorage.setItem(`${GUIDE_KEY}-session`,"1");if(dontShow)localStorage.setItem(GUIDE_KEY,"1");setGuide(false)};
  const updateNow=()=>{waiting?.postMessage({type:"SKIP_WAITING"})};

  return <>
    {!online&&<div className="offline-banner" role="status"><b>オフラインモード</b><span>保存済みTopic・図鑑・問題は遊べます</span></div>}
    {reconnected&&<div className="sync-toast" role="status">オンラインに復帰しました・セーブを同期済み</div>}
    {guide&&<div className="pwa-modal-backdrop" role="presentation"><section className="pwa-modal install-guide" role="dialog" aria-modal="true" aria-labelledby="install-title"><img src="/icons/icon-192.png" alt="Cosmo Questアプリアイコン"/><h2 id="install-title">ホーム画面へ追加しよう！</h2><p>ホーム画面へ追加すると、普通のアプリのように遊べます。</p><div className="install-platforms"><article><b>iPhone / iPad</b><div className="install-picture" aria-label="共有ボタンからホーム画面に追加">① <span>□<i>↑</i></span> 共有ボタン<br/>② <strong>＋</strong> ホーム画面に追加</div></article><article><b>Android</b><div className="install-picture" aria-label="メニューからアプリをインストール">① <span>⋮</span> メニュー<br/>② <strong>⬇</strong> アプリをインストール</div></article></div><label className="guide-check"><input type="checkbox" checked={dontShow} onChange={e=>setDontShow(e.target.checked)}/> 次回から表示しない</label><button className="pwa-primary" onClick={closeGuide}>わかった</button></section></div>}
    {waiting&&!guide&&<div className="pwa-modal-backdrop"><section className="pwa-modal update-dialog" role="alertdialog" aria-modal="true" aria-labelledby="update-title"><span className="update-orbit" aria-hidden="true">✦</span><h2 id="update-title">新しいバージョンがあります</h2><p>最新のコンテンツが利用できます。</p><div><button className="pwa-primary" onClick={updateNow}>今すぐ更新</button><button className="pwa-secondary" onClick={()=>setWaiting(null)}>あとで</button></div></section></div>}
  </>;
}
