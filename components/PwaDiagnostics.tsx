"use client";

import { useEffect, useState } from "react";
import { APP_VERSION, PWA_VERSION } from "@/components/PwaLifecycle";

type Diagnostics={online:boolean;worker:string;cache:string};

export function PwaDiagnostics({saveVersion}:{saveVersion:number}){
  const[data,setData]=useState<Diagnostics>({online:true,worker:"確認中",cache:"計算中"});
  useEffect(()=>{
    let active=true;
    const refresh=async()=>{
      let bytes=0;
      if("caches" in window)for(const name of await caches.keys().catch(()=>[])){const cache=await caches.open(name);for(const request of await cache.keys()){const response=await cache.match(request);const size=Number(response?.headers.get("content-length"));if(Number.isFinite(size))bytes+=size}}
      const registration=await navigator.serviceWorker?.getRegistration();
      if(active)setData({online:navigator.onLine,worker:registration?.active?.state??(registration?"待機中":"未登録"),cache:bytes?`${(bytes/1024/1024).toFixed(1)} MB`:"使用中"});
    };
    refresh().catch(()=>active&&setData(v=>({...v,online:navigator.onLine,worker:"取得できません",cache:"取得できません"})));
    addEventListener("online",refresh);addEventListener("offline",refresh);
    return()=>{active=false;removeEventListener("online",refresh);removeEventListener("offline",refresh)};
  },[]);
  return <section className="settings-diagnostics" aria-labelledby="development-info"><h2 id="development-info">開発情報</h2><dl><dt>アプリVersion</dt><dd>{APP_VERSION}</dd><dt>SaveVersion</dt><dd>{saveVersion}</dd><dt>PWA Version</dt><dd>{PWA_VERSION}</dd><dt>Service Worker状態</dt><dd>{data.worker}</dd><dt>キャッシュ容量</dt><dd>{data.cache}</dd><dt>オンライン状態</dt><dd className={data.online?"online":"offline"}>{data.online?"オンライン":"オフライン"}</dd></dl></section>;
}
