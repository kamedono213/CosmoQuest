"use client";

import { RubyText as R } from "@/components/RubyText";
import type { Question, Stage } from "@/domain/models";

export function StageMiniTest({stage,questions,mainScore,onPass,onRetryMain}:{stage:Stage;questions:Question[];mainScore:number;onPass:(score:number)=>void;onRetryMain:()=>void}) {
  const correct=Math.round(mainScore*questions.length/100);
  const passed=correct>=6;
  return <div className="mini-test route-result">
    <div className={`test-ring ${passed?"pass":"fail"}`}><strong>{correct} / {questions.length}</strong><R text={passed?"航路調査成功(こうろちょうさせいこう)":"再挑戦(さいちょうせん)"}/></div>
    <small>ROUTE CHECK COMPLETE</small>
    <R as="h1" text={`${stage.name} 航路(こうろ)の調査結果(ちょうさけっか)`}/>
    <R as="p" text={passed?"10問中(もんちゅう)6問以上(もんいじょう)正解(せいかい)したので、次(つぎ)の航路(こうろ)へ進(すす)めます。":"合格(ごうかく)には10問中(もんちゅう)6問正解(もんせいかい)が必要(ひつよう)です。新(あたら)しいランダム10問(もん)に挑戦(ちょうせん)しましょう。"}/>
    <div className="test-summary"><span><R text="正解数(せいかいすう)"/><b>{correct}問</b></span><span><R text="合格基準(ごうかくきじゅん)"/><b>6 / 10</b></span></div>
    <button className="primary" onClick={()=>passed?onPass(mainScore):onRetryMain()}><R text={passed?"次(つぎ)の航路(こうろ)を解放(かいほう)する":"ランダム10問(もん)に再挑戦(さいちょうせん)する"}/><b>{passed?"★":"↻"}</b></button>
  </div>;
}
