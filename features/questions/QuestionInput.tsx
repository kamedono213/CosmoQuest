"use client";
import { useState } from "react";
import { RubyText as R } from "@/components/RubyText";
import type { AnswerValue, Question } from "@/domain/models";

export function QuestionInput({question,disabled,onSubmit}:{question:Question;disabled:boolean;onSubmit:(answer:AnswerValue)=>void}){
  const [choice,setChoice]=useState<number|null>(null);const [ordered,setOrdered]=useState<string[]>([]);const options=question.options??[];
  if(question.type==="ordering")return <div className="ordering-input"><div className="order-slots">{ordered.length?<>{ordered.map((x,i)=><button key={x} onClick={()=>setOrdered(v=>v.filter(y=>y!==x))}><b>{i+1}</b><R text={x}/></button>)}</>:<R text="短(みじか)い順(じゅん)に選(えら)んでください"/>}</div><div className="choices">{options.filter(x=>!ordered.includes(x)).map((x,i)=><button key={x} disabled={disabled} onClick={()=>setOrdered(v=>[...v,x])}><span>{i+1}</span><R as="strong" text={x}/></button>)}</div><button className="primary" disabled={disabled||ordered.length!==options.length} onClick={()=>onSubmit(ordered)}><R text="この順番(じゅんばん)で答(こた)える"/><b>✓</b></button></div>;
  if(question.type==="matching"&&question.pairs){const response=Object.fromEntries(question.pairs.map(p=>[p.left,p.right]));return <div className="matching-input">{question.pairs.map(p=><div key={p.left}><R text={p.left}/><span>↔</span><R text={p.right}/></div>)}<button className="primary" disabled={disabled} onClick={()=>onSubmit(response)}><R text="組(く)み合(あ)わせを決定(けってい)"/><b>✓</b></button></div>}
  return <div className="choices">{options.map((option,i)=><button key={option} disabled={disabled} onClick={()=>{setChoice(i);onSubmit(i)}} className={choice===i?"selected":""}><span>{String.fromCharCode(65+i)}</span><R as="strong" text={option}/></button>)}</div>
}
