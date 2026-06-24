// 標準販売プロセス（15工程）。深掘りリサーチの教育用フレームを正典化。
// ドコモ公式の工程名ではなく、未経験者が「今どこか」を理解する共通言語として用いる。

export interface SalesProcessStep {
  no: number;
  /** 工程名。 */
  name: string;
  /** この工程の目的。 */
  purpose: string;
  /** この時点のお客様心理。 */
  customerMindset: string;
  /** スタッフがやること。 */
  staffAction: string;
  /** そのまま使えるトーク例。 */
  talkExamples: string[];
  /** やってはいけないトーク例。 */
  ngExamples: string[];
  /** 新人がやりがちな失敗。 */
  rookieMistakes: string[];
  /** SVが見る評価ポイント。 */
  svEvaluationPoints: string[];
}

export const SALES_PROCESS: SalesProcessStep[] = [
  {
    no: 1,
    name: "事前準備",
    purpose: "今日売るのでなく、今日の勝ち筋を決める",
    customerMindset: "まだ接点はない",
    staffAction: "目標・導線・商材条件・当日施策・NG表現を確認しておく",
    talkExamples: [
      "（自分への確認）今日は料金相談訴求で入る",
      "（自分への確認）10ギガはエリア確認を前提に案内する",
    ],
    ngExamples: ["無準備でその場任せにする"],
    rookieMistakes: ["料金や条件をうろ覚えのまま接客に出る"],
    svEvaluationPoints: ["商材理解", "立ち位置の計画", "当日施策の理解"],
  },
  {
    no: 2,
    name: "立ち位置・アイキャッチ確認",
    purpose: "声をかける前に、視認される状態をつくる",
    customerMindset: "まだ警戒していない",
    staffAction: "通路を塞がず、視線が合う位置へ。POPは一瞬で読める訴求に絞る",
    talkExamples: ["無言でも「相談できそう」に見える状態をつくる"],
    ngExamples: ["通路の中央に立つ", "圧を出して近づく"],
    rookieMistakes: ["距離が近すぎる", "道を塞いでしまう"],
    svEvaluationPoints: ["通路妨害がない", "清潔感", "目線配り"],
  },
  {
    no: 3,
    name: "ファーストキャッチ",
    purpose: "拒否されず、一言だけ返してもらう",
    customerMindset: "「営業かな？」と警戒している",
    staffAction: "許可取り＋低負荷なテーマで入る",
    talkExamples: ["すみません、料金の見直し相談だけ10秒いいですか"],
    ngExamples: ["今お得なので乗り換えませんか"],
    rookieMistakes: ["売り込みから入ってしまう"],
    svEvaluationPoints: ["一声目の自然さ", "声量", "笑顔", "距離感"],
  },
  {
    no: 4,
    name: "足止め",
    purpose: "立ち止まる理由を作る",
    customerMindset: "立ち去るか、聞くか検討中",
    staffAction: "お客様の状況に合う1テーマへ絞る",
    talkExamples: ["毎月のスマホ代か、ご自宅のネット、どちらか気になる方が多いです"],
    ngExamples: ["全部説明します"],
    rookieMistakes: ["話題を広げすぎる"],
    svEvaluationPoints: ["1テーマ化", "滞留時間の伸ばし方"],
  },
  {
    no: 5,
    name: "ライトヒアリング",
    purpose: "座れる見込みがあるかを判断する",
    customerMindset: "まだ深くは話したくない",
    staffAction: "3問以内で状況を把握する",
    talkExamples: ["今はどちらの会社ですか", "ご家族も同じですか", "家のネットはお使いですか"],
    ngExamples: ["住所・年収・詳細な個人情報を先に聞く"],
    rookieMistakes: ["深掘りしすぎて逃げられる"],
    svEvaluationPoints: ["質問数", "順序", "圧の低さ"],
  },
  {
    no: 6,
    name: "課題発見",
    purpose: "顕在ニーズを言語化する",
    customerMindset: "「そういえば困っている」段階",
    staffAction: "困りごとを繰り返し、要約して返す",
    talkExamples: ["料金が高い感覚があるんですね", "家のWi-Fiが夜遅いんですね"],
    ngExamples: ["すぐ商品説明へ飛ぶ"],
    rookieMistakes: ["共感せずに提案へ移る"],
    svEvaluationPoints: ["要約力", "共感表現", "メモの品質"],
  },
  {
    no: 7,
    name: "メリット提示",
    purpose: "座って聞く価値を示す",
    customerMindset: "「聞く意味があるか」を判断中",
    staffAction: "メリットを1つだけ返す",
    talkExamples: ["その条件なら、安くなるかではなく、使い方に合う形があるかはすぐ見られます"],
    ngExamples: ["絶対安くなります"],
    rookieMistakes: ["条件を無視して断定する"],
    svEvaluationPoints: ["条件付き表現の徹底"],
  },
  {
    no: 8,
    name: "深掘りヒアリング",
    purpose: "生活文脈を掘る",
    customerMindset: "やっと話し始める",
    staffAction: "料金・端末・家族・ネット・支払いへ広げる",
    talkExamples: ["お一人だけでなく、ご家族全体で見ると動きやすいですか"],
    ngExamples: ["家族全員変えましょう"],
    rookieMistakes: ["自分の売りたい商材に誘導する"],
    svEvaluationPoints: ["生活背景の把握", "決裁者の確認"],
  },
  {
    no: 9,
    name: "試算・比較",
    purpose: "納得材料を可視化する",
    customerMindset: "理屈を確認したい",
    staffAction: "現状と変更後を、条件付きで比較する",
    talkExamples: ["今の使い方ならmini寄り、ポイント活用ならポイ活MAX寄りです"],
    ngExamples: ["このプラン一択です"],
    rookieMistakes: ["プラン比較が雑になる"],
    svEvaluationPoints: ["比較の正確さ", "条件の説明"],
  },
  {
    no: 10,
    name: "反論処理",
    purpose: "後ろ向きな理由を、前向きな材料へ変える",
    customerMindset: "不安・面倒・損失回避",
    staffAction: "受容→確認→再定義→次提案の順で運ぶ",
    talkExamples: [
      "高い印象、ありますよね。月額そのものと、家族・ネット込みの総額、どちらが気になりますか",
    ],
    ngExamples: ["そんなことないです"],
    rookieMistakes: ["否定して対立する"],
    svEvaluationPoints: ["感情の受容", "再質問", "押しの強さの調整"],
  },
  {
    no: 11,
    name: "着座誘導",
    purpose: "クローザーの土俵へ移す",
    customerMindset: "まだ引き返せると感じている",
    staffAction: "相談目的を再確認して席へ誘導する",
    talkExamples: ["3分だけ試算して、合わなければそこで終わりで大丈夫です"],
    ngExamples: ["とりあえず座ってください"],
    rookieMistakes: ["着座の理由を作れない"],
    svEvaluationPoints: ["一言の安心感", "所要時間の提示"],
  },
  {
    no: 12,
    name: "クローザー引き継ぎ",
    purpose: "情報のロスを防ぐ",
    customerMindset: "同じ話を繰り返したくない",
    staffAction: "課題・家族・ネット・支払い・決裁者を要約して渡す",
    talkExamples: ["料金が高止まり、家族2回線、家のネットが遅い、dカード未保有です"],
    ngExamples: ["詳しくはご本人に聞いてください"],
    rookieMistakes: ["引き継ぎが浅い"],
    svEvaluationPoints: ["要約の精度", "同席マナー"],
  },
  {
    no: 13,
    name: "申込前確認",
    purpose: "誤認・手戻りを防ぐ",
    customerMindset: "ここで不安が再燃しやすい",
    staffAction: "条件・必要書類・後工程・本人入力を確認する",
    talkExamples: ["割引条件と適用タイミングだけ、最後に確認します"],
    ngExamples: ["細かいところは後で大丈夫です"],
    rookieMistakes: ["重要な条件を飛ばす"],
    svEvaluationPoints: ["条件確認", "本人確認", "禁止事項の遵守"],
  },
  {
    no: 14,
    name: "お見送り",
    purpose: "成約の有無にかかわらず、再接点を残す",
    customerMindset: "最後の印象が残る",
    staffAction: "断られても相談価値を残して見送る",
    talkExamples: ["今日は比較材料にしていただければ十分です"],
    ngExamples: ["（成約しないと）「またお願いします」だけで終わる"],
    rookieMistakes: ["成約しないと対応が雑になる"],
    svEvaluationPoints: ["終了の品質", "顧客体験", "再来店導線"],
  },
  {
    no: 15,
    name: "日報・振り返り",
    purpose: "再現性を上げる",
    customerMindset: "（接客後の自分の振り返り）",
    staffAction: "反応が取れた一言・落ちた理由・次の改善を書く",
    talkExamples: ["（日報例）高い反論で止まった。総額比較に入る前に共感が不足していた"],
    ngExamples: ["数だけ記録して終わる"],
    rookieMistakes: ["学びが残らない"],
    svEvaluationPoints: ["具体性", "改善仮説", "再現性"],
  },
];
