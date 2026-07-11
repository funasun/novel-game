import type { ContentPack } from '../../engine/types';
import { ElsinoreScene } from './scene/ElsinoreScene';
import { HamletOverlay } from './scene/HamletOverlay';
import {
  SPAWN,
  SQUARE,
  MARKET,
  PIER_ROOT,
  PIER_END,
  WILLOW,
  GARDEN_CENTER,
  TOWN_POS,
  BATTLEMENTS,
  THRONE,
  GALLERY,
  CHAPEL,
  STAGE,
  GRAVEYARD,
} from './layout';

// Layer 3: シェイクスピア『ハムレット』を「心の生活ゲーム」として翻案。
// 生活パラメータは空腹や体力ではなく、憂鬱・疑念・決意——心の天気図。
// テキストはすべて自作の翻案（現代邦訳の複製ではない）。原作は Public Domain。

export const hamlet: ContentPack = {
  id: 'hamlet',
  title: 'ハムレット',
  author: 'W・シェイクスピア',
  blurb:
    'エルシノア城の夜、亡き父王の亡霊が現れる。疑い、狂気、ためらい——復讐に囚われた王子ハムレットの「心の生活」を生きる。',
  accent: '#7a5a9b',
  Scene: ElsinoreScene,
  Overlay: HamletOverlay,
  startTime: { day: 1, hour: 1 },
  spawn: SPAWN,

  // 心の天気図。憂鬱・疑念・決意を可視化し、隠しパラメータで仮面と警戒を追う。
  parameters: {
    melancholy: { label: '憂鬱', min: 0, max: 100, initial: 70 },
    doubt: { label: '疑念', min: 0, max: 100, initial: 20 },
    resolve: { label: '決意', min: 0, max: 100, initial: 10 },
    mask: { label: '狂気の仮面', min: 0, max: 100, initial: 0, display: false },
    suspicion: { label: '宮廷の警戒', min: 0, max: 100, initial: 0, display: false },
  },

  items: {
    script: { label: '「ゴンザーゴ殺し」の台本' },
    flower_rosemary: { label: 'ローズマリー（追憶）' },
    flower_pansy: { label: '三色すみれ（物思い）' },
    flower_fennel: { label: 'ういきょう（へつらい）' },
    flower_rue: { label: 'ヘンルーダ（悔い）' },
    flower_daisy: { label: 'ひなぎく（偽りなき心）' },
  },

  characters: {
    hamlet: { name: 'ハムレット', note: 'デンマークの王子。先王の子。思索と逡巡の人。（あなた）' },
    ghost: { name: '亡き父王', note: '先王ハムレット。弟に毒殺され、亡霊となって復讐を促す。' },
    claudius: { name: 'クローディアス', note: '現デンマーク王。ハムレットの叔父。兄を殺めて王位と王妃を奪った。' },
    gertrude: { name: 'ガートルード', note: '王妃。ハムレットの母。先王の死後まもなく新王と再婚した。' },
    horatio: { name: 'ホレイショー', note: 'ハムレットの親友。学者肌の、ただ一人心を許せる人物。' },
    ophelia: { name: 'オフィーリア', note: 'ポローニアスの娘。ハムレットの恋人。' },
    polonius: { name: 'ポローニアス', note: '侍従長。おせっかいで口数の多い老臣。' },
    laertes: { name: 'レアティーズ', note: 'ポローニアスの息子。オフィーリアの兄。' },
    leadPlayer: { name: '旅役者の座長', note: '城を訪れた一座の長。' },
    gravedigger: { name: '墓掘り', note: '軽口をたたきながら墓を掘る男。' },
    bernardo: { name: 'バナードー', note: '城門の衛兵。亡霊を最初に見た夜警のひとり。' },
    merchant: { name: '市場の商人', note: '海峡をゆく船の品を商う、城下の顔役。' },
    hostess: { name: '錨亭の女将', note: '港町の酒場「錨亭」を切り盛りする。地獄耳。' },
    fisher: { name: '年老いた漁師', note: '海峡を六十年見てきた男。王の名を三代言える。' },
  },

  dialogues: {
    // ── 第一幕：胸壁の亡霊 ──
    dlg_watch: {
      id: 'dlg_watch',
      speaker: 'horatio',
      lines: [
        'ハムレットさま。ゆうべも、真夜中に現れました。',
        '先王の——お父上の、お姿が。あの甲冑のまま、音もなく。',
        '……ごらんください。今宵も。あそこに。',
      ],
    },
    dlg_hamlet_see: {
      id: 'dlg_hamlet_see',
      speaker: 'hamlet',
      lines: [
        '……父上。',
        'まさか。あの武具は、たしかに父上のものだ。',
        '天よ、地獄よ。話しかけてみる。——物言わぬ亡霊よ、なぜ夜ごと迷い出る。',
      ],
    },
    dlg_ghost: {
      id: 'dlg_ghost',
      speaker: 'ghost',
      lines: [
        'わたしはお前の父の霊だ。夜はさまよい、昼は炎の中で生前の罪を焼かれている。',
        'よく聞け。世に伝わるように、庭で蛇に噛まれて死んだのではない。',
        'わたしの命を奪った蛇は、いまこの国の王冠をかぶっている。',
        'お前の叔父——クローディアスだ。',
        'あの男は昼寝のわたしの耳に、瓶の毒を注いだ。ひと息に、命と、王妃と、王冠を奪ったのだ。',
        '忘れるな。わたしを忘れるな。この非道に、復讐を。',
      ],
    },
    dlg_vow: {
      id: 'dlg_vow',
      speaker: 'hamlet',
      lines: [
        '誓います、父上。',
        'この頭の帳(とばり)から、書物も、戯れも、若い日の記憶も、ことごとく拭い去りましょう。',
        '刻むのはただ一つ。あなたの言葉だけを。——復讐を。',
      ],
    },

    // ── 第二幕：狂気の仮面 ──
    dlg_ophelia_mad: {
      id: 'dlg_ophelia_mad',
      speaker: 'hamlet',
      lines: [
        '尼寺へ行け、オフィーリア。なぜ罪人などを産もうとする。',
        'おれは昔お前を愛した。——いや、愛さなかった。忘れてしまえ。',
        'この世は雑草の茂る荒れ庭だ。誰も信じるな。おれのこともだ。さらばだ。',
      ],
      effects: { flags: ['antic'], params: { mask: 45, melancholy: 8, suspicion: 15 }, learning: ['l_antic'] },
    },

    // ── 第三幕：ねずみ捕り ──
    dlg_players: {
      id: 'dlg_players',
      speaker: 'leadPlayer',
      lines: [
        '王子さま。われら旅の一座、城のもてなしに一幕さしあげましょう。',
        '悲劇でも喜劇でも、史劇でも。ご所望のままに。',
      ],
    },
    dlg_plan: {
      id: 'dlg_plan',
      speaker: 'hamlet',
      lines: [
        '……そうだ。芝居だ。',
        '聞けば、罪深い者が芝居を観て、その真に迫った出来に胸を打たれ、思わず罪を白状することがあるという。',
        '父の殺され方をそっくり演じさせ、あの叔父の顔色をうかがおう。',
        '芝居こそ、王の良心をからめとる罠だ。',
      ],
    },
    dlg_edit: {
      id: 'dlg_edit',
      speaker: 'hamlet',
      lines: [
        '台本に、十二、三行ほど書き加えさせてもらう。',
        '眠る王の耳へ、毒を注ぐ——あの場を、そっくりそのまま。',
        'さあ『ゴンザーゴ殺し』。今宵の主賓は、王だ。',
      ],
      effects: { items: { script: 1 }, flags: ['play_ready'], params: { resolve: 8 }, learning: ['l_play'] },
    },
    dlg_tobe: {
      id: 'dlg_tobe',
      speaker: 'hamlet',
      lines: [
        '生きるべきか、死ぬべきか。それが問題だ。',
        '荒れ狂う運命の矢弾を、じっと胸に受けて耐えるのが尊いのか。それとも剣を取り、苦難の海に立ち向かって、断ち切るのが。',
        '死ぬ、眠る——それだけのこと。眠れば心の痛みも、身に降りかかる千の苦しみも消える。',
        'だが、その眠りにどんな夢が訪れるか。それを思うと、足がすくむ。',
        'こうして分別は人を臆病にし、決意の血の色は、思案の青白さに濁ってゆく。',
      ],
      effects: { learning: ['l_tobe'], params: { melancholy: 8, doubt: 6 } },
    },
    dlg_play_scene: {
      id: 'dlg_play_scene',
      speaker: 'leadPlayer',
      lines: [
        '——ここに眠るは、麗しき王。園の静けさ。',
        '忍び寄る者ひとり。手には、小さな毒瓶。',
        '王の耳へ、とろりと注ぐ。……こうして、王位は奪われる。',
      ],
    },
    dlg_king_reaction: {
      id: 'dlg_king_reaction',
      speaker: 'claudius',
      lines: ['……灯りを。灯りをよこせ！', 'もうよい。退がる。——退がると言っている！'],
    },
    dlg_confirm: {
      id: 'dlg_confirm',
      speaker: 'hamlet',
      lines: [
        '見たか、ホレイショー。やつは芝居の途中で青ざめ、席を蹴って逃げた。',
        '亡霊の言葉は、真実だった。もう疑いはない。',
        '叔父の罪は、これで千の証文よりも確かだ。',
      ],
    },

    // ── 第四幕：祈りと私室 ──
    dlg_pray: {
      id: 'dlg_pray',
      speaker: 'hamlet',
      lines: [
        '……今なら討てる。祈りに沈んだ、無防備なうなじ。',
        'いや、待て。祈っている今殺せば、この男の魂は清められて天へ昇るだろう。',
        '父は罪を抱えたまま逝ったのに、仇が救われる。それでは復讐にならぬ。',
        '剣をおさめよう。もっと悪しき時に——酒と、怒りと、眠りの中で討つ。',
      ],
    },
    dlg_closet_1: {
      id: 'dlg_closet_1',
      speaker: 'gertrude',
      lines: ['ハムレット。お前は父上を——義父上を、ひどく怒らせました。'],
      effects: { next: 'dlg_closet_2' },
    },
    dlg_closet_2: {
      id: 'dlg_closet_2',
      speaker: 'hamlet',
      lines: [
        '母上こそ、父を——真の父を、ひどく侮辱なさった。',
        'お座りなさい。動いてはいけません。鏡をお見せしましょう、あなたの心の奥底を——',
      ],
      effects: { next: 'dlg_closet_3' },
    },
    dlg_closet_3: {
      id: 'dlg_closet_3',
      speaker: 'polonius',
      lines: ['（壁掛けの陰で）誰か！　誰か来てくれ、王妃さまが——！'],
      effects: { next: 'dlg_closet_4' },
    },
    dlg_closet_4: {
      id: 'dlg_closet_4',
      speaker: 'hamlet',
      lines: ['鼠か！　——覚悟！', '（アラス越しに、ひと突き）'],
      effects: { next: 'dlg_closet_5' },
    },
    dlg_closet_5: {
      id: 'dlg_closet_5',
      speaker: 'hamlet',
      lines: [
        '……王かと思った。',
        'ポローニアス、老いぼれめ。出しゃばりの果てがこれだ。人の話に鼻を突っ込むからだ。',
      ],
      effects: { next: 'dlg_closet_6' },
    },
    dlg_closet_6: {
      id: 'dlg_closet_6',
      speaker: 'ghost',
      lines: [
        '忘れるな、息子よ。鈍りかけたお前の決意を、研ぎ直しに来た。',
        'だが——母を責めるな。うろたえる母を、言葉で救ってやれ。',
        '復讐は、叔父にのみ向けよ。',
      ],
      effects: {
        flags: ['closet_done', 'polonius_dead'],
        params: { resolve: 10, melancholy: 15, suspicion: 30 },
        learning: ['l_polonius'],
      },
    },

    // ── 第四幕：オフィーリアの死 ──
    dlg_willow: {
      id: 'dlg_willow',
      speaker: 'gertrude',
      lines: [
        '小川のほとりに、柳が斜めに立って、白い葉裏を水鏡に映しています。',
        'あの子はそこへ花冠を掛けようと枝に登り——枝が折れて、花もろとも流れに落ちました。',
        'しばらくは古い歌を口ずさみ、衣を水に広げて浮いていましたが……やがて歌もろとも、泥の底へ沈みました。',
      ],
    },

    // ── 城下の噂（サイドクエスト：町の噂あつめ） ──
    dlg_rumor_guard: {
      id: 'dlg_rumor_guard',
      speaker: 'bernardo',
      lines: [
        '王子さま、夜歩きはほどほどに。……いえ、亡霊のことじゃありません。いや、それもありますが。',
        'ノルウェーの若君フォーティンブラスが、国境で兵を集めていると専らの噂で。父君の恨みを晴らす気だと。',
        'だから城じゃ夜も大砲を鋳て、船大工は日曜も休めない。この国は、眠りながら戦支度をしているんです。',
      ],
      effects: {
        counters: { rumors: 1 },
        learning: ['l_fortinbras'],
        params: { doubt: 3 },
        minutes: 30,
      },
    },
    dlg_rumor_merchant: {
      id: 'dlg_rumor_merchant',
      speaker: 'merchant',
      lines: [
        'へい王子さま、南蛮の胡椒に琥珀、ライン河の葡萄酒——どれも海峡さまのおかげで。',
        '海峡を通る船は一艘のこらず、この町で帆を下ろして税を納める。城の大砲が、払わぬ船を沈めますからな。',
        'ただね……代替わりからこっち、役人の目つきが変わりました。景気の話より、人の口を数えていなさる。',
      ],
      effects: {
        counters: { rumors: 1 },
        learning: ['l_sound_tax'],
        params: { doubt: 2 },
        minutes: 30,
      },
    },
    dlg_rumor_hostess: {
      id: 'dlg_rumor_hostess',
      speaker: 'hostess',
      lines: [
        'いらっしゃい、王子さま。うちは錨亭。沈む前にみんな一度は寄る店ですよ。',
        '聞こえますか、城の大砲。新しい王さまは杯を干すたび撃たせるんです。夜通しですよ。樽の酒が濁っちまう。',
        '古くからの風習だそうですけどね——よその国じゃ、デンマーク人は飲んだくれだと笑われてるって。先の王さまは、あんなに撃たせなかった。',
      ],
      effects: {
        counters: { rumors: 1 },
        learning: ['l_wassail'],
        params: { melancholy: 2, doubt: 2 },
        minutes: 30,
      },
    },
    dlg_rumor_fisher: {
      id: 'dlg_rumor_fisher',
      speaker: 'fisher',
      lines: [
        '……先の王さまの弔いの晩も、わしはここで網を繕っとりました。海が、妙に静かでな。',
        '王子さまは不思議に思わんかね。なぜ先王の子でなく、弟君が王冠をかぶったのか。',
        'この国じゃ、王は生まれるもんじゃない。選ばれるもんです。城の重臣たちが手を挙げりゃ、順番は飛ぶ。……ま、海の上から見りゃ、どの王さまも同じ大きさですがな。',
      ],
      effects: {
        counters: { rumors: 1 },
        learning: ['l_election'],
        params: { doubt: 4 },
        minutes: 30,
      },
    },

    // ── 第四幕：庭をさまよう狂乱のオフィーリア ──
    dlg_mad_ophelia: {
      id: 'dlg_mad_ophelia',
      speaker: 'ophelia',
      lines: [
        '（歌うように）——それと分かる目印は、貝の帽子と杖。ほんとの恋人は、それと分かる……',
        'これはローズマリー。追憶の花。ねえ、覚えていてね。それから三色すみれ、物思いの花。',
        'あなたには、ういきょうと苧環(おだまき)。お妃さまにはヘンルーダ。わたしの分も、すこしだけ。',
        'すみれの花はあげられないの。父さまが死んだ日に、みんな枯れてしまったから。',
        '（ふっと目の焦点が合い、また遠くなる）……お墓に、雪は降るかしら。',
      ],
      effects: {
        learning: ['l_ophelia_flowers'],
        params: { melancholy: 8 },
      },
    },

    // ── 第五幕：墓地 ──
    dlg_grave_1: {
      id: 'dlg_grave_1',
      speaker: 'gravedigger',
      lines: ['へい、この髑髏はもう二十三年も土の中でさ。', '旦那、こいつが誰の頭だか、あててごらんなせえ。'],
      effects: { next: 'dlg_grave_2' },
    },
    dlg_grave_2: {
      id: 'dlg_grave_2',
      speaker: 'hamlet',
      lines: ['知らぬ。誰の頭だ。'],
      effects: { next: 'dlg_grave_3' },
    },
    dlg_grave_3: {
      id: 'dlg_grave_3',
      speaker: 'gravedigger',
      lines: ['先王おかかえの道化、ヨリックの頭ですよ。とんだ剽軽者でしたっけ。'],
      effects: { next: 'dlg_grave_4' },
    },
    dlg_grave_4: {
      id: 'dlg_grave_4',
      speaker: 'hamlet',
      lines: [
        '……ヨリック。哀れなヨリック。',
        'この男を知っている、ホレイショー。かつては際限なくおれを笑わせ、背に負って遊んでくれた。',
        'その唇はどこへ行った。あれほど人を沸かせた戯れ言の数々は。',
        '王も、乞食も、行き着く先はこの土だ。アレクサンダー大王の亡骸も、めぐりめぐって、どこかの酒樽の栓になっているかもしれん。',
      ],
      effects: {
        flags: ['yorick'],
        params: { melancholy: 10, resolve: 12, doubt: -10 },
        learning: ['l_yorick'],
        questAdd: ['q_duel'],
      },
    },

    // ── 第五幕：果たし合い ──
    dlg_duel_challenge: {
      id: 'dlg_duel_challenge',
      speaker: 'laertes',
      lines: ['ハムレット。父と妹の仇——尋常に立ち合え。', '宮廷の目の前で、剣の勝負だ。逃げは許さん。'],
      effects: { next: 'dlg_duel_accept' },
    },
    dlg_duel_accept: {
      id: 'dlg_duel_accept',
      speaker: 'hamlet',
      lines: [
        '受けよう。運命に身をゆだねる。',
        '一羽の雀が落ちるにも、天の摂理がある。',
        '来るべきものは、今来なくとも、いずれ来る。肝要なのは、覚悟だ。——いざ。',
      ],
      effects: { flags: ['duel_start'], params: { resolve: 15 } },
    },
    dlg_duel_1: {
      id: 'dlg_duel_1',
      speaker: 'gertrude',
      lines: ['ハムレット、お前の勝利のために乾杯します。', '（王の止める間もなく、毒の杯をあおる）'],
    },
    dlg_duel_2: {
      id: 'dlg_duel_2',
      speaker: 'laertes',
      lines: [
        '……ハムレット、お前は謀られた。この剣の切っ先にも、あの杯にも、毒が仕込まれていた。',
        '王妃さまは毒に。おれも、もう助からぬ。',
        '許してくれ。悪はすべて、あの王から出たのだ。そこにいる、クローディアスから。',
      ],
    },
    dlg_duel_3: {
      id: 'dlg_duel_3',
      speaker: 'hamlet',
      lines: ['剣にも毒だと。ならば——毒よ、役目を果たせ！', '（王を刺す）', 'この毒杯を飲み干せ、人殺しめ。母の後を追え！'],
    },
    dlg_duel_4: {
      id: 'dlg_duel_4',
      speaker: 'claudius',
      lines: ['……守ってくれ。まだ、傷は浅い——', '（斃れる）'],
    },
    dlg_duel_5: {
      id: 'dlg_duel_5',
      speaker: 'hamlet',
      lines: [
        'ホレイショー……おれは、死ぬ。',
        'お前は生きて、正しく息をつなぎ、この曇りない話を、世の人に伝えてくれ。',
        'おれの名を——安らかに。',
        '残るは——沈黙だ。',
      ],
    },
  },

  quests: {
    q_madness: {
      id: 'q_madness',
      title: '狂気の仮面',
      description: '悟られぬよう、狂気を装う。まずはオフィーリアに、狂ったふりで語りかけよ。',
      waypoint: [-7, 3],
      goal: { type: 'flag', flag: 'antic' },
    },
    q_mousetrap: {
      id: 'q_mousetrap',
      title: 'ねずみ捕り',
      description: '旅役者の芝居で、王の良心をからめとる。舞台の台本に、父の死になぞらえた一場を書き加えよ。',
      waypoint: [21, -1.5],
      goal: { type: 'flag', flag: 'play_ready' },
    },
    q_closet: {
      id: 'q_closet',
      title: '母の私室',
      description: '王妃と対峙せよ。私室の壁掛け(アラス)の奥に、うごめく人影がある。',
      waypoint: [21, -20],
      goal: { type: 'flag', flag: 'closet_done' },
    },
    q_grave: {
      id: 'q_grave',
      title: '墓地にて',
      description: '墓掘りのかたわらで、掘り返された古い髑髏を手に取れ。',
      waypoint: [-20, 19.5],
      goal: { type: 'flag', flag: 'yorick' },
    },
    q_duel: {
      id: 'q_duel',
      title: '果たし合い',
      description: 'レアティーズの挑戦を受ける。中庭で剣を取り、運命に身をゆだねよ。',
      waypoint: [0, 6],
      goal: { type: 'flag', flag: 'duel_start' },
    },

    // ── よりみち（城下の暮らし） ──
    sq_rumors: {
      id: 'sq_rumors',
      title: '町の噂あつめ',
      description:
        '城下の四人——門の衛兵・市場の商人・錨亭の女将・港の漁師——の話に耳を傾ける。噂の切れ端が、デンマークの輪郭を描く。',
      waypoint: SQUARE,
      goal: { type: 'counter', counter: 'rumors', count: 4 },
      side: true,
    },
    sq_quotes: {
      id: 'sq_quotes',
      title: '台詞の欠片',
      description:
        '城の内外のどこかで、七枚の紙片が光っている。拾えば、この悲劇に刻まれた言葉が手帳に残る。',
      waypoint: [3, -28],
      goal: { type: 'counter', counter: 'quotes', count: 7 },
      side: true,
    },
    sq_flowers: {
      id: 'sq_flowers',
      title: 'オフィーリアの花冠',
      description:
        '彼女が配るはずだった五つの花——ローズマリー・三色すみれ・ういきょう・ヘンルーダ・ひなぎく——を摘み集める。集めきったら、小川の柳のもとへ。',
      waypoint: WILLOW,
      goal: { type: 'counter', counter: 'flowers', count: 5 },
      side: true,
    },
    sq_walk: {
      id: 'sq_walk',
      title: 'エルシノアを歩き尽くす',
      description: '城と城下のすみずみまで足を運び、十二の場所を見つける。地図は手帳に描かれていく。',
      goal: { type: 'counter', counter: 'landmarks_found', count: 12 },
      side: true,
    },
  },

  events: [
    // 第一幕：亡霊の告発と復讐の誓い
    {
      id: 'ev_open',
      trigger: { type: 'gameStart' },
      steps: [
        {
          type: 'narration',
          lines: [
            'エルシノア城、真夜中の胸壁。',
            '凍える風。眼下の海が鳴っている。',
            '歩哨に立つ友ホレイショーが、青ざめた顔で振り向いた。',
          ],
        },
        { type: 'dialogue', id: 'dlg_watch' },
        { type: 'dialogue', id: 'dlg_hamlet_see' },
        { type: 'dialogue', id: 'dlg_ghost' },
        { type: 'dialogue', id: 'dlg_vow' },
        {
          type: 'effects',
          effects: {
            flags: ['oath'],
            params: { resolve: 30, doubt: 35, melancholy: 10 },
            learning: ['l_ghost', 'l_denmark', 'l_town'],
            questAdd: ['q_madness', 'sq_rumors', 'sq_quotes', 'sq_walk'],
          },
        },
        {
          type: 'narration',
          lines: [
            '東の空が、うっすら白みはじめる。亡霊は消えた。',
            '胸に残るのは、ただ一つの誓い。',
            '——狂気を装おう。悟られぬために。この城のすべての目を、欺いて。',
            '南の大門はひらいている。門の外には城下の町、市場と酒場、港と、オフィーリアの庭。',
            '（心が重いときは、町を歩き、人と話し、剣を振るい、祈るがいい。憂鬱も疑念も決意も——動かせる）',
          ],
        },
      ],
    },

    // 第二〜三幕：旅役者の到着と「ねずみ捕り」の着想
    {
      id: 'ev_players',
      trigger: { type: 'questComplete', quest: 'q_madness' },
      steps: [
        {
          type: 'narration',
          lines: [
            '城に、旅の一座がやって来た。',
            '太鼓と笛。ひさしぶりの、華やいだ空気。',
            'ハムレットの目の奥に、ひとつの企みが灯る。',
          ],
        },
        { type: 'dialogue', id: 'dlg_players' },
        { type: 'dialogue', id: 'dlg_plan' },
        {
          type: 'effects',
          effects: {
            questAdd: ['q_mousetrap'],
            learning: ['l_mousetrap', 'l_elsinore'],
            params: { doubt: -5, resolve: 10 },
          },
        },
      ],
    },

    // 第三幕：劇中劇の上演と王の動揺
    {
      id: 'ev_mousetrap',
      trigger: { type: 'questComplete', quest: 'q_mousetrap' },
      steps: [
        {
          type: 'narration',
          lines: [
            '夜。松明の下、旅役者の芝居が始まる。',
            '題して『ねずみ捕り』。王と王妃が、上座で見物する。',
            'ハムレットは、王の顔だけを、じっと見つめている。',
          ],
        },
        { type: 'dialogue', id: 'dlg_play_scene' },
        { type: 'dialogue', id: 'dlg_king_reaction' },
        { type: 'dialogue', id: 'dlg_confirm' },
        {
          type: 'effects',
          effects: {
            flags: ['guilt_confirmed'],
            params: { doubt: -25, resolve: 25, suspicion: 20 },
            questAdd: ['q_closet'],
          },
        },
      ],
    },

    // 第三幕：祈る王を討ちそこねる（復讐のためらい）
    {
      id: 'ev_pray',
      trigger: { type: 'flag', flag: 'guilt_confirmed' },
      steps: [
        {
          type: 'narration',
          lines: ['王がひとり、礼拝堂にひざまずいている。', '祈りの言葉。無防備な、うなじ。', '——今なら。背後から、ひと突きで。'],
        },
        { type: 'dialogue', id: 'dlg_pray' },
        { type: 'effects', effects: { params: { resolve: -8, doubt: 6, melancholy: 6 }, learning: ['l_delay'] } },
      ],
    },

    // 第四幕：オフィーリアの狂乱と死
    {
      id: 'ev_ophelia',
      trigger: { type: 'flag', flag: 'polonius_dead' },
      steps: [
        {
          type: 'narration',
          lines: ['父を、恋人ハムレットの手にかけられ——', 'オフィーリアは、正気の糸を手放した。', '花を摘み、歌を口ずさみ、水辺をさまよって。'],
        },
        { type: 'dialogue', id: 'dlg_willow' },
        {
          type: 'effects',
          effects: {
            params: { melancholy: 25, resolve: 8 },
            learning: ['l_ophelia'],
            questAdd: ['q_grave', 'sq_flowers'],
          },
        },
        {
          type: 'narration',
          lines: [
            '西の庭の小川に、あの柳はいまも立っている。',
            '彼女が配るはずだった花は、庭のそこかしこに咲いたままだ。',
            '（五つの花を摘み、柳のもとへ——せめて、花冠を編んで）',
          ],
        },
      ],
    },

    // よりみち：噂がそろう
    {
      id: 'ev_rumors',
      trigger: { type: 'questComplete', quest: 'sq_rumors' },
      steps: [
        {
          type: 'narration',
          lines: [
            '衛兵の戦支度。商人の税。女将の砲声。漁師の「選ばれる王」。',
            '四つの噂が重なって、デンマークという国の輪郭が見えてくる。',
            '腐っているのは城の奥だ。それでも町の人々は、今日も竈に火を入れる。',
            'その当たり前の営みが、いまのハムレットには、まぶしい。',
          ],
        },
        { type: 'effects', effects: { params: { doubt: -6, resolve: 5, melancholy: -4 } } },
      ],
    },

    // よりみち：台詞の欠片がそろう
    {
      id: 'ev_quotes',
      trigger: { type: 'questComplete', quest: 'sq_quotes' },
      steps: [
        {
          type: 'narration',
          lines: [
            '七枚の紙片が、手帳のなかで一つにつながる。',
            '牢獄も、鏡も、雀の摂理も——言葉はハムレットのただ一つの武器であり、逃げ場であり、灯りだ。',
            '言葉を集め終えたとき、少しだけ、夜が軽くなった。',
          ],
        },
        { type: 'effects', effects: { params: { melancholy: -8, resolve: 5 } } },
      ],
    },

    // よりみち：エルシノア踏破
    {
      id: 'ev_walk',
      trigger: { type: 'questComplete', quest: 'sq_walk' },
      steps: [
        {
          type: 'narration',
          lines: [
            '胸壁から桟橋まで、礼拝堂から酒場まで。足の裏が、エルシノアの全部を覚えた。',
            'この場所のすべてが舞台で、すべての人が役者だ。',
            'そして舞台を知り尽くした役者は、もう出番を恐れない。',
          ],
        },
        { type: 'effects', effects: { params: { resolve: 6, melancholy: -4 } } },
      ],
    },

    // よりみち：花冠を柳に供える
    {
      id: 'ev_wreath',
      trigger: { type: 'questComplete', quest: 'sq_flowers' },
      steps: [
        {
          type: 'narration',
          lines: [
            '五つの花を、震える指で編む。追憶に、物思い。へつらいと、悔いと、偽りなき心。',
            '小川の柳の、彼女が登ったあの枝に、そっと花冠を掛けた。',
            '水面が、白い葉裏を映して揺れる。歌声は、もう聞こえない。',
            '——さようなら、オフィーリア。きみの花は、おれが覚えている。',
          ],
        },
        {
          type: 'effects',
          effects: {
            flags: ['wreath_done'],
            items: {
              flower_rosemary: -1,
              flower_pansy: -1,
              flower_fennel: -1,
              flower_rue: -1,
              flower_daisy: -1,
            },
            params: { melancholy: -14, resolve: 6 },
            learning: ['l_flowers'],
          },
        },
      ],
    },

    // 第五幕：決闘、そして結末
    {
      id: 'ev_duel',
      trigger: { type: 'questComplete', quest: 'q_duel' },
      steps: [
        {
          type: 'narration',
          lines: [
            '中庭に、剣がきらめく。取り巻く宮廷の人々。',
            '王は、ハムレットのために毒を仕込んだ杯を、そっと用意している。',
            '毒を塗った剣の切っ先が、静かに出番を待つ。',
          ],
        },
        { type: 'dialogue', id: 'dlg_duel_1' },
        { type: 'dialogue', id: 'dlg_duel_2' },
        { type: 'dialogue', id: 'dlg_duel_3' },
        { type: 'dialogue', id: 'dlg_duel_4' },
        { type: 'dialogue', id: 'dlg_duel_5' },
        { type: 'effects', effects: { flags: ['ending'], params: { resolve: 20, melancholy: -15, doubt: -20 }, learning: ['l_end'] } },
        {
          type: 'narration',
          lines: [
            'ハムレット、こと切れる。',
            'ホレイショーが、その亡骸をそっと抱く。',
            '『さらば、王子。天使の群れが、歌でおまえを眠りへ運びますように。』',
            '——エルシノアに、朝が来る。',
          ],
        },
      ],
    },
  ],

  learnings: {
    l_ghost: {
      id: 'l_ghost',
      title: '亡霊の告発',
      body: 'ハムレットの亡父は、弟クローディアスに眠っているところを毒殺されたと告げる。耳へ毒を注ぐという手口は、証人のない完全犯罪だった。亡霊の言葉が真実かどうか——それを確かめることが、ハムレット最初の重荷になる。',
      tags: ['シェイクスピア', '悲劇'],
    },
    l_denmark: {
      id: 'l_denmark',
      title: 'デンマークは腐っている',
      body: '「何かが腐っている、このデンマークという国では」——見張りの一言は、王位の簒奪によって秩序が病んだ宮廷を言い当てる。ひとりの罪が国全体の空気を濁らせる、という感覚がこの劇を貫いている。',
      tags: ['名台詞', '政治'],
    },
    l_elsinore: {
      id: 'l_elsinore',
      title: 'エルシノア城（クロンボー城）',
      body: '舞台エルシノアは、デンマーク・シェラン島に実在する城クロンボーがモデル。海峡を望む要塞で、通行税で栄えた。シェイクスピア自身は訪れていないが、北海の霧と石壁の冷たさが、この劇の陰鬱さと響き合う。',
      tags: ['史実', '舞台'],
    },
    l_antic: {
      id: 'l_antic',
      title: '狂気を装う',
      body: 'ハムレットは「奇矯なふるまい(antic disposition)」を装うと宣言する。狂気の仮面は、王の監視をかわし、本心を隠し、危険な真実を口にするための盾となる。だが演じるうちに、仮面と素顔の境目は次第に危うくなっていく。',
      tags: ['心理', '戦略'],
    },
    l_mousetrap: {
      id: 'l_mousetrap',
      title: '劇中劇「ねずみ捕り」',
      body: 'ハムレットは旅役者に、父の殺され方をなぞった芝居を演じさせる。「芝居こそ王の良心をからめとる罠だ」。物証のない世界で、相手の反応を観察して真実を暴く——きわめて近代的な、心理の駆け引きである。',
      tags: ['劇構造', '心理'],
    },
    l_play: {
      id: 'l_play',
      title: '芝居は世を映す鏡',
      body: 'ハムレットは役者たちに「自然を鏡に映すように演じよ」と説く。誇張を戒め、真実らしさを求めるその助言は、シェイクスピア自身の演劇論とも読める。芝居は現実を映し、ときに現実の罪までも照らし出す。',
      tags: ['演劇論', 'メタ'],
    },
    l_tobe: {
      id: 'l_tobe',
      title: '生きるべきか、死ぬべきか',
      body: '「生きるべきか、死ぬべきか——それが問題だ」。ハムレットは、苦しみに耐えて生きることと、死んで眠りにつくことを秤にかける。だが死の先に見る「夢」への恐れが人を臆病にし、行動をためらわせる、と結論づける。',
      tags: ['名台詞', '哲学'],
    },
    l_delay: {
      id: 'l_delay',
      title: '復讐のためらい',
      body: '祈るクローディアスを、ハムレットは背後から討てたはずだった。だが「祈りの最中に殺せば魂は天へ昇る」と考え、剣をおさめてしまう。この先延ばしは、思索的なハムレットの性格を象徴し、悲劇をいっそう長びかせる。',
      tags: ['心理', '悲劇'],
    },
    l_polonius: {
      id: 'l_polonius',
      title: 'アラスの陰',
      body: 'ハムレットは母の私室で、壁掛け(アラス)の裏に潜む人影を王と思い込み、剣を突き立てる。死んだのは侍従長ポローニアス。盗み聞きが招いたこの誤殺が、以後の破滅の連鎖に火をつける。',
      tags: ['場面', '因果'],
    },
    l_ophelia: {
      id: 'l_ophelia',
      title: 'オフィーリアの死',
      body: '父を恋人ハムレットに殺されたオフィーリアは正気を失い、花を摘みながら小川に落ちて溺れる。花と歌に彩られたその死は、劇中でもっとも哀切な場面として、後世の多くの画家たちに描かれてきた。',
      tags: ['悲劇', '芸術'],
    },
    l_yorick: {
      id: 'l_yorick',
      title: 'メメント・モリ',
      body: '墓地でハムレットは、道化ヨリックの髑髏を手に取る。かつて自分を笑わせた男の成れの果てを見つめ、王も英雄も等しく土に還ると悟る。「死を想え(メメント・モリ)」——生の空しさと向き合う、名高い場面である。',
      tags: ['哲学', '名場面'],
    },
    l_end: {
      id: 'l_end',
      title: 'あとは沈黙',
      body: '毒の剣と毒の杯によって、王妃・レアティーズ・クローディアス、そしてハムレットが相次いで斃れる。「あとは——沈黙だ」と言い残してハムレットは息絶える。友ホレイショーだけが生き残り、この物語を後世へ語り継ぐ。',
      tags: ['結末', '名台詞'],
    },

    // ── 城下の学び ──
    l_town: {
      id: 'l_town',
      title: '城下の町ヘルシンゲア',
      body: 'クロンボー城の足もとには、海峡交易で栄えた港町ヘルシンゲア（英名エルシノア）が広がっていた。対岸のスウェーデンまでわずか4km。船乗り、商人、職人が行き交うこの町の活気は、石壁の中の陰鬱な宮廷と好対照をなす。',
      tags: ['史実', '舞台'],
    },
    l_sound_tax: {
      id: 'l_sound_tax',
      title: '海峡通行税',
      body: 'デンマーク王はエーレスンド海峡を通るすべての船から通行税を取り立てた。装いを改めたクロンボー城の大砲は、その「関所」の実力装置。この税は約400年ものあいだ王国の財布を潤し、エルシノアの繁栄を支えた。',
      tags: ['史実', '経済'],
    },
    l_wassail: {
      id: 'l_wassail',
      title: '王の酒宴と大砲',
      body: 'クローディアスは杯を干すたび祝砲を撃たせる。ハムレットはこの風習を「守るより破るほうが名誉」と苦々しく評した。飲めや歌えの宮廷と、喪服のままの王子——酒宴の砲声は、ふたつの心の距離をそのまま音にしている。',
      tags: ['場面', '風習'],
    },
    l_election: {
      id: 'l_election',
      title: 'デンマークの選挙王制',
      body: '当時のデンマークの王は世襲ではなく、重臣会議が選ぶものだった。だから先王の子ハムレットではなく、弟クローディアスが王冠をかぶれた。ハムレット自身も終幕で「王の選出とおれの望みのあいだに、あの男が割り込んだ」と口にする。',
      tags: ['史実', '政治'],
    },

    // ── 台詞の欠片（七つの名台詞コレクション） ──
    l_q_joint: {
      id: 'l_q_joint',
      title: '「世の関節は、外れてしまった」',
      body: '亡霊に復讐を課された第一幕の結び。時代そのものが脱臼している——そしてそれを直す役目が、よりにもよって自分に落ちてきた、という呪いの言葉。個人の悲しみが、世界の病の自覚へと広がる瞬間である。',
      tags: ['名台詞', '欠片'],
    },
    l_q_frailty: {
      id: 'l_q_frailty',
      title: '「弱き者よ、汝の名は女」',
      body: '父の死からひと月足らずで叔父と再婚した母への、最初の独白の嘆き。母ひとりへの失望が「女」全体への呪詛にすり替わるこの飛躍にこそ、若いハムレットの傷の深さと危うさが表れている。',
      tags: ['名台詞', '欠片'],
    },
    l_q_brevity: {
      id: 'l_q_brevity',
      title: '「簡潔は知恵の魂」',
      body: '口数の多い侍従長ポローニアスが、よりにもよって「手短に申し上げますと」と前置きしながら延々と語りだす場面の一句。シェイクスピアは、正しいことを言う滑稽な人物を通して、賢しらな言葉の空回りを笑ってみせる。',
      tags: ['名台詞', '欠片'],
    },
    l_q_prison: {
      id: 'l_q_prison',
      title: '「デンマークは牢獄だ」',
      body: '旧友との再会で漏らす本音。「世界がひとつの牢獄なら、デンマークはその中でも上等な独房だ」。続けて言う——「物事に善悪はない、考えがそれを決める」。心の持ちようが世界を牢にも宮殿にも変える、という近代的な認識。',
      tags: ['名台詞', '欠片'],
    },
    l_q_mirror: {
      id: 'l_q_mirror',
      title: '「芝居とは、自然にかかげる鏡」',
      body: '旅役者への演技指導で語られる演劇論。わめくな、誇張するな、時代の姿をありのままに映せ。劇中劇で王の罪を暴こうとするハムレットにとって、この「鏡」の理論は復讐の実践理論でもある。',
      tags: ['名台詞', '欠片'],
    },
    l_q_sparrow: {
      id: 'l_q_sparrow',
      title: '「一羽の雀が落ちるにも、天の摂理がある」',
      body: '果たし合いを前に、胸騒ぎを案じるホレイショーへ返した静かな言葉。来るものは来る。今でなければ、いずれ。逡巡を重ねたハムレットが最後にたどり着いた、覚悟という名の安らぎである。',
      tags: ['名台詞', '欠片'],
    },
    l_q_true: {
      id: 'l_q_true',
      title: '「おのれ自身に、誠実であれ」',
      body: 'フランスへ船出する息子レアティーズへ、ポローニアスが贈った処世訓の結び。「夜が昼に続くように、そうすれば人を欺くこともない」。おせっかいな老臣が遺した言葉のなかで、これだけは真っ直ぐに光る。',
      tags: ['名台詞', '欠片'],
    },

    // ── オフィーリアの花 ──
    l_ophelia_flowers: {
      id: 'l_ophelia_flowers',
      title: '花のことば——狂乱の場',
      body: '正気を手放したオフィーリアは、宮廷の人々に花を配って歩く。ローズマリーは追憶、パンジーは物思い、ういきょうはへつらい、ヘンルーダは悔恨。そして「すみれは父が死んだ日に枯れた」。花言葉だけで宮廷の罪を言い当てる、劇中もっとも哀しい告発である。',
      tags: ['場面', '花言葉'],
    },
    l_flowers: {
      id: 'l_flowers',
      title: '柳の花冠',
      body: 'オフィーリアは柳の枝に花冠を掛けようとして流れに落ちた。彼女に届かなかった花を編み、同じ枝に供える——それは原作にはない、この庭だけの小さな弔いだ。悲劇は変えられない。それでも花を摘む手は、生きている者の仕事である。',
      tags: ['追悼', '花言葉'],
    },
  },

  interactables: [
    // 第二幕：オフィーリアに狂気を装う（q_madness）
    {
      id: 'feign_madness',
      position: [-7, 3],
      prompt: 'オフィーリアに、狂気を装って語りかける',
      radius: 3,
      requiresFlag: 'oath',
      once: true,
      effects: { dialogue: 'dlg_ophelia_mad' },
    },
    // 第三幕：独白（任意・学びのみ）
    {
      id: 'soliloquy',
      position: [-26, 6],
      prompt: '西の回廊にたたずみ、物思いにふける',
      radius: 3.2,
      requiresFlag: 'oath',
      once: true,
      effects: { dialogue: 'dlg_tobe' },
    },
    // 第三幕：台本に一場を書き加える（q_mousetrap）
    {
      id: 'edit_script',
      position: [21, -1.5],
      prompt: '旅役者の台本に、父の死になぞらえた一場を書き加える',
      radius: 3.2,
      requiresFlag: 'antic',
      once: true,
      effects: { dialogue: 'dlg_edit' },
    },
    // 第四幕：母の私室、アラスの奥（q_closet）
    {
      id: 'closet',
      position: [21, -20],
      prompt: '母の私室で、壁掛け(アラス)の奥をうかがう',
      radius: 3.6,
      requiresFlag: 'guilt_confirmed',
      once: true,
      effects: { dialogue: 'dlg_closet_1' },
    },
    // 第五幕：墓地、ヨリックの髑髏（q_grave）
    {
      id: 'yorick',
      position: [-20, 19.5],
      prompt: '掘り返された古い髑髏を、手に取る',
      radius: 3.6,
      requiresFlag: 'polonius_dead',
      once: true,
      effects: { dialogue: 'dlg_grave_1' },
    },
    // 第五幕：果たし合いを受ける（q_duel）
    {
      id: 'accept_duel',
      position: [0, 6],
      prompt: '剣を取り、レアティーズの果たし合いに応じる',
      radius: 3.6,
      requiresFlag: 'yorick',
      once: true,
      effects: { dialogue: 'dlg_duel_challenge' },
    },

    // ═══ 城下の噂（sq_rumors）——四人と話す ═══
    {
      id: 'talk_guard',
      position: TOWN_POS.bernardo,
      prompt: '衛兵バナードーの夜語りを聞く',
      radius: 3,
      once: true,
      effects: { dialogue: 'dlg_rumor_guard' },
    },
    {
      id: 'talk_merchant',
      position: TOWN_POS.merchant,
      prompt: '市場の商人をひやかす',
      radius: 3,
      once: true,
      effects: { dialogue: 'dlg_rumor_merchant' },
    },
    {
      id: 'talk_hostess',
      position: TOWN_POS.hostess,
      prompt: '錨亭の女将と言葉を交わす',
      radius: 3,
      once: true,
      effects: { dialogue: 'dlg_rumor_hostess' },
    },
    {
      id: 'talk_fisher',
      position: TOWN_POS.fisher,
      prompt: '年老いた漁師の話を聞く',
      radius: 3,
      once: true,
      effects: { dialogue: 'dlg_rumor_fisher' },
    },

    // ═══ 光る紙片＝名台詞の欠片（sq_quotes）——七枚 ═══
    {
      id: 'quote_joint',
      position: [3, -28],
      prompt: '光る紙片を拾う',
      radius: 2.6,
      once: true,
      hideFlag: 'paper_joint',
      effects: {
        flags: ['paper_joint'],
        counters: { quotes: 1 },
        learning: ['l_q_joint'],
        params: { resolve: 1 },
      },
    },
    {
      id: 'quote_frailty',
      position: [-28, 12],
      prompt: '光る紙片を拾う',
      radius: 2.6,
      once: true,
      hideFlag: 'paper_frailty',
      effects: {
        flags: ['paper_frailty'],
        counters: { quotes: 1 },
        learning: ['l_q_frailty'],
        params: { resolve: 1 },
      },
    },
    {
      id: 'quote_brevity',
      position: [8.5, -10],
      prompt: '光る紙片を拾う',
      radius: 2.6,
      once: true,
      hideFlag: 'paper_brevity',
      effects: {
        flags: ['paper_brevity'],
        counters: { quotes: 1 },
        learning: ['l_q_brevity'],
        params: { resolve: 1 },
      },
    },
    {
      id: 'quote_prison',
      position: [0, 39.5],
      prompt: '光る紙片を拾う',
      radius: 2.6,
      once: true,
      hideFlag: 'paper_prison',
      effects: {
        flags: ['paper_prison'],
        counters: { quotes: 1 },
        learning: ['l_q_prison'],
        params: { resolve: 1 },
      },
    },
    {
      id: 'quote_mirror',
      position: [25.5, 0.5],
      prompt: '光る紙片を拾う',
      radius: 2.6,
      once: true,
      hideFlag: 'paper_mirror',
      effects: {
        flags: ['paper_mirror'],
        counters: { quotes: 1 },
        learning: ['l_q_mirror'],
        params: { resolve: 1 },
      },
    },
    {
      id: 'quote_sparrow',
      position: [-44.5, 55.8],
      prompt: '光る紙片を拾う',
      radius: 2.6,
      once: true,
      hideFlag: 'paper_sparrow',
      effects: {
        flags: ['paper_sparrow'],
        counters: { quotes: 1 },
        learning: ['l_q_sparrow'],
        params: { resolve: 1 },
      },
    },
    {
      id: 'quote_true',
      position: [39, 105],
      prompt: '光る紙片を拾う',
      radius: 2.6,
      once: true,
      hideFlag: 'paper_true',
      effects: {
        flags: ['paper_true'],
        counters: { quotes: 1 },
        learning: ['l_q_true'],
        params: { resolve: 1 },
      },
    },

    // ═══ 心の管理——くり返せる営み（cooldownHours） ═══
    {
      id: 'act_fence',
      position: [10, 28.2],
      prompt: '稽古の的に剣を振るう',
      radius: 2.8,
      cooldownHours: 6,
      effects: {
        params: { resolve: 6, melancholy: -2 },
        minutes: 60,
      },
    },
    {
      id: 'act_horatio',
      position: [5.5, 16.5],
      prompt: 'ホレイショーと語らう',
      radius: 3,
      cooldownHours: 8,
      effects: {
        params: { melancholy: -8, doubt: -3 },
        minutes: 60,
      },
    },
    {
      id: 'act_chapel',
      position: [-24, -17],
      prompt: '礼拝堂で静かに祈る',
      radius: 3,
      cooldownHours: 10,
      effects: {
        params: { melancholy: -5, resolve: 2 },
        minutes: 45,
      },
    },
    {
      id: 'act_tavern',
      position: [-9.7, 67.5],
      prompt: '錨亭で温い麦酒を一杯',
      radius: 3,
      cooldownHours: 12,
      effects: {
        params: { melancholy: -9, doubt: 5, suspicion: 2 },
        minutes: 90,
      },
    },
    {
      id: 'act_read',
      position: [-28.3, 2.4],
      prompt: '腰掛けで書物をひらく（言葉、言葉、言葉）',
      radius: 2.8,
      cooldownHours: 8,
      effects: {
        params: { doubt: -6, melancholy: 2 },
        minutes: 60,
      },
    },
    {
      id: 'act_sea',
      position: [39, 103.5],
      prompt: '桟橋の先で海峡の風に吹かれる',
      radius: 3,
      cooldownHours: 10,
      effects: {
        params: { melancholy: -5, resolve: 2 },
        minutes: 45,
      },
    },

    // ═══ オフィーリアの花（sq_flowers）——第四幕以降 ═══
    {
      id: 'pick_rosemary',
      position: [-38, 50],
      prompt: 'ローズマリーを摘む——それは追憶',
      radius: 2.6,
      requiresFlag: 'polonius_dead',
      once: true,
      effects: {
        items: { flower_rosemary: 1 },
        counters: { flowers: 1 },
        params: { melancholy: -2 },
      },
    },
    {
      id: 'pick_pansy',
      position: [-33, 64],
      prompt: 'パンジーを摘む——それは物思い',
      radius: 2.6,
      requiresFlag: 'polonius_dead',
      once: true,
      effects: {
        items: { flower_pansy: 1 },
        counters: { flowers: 1 },
        params: { melancholy: -2 },
      },
    },
    {
      id: 'pick_fennel',
      position: [-45, 68],
      prompt: 'ういきょうを摘む——それはへつらい',
      radius: 2.6,
      requiresFlag: 'polonius_dead',
      once: true,
      effects: {
        items: { flower_fennel: 1 },
        counters: { flowers: 1 },
        params: { melancholy: -2 },
      },
    },
    {
      id: 'pick_rue',
      position: [-54.5, 52],
      prompt: 'ヘンルーダを摘む——それは悔恨',
      radius: 2.6,
      requiresFlag: 'polonius_dead',
      once: true,
      effects: {
        items: { flower_rue: 1 },
        counters: { flowers: 1 },
        params: { melancholy: -2 },
      },
    },
    {
      id: 'pick_daisy',
      position: [-15.5, 26.5],
      prompt: 'ひなぎくを摘む——それは偽りの愛',
      radius: 2.6,
      requiresFlag: 'polonius_dead',
      once: true,
      effects: {
        items: { flower_daisy: 1 },
        counters: { flowers: 1 },
        params: { melancholy: -2 },
      },
    },

    // 狂乱のオフィーリア——庭で歌う（第四幕のあいだだけ）
    {
      id: 'ophelia_song',
      position: TOWN_POS.madOphelia,
      prompt: '柳のほとりで歌うオフィーリアに、そっと近づく',
      radius: 3.2,
      requiresFlag: 'polonius_dead',
      hideFlag: 'yorick',
      once: true,
      effects: { dialogue: 'dlg_mad_ophelia' },
    },
  ],

  // 名所。見つけると手帳に刻まれる（sq_walk: landmarks_found）。
  landmarks: [
    { id: 'lm_gate', label: '南の大門', position: [0, 35], radius: 7 },
    { id: 'lm_street', label: '城下の大通り', position: [0, 47], radius: 7 },
    { id: 'lm_square', label: '広場の井戸', position: SQUARE, radius: 8 },
    { id: 'lm_tavern', label: '酒場「錨亭」', position: [-9, 66], radius: 6 },
    { id: 'lm_market', label: '市場の露店', position: MARKET, radius: 6 },
    { id: 'lm_harbor', label: '港の桟橋', position: PIER_ROOT, radius: 8 },
    { id: 'lm_pier_end', label: '桟橋の先端', position: PIER_END, radius: 5 },
    { id: 'lm_garden', label: 'オフィーリアの庭', position: GARDEN_CENTER, radius: 9 },
    { id: 'lm_willow', label: '小川の柳', position: WILLOW, radius: 5.5 },
    { id: 'lm_battle', label: '北の胸壁', position: BATTLEMENTS, radius: 7 },
    { id: 'lm_throne', label: '玉座の間', position: THRONE, radius: 6 },
    { id: 'lm_gallery', label: '西の回廊', position: GALLERY, radius: 6 },
    { id: 'lm_chapel', label: '礼拝堂の祭壇', position: CHAPEL, radius: 5.5 },
    { id: 'lm_stage', label: '旅役者の舞台', position: STAGE, radius: 6 },
    { id: 'lm_grave', label: '墓地', position: GRAVEYARD, radius: 6 },
  ],

  // 地図の描画範囲（城＋城下＋庭＋港・桟橋）。
  mapBounds: [-60, -44, 60, 110],
};
