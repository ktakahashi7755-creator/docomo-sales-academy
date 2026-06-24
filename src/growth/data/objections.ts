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
  /** 新人向け解説（なぜこの返しが効くか）。 */
  rookieExplanation: string;
  /** 上級者の工夫（一段上の運び方）。 */
  advancedExplanation: string;
}

export const OBJECTIONS: ObjectionCard[] = [
  {
    id: "fg-obj-expensive",
    objection: "高い",
    customerRealIntent: "価格そのものより、納得が不足している",
    acceptancePhrase: "確かに、金額だけ見ると高く感じますよね",
    ngResponse: "いや、安いですよ",
    goodResponse:
      "高く感じるのは自然です。月額そのものか、家族・ネット込みの総額か、どちらで見るかで印象がかなり変わるので、そこだけ一緒に整理させてください",
    deepDiveQuestion: "今は単体で見ていますか、それともご家族やお家のネット込みで考えていますか",
    closeConnection: "総額比較へ進む",
    rookieExplanation:
      "「高い」を否定で返すと壁ができます。まず受け止め、何に対して高いのか（単体か総額か）を分けると、会話が止まらず前に進みます。",
    advancedExplanation:
      "土俵を「単体価格」から「家族・ネット込みの総額」へ移すと、単体の高い印象を上書きできます。比較の枠を変えるのが上級者の一手です。",
  },
  {
    id: "fg-obj-troublesome",
    objection: "面倒くさい",
    customerRealIntent: "手続きの負担が怖い",
    acceptancePhrase: "手続きが面倒そう、というのはよく分かります",
    ngResponse: "いえ、簡単ですよ",
    goodResponse:
      "ひとことで面倒と言っても、書類・データ移行・かかる時間で対策が変わります。どこが一番重そうか教えていただければ、そこだけ先に軽くします",
    deepDiveQuestion: "書類・データ移行・時間、どれが一番気になりますか",
    closeConnection: "工程を分解して見せる",
    rookieExplanation:
      "「簡単です」は相手の不安を軽視して逆効果になりがちです。何が面倒かを特定すると、相手は具体的に話せて、こちらも的を絞って解決できます。",
    advancedExplanation:
      "面倒の正体（書類／移行／時間）ごとに用意した解決策を1つずつ出すと、漠然とした負担感が具体的な段取りに変わり、消えていきます。",
  },
  {
    id: "fg-obj-notime",
    objection: "時間がない",
    customerRealIntent: "今この場で止まりたくない",
    acceptancePhrase: "お時間ないですよね、お引き止めしてすみません",
    ngResponse: "すぐ終わりますから",
    goodResponse:
      "今日は判断まではしなくて大丈夫です。今のプラン名だけ伺えれば、損していないかを短時間でお伝えできます。何分くらいなら大丈夫ですか",
    deepDiveQuestion: "何分くらいなら、お時間いただけそうですか",
    closeConnection: "3分相談へ",
    rookieExplanation:
      "急かすほど離れます。「今日は比較だけ」と一度引くと、相手の警戒が緩み、かえって座ってもらいやすくなります。",
    advancedExplanation:
      "所要時間を相手に決めてもらう（何分なら？）と、主導権を渡しながら前進できます。相手が出した時間枠は、その後の約束として効きます。",
  },
  {
    id: "fg-obj-family",
    objection: "家族に相談したい",
    customerRealIntent: "単独で決められない",
    acceptancePhrase: "ご家族に確認したい、というのは自然なことですよね",
    ngResponse: "今決めた方がお得ですよ",
    goodResponse:
      "では今日決める話ではなく、ご家族に見せやすい比較表だけ作りましょう。どなたが気にされそうかだけ教えていただけますか",
    deepDiveQuestion: "ご家族のどなたが、特に気にされそうですか",
    closeConnection: "比較表の作成へ",
    rookieExplanation:
      "家族相談は当たり前の反応です。否定せず、その場で渡せる比較表という成果を残すと、後日につながります。",
    advancedExplanation:
      "決裁者を特定し、家族構成をメモに残すと、再来店時に最初から話が立ち上がり、世帯まとめ提案へ自然に広げられます。",
  },
  {
    id: "fg-obj-nottoday",
    objection: "今はいい",
    customerRealIntent: "優先順位が低い",
    acceptancePhrase: "今、特に困っていないなら、無理に変える必要はないですよね",
    ngResponse: "今がチャンスですよ",
    goodResponse:
      "おっしゃる通りです。逆に、もし変えるとしたら何が理由になりそうですか。料金・端末・ネットのどれかだけでも、引っかかる点があれば見ておきます",
    deepDiveQuestion: "料金・端末・ネット、どれなら動く理由になりそうですか",
    closeConnection: "将来条件の確認へ",
    rookieExplanation:
      "「今がチャンス」は押し売りに聞こえます。困っていないなら、動く理由を相手自身に挙げてもらう方が、納得につながります。",
    advancedExplanation:
      "将来条件（更新月・端末の寿命・値上げ）を一緒に置いておくと、今日決めなくても「その時が来たら」という自然な再接点が作れます。",
  },
  {
    id: "fg-obj-docomo-expensive",
    objection: "ドコモは高いイメージ",
    customerRealIntent: "過去の認識が強い",
    acceptancePhrase: "その印象、よく分かります。昔のイメージって残りますよね",
    ngResponse: "今は違いますよ",
    goodResponse:
      "その印象、自然だと思います。今は家族・ネット込みで見ると印象が変わるケースもあるので、高いと感じるのがプランか端末か、そこだけ分けて見ませんか",
    deepDiveQuestion: "高いという印象は、プランの方ですか、それとも端末の方ですか",
    closeConnection: "総額試算へ",
    rookieExplanation:
      "過去の印象は否定せず、まず認めます。その上で「今は見方が変わる」と橋を架けると、相手は身構えずに聞けます。",
    advancedExplanation:
      "印象の出どころ（プランか端末か）を切り分けると、漠然とした「高い」が具体化し、総額試算という土俵に持ち込みやすくなります。",
  },
  {
    id: "fg-obj-otherpoint",
    objection: "他社ポイントを貯めている",
    customerRealIntent: "今の経済圏を崩したくない",
    acceptancePhrase: "その経済圏、便利ですよね。せっかく貯めているなら大事にしたいですよね",
    ngResponse: "ドコモの方が得ですよ",
    goodResponse:
      "今の経済圏はそのままで大丈夫です。やめる前提ではなく、通信と家のネットだけ切り出して差が出るか、そこだけ見るイメージでどうでしょう",
    deepDiveQuestion: "ポイントは、何で一番貯めていらっしゃいますか",
    closeConnection: "否定しない比較へ",
    rookieExplanation:
      "他社経済圏は絶対に否定しません。否定した瞬間に壁ができ、その後の話が一切入らなくなります。まず相手の選択を尊重します。",
    advancedExplanation:
      "経済圏は残したまま「通信だけ」を切り出すと、相手は損をしないので比較に応じやすく、対立せずに差分だけで勝負できます。",
  },
  {
    id: "fg-obj-card",
    objection: "クレジットカードは増やしたくない",
    customerRealIntent: "管理が嫌",
    acceptancePhrase: "カードを増やしたくない感覚、すごく自然です",
    ngResponse: "作るだけ作っておきましょう",
    goodResponse:
      "今日は「作るか」ではなく、割引条件に関係するかだけ確認させてください。増やすのでなく、今の支払いを置き換えるイメージで見ていただけます",
    deepDiveQuestion: "今は何枚くらい、カードを管理されていますか",
    closeConnection: "支払い方法の確認へ",
    rookieExplanation:
      "「作りましょう」と申込前提で話すと警戒されます。今日は条件確認だけ、と一度引くことで、相手は安心して話を聞けます。",
    advancedExplanation:
      "「増やす」でなく「今の支払いを置き換える」、さらに支払い設定だけ・家族カードという選択肢を示すと、管理が増える懸念そのものを消せます。",
  },
  {
    id: "fg-obj-net-asis",
    objection: "ネットは今のままでいい",
    customerRealIntent: "優先度が低い",
    acceptancePhrase: "今の回線にご満足なら、無理に変える必要はありません",
    ngResponse: "変えた方がいいですよ",
    goodResponse:
      "満足されているなら、そのままが一番です。もし速度・不安定さ・料金のどれかだけ気になることがあれば、そこだけ比べてみる形でどうでしょう",
    deepDiveQuestion: "速度・不安定さ・料金、気になる点があるとすればどれですか",
    closeConnection: "固定回線の比較へ",
    rookieExplanation:
      "満足している相手に無理に勧めないこと自体が信頼になります。引く姿勢が、結果的に次の機会につながります。",
    advancedExplanation:
      "不満の種類（速度／不安定／料金）だけを切り出すと、本当に困っている人にだけ刺さり、不要な人には押し付けずに済みます。",
  },
  {
    id: "fg-obj-zandebt",
    objection: "端末残債がある",
    customerRealIntent: "二重払いが怖い",
    acceptancePhrase: "残債があると、乗り換える時期の判断が大事になりますよね",
    ngResponse: "残債があっても大丈夫です",
    goodResponse:
      "二重払いは避けたいですよね。まずは残りがあと何か月くらいか、残り方だけ一緒に確認しましょう。そこからタイミングを考えます",
    deepDiveQuestion: "分割のお支払いは、あと何か月くらい残っていますか",
    closeConnection: "タイミング提案へ",
    rookieExplanation:
      "「大丈夫です」と安易に言わず、まず残り方を一緒に見ます。確かめてから話す誠実さが、相手の安心になります。",
    advancedExplanation:
      "残債の残月数から乗り換えタイミングを設計すると、二重払い不安を感情論でなく実務で解け、提案の説得力が増します。",
  },
  {
    id: "fg-obj-switch-anxiety",
    objection: "乗り換えが不安",
    customerRealIntent: "手続き全体が見えない",
    acceptancePhrase: "初めてだと、どうなるか見えなくて不安ですよね",
    ngResponse: "皆さんやっていますから",
    goodResponse:
      "不安なのは自然です。どこが一番不安かで説明の順番を変えますね。番号・メール・手続きのどれが気になりますか",
    deepDiveQuestion: "番号・メール・手続きの中で、どれが一番不安ですか",
    closeConnection: "不安の分解へ",
    rookieExplanation:
      "「皆やってる」は不安を軽視して聞こえます。どこが不安かを聞いて説明順を変えるだけで、相手の安心感は大きく変わります。",
    advancedExplanation:
      "不安を番号／メール／手続きに分解し、それぞれの所要と代替手段を先に渡すと、漠然とした恐れが「やれそう」に変わります。",
  },
  {
    id: "fg-obj-datamove",
    objection: "データ移行が不安",
    customerRealIntent: "生活情報を失いたくない",
    acceptancePhrase: "大事なデータ、消えたら困りますよね",
    ngResponse: "できますよ",
    goodResponse:
      "一番心配なのはどのデータですか。写真・LINE・アプリで手順とサポートの仕方が変わるので、その的に合わせてご説明します",
    deepDiveQuestion: "写真・LINE・アプリ、特にどれが心配ですか",
    closeConnection: "サポート内容の説明へ",
    rookieExplanation:
      "「できます」で終わらせず、何のデータが心配かを特定します。相手の不安の的に合わせると、説明が一気に刺さります。",
    advancedExplanation:
      "写真／LINE／アプリで移行手順とサポート範囲が違います。心配の的に合わせて具体的な手順を示すと、不安が信頼に変わります。",
  },
  {
    id: "fg-obj-procedure",
    objection: "手続きが面倒",
    customerRealIntent: "考えることが多くて負担",
    acceptancePhrase: "一度に全部考えると、確かに面倒ですよね",
    ngResponse: "すぐですよ",
    goodResponse:
      "全部を一度に考えると重いので、今日は必要な部分だけ整理します。どの工程が一番重そうか教えていただければ、そこから軽くします",
    deepDiveQuestion: "どの工程が、一番重そうに感じますか",
    closeConnection: "工程の見える化へ",
    rookieExplanation:
      "全部を一度に説明すると相手の頭がいっぱいになります。今日やる部分だけに絞ると、心理的な負担が下がります。",
    advancedExplanation:
      "工程を見える化し「今日はここまで」と区切ると、認知負荷が一気に下がり、相手は安心して一歩目を踏み出せます。",
  },
  {
    id: "fg-obj-cancelfee",
    objection: "解約金が不安",
    customerRealIntent: "想定外の費用が怖い",
    acceptancePhrase: "想定外の費用は気になりますよね",
    ngResponse: "解約金はかからないです",
    goodResponse:
      "費用は契約状況で変わるので、断定はせず、まず現在のご契約を確認しましょう。更新月や契約年数は分かりますか",
    deepDiveQuestion: "更新月や契約年数は、お分かりになりますか",
    closeConnection: "要確認を前提に着座へ",
    rookieExplanation:
      "「かからない」と断定するのは危険です。契約状況で違うので、必ず確認してから話す姿勢が、信頼とコンプラの両方を守ります。",
    advancedExplanation:
      "更新月・契約年数を押さえれば、費用を要確認のまま着座に進める判断ができ、その場で止めずに前進できます。",
  },
  {
    id: "fg-obj-cashback",
    objection: "キャッシュバックだけ知りたい",
    customerRealIntent: "短期の損得で比較したい",
    acceptancePhrase: "施策、気になりますよね。お得は知りたいですよね",
    ngResponse: "それだけでは決められません",
    goodResponse:
      "施策も大事なので、条件と期間を一緒に確認しましょう。そのうえで、月額とどちらを重視されるかで、合う形が変わります",
    deepDiveQuestion: "月額と施策、どちらを重視されますか",
    closeConnection: "キャンペーンと恒常制度の分離へ",
    rookieExplanation:
      "施策だけで決めさせると、後で条件違いのトラブルになります。条件と期間を一緒に確認するのが、誠実かつ安全です。",
    advancedExplanation:
      "キャンペーンと恒常制度を分けて示し、月額とのトータルで損得を見せると、短期の数字に振られず納得して選んでもらえます。",
  },
  {
    id: "fg-obj-suspicious",
    objection: "怪しい、営業されたくない",
    customerRealIntent: "警戒している",
    acceptancePhrase: "そう見えますよね。急に声をかけられたら警戒しますよね",
    ngResponse: "怪しくないですよ",
    goodResponse:
      "そう見えて当然です。今日は売り込みではなく、見直しの余地があるかの確認だけでも大丈夫です。料金かネック、どちらかだけでも見ますか",
    deepDiveQuestion: "料金かネット、どちらかだけなら見てもいいかなと思えますか",
    closeConnection: "小さな同意へ",
    rookieExplanation:
      "「怪しくない」と返すほど怪しく聞こえます。まず見え方を認めると、相手の警戒が緩み、話を聞く余地が生まれます。",
    advancedExplanation:
      "「売り込みでなく確認だけ」と自分の役割を明示すると、相手の警戒が小さな同意（見るだけなら）に変わり、接点が保てます。",
  },
  {
    id: "fg-obj-badexperience",
    objection: "前に嫌な思いをした",
    customerRealIntent: "不信感がある",
    acceptancePhrase: "それは嫌でしたね。そういう経験があると身構えますよね",
    ngResponse: "今回は違いますよ",
    goodResponse:
      "嫌な思いをされたんですね。今日は、条件と変わる点を先に明確にしてから進めます。どんな点が嫌だったか、差し支えなければ教えてください",
    deepDiveQuestion: "差し支えなければ、どんな点が嫌でしたか",
    closeConnection: "再発防止の約束へ",
    rookieExplanation:
      "過去の嫌な経験は否定せず受け止めます。「今回は違う」と言うより、共感する方が、再発防止の約束に説得力が出ます。",
    advancedExplanation:
      "何が嫌だったかを聞き、今日の進め方でその点を先回りして潰すと、不信感が「この人は違う」という信頼に変わります。",
  },
];
