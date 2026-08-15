/* eslint-disable react-hooks/purity */
"use client";
import { useEffect,useMemo,useState } from "react";
import { RubyText as R } from "@/components/RubyText";
import { QuestionInput } from "@/features/questions/QuestionInput";
import { generateMockExam } from "@/lib/learning-engine";
import { isAnswerCorrect } from "@/lib/question-engine";
import { clearMockExamResume,loadMockExamResume,saveMockExamResume } from "@/lib/storage";
import type { AnswerValue,MockExamResume,Question } from "@/domain/models";

const ranks=[
  {id:"vega",name:"ベガ",grade:4,stars:1,subtitle:"入門(にゅうもん)"},
  {id:"altair",name:"アルタイル",grade:3,stars:2,subtitle:"基礎(きそ)"},
  {id:"sirius",name:"シリウス",grade:2,stars:3,subtitle:"中級(ちゅうきゅう)"},
  {id:"polaris",name:"ポラリス",grade:1,stars:4,subtitle:"上級(じょうきゅう)"},
] as const;
type Rank=(typeof ranks)[number];
type Screen="ranks"|"start"|"exam"|"result";

export function MockExam({questions,onAnswer}:{questions:Question[];onAnswer:(q:Question,a:AnswerValue,ok:boolean)=>void}){
  const [screen,setScreen]=useState<Screen>("ranks"),[selected,setSelected]=useState<Rank|null>(null),[mission,setMission]=useState<Question[]>([]),[index,setIndex]=useState(0),[correct,setCorrect]=useState(0),[startedAt,setStartedAt]=useState(0),[response,setResponse]=useState<AnswerValue|null>(null),[misses,setMisses]=useState<Record<string,number>>({}),[resumes,setResumes]=useState<Partial<Record<Rank["id"],MockExamResume>>>({});
  useEffect(()=>{Promise.all(ranks.map(async rank=>[rank.id,await loadMockExamResume(rank.id)] as const)).then(entries=>setResumes(Object.fromEntries(entries.filter((entry):entry is readonly [Rank["id"],MockExamResume]=>entry[1]!==null))))},[]);
  const score=mission.length?Math.round(correct/mission.length*100):0;
  const weak=useMemo(()=>Object.entries(misses).sort((a,b)=>b[1]-a[1])[0]?.[0],[misses]);
  const selectRank=(rank:Rank)=>{setSelected(rank);setScreen("start")};
  const startFresh=async()=>{if(!selected)return;await clearMockExamResume(selected.id);const next=generateMockExam(questions,selected.grade,20);setResumes(v=>({...v,[selected.id]:undefined}));setMission(next);setIndex(0);setCorrect(0);setResponse(null);setMisses({});setStartedAt(Date.now());setScreen("exam")};
  const continueSaved=()=>{if(!selected)return;const saved=resumes[selected.id];if(!saved)return;const byId=new Map(questions.map(q=>[q.id,q])),restored=saved.questionIds.map(id=>byId.get(id)).filter((q):q is Question=>!!q);if(restored.length!==saved.questionIds.length){startFresh();return}setMission(restored);setIndex(Math.min(saved.index,restored.length-1));setCorrect(saved.correct);setMisses(saved.misses);setStartedAt(saved.startedAt);setResponse(null);setScreen("exam")};
  const persist=(nextIndex=index,nextCorrect=correct,nextMisses=misses)=>{if(!selected||!mission.length)return;const saved:MockExamResume={rankId:selected.id,questionIds:mission.map(q=>q.id),index:nextIndex,correct:nextCorrect,misses:nextMisses,startedAt,savedAt:new Date().toISOString()};setResumes(v=>({...v,[selected.id]:saved}));saveMockExamResume(saved)};
  const pause=()=>{persist();setResponse(null);setScreen("ranks")};
  const finish=()=>{if(selected){clearMockExamResume(selected.id);setResumes(v=>({...v,[selected.id]:undefined}))}setScreen("result")};

  if(screen==="ranks")return <div className="certification-hub"><small>STAR RANK CERTIFICATION</small><R as="h1" text="挑戦(ちょうせん)する模試(もし)を選(えら)ぶ"/><R as="p" text="どの星級(せいきゅう)も最初(さいしょ)から挑戦(ちょうせん)できます。"/><div className="rank-selector">{ranks.map(rank=><button key={rank.id} onClick={()=>selectRank(rank)}><b>{"★".repeat(rank.stars)}{"☆".repeat(5-rank.stars)}</b><strong>{rank.name}</strong><R as="small" text={rank.subtitle}/>{resumes[rank.id]&&<R as="small" text={`${resumes[rank.id]!.index+1}/20から続(つづ)きあり`}/>}</button>)}</div></div>;
  if(screen==="start"&&selected){const saved=resumes[selected.id];return <div className="certification-hub"><small>{"★".repeat(selected.stars)}{"☆".repeat(5-selected.stars)}</small><R as="h1" text={`${selected.name}模試(もし)`}/><R as="p" text="同(おな)じ級(きゅう)の問題(もんだい)からランダム20問(もん)を出題(しゅつだい)します。"/><button className="primary" onClick={startFresh}><R text="はじめから"/><b>🚀</b></button>{saved&&<button className="primary" onClick={continueSaved}><R text={`${saved.index+1}問目(もんめ)から つづきから`}/><b>→</b></button>}<button onClick={()=>setScreen("ranks")}><R text="模試一覧(もし・いちらん)にもどる"/></button></div>}
  if(screen==="result"&&selected)return <div className="mock-result"><div className="test-ring"><strong>{score}%</strong><R text="調査達成率(ちょうさたっせいりつ)"/></div><R as="h1" text={`${selected.name}検定報告(けんていほうこく)`}/><div className="exam-analysis"><span><R text="所要時間(しょようじかん)"/><b>{Math.max(1,Math.round((Date.now()-startedAt)/60000))}<R text="分(ふん)"/></b></span><span><R text="任務達成基準(にんむたっせいきじゅん)"/><b>80%</b></span><span><R text="判定(はんてい)"/><b><R text={score>=80?"調査完了(ちょうさかんりょう)":"再調査(さいちょうさ)"}/></b></span></div><R as="p" text={weak?`おすすめ再調査(さいちょうさ)Topic：${weak}`:"すべての分野(ぶんや)をよく調査(ちょうさ)できています。"}/><button className="primary" onClick={()=>setScreen("start")}><R text="もう一度(いちど)挑戦(ちょうせん)する"/><b>↻</b></button><button onClick={()=>setScreen("ranks")}><R text="模試一覧(もし・いちらん)にもどる"/></button></div>;
  const q=mission[index];if(!q||!selected)return <R text="調査問題(ちょうさもんだい)を準備中(じゅんびちゅう)です。"/>;
  return <div className="quiz-view"><div className="lesson-progress"><span><i style={{width:`${(index+1)/mission.length*100}%`}}/></span><b>{index+1}/{mission.length}</b></div>{response===null&&<button onClick={pause}><R text="途中(とちゅう)でやめる"/><b>Ⅱ</b></button>}<div className="quiz-tag">🚀 {selected.name.toUpperCase()} TEST ・ {q.category}</div><R as="h1" text={q.prompt}/><QuestionInput key={q.id} question={q} disabled={response!==null} onSubmit={a=>{const ok=isAnswerCorrect(q,a),nextMisses=ok?misses:{...misses,[q.category]:(misses[q.category]??0)+1},nextCorrect=correct+(ok?1:0);setResponse(a);setCorrect(nextCorrect);setMisses(nextMisses);onAnswer(q,a,ok)}}/>{response!==null&&<button className="primary" onClick={()=>{if(index+1>=mission.length)finish();else{const next=index+1;persist(next,correct,misses);setIndex(next);setResponse(null)}}}><R text={index+1>=mission.length?"調査報告(ちょうさほうこく)を見(み)る":"次(つぎ)の問題(もんだい)へ"}/><b>→</b></button>}</div>;
}
