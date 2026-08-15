/* eslint-disable react-hooks/purity */
"use client";
import { useMemo,useState } from "react";
import { RubyText as R } from "@/components/RubyText";
import { QuestionInput } from "@/features/questions/QuestionInput";
import { generateMockExam } from "@/lib/learning-engine";
import { isAnswerCorrect } from "@/lib/question-engine";
import type { AnswerValue,Question } from "@/domain/models";

const ranks=[
  {id:"vega",name:"ベガ",grade:4,stars:1},
  {id:"altair",name:"アルタイル",grade:3,stars:2},
  {id:"sirius",name:"シリウス",grade:2,stars:3},
  {id:"polaris",name:"ポラリス",grade:1,stars:4},
] as const;

export function MockExam({questions,onAnswer}:{questions:Question[];onAnswer:(q:Question,a:AnswerValue,ok:boolean)=>void}){
  const [selected,setSelected]=useState<(typeof ranks)[number]>(ranks[0]);
  const [attempt,setAttempt]=useState(0),[started,setStarted]=useState(false),[done,setDone]=useState(false),[index,setIndex]=useState(0),[correct,setCorrect]=useState(0),[startedAt,setStartedAt]=useState(0),[response,setResponse]=useState<AnswerValue|null>(null),[misses,setMisses]=useState<Record<string,number>>({});
  const mission=useMemo(()=>{void attempt;return generateMockExam(questions,selected.grade,20)},[questions,selected,attempt]);
  const begin=()=>{setAttempt(v=>v+1);setStarted(true);setDone(false);setIndex(0);setCorrect(0);setResponse(null);setMisses({});setStartedAt(Date.now())};
  if(!started)return <div className="certification-hub"><small>STAR RANK CERTIFICATION</small><R as="h1" text="星級検定(せいきゅうけんてい)に挑戦(ちょうせん)"/><R as="p" text="地球編(ちきゅうへん)の進行(しんこう)に関係(かんけい)なく、どの検定(けんてい)にも最初(さいしょ)から挑戦(ちょうせん)できます。"/><div className="rank-selector">{ranks.map(rank=><button key={rank.id} className={selected.id===rank.id?"active":""} onClick={()=>setSelected(rank)}><b>{"⭐".repeat(rank.stars)}</b><strong>{rank.name}</strong><small>{rank.grade}級(きゅう)</small></button>)}</div><button className="primary" onClick={begin}><R text={`${selected.name}検定(けんてい)・ランダム${mission.length}問(もん)を開始(かいし)`}/><b>🚀</b></button><R as="small" text="挑戦(ちょうせん)するたびに、同(おな)じ級(きゅう)の問題(もんだい)からランダムに出題(しゅつだい)します。"/></div>;
  if(done){const score=mission.length?Math.round(correct/mission.length*100):0;const weak=Object.entries(misses).sort((a,b)=>b[1]-a[1])[0]?.[0];return <div className="mock-result"><div className="test-ring"><strong>{score}%</strong><R text="調査達成率(ちょうさたっせいりつ)"/></div><R as="h1" text={`${selected.name}検定報告(けんていほうこく)`}/><div className="exam-analysis"><span><R text="所要時間(しょようじかん)"/><b>{Math.max(1,Math.round((Date.now()-startedAt)/60000))}<R text="分(ふん)"/></b></span><span><R text="任務達成基準(にんむたっせいきじゅん)"/><b>80%</b></span><span><R text="判定(はんてい)"/><b><R text={score>=80?"調査完了(ちょうさかんりょう)":"再調査(さいちょうさ)"}/></b></span></div><R as="p" text={weak?`おすすめ再調査(さいちょうさ)Topic：${weak}`:"すべての分野(ぶんや)をよく調査(ちょうさ)できています。"}/><button className="primary" onClick={begin}><R text="同(おな)じ検定(けんてい)にもう一度(いちど)挑戦(ちょうせん)する"/><b>↻</b></button><button onClick={()=>setStarted(false)}><R text="別(べつ)の検定(けんてい)を選(えら)ぶ"/></button></div>}
  const q=mission[index];if(!q)return <R text="調査問題(ちょうさもんだい)を準備中(じゅんびちゅう)です。"/>;
  return <div className="quiz-view"><div className="lesson-progress"><span><i style={{width:`${(index+1)/mission.length*100}%`}}/></span><b>{index+1}/{mission.length}</b></div><div className="quiz-tag">🚀 {selected.name.toUpperCase()} TEST ・ {q.category}</div><R as="h1" text={q.prompt}/><QuestionInput key={q.id} question={q} disabled={response!==null} onSubmit={a=>{const ok=isAnswerCorrect(q,a);setResponse(a);if(ok)setCorrect(v=>v+1);else setMisses(v=>({...v,[q.category]:(v[q.category]??0)+1}));onAnswer(q,a,ok)}}/>{response!==null&&<button className="primary" onClick={()=>{if(index+1>=mission.length)setDone(true);else{setIndex(v=>v+1);setResponse(null)}}}><R text={index+1>=mission.length?"調査報告(ちょうさほうこく)を見(み)る":"次(つぎ)の調査地点(ちょうさちてん)へ"}/><b>→</b></button>}</div>;
}
