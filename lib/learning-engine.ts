import type { MasteryLevel, Question, Topic, TopicProgress, UserData } from "@/domain/models";
export const emptyTopicProgress:TopicProgress={status:"unlearned",answered:0,correct:0,totalSeconds:0,mistakes:0,consecutiveCorrect:0,lastStudiedAt:""};
export function updateTopicProgress(previous:TopicProgress|undefined,correct:boolean,seconds:number):TopicProgress{const p=previous??emptyTopicProgress;const answered=p.answered+1;const hits=p.correct+(correct?1:0);const streak=correct?p.consecutiveCorrect+1:0;const rate=hits/answered;let status:MasteryLevel="learning";if(answered>=8&&rate>=.9&&streak>=5)status="mastered";else if(answered>=5&&rate>=.8)status="strong";else if(answered>=3&&rate>=.65)status="understood";return{status,answered,correct:hits,totalSeconds:p.totalSeconds+seconds,mistakes:p.mistakes+(correct?0:1),consecutiveCorrect:streak,lastStudiedAt:new Date().toISOString()}}
export function topicAccuracy(p?:TopicProgress){return p?.answered?Math.round(p.correct/p.answered*100):0}
export function isTopicAvailable(topic:Topic,user:UserData){return topic.prerequisiteTopicIds.every(id=>["understood","strong","mastered"].includes(user.topicProgress[id]?.status??""))}
export function orderedLearningPath(topics:Topic[],user:UserData){return [...topics].sort((a,b)=>{const aa=isTopicAvailable(a,user)?0:1;const bb=isTopicAvailable(b,user)?0:1;return aa-bb||a.order-b.order})}
export function selectRandomQuestions(questions:Question[],count:number){
  const shuffled=[...questions];
  for(let i=shuffled.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]]}
  return shuffled.slice(0,Math.min(count,shuffled.length));
}
export function generateMockExam(questions:Question[],grade:1|2|3|4|5,count=20){
  const pool=questions.filter(q=>q.grade===grade);
  const buckets=new Map<string,Question[]>();
  for(const q of [...pool].sort(()=>Math.random()-.5))buckets.set(q.category,[...(buckets.get(q.category)??[]),q]);
  const categories=[...buckets.keys()].sort(()=>Math.random()-.5),picked:Question[]=[];
  while(picked.length<Math.min(count,pool.length)){
    let changed=false;
    for(const category of categories){const q=buckets.get(category)?.shift();if(q){picked.push(q);changed=true;if(picked.length>=count)break}}
    if(!changed)break;
  }
  return picked;
}
