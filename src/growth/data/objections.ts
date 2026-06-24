// 反論処理集（17パターン）。基本型＝受け止める→本音を特定→条件付きで見直す→小さな次アクション。
// 「正しい台詞を返す」のではなく「相手の不安を構造化する」ための教材。

/** 反論処理の基本4ステップ（全反論に共通の型）。 */
export const OBJECTION_BASIC_FLOW = [
  "受け止める（否定しない）",
  "本音を特定する",
  "条件付きで見直す",
  "小さな次アクションに落とす",
];

export interface ObjectionCard {
  id: string;
  /** お客様の反論。 */
  objection: string;
  /** その裏にある本音。 */
  customerRealIntent: string;
  /** まず受け止める一言。 */
  acceptancePhrase: string;
  /** やってはいけない切り返し。 */
  ngResponse: string;
  /** 望ましい切り返し。 */
  goodResponse: string;
  /** 本音を引き出す深掘り質問。 */
  deepDiveQuestion: string;
  /** クロージングへのつなげ方。 */
  closeConnection: string;
}

export const OBJECTIONS: ObjectionCard[] = [
  {
    id: "obj-expensive",
    objection: "高い",
    customerRealIntent: "価格そのものより、納得が不足している",
    acceptancePhrase: "高く感じますよね",
    ngResponse: "安いですよ",
    goodResponse:
      "高く感じるポイントが、月額そのものか、家族・ネット込みの総額かで見方が変わります",
    deepDiveQuestion: "単体で見ていますか、ご家族込みで見ていますか",
    closeConnection: "総額比較へ進む",
  },
  {
    id: "obj-troublesome",
    objection: "面倒くさい",
    customerRealIntent: "手続きの負担が怖い",
    acceptancePhrase: "手続きが面倒そうに感じますよね",
    ngResponse: "簡単です",
    goodResponse: "どこが面倒そうかで、対策が変わります",
    deepDiveQuestion: "書類・データ移行・時間、どれが気になりますか",
    closeConnection: "工程を分解して見せる",
  },
  {
    id: "obj-notime",
    objection: "時間がない",
    customerRealIntent: "今この場で止まりたくない",
    acceptancePhrase: "お時間ないですよね",
    ngResponse: "すぐ終わります",
    goodResponse: "今日は比較だけで、判断は後でも大丈夫です",
    deepDiveQuestion: "何分くらいなら大丈夫ですか",
    closeConnection: "3分相談へ",
  },
  {
    id: "obj-family",
    objection: "家族に相談したい",
    customerRealIntent: "単独で決められない",
    acceptancePhrase: "ご家族に確認したいですよね",
    ngResponse: "今決めた方がお得です",
    goodResponse: "では、ご家族に見せやすい形にまとめましょう",
    deepDiveQuestion: "どなたが気にされますか",
    closeConnection: "比較表の作成へ",
  },
  {
    id: "obj-nottoday",
    objection: "今はいい",
    customerRealIntent: "優先順位が低い",
    acceptancePhrase: "今は困っていないなら自然です",
    ngResponse: "今がチャンスです",
    goodResponse: "逆に、変えるとしたら何が理由になりそうですか",
    deepDiveQuestion: "料金・端末・ネット、どれなら動きますか",
    closeConnection: "将来条件の確認へ",
  },
  {
    id: "obj-docomo-expensive",
    objection: "ドコモは高いイメージ",
    customerRealIntent: "過去の認識が強い",
    acceptancePhrase: "その印象、よく分かります",
    ngResponse: "今は違います",
    goodResponse: "今は家族・ネット込みで見方が変わるケースがあります",
    deepDiveQuestion: "高い印象は、プランですか、端末ですか",
    closeConnection: "総額試算へ",
  },
  {
    id: "obj-otherpoint",
    objection: "他社ポイントを貯めている",
    customerRealIntent: "今の経済圏を崩したくない",
    acceptancePhrase: "その経済圏、便利ですよね",
    ngResponse: "ドコモの方が得です",
    goodResponse: "経済圏は否定せず、通信だけ切り分けて差が出るか見ましょう",
    deepDiveQuestion: "何で一番ポイントを貯めていますか",
    closeConnection: "否定しない比較へ",
  },
  {
    id: "obj-card",
    objection: "クレジットカードは増やしたくない",
    customerRealIntent: "管理が嫌",
    acceptancePhrase: "増やしたくない感覚、自然です",
    ngResponse: "作るだけです",
    goodResponse: "増やす前提でなく、割引条件に影響するかだけ確認しましょう",
    deepDiveQuestion: "今は何枚くらい管理されていますか",
    closeConnection: "支払い方法の確認へ",
  },
  {
    id: "obj-net-asis",
    objection: "ネットは今のままでいい",
    customerRealIntent: "優先度が低い",
    acceptancePhrase: "今の回線に満足なら、無理に変える必要はありません",
    ngResponse: "変えた方がいいです",
    goodResponse: "遅さや料金だけ気になるなら、そこだけ比較できます",
    deepDiveQuestion: "速度・不安定さ・料金、どれですか",
    closeConnection: "固定回線の比較へ",
  },
  {
    id: "obj-zandebt",
    objection: "端末残債がある",
    customerRealIntent: "二重払いが怖い",
    acceptancePhrase: "残債があると、時期の判断が大事ですよね",
    ngResponse: "残債があっても大丈夫です",
    goodResponse: "まず残り方だけ一緒に見ましょう",
    deepDiveQuestion: "あと何か月か分かりますか",
    closeConnection: "タイミング提案へ",
  },
  {
    id: "obj-switch-anxiety",
    objection: "乗り換えが不安",
    customerRealIntent: "手続き全体が見えない",
    acceptancePhrase: "初めてだと不安ですよね",
    ngResponse: "皆さんやっています",
    goodResponse: "どこが不安かで、説明の順番を変えます",
    deepDiveQuestion: "番号・メール・手続き、どれが不安ですか",
    closeConnection: "不安の分解へ",
  },
  {
    id: "obj-datamove",
    objection: "データ移行が不安",
    customerRealIntent: "生活情報を失いたくない",
    acceptancePhrase: "大事なデータ、心配ですよね",
    ngResponse: "できます",
    goodResponse: "どのデータが一番心配ですか。写真・LINE・アプリですか",
    deepDiveQuestion: "以前、移行で困ったことはありますか",
    closeConnection: "サポート内容の説明へ",
  },
  {
    id: "obj-procedure",
    objection: "手続きが面倒",
    customerRealIntent: "考えることが多くて負担",
    acceptancePhrase: "一度に考えると面倒ですよね",
    ngResponse: "すぐですよ",
    goodResponse: "今日は必要な部分だけ整理します",
    deepDiveQuestion: "どの工程が重そうですか",
    closeConnection: "工程の見える化へ",
  },
  {
    id: "obj-cancelfee",
    objection: "解約金が不安",
    customerRealIntent: "想定外の費用が怖い",
    acceptancePhrase: "費用は気になりますよね",
    ngResponse: "かからないです（断定）",
    goodResponse: "費用は契約状況で違うので、まず現契約を確認しましょう",
    deepDiveQuestion: "更新月や契約年数は分かりますか",
    closeConnection: "要確認を前提に着座へ",
  },
  {
    id: "obj-cashback",
    objection: "キャッシュバックだけ知りたい",
    customerRealIntent: "短期の損得で比較したい",
    acceptancePhrase: "施策、気になりますよね",
    ngResponse: "それだけでは決められません",
    goodResponse: "施策も大事なので、条件と期間を一緒に確認します",
    deepDiveQuestion: "月額とどちらを重視されますか",
    closeConnection: "キャンペーンと恒常制度の分離へ",
  },
  {
    id: "obj-suspicious",
    objection: "怪しい、営業されたくない",
    customerRealIntent: "警戒している",
    acceptancePhrase: "そう見えますよね",
    ngResponse: "怪しくないです",
    goodResponse: "今日は売り込みでなく、見直し余地があるかの確認だけでも大丈夫です",
    deepDiveQuestion: "料金かネット、どちらかだけなら見ますか",
    closeConnection: "小さな同意へ",
  },
  {
    id: "obj-badexperience",
    objection: "前に嫌な思いをした",
    customerRealIntent: "不信感がある",
    acceptancePhrase: "それは嫌でしたね",
    ngResponse: "今回は違います",
    goodResponse: "今日は条件と変わる点を先に明確にします",
    deepDiveQuestion: "どんな点が嫌でしたか",
    closeConnection: "再発防止の約束へ",
  },
];
