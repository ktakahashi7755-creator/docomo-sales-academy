// Provide Growth Academy — カリキュラム定義（携帯・通信販売の教材を再構成）。
// 事実値（料金/還元/補償）は seed の PRODUCTS（正典）を参照し、ここでは技法中心の本文を持つ。
// クイズは data/quiz の moduleId、ロープレは seed の SCENARIOS と id で連携する。

export type GrowthIcon =
  | "dashboard"
  | "curriculum"
  | "content"
  | "roleplay"
  | "quiz"
  | "report"
  | "announce"
  | "help"
  | "bot"
  | "book"
  | "smile"
  | "ear"
  | "lightbulb"
  | "target"
  | "rocket"
  | "clock"
  | "award"
  | "calendar"
  | "video"
  | "manual"
  | "users"
  | "message"
  | "shield"
  | "sparkles"
  | "handshake";

export type Accent = "navy" | "blue" | "teal" | "green" | "orange";

export interface NavItem {
  id: string;
  label: string;
  icon: GrowthIcon;
  to: string;
}

export interface Lesson {
  id: string;
  stepId: string;
  no: number;
  title: string;
  summary: string;
  minutes: number;
  body: string[];
  keyPoints: string[];
  /** data/quiz の moduleId（確認テスト）。 */
  quizModuleId?: string;
  /** seed SCENARIOS の id（ロープレ）。 */
  scenarioId?: string;
  /** seed PRODUCTS の id（商材ナレッジを差し込む）。 */
  productIds?: string[];
}

export interface CurriculumStep {
  id: string;
  no: number;
  title: string;
  subtitle: string;
  duration: string;
  icon: GrowthIcon;
  accent: Accent;
  goalHeading: string;
  goalDescription: string;
  checklist: string[];
  lessons: Lesson[];
}

// ===== サイドバー =====
export const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "ダッシュボード", icon: "dashboard", to: "/" },
  { id: "curriculum", label: "カリキュラム一覧", icon: "curriculum", to: "/curriculum" },
  { id: "content", label: "学習コンテンツ", icon: "content", to: "/content" },
  { id: "roleplay", label: "実践・ロープレ", icon: "roleplay", to: "/roleplay" },
  { id: "quiz", label: "クイズ・テスト", icon: "quiz", to: "/quiz" },
  { id: "report", label: "進捗レポート", icon: "report", to: "/reports" },
  { id: "announce", label: "お知らせ", icon: "announce", to: "/announcements" },
  { id: "help", label: "ヘルプ・FAQ", icon: "help", to: "/help" },
];

// ===== カリキュラム本体（5ステップ） =====
export const CURRICULUM: CurriculumStep[] = [
  {
    id: "step-1",
    no: 1,
    title: "販売の基本を学ぶ",
    subtitle: "役割・現場の流れ・コンプライアンス",
    duration: "1〜2週間",
    icon: "book",
    accent: "navy",
    goalHeading: "現場の基本姿勢を身につける",
    goalDescription:
      "販売スタッフの役割と1日の流れを理解し、守るべきルールを踏まえて安心して接客に立てる状態を目指します。",
    checklist: [
      "自分の役割と1日の動きを説明できる",
      "受付から提案までの流れがイメージできる",
      "やってはいけないこと（コンプラ）を判断できる",
      "断られても自分の伝え方を振り返れる",
    ],
    lessons: [
      {
        id: "l1-1",
        stepId: "step-1",
        no: 1,
        title: "販売スタッフの役割と心構え",
        summary: "現場での立ち位置と、結果を自分ごと化する自責思考を学ぶ",
        minutes: 12,
        body: [
          "販売スタッフの仕事は「商品を押し込むこと」ではなく、お客様の困りごとを一緒に見つけて、より良い選択に導くことです。最初に役割を正しく理解すると、接客の軸がぶれません。",
          "うまくいかない時に「この人は買わない人だった」で終わらせず、「自分の伝え方をどう変えればよかったか」で考える——この自責思考が成長を最速にします。断られた数だけ、改善のヒントが手に入ります。",
        ],
        keyPoints: [
          "売り込みではなく、課題解決に伴走する",
          "結果は自分のアプローチの結果として振り返る",
          "笑顔・挨拶・身だしなみで「話してよい人」になる",
        ],
        quizModuleId: "p1m5",
      },
      {
        id: "l1-2",
        stepId: "step-1",
        no: 2,
        title: "店内・イベント・外販の動き方",
        summary: "場面ごとの立ち回りと、声をかけるタイミングを掴む",
        minutes: 15,
        body: [
          "店内・イベント・外販では、お客様の状態も最適な声かけも変わります。通行中の方には受け取りやすいフックから、来店された方には用件の確認から——場面に合わせて入口を変えます。",
          "共通するのは「相手の時間を奪わない」こと。短く区切って、続けるかどうかをお客様に委ねると、警戒されにくくなります。",
        ],
        keyPoints: [
          "通行・来店・イベントで入口を変える",
          "受け取りやすいフックで足を止めてもらう",
          "所要時間を短く区切って安心感を出す",
        ],
      },
      {
        id: "l1-3",
        stepId: "step-1",
        no: 3,
        title: "受付から提案までの流れ",
        summary: "ゴールまでの全体像を1本の線でつかむ",
        minutes: 12,
        body: [
          "接客は「興味づけ → ヒアリング → 提案 → 着座・合意 → お見送り」の5ステップで進みます。今どのステップにいるかを意識すると、迷わず次の一手を選べます。",
          "特に着座（座って一緒に料金を見る）までを最初のゴールに置くと、提案の質が一段上がります。",
        ],
        keyPoints: [
          "5ステップで現在地を意識する",
          "最初のゴールは「着座・料金診断」",
          "成約・未成約に関わらず丁寧にお見送りする",
        ],
      },
      {
        id: "l1-4",
        stepId: "step-1",
        no: 4,
        title: "個人情報とコンプライアンス",
        summary: "守るべき一線。ここは100点が必須",
        minutes: 18,
        body: [
          "パスワードや認証コードは、必ずお客様ご自身に入力していただきます。スタッフが代わりに入力する導線は作りません。個人情報は本人と権限者だけが扱い、必要最小限に留めます。",
          "料金・還元・補償などの数字は、はっきり分からないときに推測で埋めないこと。公式情報と最終確認日を正とし、不確かなら断定せず確認します。ここはお客様の信頼に直結する一線です。",
        ],
        keyPoints: [
          "パスワード・認証コードはお客様ご自身が入力",
          "個人情報は本人と権限者のみ・最小限",
          "不確かな数字は断定せず公式情報で確認",
        ],
        quizModuleId: "p1m4",
      },
    ],
  },
  {
    id: "step-2",
    no: 2,
    title: "接客・ヒアリングを学ぶ",
    subtitle: "第一印象からニーズの引き出しまで",
    duration: "2〜3週間",
    icon: "ear",
    accent: "blue",
    goalHeading: "お客様のニーズを正しく引き出せる",
    goalDescription:
      "お客様との会話から課題や希望を整理し、最適な提案につなげる基礎力を身につけます。",
    checklist: [
      "自然な声かけができる",
      "お客様の話を最後まで聞ける",
      "質問を使ってニーズを深掘りできる",
      "聞いた内容を整理して共有できる",
    ],
    lessons: [
      {
        id: "l2-1",
        stepId: "step-2",
        no: 1,
        title: "第一印象と基本マナー",
        summary: "挨拶・身だしなみ・声のトーンで警戒を解く",
        minutes: 10,
        body: [
          "人は数秒で第一印象を決めます。清潔感のある身だしなみ、目線を合わせた挨拶、明るく落ち着いた声のトーン——この3つで「話してもいい人」だと感じてもらえます。",
          "笑顔は最強のアイスブレイクです。売り込む前に、まず安心してもらうことを優先しましょう。",
        ],
        keyPoints: ["清潔感・目線・声のトーン", "笑顔で警戒を解く", "売り込む前に安心を渡す"],
      },
      {
        id: "l2-2",
        stepId: "step-2",
        no: 2,
        title: "お客様への声かけ",
        summary: "自然なアプローチと会話の始め方",
        minutes: 14,
        body: [
          "いきなり料金やキャンペーンの話から入ると警戒されます。「スマホの操作でお困りのことありませんか」のような、売り込みでない一言から入ると足を止めてもらいやすくなります。",
          "受け取りやすいフック（景品・アプリ・季節の話題）をきっかけに、雑談の流れで現状を確認していきます。",
        ],
        keyPoints: [
          "売り込みでない一言から入る",
          "受け取りやすいフックで足を止める",
          "雑談の流れで現状を確認する",
        ],
        scenarioId: "sc11",
      },
      {
        id: "l2-3",
        stepId: "step-2",
        no: 3,
        title: "ヒアリングの型と深掘り",
        summary: "聞かないと出てこない情報を引き出す",
        minutes: 16,
        body: [
          "現状のキャリア・機種・毎月の通信料を、雑談の中でやさしく確認します。さらに不満（動作が遅い・電池が持たない・ギガが足りない）と、自宅のWi-Fiの有無を特定します。",
          "「今ので困っていない」と言われても、月末にギガが足りているか・電池の持ち・料金だけ一緒に見てみませんか、と小さな確認に誘うと、我慢していた点が見えてきます。",
        ],
        keyPoints: [
          "現状（キャリア・機種・料金）を確認",
          "不満と自宅Wi-Fiの有無を特定",
          "書類・未納・家族相談は早めに把握",
        ],
        quizModuleId: "p6m2",
      },
      {
        id: "l2-4",
        stepId: "step-2",
        no: 4,
        title: "ニーズ整理と共感トーク",
        summary: "聞いた内容を整理し、安心感を与える",
        minutes: 12,
        body: [
          "聞き出した情報は、その場で整理して言葉で返します。「つまり、動作の重さと月末のギガ不足が気になっているということですね」と要約すると、お客様は「分かってもらえた」と感じます。",
          "共感は同意ではありません。気持ちを受け止めてから、解決の方向に話を進めます。",
        ],
        keyPoints: ["聞いた内容を要約して返す", "共感で安心感を与える", "課題を合意してから提案へ"],
      },
    ],
  },
  {
    id: "step-3",
    no: 3,
    title: "提案力を高める",
    subtitle: "料金・dカード・固定回線の3価値",
    duration: "2〜3週間",
    icon: "lightbulb",
    accent: "teal",
    goalHeading: "お客様に合った提案を組み立てられる",
    goalDescription:
      "端末・料金・自宅ネットの3つの価値を連動させ、乗り換え後の明るい生活として束ねて提案できる力を養います。",
    checklist: [
      "使い方に合う料金プランを選べる",
      "dカードの違いと回収根拠を説明できる",
      "光・home 5G を用途で出し分けできる",
      "3つの価値を1つの提案に束ねられる",
    ],
    lessons: [
      {
        id: "l3-1",
        stepId: "step-3",
        no: 1,
        title: "料金プランの提案",
        summary: "MAX / ポイ活MAX / mini を使い方で選ぶ",
        minutes: 16,
        body: [
          "料金は「安さ」ではなく「使い方に合うか」で選びます。ギガ不足や速度制限の不満があれば無制限のMAX、普段からd払い・dカードを使う方にはポイ活MAX、ライトな使い方ならminiが候補です。",
          "金額は必ず公式情報で確認し、実質額は前提条件を添えて正直に伝えます（このレッスンの数値は商材ナレッジを参照）。",
        ],
        keyPoints: [
          "安さでなく使い方で選ぶ",
          "ギガ不足=MAX / ポイ活=ポイ活MAX / ライト=mini",
          "実質額は前提条件を添えて正直に",
        ],
        quizModuleId: "p2m1",
        productIds: ["plan-max", "plan-poikatsu-max", "plan-mini"],
      },
      {
        id: "l3-2",
        stepId: "step-3",
        no: 2,
        title: "dカードの提案",
        summary: "レギュラー / GOLD / PLATINUM の違いと回収根拠",
        minutes: 18,
        body: [
          "GOLDは「年会費を払うカード」ではなく、毎月の料金を下げ・ポイントを貯め・高額スマホを守る3つを付けられるカードとして提案します。年会費は割引とポイントで回収できる前提で、数字を示して納得につなげます。",
          "利用額が大きい方やポイ活MAX利用者にはPLATINUMを、実利用額で試算して提示します。具体的な金額は商材ナレッジ（正典値）を参照してください。",
        ],
        keyPoints: [
          "GOLDは「料金を下げ・貯め・守る」カード",
          "年会費は割引＋ポイントで回収を数字で示す",
          "利用額が大きい/ポイ活はPLATINUMを試算",
        ],
        quizModuleId: "p3m1",
        scenarioId: "sc6",
        productIds: ["dcard-regular", "dcard-gold", "dcard-platinum"],
      },
      {
        id: "l3-3",
        stepId: "step-3",
        no: 3,
        title: "固定回線と生活商材",
        summary: "ドコモ光・home 5G・でんき/ガスを用途で出し分け",
        minutes: 15,
        body: [
          "自宅のネットは、光の工事ができる家庭なら光（速度重視なら10ギガ）、工事が難しい・急ぎなら home 5G を提案します。家族台数が多いほどセット割の効果が大きくなります。",
          "でんき・ガスは家計全体での見直しとして、支払いでポイントが貯まる動線を示します。条件は必ず公式で確認します。",
        ],
        keyPoints: [
          "工事可=光 / 工事難=home 5G",
          "家族台数×セット割でトータル試算",
          "でんき・ガスは家計全体の見直しで",
        ],
        productIds: ["hikari-1g", "hikari-10g", "home5g", "denki", "gas"],
      },
      {
        id: "l3-4",
        stepId: "step-3",
        no: 4,
        title: "3価値連動の提案設計",
        summary: "端末・料金・自宅ネットを1つの未来として束ねる",
        minutes: 14,
        body: [
          "単品の安さで勝負せず、端末スペック・料金最適化・自宅ネットの3つを連動させ、「乗り換え後の明るい毎日」として見せます。",
          "「浮いたお金で家族と外食にも行けますよ」のように、生活が良くなる具体像で着座・合意につなげます。",
        ],
        keyPoints: [
          "端末・料金・自宅ネットを連動させる",
          "生活が良くなる具体像で語る",
          "着座・合意を最初のゴールに置く",
        ],
      },
    ],
  },
  {
    id: "step-4",
    no: 4,
    title: "クロージングを学ぶ",
    subtitle: "反論処理から申込誘導まで",
    duration: "2週間",
    icon: "target",
    accent: "green",
    goalHeading: "不安を解いて、次の一歩を促せる",
    goalDescription:
      "反論をまず受け止めてから切り返し、前向きな未来とともに具体的な次の一歩（お手続き）へ導く力を身につけます。",
    checklist: [
      "反論をまず受け止められる",
      "回収根拠を数字で示せる",
      "今やる理由を作れる",
      "次の一歩を具体的に促せる",
    ],
    lessons: [
      {
        id: "l4-1",
        stepId: "step-4",
        no: 1,
        title: "反論処理の基本",
        summary: "高い／面倒／家族に確認／今はいい への切り返し",
        minutes: 16,
        body: [
          "反論は否定で返さず、まず受け止めます。「金額だけ見ると高く感じますよね」と共感してから、「実際にお得になるか一緒に計算してみましょう」と回収根拠に話を移します。",
          "「家族に確認したい」には急かさず、説明しやすいメモを用意します。不安の正体を一つずつ潰すのがコツです。",
        ],
        keyPoints: [
          "否定せず、まず受け止める",
          "回収根拠を数字で可視化する",
          "不安を一つずつ具体的に潰す",
        ],
        quizModuleId: "p8m1",
        scenarioId: "sc9",
      },
      {
        id: "l4-2",
        stepId: "step-4",
        no: 2,
        title: "クロージングの型",
        summary: "選択肢・損失回避・今やる理由",
        minutes: 14,
        body: [
          "クロージングは「どちらにしますか」の選択式や、「今なら〜の期間です」という今やる理由で背中を押します。押し売りではなく、お客様にとっての損失（このままの料金を払い続けること）を避ける提案として伝えます。",
          "条件や期間は必ず公式で確認し、誇張せずに伝えます。",
        ],
        keyPoints: ["選択式で決めやすくする", "今やる理由を正直に作る", "損失回避の視点で伝える"],
      },
      {
        id: "l4-3",
        stepId: "step-4",
        no: 3,
        title: "申込誘導と最後の一押し",
        summary: "手続きをこちらが伴走して進める",
        minutes: 12,
        body: [
          "「番号もそのまま、難しいところは一緒に進めます」と伝え、やることはほぼ確認だけだと示すと、手続きのハードルが下がります。",
          "その場で決まらなくても、必要書類や家族相談の宿題を渡し、再来店につなげます。最後まで丁寧にお見送りします。",
        ],
        keyPoints: [
          "手続きはこちらが伴走する前提で示す",
          "やることを「確認だけ」に小さくする",
          "未成約でも次につながる宿題を渡す",
        ],
        scenarioId: "sc10",
      },
    ],
  },
  {
    id: "step-5",
    no: 5,
    title: "実践・自立",
    subtitle: "総合ロープレと認定",
    duration: "3週間",
    icon: "rocket",
    accent: "orange",
    goalHeading: "一人で一連の接客をやり切れる",
    goalDescription:
      "ヒアリングから提案・反論処理・クロージングまでを通しで実践し、現場で自立できる状態を認定します。",
    checklist: [
      "通しのロープレをやり切れる",
      "難しい相手にも落ち着いて対応できる",
      "コンプライアンスを守れている",
      "次アクションを必ず提示できる",
    ],
    lessons: [
      {
        id: "l5-1",
        stepId: "step-5",
        no: 1,
        title: "総合ロープレ",
        summary: "通しで接客を実践し、AI評価で振り返る",
        minutes: 25,
        body: [
          "これまで学んだ流れを通しで実践します。ヒアリングで現状と不満を引き出し、3価値を束ねて提案し、反論を受け止めてクロージングまで運びます。",
          "終了後はAI評価で12項目のスコアと改善ポイントを確認し、弱いところをもう一度練習します。",
        ],
        keyPoints: ["通しでやり切る", "AI評価で弱点を特定", "弱点を反復して埋める"],
        scenarioId: "sc7",
      },
      {
        id: "l5-2",
        stepId: "step-5",
        no: 2,
        title: "認定試験",
        summary: "必須項目を満たし、現場デビューへ",
        minutes: 20,
        body: [
          "必須レッスンの完了、確認テストの合格、総合ロープレの評価を満たすと、現場デビューの認定が得られます。",
          "認定はゴールではなくスタートです。現場でも自責思考で振り返り、伸ばし続けましょう。",
        ],
        keyPoints: [
          "必須レッスン・テスト・ロープレを満たす",
          "認定はスタート",
          "現場でも振り返り続ける",
        ],
      },
    ],
  },
];

// ===== お知らせ =====
export interface Announcement {
  id: string;
  title: string;
  body: string;
  date: string;
  tone: "info" | "event" | "caution";
}
export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: "an-1",
    title: "STEP02「接客・ヒアリング」が公開されました",
    body: "声かけからニーズの深掘りまで、現場ですぐ使えるレッスンを追加しました。まずはお客様への声かけから始めましょう。",
    date: "2026/06/16",
    tone: "event",
  },
  {
    id: "an-2",
    title: "商材情報は提案前に最終確認を",
    body: "料金・還元・補償の条件は変わることがあります。提案前に各商材の公式ページと最終確認日を必ず確かめてください。",
    date: "2026/06/10",
    tone: "caution",
  },
  {
    id: "an-3",
    title: "今月のロールプレイ強化週間",
    body: "難易度の高いシナリオに挑戦して、クロージング力を磨きましょう。AI評価のスコアを先週より上げるのが目標です。",
    date: "2026/06/02",
    tone: "info",
  },
];

// ===== ヘルプ・FAQ =====
export interface FaqItem {
  q: string;
  a: string;
}
export const FAQ: FaqItem[] = [
  {
    q: "学習の進め方が分かりません。どこから始めればいいですか。",
    a: "ダッシュボードの「続きから学習する」を押すと、いまやるべきレッスンに進めます。基本はSTEP1から順番に進めるのがおすすめです。",
  },
  {
    q: "確認テストは何度でも受けられますか。",
    a: "はい、何度でも受験できます。合格点はレッスンにより異なり、コンプライアンスのテストは100点が必要です。良いスコアは保持されます。",
  },
  {
    q: "ロールプレイのAI評価はどう見ればいいですか。",
    a: "12項目のスコアと総合ランク（S〜D）、改善ポイントが出ます。低い項目から1つずつ意識して練習すると、効率よく伸びます。",
  },
  {
    q: "料金や還元の数字に自信がありません。",
    a: "数字は推測で覚えず、商材ナレッジ（公式情報と最終確認日）を正としてください。不確かなときは断定せず確認するのが正解です。",
  },
  {
    q: "困ったときは誰に相談できますか。",
    a: "画面右下のAIサポートBotにいつでも質問できます。現場の具体的な相談は、先輩スタッフへの相談メニューもご利用ください。",
  },
];

// ===== おすすめ動画（プレースホルダ） =====
export interface VideoContent {
  id: string;
  title: string;
  duration: string;
  accent: Accent;
}
export const RECOMMENDED: VideoContent[] = [
  { id: "v1", title: "接客の基本マナー", duration: "6:24", accent: "blue" },
  { id: "v2", title: "効果的なヒアリング方法", duration: "8:10", accent: "teal" },
  { id: "v3", title: "断られた時の対応方法", duration: "5:47", accent: "orange" },
];

// ===== 成功事例 =====
export const SUCCESS_CASE = {
  description: "先輩スタッフの対応事例から、現場で効くコツを学べます。",
  members: ["佐藤 健", "鈴木 美咲", "田中 太郎"],
};

// ===== 今後のスケジュール（デモ） =====
export interface ScheduleItem {
  id: string;
  date: string;
  time: string;
  title: string;
  reserved: boolean;
}
export const SCHEDULE: ScheduleItem[] = [
  {
    id: "s1",
    date: "6/18（水）",
    time: "10:00〜11:00",
    title: "ロープレ練習：声かけ",
    reserved: true,
  },
  {
    id: "s2",
    date: "6/20（金）",
    time: "15:00〜16:00",
    title: "確認テスト（STEP02）",
    reserved: true,
  },
  {
    id: "s3",
    date: "6/25（水）",
    time: "10:00〜11:00",
    title: "フィードバック面談",
    reserved: false,
  },
];

// ===== 学習サポート（action = "bot" または遷移先ルート） =====
export interface SupportCard {
  id: string;
  title: string;
  description: string;
  icon: GrowthIcon;
  accent: Accent;
  action: string;
}
export const SUPPORT_CARDS: SupportCard[] = [
  {
    id: "bot",
    title: "AIサポートBot",
    description: "わからないことをいつでも質問",
    icon: "bot",
    accent: "blue",
    action: "bot",
  },
  {
    id: "senior",
    title: "先輩に相談する",
    description: "現場の先輩がアドバイス",
    icon: "users",
    accent: "teal",
    action: "bot",
  },
  {
    id: "manual",
    title: "マニュアル・動画",
    description: "いつでも見返せる教材集",
    icon: "manual",
    accent: "green",
    action: "/content",
  },
  {
    id: "faq",
    title: "よくある質問",
    description: "つまずきやすいポイントを解決",
    icon: "help",
    accent: "orange",
    action: "/help",
  },
];

// ===== 確認テスト（data/quiz の moduleId に対応） =====
export interface QuizModuleMeta {
  moduleId: string;
  title: string;
  description: string;
  passing: number; // 合格点
  accent: Accent;
  icon: GrowthIcon;
}
export const QUIZ_MODULES: QuizModuleMeta[] = [
  {
    moduleId: "p1m4",
    title: "コンプライアンス",
    description: "個人情報・パスワード・事実の扱い（合格点100）",
    passing: 100,
    accent: "navy",
    icon: "shield",
  },
  {
    moduleId: "p1m5",
    title: "販売の基本姿勢",
    description: "標準5ステップと自責思考",
    passing: 80,
    accent: "blue",
    icon: "book",
  },
  {
    moduleId: "p2m1",
    title: "料金プラン",
    description: "MAX / ポイ活MAX / mini の選び方",
    passing: 80,
    accent: "teal",
    icon: "sparkles",
  },
  {
    moduleId: "p3m1",
    title: "dカードの違い",
    description: "レギュラー / GOLD / PLATINUM",
    passing: 80,
    accent: "orange",
    icon: "award",
  },
  {
    moduleId: "p6m2",
    title: "ヒアリング",
    description: "不満・乗り換え意欲の引き出し",
    passing: 80,
    accent: "blue",
    icon: "ear",
  },
  {
    moduleId: "p8m1",
    title: "反論処理",
    description: "価格・面倒・保留への切り返し",
    passing: 80,
    accent: "green",
    icon: "handshake",
  },
];
export function quizModuleMeta(moduleId: string): QuizModuleMeta | undefined {
  return QUIZ_MODULES.find((q) => q.moduleId === moduleId);
}

// ===== 派生ヘルパー（純粋関数） =====
export const ALL_LESSONS: Lesson[] = CURRICULUM.flatMap((s) => s.lessons);

export function stepById(id: string): CurriculumStep | undefined {
  return CURRICULUM.find((s) => s.id === id);
}
export function lessonById(id: string): Lesson | undefined {
  return ALL_LESSONS.find((l) => l.id === id);
}
export function stepOfLesson(lessonId: string): CurriculumStep | undefined {
  const l = lessonById(lessonId);
  return l ? stepById(l.stepId) : undefined;
}
