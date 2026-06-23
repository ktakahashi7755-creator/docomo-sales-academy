import type {
  Announcement,
  Badge,
  CertCondition,
  DifficultyDef,
  EvalItem,
  ManagedUser,
  ObjectionHandler,
  Phase,
  Product,
  RankDef,
  Scenario,
  TalkScript,
} from "@/lib/types";

// ===== Level 0..10 =====
export const RANKS: RankDef[] = [
  { level: 0, label: "未経験" },
  { level: 1, label: "基礎理解" },
  { level: 2, label: "商材説明可能" },
  { level: 3, label: "ヒアリング可能" },
  { level: 4, label: "提案可能" },
  { level: 5, label: "反論処理可能" },
  { level: 6, label: "セット提案可能" },
  { level: 7, label: "クロージング可能" },
  { level: 8, label: "自走ヘルパー" },
  { level: 9, label: "クローザー候補" },
  { level: 10, label: "認定クローザー" },
];

// ===== 研修ロードマップ Phase 1..10 =====
export const PHASES: Phase[] = [
  {
    id: "p1",
    no: 1,
    title: "現場基礎",
    summary: "ヘルパーの役割、店内/イベント/外販の動き、受付から提案までの流れ、コンプライアンス。",
    modules: [
      {
        id: "p1m1",
        title: "携帯販売ヘルパーの役割",
        passing_score: 80,
        required: true,
        estimated_minutes: 15,
      },
      {
        id: "p1m2",
        title: "店内・イベント・外販の動き方",
        passing_score: 80,
        required: true,
        estimated_minutes: 20,
      },
      {
        id: "p1m3",
        title: "受付から提案までの流れ",
        passing_score: 80,
        required: true,
        estimated_minutes: 15,
      },
      {
        id: "p1m4",
        title: "個人情報・コンプライアンス／やってはいけないこと",
        passing_score: 100,
        required: true,
        estimated_minutes: 20,
      },
    ],
  },
  {
    id: "p2",
    no: 2,
    title: "商材基礎",
    summary: "料金プラン（MAX / ポイ活MAX / mini）、ahamoとの違い、家族まとめの考え方。",
    modules: [
      {
        id: "p2m1",
        title: "ドコモ料金プラン（MAX / ポイ活MAX / mini）",
        passing_score: 80,
        required: true,
        estimated_minutes: 25,
      },
      {
        id: "p2m2",
        title: "ahamoとの違い・通話オプション",
        passing_score: 80,
        required: true,
        estimated_minutes: 15,
      },
      {
        id: "p2m3",
        title: "ギガ使用量の確認・家族まとめ",
        passing_score: 80,
        required: true,
        estimated_minutes: 15,
      },
    ],
  },
  {
    id: "p3",
    no: 3,
    title: "dカード",
    summary: "レギュラー / GOLD / PLATINUM。年会費・還元・補償と、GOLD/PLATINUM提案・反論処理。",
    modules: [
      {
        id: "p3m1",
        title: "dカード 3種の違い（年会費・還元・補償）",
        passing_score: 80,
        required: true,
        estimated_minutes: 20,
      },
      {
        id: "p3m2",
        title: "GOLD提案トーク",
        passing_score: 90,
        required: true,
        estimated_minutes: 25,
      },
      {
        id: "p3m3",
        title: "PLATINUM提案トーク",
        passing_score: 90,
        required: true,
        estimated_minutes: 25,
      },
      {
        id: "p3m4",
        title: "dカード 反論処理",
        passing_score: 80,
        required: true,
        estimated_minutes: 20,
      },
    ],
  },
  {
    id: "p4",
    no: 4,
    title: "固定商材",
    summary: "ドコモ光 1ギガ / 10ギガ、事業者変更・転用、光セット提案、home 5Gとの違い。",
    modules: [
      {
        id: "p4m1",
        title: "ドコモ光 1ギガ / 10ギガ",
        passing_score: 80,
        required: true,
        estimated_minutes: 20,
      },
      {
        id: "p4m2",
        title: "事業者変更・転用・乗り換え手順",
        passing_score: 80,
        required: true,
        estimated_minutes: 20,
      },
      {
        id: "p4m3",
        title: "光セット提案 / home 5Gとの違い",
        passing_score: 80,
        required: true,
        estimated_minutes: 15,
      },
    ],
  },
  {
    id: "p5",
    no: 5,
    title: "生活商材",
    summary: "ドコモでんき・ガス。切替メリット、家計全体での提案、dポイント還元、注意事項。",
    modules: [
      {
        id: "p5m1",
        title: "ドコモでんき・ガスの基礎",
        passing_score: 80,
        required: true,
        estimated_minutes: 15,
      },
      {
        id: "p5m2",
        title: "家計全体での提案・dポイント還元",
        passing_score: 80,
        required: true,
        estimated_minutes: 15,
      },
    ],
  },
  {
    id: "p6",
    no: 6,
    title: "ヒアリング",
    summary: "利用キャリア・料金・家族構成・光・支払い・ポイント・機種年数・不満・乗り換え意欲。",
    modules: [
      {
        id: "p6m1",
        title: "基本ヒアリングの型",
        passing_score: 80,
        required: true,
        estimated_minutes: 20,
      },
      {
        id: "p6m2",
        title: "不満・乗り換え意欲の引き出し",
        passing_score: 80,
        required: true,
        estimated_minutes: 15,
      },
    ],
  },
  {
    id: "p7",
    no: 7,
    title: "提案設計",
    summary: "単品 / セット / 家族まとめ / MNP / 機種変更 / dカード / 光 / でんき・ガス / ポイ活。",
    modules: [
      {
        id: "p7m1",
        title: "単品提案・セット提案",
        passing_score: 80,
        required: true,
        estimated_minutes: 20,
      },
      {
        id: "p7m2",
        title: "家族まとめ・MNP・ポイ活提案",
        passing_score: 80,
        required: true,
        estimated_minutes: 20,
      },
    ],
  },
  {
    id: "p8",
    no: 8,
    title: "反論処理",
    summary: "高い／面倒／家族に確認／今はいい／カードはいらない／他社で十分 などへの切り返し。",
    modules: [
      {
        id: "p8m1",
        title: "価格・面倒・保留への切り返し",
        passing_score: 80,
        required: true,
        estimated_minutes: 25,
      },
      {
        id: "p8m2",
        title: "他社経済圏への切り返し",
        passing_score: 80,
        required: true,
        estimated_minutes: 20,
      },
    ],
  },
  {
    id: "p9",
    no: 9,
    title: "クロージング",
    summary: "選択肢／損失回避／今やる理由／家族まとめ／カード切替／光セット／最後の一押し。",
    modules: [
      {
        id: "p9m1",
        title: "クロージングの型",
        passing_score: 80,
        required: true,
        estimated_minutes: 25,
      },
      {
        id: "p9m2",
        title: "申込誘導・最後の一押し",
        passing_score: 80,
        required: true,
        estimated_minutes: 20,
      },
    ],
  },
  {
    id: "p10",
    no: 10,
    title: "認定試験",
    summary: "商材テスト／接客・反論処理・セット提案・クロージングロープレ／SV評価／認定判定。",
    modules: [
      {
        id: "p10m1",
        title: "商材テスト（90点以上）",
        passing_score: 90,
        required: true,
        estimated_minutes: 30,
      },
      {
        id: "p10m2",
        title: "総合ロープレ＋SV評価",
        passing_score: 80,
        required: true,
        estimated_minutes: 40,
      },
    ],
  },
];

// ===== 商材ナレッジ =====
export const PRODUCTS: Product[] = [
  {
    id: "dcard-gold",
    name: "dカード GOLD",
    category: "dカード",
    tier: "gold",
    oneLiner: "年会費11,000円。毎月の割引・ポイント還元・ケータイ補償を1枚に。",
    target: "ドコモのスマホ・光を毎月1万円前後利用しているお客様。",
    benefits: [
      "携帯料金から最大550円割引（年間約6,600円）",
      "対象のドコモ利用料金に10%ポイント還元（例：約1,000P/月＝年間約12,000P）",
      "割引＋ポイントで年間約18,600円相当。年会費11,000円でも実質プラス",
      "ケータイ補償：紛失・盗難・水濡れ・修理不能で最大12万円まで（※適用条件あり）",
    ],
    warnings: [
      "年会費・還元率・補償条件は変更される可能性があるため、必ず公式情報と最終確認日を照合する",
      "10%還元は対象のドコモ利用料金が前提。利用額が小さいお客様は回収イメージを丁寧に説明する",
    ],
    timing: "料金診断後、毎月のドコモ利用額が確認できたタイミング。",
    hearing: [
      "現在のdカードの利用状況（未保有 / レギュラー）",
      "毎月のスマホ＋光のおおよその支払額",
      "スマホの利用年数・買い替え意向",
    ],
    pitch: [
      "11,000円は割引とポイントで回収できる前提で話す",
      "割引（約6,600円）とポイント（約12,000P）を合算し「約18,600円相当」と示す",
      "高額化したスマホの補償（最大12万円）で安心感を上乗せ",
    ],
    objections: [
      {
        q: "年会費が高い",
        a: "割引約6,600円＋ポイント約12,000Pで実質プラスになる使い方を一緒に確認しましょう。",
      },
      {
        q: "ポイントは使わない",
        a: "d払いや毎月の携帯料金の支払いに自動で充当できるので、使い道に困りません。",
      },
    ],
    closing:
      "GOLDは「年会費を払うカード」ではなく、毎月の料金を下げ・ポイントを貯め・高額スマホを守る3つを付けられるカードです。今回一緒に切り替えておきましょう。",
    officialUrl: "https://dcard.docomo.ne.jp/std/member/gold/",
    officialCheckedAt: "2024-06-01",
    version: 1,
  },
  {
    id: "dcard-platinum",
    name: "dカード PLATINUM",
    category: "dカード",
    tier: "platinum",
    oneLiner: "年会費29,700円。最大20%（ポイ活MAXで最大30%）還元と最高クラスの補償。",
    target: "毎月のドコモ利用額が大きい、またはカード利用額が多い・ポイ活MAX利用のお客様。",
    benefits: [
      "対象利用料金に最大20%還元（例：15,000円/月利用で約3,000P/月＝年間約36,000P）",
      "年間利用特典：100万円達成で10,000円相当、200万円達成で20,000円相当 など",
      "スマホ補償最大20万円。新品の好きな機種への買い替えもOK",
      "ポイ活MAX利用なら最大30%還元（例：15,000円/月で約4,500P/月＝年間約54,000P）",
    ],
    warnings: [
      "還元率・特典・補償条件は変更される可能性があるため、必ず公式情報と最終確認日を照合する",
      "最大還元率は対象利用分に対して。お客様の実利用額で試算して提示する",
    ],
    timing: "GOLD利用中で利用額が大きいお客様、ポイ活MAX検討中のお客様。",
    hearing: [
      "現在GOLDか／毎月のドコモ利用額",
      "カードの年間利用額（普段の買い物をまとめられるか）",
      "ポイ活MAXの利用・検討状況",
    ],
    pitch: [
      "GOLD10%→PLATINUM20%の差を、実利用額で試算して見せる",
      "年間利用特典でさらに戻る点を加える",
      "ポイ活MAX利用者には最大30%還元の相性の良さを強調",
    ],
    objections: [
      {
        q: "年会費が高い／そこまで必要ない",
        a: "実利用額で試算すると、ポイントだけで年会費を超える方が多いので一度計算してみましょう。",
      },
      {
        q: "GOLDで二重に年会費がかかりそう",
        a: "切替時は11,000円が相殺され、実質18,700円で初年度お試しできます。合わなければGOLDに戻せます。",
      },
    ],
    closing:
      "年間4〜5万ポイントを狙える使い方ならPLATINUMにしない方がもったいないです。初年度は実質18,700円でお試しし、貯まり方を見て判断しましょう。",
    officialUrl: "https://dcard.docomo.ne.jp/std/member/platinum/",
    officialCheckedAt: "2024-06-01",
    version: 1,
  },
  {
    id: "dcard-regular",
    name: "dカード（レギュラー）",
    category: "dカード",
    tier: "regular",
    oneLiner: "年会費無料。d払い・dポイントの入口。GOLDへの導線に。",
    target: "まずdポイントを貯め始めたい、年会費を払いたくないお客様。",
    benefits: ["年会費永年無料", "d払い・買い物でdポイントが貯まる", "GOLD提案の足がかりになる"],
    warnings: ["ケータイ料金10%還元・ケータイ補償はGOLD特典。レギュラーとの違いを明確に伝える"],
    timing: "カード未保有・年会費に強い抵抗があるお客様。",
    hearing: ["カード保有状況", "毎月のドコモ利用額（GOLD回収可能か）"],
    pitch: ["まず無料で作り、利用額が大きければGOLDへ切替提案"],
    objections: [
      {
        q: "カードは増やしたくない",
        a: "今の携帯料金の支払いをまとめるだけでポイントが貯まる入口として無料で持てます。",
      },
    ],
    closing: "まずは無料のレギュラーから始めて、利用額が見えたらGOLDをご案内します。",
    officialUrl: "https://dcard.docomo.ne.jp/std/member/regular/",
    officialCheckedAt: "2024-06-01",
    version: 1,
  },
  {
    id: "hikari-1g",
    name: "ドコモ光 1ギガ",
    category: "ドコモ光",
    oneLiner: "スマホとのセット割で家族全体の通信費を圧縮する固定回線。",
    target: "自宅でネットを使う、家族でドコモを利用しているお客様。",
    benefits: [
      "スマホとの光セット割",
      "家族台数が多いほどセット割の効果が大きい",
      "dポイント還元・各種特典",
    ],
    warnings: ["他社光の解約金・工事の有無を必ず確認", "提供エリア・プロバイダを確認"],
    timing: "家族でドコモ利用、自宅ネットが他社または未契約のお客様。",
    hearing: ["現在の光回線（他社/未契約/不明）", "家族のドコモ回線数", "工事可否・建物タイプ"],
    pitch: ["家族台数×セット割でトータルの月額を試算して見せる"],
    objections: [
      {
        q: "光は変えたくない",
        a: "番号も使い方も変わらず、月額だけ下げられるケースが多いので一度試算しましょう。",
      },
    ],
    closing: "家族まとめでセット割が効くので、トータルで毎月いくら下がるかを出してご案内します。",
    officialUrl: "https://www.docomo.ne.jp/hikari/",
    officialCheckedAt: "2024-06-01",
    version: 1,
  },
  {
    id: "hikari-10g",
    name: "ドコモ光 10ギガ",
    category: "ドコモ光",
    oneLiner: "在宅勤務・オンラインゲーム・大容量動画に強い超高速プラン。",
    target: "速度を重視する、在宅勤務やゲーム・動画視聴が多いお客様。",
    benefits: ["最大10Gbpsの高速通信", "複数端末の同時利用に強い", "光セット割の対象"],
    warnings: ["提供エリア・対応プロバイダ・対応ルーターを確認", "1ギガとの料金差を説明"],
    timing: "速度の不満があるお客様、ゲーム/在宅勤務ユーザー。",
    hearing: ["利用用途（ゲーム/在宅/動画）", "同時接続台数", "提供エリア"],
    pitch: ["用途に対する速度の体感差を具体的に説明する"],
    objections: [
      {
        q: "1ギガで十分",
        a: "同時利用や在宅勤務が多い場合は10ギガの安定感が効きます。用途で選びましょう。",
      },
    ],
    closing: "用途を伺うと10ギガが合いそうなので、エリアを確認してご案内します。",
    officialUrl: "https://www.docomo.ne.jp/hikari/",
    officialCheckedAt: "2024-06-01",
    version: 1,
  },
  {
    id: "denki",
    name: "ドコモでんき",
    category: "ドコモでんき",
    oneLiner: "工事不要・切替手続きはほぼ完結。支払いでdポイントが貯まる電気。",
    target: "現在の電力会社からの切替に抵抗が少ない、家計を見直したいお客様。",
    benefits: [
      "多くの場合、工事不要・解約手続き不要",
      "dカード支払いでdポイント還元",
      "家計全体での提案がしやすい",
    ],
    warnings: ["現在の電力会社・検針票の確認", "還元条件・対象プランの確認"],
    timing: "料金診断で家計全体を見直すタイミング。",
    hearing: ["現在の電力会社", "検針票（使用量・料金）", "支払い方法"],
    pitch: ["スマホ・カードと合わせdポイントが貯まる動線を示す"],
    objections: [
      {
        q: "電気はそのままでいい",
        a: "切替の手間はほぼなく、支払いでポイントが貯まる分だけお得になります。",
      },
    ],
    closing: "検針票を拝見して、切替後にどれだけポイントが貯まるかを出してご案内します。",
    officialUrl: "https://denki.docomo.ne.jp/",
    officialCheckedAt: "2024-06-01",
    version: 1,
  },
  {
    id: "gas",
    name: "ドコモガス",
    category: "ドコモガス",
    oneLiner: "電気とセットで家計をまとめ、dポイント還元を上乗せ。",
    target: "ドコモでんきと合わせて家計をまとめたいお客様。",
    benefits: ["電気とセットでまとめやすい", "dポイント還元", "支払い窓口の一本化"],
    warnings: ["提供エリア・対象ガス種別を確認", "現在のガス会社の契約条件を確認"],
    timing: "ドコモでんき提案と同時。",
    hearing: ["現在のガス会社", "提供エリア", "電気とのセット可否"],
    pitch: ["電気・ガス・スマホ・カードの合算でポイントの貯まりやすさを示す"],
    objections: [
      {
        q: "ガスまでは…",
        a: "電気と一緒にまとめると窓口が一本化でき、ポイントもさらに貯まります。",
      },
    ],
    closing: "電気と合わせてまとめると分かりやすいので、セットでご案内します。",
    officialUrl: "https://www.docomo.ne.jp/",
    officialCheckedAt: "2024-06-01",
    version: 1,
  },
];

// ===== トークスクリプト（POPからの正データ） =====
export const TALK_SCRIPTS: TalkScript[] = [
  {
    id: "ts-gold",
    title: "dカード GOLD 訴求トークスクリプト（新人向け）",
    category: "dカード／GOLD／新人向け",
    productId: "dcard-gold",
    target: "ドコモのスマホ・光を毎月1万円前後利用しているお客様",
    difficulty: 4,
    timing: "料金診断後、毎月のドコモ利用額が見えたタイミング",
    sections: [
      {
        heading: "① 年会費の不安を消す",
        lines: [
          "まずdカード GOLDなんですが、年会費が11,000円かかります。",
          "正直、11,000円って聞くと『高いな』『普通のカードでいいかな』って思いますよね。",
          "ただ実は、使い方次第で年会費以上にメリットが出る方が多いので、そこだけ簡単に見てください。",
        ],
      },
      {
        heading: "② 毎月の割引メリット",
        lines: [
          "まず毎月の携帯料金から最大550円割引が入ります。",
          "550円 × 12ヶ月なので、年間約6,600円分お得になります。",
        ],
        note: "11,000円 − 6,600円 ＝ 残り約4,400円",
      },
      {
        heading: "③ dポイント還元",
        lines: [
          "ちなみに毎月スマホやドコモ光で大体1万円前後お支払いされていますよね。",
          "dカード GOLDの場合、対象のドコモ利用料金に対してポイント還元があります。",
          "例えば月1,000ポイント近く貯まる方だと、1,000P × 12ヶ月で年間約12,000ポイントになります。",
          "ここまで見ると、割引が約6,600円、ポイントが約12,000P。合わせて年間約18,600円分相当になるので、年会費11,000円を払ってもむしろプラスになるイメージです。",
        ],
      },
      {
        heading: "④ ケータイ補償で安心感を出す",
        lines: [
          "さらに大きいのが携帯補償です。",
          "例えば、紛失、盗難、水濡れ、修理できない故障。こういった時に、条件を満たせば最大12万円まで補償を受けられる可能性があります。",
          "最近スマホは10万円以上する機種も多いので、ここがかなり安心です。",
        ],
        note: "※適用条件があります。",
      },
      {
        heading: "⑤ 最後のクロージング",
        lines: [
          "なのでdカード GOLDは、年会費11,000円かかるカードというより、毎月の料金を下げる・ポイントを貯める・高額スマホを守る。この3つを付けられるカードです。",
          "実際に多くのドコモユーザー様が利用されているので、今の使い方ならGOLDに変えた方がお得になる可能性が高いです。",
          "今回一緒にお手続きしておきましょう。",
        ],
      },
    ],
    ngExamples: [
      "年会費の話を曖昧にして先に進める（不安が残り後で断られる）",
      "回収根拠（割引・ポイント）を示さず『お得です』だけで押す",
    ],
    goodExamples: [
      "11,000円 − 割引6,600円 − ポイント12,000P で『実質プラス』を数字で見せる",
      "高額スマホの補償（最大12万円）で安心を上乗せしてからクロージング",
    ],
    note: "数値・還元条件・補償条件は必ず公式情報と最終確認日で照合する。",
  },
  {
    id: "ts-platinum",
    title: "dカード PLATINUM 提案トーク（新人向け）",
    category: "dカード／PLATINUM／新人向け",
    productId: "dcard-platinum",
    target: "GOLD利用中で利用額が大きい・ポイ活MAX検討中のお客様",
    difficulty: 7,
    timing: "GOLD利用が確認でき、毎月の利用額が大きいと分かったタイミング",
    sections: [
      {
        heading: "① 年会費の不安解除",
        lines: [
          "まずdカード PLATINUMですが、年会費が29,700円になります。",
          "正直ここだけ見ると、『高い』『そこまで必要ない』って思いますよね。",
          "ただ、本当に高いのか実際にお見せしながら計算してみます。",
        ],
      },
      {
        heading: "② ポイント還元で回収",
        lines: [
          "GOLDの場合は対象の携帯料金や光料金に10%還元ですが、PLATINUMになると最大20%還元にアップします。",
          "例えばスマホ＋ドコモ光などで月約15,000円利用の場合、20%還元なら約3,000P/月。",
          "3,000P × 12ヶ月で、年間約36,000P。ここだけで年会費29,700円を超えてきます。",
        ],
        note: "※対象利用分に対して",
      },
      {
        heading: "③ 年間利用特典",
        lines: [
          "さらに普段のお買い物もまとめると特典があります。",
          "年間100万円達成で10,000円相当特典、年間200万円達成で20,000円相当特典 など。",
          "普段の支払いを変えるだけでさらに戻ってきます。",
        ],
      },
      {
        heading: "④ ケータイ補償",
        lines: [
          "そして一番安心なのが携帯補償です。最近スマホは20万円近い機種もあります。",
          "紛失・盗難・水濡れ・破損・修理不能などでも、PLATINUMなら最大20万円まで補償。新品の好きな機種に買い替えてもOKです。",
        ],
      },
      {
        heading: "⑤ ポイ活MAX利用者への提案",
        lines: [
          "さらにポイ活MAXを使う方だと相性がかなり良いです。",
          "例えば月15,000円対象利用で最大30%還元なら、約4,500P/月。年間約54,000P。年会費29,700円でも大きくプラスになります。",
        ],
      },
      {
        heading: "⑥ GOLDユーザーへのクロージング",
        lines: [
          "しかも今GOLDをご利用中ですよね。年会費が二重でかかるわけではなく、すでにお支払いの11,000円は重複せず相殺されます。",
          "なので実質18,700円で初年度お試しいただけます。ポイントの貯まり方を見て、合わなければGOLDに戻すこともできます。",
          "年間4〜5万ポイントを狙える使い方なら、正直PLATINUMにしない方がもったいないです。今回一度PLATINUMで最大限ポイントを貯められる形にしておきましょう。",
        ],
      },
    ],
    ngExamples: [
      "年会費29,700円だけを伝えて回収根拠を示さない",
      "GOLDからの切替で『二重に年会費がかかる』と誤解させたまま進める",
    ],
    goodExamples: [
      "実利用額で20%／30%還元を試算し『ポイントだけで年会費超え』を見せる",
      "切替は相殺で実質18,700円・戻せる安心をセットで提示",
    ],
    note: "数値・還元条件・補償条件は必ず公式情報と最終確認日で照合する。",
  },
];

// ===== 反論処理（抜粋） =====
export const OBJECTIONS: ObjectionHandler[] = [
  {
    id: "obj-expensive",
    objection: "高い",
    background: "年会費や月額の総額だけを見て、得られる価値と比較できていない。",
    ng: "「そんなに高くないですよ」と価格を軽視する。",
    good: "「金額だけ見ると高く感じますよね。実際にお得になるか一緒に計算してみましょう」と回収根拠に話を移す。",
    reframe: "割引・ポイント・補償の合計額を出し、実質の負担額を可視化する。",
    closing: "実質プラスになる使い方が見えたので、今回一緒に切り替えておきましょう。",
  },
  {
    id: "obj-family",
    objection: "家族に確認したい",
    background: "その場で決める権限・情報が不足、または断る口実。",
    ng: "「今だけのお得ですよ」と急かす。",
    good: "「もちろんです。ご家族に説明しやすいよう、ポイントを1枚にまとめておきますね」と判断材料を整える。",
    reframe: "家族まとめで世帯全体がお得になる点を、確認用メモにして渡す。",
    closing: "ご家族に見せやすい形にまとめました。手続きはお戻りいただいた当日でも進められます。",
  },
  {
    id: "obj-card",
    objection: "カードは増やしたくない",
    background: "管理が面倒・使わないカードが増える懸念。",
    ng: "「1枚くらい大丈夫ですよ」と押す。",
    good: "「今の携帯料金の支払いをこの1枚にまとめるだけで、増やすというより置き換えるイメージです」と整理する。",
    reframe: "新規追加ではなく、既存支払いの置き換えとして説明する。",
    closing: "増やすのではなく置き換えなので、今の支払いをそのままお得にできます。",
  },
  {
    id: "obj-rakuten",
    objection: "楽天で十分",
    background: "既存経済圏への満足・乗り換えの手間懸念。",
    ng: "他社を否定する。",
    good: "「楽天さんも良いですよね。その上で、今の使い方だとドコモ側の方が下がる部分があるので、そこだけ比較しましょう」と土俵を絞る。",
    reframe: "全否定せず、料金・セット割・補償の差分だけを比較する。",
    closing: "比較すると下がる部分が見えたので、その分だけ今回お得にしておきましょう。",
  },
];

// ===== ロープレ顧客シナリオ 10件 =====
export const SCENARIOS: Scenario[] = [
  {
    id: "sc1",
    no: 1,
    title: "楽天・一人暮らし・料金重視",
    carrier: "楽天モバイル",
    familyType: "一人利用",
    internetLine: "未契約",
    interest: "普通",
    resistance: "普通",
    difficulty: 3,
    goal: "料金診断・MNP提案",
  },
  {
    id: "sc2",
    no: 2,
    title: "SB・家族4人・SB光・PayPay圏",
    carrier: "ソフトバンク",
    familyType: "家族利用",
    internetLine: "ソフトバンク光",
    interest: "普通",
    resistance: "高い",
    difficulty: 6,
    goal: "セット提案",
  },
  {
    id: "sc3",
    no: 3,
    title: "au・夫婦・auひかり・カード抵抗",
    carrier: "au",
    familyType: "夫婦利用",
    internetLine: "auひかり",
    interest: "低い",
    resistance: "高い",
    difficulty: 7,
    goal: "dカード提案",
  },
  {
    id: "sc4",
    no: 4,
    title: "ワイモバイル・家族・サポート不満",
    carrier: "ワイモバイル",
    familyType: "家族利用",
    internetLine: "不明",
    interest: "普通",
    resistance: "普通",
    difficulty: 5,
    goal: "家族まとめ提案",
  },
  {
    id: "sc5",
    no: 5,
    title: "UQ・通信品質不満・光検討",
    carrier: "UQモバイル",
    familyType: "一人利用",
    internetLine: "未契約",
    interest: "高い",
    resistance: "普通",
    difficulty: 4,
    goal: "ドコモ光提案",
  },
  {
    id: "sc6",
    no: 6,
    title: "ドコモ既存・レギュラー・GOLD対象",
    carrier: "ドコモ既存",
    familyType: "一人利用",
    internetLine: "ドコモ光",
    interest: "普通",
    resistance: "普通",
    difficulty: 4,
    goal: "dカード提案（GOLD）",
  },
  {
    id: "sc7",
    no: 7,
    title: "ドコモ既存・GOLD・PLATINUM対象",
    carrier: "ドコモ既存",
    familyType: "家族利用",
    internetLine: "ドコモ光",
    interest: "高い",
    resistance: "高い",
    difficulty: 7,
    goal: "PLATINUM提案・ポイ活MAX",
  },
  {
    id: "sc8",
    no: 8,
    title: "高齢・操作不安・店舗サポート重視",
    carrier: "ドコモ既存",
    familyType: "一人利用",
    internetLine: "不明",
    interest: "普通",
    resistance: "普通",
    difficulty: 5,
    goal: "機種変更提案",
  },
  {
    id: "sc9",
    no: 9,
    title: "家族確認が必要・即決しない",
    carrier: "au",
    familyType: "家族利用",
    internetLine: "不明",
    interest: "低い",
    resistance: "高い",
    difficulty: 8,
    goal: "クロージング",
  },
  {
    id: "sc10",
    no: 10,
    title: "料金に非常に厳しい・即決拒否",
    carrier: "ソフトバンク",
    familyType: "一人利用",
    internetLine: "未契約",
    interest: "低い",
    resistance: "高い",
    difficulty: 9,
    goal: "クロージング",
  },
];

/**
 * ダッシュボード／ロープレ既定で使うおすすめシナリオ（並び順に依存せず意味で選ぶ）。
 * SCENARIOS は常に非空（上で定義）のため `SCENARIOS[0]` フォールバックは必ず存在する。
 */
export const RECOMMENDED_SCENARIO: Scenario =
  SCENARIOS.find((s) => s.goal.includes("PLATINUM")) ?? SCENARIOS[0];

// ===== 難易度定義 1..10 =====
export const DIFFICULTY: DifficultyDef[] = [
  { level: 1, desc: "非常に協力的。質問に素直に答える。" },
  { level: 2, desc: "少し迷うが、説明を聞いてくれる。" },
  { level: 3, desc: "料金に少し不満がある。" },
  { level: 4, desc: "他社との比較を求める。" },
  { level: 5, desc: "家族確認を理由に保留する。" },
  { level: 6, desc: "カードや光に抵抗がある。" },
  { level: 7, desc: "過去に嫌な経験があり警戒している。" },
  { level: 8, desc: "他社に強いこだわりがある。" },
  { level: 9, desc: "質問が多く、即決しない。" },
  { level: 10, desc: "非常に難しい。反論が多く、クロージング力が必要。" },
];

// ===== ロープレ評価項目 =====
export const EVAL_ITEMS: EvalItem[] = [
  { key: "greeting", label: "挨拶" },
  { key: "icebreak", label: "アイスブレイク" },
  { key: "hearing", label: "ヒアリング" },
  { key: "discover", label: "課題発見" },
  { key: "product", label: "商材理解" },
  { key: "fit", label: "お客様に合わせた提案" },
  { key: "numbers", label: "数値説明" },
  { key: "clarity", label: "分かりやすさ" },
  { key: "objection", label: "反論処理" },
  { key: "closing", label: "クロージング" },
  { key: "compliance", label: "コンプライアンス" },
  { key: "next", label: "次アクション提示" },
];

// ===== バッジ =====
export const BADGES: Badge[] = [
  { id: "b-first", name: "ファーストステップ", description: "最初のモジュールに合格" },
  { id: "b-gold", name: "GOLDトークマスター", description: "GOLD提案ロープレでA評価" },
  { id: "b-platinum", name: "PLATINUMトークマスター", description: "PLATINUM提案ロープレでA評価" },
  { id: "b-set", name: "セット提案", description: "セット提案ロープレに合格" },
  { id: "b-hard", name: "難敵突破", description: "難易度7以上でA評価を3回" },
];

// ===== クローザー認定条件 =====
export const CERT_CONDITIONS: readonly CertCondition[] = [
  { id: "c1", label: "全必須モジュール合格" },
  { id: "c2", label: "商材テスト90点以上" },
  { id: "c3", label: "コンプライアンステスト100点" },
  { id: "c4", label: "音声ロープレ平均80点以上" },
  { id: "c5", label: "難易度7以上のロープレでA評価3回以上" },
  { id: "c6", label: "dカード提案ロープレ合格" },
  { id: "c7", label: "光提案ロープレ合格" },
  { id: "c8", label: "セット提案ロープレ合格" },
  { id: "c9", label: "クロージングロープレ合格" },
  { id: "c10", label: "SV承認" },
] as const;

// ===== 管理画面のデモ用ユーザー名簿 =====
export const DEMO_USERS: ManagedUser[] = [
  { id: "u-1", display_name: "田中 太郎", role: "trainee", store_name: "府中店", is_active: true },
  { id: "u-2", display_name: "鈴木 花子", role: "helper", store_name: "新宿店", is_active: true },
  { id: "u-3", display_name: "佐藤 健", role: "closer", store_name: "渋谷店", is_active: true },
  { id: "u-4", display_name: "渡辺 美咲", role: "sv", store_name: "本部", is_active: true },
  { id: "u-5", display_name: "中村 一郎", role: "admin", store_name: "本部", is_active: true },
];

// ===== お知らせ（管理画面で編集。学習者ダッシュボードに表示） =====
export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: "an-1",
    title: "商材情報の確認をお願いします",
    body: "料金・還元・補償条件は変更されることがあります。提案前に各商材の公式ページと最終確認日を確かめてください。",
    severity: "info",
    isActive: true,
    updatedAt: "2026-06-01",
  },
];
