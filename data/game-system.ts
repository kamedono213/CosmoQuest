export const shipLevels=[
 [1,"カプセル"],[5,"シャトル"],[10,"探査船"],[20,"巡洋艦"],[30,"大型探査船"],[40,"母艦"],[50,"恒星間探査船"],[60,"ワープ船"],[70,"次元航行船"],[80,"超文明船"],[90,"銀河級母艦"],[100,"Cosmo Master Ship"],
] as const;
export const ships=[
 {id:"capsule",name:"CQ カプセル",style:"NASA風",icon:"◈",unlock:0},{id:"hayabusa",name:"HAYABUSA Nova",style:"JAXA風",icon:"◇",unlock:3},{id:"survey",name:"ディープ・サーベイヤー",style:"調査船",icon:"◆",unlock:8},{id:"miner",name:"アステロイド・マイナー",style:"鉱石採掘船",icon:"⬡",unlock:15},{id:"retro",name:"レトロ・コメット",style:"レトロロケット",icon:"▲",unlock:22},{id:"ufo",name:"UNKNOWN 51",style:"UFO",icon:"◎",unlock:30},{id:"future",name:"ルミナス・アーク",style:"未来船",icon:"✦",unlock:45},{id:"battleship",name:"コスモ・ヴァンガード",style:"宇宙戦艦",icon:"▰",unlock:60},
];
export const artifacts=Array.from({length:240},(_,i)=>{const names=["月の石","火星の砂","隕石片","宇宙食","宇宙服パッチ","ロケット部品","人工衛星模型","金のレコード","アポロ記念メダル","氷衛星の結晶","星図プレート","探査機アンテナ"];return{id:`artifact-${i+1}`,name:`${names[i%names.length]} ${String(Math.floor(i/12)+1).padStart(2,"0")}`,rarity:(i%29===0?5:i%13===0?4:i%7===0?3:i%3===0?2:1) as 1|2|3|4|5,icon:["◆","✦","●","▣","◈","⬡"][i%6]}});
export const shopItems=[{id:"color-aurora",name:"オーロラカラー",kind:"COLOR",price:350,value:"#64f1d1"},{id:"color-solar",name:"ソーラーカラー",kind:"COLOR",price:500,value:"#ffb44f"},{id:"engine-ion",name:"イオンエンジン",kind:"ENGINE",price:700,value:"ion"},{id:"engine-warp",name:"ワープ航跡",kind:"ENGINE",price:1200,value:"warp"},{id:"suit-jaxa",name:"JAXA風スーツ",kind:"SUIT",price:600,value:"jaxa"},{id:"suit-robot",name:"ロボットスーツ",kind:"SUIT",price:900,value:"robot"}];
export const titles=[[1,"宇宙好き"],[5,"観測員"],[10,"研究員"],[20,"探査員"],[30,"宇宙飛行士"],[40,"主任研究員"],[50,"博士"],[65,"銀河探査隊長"],[80,"銀河提督"],[100,"Cosmo Master"]] as const;
export const baseNames=["探査キャンプ","月面テント","研究室","観測所","発射台","宇宙港","宇宙都市","巨大コロニー","リング都市","惑星都市","宇宙文明"];
