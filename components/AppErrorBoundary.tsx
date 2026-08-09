"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

export class AppErrorBoundary extends Component<{children:ReactNode},{failed:boolean}> {
  state={failed:false};
  static getDerivedStateFromError(){return{failed:true}}
  componentDidCatch(error:Error,info:ErrorInfo){console.error("Cosmo Quest recovered from an error",error,info.componentStack)}
  render(){if(this.state.failed)return <main className="app-shell"><section className="pwa-fatal" role="alert"><img src="/icons/icon-192.png" alt=""/><h1>航路を復旧しています</h1><p>セーブデータは保護されています。画面を再読み込みしてください。</p><button onClick={()=>location.reload()}>再読み込み</button></section></main>;return this.props.children}
}
