import type { AnswerValue, Question } from "@/domain/models";
const normalize=(value:AnswerValue):string=>typeof value==="object"?JSON.stringify(value):String(value);
export function isAnswerCorrect(question:Question,response:AnswerValue){
  if(Array.isArray(question.correct)&&Array.isArray(response))return question.correct.length===response.length&&question.correct.every((v,i)=>normalize(v)===normalize(response[i]));
  if(typeof question.correct==="object"&&!Array.isArray(question.correct)&&typeof response==="object"&&!Array.isArray(response))return JSON.stringify(question.correct)===JSON.stringify(response);
  return normalize(question.correct)===normalize(response);
}
export function makeReview(questionId:string,correct:boolean,previous?:{intervalDays:number;ease:number}){const now=new Date();const base=previous?.intervalDays??1;const ease=Math.max(0,Math.min(5,(previous?.ease??2)+(correct?1:-2)));const days=correct?Math.min(30,Math.max(3,Math.round(base*(1.5+ease*.25)))):1;now.setDate(now.getDate()+days);return{questionId,dueAt:now.toISOString(),intervalDays:days,ease}}
export function questionScore(correct:number,total:number){return total?Math.round(correct/total*100):0}
const ambiguousPrompt=/まとめ|総復習|復習問題|章末/;
const placeholderChoice=/このTopicとは関係|観測\(かんそく\)で否定|正反対\(せいはんたい\)の説明/;
export function isExamEligibleQuestion(question:Question){
  const options=question.options??[];
  return !ambiguousPrompt.test(question.prompt)&&!options.some(option=>placeholderChoice.test(option))&&new Set(options).size===options.length;
}
