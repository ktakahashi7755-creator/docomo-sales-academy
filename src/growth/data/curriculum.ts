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

export interface LessonExample {
  ng: string;
  good: string;
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
  /** 現場のひとこと（コーチングの一言）。 */
  tip?: string;
  /** NG/Good のトーク例。 */
  examples?: LessonExample;
  /** data/quiz の moduleId（確認テスト）。 */
  quizModuleId?: string;
  /** seed SCENARIOS の id（ロープレ）。 */
  scenarioId?: string;
  /** seed PRODUCTS の id（商材ナレッジを差し込む）。 */
  productIds?: string[];
}

/** ゴールのチェック項目。lessonId を完了するとチェックが付く（進捗連動）。 */
export interface ChecklistItem {
  text: string;
  lessonId?: string;
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
  checklist: ChecklistItem[];
  /** 章末まとめ（ステップの締めの一段落）。 */
  recap: string;
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
      { text: "自分の役割と1日の動きを説明できる", lessonId: "l1-2" },
      { text: "受付から提案までの流れがイメージできる", lessonId: "l1-3" },
      { text: "やってはいけないこと（コンプラ）を判断できる", lessonId: "l1-4" },
      { text: "断られても自分の伝え方を振り返れる", lessonId: "l1-1" },
    ],
    recap:
      "現場の役割・1日の流れ・守るべきルールを押さえました。『売る』前にまず『話してよい人』になり、断られても自分の伝え方で振り返る——この土台が以降のすべてに効きます。",
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
          "心構えはスキル以前の土台です。まず『この人になら話してもいい』と思ってもらえる態度をつくり、その上で商品知識や提案力を積み上げていきましょう。順番を逆にすると、どんなに良い提案も届きません。",
        ],
        keyPoints: [
          "売り込みではなく、課題解決に伴走する",
          "結果は自分のアプローチの結果として振り返る",
          "笑顔・挨拶・身だしなみで「話してよい人」になる",
        ],
        tip: "断られた数は、伸びしろの数。今日の1件を明日の改善メモに変えましょう。",
        examples: {
          ng: "（断られて）この人は買う気がなかった、で終わらせてしまう。",
          good: "（断られて）どの一言で離れたかを思い出し、次は最初の30秒を変えてみる。",
        },
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
          "外販やイベントでは、受け取ってもらえる小さなきっかけ（景品・診断・季節の話題）を用意しておくと、自然に会話が始まります。場面が変わっても『相手の状況をまず観察してから動く』姿勢は同じです。",
        ],
        keyPoints: [
          "通行・来店・イベントで入口を変える",
          "受け取りやすいフックで足を止めてもらう",
          "所要時間を短く区切って安心感を出す",
        ],
        tip: "最初は引いて、頼られる距離感を。張り付くより、ひと声かけて待つのが効きます。",
        examples: {
          ng: "（来店直後に張り付いて）何かお探しですか、こちら今おすすめです。",
          good: "いらっしゃいませ。ご自由にご覧ください。気になるものがあればお声がけくださいね。",
        },
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
          "焦って提案から入ると、ニーズに合わず断られがちです。今が5ステップのどこかを意識し、ヒアリングが足りなければ一歩戻る——この往復ができると、成約率が安定します。",
        ],
        keyPoints: [
          "5ステップで現在地を意識する",
          "最初のゴールは「着座・料金診断」",
          "成約・未成約に関わらず丁寧にお見送りする",
        ],
        tip: "今どのステップにいるかを常に自問。迷ったら一歩戻って、聞き直してOKです。",
        examples: {
          ng: "（ヒアリング前に）まずこのプランの説明をしますね。",
          good: "先に今の使い方だけ伺ってから、合うものをご提案しますね。",
        },
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
          "コンプライアンスは『売上のブレーキ』ではなく『信頼の土台』です。一度の不正確な説明や不適切な取り扱いが、お店全体の信用を損ないます。迷ったら立ち止まり、確認する勇気を持ちましょう。",
        ],
        keyPoints: [
          "パスワード・認証コードはお客様ご自身が入力",
          "個人情報は本人と権限者のみ・最小限",
          "不確かな数字は断定せず公式情報で確認",
        ],
        tip: "迷ったら「お客様ご自身に入力していただく」。ここは絶対に近道しません。",
        examples: {
          ng: "お急ぎのようなので、こちらでパスワードを入力しておきますね。",
          good: "セキュリティのため、パスワードはお客様ご自身でご入力をお願いします。",
        },
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
      { text: "自然な声かけができる", lessonId: "l2-2" },
      { text: "お客様の話を最後まで聞ける", lessonId: "l2-3" },
      { text: "質問を使ってニーズを深掘りできる", lessonId: "l2-3" },
      { text: "聞いた内容を整理して共有できる", lessonId: "l2-4" },
    ],
    recap:
      "第一印象で警戒を解き、声かけ→ヒアリング→ニーズ整理までを学びました。話す2割・聞く8割。聞いた内容を要約して返すことで、提案前に信頼が生まれます。",
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
          "第一印象はやり直しがききません。だからこそ、出勤前の身だしなみチェックと、最初のひと言の練習を習慣にします。整った見た目と落ち着いた声は、それだけで提案の説得力を底上げします。",
        ],
        keyPoints: ["清潔感・目線・声のトーン", "笑顔で警戒を解く", "売り込む前に安心を渡す"],
        tip: "鏡は最高のコーチ。出勤前の30秒で、表情と姿勢をチェックしましょう。",
        examples: {
          ng: "（無表情・早口で）いらっしゃいませ、ご用件は。",
          good: "（目を見て笑顔で）いらっしゃいませ。本日はお買い物ですか。",
        },
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
          "声かけのゴールは『売ること』ではなく『足を止めて、ひと言交わすこと』です。最初のハードルを下げれば、その後のヒアリングにつながります。断られても表情を崩さず、次の方へ気持ちよく切り替えましょう。",
        ],
        keyPoints: [
          "売り込みでない一言から入る",
          "受け取りやすいフックで足を止める",
          "雑談の流れで現状を確認する",
        ],
        tip: "最初の一言は「質問」より「気づかい」。売る前に、まず人として話しかけます。",
        examples: {
          ng: "今ならキャンペーンで安くなりますよ、いかがですか。",
          good: "お買い物の途中にすみません。スマホの操作でお困りのことはありませんか。",
        },
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
          "良いヒアリングは尋問になりません。質問の合間に『そうなんですね』と相づちを入れ、相手が話しやすい空気をつくります。出てきた不満は、後の提案で『それを解決する一手』として効いてきます。",
        ],
        keyPoints: [
          "現状（キャリア・機種・料金）を確認",
          "不満と自宅Wi-Fiの有無を特定",
          "書類・未納・家族相談は早めに把握",
        ],
        tip: "話す2割・聞く8割。沈黙を怖がらず、お客様が考える間を待ちましょう。",
        examples: {
          ng: "（一方的に）今のプランより絶対こっちがお得です、理由は…。",
          good: "今は毎月どのくらいギガを使われますか。月末に足りなくなること、ありますか。",
        },
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
          "整理して返すと、提案が『押し売り』ではなく『相談の答え』になります。お客様自身が『確かにそこが不便だった』と気づけば、こちらが強く勧めなくても前向きに検討してくれます。",
        ],
        keyPoints: ["聞いた内容を要約して返す", "共感で安心感を与える", "課題を合意してから提案へ"],
        tip: "「つまり〜ですね」で要約すると、お客様は『分かってもらえた』と感じます。",
        examples: {
          ng: "（聞きっぱなしで）では商品の説明に移りますね。",
          good: "つまり、動作の重さと月末のギガ不足が気になっている、ということですね。",
        },
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
      { text: "使い方に合う料金プランを選べる", lessonId: "l3-1" },
      { text: "dカードの違いと回収根拠を説明できる", lessonId: "l3-2" },
      { text: "光・home 5G を用途で出し分けできる", lessonId: "l3-3" },
      { text: "3つの価値を1つの提案に束ねられる", lessonId: "l3-4" },
    ],
    recap:
      "料金・dカード・固定回線・家族まとめを、使い方に合わせて束ねる提案を学びました。安さでなく『乗り換え後の生活』で語り、数字は正典で確認するのがコツです。",
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
          "プランは『正解を当てるクイズ』ではありません。お客様の使い方を一緒に確認し、合うものを選ぶ作業です。直近のギガ使用量を見せてもらいながら選ぶと、納得感が大きく変わります。",
        ],
        keyPoints: [
          "安さでなく使い方で選ぶ",
          "ギガ不足=MAX / ポイ活=ポイ活MAX / ライト=mini",
          "実質額は前提条件を添えて正直に",
        ],
        tip: "プラン名を覚えさせるより、「あなたの使い方だとこれ」を一緒に選ぶ感覚で。",
        examples: {
          ng: "一番人気なので無制限にしておきますね。",
          good: "月末によく速度制限にかかるとのことなので、気にせず使える無制限が合いそうです。",
        },
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
          "カードの提案で大事なのは『増やす』ではなく『置き換える』という見せ方です。今の支払いをこの1枚にまとめるだけ、と伝えると心理的なハードルが下がります。年会費の不安は最初に数字で解いておきます。",
        ],
        keyPoints: [
          "GOLDは「料金を下げ・貯め・守る」カード",
          "年会費は割引＋ポイントで回収を数字で示す",
          "利用額が大きい/ポイ活はPLATINUMを試算",
        ],
        tip: "年会費の不安は最初に。回収できる根拠を数字で見せれば、抵抗は小さくなります。",
        examples: {
          ng: "年会費はかかりますが、すぐ元が取れるので大丈夫です。",
          good: "年会費はかかります。ただ毎月の割引とポイントで、ご利用額だと年間でこれだけ戻る計算です。",
        },
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
          "固定回線と生活商材は、スマホ単体より家計全体で効いてきます。自宅のWi-Fi・電気・ガスまで視野に入れると、世帯トータルでのお得を示せます。提供エリアや工事の可否は必ず先に確認しましょう。",
        ],
        keyPoints: [
          "工事可=光 / 工事難=home 5G",
          "家族台数×セット割でトータル試算",
          "でんき・ガスは家計全体の見直しで",
        ],
        tip: "自宅Wi-Fiの有無は必ず確認。光かhome 5Gかは『工事できるか』で分かれます。",
        examples: {
          ng: "とりあえず光がおすすめです。",
          good: "ご自宅は工事できますか。難しければ、挿すだけのhome 5Gが合いそうです。",
        },
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
          "3つの価値（端末・料金・自宅ネット）はバラバラに説明すると弱く、束ねると強くなります。『今より良い毎日』という一つのストーリーにまとめ、その入口として着座と料金診断へ進みましょう。",
        ],
        keyPoints: [
          "端末・料金・自宅ネットを連動させる",
          "生活が良くなる具体像で語る",
          "着座・合意を最初のゴールに置く",
        ],
        tip: "安さの先にある『生活』を見せる。数字より、浮いた時間とお金の使い道を語ります。",
        examples: {
          ng: "トータルでこれだけ安くなります。",
          good: "浮いた分で、ご家族と外食にも行けますね。端末も料金も自宅のネットも一度に整えましょう。",
        },
      },
      {
        id: "l3-5",
        stepId: "step-3",
        no: 5,
        title: "家族まとめとMNP",
        summary: "世帯でまとめる価値と、乗り換えの不安を解く",
        minutes: 14,
        body: [
          "提案は1人ではなく世帯で考えると効果が大きくなります。家族の台数が増えるほどセット割やまとめの効果が効き、トータルの月額で見せられます。",
          "MNP（番号そのまま乗り換え）は、初めての方ほど不安です。番号は変わらず、手続きはこちらで伴走する前提を最初に伝えると、ハードルが一気に下がります。",
          "家族の同意や本人確認書類は、後で手戻りになりやすいポイントです。提案の早い段階で『ご家族の分も一緒に見ますか』『お手続きに必要なものはこちらです』と触れておくと、当日スムーズに進みます。",
        ],
        keyPoints: [
          "1人でなく世帯のトータルで試算する",
          "番号はそのまま・手続きは伴走を最初に伝える",
          "書類・未納・家族の同意を早めに確認する",
        ],
        tip: "「ご家族の分も一緒に見ますか？」の一言で、提案の幅とお得感が広がります。",
        examples: {
          ng: "乗り換えは手続きが多くて大変なんですよね。",
          good: "番号はそのまま、面倒なところは私が一緒に進めます。やることはほぼ確認だけです。",
        },
        scenarioId: "sc4",
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
      { text: "反論をまず受け止められる", lessonId: "l4-1" },
      { text: "回収根拠を数字で示せる", lessonId: "l4-1" },
      { text: "今やる理由を作れる", lessonId: "l4-2" },
      { text: "次の一歩を具体的に促せる", lessonId: "l4-3" },
    ],
    recap:
      "反論はまず受け止め、回収根拠を数字で示し、選択式で決断を小さくする——不安を解いて次の一歩へ導く流れを身につけました。他社経済圏は否定せず差分で勝負します。",
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
          "反論の多くは「断り文句」ではなく「もっと知りたい」のサインです。「高い」の裏には『元が取れるか分からない』、「今はいい」の裏には『今すぐ困っていない』という本音が隠れています。言葉どおりに受け取って引き下がるのではなく、その奥にある疑問に答えるつもりで一歩踏み込みましょう。",
        ],
        keyPoints: [
          "否定せず、まず受け止める",
          "回収根拠を数字で可視化する",
          "不安を一つずつ具体的に潰す",
        ],
        tip: "反論は「YES, and」。否定せず受け止めてから、一緒に確かめる方向へ運びます。",
        examples: {
          ng: "そんなに高くないですよ、他社よりお得です。",
          good: "金額だけ見ると高く感じますよね。実際にお得になるか、一緒に計算してみましょう。",
        },
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
          "クロージングで大切なのは、お客様の決断を小さく分けてあげることです。「契約するかしないか」という大きな決断ではなく、「AとBどちらにするか」「今日進めるか書類をそろえて後日にするか」という選びやすい問いに変えると、心理的なハードルが下がります。決めるのはあくまでお客様だという姿勢を最後まで保ちます。",
        ],
        keyPoints: ["選択式で決めやすくする", "今やる理由を正直に作る", "損失回避の視点で伝える"],
        tip: "「買ってください」より「どちらにしますか」。決断を小さくするのがクロージング。",
        examples: {
          ng: "そろそろ決めていただけますか。",
          good: "お手続きは今日この場でも、書類をそろえて後日でも大丈夫です。どちらが進めやすいですか。",
        },
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
          "申込の場面では、手続きの所要時間や持ち物をあらかじめ具体的に伝えておくと安心感が生まれます。「だいたい15分ほど」「本人確認書類とお支払い方法が分かるものだけご用意ください」と先に示すと、お客様は段取りをイメージでき、迷いが減ります。最後の一押しは勢いではなく、見通しの良さで作ります。",
        ],
        keyPoints: [
          "手続きはこちらが伴走する前提で示す",
          "やることを「確認だけ」に小さくする",
          "未成約でも次につながる宿題を渡す",
        ],
        tip: "「やることはほぼ確認だけ」。手続きの重さは、言葉で軽くしてあげましょう。",
        examples: {
          ng: "あとはお客様の方でお手続きをお願いします。",
          good: "難しいところは私が一緒に進めます。やることはほぼ確認だけなので、ご安心ください。",
        },
        scenarioId: "sc10",
      },
      {
        id: "l4-4",
        stepId: "step-4",
        no: 4,
        title: "他社経済圏への切り返し",
        summary: "「○○で十分」への、否定しない比較の作り方",
        minutes: 13,
        body: [
          "「楽天で十分」「PayPayがあるから」など、すでに使っている経済圏への満足は強い反論です。全否定せず、相手の選択を認めた上で、今の使い方で下がる部分だけに土俵を絞ります。",
          "比較は全項目ではなく、料金・セット割・補償など差が出るポイントだけ。勝てるところで静かに数字を見せます。",
          "他社経済圏への切り返しでは「乗り換えさせる」より「足し算で見直す」発想が効きます。すべてを置き換える提案は抵抗が大きいので、今のお客様の使い方の中で重なっている部分・もったいない部分だけを指摘します。相手の選択を尊重したうえで、改善できる一点に絞ると、対立せずに前へ進めます。",
        ],
        keyPoints: [
          "相手の経済圏を否定しない",
          "差が出るポイントだけに土俵を絞る",
          "勝てる部分を数字で静かに見せる",
        ],
        tip: "相手の正解を否定すると壁ができます。「いいですよね」と認めてから差分の話へ。",
        examples: {
          ng: "楽天はつながりにくいですよ、こっちの方がいいです。",
          good: "楽天さんも良いですよね。その上で、今の使い方だと料金が下がる部分があるので、そこだけ比べましょう。",
        },
        quizModuleId: "p8m1",
        scenarioId: "sc2",
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
      { text: "通しのロープレをやり切れる", lessonId: "l5-1" },
      { text: "難しい相手にも落ち着いて対応できる", lessonId: "l5-1" },
      { text: "コンプライアンスを守れている", lessonId: "l1-4" },
      { text: "次アクションを必ず提示できる", lessonId: "l4-3" },
    ],
    recap:
      "通しのロープレとAI評価で弱点を埋め、認定へ。認定はゴールではなくスタートラインです。現場でも振り返りを続けて伸ばしていきましょう。",
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
          "通しのロープレでは、一つひとつの型の出来よりも「流れの中で自然につながっているか」が問われます。ヒアリングで聞いたことを提案で引用し、提案で触れた価値を反論処理で再利用する。前のステップで得た材料を後のステップで活かせると、会話に一貫性が生まれます。点で覚えた技術を、線でつなぐ練習だと考えてください。",
        ],
        keyPoints: ["通しでやり切る", "AI評価で弱点を特定", "弱点を反復して埋める"],
        tip: "本番だと思ってやり切る。詰まっても止めず、最後のお見送りまで通すのが練習です。",
        examples: {
          ng: "（途中で）えっと、次なんでしたっけ…（止まってしまう）。",
          good: "（詰まっても）少し戻りますね。今のお話だと、こちらが合いそうです。",
        },
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
          "認定試験で確かめたいのは、知識量よりも「お客様の前で安心して任せられるか」です。料金や補償を正確に伝えられること、分からないことを推測で埋めず確認できること、コンプライアンスを崩さないこと。この3つが揃っていれば、現場で困ったときも自分で立て直せます。試験はその土台が身についたかを見る関門です。",
        ],
        keyPoints: [
          "必須レッスン・テスト・ロープレを満たす",
          "認定はスタート",
          "現場でも振り返り続ける",
        ],
        tip: "認定はゴールではなくスタートライン。現場の1件目から、また振り返りを始めましょう。",
        examples: {
          ng: "認定が取れたら、もう勉強しなくて大丈夫。",
          good: "認定はスタート。現場でも、断られた1件を明日の改善メモに変えていきます。",
        },
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

// ===== 用語集 =====
export interface GlossaryItem {
  term: string;
  reading?: string;
  definition: string;
}
export const GLOSSARY: GlossaryItem[] = [
  {
    term: "MNP",
    reading: "エムエヌピー",
    definition: "番号そのまま他社へ乗り換える手続き。お客様の電話番号は変わりません。",
  },
  {
    term: "セット割",
    definition:
      "スマホと固定回線（光・home 5G）などをまとめると毎月の料金が割引される仕組み。家族台数が多いほど効果が大きい。",
  },
  {
    term: "ギガ",
    definition: "毎月使えるデータ通信量のこと。足りないと月末に通信速度が制限される。",
  },
  {
    term: "速度制限",
    reading: "そくどせいげん",
    definition: "規定のデータ量を超えると通信速度が遅くなること。動画やSNSが快適に見られなくなる。",
  },
  {
    term: "dカード GOLD",
    definition:
      "年会費ありのクレジットカード。対象のドコモ利用料金への高い還元やケータイ補償が付く。具体的な数値は公式情報で確認する。",
  },
  {
    term: "ポイ活",
    reading: "ポイかつ",
    definition:
      "d払い・dカードなどの利用でポイントを貯め、支払いに充てる活用法。ポイ活MAX等と相性が良い。",
  },
  {
    term: "home 5G",
    reading: "ホームファイブジー",
    definition:
      "コンセントに挿すだけで自宅がWi-Fiになる据え置き型ルーター。光の工事が難しい家庭向け。",
  },
  {
    term: "着座",
    reading: "ちゃくざ",
    definition: "お客様に座っていただき、腰を据えて料金診断・提案を行う状態。最初のゴールに置く。",
  },
  {
    term: "自責思考",
    reading: "じせきしこう",
    definition:
      "結果を相手や環境のせいにせず、自分の伝え方をどう変えるかで考える姿勢。成長を最速にする。",
  },
  {
    term: "クロージング",
    definition:
      "提案を申込み（次の一歩）につなげる最後の働きかけ。選択式や『今やる理由』で背中を押す。",
  },
];

// ===== おすすめ動画（プレースホルダ） =====
export interface VideoContent {
  id: string;
  title: string;
  description: string;
  duration: string;
  accent: Accent;
}
export const RECOMMENDED: VideoContent[] = [
  {
    id: "v1",
    title: "接客の基本マナー",
    description: "第一印象を決める挨拶・身だしなみ・声のトーン",
    duration: "6:24",
    accent: "blue",
  },
  {
    id: "v2",
    title: "効果的なヒアリング方法",
    description: "聞き出す質問の順番と、沈黙の使い方",
    duration: "8:10",
    accent: "teal",
  },
  {
    id: "v3",
    title: "断られた時の対応方法",
    description: "反論を受け止めてから切り返す型",
    duration: "5:47",
    accent: "orange",
  },
  {
    id: "v4",
    title: "dカード提案のロールプレイ",
    description: "年会費の不安を数字で解くトーク実演",
    duration: "7:32",
    accent: "green",
  },
  {
    id: "v5",
    title: "家族まとめ提案のコツ",
    description: "世帯トータルでお得を見せる流れ",
    duration: "6:58",
    accent: "blue",
  },
  {
    id: "v6",
    title: "クロージングの一押し",
    description: "決断を小さくする選択式の問いかけ",
    duration: "4:50",
    accent: "orange",
  },
];

// ===== 成功事例 =====
export const SUCCESS_CASE = {
  description: "先輩スタッフの対応事例から、現場で効くコツを学べます。",
  members: ["佐藤 健", "鈴木 美咲", "田中 太郎"],
};

export interface SuccessCase {
  id: string;
  name: string;
  role: string;
  store: string;
  tone: Accent;
  situation: string;
  approach: string;
  result: string;
}
export const SUCCESS_CASES: SuccessCase[] = [
  {
    id: "case-1",
    name: "佐藤 健",
    role: "入社3ヶ月",
    store: "府中店",
    tone: "blue",
    situation: "「今ので困っていない」と通り過ぎようとするお客様。",
    approach:
      "売り込まず「月末にギガが足りるかだけ一緒に見ませんか」と小さな確認に誘い、不満を可視化。",
    result: "速度制限のストレスに気づいてもらい、無制限プランとセット割で着座・成約。",
  },
  {
    id: "case-2",
    name: "鈴木 美咲",
    role: "入社1年",
    store: "新宿店",
    tone: "teal",
    situation: "「年会費が高い」とdカードに強い抵抗。",
    approach: "否定せず受け止め、毎月の割引とポイントを実利用額で試算して紙に書いて提示。",
    result: "「これなら逆にお得」と納得し、GOLDへ切り替え。後日ご家族も来店。",
  },
  {
    id: "case-3",
    name: "田中 太郎",
    role: "入社6ヶ月",
    store: "渋谷店",
    tone: "orange",
    situation: "「楽天で十分」と他社経済圏に満足。",
    approach: "全否定せず「いいですよね」と認め、料金とセット割の差分だけに土俵を絞って比較。",
    result: "下がる部分に納得し、固定回線セットで乗り換え。紹介にもつながった。",
  },
];

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
