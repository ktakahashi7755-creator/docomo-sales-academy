// 場面別トークスクリプト集（15シーン）。丸暗記でなく「意図」とセットで学ぶ。
import type { TalkLine } from "@/growth/data/curriculum";

export interface SceneScript {
  id: string;
  /** 場面。 */
  scene: string;
  /** この場面の目的。 */
  objective: string;
  /** 会話スクリプト（注釈つき）。 */
  script: TalkLine[];
  /** トークの意図。 */
  intent: string;
  /** 使っている営業技術。 */
  salesTechnique: string;
  /** この場面のNG表現。 */
  ngExpression: string;
  /** 新人向けの解説。 */
  rookieExplanation: string;
  /** 上級者向けの工夫。 */
  advancedTip: string;
}

export const SCENES: SceneScript[] = [
  {
    id: "scene-display",
    scene: "店内で展示端末を見ているお客様",
    objective: "端末への興味を相談化する",
    script: [
      {
        role: "staff",
        text: "機種をお探しですか。それとも料金込みで比べたい感じですか。",
        note: "比較軸をこちらで整理して差し上げる。",
      },
      { role: "customer", text: "うーん、料金もちょっと気になるかな。" },
      {
        role: "staff",
        text: "では今の使い方だけ伺って、合う形があるか一緒に見ますね。",
        note: "端末説明の前に意図を聞く。",
      },
    ],
    intent: "比較軸をこちらで整理する",
    salesTechnique: "二択質問",
    ngExpression: "これ人気です（だけ）",
    rookieExplanation: "端末説明の前に、何を比べたいかの意図を聞く。",
    advancedTip: "旧端末の不満へ自然につなぐ。",
  },
  {
    id: "scene-price-visit",
    scene: "料金相談で来店したお客様",
    objective: "来店目的を明確にする",
    script: [
      {
        role: "staff",
        text: "ご自身の料金だけか、ご家族全体で見るかで提案が変わります。",
        note: "相談の範囲を先に決める。",
      },
      { role: "customer", text: "家族も入れた方がいいのかな。" },
      {
        role: "staff",
        text: "台数が多いほど効くので、まずご家族の状況だけ伺いますね。",
        note: "家族・ネットの順に広げる。",
      },
    ],
    intent: "相談範囲を広げる",
    salesTechnique: "スコープ設定",
    ngExpression: "安くします",
    rookieExplanation: "相談の範囲を先に決めてから掘る。",
    advancedTip: "家族・ネットの順で広げる。",
  },
  {
    id: "scene-event",
    scene: "イベント会場を通り過ぎるお客様",
    objective: "足を止めてもらう",
    script: [
      {
        role: "staff",
        text: "10秒だけ、スマホ代か家のネット、どちらか気になりませんか。",
        note: "一瞬でテーマを選択させる。",
      },
      { role: "customer", text: "スマホ代は気になるかも。" },
      {
        role: "staff",
        text: "ありがとうございます。今のプラン名だけで損していないか分かりますよ。",
        note: "POPと同じ言葉を使うと迷いが減る。",
      },
    ],
    intent: "一瞬でテーマを選択させる",
    salesTechnique: "許可取り＋選択肢",
    ngExpression: "今だけお得です",
    rookieExplanation: "営業感を下げ、選ぶだけにする。",
    advancedTip: "POPと同じ言葉を使う。",
  },
  {
    id: "scene-street",
    scene: "軒先で急いで歩いているお客様",
    objective: "拒否されず接点を残す",
    script: [
      {
        role: "staff",
        text: "お急ぎですよね。もし今月のスマホ代、高いなと思うことがあれば、後日用に比較だけお渡しできます。",
        note: "追わずに印象だけ残す。",
      },
      { role: "customer", text: "あー、今は急いでて。" },
      {
        role: "staff",
        text: "もちろんです。お気をつけて。お困りのときはいつでもどうぞ。",
        note: "止めない勇気。再接点の余地を残す。",
      },
    ],
    intent: "追わずに印象を残す",
    salesTechnique: "離脱許可",
    ngExpression: "少しだけ！（と追う）",
    rookieExplanation: "止めない勇気を持つ。",
    advancedTip: "名刺・再接点の導線へ切り替える。",
  },
  {
    id: "scene-family",
    scene: "家族連れのお客様",
    objective: "世帯提案へ広げる",
    script: [
      {
        role: "staff",
        text: "一番よく使う方と、お支払いを見ている方はどなたですか。",
        note: "決裁者を把握する。",
      },
      { role: "customer", text: "支払いは私かな。" },
      {
        role: "staff",
        text: "ありがとうございます。では世帯トータルで、無理のない形を一緒に見ましょう。",
        note: "子ども回線・自宅ネットは後出しにする。",
      },
    ],
    intent: "決裁者を把握する",
    salesTechnique: "役割確認",
    ngExpression: "皆さん変えましょう",
    rookieExplanation: "誰が決めるかを先に知る。",
    advancedTip: "子ども回線・自宅ネットを後出しにする。",
  },
  {
    id: "scene-senior",
    scene: "高齢のお客様",
    objective: "不安を軽減する",
    script: [
      {
        role: "staff",
        text: "今日は難しい言葉を使わず、変わるところだけ順番にご説明します。",
        note: "ハードルを下げる安心宣言。",
      },
      { role: "customer", text: "横文字が多くてね、苦手で。" },
      {
        role: "staff",
        text: "大丈夫です。ゆっくり、必要なら紙に書きながら進めますね。ご家族とご一緒の確認もできます。",
        note: "理解確認を増やし、家族同席の可否を早めに確認する。",
      },
    ],
    intent: "ハードルを下げる",
    salesTechnique: "安心宣言",
    ngExpression: "簡単ですから大丈夫です",
    rookieExplanation: "不安を軽く見ない。理解確認を増やす。",
    advancedTip: "ご家族の同席可否を早めに確認する。",
  },
  {
    id: "scene-foreign",
    scene: "外国籍のお客様",
    objective: "伝達精度を確保する",
    script: [
      {
        role: "staff",
        text: "日本語はどのくらいで進めましょうか。ゆっくり、紙に書きながらでも大丈夫です。",
        note: "相手の基準にペースを合わせる。",
      },
      { role: "customer", text: "少しゆっくりなら大丈夫です。" },
      {
        role: "staff",
        text: "承知しました。大事なところは、その都度『ここまで大丈夫ですか』と確認しますね。",
        note: "確認を多めに入れる。多言語の補助も活用する。",
      },
    ],
    intent: "ペースを合わせる",
    salesTechnique: "相手基準化",
    ngExpression: "（早口で一気に話す）",
    rookieExplanation: "通じている前提で進めない。",
    advancedTip: "多言語の補助・確認を多く入れる。",
  },
  {
    id: "scene-longterm-other",
    scene: "他社スマホを長く使っているお客様",
    objective: "変化への不安を緩める",
    script: [
      {
        role: "staff",
        text: "長く使われている分、変える理由がないと動きにくいですよね。",
        note: "今の選択の正当性を認める。",
      },
      { role: "customer", text: "そうなんだよ、特に困ってないし。" },
      {
        role: "staff",
        text: "でしたら、バッテリー・料金・写真の容量、どれか1つだけ気になる点はありますか。",
        note: "否定せず、論点を1つに絞る。",
      },
    ],
    intent: "今の選択の正当性を認める",
    salesTechnique: "抵抗の受容",
    ngExpression: "もう古いです",
    rookieExplanation: "否定しない。",
    advancedTip: "バッテリー・料金・写真容量のどれかに絞る。",
  },
  {
    id: "scene-old-device",
    scene: "端末が古いが買い替えに抵抗があるお客様",
    objective: "買い替えの理由づけ",
    script: [
      {
        role: "staff",
        text: "壊れるまで使うのも一つです。ただ、今は返却型や月々の負担を抑える考え方もあります。",
        note: "「買う」でなく「持ち方」を再定義する。",
      },
      { role: "customer", text: "一括は高いからなあ。" },
      {
        role: "staff",
        text: "でしたら、返却の条件だけ先に確認してから、合うかを見ましょうか。",
        note: "いつでもカエドキへ橋渡し。条件は省略しない。",
      },
    ],
    intent: "買い方を再定義する",
    salesTechnique: "認知の転換",
    ngExpression: "今買った方が得です",
    rookieExplanation: "『買う』でなく『持ち方』を提案する。",
    advancedTip: "いつでもカエドキへ橋渡しする（条件は必ず説明）。",
  },
  {
    id: "scene-high-price",
    scene: "月額料金が高いと感じているお客様",
    objective: "相談の主軸にする",
    script: [
      {
        role: "staff",
        text: "高いと感じるのは、通信費単体ですか、それとも家全体の固定費ですか。",
        note: "「高い」の中身を分解する。",
      },
      { role: "customer", text: "言われてみると家全体かも。" },
      {
        role: "staff",
        text: "でしたら、家族・ネット込みの総額で見ると動きやすいです。一緒に整理しましょう。",
        note: "家族・ネット込みの総額へ展開する。",
      },
    ],
    intent: "「高い」の中身を分解する",
    salesTechnique: "問題分解",
    ngExpression: "ドコモでも安いです",
    rookieExplanation: "『高い』の定義を聞く。",
    advancedTip: "家族・ネット込みの総額へ展開する。",
  },
  {
    id: "scene-slow-net",
    scene: "家のネットが遅いお客様",
    objective: "固定回線の提案",
    script: [
      {
        role: "staff",
        text: "遅いのは時間帯ですか、部屋ですか、それともそもそもの回線速度ですか。",
        note: "原因を切り分ける。すぐ商品に飛ばない。",
      },
      { role: "customer", text: "夜になると遅い気がする。" },
      {
        role: "staff",
        text: "なるほど。お住まいの種別と工事の可否で、光かhome 5Gかが分かれます。そこだけ確認しますね。",
        note: "住居形態・工事可否で分岐。提供エリアも確認。",
      },
    ],
    intent: "原因を切り分ける",
    salesTechnique: "症状ヒアリング",
    ngExpression: "（すぐhome 5Gを勧める）",
    rookieExplanation: "速度不満は原因別に対処が違う。",
    advancedTip: "住居形態・工事可否で分岐する。",
  },
  {
    id: "scene-card-resist",
    scene: "クレジットカード提案に抵抗があるお客様",
    objective: "dカード拒否を緩める",
    script: [
      {
        role: "staff",
        text: "カードを増やしたくない感覚、すごく自然です。今日は『作るか』ではなく、割引条件に関係するかだけ確認してもいいですか。",
        note: "抵抗を弱める小さな同意。申込前提で話さない。",
      },
      { role: "customer", text: "条件の確認だけなら、まあ。" },
      {
        role: "staff",
        text: "ありがとうございます。支払い設定や家族カードという選択肢もあるので、合う形だけ見ますね。",
        note: "支払い設定だけ・家族カードの選択肢へ。",
      },
    ],
    intent: "抵抗を弱める",
    salesTechnique: "小さな同意",
    ngExpression: "絶対作った方がいい",
    rookieExplanation: "申込前提で話さない。",
    advancedTip: "支払い設定だけ／家族カードの選択肢へ。",
  },
  {
    id: "scene-other-economy",
    scene: "他社経済圏を使っているお客様",
    objective: "対立を回避する",
    script: [
      {
        role: "staff",
        text: "その経済圏をやめる前提ではなく、スマホと家のネットだけ見たときに差が出るか確認するイメージです。",
        note: "既存の合理性を尊重する。",
      },
      { role: "customer", text: "楽天で結構貯めてるんだよね。" },
      {
        role: "staff",
        text: "いいですよね。その上で、通信の総額・家族・回線品質のところだけ比べてみましょう。",
        note: "総額・家族・回線品質で比較する。否定しない。",
      },
    ],
    intent: "既存の合理性を尊重する",
    salesTechnique: "否定しない比較",
    ngExpression: "そのポイント弱いですよ",
    rookieExplanation: "相手の正しさを認める。",
    advancedTip: "総額・家族・回線品質で比較する。",
  },
  {
    id: "scene-need-family",
    scene: "家族に相談しないと決められないお客様",
    objective: "後日化を防ぎ、成果を残す",
    script: [
      {
        role: "staff",
        text: "では今日決める話ではなく、ご家族に見せやすい比較表だけ作りましょうか。",
        note: "その場の成果（比較表）を残す。",
      },
      { role: "customer", text: "それなら助かる。" },
      {
        role: "staff",
        text: "どなたが気にされそうですか。ご家族構成だけメモして、判断材料を整えますね。",
        note: "家族構成・決裁者のメモを残す。",
      },
    ],
    intent: "その場の成果を残す",
    salesTechnique: "次回化の設計",
    ngExpression: "今決めた方が…",
    rookieExplanation: "家族相談は自然な反応。否定しない。",
    advancedTip: "家族構成・決裁者のメモを残す。",
  },
  {
    id: "scene-just-looking",
    scene: "「今日は見るだけ」と言うお客様",
    objective: "接点を保持する",
    script: [
      {
        role: "staff",
        text: "もちろん大丈夫です。見るだけの方ほど、料金か機種かだけ整理できると見やすいですよ。",
        note: "拒否を受け止めつつ、前進の余地を残す。",
      },
      { role: "customer", text: "じゃあ料金だけ。" },
      {
        role: "staff",
        text: "ありがとうございます。今のプラン名だけ伺えば、見直し余地があるかすぐ分かります。",
        note: "『見るだけ』の中身を聞く。",
      },
    ],
    intent: "拒否を受け止めつつ前進する",
    salesTechnique: "抵抗の受容",
    ngExpression: "皆さんそう言います",
    rookieExplanation: "否定で返さない。",
    advancedTip: "『見るだけ』の中身を聞く。",
  },
];
