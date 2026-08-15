import type { Stage, StageProgress } from "@/domain/models";
export const emptyStageProgress:StageProgress={lessonRead:false,answeredQuestionIds:[],correctQuestionIds:[],mainScore:0,miniTestPassed:false,miniTestScore:0};
export function updateMainProgress(previous:StageProgress|undefined,questionId:string,correct:boolean,total:number){const p=previous??emptyStageProgress;const answered=Array.from(new Set([...p.answeredQuestionIds,questionId]));const hits=correct?Array.from(new Set([...p.correctQuestionIds,questionId])):p.correctQuestionIds.filter(id=>id!==questionId);return{...p,answeredQuestionIds:answered,correctQuestionIds:hits,mainScore:total?Math.round(hits.length/total*100):0}}
export function stageCompletionRate(progress:StageProgress|undefined,totalQuestions:number){const p=progress??emptyStageProgress;const lesson=p.lessonRead?20:0;const questions=totalQuestions?Math.min(80,Math.round(p.answeredQuestionIds.length/totalQuestions*80)):0;return lesson+questions}
export function canClearStage(progress:StageProgress|undefined){const p=progress??emptyStageProgress;return p.lessonRead&&p.mainScore>=60}
export function starsForScore(mainScore:number,miniScore:number){const average=(mainScore+miniScore)/2;return average>=95?3:average>=85?2:1}
export function nextStage(current:Stage,stages:Stage[]){return [...stages].sort((a,b)=>a.order-b.order).find(s=>s.order>current.order)}
