import type { ContentPack } from '../../engine/types';
import { ElsinoreScene } from './scene/ElsinoreScene';
import { HamletOverlay } from './scene/HamletOverlay';
import { SPAWN } from './layout';

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
      goal: { type: 'flag', flag: 'antic' },
    },
    q_mousetrap: {
      id: 'q_mousetrap',
      title: 'ねずみ捕り',
      description: '旅役者の芝居で、王の良心をからめとる。舞台の台本に、父の死になぞらえた一場を書き加えよ。',
      goal: { type: 'flag', flag: 'play_ready' },
    },
    q_closet: {
      id: 'q_closet',
      title: '母の私室',
      description: '王妃と対峙せよ。私室の壁掛け(アラス)の奥に、うごめく人影がある。',
      goal: { type: 'flag', flag: 'closet_done' },
    },
    q_grave: {
      id: 'q_grave',
      title: '墓地にて',
      description: '墓掘りのかたわらで、掘り返された古い髑髏を手に取れ。',
      goal: { type: 'flag', flag: 'yorick' },
    },
    q_duel: {
      id: 'q_duel',
      title: '果たし合い',
      description: 'レアティーズの挑戦を受ける。中庭で剣を取り、運命に身をゆだねよ。',
      goal: { type: 'flag', flag: 'duel_start' },
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
            learning: ['l_ghost', 'l_denmark'],
            questAdd: ['q_madness'],
          },
        },
        {
          type: 'narration',
          lines: [
            '東の空が、うっすら白みはじめる。亡霊は消えた。',
            '胸に残るのは、ただ一つの誓い。',
            '——狂気を装おう。悟られぬために。この城のすべての目を、欺いて。',
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
        { type: 'effects', effects: { params: { melancholy: 25, resolve: 8 }, learning: ['l_ophelia'], questAdd: ['q_grave'] } },
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
  ],
};
