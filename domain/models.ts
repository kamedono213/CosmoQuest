export type FuriganaText = string;
export type StageStatus = "completed" | "available" | "locked";
export type QuestionType = "multiple-choice" | "true-false" | "image" | "fill-blank" | "ordering" | "matching" | "drag" | "passage" | "photo" | "diagram";
export type AnswerValue = number | string | string[] | Record<string, string>;

export interface Stage {
  id: string;
  order: number;
  name: FuriganaText;
  subtitle: FuriganaText;
  category: FuriganaText;
  icon: string;
  color: string;
  estimatedMinutes: number;
  xpReward: number;
  lessonIds: string[];
  questionIds: string[];
  galleryId: string;
  summary: FuriganaText;
  basicData: Array<{ label: FuriganaText; value: FuriganaText }>;
  prerequisiteStageIds?: string[];
  requiredScore?: number;
}

export interface Lesson {
  id: string;
  stageId: string;
  title: FuriganaText;
  body: FuriganaText;
  keyPoint: FuriganaText;
  trivia: FuriganaText;
  related: FuriganaText[];
  visual: "rotation" | "orbit" | "eclipse" | "gravity" | "meteor" | "black-hole";
  sources: Array<{ kind: "illustration" | "photo" | "comparison"; label: FuriganaText }>;
}

export interface Question {
  id: string;
  stageId: string;
  topicId: string;
  type: QuestionType;
  grade: 1 | 2 | 3 | 4 | 5;
  difficulty: 1 | 2 | 3 | 4 | 5;
  category: string;
  tags: string[];
  explanationId?: string;
  relatedGalleryIds?: string[];
  prompt: FuriganaText;
  options?: FuriganaText[];
  correct: AnswerValue;
  media?: { kind: "image" | "photo" | "diagram"; src: string; alt: FuriganaText };
  pairs?: Array<{ left: FuriganaText; right: FuriganaText }>;
  explanation: {
    conclusion: FuriganaText;
    reason: FuriganaText;
    memoryTip: FuriganaText;
    examPoint: FuriganaText;
    trivia: FuriganaText;
    otherChoices?: FuriganaText[];
  };
}

export interface Achievement {
  id: string;
  title: FuriganaText;
  description: FuriganaText;
  icon: string;
  condition: { metric: "answered" | "correct" | "completedStages" | "galleryRate"; threshold: number };
}

export interface AppSettings {
  theme: "dark" | "deep";
  bgm: boolean;
  se: boolean;
  fontScale: "small" | "medium" | "large";
  vibration: boolean;
  reducedMotion: boolean;
  notifications: boolean;
}

export interface QuestionHistory { questionId: string; correct: boolean; answeredAt: string; elapsedSeconds: number }
export interface LearningHistory { lessonId: string; completedAt: string; elapsedSeconds: number }
export interface ReviewItem { questionId: string; dueAt: string; intervalDays: number; ease: number }
export interface LearningResume { stageId:string; quizIndex:number; view:"quiz"|"explanation"; answer:AnswerValue|null; isCorrect:boolean; savedAt:string; questionIds?:string[] }
export interface MockExamResume { rankId:"vega"|"altair"|"sirius"|"polaris"; questionIds:string[]; index:number; correct:number; misses:Record<string,number>; startedAt:number; savedAt:string }
export interface GalleryItem { id:string; stageId?:string; category:string; title:FuriganaText; subtitle:FuriganaText; icon:string; description:FuriganaText; facts:Array<{label:FuriganaText;value:FuriganaText}>; relatedIds:string[]; tags:string[]; packId?:string; createdAt?:string; imageIds?:string[]; aiIllustrationIds?:string[]; photoIds?:string[]; comparison?:FuriganaText; relatedTopicIds?:string[]; relatedQuestionIds?:string[]; triviaIds?:string[] }
export type MasteryLevel = "unlearned"|"learning"|"understood"|"strong"|"mastered";
export interface Topic { id:string; title:FuriganaText; category:string; description:FuriganaText; importance:1|2|3|4|5; difficulty:1|2|3|4|5; grades:Array<1|2|3|4|5>; prerequisiteTopicIds:string[]; relatedTopicIds:string[]; galleryId?:string; imageIds:string[]; diagramIds:string[]; triviaIds:string[]; questionIds:string[]; animationIds:string[]; order:number; packId?:string; chapterId?:string; areaId?:string; tags?:string[]; keyPoints?:FuriganaText[]; sourceUrls?:string[]; requiredCorrect?:number; createdAt?:string; updatedAt?:string }
export interface ExplanationData { id:string; conclusion:FuriganaText; reason:FuriganaText; diagramId?:string; otherChoices:FuriganaText[]; examPoint:FuriganaText; memoryTip:FuriganaText; triviaIds:string[]; furtherTopicIds:string[] }
export interface TriviaData { id:string; topicIds:string[]; title:FuriganaText; body:FuriganaText; sourceNote?:string }
export interface ImagePromptData { id:string; topicIds:string[]; purpose:"gallery"|"lesson"|"diagram"; prompt:string; style:string; background:string; textPolicy:string }
export interface Mission { id:string; kind:"daily"|"weekly"|"event"; title:FuriganaText; description:FuriganaText; metric:"correct"|"answered"|"completedStages"|"gallery"; target:number; xpReward:number }
export interface AnimationData { id:string; kind:string; stageIds:string[]; reducedMotionFallback?:string }
export interface LearningPathData { id:string; title:FuriganaText; stageIds:string[]; grade:3|4|5 }
export interface RankData { id:string; name:string; stars:number; subtitle:FuriganaText; internalGrade:number; color:string }
export interface ChapterData { id:string; rankId:string; order:number; title:FuriganaText; stageIds:string[] }
export interface AreaData { id:string; chapterId:string; order:number; title:FuriganaText; stageIds:string[] }
export interface TopicProgress { status:MasteryLevel; answered:number; correct:number; totalSeconds:number; mistakes:number; consecutiveCorrect:number; lastStudiedAt:string }
export interface StageProgress { lessonRead:boolean; answeredQuestionIds:string[]; correctQuestionIds:string[]; mainScore:number; miniTestPassed:boolean; miniTestScore:number; completedAt?:string }
export interface GameState { coins:number; shipId:string; shipColor:string; engineId:string; unlockedShipIds:string[]; artifactIds:string[]; ownedItemIds:string[]; suitId:string; loginDays:number; lastLoginDate:string; claimedDailyIds:string[]; claimedWeeklyIds:string[]; lastReward?:{kind:"xp"|"artifact"|"trophy"|"discovery";label:string;rarity?:number} }

export interface UserData {
  schemaVersion: 6;
  saveVersion: number;
  player: { name: string; createdAt: string; lastActiveAt: string };
  progress: { completedStageIds: string[]; readLessonIds: string[]; galleryIds: string[]; favoriteGalleryIds:string[]; currentStageId: string; xp: number; stageScores:Record<string,number>; stageStars:Record<string,number>; stages:Record<string,StageProgress> };
  statistics: { answered: number; correct: number; learningSeconds: number; streak: number; lastStudyDate: string };
  settings: AppSettings;
  achievements: string[];
  questionHistory: QuestionHistory[];
  learningHistory: LearningHistory[];
  reviews: ReviewItem[];
  topicProgress: Record<string,TopicProgress>;
  game: GameState;
}

export interface ContentCatalog { schemaVersion:number; stages:Stage[]; lessons:Lesson[]; questions:Question[]; gallery:GalleryItem[]; achievements:Achievement[]; topics:Topic[]; explanations:ExplanationData[]; trivia:TriviaData[]; imagePrompts:ImagePromptData[]; missions:Mission[]; animations:AnimationData[]; learningPaths:LearningPathData[]; ranks?:RankData[]; chapters?:ChapterData[]; areas?:AreaData[] }
