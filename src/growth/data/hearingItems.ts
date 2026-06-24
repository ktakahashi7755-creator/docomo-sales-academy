// ヒアリング項目の体系（19項目）。質問は量でなく順番が大事。
// 本人確認情報・認証情報・不要な個人情報は販売初期に取得しない（コンプラ）。

export interface HearingItem {
  id: string;
  /** 聞く項目。 */
  item: string;
  /** 聞く目的。 */
  purpose: string;
  /** 自然な聞き方。 */
  naturalQuestion: string;
  /** 深掘り質問。 */
  deepDiveQuestion: string;
  /** 回答に応じた提案方向。 */
  proposalDirection: string;
  /** やってはいけない聞き方。 */
  prohibitedQuestion: string;
  /** コンプラ注意。 */
  complianceNote: string;
}

export const HEARING_ITEMS: HearingItem[] = [
  {
    id: "h-carrier",
    item: "キャリア",
    purpose: "プラン比較の起点",
    naturalQuestion: "今はどちらをお使いですか",
    deepDiveQuestion: "何年くらいお使いですか",
    proposalDirection: "MNP・現状維持の比較",
    prohibitedQuestion: "どこが高いですか（決めつけ）",
    complianceNote: "他社批判に誘導しない",
  },
  {
    id: "h-years",
    item: "利用年数",
    purpose: "変化への抵抗感の把握",
    naturalQuestion: "長くお使いですか",
    deepDiveQuestion: "変えたことはありますか",
    proposalDirection: "切替不安への対策",
    prohibitedQuestion: "そろそろ変えた方が",
    complianceNote: "長期利用を否定しない",
  },
  {
    id: "h-device",
    item: "端末機種",
    purpose: "相性・更新理由の把握",
    naturalQuestion: "今の機種は何をお使いですか",
    deepDiveQuestion: "何年くらい使っていますか",
    proposalDirection: "端末更新・データ移行不安への対策",
    prohibitedQuestion: "古いですね",
    complianceNote: "端末の価値を下げる言い方をしない",
  },
  {
    id: "h-device-state",
    item: "端末状態",
    purpose: "痛みの顕在化",
    naturalQuestion: "困っている点はありますか",
    deepDiveQuestion: "電池・動作・容量のどれですか",
    proposalDirection: "機種変更・補償",
    prohibitedQuestion: "壊れる前に（煽り）",
    complianceNote: "不安を過度に煽らない",
  },
  {
    id: "h-price",
    item: "月額料金",
    purpose: "主訴の把握",
    naturalQuestion: "毎月のご負担、気になりますか",
    deepDiveQuestion: "ざっくりいくら台ですか",
    proposalDirection: "料金の見直し",
    prohibitedQuestion: "明細をいきなり求める",
    complianceNote: "詳細な明細は着座してから",
  },
  {
    id: "h-data",
    item: "データ利用量",
    purpose: "プラン選定",
    naturalQuestion: "ギガは余ることが多いですか",
    deepDiveQuestion: "動画やSNSは多いですか",
    proposalDirection: "MAX / mini / ahamo",
    prohibitedQuestion: "何GBですか（だけ）",
    complianceNote: "使い方の文脈が先",
  },
  {
    id: "h-call",
    item: "通話利用",
    purpose: "通話オプションの判断",
    naturalQuestion: "お電話は多いですか",
    deepDiveQuestion: "お仕事での利用はありますか",
    proposalDirection: "5分無料・かけ放題",
    prohibitedQuestion: "通話しないですよね",
    complianceNote: "業務利用の重要性に配慮する",
  },
  {
    id: "h-family",
    item: "家族構成",
    purpose: "世帯提案",
    naturalQuestion: "ご家族でもスマホを使われていますか",
    deepDiveQuestion: "何台くらいですか",
    proposalDirection: "みんなドコモ割・家族まとめ",
    prohibitedQuestion: "家族の詳細を根掘り葉掘り聞く",
    complianceNote: "必要以上の家族情報は不要",
  },
  {
    id: "h-family-carrier",
    item: "家族のキャリア",
    purpose: "割引余地の把握",
    naturalQuestion: "ご家族は同じ会社ですか",
    deepDiveQuestion: "バラバラですか",
    proposalDirection: "まとめ提案",
    prohibitedQuestion: "全部まとめましょう",
    complianceNote: "本人の決裁範囲を確認する",
  },
  {
    id: "h-homenet",
    item: "自宅ネット",
    purpose: "セット割・品質改善",
    naturalQuestion: "家のネットは何をお使いですか",
    deepDiveQuestion: "光ですか、置くだけ系ですか",
    proposalDirection: "ドコモ光・home 5G",
    prohibitedQuestion: "家のネットも変えましょう",
    complianceNote: "住居・工事可否を確認する",
  },
  {
    id: "h-utility",
    item: "電気・ガス",
    purpose: "光熱費との連動",
    naturalQuestion: "電気やガスはまとめていますか",
    deepDiveQuestion: "ポイントを意識されますか",
    proposalDirection: "ドコモでんき・ガス",
    prohibitedQuestion: "電気も全部変えられます",
    complianceNote: "供給エリア・名義の確認が必要",
  },
  {
    id: "h-payment",
    item: "支払い方法",
    purpose: "割引条件の把握",
    naturalQuestion: "お支払いはカードが多いですか",
    deepDiveQuestion: "口座ですか、カードですか",
    proposalDirection: "dカードお支払割",
    prohibitedQuestion: "カード番号を聞く",
    complianceNote: "申込前の不要な取得は禁止",
  },
  {
    id: "h-creditcard",
    item: "クレジットカード利用",
    purpose: "dカード適性の把握",
    naturalQuestion: "普段よく使うカードはありますか",
    deepDiveQuestion: "ポイント重視ですか",
    proposalDirection: "regular / GOLD / PLATINUM",
    prohibitedQuestion: "dカード作れますか",
    complianceNote: "審査を軽く言わない",
  },
  {
    id: "h-economy",
    item: "ポイント経済圏",
    purpose: "比較軸の把握",
    naturalQuestion: "ポイントは何をよく使いますか",
    deepDiveQuestion: "ご家族でも使いますか",
    proposalDirection: "他社経済圏への切り返し",
    prohibitedQuestion: "その経済圏は損です",
    complianceNote: "他社の否定は禁止",
  },
  {
    id: "h-debt",
    item: "端末残債",
    purpose: "切替障壁の把握",
    naturalQuestion: "分割のお支払いは残っていますか",
    deepDiveQuestion: "あとどれくらいですか",
    proposalDirection: "乗換時期の調整・買い方の提案",
    prohibitedQuestion: "残債があっても大丈夫です（断定）",
    complianceNote: "相殺の確約はしない",
  },
  {
    id: "h-switch-exp",
    item: "乗り換え経験",
    purpose: "不安レベルの把握",
    naturalQuestion: "以前に会社を変えたことはありますか",
    deepDiveQuestion: "その時は大変でしたか",
    proposalDirection: "不安への対策",
    prohibitedQuestion: "簡単ですから",
    complianceNote: "経験の差を前提にする",
  },
  {
    id: "h-switch-anxiety",
    item: "乗り換えへの不安",
    purpose: "実行障壁の把握",
    naturalQuestion: "どの部分が不安ですか",
    deepDiveQuestion: "番号・データ・手続きですか",
    proposalDirection: "MNP不安の解消",
    prohibitedQuestion: "不安はないですよね（扱い）",
    complianceNote: "感情の受容を先に置く",
  },
  {
    id: "h-trouble-now",
    item: "今困っていること",
    purpose: "顕在課題の把握",
    naturalQuestion: "今いちばん困っているのは何ですか",
    deepDiveQuestion: "それはいつ起きますか",
    proposalDirection: "今回提案の主軸",
    prohibitedQuestion: "何かありますよね（誘導）",
    complianceNote: "誘導しない",
  },
  {
    id: "h-real-wish",
    item: "本当は変えたいこと",
    purpose: "潜在課題の把握",
    naturalQuestion: "理想はどうなれば楽ですか",
    deepDiveQuestion: "料金・手間・速さのどれですか",
    proposalDirection: "潜在ニーズの言語化",
    prohibitedQuestion: "本当は変えたいですよね（決めつけ）",
    complianceNote: "決めつけは禁止",
  },
];
