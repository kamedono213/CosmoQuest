import { artifacts, baseNames, shipLevels, titles } from "@/data/game-system";
import type { GameState, UserData } from "@/domain/models";
export const defaultGame:GameState={coins:300,shipId:"capsule",shipColor:"#79ddff",engineId:"plasma",unlockedShipIds:["capsule"],artifactIds:[],ownedItemIds:[],suitId:"classic",loginDays:1,lastLoginDate:new Date().toISOString().slice(0,10),claimedDailyIds:[],claimedWeeklyIds:[],lastReward:{kind:"xp",label:"初回ログイン +50 XP"}};
export const levelFromXp=(xp:number)=>Math.min(100,Math.floor(Math.sqrt(Math.max(0,xp)/20))+1);
export const shipClass=(level:number)=>[...shipLevels].reverse().find(([n])=>level>=n)?.[1]??shipLevels[0][1];
export const playerTitle=(level:number)=>[...titles].reverse().find(([n])=>level>=n)?.[1]??titles[0][1];
export const baseLevel=(user:UserData)=>Math.min(10,1+Math.floor((user.progress.completedStageIds.length+Object.keys(user.topicProgress).length)/12));
export const baseName=(user:UserData)=>baseNames[baseLevel(user)]??baseNames.at(-1)!;
export const artifactFor=(seed:string,owned:string[])=>{const n=Array.from(seed).reduce((a,c)=>a+c.charCodeAt(0),0);return artifacts.find((_,i)=>i>=n%artifacts.length&&!owned.includes(artifacts[i].id))??artifacts.find(a=>!owned.includes(a.id));};
export function dailyProgress(user:UserData){return[{id:"login",label:"ログイン",now:1,target:1,reward:50},{id:"questions",label:"問題に20問挑戦",now:user.statistics.answered%20,target:20,reward:200},{id:"topics",label:"Topicを2個調査",now:Object.keys(user.topicProgress).length%2,target:2,reward:200},{id:"gallery",label:"図鑑を5件登録",now:user.progress.galleryIds.length%5,target:5,reward:150}]}
export function weeklyProgress(user:UserData){return[{id:"weekly-q",label:"問題100問",now:user.statistics.answered%100,target:100,reward:800},{id:"weekly-topic",label:"Topic10個",now:Object.keys(user.topicProgress).length%10,target:10,reward:700},{id:"weekly-gallery",label:"図鑑30件",now:user.progress.galleryIds.length%30,target:30,reward:600}]}
