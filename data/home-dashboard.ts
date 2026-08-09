export const homeFeed = [
  { id: "notice", label: "お知らせ", icon: "📡", items: ["学習データはこの端末に自動保存されます。"] },
  { id: "event", label: "イベント", icon: "🪐", items: ["星の調査を進めて、新しい図鑑カードを発見しよう！"] },
  { id: "update", label: "アップデート情報", icon: "🚀", items: ["ホーム画面が、すぐ学べるミッションデッキになりました。"] },
] as const;

export const dailyMissionTemplates = [
  { id: "correct-3", label: "今日3問正解", metric: "correct", target: 3 },
  { id: "answer-20", label: "20問に挑戦", metric: "answered", target: 20 },
  { id: "gallery-1", label: "図鑑を1枚取得", metric: "gallery", target: 1 },
] as const;
