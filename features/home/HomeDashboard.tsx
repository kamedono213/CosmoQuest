"use client";
/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */

import { useState } from "react";
import { RubyText as R } from "@/components/RubyText";
import { dailyMissionTemplates, homeFeed } from "@/data/home-dashboard";
import type { GalleryItem, LearningResume, Stage, UserData } from "@/domain/models";
import { getLevel, getShipRank } from "@/lib/progression";

type Popup = "discoveries" | "rewards" | "records" | null;
type Props = { user:UserData; stages:Stage[]; gallery:GalleryItem[]; resume:LearningResume|null; onContinue:()=>void; onLibrary:()=>void; onRecords:()=>void; onHangar:()=>void };

const isToday = (value:string) => new Date(value).toDateString() === new Date().toDateString();
const stripReading = (value:string) => value.replace(/\([^)]*\)/g, "");

export function HomeDashboard({user,stages,gallery,resume,onContinue,onLibrary,onRecords,onHangar}:Props) {
  const [popup,setPopup]=useState<Popup>(null);
  const today=user.questionHistory.filter(x=>isToday(x.answeredAt));
  const correct=today.filter(x=>x.correct).length;
  const minutes=Math.round((today.reduce((sum,x)=>sum+x.elapsedSeconds,0)+user.learningHistory.filter(x=>isToday(x.completedAt)).reduce((sum,x)=>sum+x.elapsedSeconds,0))/60);
  const level=getLevel(user.progress.xp);
  const current=stages.find(x=>x.id===user.progress.currentStageId)??stages[0];
  const next=stages.find(x=>x.order===current.order+1)??current;
  const found=gallery.filter(x=>user.progress.galleryIds.includes(x.id)).slice(-3).reverse();
  const target=10, progress=Math.min(100,(today.length/target)*100);
  const metrics={correct,answered:today.length,gallery:user.progress.galleryIds.length};
  const notifications=[
    {id:"discoveries" as const,icon:"📖",count:found.length,label:"発見記録"},
    {id:"rewards" as const,icon:"🎁",count:user.game.lastReward?1:0,label:"報酬"},
    {id:"records" as const,icon:"🔔",count:user.achievements.length,label:"実績"},
  ];
  return <section className="cq-home" aria-label="今日のミッション">
    <div className="home-quickbar">
      <button className="compact-ship" onClick={onHangar} data-sound="nav" aria-label="宇宙船と基地を開く"><span className="mini-ship" aria-hidden="true">◆</span><div><small>LV.{level} · {getShipRank(level)}</small><strong>{user.progress.xp.toLocaleString()} XP</strong></div><i/><div><small>次の目的地</small><strong>{stripReading(next.name)}</strong></div><b>›</b></button>
      <div className="home-notifications" aria-label="通知">{notifications.map(item=><button key={item.id} className={item.count?"has-new":""} onClick={()=>setPopup(item.id)} data-sound="notice" aria-label={`${item.label} ${item.count}件`}><span>{item.icon}</span>{item.count>0&&<b>{item.count}</b>}</button>)}</div>
    </div>
    <button className="continue-mission" onClick={onContinue} data-sound="start"><span className="launch-symbol" aria-hidden="true">▶</span><div><small>{resume?"MISSION RESUME":"TODAY'S MISSION"}</small><R as="strong" text={resume?"続(つづ)きから":"今(いま)すぐ学(まな)ぶ"}/><R as="span" text={resume?`${stages.find(x=>x.id===resume.stageId)?.name??"前回の学習"}・${resume.quizIndex+1}問目(もんめ)`:current.name}/></div><b>出発 →</b></button>
    <article className="today-progress"><header><div><small>TODAY</small><R as="strong" text="今日(きょう)の進捗(しんちょく)"/></div><b>{today.length} / {target}<small>問</small></b></header><div className="today-meter" aria-label={`${today.length}問中${target}問`}><i style={{width:`${progress}%`}}/></div><div className="today-stats"><span><b>{minutes}</b><small>学習 分</small></span><span><b>{correct}</b><small>正解</small></span><span><b>{user.statistics.streak}</b><small>連続 日</small></span></div></article>
    <div className="home-folds">
      <details><summary><span>🎯</span><strong>今日のミッション（3件）</strong><b>{dailyMissionTemplates.filter(m=>metrics[m.metric]>=m.target).length}/3</b></summary><div className="mission-mini-list">{dailyMissionTemplates.map(m=>{const now=metrics[m.metric];return <div key={m.id} className={now>=m.target?"done":""}><span>{now>=m.target?"✓":"○"}</span><strong>{m.label}</strong><small>{Math.min(now,m.target)} / {m.target}</small></div>})}</div></details>
      {homeFeed.map(feed=><details key={feed.id}><summary><span>{feed.icon}</span><strong>{feed.label}</strong><b>›</b></summary>{feed.items.map(item=><p key={item}>{item}</p>)}</details>)}
    </div>
    {popup&&<div className="home-modal-backdrop" role="presentation" onClick={()=>setPopup(null)}><section className="home-modal" role="dialog" aria-modal="true" aria-labelledby="home-modal-title" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setPopup(null)} aria-label="閉じる">×</button>{popup==="discoveries"&&<><h2 id="home-modal-title">📖 発見記録</h2>{found.length?found.map(item=><div className="popup-item" key={item.id}><span>{item.icon}</span><strong>{stripReading(item.title)}</strong></div>):<p>学習を進めると、新しい発見がここに届きます。</p>}<button className="modal-action" onClick={onLibrary}>図鑑を見る →</button></>}{popup==="rewards"&&<><h2 id="home-modal-title">🎁 報酬ボックス</h2><div className="popup-item"><span>✦</span><strong>{user.game.lastReward?.label??"新しい報酬はありません"}</strong></div><button className="modal-action" onClick={onHangar}>宇宙船・基地を見る →</button></>}{popup==="records"&&<><h2 id="home-modal-title">🔔 実績と称号</h2><p>解除した実績：{user.achievements.length}件</p><p>連続学習：{user.statistics.streak}日</p><button className="modal-action" onClick={onRecords}>記録を見る →</button></>}</section></div>}
  </section>;
}
