import { achievements, stages } from "@/data/catalog";
import type { StageStatus, UserData } from "@/domain/models";
import { levelFromXp, playerTitle, shipClass } from "@/lib/game-engine";

export const getLevel=levelFromXp;
export const getTitle=playerTitle;
export const getShipRank=shipClass;
export function getStageStatus(stageId:string,user:UserData,list=stages):StageStatus{const stage=list.find(s=>s.id===stageId);if(!stage)return"locked";if(user.progress.completedStageIds.includes(stageId))return"completed";return(stage.prerequisiteStageIds??[]).every(id=>user.progress.completedStageIds.includes(id))?"available":"locked"}
export function galleryRate(user:UserData){return Math.round(user.progress.galleryIds.length/stages.length*100)}
export function earnedAchievements(user:UserData){const values={answered:user.statistics.answered,correct:user.statistics.correct,completedStages:user.progress.completedStageIds.length,galleryRate:galleryRate(user)};return achievements.filter(a=>values[a.condition.metric]>=a.condition.threshold).map(a=>a.id)}
