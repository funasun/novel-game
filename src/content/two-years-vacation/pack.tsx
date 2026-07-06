import type { ContentPack, InteractableDef } from '../../engine/types';
import { IslandScene } from './scene/IslandScene';
import {
  SPAWN,
  SHIP,
  LOOKOUT,
  CAVE,
  NORTH,
  BOAT,
  NPC_POS,
  CAVE_POS,
  LANDMARKS,
  SALT_ROCK,
  SEAL_ROCK,
  SUGAR_TREE,
  STARGAZE,
  RHEA,
  HALL_DIG,
  KITCHEN,
  SCHOOL,
  WOODPILE,
  CORRAL,
  DOG_BEACH,
  DOG_CAVE,
  SIGNAL_MAST,
  FESTIVAL,
  DRIFTWOOD_POINTS,
  SHELLFISH_POINTS,
  FIREWOOD_POINTS,
} from './layout';

// Layer 3: 十五少年漂流記 — コンテンツパック。
// 物語・会話・クエスト・学びはすべてここ（データ）にあり、エンジンは中身を知らない。
// テキストは原作（PD）に基づく自作の翻案。出航前夜からオークランド帰還まで全篇を収録。

const driftwood: InteractableDef[] = DRIFTWOOD_POINTS.map((p, i) => ({
  id: `driftwood_${i}`,
  position: [p.x, p.z],
  prompt: '流木を拾う',
  effects: { items: { wood: 1 }, params: { stamina: -2 }, minutes: 20 },
  once: true,
  hideFlag: 'cave_moved',
}));

const shellfish: InteractableDef[] = SHELLFISH_POINTS.map((p, i) => ({
  id: `shellfish_${i}`,
  position: [p.x, p.z],
  prompt: '貝を採って食べる',
  effects: {
    params: { hunger: 18, stamina: -1 },
    counters: { shellfish_eaten: 1 },
    minutes: 15,
  },
  once: true,
  requiresFlag: 'fire_lit',
  hideFlag: 'cave_moved',
}));

const firewood: InteractableDef[] = FIREWOOD_POINTS.map((p, i) => ({
  id: `firewood_${i}`,
  position: [p.x, p.z],
  prompt: '薪を集める',
  effects: { items: { wood: 1 }, params: { stamina: -2 }, minutes: 20 },
  once: true,
  requiresFlag: 'cave_moved',
}));

export const twoYearsVacation: ContentPack = {
  id: 'two-years-vacation',
  title: '十五少年漂流記',

  parameters: {
    stamina: { label: '体力', min: 0, max: 100, initial: 100 },
    hunger: { label: '満腹度', min: 0, max: 100, initial: 60 },
    morale: { label: '士気', min: 0, max: 100, initial: 50 },
    supplies: { label: '物資', min: 0, max: 100, initial: 20, display: false },
    trust: { label: '信頼', min: 0, max: 100, initial: 30, display: false },
    development: { label: '開拓度', min: 0, max: 100, initial: 0, display: false },
  },

  items: {
    wood: { label: '薪・流木' },
  },

  characters: {
    // 十五人の少年たち（原作準拠）。note があれば手帳の「なかま」欄に載る。
    briant: {
      name: 'ブリアン',
      note: '13歳・フランス人。勇敢で情に厚く、泳ぎの名手。弟のジャックをいつも気にかけている。年長組のまとめ役。',
    },
    jacques: {
      name: 'ジャック',
      note: '9歳・ブリアンの弟。出航の夜からずっとふさぎ込んでいて、何かを隠している様子……。',
    },
    gordon: {
      name: 'ゴードン',
      note: '14歳・アメリカ人。冷静で几帳面。物資の目録をつける「島の会計係」。みんなの兄貴分。',
    },
    doniphan: {
      name: 'ドニファン',
      note: '13歳・イギリス人。誇り高く、銃の腕は誰にも負けない。ブリアンへの対抗心を隠さない。',
    },
    cross: {
      name: 'クロス',
      note: '13歳。ドニファンの従兄弟で、いつも彼と行動を共にする。',
    },
    webb: {
      name: 'ウェッブ',
      note: '13歳。腕っぷしが強い。ドニファンの取り巻きのひとり。',
    },
    wilcox: {
      name: 'ウィルコックス',
      note: '13歳。罠づくりが得意。狩りではドニファンの右腕。',
    },
    baxter: {
      name: 'バクスター',
      note: '13歳。手先が器用で、道具づくりの名人。物静かだが頼りになる。',
    },
    garnett: {
      name: 'ガーネット',
      note: '12歳。アコーディオンが弾ける。船から持ち出せたのが自慢。',
    },
    service: {
      name: 'サーヴィス',
      note: '12歳。『ロビンソン・クルーソー』の愛読者。漂流生活をどこか面白がっている。',
    },
    jenkins: {
      name: 'ジェンキンズ',
      note: '9歳。年少組。科学者の息子。',
    },
    iverson: {
      name: 'アイヴァーソン',
      note: '9歳。年少組。牧師の息子。',
    },
    dole: {
      name: 'ドール',
      note: '8歳。年少組。コスターの面倒をよく見る。',
    },
    costar: {
      name: 'コスター',
      note: '8歳。いちばん年下。泣き虫だけど素直。',
    },
    moko: {
      name: 'モコ',
      note: '12歳・見習い水夫。船で唯一の乗組員。料理と船の知識でみんなを支える。',
    },
    kate: {
      name: 'ケイト',
      note: '商船セヴァーン号の乗客係。反乱と難破を生きのびて島へ。少年たちの「お母さん」役に。',
    },
    evans: {
      name: 'エヴァンズ',
      note: 'セヴァーン号の航海士。ウォルストン一味から逃れて少年たちに合流。帰郷の航海の頼れる舵手。',
    },
  },

  dialogues: {
    // ===== 序章：出航前夜、オークランド =====
    dlg_drift: {
      id: 'dlg_drift',
      speaker: 'moko',
      lines: [
        'た、大変だ！ ブリアンさん、みんな、起きてください！',
        '船が——船が動いています！ もやい綱が解けて、沖へ流されている！',
        '船長も水夫のみなさんも、乗りこむのは明日の朝のはずなのに……大人が、ひとりもいないのに！',
      ],
      effects: { next: 'dlg_drift2' },
    },
    dlg_drift2: {
      id: 'dlg_drift2',
      speaker: 'briant',
      lines: [
        '落ち着け、モコ。……ほんとうだ。岸の灯りが、どんどん遠くなっていく。',
        'この風じゃ帆は張れない。小さな錨も効かない。——叫べ！ 誰かに気づいてもらうんだ！',
        '（少年たちの声は、嵐の轟音にかき消された。スルギ号は十五人の少年だけを乗せて、夜の太平洋へ流されていった。）',
      ],
    },

    // ===== 第一章：漂着 =====
    dlg_intro: {
      id: 'dlg_intro',
      speaker: 'briant',
      lines: [
        '……みんな、無事か。よし——十五人、全員いる。',
        '船はもうだめだ。マストは折れて、船底には穴が開いている。',
        '日が暮れる前に、やることを決めよう。',
      ],
      choices: [
        {
          text: '「まず、火を起こそう」',
          effects: { questAdd: ['q_wood'], params: { morale: 3 }, next: 'dlg_intro_fire' },
        },
        {
          text: '「助けを待ったほうがいいんじゃ……」',
          effects: { next: 'dlg_intro_wait' },
        },
      ],
    },
    dlg_intro_fire: {
      id: 'dlg_intro_fire',
      speaker: 'briant',
      lines: [
        'そうだ。夜の冷えは体力を奪う。',
        '浜に流木が打ち上がっている。三本もあれば朝まで持つはずだ。頼んだぞ。',
      ],
    },
    dlg_intro_wait: {
      id: 'dlg_intro_wait',
      speaker: 'briant',
      lines: [
        '……ここがどこかも分からないんだ。船が通る保証はない。',
        '自分たちでやるしかない。まずは火だ。——浜の流木を集めてくれ。三本あればいい。',
      ],
      effects: { questAdd: ['q_wood'] },
    },
    dlg_fire: {
      id: 'dlg_fire',
      speaker: 'briant',
      lines: [
        '十分だ！ 貸してくれ。——火打ち金は船から持ち出してある。',
        '（乾いた海藻に火花が落ち、細い煙が立ちのぼった。）',
        '……ついた。今夜はもう、大丈夫だ。',
      ],
      effects: {
        flags: ['fire_lit'],
        items: { wood: -3 },
        learning: ['l_fire'],
        next: 'dlg_fire2',
      },
    },
    dlg_fire2: {
      id: 'dlg_fire2',
      speaker: 'briant',
      lines: [
        'そういえば、朝から誰も何も食べていない。',
        '岩場の潮だまりに貝がいるのを見た。火が通れば食べられる。——探してみてくれ。',
      ],
      effects: { questAdd: ['q_food'] },
    },
    dlg_food: {
      id: 'dlg_food',
      speaker: 'briant',
      lines: [
        '腹に何か入るだけで、こんなに気持ちが違うんだな。',
        '小さいやつらにも食べさせてやろう。……ジャック、おまえもだ。',
      ],
      effects: { learning: ['l_tidepool'], params: { morale: 5 } },
    },
    dlg_night: {
      id: 'dlg_night',
      speaker: 'briant',
      lines: [
        '交代で見張りを立てよう。火を絶やさないためにもだ。',
        '……ドニファン。きみは最初の番を頼めるか。',
        '（返事の代わりに、砂を蹴る音がした。——あいつはいつも、ぼくが決めるのが気に入らないんだ。）',
        '……おやすみ、みんな。明日はきっと、今日よりましな一日になる。',
      ],
      effects: { learning: ['l_priorities'] },
    },
    dlg_day2: {
      id: 'dlg_day2',
      speaker: 'gordon',
      lines: [
        'ブリアン、起きたか。相談がある。',
        'ここが「島」なのか「大陸」なのか、まだ誰も知らないんだ。大陸なら、歩いて人里に出られるかもしれない。',
        '島の中央に高い丘が見える。あそこから見渡せば——ぼくらの「暮らし」の全部が決まる。',
      ],
      effects: { questAdd: ['q_lookout'], flags: ['ch2_started'] },
    },

    // ===== 第二章：島か、大陸か =====
    dlg_island: {
      id: 'dlg_island',
      speaker: 'briant',
      lines: [
        '見たろう。東も西も南も——水平線は、ひとつづきの円になって閉じていた。',
        'ここは大陸じゃない。島だ。歩いて帰ることは、できない。',
        'なら、やることは決まってる。「暮らし」を作るんだ。何年かかってもいいように。',
      ],
      effects: { next: 'dlg_island2' },
    },
    dlg_island2: {
      id: 'dlg_island2',
      speaker: 'doniphan',
      lines: [
        'ふん。……高台にのぼった程度で、わかったような口をきくな。',
        'だが——認めよう。あれは島だ。ぼくの目にも、水平線は閉じて見えた。',
        'それなら、冬が来る前に住みかを探すべきだ。この浜のテントじゃ、凍え死ぬぞ。西の湖のほとりに、岩壁があった。調べる価値はある。',
      ],
      effects: { learning: ['l_island'], questAdd: ['q_cave'] },
    },
    dlg_cave: {
      id: 'dlg_cave',
      speaker: 'gordon',
      lines: [
        'フランソワ・ボードワン。……ぼくらより先に、この島で生きた人がいたんだ。五十年も前に、たったひとりで。',
        'この地図を見てくれ。島の全体が描いてある。湖、川、森——彼はひとりで、これを全部歩いたんだ。',
        '遺骨は丁重に葬ろう。そして、この洞窟を住みかにさせてもらう。名前は——「フレンチ・デン」。彼に敬意をこめて。',
      ],
      effects: { learning: ['l_baudoin'], questAdd: ['q_move'] },
    },
    dlg_settle: {
      id: 'dlg_settle',
      speaker: 'gordon',
      lines: [
        '引っ越し完了、だ。ベッドも、ストーブも、図書室の本まで運びこんだ。',
        '今夜からここが、ぼくら十五人の家だ。',
        'さっそくだが、ストーブの薪がいる。まわりの森で6本、集めてきてくれないか。',
      ],
      effects: { questAdd: ['q_firewood'] },
    },

    // ===== 第三章：島の選挙 =====
    dlg_vote: {
      id: 'dlg_vote',
      speaker: 'gordon',
      lines: [
        'みんな、聞いてくれ。ぼくらには「首長」が必要だ。',
        '決めごとのたびに言い争っていたら、この島の冬は越せない。任期は一年。投票で決めよう。',
        '——きみは、誰に入れる？',
      ],
      choices: [
        {
          text: '「ゴードン。きみが一番、公平だ」',
          effects: { params: { trust: 2 }, next: 'dlg_vote_result' },
        },
        { text: '「ブリアンがいい」', effects: { next: 'dlg_vote_result' } },
        { text: '「ドニファン……かな」', effects: { next: 'dlg_vote_result' } },
      ],
    },
    dlg_vote_result: {
      id: 'dlg_vote_result',
      speaker: 'gordon',
      lines: [
        '——開票結果。ゴードン、8票。……ぼくか。わかった、引き受けよう。',
        '狩り、炊事、見張り、そして年少組の勉強。役割と時間割を決める。島にいるからといって、勉強をやめる理由にはならないからな。',
        '遊びじゃない。ぼくらはここで、「社会」をやるんだ。',
      ],
      effects: {
        flags: ['gordon_president'],
        learning: ['l_democracy'],
        params: { trust: 10, morale: 8 },
      },
    },
    dlg_map: {
      id: 'dlg_map',
      speaker: 'gordon',
      lines: [
        'つぎの大仕事だ。——ボードワンの地図を、ぼくらの地図に仕上げる。',
        '実際に歩いて、確かめて、名前をつける。漂着の湾、見張りの丘、罠の森、南の湿原、そしてボードワンの墓。五つの場所を訪ねてくれ。',
        '名前は、みんなの投票で決める。それがチェアマン島のやり方だ。',
      ],
      effects: { questAdd: ['q_map'], flags: ['map_started'] },
    },
    dlg_map_done: {
      id: 'dlg_map_done',
      speaker: 'gordon',
      lines: [
        'これで地図が完成した。湾も丘も森も、ぜんぶぼくらの名前がついた。',
        'ボードワンが五十年前に始めた仕事を、ぼくらが仕上げたんだ。……悪くない気分だろう？',
        'この地図は、フレンチ・デンの壁に貼っておく。ぼくらの島の、ぼくらの地図だ。',
      ],
      effects: {
        learning: ['l_mapping'],
        flags: ['map_done'],
        params: { development: 15, morale: 5 },
      },
    },
    dlg_skate: {
      id: 'dlg_skate',
      speaker: 'doniphan',
      lines: [
        '……助かった。霧の中で、岸の方角が完全にわからなくなった。',
        '氷の上はどこまでも同じ景色だ。自分がどっちを向いているのかさえ、あやしくなる。',
        '銃声が聞こえなければ、湖の上で夜を明かすところだった。……ブリアン。礼は、言っておく。',
      ],
      effects: { learning: ['l_ice'], params: { trust: 3 } },
    },
    dlg_rhea: {
      id: 'dlg_rhea',
      speaker: 'service',
      lines: [
        '見て、ナンドゥだよ！ 南米のダチョウ！ 罠の森でぼくが捕まえたんだ。',
        '『スイスのロビンソン』では、ダチョウに乗って走るんだよ。だから、ぼくも——',
        '（数日後。サーヴィスはナンドゥにまたがり、三秒で振り落とされた。ナンドゥは今日も元気に草を食べている。）',
      ],
      effects: { learning: ['l_rhea'], params: { morale: 2 } },
    },
    dlg_vote2: {
      id: 'dlg_vote2',
      speaker: 'gordon',
      lines: [
        '一年の任期が終わった。二度目の選挙だ。——開票する。',
        '……ブリアン、9票。新しい首長は、ブリアンだ。',
        'ぼくは彼を推薦する。この一年、いちばん体を張ったのは彼だからだ。',
      ],
      effects: { flags: ['briant_president'], next: 'dlg_split' },
    },
    dlg_split: {
      id: 'dlg_split',
      speaker: 'doniphan',
      lines: [
        '……納得できない。よりによって、フランス人のブリアンだと？ ここはイギリス人の学校の仲間じゃないか。',
        'ぼくは出ていく。クロス、ウェッブ、ウィルコックス——付き合ってくれるな。島の北で、ぼくらだけで暮らす。',
        '（四人は銃と食料を分けて持ち、フレンチ・デンを出ていった。誰にも、止められなかった。）',
      ],
      effects: {
        flags: ['doniphan_left'],
        learning: ['l_split'],
        params: { morale: -10, trust: -8 },
      },
    },

    // ===== 第四章：ジャックの告白 =====
    dlg_confess: {
      id: 'dlg_confess',
      speaker: 'jacques',
      lines: [
        '兄さん……ぼく、ずっと言えなかったことがあるんだ。',
        'あの夜——スルギ号のもやい綱を解いたのは、ぼくなんだ。いたずらのつもりだった。すぐ結び直せると思ったんだ。',
        'みんながこの島にいるのは、ぼくのせいなんだ……！',
      ],
      effects: { next: 'dlg_confess2' },
    },
    dlg_confess2: {
      id: 'dlg_confess2',
      speaker: 'briant',
      lines: [
        '……そうか。言えたな、ジャック。よく言えた。',
        'おまえはこの島で、誰よりも危ない仕事を進んでやってきた。ずっと、償っていたんだろう。',
        'もういい。もう十分だ。——顔を上げろ。おまえはぼくの、自慢の弟だ。',
      ],
      effects: {
        flags: ['jacques_confessed'],
        learning: ['l_mooring'],
        params: { morale: 5, trust: 5 },
      },
    },

    // ===== 第五章：セヴァーン号の生存者 =====
    dlg_kate: {
      id: 'dlg_kate',
      speaker: 'kate',
      lines: [
        '……ありがとう、坊やたち。わたしはケイト。商船セヴァーン号の乗客係です。',
        'セヴァーン号では、船員の反乱が起きたの。ウォルストンという男が仲間七人と船を乗っ取って、船長たちを……。そのあと船は火事で沈み、ボートでこの島に流れ着いたのよ。',
        '気をつけて。ウォルストンたちも、この島のどこかに上陸しているわ。あの男たちは人を殺すことを、なんとも思わない。……焚き火の煙を、見られないようにして。',
        'それから——北で暮らしている子たちがいるんでしょう？ 早く知らせてあげて。ばらばらでいるのは、危険よ。',
      ],
      effects: {
        flags: ['kate_here'],
        learning: ['l_mutiny'],
        questAdd: ['q_warn'],
      },
    },
    dlg_rescue: {
      id: 'dlg_rescue',
      speaker: 'doniphan',
      lines: [
        '……なぜだ。なぜ、ぼくを助けた。あんなに憎まれ口を叩いてきた、このぼくを。',
        '「仲間だからだ」……きみは、そう言うんだな。ナイフ一本で、ジャガーの前に立って。',
        '……負けたよ、ブリアン。完敗だ。ぼくらはフレンチ・デンに帰る。みんなで、一緒に。',
      ],
      effects: { flags: ['doniphan_saved'], params: { trust: 15, morale: 10 } },
    },

    // ===== 第六章：大凧とエヴァンズ =====
    dlg_kite: {
      id: 'dlg_kite',
      speaker: 'briant',
      lines: [
        'ウォルストンたちがどこにいるか、わからないままでは動けない。だから——空から探す。',
        'バクスターと大凧を作った。人間ひとりを吊り上げられる、八角形の大凧だ。夜なら、敵からは見えない。',
        '危険な役目だ。だから、ぼくが上がる。……ジャック、地上の綱を頼む。',
      ],
      effects: { flags: ['kite_built'], minutes: 120 },
    },
    dlg_evans: {
      id: 'dlg_evans',
      speaker: 'evans',
      lines: [
        'はあっ、はあっ……。わしはエヴァンズ。セヴァーン号の航海士だ。ウォルストンどもに捕まっていたが、隙を見て川を泳いで逃げてきた。',
        '聞け、坊主たち。やつらの狙いはおまえたちのボートだ。あれを直して島を出る気でいる。つまり——やつらは必ず、ここへ来る。',
        'それとな、いいことも教えてやろう。この島の本当の名は「ハノーバー島」。チリの沖合いだ。マゼラン海峡はすぐそこで、蒸気船の航路も通っている。',
        '……帰れるぞ、坊主たち。戦って、生き延びればな。',
      ],
      effects: {
        flags: ['evans_here'],
        learning: ['l_hanover'],
        questAdd: ['q_battle'],
      },
    },
    dlg_victory: {
      id: 'dlg_victory',
      speaker: 'evans',
      lines: [
        '終わったな。……よく戦った。おまえたちは、そこらの水夫より肝が据わっとる。',
        'セヴァーン号のボートを直そう。わしが舵を取る。マゼラン海峡までは三十リーグほど——十分に行ける距離だ。',
        '帰るぞ。おまえたちの、家族のところへ。',
      ],
      effects: {
        flags: ['walston_defeated'],
        params: { morale: 15 },
        questAdd: ['q_home'],
      },
    },

    // ===== 浜のキャンプ時代の立ち話 =====
    dlg_chat: {
      id: 'dlg_chat',
      speaker: 'briant',
      lines: [
        '浜の向こうに、乗ってきたスルギ号が見えるだろう。モコが船を見てくれている。',
        'きみも一度、様子を見ておくといい。運び出せるものが、まだたくさん残っているはずだ。',
      ],
    },
    dlg_ship: {
      id: 'dlg_ship',
      speaker: 'moko',
      lines: [
        '船倉を見てきました。ビスケットに塩漬け肉、缶詰、真水の樽、ナイフに道具箱——思ったより残っています。',
        'でも、つぎの大嵐が来たら、船体はきっとばらばらになります。',
        '運べるうちに、みんなで浜へ運びましょう。……この船が、ぼくたちの最初の「倉庫」です。',
      ],
      effects: {
        params: { supplies: 20, morale: 2 },
        minutes: 60,
        flags: ['ship_checked'],
        learning: ['l_salvage'],
      },
    },
    dlg_moko_chat: {
      id: 'dlg_moko_chat',
      speaker: 'moko',
      lines: [
        '料理はぼくの仕事です。火があれば、貝ももっとおいしくできますよ。',
        'ぼくは乗組員で、みなさんはお客さま。……でも、ここでは同じ「島の仲間」ですね。',
      ],
    },
    dlg_gordon_chat: {
      id: 'dlg_gordon_chat',
      speaker: 'gordon',
      lines: [
        'いま、船から運んだ物資の目録をつけている。銃が8挺、弾薬、缶詰、工具箱……。',
        '数を知らずに使えば、あっという間になくなる。地味だが、こういう仕事が暮らしを支えるんだ。',
      ],
    },
    dlg_doniphan_chat: {
      id: 'dlg_doniphan_chat',
      speaker: 'doniphan',
      lines: [
        '……別に、きみと話すことはない。',
        '言っておくが、狩りならぼくは誰にも負けない。この島で肉が食えるとしたら、ぼくの銃のおかげだ。',
        '（ブリアンの名前が出るたび、彼の眉がぴくりと動く。）',
      ],
    },
    dlg_jacques_chat: {
      id: 'dlg_jacques_chat',
      speaker: 'jacques',
      lines: [
        '……兄さんなら、むこうにいるよ。',
        'ぼく……ううん。なんでもない。',
        '（出航の夜から、ジャックはずっとこの調子だ。何かを隠しているように見える。）',
      ],
    },
    dlg_baxter_chat: {
      id: 'dlg_baxter_chat',
      speaker: 'baxter',
      lines: [
        '船からロープと帆布を外してきた。手を動かしていると、不安を忘れられる。',
        '道具さえあれば、たいていのものは作れるさ。',
      ],
    },
    dlg_service_chat: {
      id: 'dlg_service_chat',
      speaker: 'service',
      lines: [
        'ねえ、これって『ロビンソン・クルーソー』みたいだと思わないか？',
        'ぼく、ああいう本を何度も読んだんだ。……本の中では、遭難はもっと楽しそうだったけど。',
      ],
    },
    dlg_littles_chat: {
      id: 'dlg_littles_chat',
      speaker: 'costar',
      lines: [
        'ねえ、いつになったら家に帰れるの……？',
        '（コスターは八つ。いちばん年下だ。ドールがその肩をそっと抱いた。）',
        '……だいじょうぶ。ブリアンたちがいるもん。',
      ],
    },

    // ===== フレンチ・デン時代の立ち話 =====
    dlg_chat2: {
      id: 'dlg_chat2',
      speaker: 'briant',
      lines: [
        'フレンチ・デンの暮らしにも、ずいぶん慣れた。ストーブがあるから冬もしのげる。',
        '……ジャックのことが、少し心配だ。ここに来てからも、ずっと何かを抱えている。',
      ],
    },
    dlg_gordon_chat2: {
      id: 'dlg_gordon_chat2',
      speaker: 'gordon',
      lines: [
        '時間割はうまく回っている。午前は勉強、午後は仕事と狩り。日曜は休み。',
        '「島にいるからこそ、きちんと暮らす」。それがぼくの方針だ。',
      ],
    },
    dlg_moko_chat2: {
      id: 'dlg_moko_chat2',
      speaker: 'moko',
      lines: [
        '洞窟のかまどは最高です。湖の魚に、鳥の丸焼き……料理の腕が上がりましたよ。',
        'サーヴィスが毎回「ロビンソンならこう食べる」って注文をつけるんですけどね。',
      ],
    },
    dlg_baxter_chat2: {
      id: 'dlg_baxter_chat2',
      speaker: 'baxter',
      lines: [
        '投げ縄と「ボーラ」の練習をしている。南米の狩人が使う、石の付いた縄だ。',
        '銃と違って、弾がいらない。……いつか、きっと役に立つ。',
      ],
    },
    dlg_service_chat2: {
      id: 'dlg_service_chat2',
      speaker: 'service',
      lines: [
        'フレンチ・デン、いい名前だよね。本物の漂流者の家なんだから、ロビンソンより本格的だ！',
        'ぼくはダチョウを飼いならそうとしてるんだ。……全然、なつかないけど。',
      ],
    },
    dlg_littles_chat2: {
      id: 'dlg_littles_chat2',
      speaker: 'costar',
      lines: [
        'ここのほうが、テントよりあったかいね。',
        '（年少組はすっかり島の暮らしに慣れて、毎朝ゴードンの「授業」を受けている。）',
      ],
    },
    dlg_doniphan_chat2: {
      id: 'dlg_doniphan_chat2',
      speaker: 'doniphan',
      lines: [
        '……ふん。洞窟暮らしは悪くない。狩り場も近いしな。',
        'だが言っておく。ぼくはブリアンの下につくつもりはない。',
      ],
    },
    dlg_doniphan_chat3: {
      id: 'dlg_doniphan_chat3',
      speaker: 'doniphan',
      lines: [
        'ブリアンには借りができた。……一生ものの借りだ。',
        'きみも見ただろう。あいつはナイフ一本で、ジャガーの前に立ったんだ。……ぼくは、自分が恥ずかしいよ。',
        'もう仲間割れはしない。ウォルストンが来るなら、ぼくの銃はみんなのために撃つ。',
      ],
    },
    dlg_jacques_chat2: {
      id: 'dlg_jacques_chat2',
      speaker: 'jacques',
      lines: [
        '……ぼく、危ない仕事はぜんぶ引き受けるって決めてるんだ。',
        '理由は……聞かないで。',
      ],
    },
    dlg_jacques_chat3: {
      id: 'dlg_jacques_chat3',
      speaker: 'jacques',
      lines: [
        '兄さんに、ぜんぶ話したんだ。……胸のつかえが、とれた気がする。',
        'これからは、償いのためじゃなくて、みんなのために働くよ。',
      ],
    },
    dlg_kate_chat: {
      id: 'dlg_kate_chat',
      speaker: 'kate',
      lines: [
        '洗濯も繕いものも任せてちょうだい。あなたたち、二年間よくやってきたわね。',
        '年少の子たちには、お母さんが必要よ。……わたしがなってあげる。',
      ],
    },
    dlg_evans_chat: {
      id: 'dlg_evans_chat',
      speaker: 'evans',
      lines: [
        'ボートの修理は順調だ。おまえたちの道具のおかげでな。',
        'マゼラン海峡は霧と風の難所だが、わしは何度も通っている。心配するな。',
      ],
    },
  },

  quests: {
    q_wood: {
      id: 'q_wood',
      title: '火を起こす',
      description: '浜辺の流木を3本集める',
      goal: { type: 'item', item: 'wood', count: 3 },
    },
    q_food: {
      id: 'q_food',
      title: '食べ物を探す',
      description: '潮だまりの貝を2つ採って食べる',
      goal: { type: 'counter', counter: 'shellfish_eaten', count: 2 },
    },
    q_lookout: {
      id: 'q_lookout',
      title: '島か、大陸か',
      description: '島の中央の高台にのぼり、四方を見渡す',
      goal: { type: 'flag', flag: 'seen_horizon' },
    },
    q_cave: {
      id: 'q_cave',
      title: '住みかを探す',
      description: '島の西、湖のほとりの岩壁を調べる',
      goal: { type: 'flag', flag: 'found_cave' },
    },
    q_move: {
      id: 'q_move',
      title: '大引っ越し',
      description: '浜のキャンプをたたみ、フレンチ・デンへ移る',
      goal: { type: 'flag', flag: 'cave_moved' },
    },
    q_firewood: {
      id: 'q_firewood',
      title: '冬支度',
      description: 'フレンチ・デンのまわりの森で薪を6本集める',
      goal: { type: 'item', item: 'wood', count: 6 },
    },
    q_map: {
      id: 'q_map',
      title: '島の地図を作る',
      description: '湾・丘・墓・罠の森・湿原——五つの場所を訪ね、名前をつける',
      goal: { type: 'counter', counter: 'landmark_named', count: 5 },
    },
    q_warn: {
      id: 'q_warn',
      title: '北へ——仲間に危険を知らせろ',
      description: '島の北端、ドニファンたちのキャンプへ向かう',
      goal: { type: 'flag', flag: 'doniphan_saved' },
    },
    q_battle: {
      id: 'q_battle',
      title: '決戦——フレンチ・デンを守れ',
      description: 'ウォルストン一味を迎え撃つ',
      goal: { type: 'flag', flag: 'walston_defeated' },
    },
    q_home: {
      id: 'q_home',
      title: '故郷へ',
      description: 'ボートが完成したら、浜から出航する',
      goal: { type: 'flag', flag: 'departed' },
    },
  },

  events: [
    {
      id: 'ev_opening',
      trigger: { type: 'gameStart' },
      steps: [
        {
          type: 'narration',
          lines: [
            '1860年2月14日、夜。ニュージーランド、オークランド港。',
            '寄宿学校チェアマン校の少年十四人と見習い水夫のモコは、明朝からの六週間の航海を前に、帆船スルギ号に泊まりこんでいた。',
            '船長たちが乗りこむのは、明日の朝のはずだった。——その夜、嵐が来た。',
          ],
        },
        { type: 'dialogue', id: 'dlg_drift' },
        {
          type: 'narration',
          lines: [
            '——それから十四日間。',
            '嵐はやまず、スルギ号は千八百マイルを流されつづけた。',
            '1860年3月、未明。轟音とともに、船は名も知らぬ陸地の浜に乗り上げた。',
          ],
        },
        { type: 'dialogue', id: 'dlg_intro' },
      ],
    },
    {
      id: 'ev_fire',
      trigger: { type: 'questComplete', quest: 'q_wood' },
      steps: [{ type: 'dialogue', id: 'dlg_fire' }],
    },
    {
      id: 'ev_food',
      trigger: { type: 'questComplete', quest: 'q_food' },
      steps: [{ type: 'dialogue', id: 'dlg_food' }],
    },
    {
      id: 'ev_night',
      trigger: { type: 'time', day: 1, hour: 19 },
      steps: [
        {
          type: 'narration',
          lines: ['日が沈む。', '焚き火のまわりに、十五の影が寄り集まった。'],
        },
        { type: 'dialogue', id: 'dlg_night' },
        { type: 'sleepUntilMorning' },
        {
          type: 'narration',
          lines: ['——第2日、朝。', '嵐が嘘のように、海は凪いでいた。'],
        },
        { type: 'dialogue', id: 'dlg_day2' },
      ],
    },
    {
      id: 'ev_island',
      trigger: { type: 'questComplete', quest: 'q_lookout' },
      steps: [
        {
          type: 'narration',
          lines: [
            '丘の頂きに立つと、答えは目の前に広がっていた。',
            '東も、西も、南も——水平線は、ひとつづきの円になって閉じている。',
            'ここは大陸ではない。島だ。',
          ],
        },
        { type: 'dialogue', id: 'dlg_island' },
      ],
    },
    {
      id: 'ev_cave',
      trigger: { type: 'questComplete', quest: 'q_cave' },
      steps: [
        {
          type: 'narration',
          lines: [
            '岩壁の奥に、ぽっかりと暗い口が開いていた。中は広く、乾いている。',
            '——そして、洞窟の奥に白骨があった。かたわらに錆びたナイフと、手書きの島の地図。',
            '地図の隅に、消えかけた署名。『F・ボードワン 1807』。',
          ],
        },
        { type: 'dialogue', id: 'dlg_cave' },
      ],
    },
    {
      id: 'ev_move',
      trigger: { type: 'questComplete', quest: 'q_move' },
      steps: [
        { type: 'effects', effects: { flags: ['sloughi_broken'] } },
        {
          type: 'narration',
          lines: [
            '引っ越しは八時間におよぶ大仕事になった。荷車を引き、湖を筏で渡り、何往復もして。',
            'その数日後——春の大嵐が来た。朝、浜に出ると、スルギ号はばらばらの板きれになっていた。',
            'もう船で眠ることはできない。だが、物資はすべて運び出したあとだった。',
          ],
        },
        { type: 'dialogue', id: 'dlg_settle' },
      ],
    },
    {
      id: 'ev_election',
      trigger: { type: 'questComplete', quest: 'q_firewood' },
      steps: [
        {
          type: 'narration',
          lines: [
            'ストーブに火が入り、フレンチ・デンは「家」になった。',
            '暮らしが整うと、ゴードンが皆を集めて言った。——「決めごとには、責任者がいる」。',
          ],
        },
        { type: 'dialogue', id: 'dlg_vote' },
        {
          type: 'narration',
          lines: [
            '少年たちは島に名前をつけた。——「チェアマン島」。ぼくらの学校の名前だ。',
          ],
        },
        { type: 'dialogue', id: 'dlg_map' },
      ],
    },
    {
      id: 'ev_map',
      trigger: { type: 'questComplete', quest: 'q_map' },
      steps: [
        {
          type: 'narration',
          lines: ['五つの場所に、名前がついた。', '島はもう「名も知らぬ陸地」ではない。'],
        },
        { type: 'dialogue', id: 'dlg_map_done' },
      ],
    },
    {
      id: 'ev_year2',
      trigger: { type: 'flag', flag: 'map_done' },
      steps: [
        {
          type: 'narration',
          lines: [
            '秋が駆け足で過ぎ、南半球の冬が来た。気温は下がり、洞窟の下の湖は厚い氷に閉ざされた。',
            '少年たちはスケートに夢中になった。——その日、湖に霧が出た。',
            '沖まで滑っていたドニファンとクロスが、帰ってこない。',
            'ブリアンは岸で銃を撃たせた。一発、また一発。音を頼りに、ふたつの影が霧の中から現れた。',
          ],
        },
        { type: 'dialogue', id: 'dlg_skate' },
        {
          type: 'narration',
          lines: [
            '少年たちはフレンチ・デンにこもり、ストーブを焚き、勉強し、議論し、ときにけんかをして——長い冬を越した。',
          ],
        },
        { type: 'skipDays', days: 300 },
        {
          type: 'narration',
          lines: ['——漂着から、一年がたった。', 'ゴードンの任期が終わり、二度目の選挙が行われた。'],
        },
        { type: 'dialogue', id: 'dlg_vote2' },
      ],
    },
    {
      id: 'ev_confession',
      trigger: { type: 'flag', flag: 'doniphan_left' },
      steps: [
        {
          type: 'narration',
          lines: [
            'その夜、フレンチ・デンは静かだった。四つ空いた寝床が、やけに目についた。',
            '焚き火のそばで、ジャックがブリアンの袖を引いた。今にも泣きだしそうな顔で。',
          ],
        },
        { type: 'dialogue', id: 'dlg_confess' },
      ],
    },
    {
      id: 'ev_severn',
      trigger: { type: 'flag', flag: 'jacques_confessed' },
      steps: [
        { type: 'skipDays', days: 30 },
        {
          type: 'narration',
          lines: [
            '数週間後の朝。海岸を見回っていた少年たちは、砂浜に打ち上げられたボートと——人影を見つけた。',
            '大人の女の人だった。……生きている！',
          ],
        },
        { type: 'dialogue', id: 'dlg_kate' },
      ],
    },
    {
      id: 'ev_rescue',
      trigger: { type: 'flag', flag: 'reached_north' },
      steps: [
        {
          type: 'narration',
          lines: [
            'そのとき——茂みの奥で銃声と悲鳴が上がった。',
            'ジャガーだ！ 倒れたドニファンに、大きな影が跳びかかろうとしている。',
            'ブリアンは考えるより先に、ナイフ一本で跳び出していた。',
            '獣の爪がブリアンの肩を裂く。だがひるまず組みつき——ウィルコックスの銃声とともに、ジャガーは闇へ逃げ去った。',
          ],
        },
        { type: 'dialogue', id: 'dlg_rescue' },
        {
          type: 'narration',
          lines: [
            '四人は荷物をまとめ、少年たちは全員でフレンチ・デンへ帰った。',
            '十五人が、ふたたびひとつになった。——迫り来るウォルストンの脅威を前にして。',
          ],
        },
      ],
    },
    {
      id: 'ev_kite',
      trigger: { type: 'flag', flag: 'doniphan_saved' },
      steps: [
        { type: 'skipDays', days: 7 },
        { type: 'dialogue', id: 'dlg_kite' },
        {
          type: 'narration',
          lines: [
            'その夜。風に乗って、大凧はブリアンを吊り上げた。地上百メートル。',
            '闇の中、島の東の岸に——ちらちらと、焚き火の光が見えた。',
            'ウォルストンたちの野営地だ。位置は、つかんだ。',
          ],
        },
        {
          type: 'effects',
          effects: { learning: ['l_kite'], flags: ['walston_located'] },
        },
      ],
    },
    {
      id: 'ev_evans',
      trigger: { type: 'flag', flag: 'walston_located' },
      steps: [
        { type: 'skipDays', days: 3 },
        {
          type: 'narration',
          lines: [
            '数日後の夜。見張りのモコが叫んだ。——湖の対岸から、何かが泳いでくる。',
            '……人だ！ 大人の男が、岸に這い上がってきた。',
          ],
        },
        { type: 'dialogue', id: 'dlg_evans' },
      ],
    },
    {
      id: 'ev_battle',
      trigger: { type: 'flag', flag: 'evans_here' },
      steps: [
        { type: 'skipDays', days: 2 },
        {
          type: 'narration',
          lines: [
            '二日後の夜。——やつらは来た。七つの影が、フレンチ・デンへ這い寄ってくる。',
            'ドニファンの銃が火を噴き、バクスターの投げ縄とボーラが先頭の男を打ち倒す。',
            'ジャックは火薬の袋を抱えて敵のただ中へ走り——川へ投げこんだ。轟音。水柱。',
            'エヴァンズの雄叫び。ウォルストンは倒れ、残った悪党は闇へ逃げ、二度と戻らなかった。',
          ],
        },
        { type: 'dialogue', id: 'dlg_victory' },
      ],
    },
    {
      id: 'ev_boat',
      trigger: { type: 'flag', flag: 'walston_defeated' },
      steps: [
        { type: 'skipDays', days: 40 },
        {
          type: 'narration',
          lines: [
            'それから一か月あまり。エヴァンズの指揮で、セヴァーン号のボートの修理がつづいた。',
            'スルギ号の帆布が張られ、食料と真水が積みこまれた。',
            '——1862年2月。出航の準備が、ととのった。浜のボートから、いつでも発てる。',
          ],
        },
        { type: 'effects', effects: { flags: ['boat_built'] } },
      ],
    },
    {
      id: 'ev_ending',
      trigger: { type: 'flag', flag: 'departed' },
      steps: [
        {
          type: 'narration',
          lines: [
            '1862年2月5日、朝。ボートは静かに浜を離れた。',
            '二年間を過ごした島——チェアマン島が、ゆっくりと遠ざかっていく。誰も、口をきかなかった。',
            '三日後。マゼラン海峡で、一隻の蒸気船が信号に気づいた。——オークランド行きの汽船だった。',
          ],
        },
        {
          type: 'narration',
          lines: [
            'オークランドの港は、大歓声に包まれた。死んだと思われていた十五人が、全員生きて帰ってきたのだ。',
            'ジャックはすべてを話した。人々は彼を責めるどころか、その勇気を称えた。',
            '少年たちの二年間の記録は、のちに一冊の本になった。——『十五少年漂流記』。',
            '（物語はここまで。島での暮らしは、このまま自由につづけられます。）',
          ],
        },
        {
          type: 'effects',
          effects: { learning: ['l_return'], params: { morale: 100 } },
        },
      ],
    },
  ],

  learnings: {
    l_fire: {
      id: 'l_fire',
      title: '火と体温',
      body:
        '遭難時、人を最初に追いつめるのは飢えではなく「冷え」だとされる。体温維持を最優先する考え方は、19世紀の航海術でも現代のサバイバル理論でも変わらない。少年たちが真っ先に火を求めたのは、正しかった。',
      tags: ['サバイバル', '19世紀'],
    },
    l_tidepool: {
      id: 'l_tidepool',
      title: '潮だまりは天然の食料庫',
      body:
        '貝や海藻は、道具がなくても採れる最初の食料。ただし生食は中毒の危険があり、火を通すのが鉄則だった。漂着者がまず岩場を探すのは、19世紀の船乗りの常識でもあった。',
      tags: ['食', 'サバイバル'],
    },
    l_priorities: {
      id: 'l_priorities',
      title: '遭難したとき、最初に何をするか',
      body:
        '「避難所→火→水→食料」。生き延びた遭難者の記録は、おおむねこの順番を守っている。そしてもうひとつ大事なのが「役割を決めること」——十五人の少年たちは、これからそれを学んでいく。',
      tags: ['サバイバル', 'リーダーシップ'],
    },
    l_salvage: {
      id: 'l_salvage',
      title: '難破船は最大の資源',
      body:
        '原作でも少年たちは、嵐で船体が壊れる前に食料・道具・武器・帆布まで根こそぎ浜へ運び出した。遭難者にとって難破船は「失敗の残骸」ではなく最大の物資庫——19世紀の漂流記の多くが、まず船の解体から始まっている。',
      tags: ['サバイバル', '19世紀'],
    },
    l_island: {
      id: 'l_island',
      title: '島か、大陸か',
      body:
        '漂着者が最初に確かめるべきは「ここはどこか」。高い場所から見て、水平線が全方位で閉じていれば島の可能性が高い。この一点で、歩いて帰れるかどうか——生存戦略のすべてが変わる。地理の知識は、命を支える知識でもあった。',
      tags: ['地理', 'サバイバル'],
    },
    l_baudoin: {
      id: 'l_baudoin',
      title: '先人の遺産',
      body:
        'フレンチ・デンには、五十年前にただひとりこの島で生きたフランス人・ボードワンの遺品——島の地図とナイフ——が残されていた。先人の記録は、あとから来る者の命を救う。少年たちが彼を丁重に葬り、洞窟に彼の名をつけたのは、その恩に報いるためだった。',
      tags: ['歴史', '19世紀'],
    },
    l_democracy: {
      id: 'l_democracy',
      title: '島の選挙',
      body:
        '十五人は首長を「任期一年の選挙」で決めた。無人島でも、人が集まれば決めごとが要る。ヴェルヌがこの物語で描いたのは冒険だけではなく、「子どもだけで社会を営めるか」という壮大な実験だった。時間割を作り、勉強を続けたのもその一部だ。',
      tags: ['社会', 'リーダーシップ'],
    },
    l_split: {
      id: 'l_split',
      title: '多数決の限界',
      body:
        '選挙は公正でも、負けた側の気持ちまでは癒せない。ドニファンの離脱は、「決を採ること」と「納得すること」が別物だと教えてくれる。そして分裂を修復したのは、制度ではなく——命がけの行動だった。',
      tags: ['社会', 'リーダーシップ'],
    },
    l_mooring: {
      id: 'l_mooring',
      title: 'もやい綱一本の重さ',
      body:
        '船を岸につなぐもやい綱は、子どものいたずらでも解けるほど身近で、それが十五人の運命を変えた。小さな行動が取り返しのつかない結果を招くこと。そして、告白する勇気が人を軽くすること。ジャックの二年間が、それを物語っている。',
      tags: ['心', '航海'],
    },
    l_mutiny: {
      id: 'l_mutiny',
      title: '19世紀の海と無法',
      body:
        'セヴァーン号の反乱のように、19世紀の航海では船員の反乱や海賊行為が現実の脅威だった。無線もない時代、外洋の船は「法の届かない世界」であり、船長の権威と船員の規律だけが秩序を支えていた。',
      tags: ['歴史', '航海', '19世紀'],
    },
    l_kite: {
      id: 'l_kite',
      title: '人を持ち上げる凧',
      body:
        '人間を吊り上げる大凧は空想ではない。19世紀には偵察や気象観測のための有人凧が実際に研究されていた。気球より安く、風さえあれば飛ばせる——ブリアンの「空から探す」という発想は、当時の最先端の科学だったのだ。',
      tags: ['科学', '19世紀'],
    },
    l_hanover: {
      id: 'l_hanover',
      title: '島の本当の名前',
      body:
        'チェアマン島の正体は、南米チリ沖の「ハノーバー島」だった（原作の設定）。マゼラン海峡のすぐ北にある、実在の島だ。少年たちは二年間、航路のすぐそばにいた——「自分がどこにいるかを知ること」の重さが、ここでも効いてくる。',
      tags: ['地理', '19世紀'],
    },
    l_return: {
      id: 'l_return',
      title: '二年間の休暇',
      body:
        'この物語の原題は『Deux ans de vacances（二年間の休暇）』。ヴェルヌは「少年だけの社会は成り立つか」という問いを立て、けんかも分裂も乗り越えて全員で帰る、という答えを出した。十五人は島で、学校では学べないものを学んだのだ。',
      tags: ['文学', '19世紀'],
    },
    l_mapping: {
      id: 'l_mapping',
      title: '地図を作るということ',
      body:
        '少年たちはボードワンの残した地図を歩いて確かめ、湾や川や森のひとつひとつに投票で名前をつけた。19世紀は探検と測量の時代——名前をつけることは「ここを知っている」という宣言であり、土地はそれで初めて「自分たちの島」になる。ゴードンの一年は、島全体をノートに写しとる一年だった。',
      tags: ['地理', '19世紀'],
    },
    l_lm_bay: {
      id: 'l_lm_bay',
      title: 'スルギ湾',
      body:
        '漂着の浜は、自分たちを運んだ船スルギ号の名を取って「スルギ湾」と名づけられた。船乗りは沈んだ船の名を海図に残す——船は道具であると同時に、乗った者みんなの記憶だからだ。',
      tags: ['地理', '航海'],
    },
    l_lm_hill: {
      id: 'l_lm_hill',
      title: 'オークランドの丘',
      body:
        '見張りの高台には、故郷の町の名を取って「オークランドの丘」と名づけた。開拓者たちは新しい土地に故郷の名を移す——ニューヨークも、ニュージーランドも、そうして生まれた地名だ。名前は、帰りたい場所を忘れないための錨でもある。',
      tags: ['地理', '19世紀'],
    },
    l_lm_grave: {
      id: 'l_lm_grave',
      title: 'ボードワンの墓',
      body:
        '少年たちは、この島でただひとり生き、ただひとり死んだフランス人ボードワンの墓を守り続けた。遺品の地図に助けられた恩を、花と祈りで返す。会ったことのない先人を弔う心は、時代も国も越えて変わらない。',
      tags: ['歴史', '心'],
    },
    l_lm_traps: {
      id: 'l_lm_traps',
      title: '罠猟と弾薬の節約',
      body:
        'ゴードンは銃の使用を制限した。「弾は買い足せない。罠と投げ縄を覚えろ」——火薬は決して戻らない消耗品だからだ。ウィルコックスは落とし穴と括り罠で鳥や小獣を獲り、ボーラ（投げ縄）の練習も重ねた。限りある資源で暮らす知恵は、狩りの腕より大切だった。',
      tags: ['サバイバル', '19世紀'],
    },
    l_lm_moors: {
      id: 'l_lm_moors',
      title: 'サウス・ムーアの湿原',
      body:
        '島の南西に広がる湿原は水鳥の宝庫だが、泥炭のぬかるみに足を取られれば独りでは抜け出せない。少年たちは「湿原へは必ず二人以上で」と決めた。豊かな場所ほど危険も濃い——猟場の鉄則だ。',
      tags: ['地理', 'サバイバル'],
    },
    l_severn: {
      id: 'l_severn',
      title: 'セヴァーン海岸の十字架',
      body:
        '東の海岸には、セヴァーン号の残骸とともに打ち上げられた者たちが眠る。少年たちは敵であった男たちの亡骸にも十字架を立てた。海で死んだ者は敵味方なく弔う——それが海のしきたりであり、少年たちが大人になった証だった。',
      tags: ['航海', '心'],
    },
    l_salt: {
      id: 'l_salt',
      title: '塩をつくる',
      body:
        '岩のくぼみに海水を張り、日に干せば塩が残る——天日製塩は人類最古の化学工業だ。塩は味つけ以上に「保存」の要で、肉も魚も塩漬けにすれば冬を越せる。冷蔵庫のない時代、塩は文字どおり命をつなぐ結晶だった。',
      tags: ['食', '科学'],
    },
    l_seal: {
      id: 'l_seal',
      title: 'アザラシ油のランプ',
      body:
        '少年たちはアザラシの脂肪を煮て油を採り、冬の長い夜の灯りにした。電気のない19世紀、世界の夜を照らしていたのは鯨油や獣脂のランプだ。灯りがあれば夜に本が読める——洞窟の「学校」は、この油で続いた。',
      tags: ['19世紀', '科学'],
    },
    l_sugar: {
      id: 'l_sugar',
      title: '木からとる砂糖',
      body:
        'ゴードンはアメリカで覚えた知恵で、カエデに似た木の幹に切りこみを入れて甘い樹液を集めた。煮つめればシロップになり、砂糖の代わりになる。北米の開拓者はメープルシロップで冬の甘味をまかなった——森は、知っている者にだけ菓子屋になる。',
      tags: ['食', '19世紀'],
    },
    l_stars: {
      id: 'l_stars',
      title: '南十字星',
      body:
        '南半球の夜空には北極星がない。代わりに船乗りたちは南十字星から天の南極を割り出して方角を知った。少年たちが丘の上で見上げた星空は、故郷ニュージーランドと同じ南の空——星は、時計にも羅針盤にも地図にもなる。',
      tags: ['科学', '航海'],
    },
    l_ice: {
      id: 'l_ice',
      title: '氷上の霧',
      body:
        '冬、湖でスケートに夢中になった少年たちは、突然の霧に方角を失った。岸から撃つ銃声だけが帰り道を教えた——音は霧を貫くからだ。視界を失ったとき頼れるのは音と方位磁石。遊びの一日が、遭難と紙一重だと知った日だった。',
      tags: ['サバイバル', '科学'],
    },
    l_rhea: {
      id: 'l_rhea',
      title: 'サーヴィスとナンドゥ',
      body:
        'サーヴィスは捕まえたナンドゥ（南米のダチョウ）に乗ろうとして、みごとに振り落とされた。愛読書『スイスのロビンソン』の真似だ。ヴェルヌはここで、本の中の冒険と現実の距離を笑ってみせる——それでも「本で読んだことを試す」少年の心が、この物語全体を動かしている。',
      tags: ['文学', '心'],
    },
    l_hall: {
      id: 'l_hall',
      title: '洞窟を広げる',
      body:
        '手先の器用なバクスターの指揮で、少年たちはつるはしを振るい、フレンチ・デンの奥にもうひとつの広間と貯蔵室を掘り抜いた。火薬を使えば早いが、崩落が怖い——だから少しずつ、岩の質を確かめながら掘る。住まいは与えられるものではなく、自分の手で育てていくものだと少年たちは学んだ。',
      tags: ['技術', 'サバイバル'],
    },
    l_cook: {
      id: 'l_cook',
      title: 'モコの台所',
      body:
        '見習い水夫のモコは十五人でただひとり料理ができた。ナンドゥの卵、水鳥のロースト、塩漬け肉のスープ——限られた材料で毎日ちがう食事を出す工夫が、みんなの体と心を支えた。船でも家でも、料理番は縁の下の英雄だ。',
      tags: ['食', '心'],
    },
    l_school: {
      id: 'l_school',
      title: '島の学校',
      body:
        'ゴードンは時間割を作り、年長組が年少組に読み書きと計算を教えた。日曜には討論会を開き、ひとつの題について賛成と反対に分かれて論じ合う。漂流しても学びを止めない——それは「いつか帰る」という意志の表明でもあった。',
      tags: ['社会', 'リーダーシップ'],
    },
    l_winter: {
      id: 'l_winter',
      title: '南半球の冬支度',
      body:
        '南半球では6月から8月が冬になる。チェアマン島の冬は氷点下30度まで下がり、何週間も外へ出られない。だから秋のうちに薪を山と積み、燻製と塩漬けを貯蔵室いっぱいに蓄える。冬を越せるかどうかは、冬が来る前に決まっている。',
      tags: ['地理', 'サバイバル'],
    },
    l_livestock: {
      id: 'l_livestock',
      title: '囲いの家畜',
      body:
        '少年たちは罠で生け捕りにしたグアナコやビクーニャを柵の中で飼い、乳をしぼった。狩りは獲れる日と獲れない日があるが、家畜は毎日応えてくれる。「獲る暮らし」から「育てる暮らし」へ——人類が一万年前に通った道を、少年たちは二年でなぞったのだ。',
      tags: ['食', '歴史'],
    },
    l_phann: {
      id: 'l_phann',
      title: '犬のファン',
      body:
        'スルギ号にはファンという犬が乗っていた。十六人目の漂流者だ。人の何万倍も鋭い鼻で獲物を追い、危険を吠えて知らせ、落ちこんだ夜にはそっと寄りそう。ボードワンの洞窟の前でファンが悲しげに鳴いたとき、少年たちは先人の運命を悟った。犬は道具ではなく、仲間だった。',
      tags: ['心', 'サバイバル'],
    },
    l_signal: {
      id: 'l_signal',
      title: '丘の信号マスト',
      body:
        '少年たちはオークランドの丘にマストを立て、旗を掲げた。沖を通る船に「ここに人がいる」と伝えるためだ。無線のない19世紀、旗と煙と鏡の反射が海の言葉だった。誰も見ていなくても掲げ続ける——救助を待つ者の仕事は、希望を絶やさないことだ。',
      tags: ['航海', '19世紀'],
    },
    l_festival: {
      id: 'l_festival',
      title: '島の祝祭',
      body:
        '漂流二年目の新年、少年たちはごちそうを並べ、歌い、競技会まで開いた。明日の命も知れない島で、なぜ祝うのか。祝祭は「私たちはまだ文明人だ」という宣言であり、暦を守ることは帰る日への糸を手放さないことだからだ。',
      tags: ['心', '社会'],
    },
  },

  interactables: [
    ...driftwood,
    ...shellfish,
    ...firewood,
    {
      id: 'ship_wreck',
      position: SHIP,
      prompt: 'スルギ号の船内を調べる',
      radius: 5,
      once: true,
      hideFlag: 'sloughi_broken',
      effects: { dialogue: 'dlg_ship' },
    },
    // ===== 章の進行ポイント =====
    {
      id: 'lookout',
      position: LOOKOUT,
      prompt: '高台にのぼり、四方を見渡す',
      radius: 3.5,
      once: true,
      requiresFlag: 'ch2_started',
      effects: { flags: ['seen_horizon'], params: { stamina: -12 }, minutes: 240 },
    },
    {
      id: 'cave_find',
      position: CAVE,
      prompt: '岩壁の洞窟を調べる',
      radius: 4,
      once: true,
      requiresFlag: 'seen_horizon',
      effects: { flags: ['found_cave'], minutes: 60 },
    },
    {
      id: 'do_move',
      position: [7, 78.5],
      prompt: 'キャンプをたたみ、フレンチ・デンへ移る',
      radius: 2.4,
      once: true,
      requiresFlag: 'found_cave',
      effects: { flags: ['cave_moved'], params: { development: 10, stamina: -10 }, minutes: 480 },
    },
    {
      id: 'north_camp',
      position: NORTH,
      prompt: 'ドニファンたちのキャンプに近づく',
      radius: 4,
      once: true,
      requiresFlag: 'kate_here',
      effects: { flags: ['reached_north'], params: { stamina: -15 }, minutes: 300 },
    },
    {
      id: 'boat_depart',
      position: BOAT,
      prompt: 'ボートに乗りこみ、島を発つ',
      radius: 4,
      once: true,
      requiresFlag: 'boat_built',
      hideFlag: 'departed',
      effects: { flags: ['departed'] },
    },
    // ===== 島の地図作り（ゴードンの一年・地名の命名） =====
    {
      id: 'lm_bay',
      position: LANDMARKS.bay,
      prompt: '浜に立ち、この湾に名前をつける',
      radius: 3.5,
      once: true,
      requiresFlag: 'map_started',
      effects: { counters: { landmark_named: 1 }, learning: ['l_lm_bay'], minutes: 90 },
    },
    {
      id: 'lm_hill',
      position: LANDMARKS.hill,
      prompt: '高台に立ち、この丘に名前をつける',
      radius: 3.5,
      once: true,
      requiresFlag: 'map_started',
      effects: { counters: { landmark_named: 1 }, learning: ['l_lm_hill'], minutes: 120 },
    },
    {
      id: 'lm_grave',
      position: LANDMARKS.grave,
      prompt: 'ボードワンの墓に花を供える',
      radius: 3.5,
      once: true,
      requiresFlag: 'map_started',
      effects: { counters: { landmark_named: 1 }, learning: ['l_lm_grave'], minutes: 90 },
    },
    {
      id: 'lm_traps',
      position: LANDMARKS.traps,
      prompt: 'ウィルコックスの罠を見る',
      radius: 3.5,
      once: true,
      requiresFlag: 'map_started',
      effects: {
        counters: { landmark_named: 1 },
        learning: ['l_lm_traps'],
        params: { hunger: 6 },
        minutes: 150,
      },
    },
    {
      id: 'lm_moors',
      position: LANDMARKS.moors,
      prompt: '湿原のふちを歩き、名前をつける',
      radius: 3.5,
      once: true,
      requiresFlag: 'map_started',
      effects: {
        counters: { landmark_named: 1 },
        learning: ['l_lm_moors'],
        params: { stamina: -10 },
        minutes: 180,
      },
    },
    {
      id: 'lm_severn',
      position: LANDMARKS.severn,
      prompt: 'セヴァーン海岸に十字架を立てる',
      radius: 4,
      once: true,
      requiresFlag: 'walston_defeated',
      effects: { learning: ['l_severn'], params: { morale: 3 }, minutes: 120 },
    },
    // ===== フレンチ・デン時代の生活技術 =====
    {
      id: 'act_salt',
      position: SALT_ROCK,
      prompt: '岩のくぼみに海水を張り、塩をつくる',
      radius: 3,
      once: true,
      requiresFlag: 'cave_moved',
      effects: { learning: ['l_salt'], params: { supplies: 5 }, minutes: 120 },
    },
    {
      id: 'act_seal',
      position: SEAL_ROCK,
      prompt: 'アザラシの脂肪から灯りの油をとる',
      radius: 3.5,
      once: true,
      requiresFlag: 'cave_moved',
      effects: { learning: ['l_seal'], params: { supplies: 5, stamina: -8 }, minutes: 180 },
    },
    {
      id: 'act_sugar',
      position: SUGAR_TREE,
      prompt: '木の幹に切りこみを入れ、甘い樹液を集める',
      radius: 3,
      once: true,
      requiresFlag: 'cave_moved',
      effects: { learning: ['l_sugar'], params: { hunger: 8 }, minutes: 120 },
    },
    {
      id: 'act_stars',
      position: STARGAZE,
      prompt: '丘の上で南の星空を見上げる',
      radius: 3.5,
      once: true,
      requiresFlag: 'cave_moved',
      effects: { learning: ['l_stars'], params: { morale: 4 }, minutes: 90 },
    },
    {
      id: 'act_rhea',
      position: RHEA,
      prompt: 'サーヴィスのナンドゥを見にいく',
      radius: 3.5,
      once: true,
      requiresFlag: 'cave_moved',
      effects: { dialogue: 'dlg_rhea' },
    },
    {
      id: 'act_hall',
      position: HALL_DIG,
      prompt: 'バクスターと奥の広間を掘る',
      radius: 2.8,
      once: true,
      requiresFlag: 'cave_moved',
      effects: {
        learning: ['l_hall'],
        params: { development: 8, stamina: -12 },
        minutes: 300,
      },
    },
    {
      id: 'act_kitchen',
      position: KITCHEN,
      prompt: 'モコの台所をのぞく',
      radius: 2.6,
      once: true,
      requiresFlag: 'cave_moved',
      effects: { learning: ['l_cook'], params: { hunger: 10, morale: 2 }, minutes: 60 },
    },
    {
      id: 'act_school',
      position: SCHOOL,
      prompt: '日曜の討論会に参加する',
      radius: 2.8,
      once: true,
      requiresFlag: 'gordon_president',
      effects: { learning: ['l_school'], params: { morale: 5 }, minutes: 120 },
    },
    {
      id: 'act_winterstock',
      position: WOODPILE,
      prompt: '冬に備えて薪を積み上げる',
      radius: 2.8,
      once: true,
      requiresFlag: 'map_done',
      effects: {
        learning: ['l_winter'],
        params: { supplies: 8, stamina: -10 },
        minutes: 240,
      },
    },
    {
      id: 'act_corral',
      position: CORRAL,
      prompt: '囲いのグアナコに草をやる',
      radius: 3.5,
      once: true,
      requiresFlag: 'map_done',
      effects: { learning: ['l_livestock'], params: { morale: 3 }, minutes: 90 },
    },
    {
      id: 'pet_dog',
      position: DOG_BEACH,
      prompt: '犬のファンをなでる',
      radius: 2.4,
      once: true,
      hideFlag: 'cave_moved',
      effects: { learning: ['l_phann'], params: { morale: 4 } },
    },
    {
      id: 'pet_dog2',
      position: DOG_CAVE,
      prompt: '犬のファンをなでる',
      radius: 2.4,
      once: true,
      requiresFlag: 'cave_moved',
      effects: { learning: ['l_phann'], params: { morale: 4 } },
    },
    {
      id: 'act_signal',
      position: SIGNAL_MAST,
      prompt: '信号マストに旗を掲げる',
      radius: 3,
      once: true,
      requiresFlag: 'map_started',
      effects: { learning: ['l_signal'], params: { morale: 3 }, minutes: 120 },
    },
    {
      id: 'act_festival',
      position: FESTIVAL,
      prompt: '新年の祝いをひらく',
      radius: 3,
      once: true,
      requiresFlag: 'briant_president',
      effects: { learning: ['l_festival'], params: { morale: 8, hunger: 12 }, minutes: 300 },
    },
    // ===== 浜のキャンプ時代の仲間たち =====
    {
      id: 'npc_briant',
      position: NPC_POS.briant,
      prompt: 'ブリアンと話す',
      radius: 2.8,
      hideFlag: 'cave_moved',
      effects: { dialogue: 'dlg_chat' },
    },
    {
      id: 'npc_gordon',
      position: NPC_POS.gordon,
      prompt: 'ゴードンと話す',
      radius: 2.6,
      hideFlag: 'cave_moved',
      effects: { dialogue: 'dlg_gordon_chat' },
    },
    {
      id: 'npc_doniphan',
      position: NPC_POS.doniphan,
      prompt: 'ドニファンと話す',
      radius: 2.6,
      hideFlag: 'cave_moved',
      effects: { dialogue: 'dlg_doniphan_chat' },
    },
    {
      id: 'npc_jacques',
      position: NPC_POS.jacques,
      prompt: 'ジャックと話す',
      radius: 2.6,
      hideFlag: 'cave_moved',
      effects: { dialogue: 'dlg_jacques_chat' },
    },
    {
      id: 'npc_baxter',
      position: NPC_POS.baxter,
      prompt: 'バクスターと話す',
      radius: 2.6,
      hideFlag: 'cave_moved',
      effects: { dialogue: 'dlg_baxter_chat' },
    },
    {
      id: 'npc_service',
      position: NPC_POS.service,
      prompt: 'サーヴィスと話す',
      radius: 2.6,
      hideFlag: 'cave_moved',
      effects: { dialogue: 'dlg_service_chat' },
    },
    {
      id: 'npc_littles',
      position: NPC_POS.littles,
      prompt: '年少組のふたりと話す',
      radius: 2.6,
      hideFlag: 'cave_moved',
      effects: { dialogue: 'dlg_littles_chat' },
    },
    {
      id: 'npc_moko',
      position: NPC_POS.moko,
      prompt: 'モコと話す',
      radius: 2.6,
      hideFlag: 'cave_moved',
      effects: { dialogue: 'dlg_moko_chat' },
    },
    // ===== フレンチ・デン時代の仲間たち =====
    {
      id: 'npc_briant2',
      position: CAVE_POS.briant,
      prompt: 'ブリアンと話す',
      radius: 2.8,
      requiresFlag: 'cave_moved',
      effects: { dialogue: 'dlg_chat2' },
    },
    {
      id: 'npc_gordon2',
      position: CAVE_POS.gordon,
      prompt: 'ゴードンと話す',
      radius: 2.6,
      requiresFlag: 'cave_moved',
      effects: { dialogue: 'dlg_gordon_chat2' },
    },
    {
      id: 'npc_doniphan2',
      position: CAVE_POS.doniphan,
      prompt: 'ドニファンと話す',
      radius: 2.6,
      requiresFlag: 'cave_moved',
      hideFlag: 'doniphan_left',
      effects: { dialogue: 'dlg_doniphan_chat2' },
    },
    {
      id: 'npc_doniphan3',
      position: CAVE_POS.doniphan,
      prompt: 'ドニファンと話す',
      radius: 2.6,
      requiresFlag: 'doniphan_saved',
      effects: { dialogue: 'dlg_doniphan_chat3' },
    },
    {
      id: 'npc_jacques2',
      position: CAVE_POS.jacques,
      prompt: 'ジャックと話す',
      radius: 2.6,
      requiresFlag: 'cave_moved',
      hideFlag: 'jacques_confessed',
      effects: { dialogue: 'dlg_jacques_chat2' },
    },
    {
      id: 'npc_jacques3',
      position: CAVE_POS.jacques,
      prompt: 'ジャックと話す',
      radius: 2.6,
      requiresFlag: 'jacques_confessed',
      effects: { dialogue: 'dlg_jacques_chat3' },
    },
    {
      id: 'npc_baxter2',
      position: CAVE_POS.baxter,
      prompt: 'バクスターと話す',
      radius: 2.6,
      requiresFlag: 'cave_moved',
      effects: { dialogue: 'dlg_baxter_chat2' },
    },
    {
      id: 'npc_service2',
      position: CAVE_POS.service,
      prompt: 'サーヴィスと話す',
      radius: 2.6,
      requiresFlag: 'cave_moved',
      effects: { dialogue: 'dlg_service_chat2' },
    },
    {
      id: 'npc_littles2',
      position: CAVE_POS.littles,
      prompt: '年少組のふたりと話す',
      radius: 2.6,
      requiresFlag: 'cave_moved',
      effects: { dialogue: 'dlg_littles_chat2' },
    },
    {
      id: 'npc_moko2',
      position: CAVE_POS.moko,
      prompt: 'モコと話す',
      radius: 2.6,
      requiresFlag: 'cave_moved',
      effects: { dialogue: 'dlg_moko_chat2' },
    },
    {
      id: 'npc_kate',
      position: CAVE_POS.kate,
      prompt: 'ケイトと話す',
      radius: 2.6,
      requiresFlag: 'kate_here',
      effects: { dialogue: 'dlg_kate_chat' },
    },
    {
      id: 'npc_evans',
      position: CAVE_POS.evans,
      prompt: 'エヴァンズと話す',
      radius: 2.6,
      requiresFlag: 'evans_here',
      effects: { dialogue: 'dlg_evans_chat' },
    },
  ],

  startTime: { day: 1, hour: 6 },
  spawn: SPAWN,
  Scene: IslandScene,
};
