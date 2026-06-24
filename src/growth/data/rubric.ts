// SV評価ルーブリックと育成ロードマップ。深掘りリサーチの評価項目・段階表を正典化。
// AIロープレ評価（seed の EVAL_ITEMS 12項目）を、現場の販売プロセスに沿って具体化したもの。

export interface RubricItem {
  /** 評価観点。 */
  criterion: string;
  /** 良い状態（加点）。 */
  lookFor: string;
  /** 減点・NG（赤信号）。 */
  redFlag: string;
}

export const EVALUATION_RUBRIC: RubricItem[] = [
  {
    criterion: "第一声の自然さ",
    lookFor: "売り込み感がなく、相手が一言返したくなる入り方ができている",
    redFlag: "いきなり商品・キャンペーンから入る",
  },
  {
    criterion: "許可取り",
    lookFor: "「10秒いいですか」など、続けるかをお客様に委ねている",
    redFlag: "断る余地を与えず話し続ける",
  },
  {
    criterion: "質問順序",
    lookFor: "入口質問→深掘り→比較の順で、軽い質問から入れている",
    redFlag: "初期に詳細な個人情報を聞く",
  },
  {
    criterion: "ヒアリング深度",
    lookFor: "現状・不満・自宅ネット・決裁者まで生活文脈を掘れている",
    redFlag: "表面的な質問だけで提案へ飛ぶ",
  },
  {
    criterion: "共感と要約",
    lookFor: "「つまり〜ですね」で要約し、相手が『分かってもらえた』と感じている",
    redFlag: "聞きっぱなしで商品説明に移る",
  },
  {
    criterion: "商品説明の正確性",
    lookFor: "公式情報に沿い、不確かな点は確認する姿勢がある",
    redFlag: "うろ覚えの数字を断定する",
  },
  {
    criterion: "条件付き表現",
    lookFor: "実質額・割引は前提条件を必ず添えている",
    redFlag: "「必ず安くなる」「実質0円」と無条件で言い切る",
  },
  {
    criterion: "NG表現の有無",
    lookFor: "他社批判・誇張・断定を避けている",
    redFlag: "他社を否定する／不安を煽る",
  },
  {
    criterion: "反論処理",
    lookFor: "受容→確認→再定義→次アクションの型で前進させている",
    redFlag: "否定して対立する",
  },
  {
    criterion: "着座誘導",
    lookFor: "相談目的と所要時間を示し、無理なく席へ誘導できている",
    redFlag: "理由なく「座ってください」と言う",
  },
  {
    criterion: "クローザー引き継ぎ品質",
    lookFor: "課題・家族・ネット・支払い・決裁者を要約して渡せている",
    redFlag: "情報を省略し、お客様に同じ話をさせる",
  },
  {
    criterion: "コンプライアンス遵守",
    lookFor: "本人入力・条件説明・必要最小限の個人情報を守れている",
    redFlag: "代理入力・条件省略・不要な個人情報の取得",
  },
];

export interface GrowthStage {
  stage: string;
  /** この段階で学ぶこと。 */
  learn: string;
  /** できるべきこと。 */
  canDo: string;
  /** 合格条件。 */
  passCondition: string;
}

export const GROWTH_STAGES: GrowthStage[] = [
  {
    stage: "入社初日",
    learn: "役割・禁止事項・全体像",
    canDo: "動きの流れを言える",
    passCondition: "禁止事項を理解している",
  },
  {
    stage: "1日目",
    learn: "第一印象・立ち位置",
    canDo: "通路を塞がず立てる",
    passCondition: "身だしなみ・印象に減点がない",
  },
  {
    stage: "3日目",
    learn: "第一声・10秒トーク",
    canDo: "声を出して声かけできる",
    passCondition: "声かけを実施できる",
  },
  {
    stage: "1週間",
    learn: "ライトヒアリング",
    canDo: "足止めできる",
    passCondition: "着座前に必要情報を取得できる",
  },
  {
    stage: "2週間",
    learn: "プラン基礎・家族/ネットの入口",
    canDo: "課題を発見できる",
    passCondition: "課題を要約して返せる",
  },
  {
    stage: "1か月",
    learn: "商材連動・反論の基礎",
    canDo: "1商材以上に広げられる",
    passCondition: "連動提案ができる",
  },
  {
    stage: "2か月",
    learn: "引き継ぎ・比較試算",
    canDo: "情報を整理できる",
    passCondition: "引き継ぎが安定している",
  },
  {
    stage: "3か月",
    learn: "反論処理・着座誘導",
    canDo: "反論を受け止められる",
    passCondition: "半分は独り立ちできる",
  },
  {
    stage: "クローザー候補",
    learn: "申込前確認・総合提案",
    canDo: "通しで接客を回せる",
    passCondition: "模擬認定に合格する",
  },
  {
    stage: "認定クローザー",
    learn: "全工程",
    canDo: "単独で誠実に売れる",
    passCondition: "認定基準（成果と品質の両立）を達成する",
  },
];
