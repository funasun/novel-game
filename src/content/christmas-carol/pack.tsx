import type { ContentPack } from '../../engine/types';
import { CarolScene } from './scene/CarolScene';
import {
  SPAWN,
  OFFICE,
  OFFICE_DOOR,
  HOME,
  KNOCKER,
  BED,
  HEARTH,
  SQUARE,
  CHURCH,
  CHURCH_DOOR,
  CRATCHIT,
  CRATCHIT_WIN,
  FRED,
  FRED_WIN,
  VISION_SQ,
  PAST_ENTRY,
  PAST_C,
  SCHOOL,
  SCHOOL_SPOT,
  FEZZIWIG,
  FEZZIWIG_SPOT,
  BELLE_SPOT,
  FUT_ENTRY,
  FUT_C,
  EXCHANGE_SPOT,
  RAGSHOP,
  RAGSHOP_SPOT,
  DIM_SPOT,
  GRAVE,
  GRAVE_SPOT,
  FOLK_POS,
} from './layout';

// Layer 3: ディケンズ『クリスマス・キャロル』を「心の再生ゲーム」として翻案。
// パラメータは 温もり・悔恨・金貨。凍った心が三人の精霊の夜を経て溶けてゆく。
// テキストはすべて自作の翻案（既訳の複製ではない）。原作は Public Domain。

export const christmasCarol: ContentPack = {
  id: 'christmas-carol',
  title: 'クリスマス・キャロル',
  author: 'C・ディケンズ',
  blurb:
    '1843年、雪のロンドン。クリスマス・イヴの夜、守銭奴スクルージのもとに死んだ相棒の亡霊と三人の精霊が訪れる。凍った心が溶けるまでの、ひと晩の「心の再生」を生きる。',
  accent: '#a33b2e',
  Scene: CarolScene,
  startTime: { day: 1, hour: 17 },
  spawn: SPAWN,

  // 心の温度計。金貨は「手放すほど心が温まる」逆説の資源。
  parameters: {
    warmth: { label: '温もり', min: 0, max: 100, initial: 5 },
    remorse: { label: '悔恨', min: 0, max: 100, initial: 0 },
    coins: { label: '金貨', min: 0, max: 99, initial: 40 },
  },

  items: {},

  characters: {
    bob: { name: 'ボブ・クラチット', note: '事務所の書記。週十五シリングで七人の家族を養う。末の息子は足の悪いティム。' },
    fred: { name: 'フレッド', note: 'スクルージの甥。亡き妹の忘れ形見。毎年イヴに晩餐へ誘いに来る、あきらめの悪い男。' },
    charity: { name: '慈善の紳士', note: '貧しい人々に石炭と食事を、と寄付を募って歩く二人組。' },
    marley: { name: 'ジェイコブ・マーレイ', note: '七年前の今夜に死んだ、スクルージの共同経営者。生前に鍛えた鎖を引きずって現れる。' },
    spirit1: { name: '過去の精霊', note: '頭から蝋燭の炎のような光を立てる、白い衣の精霊。消し帽子を持つ。' },
    spirit2: { name: '現在の精霊', note: '緑の衣にヒイラギの冠。ゆたかな笑い声の巨人。松明から祝福を振りまく。' },
    spirit3: { name: '未来の精霊', note: '黒衣の精霊。ひとことも語らず、ただ行く手を指さす。' },
    belle: { name: 'ベル', note: '若き日のスクルージの婚約者。「あなたの心は、わたしより金貨を選んだ」と指輪を返した。' },
    fezziwig: { name: 'フェジウィッグ', note: '若き日のスクルージの雇い主。イヴには倉庫を舞踏会に変えてしまう陽気な親方。' },
    poulterer: { name: '鶏肉屋', note: '市場の店先に鵞鳥と七面鳥を吊るす。賞品ものの大七面鳥が自慢。' },
    lamplighter: { name: '点灯夫', note: '梯子をかついで街のガス灯をひとつずつ灯してまわる。' },
    chestnutman: { name: '焼き栗売り', note: '火鉢の炭で栗を焼く。寒い街角のちいさな暖炉。' },
    carolboy: { name: '聖歌の子', note: '戸口でクリスマス・キャロルを歌って小銭をもらう子ども。' },
    tim: { name: 'タイニー・ティム', note: 'ボブの末息子。松葉杖の小さな体に、だれより大きな祝福を宿す。' },
    voice: { name: '声', note: '' },
  },

  dialogues: {
    // ── クリスマス・イヴの店じまい ──
    dlg_coal: {
      id: 'dlg_coal',
      speaker: 'bob',
      lines: [
        '（書記のボブが、かじかんだ手を蝋燭であぶっている）',
        '旦那……石炭を、もうひと欠けだけ足してもよろしいでしょうか。インク壺が凍りそうで。',
      ],
      choices: [
        {
          text: '「石炭は一枚で足りる。上着を着ればよかろう」',
          effects: { counters: { eve_scenes: 1 }, minutes: 30, params: { remorse: 2 } },
        },
        {
          text: '「……今夜くらいは、足すがいい」',
          effects: { counters: { eve_scenes: 1 }, minutes: 30, params: { warmth: 3, coins: -1 } },
        },
      ],
    },
    dlg_fredvisit: {
      id: 'dlg_fredvisit',
      speaker: 'fred',
      lines: [
        'メリー・クリスマス、伯父さん！　神さまのお恵みがありますように！',
        '明日はうちで晩餐です。妻も待っています。来てくださるでしょう？',
        'クリスマスで儲かったことなど一度もない、と伯父さんは言う。でも僕は、この季節に儲け以外のものをたくさんもらってきました。だから言うんです——神さまの祝福を、と。',
      ],
      choices: [
        {
          text: '「ふん、くだらん！　クリスマスなど、勘定を払う日が一日近づくだけだ」',
          effects: { counters: { eve_scenes: 1 }, minutes: 30, params: { remorse: 2 } },
        },
        {
          text: '「……気持ちだけ受け取っておく。帰れ」',
          effects: { counters: { eve_scenes: 1 }, minutes: 30, params: { warmth: 2 } },
        },
      ],
    },
    dlg_charity: {
      id: 'dlg_charity',
      speaker: 'charity',
      lines: [
        '失礼、スクルージ様の事務所ですかな。この聖なる季節、貧しい人々に食べ物と石炭をと、ささやかな基金を募っております。',
        '何とお名前を頂戴できましょう？',
      ],
      choices: [
        {
          text: '「名は無用。監獄はあるだろう、救貧院は。わたしはそこを支える税を払っている」',
          effects: {
            counters: { eve_scenes: 1 },
            minutes: 30,
            params: { remorse: 3 },
            learning: ['l_workhouse'],
          },
        },
        {
          text: '「……少しだけだ。持っていけ」',
          effects: {
            counters: { eve_scenes: 1 },
            minutes: 30,
            params: { warmth: 4, coins: -5 },
            learning: ['l_workhouse'],
          },
        },
      ],
    },

    // ── マーレイの亡霊 ──
    dlg_marley_1: {
      id: 'dlg_marley_1',
      speaker: 'marley',
      lines: [
        '（ノッカーの真鍮が、見覚えのある顔になる。眼鏡を額に上げた、あの顔に）',
        'スクルージ……。',
        '（部屋に入ると、地下の酒蔵から鎖を引きずる音が階段を上ってくる。扉は閂ごと、すり抜けられた）',
        'わたしだ。ジェイコブ・マーレイだ。七年前の今夜に死んだ、おまえの相棒だ。',
      ],
      effects: { next: 'dlg_marley_2' },
    },
    dlg_marley_2: {
      id: 'dlg_marley_2',
      speaker: 'marley',
      lines: [
        'この鎖が見えるか。帳簿、金庫、証文、南京錠——わたしが生きているあいだに、一環また一環、自分で鍛えた鎖だ。',
        'おまえの鎖は、七年前ですでにこれと同じ長さだった。あれから、ずいぶん継ぎ足したな。',
        '商売こそ大事だと？　違う。人類こそ、わたしの商売であるべきだった。',
        'おまえには、まだ望みがある。今夜、三人の精霊が訪れる。一時の鐘が鳴るとき、最初のひとりが。',
        '……その訪れを、逃すな。',
      ],
      effects: { flags: ['marley'], minutes: 60, params: { remorse: 6 }, learning: ['l_marley'] },
    },

    // ── 三人の精霊 ──
    dlg_spirit1: {
      id: 'dlg_spirit1',
      speaker: 'spirit1',
      lines: [
        '（一時の鐘。カーテンが開かれる。白い衣、頭に蝋燭の炎のような光）',
        'わたしは過去のクリスマスの精霊。——おまえの過去の、だ。',
        'さあ、手を。見せたいものがある。おまえが忘れたふりをしてきたものを。',
      ],
      effects: {
        flags: ['past_begin'],
        questAdd: ['q_past'],
        teleport: PAST_ENTRY,
        minutes: 90,
      },
    },
    dlg_school: {
      id: 'dlg_school',
      speaker: 'spirit1',
      lines: [
        '（教室に、ひとりだけ残された小さな男の子が本を読んでいる。みなが家へ帰ったクリスマスに）',
        '見覚えがあるか。友だちに置いていかれた子どもだ。本だけが友だった。',
        '（……あれは、わたしだ。あの寒い教室の匂いまで、思い出せる）',
      ],
      effects: { counters: { past_scenes: 1 }, minutes: 30, params: { remorse: 6, warmth: 2 }, learning: ['l_school'] },
    },
    dlg_fezziwig: {
      id: 'dlg_fezziwig',
      speaker: 'fezziwig',
      lines: [
        'さあさあ、仕事じまい！　イヴだぞ！　鎧戸を下ろして、床を空けろ！',
        '（倉庫が一瞬で舞踏会になる。若き日のわたしが、笑いながら踊っている）',
        '（フェジウィッグ親方が使った金は、ほんの数ポンド。それで貰った幸せは、金貨で量れなかった）',
      ],
      effects: { counters: { past_scenes: 1 }, minutes: 30, params: { warmth: 8, remorse: 2 }, learning: ['l_fezziwig'] },
    },
    dlg_belle: {
      id: 'dlg_belle',
      speaker: 'belle',
      lines: [
        'あなたの心には、わたしより大切な偶像が座っています。——金の偶像が。',
        '貧しさをあなたは恐れすぎた。そしていつのまにか、儲けることだけが夢になった。',
        'だから、指輪をお返しします。あなたが選んだ暮らしの中で、どうか幸せに。',
        '（若き日のわたしは、引き止めなかった。ただの一言も）',
      ],
      effects: { counters: { past_scenes: 1 }, minutes: 30, params: { remorse: 12 }, learning: ['l_belle'] },
    },
    dlg_spirit2: {
      id: 'dlg_spirit2',
      speaker: 'spirit2',
      lines: [
        '（寝室が消え、緑の衣の巨人が松明を掲げて立っている。足元にごちそうの山）',
        'わたしは現在のクリスマスの精霊。わたしの兄弟は千八百人を超える。',
        'わたしの衣に触れよ。今夜、この街で灯っている火を見せよう。おまえが「くだらん」と呼んだ火を。',
      ],
      effects: {
        flags: ['present_begin'],
        questAdd: ['q_present'],
        teleport: VISION_SQ,
        minutes: 60,
      },
    },
    dlg_cratchitwin: {
      id: 'dlg_cratchitwin',
      speaker: 'spirit2',
      lines: [
        '（窓の中——小さな鵞鳥を七人で分け、それでも歓声が上がる。ボブの肩に、松葉杖の男の子）',
        'ティムは言ったそうだ。「教会でみんなに見てほしかった。足の悪い僕を見て、歩けない人を歩かせた方のことを、クリスマスに思い出してくれるように」と。',
        '……精霊よ、ティムは、生きられるのか。',
        '「未来が変わらなければ、暖炉の隅に、持ち主のいない松葉杖が残るだろう」',
      ],
      effects: { counters: { present_scenes: 1 }, minutes: 30, params: { warmth: 8, remorse: 8 }, learning: ['l_tim_crutch'] },
    },
    dlg_fredwin: {
      id: 'dlg_fredwin',
      speaker: 'spirit2',
      lines: [
        '（窓の中——甥のフレッドの家。ゲームと笑い声。話題は、晩餐を断った伯父のこと）',
        '「伯父さんの不機嫌で損をするのは、いつも伯父さん自身なんだ。僕は毎年誘うよ。あきらめない」',
        '（笑われている。なのに——なぜだろう、その笑い声が、あたたかい）',
      ],
      effects: { counters: { present_scenes: 1 }, minutes: 30, params: { warmth: 6, remorse: 4 }, learning: ['l_fred_game'] },
    },
    dlg_iw: {
      id: 'dlg_iw',
      speaker: 'spirit2',
      lines: [
        '（精霊の衣の裾から、痩せこけた二人の子どもが現れる。狼のような目をした）',
        'この子は無知。この子は欠乏。人の子らだ。とりわけこの「無知」を恐れよ。額に「破滅」と書いてある。',
        '……精霊よ、この子たちには、身を寄せる場所がないのか。',
        '「——監獄はあるだろう？　救貧院は？」',
        '（自分の言葉が、そっくりそのまま、胸に突き立った）',
      ],
      effects: { counters: { present_scenes: 1 }, minutes: 30, params: { remorse: 14 }, learning: ['l_ignorance_want'] },
    },
    dlg_spirit3: {
      id: 'dlg_spirit3',
      speaker: 'spirit3',
      lines: [
        '（十二時の鐘。黒衣の精霊が、霧のように立っている。顔は見えない）',
        '（……あなたは、まだ来ていないクリスマスの精霊ですね）',
        '（精霊は答えない。ただ、行く手を指さした）',
        '（どの精霊よりも、この沈黙が恐ろしい。それでも——ついて行かねばならない）',
      ],
      effects: {
        flags: ['future_begin'],
        questAdd: ['q_future'],
        teleport: FUT_ENTRY,
        minutes: 90,
      },
    },
    dlg_exchange: {
      id: 'dlg_exchange',
      speaker: 'voice',
      lines: [
        '（取引所の柱の陰で、商人たちが立ち話をしている）',
        '「で、あの男、ゆうべ死んだそうだ」「葬式には出るのか？」「昼飯が出るならな」',
        '（笑い声。だれの話をしている？　こんなに——安く扱われる死は、だれの死だ？）',
      ],
      effects: { counters: { future_scenes: 1 }, minutes: 30, params: { remorse: 8 } },
    },
    dlg_ragshop: {
      id: 'dlg_ragshop',
      speaker: 'voice',
      lines: [
        '（古着屋の奥で、女たちが包みを広げている。カーテン、毛布、寝間着——）',
        '「死んだ男の部屋から外してきたのさ。どうせ本人はもう要らないんだ」',
        '「生きてるうちに人を寄せつけなかった報いだね。死んだら、こうして皆が寄ってくる」',
        '（ベッドから剝がされたカーテン。それがどの部屋のものか、考えるのが恐ろしい）',
      ],
      effects: { counters: { future_scenes: 1 }, minutes: 30, params: { remorse: 10 }, learning: ['l_ragshop'] },
    },
    dlg_dimtable: {
      id: 'dlg_dimtable',
      speaker: 'voice',
      lines: [
        '（クラチット家。火が小さい。だれも大きな声を出さない）',
        '「今日、墓地を見てきたよ。緑の丘で……日曜に歩くには、いい場所だ」',
        '（ボブの声が、途中で崩れた。暖炉の隅に、小さな松葉杖が立てかけられている。持ち主のいない松葉杖が）',
      ],
      effects: { counters: { future_scenes: 1 }, minutes: 30, params: { remorse: 12, warmth: 2 } },
    },
    dlg_grave: {
      id: 'dlg_grave',
      speaker: 'voice',
      lines: [
        '（教会の墓地。手入れをする者のない、雑草に埋もれた墓。精霊が、その一基を指さす）',
        '（——名を読む前に、聞かせてください。これは「必ず来る」影ですか。それとも「来るかもしれない」影ですか）',
        '（精霊は答えない。指は動かない。墓石の名は……エベニーザ・スクルージ）',
        '（違う。わたしはもう、あの男ではない。過去と現在と未来を、この心のうちに生きます。三人の精霊の教えを消しません。だから——！）',
      ],
      effects: { counters: { future_scenes: 1 }, minutes: 30, params: { remorse: 15, warmth: 4 }, learning: ['l_grave'] },
    },

    // ── クリスマスの朝の行い ──
    dlg_turkey: {
      id: 'dlg_turkey',
      speaker: 'poulterer',
      lines: [
        'へい、らっしゃい！　……えっ、店先のいちばんデカい七面鳥を？　あの賞品ものを？',
        'カムデン・タウンまで届けろって？　旦那、あれは子どもくらいの重さがありますぜ。',
        '（届け先はクラチット家。差出人は無記名で。——笑いが止まらない。金を使って、こんなに愉快なのは初めてだ）',
      ],
      effects: {
        counters: { good_deeds: 1 },
        minutes: 30,
        params: { coins: -8, warmth: 10, remorse: -6 },
        flags: ['turkey_sent'],
        learning: ['l_turkey'],
      },
    },
    dlg_deed_charity: {
      id: 'dlg_deed_charity',
      speaker: 'charity',
      lines: [
        'おや、あなたは昨日の……ス、スクルージ様？',
        '（耳打ちする。滞納ぶんも上乗せした額を。紳士は帳面を二度見た）',
        'そ、それはまた……ご冗談でしょう？　——本気ですと！？　神のお恵みを！　メリー・クリスマス！',
      ],
      effects: {
        counters: { good_deeds: 1 },
        minutes: 20,
        params: { coins: -15, warmth: 8, remorse: -8 },
      },
    },
    dlg_deed_fred: {
      id: 'dlg_deed_fred',
      speaker: 'fred',
      lines: [
        '（扉を叩く勇気が出るまで、戸口を三往復した）……フレッド。わたしだ。伯父だ。晩餐に、来てしまった。入れてくれるか。',
        '入れてくれるかって！？　もちろんです！　腕がちぎれるほど握手させてください！',
        '（あたたかい部屋。ゲーム。笑い声。——五分でなじんだ。何十年も、この扉の前を素通りしてきたのに）',
      ],
      effects: {
        counters: { good_deeds: 1 },
        minutes: 120,
        params: { warmth: 10, remorse: -6 },
        flags: ['fred_visited'],
      },
    },
    dlg_deed_bob: {
      id: 'dlg_deed_bob',
      speaker: 'bob',
      lines: [
        '（翌朝。ボブが十八分半遅刻して、走り込んでくる）も、申し訳ありません！　年に一度のことで……！',
        '「そういう勝手は、もう我慢ならん。——だからな、ボブ・クラチット君」',
        '「給料を上げる！　メリー・クリスマス！　石炭をどっさり買って、火を大きくしたまえ。午後はいちばん熱い一杯を挟んで、君の家族の相談をしよう」',
        '（ボブは一瞬、定規で殴られるより驚いた顔をした。それから——泣き笑いになった）',
      ],
      effects: {
        counters: { good_deeds: 1 },
        minutes: 60,
        params: { coins: -5, warmth: 12, remorse: -8 },
        flags: ['bob_raised'],
        learning: ['l_victorian_poor'],
      },
    },

    // ── 町の人との言葉 ──
    dlg_lamplighter: {
      id: 'dlg_lamplighter',
      speaker: 'lamplighter',
      lines: [
        '今晩は。ガス灯を一本ずつ点けてまわるのが、あっしの仕事でさ。',
        '昔は油のランプでね、もっと暗かった。ガスが来てから、ロンドンの夜はずいぶん明るくなりましたよ。',
        'それでも霧の濃い晩は、この灯りも滲んじまう。……ま、滲んだ灯りってのも、悪かないでしょう。',
      ],
      effects: { counters: { chats: 1 }, minutes: 20, params: { warmth: 2 }, learning: ['l_gaslamp'] },
    },
    dlg_chestnut: {
      id: 'dlg_chestnut',
      speaker: 'chestnutman',
      lines: [
        '焼き栗だよ、熱いよ！　……旦那が買うなんて珍しい日もあるもんだ。',
        '寒い晩はね、こいつをポケットに入れとくだけで手が生き返る。腹より先に、手があったまるんですよ。',
      ],
      effects: { counters: { chats: 1 }, minutes: 20, params: { warmth: 2 }, learning: ['l_market'] },
    },
    dlg_poulterer_chat: {
      id: 'dlg_poulterer_chat',
      speaker: 'poulterer',
      lines: [
        'イヴはうちの書き入れ時でね。鵞鳥がいちばん出る。七面鳥は上等すぎて、庶民にはなかなか。',
        '貧しい家は焼き竈がないから、パン屋の竈を借りて鳥を焼くんです。教会帰りに、皿を抱えた行列ができるんですよ。',
      ],
      effects: { counters: { chats: 1 }, minutes: 20, params: { warmth: 2 }, learning: ['l_goose'] },
    },
    dlg_carolboy_chat: {
      id: 'dlg_carolboy_chat',
      speaker: 'carolboy',
      lines: [
        '（少年がおずおずと歌い出す——「神が陽気な紳士がたを憩わせたまいますように」）',
        '……去年、この戸口で歌ったら、定規を持って追いかけられたんだ。今年は、逃げなくていい？',
        '（最後まで歌わせて、小銭を握らせた。少年は目を丸くして、二番まで歌った）',
      ],
      effects: { counters: { chats: 1 }, minutes: 20, params: { warmth: 3, coins: -1 }, learning: ['l_carol_songs'] },
    },
  },

  quests: {
    q_eve: {
      id: 'q_eve',
      title: 'クリスマス・イヴの店じまい',
      description: '事務所を訪れる者たちをあしらえ。書記の石炭、甥の招待、慈善の紳士——三つの応対を済ませて店を閉める。',
      goal: { type: 'counter', counter: 'eve_scenes', count: 3 },
      waypoint: OFFICE_DOOR,
    },
    q_marley: {
      id: 'q_marley',
      title: '真鍮のノッカー',
      description: '家に帰る。玄関のノッカーが——何かおかしい。',
      goal: { type: 'flag', flag: 'marley' },
      waypoint: KNOCKER,
    },
    q_sleep1: {
      id: 'q_sleep1',
      title: '一時の鐘',
      description: 'ベッドにもぐり、最初の精霊を待つ。マーレイは言った——「一時の鐘が鳴るとき」と。',
      goal: { type: 'flag', flag: 'past_begin' },
      waypoint: BED,
    },
    q_past: {
      id: 'q_past',
      title: '第一の精霊——過去',
      description: '過去の精霊とともに、忘れたふりをしてきた三つの場面を見る。教室・倉庫・冬枯れの木。',
      goal: { type: 'counter', counter: 'past_scenes', count: 3 },
      waypoint: PAST_C,
    },
    q_sleep2: {
      id: 'q_sleep2',
      title: '二時の鐘',
      description: 'ベッドに戻り、第二の精霊を待つ。隣の部屋から、覚えのない光が漏れている。',
      goal: { type: 'flag', flag: 'present_begin' },
      waypoint: BED,
    },
    q_present: {
      id: 'q_present',
      title: '第二の精霊——現在',
      description: '現在の精霊とともに、今夜この街で灯る三つの火を見る。クラチット家の窓・フレッドの窓・そして精霊の裾に隠れたもの。',
      goal: { type: 'counter', counter: 'present_scenes', count: 3 },
      waypoint: CRATCHIT_WIN,
    },
    q_sleep3: {
      id: 'q_sleep3',
      title: '十二時の鐘',
      description: 'ベッドに戻る。最後の精霊は、黒衣で来るという。',
      goal: { type: 'flag', flag: 'future_begin' },
      waypoint: BED,
    },
    q_future: {
      id: 'q_future',
      title: '第三の精霊——未来',
      description: '無言の精霊が指さす四つの影を見届ける。取引所・古着屋・火の消えた食卓・そして墓。',
      goal: { type: 'counter', counter: 'future_scenes', count: 4 },
      waypoint: FUT_C,
    },
    q_redemption: {
      id: 'q_redemption',
      title: 'クリスマスの朝',
      description: '生きて朝に帰ってきた。凍った心を溶かす行いを五つ——七面鳥・寄付・教会・フレッドの家・そしてボブの給料。',
      goal: { type: 'counter', counter: 'good_deeds', count: 5 },
      waypoint: [13, 7.6],
    },
    sq_snowfolk: {
      id: 'sq_snowfolk',
      title: '雪の街の声',
      description: '街に生きる四人と言葉を交わす。点灯夫・焼き栗売り・鶏肉屋・聖歌の子。',
      goal: { type: 'counter', counter: 'chats', count: 4 },
      waypoint: SQUARE,
      side: true,
    },
    sq_quotes: {
      id: 'sq_quotes',
      title: '物語の言葉あつめ',
      description: '雪あかりにきらめく紙片が七枚、街と夢に散らばっている。『クリスマス・キャロル』の言葉の欠片だ。',
      goal: { type: 'counter', counter: 'cquotes', count: 7 },
      waypoint: [10, -13.5],
      side: true,
    },
    sq_walk: {
      id: 'sq_walk',
      title: 'ロンドン歩き',
      description: '雪のロンドンと夢の街区の名所をめぐる。手帳の地図が埋まってゆく。',
      goal: { type: 'counter', counter: 'landmarks_found', count: 10 },
      side: true,
    },
  },

  events: [
    {
      id: 'ev_open',
      trigger: { type: 'gameStart' },
      steps: [
        {
          type: 'narration',
          lines: [
            'まず、これだけは言っておかねばならない。マーレイは死んでいた。',
            '七年前の今夜に死んだ、わたしの共同経営者。書類に署名したのは、ほかならぬこのわたし——エベニーザ・スクルージだ。',
            '一八四三年、十二月二十四日。ロンドンは凍てつき、霧とすすが街を包む。',
            'わたしは締め切った事務所で、いつものように帳簿をつけている。クリスマス？　ふん、くだらん。',
            '……それが、この夜の始まりだった。わたしの凍った心が溶かされる、長い長い夜の。',
          ],
        },
        {
          type: 'effects',
          effects: {
            questAdd: ['q_eve', 'sq_snowfolk', 'sq_quotes', 'sq_walk'],
            learning: ['l_dickens'],
          },
        },
      ],
    },
    {
      id: 'ev_home',
      trigger: { type: 'questComplete', quest: 'q_eve' },
      steps: [
        {
          type: 'narration',
          lines: [
            '店じまい。ボブは襟巻き一枚で、坂道を滑って帰っていった。明日は休みだ——「まる一日給料泥棒め」と釘は刺したが。',
            '霧の街を、わたしはひとり家路につく。マーレイの遺した、陰気な部屋の並ぶ屋敷へ。',
            '（南西の路地の奥。ガス灯もまばらな中庭に、わたしの家がある）',
          ],
        },
        { type: 'effects', effects: { flags: ['eve_done'], questAdd: ['q_marley'], minutes: 30 } },
      ],
    },
    {
      id: 'ev_bed1',
      trigger: { type: 'flag', flag: 'marley' },
      steps: [
        {
          type: 'narration',
          lines: [
            '亡霊は窓から夜へ出ていった。外には、鎖を引きずる亡霊たちの群れ——生きているうちに手を差し伸べなかった者たちが、いまさら差し伸べようとして、届かずに嘆いていた。',
            '「くだらん」と言いかけて、やめた。……ベッドへ行こう。一時の鐘が、鳴るのなら。',
          ],
        },
        { type: 'effects', effects: { questAdd: ['q_sleep1'], minutes: 30 } },
      ],
    },
    {
      id: 'ev_past_end',
      trigger: { type: 'questComplete', quest: 'q_past' },
      steps: [
        {
          type: 'narration',
          lines: [
            '「精霊よ、もう連れて帰ってくれ。これ以上は耐えられない」',
            'わたしは精霊の頭の光に、消し帽子を押しかぶせた。それでも光は、帽子の下から溢れつづけた。',
            '——気がつくと、自分の寝室だった。過去は消えない。消せない光として、胸の中で灯っている。',
          ],
        },
        {
          type: 'effects',
          effects: { flags: ['past_done'], questAdd: ['q_sleep2'], teleport: BED, minutes: 60 },
        },
      ],
    },
    {
      id: 'ev_present_end',
      trigger: { type: 'questComplete', quest: 'q_present' },
      steps: [
        {
          type: 'narration',
          lines: [
            '鐘が鳴る。精霊の髪は白くなり、笑い声は遠ざかる。「わたしの命は、この地上ではひと晩きりなのだ」',
            '祝いの火は、街のあちこちで灯っていた。貧しい家ほど、明るく。',
            '……そして最後に見た、あの二人の子どもの目が、離れない。',
          ],
        },
        {
          type: 'effects',
          effects: { flags: ['present_done'], questAdd: ['q_sleep3'], teleport: BED, minutes: 60 },
        },
      ],
    },
    {
      id: 'ev_dawn',
      trigger: { type: 'questComplete', quest: 'q_future' },
      steps: [
        // どれだけ夜が長引いても、目覚めは必ず「朝」——精霊はひと晩でやってくれる。
        { type: 'skipDays', days: 0 },
        {
          type: 'narration',
          lines: [
            '——ベッドの柱だ。握りしめていたのは、墓石ではなく、自分のベッドの柱だった。',
            '生きている。時間はある。やり直せる！',
            '窓を開けると、霧のない、澄んだ金色の朝。教会の鐘がいっせいに鳴っている。通りの少年に叫んで訊いた——「today！　今日は何の日だ！」「クリスマスですよ、旦那！」',
            '精霊たちは、ひと晩でやってくれたのだ。笑いながら涙が出る。さあ——やることが山ほどある！',
          ],
        },
        {
          type: 'effects',
          effects: {
            flags: ['christmas_morning'],
            questAdd: ['q_redemption'],
            teleport: [-12.4, -23],
            params: { warmth: 20, remorse: -10 },
            learning: ['l_christmas_revival'],
          },
        },
      ],
    },
    {
      id: 'ev_end',
      trigger: { type: 'questComplete', quest: 'q_redemption' },
      steps: [
        {
          type: 'narration',
          lines: [
            'スクルージは、言葉のとおりの男になった。いや、それ以上の男に。',
            'タイニー・ティムは死ななかった。スクルージはティムの第二の父になった。',
            '古い街の善き人として、笑われることもあったが、本人が誰より愉快に笑ったので、それで勘定は合った。',
            'そして人々は言ったものだ——クリスマスの祝い方を知る者があるとすれば、それはあの人だ、と。',
            'われわれ皆が、そう言われますように。タイニー・ティムの言葉を借りるなら——',
            '「神さまの祝福が、みんなの上にありますように！」',
          ],
        },
        { type: 'effects', effects: { flags: ['ending'], params: { warmth: 15 }, learning: ['l_tiny_tim'] } },
      ],
    },
    {
      id: 'ev_snowfolk',
      trigger: { type: 'questComplete', quest: 'sq_snowfolk' },
      steps: [
        {
          type: 'narration',
          lines: [
            '点灯夫、焼き栗売り、鶏肉屋、聖歌の子。この街に、こんなにたくさんの声があったとは。',
            '毎日同じ道を通っていて、一度も聞こうとしなかっただけだった。',
          ],
        },
        { type: 'effects', effects: { params: { warmth: 6 } } },
      ],
    },
    {
      id: 'ev_quotes',
      trigger: { type: 'questComplete', quest: 'sq_quotes' },
      steps: [
        {
          type: 'narration',
          lines: [
            '七枚の紙片が、手帳の中でひとつの物語になった。',
            '「わたしはクリスマスを心に保とう。そして一年じゅう、保ちつづけよう」',
            '言葉は雪と同じだ。ひとひらは小さい。積もれば、街の形を変える。',
          ],
        },
        { type: 'effects', effects: { params: { warmth: 5, remorse: -5 }, learning: ['l_scrooge_name'] } },
      ],
    },
    {
      id: 'ev_walkdone',
      trigger: { type: 'questComplete', quest: 'sq_walk' },
      steps: [
        {
          type: 'narration',
          lines: [
            '手帳の地図が埋まった。事務所と家との往復だけだった男が、いまや過去と未来の街区まで歩いた。',
            '道を知ることは、人を知ることに、少し似ている。',
          ],
        },
        { type: 'effects', effects: { params: { warmth: 5 } } },
      ],
    },
  ],

  learnings: {
    l_dickens: {
      id: 'l_dickens',
      title: 'ディケンズと『クリスマス・キャロル』',
      body: 'チャールズ・ディケンズ（1812-1870）が1843年のクリスマスに刊行した中編。児童労働の実態に憤った作者が、パンフレットの代わりに「物語の力」で世に訴えた一冊で、初版6千部は五日で売り切れた。以来、クリスマスのたびに読み継がれ、「クリスマス・ものがたり」という文化そのものを作った。',
      tags: ['作者', '背景'],
    },
    l_marley: {
      id: 'l_marley',
      title: 'マーレイの鎖',
      body: '亡霊マーレイの鎖は、帳簿・金庫・証文でできている。「生きているあいだに、一環また一環、自分で鍛えた」——罰は死後に与えられるのではなく、生き方そのものが鎖になる、という寓話だ。マーレイはスクルージに残された「最後の望み」として警告に来る。',
      tags: ['人物', '寓意'],
    },
    l_workhouse: {
      id: 'l_workhouse',
      title: '救貧院と「監獄はあるだろう」',
      body: 'ヴィクトリア朝の救貧法は、貧しい人々を救貧院（ワークハウス）に収容した。家族は引き離され、食事は乏しく、人々は入るくらいなら死を選ぶとさえ言った。スクルージの「監獄はあるだろう、救貧院は」は当時の冷たい世論そのもので、ディケンズはこの台詞を後で本人に突き返してみせる。',
      tags: ['歴史', '社会'],
    },
    l_gaslamp: {
      id: 'l_gaslamp',
      title: 'ガス灯のロンドン',
      body: '1810年代からロンドンの街路にはガス灯が並び、点灯夫が夕方ひとつずつ火を入れてまわった。石炭の煤と霧が混ざった「ロンドン霧」の夜、ガス灯はにじんだ光の玉になる。ディケンズの小説の陰影は、この霧と灯りの街から生まれた。',
      tags: ['歴史', '暮らし'],
    },
    l_goose: {
      id: 'l_goose',
      title: 'ガチョウか、七面鳥か',
      body: '当時の庶民のクリスマスのごちそうは鵞鳥（ガチョウ）だった。七面鳥は高級品。貧しい家には焼き竈がないため、パン屋の竈を借りて鳥を焼く習慣があり、教会帰りに皿を抱えて竈へ向かう行列ができた。クラチット家の鵞鳥も、そうして焼かれている。',
      tags: ['暮らし', '食'],
    },
    l_market: {
      id: 'l_market',
      title: 'クリスマスの市場',
      body: 'イヴの市場は一年でいちばん華やぐ。栗・りんご・オレンジが山を作り、ヒイラギの枝が店先を飾る。焼き栗売りの火鉢は寒い街角の小さな暖炉で、通行人は栗より先に手を温めた。ディケンズは市場の描写に何ページも費やすほど、この賑わいを愛した。',
      tags: ['暮らし', '食'],
    },
    l_carol_songs: {
      id: 'l_carol_songs',
      title: 'キャロル——戸口の聖歌',
      body: 'クリスマス・キャロルは戸口や街角で歌われる祝いの歌。子どもたちは家々を回って歌い、小銭や菓子をもらった。表題の「キャロル」はこの歌のことで、物語自体を「散文で書かれた一篇のキャロル」に見立てている。作中でスクルージは、歌いに来た子を定規で追い払う。',
      tags: ['文化', '音楽'],
    },
    l_school: {
      id: 'l_school',
      title: '教室にひとり残された子',
      body: '幼いスクルージは、クリスマスにも家に帰してもらえず、寄宿学校の教室にひとり残されて本を読んでいた。ディケンズ自身、父が借金で投獄され、12歳で靴墨工場で働いた。「置き去りにされた子ども」は、彼の全作品を貫く原風景である。',
      tags: ['場面', '作者'],
    },
    l_fezziwig: {
      id: 'l_fezziwig',
      title: 'フェジウィッグの舞踏会',
      body: '若きスクルージの雇い主フェジウィッグは、イヴになると倉庫を片づけて舞踏会をひらいた。使った金はほんの数ポンド。それでも雇い人たちの幸せは金貨で量れない——「雇い主の力は、重くも軽くもできる。その幸せは、財産ひとつ分に値する」と若きスクルージ自身が言う。',
      tags: ['場面', '寓意'],
    },
    l_belle: {
      id: 'l_belle',
      title: 'ベルの別れ',
      body: '婚約者ベルは若きスクルージに指輪を返す。「あなたの心には、わたしより大切な金の偶像が座っている」。貧しさへの恐れが、いつのまにか金銭への執着に変わった——その転落を、ディケンズはたった一場面の別れ話で描き切った。',
      tags: ['場面', '人物'],
    },
    l_tim_crutch: {
      id: 'l_tim_crutch',
      title: 'タイニー・ティム',
      body: 'ボブの末息子ティムは足が悪く、小さな松葉杖と鉄の添え木で歩く。それでも教会で「歩けない人を歩かせた方を思い出してもらえたら」と笑う。現在の精霊は言う——「未来が変わらなければ、暖炉の隅に持ち主のいない松葉杖が残る」。ティムの生死は、スクルージの変化にかかっている。',
      tags: ['人物', '場面'],
    },
    l_fred_game: {
      id: 'l_fred_game',
      title: 'フレッドの晩餐会',
      body: '甥フレッドの家では、音楽と「はい・いいえ遊び」で笑いが絶えない。話題が「伯父さん」になっても、フレッドは笑って言う——「損をするのは、いつも伯父さん自身。僕は毎年誘うよ」。見えないところで自分を想ってくれる人がいる、ということをスクルージは初めて知る。',
      tags: ['場面', '人物'],
    },
    l_ignorance_want: {
      id: 'l_ignorance_want',
      title: '無知と欠乏',
      body: '現在の精霊の衣の裾には、痩せこけた二人の子ども——「無知」と「欠乏」が隠れている。「とりわけ無知を恐れよ。額に破滅と書いてある」。貧困そのものより、貧困から目をそらす社会の無知こそが破滅を招く——ディケンズがこの本に込めた、いちばん鋭い一撃である。',
      tags: ['寓意', '社会'],
    },
    l_ragshop: {
      id: 'l_ragshop',
      title: '古着屋と死者の持ち物',
      body: '未来の場面で、女たちは死んだ男の部屋からカーテンや寝間着まで剝がして古着屋に売る。「生きてるうちに人を寄せつけなかった報いさ」。ぼろ布市場は当時のロンドンに実在し、貧しい人々の生計だった。死の値打ちは、生き方が決める。',
      tags: ['場面', '社会'],
    },
    l_grave: {
      id: 'l_grave',
      title: '名前のない墓',
      body: '未来の精霊が最後に指さすのは、手入れする者のない墓。スクルージは名を読む前に問う——「これは必ず来る影か、来るかもしれない影か」。精霊は答えない。未来は宣告ではなく問いである。だからこの物語は、墓場から朝へ折り返すことができる。',
      tags: ['場面', '寓意'],
    },
    l_christmas_revival: {
      id: 'l_christmas_revival',
      title: 'ヴィクトリア朝のクリスマス',
      body: '19世紀半ば、クリスマスは「復興」の時代を迎えた。アルバート公が広めたツリー、最初のクリスマス・カード（1843年！）、そしてこの『キャロル』。家族で祝い、貧しい人に施す——今日のクリスマス像は、まさにこの時代のロンドンで形づくられた。',
      tags: ['歴史', '文化'],
    },
    l_turkey: {
      id: 'l_turkey',
      title: '賞品の七面鳥',
      body: '生まれ変わったスクルージが最初にしたのは、店先いちばんの七面鳥を匿名でクラチット家に送ること。「子どもくらいの重さ」の高級品で、鵞鳥しか買えない家には夢のごちそうだ。金の使い方が変わった瞬間、金貨は初めて人を温める道具になった。',
      tags: ['場面', '食'],
    },
    l_victorian_poor: {
      id: 'l_victorian_poor',
      title: '週十五シリングのボブ',
      body: '書記ボブ・クラチットの給料は週十五シリング。当時の下級事務員の実勢そのままで、七人家族には到底足りない。スクルージの昇給はただの温情ではなく、「雇い主の力は人を重くも軽くもできる」というフェジウィッグの教えへの、四十年越しの返事である。',
      tags: ['社会', '人物'],
    },
    l_tiny_tim: {
      id: 'l_tiny_tim',
      title: '「神さまの祝福が、みんなの上に」',
      body: '物語を結ぶのはティムの祈り——God bless us, every one!　「みんなの上に」の一語に、この本のすべてがある。祝福は自分の家族だけでなく、定規で追われた聖歌の子にも、救貧院の子にも。スクルージは以後、クリスマスの祝い方を誰より知る男と呼ばれた。',
      tags: ['名台詞', '結び'],
    },
    l_scrooge_name: {
      id: 'l_scrooge_name',
      title: '「スクルージ」という言葉',
      body: 'この物語があまりに読まれたため、英語では Scrooge が「けち・人間嫌い」を指す普通名詞になった。だが原作のスクルージは変わることができた男でもある。名前が辞書に残したのは冷たさだが、物語が人々の心に残したのは「人は変われる」という約束の方だった。',
      tags: ['言葉', '文化'],
    },
    // ── 言葉の欠片 ──
    l_cq1: {
      id: 'l_cq1',
      title: '欠片①「まず、マーレイは死んでいた」',
      body: '物語の書き出し。幽霊譚を始めるのに、作者はまず相棒の死を「疑いようがない」と念押しする。死んだはずの男が現れるからこそ、この夜は特別になる——世界文学でも指折りの、有名な第一行である。',
      tags: ['名台詞', '欠片'],
    },
    l_cq2: {
      id: 'l_cq2',
      title: '欠片②「ふん、くだらん！」',
      body: 'スクルージの口癖 Bah! Humbug! の翻案。クリスマスも、善意も、笑いも、みんな「くだらん」。だがこの言葉は、傷つかないための鎧でもあった。物語の終わり、彼はこの口癖を二度と使わない。',
      tags: ['名台詞', '欠片'],
    },
    l_cq3: {
      id: 'l_cq3',
      title: '欠片③「一年でただ一度の季節」',
      body: 'フレッドのクリスマス論の翻案。「儲かったことは一度もない。それでも、人々が閉じた心をひらき合う、一年でただ一度の季節だ。だから言う——クリスマスに祝福を！」。教会の鐘のそばに落ちていたのが、この言葉なのは偶然だろうか。',
      tags: ['名台詞', '欠片'],
    },
    l_cq4: {
      id: 'l_cq4',
      title: '欠片④「神さまの祝福が、みんなの上に」',
      body: 'タイニー・ティムの祈り。クラチット家の路地に落ちていた。God bless us, every one! ——「every one」を「みんな」と訳すか「ひとり残らず」と訳すか、訳者は今も迷いつづけている。',
      tags: ['名台詞', '欠片'],
    },
    l_cq5: {
      id: 'l_cq5',
      title: '欠片⑤「人類こそ、わたしの商売であるべきだった」',
      body: 'マーレイの亡霊の悔恨。「商売のことばかり考えて」と言うスクルージへ——「人類こそ、わたしの商売（ビジネス）であるべきだった。皆の幸せが、慈悲が、寛容が」。市場のざわめきの中に、この紙片は落ちていた。',
      tags: ['名台詞', '欠片'],
    },
    l_cq6: {
      id: 'l_cq6',
      title: '欠片⑥「鎖は、生きているあいだに鍛えられる」',
      body: '過去の街区、冬枯れの木の下にあった言葉。鎖は死後に課される罰ではなく、日々の選択が一環ずつ継ぎ足してゆくもの。若き日の分かれ道のそばに落ちていたのは、そういう意味だろう。',
      tags: ['名台詞', '欠片'],
    },
    l_cq7: {
      id: 'l_cq7',
      title: '欠片⑦「救いがないのなら、なぜ見せるのです」',
      body: '名前のない墓の前で、スクルージが黒衣の精霊に投げた問い。もし未来が変えられないなら、見せる意味がない。ゆえに——見せられたということは、変えられるということだ。絶望の底で論理が希望に反転する、物語の急所である。',
      tags: ['名台詞', '欠片'],
    },
  },

  interactables: [
    // ── イヴの応対（q_eve） ──
    {
      id: 'desk_coal',
      position: OFFICE_DOOR,
      prompt: '事務所に入り、帳簿を締める（ボブが何か言いたげだ）',
      radius: 2.8,
      once: true,
      effects: { dialogue: 'dlg_coal' },
    },
    {
      id: 'visitor_fred',
      position: [12, -16],
      prompt: '甥のフレッドの挨拶を受ける',
      radius: 2.6,
      once: true,
      effects: { dialogue: 'dlg_fredvisit' },
    },
    {
      id: 'visitor_charity',
      position: [16, -16.5],
      prompt: '慈善の紳士の話を聞く',
      radius: 2.6,
      once: true,
      effects: { dialogue: 'dlg_charity' },
    },

    // ── 帰宅、ノッカー、三度の眠り ──
    {
      id: 'knocker',
      position: KNOCKER,
      prompt: '玄関のノッカーに手を伸ばす',
      radius: 2.8,
      requiresFlag: 'eve_done',
      once: true,
      effects: { dialogue: 'dlg_marley_1' },
    },
    {
      id: 'bed1',
      position: BED,
      prompt: 'ベッドにもぐり、一時の鐘を待つ',
      radius: 2.8,
      requiresFlag: 'marley',
      once: true,
      effects: { dialogue: 'dlg_spirit1' },
    },
    {
      id: 'bed2',
      position: BED,
      prompt: 'ベッドに戻り、二時の鐘を待つ',
      radius: 2.8,
      requiresFlag: 'past_done',
      once: true,
      effects: { dialogue: 'dlg_spirit2' },
    },
    {
      id: 'bed3',
      position: BED,
      prompt: 'ベッドに戻る。最後の精霊が来る',
      radius: 2.8,
      requiresFlag: 'present_done',
      once: true,
      effects: { dialogue: 'dlg_spirit3' },
    },

    // ── 過去の三場面（q_past） ──
    {
      id: 'past_school',
      position: SCHOOL_SPOT,
      prompt: '教室の窓をのぞく——ひとり残された子がいる',
      radius: 3,
      requiresFlag: 'past_begin',
      once: true,
      effects: { dialogue: 'dlg_school' },
    },
    {
      id: 'past_fezziwig',
      position: FEZZIWIG_SPOT,
      prompt: '倉庫の舞踏会をのぞく',
      radius: 3,
      requiresFlag: 'past_begin',
      once: true,
      effects: { dialogue: 'dlg_fezziwig' },
    },
    {
      id: 'past_belle',
      position: BELLE_SPOT,
      prompt: '冬枯れの木の下の、ふたりの話を聞く',
      radius: 3,
      requiresFlag: 'past_begin',
      once: true,
      effects: { dialogue: 'dlg_belle' },
    },

    // ── 現在の三場面（q_present） ──
    {
      id: 'crat_window',
      position: CRATCHIT_WIN,
      prompt: 'クラチット家の窓をのぞく',
      radius: 3,
      requiresFlag: 'present_begin',
      once: true,
      effects: { dialogue: 'dlg_cratchitwin' },
    },
    {
      id: 'fred_window',
      position: FRED_WIN,
      prompt: 'フレッドの家の窓をのぞく',
      radius: 3,
      requiresFlag: 'present_begin',
      once: true,
      effects: { dialogue: 'dlg_fredwin' },
    },
    {
      id: 'ignorance_want',
      position: VISION_SQ,
      prompt: '精霊の衣の裾に、何かが隠れている',
      radius: 3,
      requiresFlag: 'present_begin',
      once: true,
      effects: { dialogue: 'dlg_iw' },
    },

    // ── 未来の四場面（q_future） ──
    {
      id: 'future_exchange',
      position: EXCHANGE_SPOT,
      prompt: '柱廊の商人たちの立ち話を聞く',
      radius: 3,
      requiresFlag: 'future_begin',
      once: true,
      effects: { dialogue: 'dlg_exchange' },
    },
    {
      id: 'future_ragshop',
      position: RAGSHOP_SPOT,
      prompt: '古着屋の店先をのぞく',
      radius: 3,
      requiresFlag: 'future_begin',
      once: true,
      effects: { dialogue: 'dlg_ragshop' },
    },
    {
      id: 'future_cratchit',
      position: DIM_SPOT,
      prompt: '火の消えた食卓を見る',
      radius: 3,
      requiresFlag: 'future_begin',
      once: true,
      effects: { dialogue: 'dlg_dimtable' },
    },
    {
      id: 'future_grave',
      position: GRAVE_SPOT,
      prompt: '精霊が指さす墓に、近づいて名を読む',
      radius: 3,
      requiresFlag: 'future_begin',
      once: true,
      effects: { dialogue: 'dlg_grave' },
    },

    // ── クリスマスの朝の五つの行い（q_redemption） ──
    {
      id: 'deed_turkey',
      position: [13, 7.6],
      prompt: '店先いちばんの七面鳥を買う——届け先はクラチット家',
      radius: 3,
      requiresFlag: 'christmas_morning',
      once: true,
      effects: { dialogue: 'dlg_turkey' },
    },
    {
      id: 'deed_charity',
      position: [6, -8],
      prompt: '昨日の慈善の紳士に追いつき、耳打ちする',
      radius: 3,
      requiresFlag: 'christmas_morning',
      once: true,
      effects: { dialogue: 'dlg_deed_charity' },
    },
    {
      id: 'deed_church',
      position: CHURCH_DOOR,
      prompt: '教会に入り、鐘と歌の中に座る',
      radius: 3,
      requiresFlag: 'christmas_morning',
      once: true,
      effects: {
        counters: { good_deeds: 1 },
        minutes: 60,
        params: { warmth: 6, remorse: -4 },
      },
    },
    {
      id: 'deed_fred',
      position: [25.5, 24.7],
      prompt: 'フレッドの家の扉を叩く——晩餐の約束を、今さら',
      radius: 3,
      requiresFlag: 'christmas_morning',
      once: true,
      effects: { dialogue: 'dlg_deed_fred' },
    },
    {
      id: 'deed_bob',
      position: [10.2, -19],
      prompt: '翌朝の事務所で、遅刻してくるボブを待ち構える',
      radius: 2.8,
      requiresFlag: 'christmas_morning',
      once: true,
      effects: { dialogue: 'dlg_deed_bob' },
    },

    // ── 心を温める営み（くり返せる） ──
    {
      id: 'act_chestnut',
      position: [8.5, 12.3],
      prompt: '焼き栗をひと袋買い、手を温める',
      radius: 2.8,
      cooldownHours: 6,
      effects: { params: { coins: -1, warmth: 3 }, minutes: 30 },
    },
    {
      id: 'act_hearth',
      position: HEARTH,
      prompt: '家の暖炉に、薪をひとつ足す',
      radius: 2.8,
      cooldownHours: 8,
      effects: { params: { warmth: 2 }, minutes: 45 },
    },
    {
      id: 'act_alms',
      position: [-24, 1],
      prompt: '教会わきの物乞いに、小銭を握らせる',
      radius: 2.8,
      cooldownHours: 8,
      effects: { params: { coins: -1, warmth: 3, remorse: -2 }, minutes: 20 },
    },

    // ── 雪の街の声（sq_snowfolk） ──
    {
      id: 'chat_lamplighter',
      position: FOLK_POS.lamplighter,
      prompt: '点灯夫に声をかける',
      radius: 3,
      once: true,
      effects: { dialogue: 'dlg_lamplighter' },
    },
    {
      id: 'chat_chestnut',
      position: FOLK_POS.chestnutman,
      prompt: '焼き栗売りと言葉を交わす',
      radius: 3,
      once: true,
      effects: { dialogue: 'dlg_chestnut' },
    },
    {
      id: 'chat_poulterer',
      position: FOLK_POS.poulterer,
      prompt: '鶏肉屋の店先をひやかす',
      radius: 3,
      once: true,
      effects: { dialogue: 'dlg_poulterer_chat' },
    },
    {
      id: 'chat_carolboy',
      position: FOLK_POS.carolboy,
      prompt: '聖歌の子の歌を、最後まで聞く',
      radius: 3,
      once: true,
      effects: { dialogue: 'dlg_carolboy_chat' },
    },

    // ── 言葉の欠片（sq_quotes）——七枚 ──
    {
      id: 'cq_paper1',
      position: [10, -13.5],
      prompt: '雪あかりに光る紙片を拾う',
      radius: 2.6,
      once: true,
      hideFlag: 'cq1',
      effects: { flags: ['cq1'], counters: { cquotes: 1 }, learning: ['l_cq1'], params: { warmth: 1 } },
    },
    {
      id: 'cq_paper2',
      position: [2.5, 3.5],
      prompt: '雪あかりに光る紙片を拾う',
      radius: 2.6,
      once: true,
      hideFlag: 'cq2',
      effects: { flags: ['cq2'], counters: { cquotes: 1 }, learning: ['l_cq2'], params: { warmth: 1 } },
    },
    {
      id: 'cq_paper3',
      position: [-24.4, 12.5],
      prompt: '雪あかりに光る紙片を拾う',
      radius: 2.6,
      once: true,
      hideFlag: 'cq3',
      effects: { flags: ['cq3'], counters: { cquotes: 1 }, learning: ['l_cq3'], params: { warmth: 1 } },
    },
    {
      id: 'cq_paper4',
      position: [-16, 26],
      prompt: '雪あかりに光る紙片を拾う',
      radius: 2.6,
      once: true,
      hideFlag: 'cq4',
      effects: { flags: ['cq4'], counters: { cquotes: 1 }, learning: ['l_cq4'], params: { warmth: 1 } },
    },
    {
      id: 'cq_paper5',
      position: [16.5, 11.8],
      prompt: '雪あかりに光る紙片を拾う',
      radius: 2.6,
      once: true,
      hideFlag: 'cq5',
      effects: { flags: ['cq5'], counters: { cquotes: 1 }, learning: ['l_cq5'], params: { warmth: 1 } },
    },
    {
      id: 'cq_paper6',
      position: [-122, 14.5],
      prompt: '雪あかりに光る紙片を拾う',
      radius: 2.6,
      once: true,
      hideFlag: 'cq6',
      effects: { flags: ['cq6'], counters: { cquotes: 1 }, learning: ['l_cq6'], params: { warmth: 1 } },
    },
    {
      id: 'cq_paper7',
      position: [126, 13.4],
      prompt: '雪あかりに光る紙片を拾う',
      radius: 2.6,
      once: true,
      hideFlag: 'cq7',
      effects: { flags: ['cq7'], counters: { cquotes: 1 }, learning: ['l_cq7'], params: { warmth: 1 } },
    },
  ],

  // 名所。見つけると手帳の地図に灯る（sq_walk: landmarks_found）。
  landmarks: [
    { id: 'lm_office', label: 'スクルージ＆マーレイ商会', position: OFFICE, radius: 6 },
    { id: 'lm_home', label: 'スクルージの住まい', position: HOME, radius: 6 },
    { id: 'lm_square', label: '広場のツリー', position: SQUARE, radius: 8 },
    { id: 'lm_church', label: '教会', position: CHURCH, radius: 7 },
    { id: 'lm_cratchit', label: 'クラチット家', position: CRATCHIT, radius: 6 },
    { id: 'lm_fred', label: 'フレッドの家', position: FRED, radius: 6 },
    { id: 'lm_market', label: 'イヴの市場', position: [13, 12], radius: 7 },
    { id: 'lm_gaslane', label: 'ガス灯の大通り', position: [0, -24], radius: 7 },
    { id: 'lm_school', label: '思い出の教室', position: SCHOOL, radius: 7 },
    { id: 'lm_fezziwig', label: 'フェジウィッグの倉庫', position: FEZZIWIG, radius: 7 },
    { id: 'lm_ragshop', label: '古着屋', position: RAGSHOP, radius: 7 },
    { id: 'lm_grave', label: '名前のない墓', position: GRAVE, radius: 6 },
  ],

  // 地図の描画範囲（過去の街区〜現在のロンドン〜未来の街区）。
  mapBounds: [-140, -38, 140, 42],
};
