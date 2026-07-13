import type { ContentPack } from '../../engine/types';
import { TakaseScene } from './scene/TakaseScene';
import {
  SPAWN,
  M1,
  M2,
  M3,
  M4,
  TALK_SPOT,
  SENDO,
  KOSATSU,
  YANAGI1,
  HOTARU1,
  JIZO,
  MIZUOTO,
  TSUKIMI,
  HOTARU2,
  TE_HITASU,
  KUI,
  AKATSUKI,
  KIETOURO1,
  KIETOURO2,
  KIETOURO3,
  KIETOURO4,
  HOTARU_M2,
  HOTARU_M4,
} from './layout';

// Layer 3: 森鷗外『高瀬舟』を「夜の川の対話劇」として翻案。
// プレイヤーは護送役の同心・羽田庄兵衛。罪人・喜助と二人きり、夜の高瀬川を下る。
// パラメータは 問い（腑に落ちなさ）と 静けさ（夜がくれる落ち着き）。
// テキストはすべて自作の翻案（原文の複製ではない）。原作は Public Domain。

export const takasebune: ContentPack = {
  id: 'takasebune',
  title: '高瀬舟',
  author: '森鷗外',
  blurb:
    '桜の散った後の、朧月の夜。京の高瀬川を、島流しの罪人を乗せた小舟が下ってゆく。護送の同心・庄兵衛が見たのは、悲嘆にくれるはずの罪人の、晴れやかな顔だった——「知足」と「安楽死」を問う、ひと晩の川の対話劇。',
  accent: '#3b5a7c',
  Scene: TakaseScene,
  startTime: { day: 1, hour: 19 },
  spawn: SPAWN,

  // 夜の心の計器。「問い」は深まるほど重く、「静けさ」は満ちるほど夜が澄む。
  parameters: {
    toi: { label: '問い', min: 0, max: 100, initial: 0 },
    shizukesa: { label: '静けさ', min: 0, max: 100, initial: 10 },
  },

  // 手に包んで運ぶもの。蛍は熱のない光、水は春のつめたさ。
  items: {
    hotaru: { label: '蛍' },
    mizu: { label: '柄杓の水' },
  },

  characters: {
    kisuke: { name: '喜助', note: '遠島を言い渡された罪人。三十歳ばかり。ふしぎなほど晴れやかな顔をしている。' },
    shobei: { name: '庄兵衛', note: '羽田庄兵衛。護送役の同心。役目には慣れているが、今夜の罪人には慣れない。' },
    voice: { name: '（心のうち）', note: '庄兵衛の胸のうちで動く声。' },
  },

  dialogues: {
    // ── 第一章: 晴れやかな罪人 ──
    dlg_k1: {
      id: 'dlg_k1',
      speaker: 'voice',
      lines: [
        '（罪人を乗せて漕ぎ出す夜は、いつも同じだ。うなだれる背中。すすり泣く身内。それをよそに、役目のわしは黙って舳先を見る）',
        '（——だが、今夜は違う。喜助という男、身内の見送りもなく、たった一人。そのくせ顔色は晴れやかで、月を仰いでは、ほとんど楽しげにしている）',
        '（護送の役目は数知れず勤めたが、こんな罪人は初めてだ。……訊いてみるか）',
      ],
      effects: { next: 'dlg_k1b' },
    },
    dlg_k1b: {
      id: 'dlg_k1b',
      speaker: 'kisuke',
      lines: [
        '「喜助。お前、何を思っているのだ。島へ流される身の上だぞ」——へい。ありがたいことだと思っております。',
        'お役人様には、おかしゅう聞こえましょうが……わたくしは、この年になるまで、住むところに困らぬ暮らしをしたことがございません。',
        '島は辛いところと申しますが、鬼の住むところではございますまい。島には、わたくしの居てよい場所がございます。田畑を作れと言っていただけます。',
        'それに……牢に入りましてから、するお仕事もないのに、お上のお米を毎日いただきました。生まれてこのかた、あんな安らかな心持ちは、初めてでございました。',
      ],
      choices: [
        {
          text: '「それでも島は島だ」と眉をひそめる',
          effects: { flags: ['k1_done'], params: { toi: 8 }, minutes: 20 },
        },
        {
          text: 'ふしぎな男だ、と朧月を見上げる',
          effects: { flags: ['k1_done'], params: { toi: 5, shizukesa: 5 }, minutes: 20 },
        },
      ],
    },

    // ── 第二章: 二百文の知足 ──
    dlg_k2: {
      id: 'dlg_k2',
      speaker: 'kisuke',
      lines: [
        'お役人様。お上から、島での元手にと、二百文をいただいてございます。……ここに、持っております。',
        'お笑いくださいますな。二百文はわずかな銭でございます。けれど、わたくしはこれまで、働いて得た銭を右から左へ人手に渡して、自分のものと呼べる銭を持ったことが、ただの一度もございません。',
        '仕事をして、それが自分の物になる。使わずに持っている。——この二百文を見るたび、夢のような心持ちがいたします。島へ着いたら、これを元手に仕事を始める楽しみが、今から待ち遠しゅうございます。',
      ],
      effects: { next: 'dlg_k2b' },
    },
    dlg_k2b: {
      id: 'dlg_k2b',
      speaker: 'voice',
      lines: [
        '（わしは考えた。わしの給金は喜助の二百文の比ではない。だが月々の暮らしは右から左、蓄えなど、あったためしがない）',
        '（足りない、足りないと思って生きてきた。上を見れば、きりがない。……この男は、二百文で足りている。牢の飯で足りている。島に「居場所がある」と言って笑っている）',
        '（人はどこで欲に踏み止まれるのか。この痩せた罪人が、わしには、頭の上に毫光のさす聖者のようにすら見えてくる）',
      ],
      choices: [
        {
          text: '喜助を敬う心持ちを、素直に認める',
          effects: { flags: ['k2_done'], params: { shizukesa: 8, toi: 4 }, minutes: 25, learning: ['l_chisoku', 'l_nihyakumon'] },
        },
        {
          text: '「わしと何が違うのか」と問いを抱え込む',
          effects: { flags: ['k2_done'], params: { toi: 10 }, minutes: 25, learning: ['l_chisoku', 'l_nihyakumon'] },
        },
      ],
    },

    // ── 第三章: 弟の告白 ──
    dlg_k3a: {
      id: 'dlg_k3a',
      speaker: 'kisuke',
      lines: [
        '……わたくしの罪のことで、ございますか。はい。隠しだては、いたしません。',
        'わたくしどもは早くに親を亡くしまして、弟と二人、西陣の織場で空引きをして育ちました。二人で稼いで、二人でようよう食べてまいりました。',
        '去年の秋、弟が病に倒れました。わたくしが一人で働き、弟は寝たきりで……弟はいつも「兄きに済まない、済まない」と申しておりました。',
      ],
      effects: { next: 'dlg_k3b' },
    },
    dlg_k3b: {
      id: 'dlg_k3b',
      speaker: 'kisuke',
      lines: [
        'あの日、仕事から戻りますと……弟が、布団の上に突っ伏しておりました。周りは血で……剃刀で、喉を、自分で切ったのでございます。',
        '弟は申しました。「どうせ治らぬ病だ。早く死んで、少しでも兄きを楽にしたかった。だが、切り損ねて死に切れぬ。頼む、これを抜いてくれ」と。',
        'わたくしは、医者を呼ぼうといたしました。けれど弟は、恨めしそうな目で、わたくしを見るのでございます。「頼む」「頼む」と、その目が申すのでございます。',
        '……抜けば、死ぬる。それは分かっておりました。分かっていて、わたくしは、抜いてやりました。そこを、ちょうど訪ねてきた近所の婆さんに、見られたのでございます。',
      ],
      effects: { next: 'dlg_k3c' },
    },
    dlg_k3c: {
      id: 'dlg_k3c',
      speaker: 'voice',
      lines: [
        '（喜助の話は条理が立っていて、まるで目の前にその場が見えるようだった。……これが、人殺しだろうか）',
        '（弟は死のうとしていた。死に切れずに苦しんでいた。喜助は、その苦しみを見ているに忍びず、早く終わらせてやった。——苦しみから救うために）',
        '（殺したのは罪に相違ない。だが、それにしては、どこか腑に落ちぬ。何遍考えても、同じところへ戻ってくる）',
      ],
      choices: [
        {
          text: '「罪とは、どうしても思えぬ」',
          effects: { flags: ['k3_done'], params: { toi: 16 }, minutes: 25, learning: ['l_yutanajii'] },
        },
        {
          text: '「法は法。だが、胸のつかえは消えぬ」',
          effects: { flags: ['k3_done'], params: { toi: 14, shizukesa: 3 }, minutes: 25, learning: ['l_yutanajii'] },
        },
      ],
    },

    // ── 第四章: 暁の大阪へ ──
    dlg_k4: {
      id: 'dlg_k4',
      speaker: 'shobei',
      lines: [
        '「喜助。わしは役人だ。お前の罪を裁く力は、わしにはない。……だがな、今夜のお前の話、わしは忘れぬ」',
        '（腑に落ちぬものは、お奉行様の判断に任せるほかない。お上の掟に、寄りかかるほかない。——そう自分に言い聞かせながら、それでもなお、どこかで問いは疼いている）',
        '（オオトリテエ——人の上に立つ判断に任せて、自分の問いに蓋をする。それは楽で、そして少し、うしろめたい）',
      ],
      choices: [
        {
          text: '「それでよいのだ」と言い聞かせる',
          effects: { flags: ['k4_done'], params: { toi: 8, shizukesa: 5 }, minutes: 20, learning: ['l_ootoritee'] },
        },
        {
          text: '腑に落ちぬまま、問いを抱えてゆく',
          effects: { flags: ['k4_done'], params: { toi: 12 }, minutes: 20, learning: ['l_ootoritee'] },
        },
      ],
    },

    // ── 岸辺の点景（小さな語り） ──
    dlg_kosatsu: {
      id: 'dlg_kosatsu',
      speaker: 'voice',
      lines: [
        '（高札には、遠島を仰せつけられた者の処遇が記してある。所払い、江戸十里四方追放……そして遠島。名を読む者もない夜の高札が、月あかりに白い）',
        '（島へ送られる者の多くは、悪人と呼び切れるかどうか、あやしいものだ——役目柄、わしはそれを知っている）',
      ],
      effects: { counters: { quiet_spots: 1 }, params: { shizukesa: 6 }, minutes: 10, learning: ['l_ento'] },
    },
    dlg_tsukimi: {
      id: 'dlg_tsukimi',
      speaker: 'voice',
      lines: [
        '（州に立って、月を仰ぐ。春の夜の月は、輪郭が霞んで、水に溶けたように柔らかい）',
        '（罪人を乗せた舟の上にも、同じ月がさしている。月は、誰の上にも同じにさす）',
      ],
      effects: { counters: { quiet_spots: 1 }, params: { shizukesa: 8 }, minutes: 10, learning: ['l_oborozuki'] },
    },
    dlg_akatsuki: {
      id: 'dlg_akatsuki',
      speaker: 'voice',
      lines: [
        '（東の空が、藍から灰へ、ほんのわずかに緩んでいる。夜が終わろうとしている）',
        '（この舟が大阪へ着けば、喜助は島へ、わしは京へ戻る。同じ夜を分け合った二人が、別々の朝へ漕ぎ出してゆく）',
      ],
      effects: { counters: { quiet_spots: 1 }, params: { shizukesa: 10 }, minutes: 10 },
    },

    // ── 岸の小さな頼まれごと（誰にも頼まれていない用） ──
    dlg_mayoibumi: {
      id: 'dlg_mayoibumi',
      speaker: 'voice',
      lines: [
        '（高札の柱の根本に、白いものが落ちている。拾えば、雨に一度濡れて乾いた、たずね人の文だ）',
        '「おとうと、たずねます。去年の秋より行方知れず。左の眉に傷——」名のところが、にじんで読めない。',
        '（誰かの兄が、誰かの弟を、まだ探している。わしは文の皺をのばし、風に飛ばぬよう、高札の板の端に挟み込んだ）',
        '（喜助の弟は、もう誰にも探されない。そのことが、ふいに喉の奥で鳴った）',
      ],
      effects: {
        counters: { errands: 1 },
        params: { toi: 4, shizukesa: 4 },
        flags: ['err1'],
        minutes: 10,
      },
    },
    dlg_jizo_mizu: {
      id: 'dlg_jizo_mizu',
      speaker: 'voice',
      lines: [
        '（柄杓の水を、地蔵の前の椀にそそぐ。乾いた石の椀が、月を映すほどに満ちる）',
        '（誰が始めた習わしかは知らない。だが、椀が満ちているだけで、辻はもう寂しくない）',
        '（水は、島へ行く者の分も、手向けておいた）',
      ],
      effects: {
        items: { mizu: -1 },
        counters: { errands: 1 },
        params: { shizukesa: 6 },
        flags: ['err2'],
        minutes: 10,
      },
    },
    dlg_kui_rope: {
      id: 'dlg_kui_rope',
      speaker: 'voice',
      lines: [
        '（舫い杭の綱が、緩んでいる。夜のうちに擦り切れれば、朝の川で誰かが難儀するだろう）',
        '（袖をまくり、綱を張り直し、結び目を作り直す。役目柄、結びだけは手が覚えている）',
        '（振り向くと、船頭がこちらを見ていた。何も言わず、小さく頭を下げた）',
      ],
      effects: {
        counters: { errands: 1 },
        params: { shizukesa: 5 },
        flags: ['err3'],
        minutes: 10,
      },
    },

    // ── 掌の蛍を、喜助に（弟の告白のあとでだけ、意味を持つ） ──
    dlg_hotaru_kisuke: {
      id: 'dlg_hotaru_kisuke',
      speaker: 'kisuke',
      lines: [
        '……おや。お役人様、それは——蛍で、ございますか。',
        '弟が達者だったころ、西陣からの帰り道に、二人でよう掬いました。手の中で灯りますのを、弟は「銭の要らぬ提灯や」と申しまして。',
        '（喜助は掌の蛍をしばらく見つめ、それから、そっと夜へ放した。光は遠くへは行かず、二つ三つ、舟べりに残って明滅している）',
        '……ありがとうございます。よい供養に、なりましてございます。',
      ],
      effects: {
        items: { hotaru: -1 },
        params: { shizukesa: 6, toi: -3 },
        flags: ['hotaru_kisuke'],
        minutes: 10,
      },
    },
  },

  quests: {
    q_ch1: {
      id: 'q_ch1',
      title: '晴れやかな罪人',
      description: '島流しの罪人・喜助が、ふしぎなほど晴れやかな顔をしている。舟の上の喜助に、わけを訊いてみる。',
      goal: { type: 'flag', flag: 'k1_done' },
      waypoint: TALK_SPOT(M1),
    },
    q_ch2: {
      id: 'q_ch2',
      title: '二百文の知足',
      description: '舟は蔵の岸へ。喜助が懐の二百文の話をしたがっている。聞いてやる。',
      goal: { type: 'flag', flag: 'k2_done' },
      waypoint: TALK_SPOT(M2),
    },
    q_ch3: {
      id: 'q_ch3',
      title: '弟の告白',
      description: '夜は更けた。月見の州の舫いで、喜助の「罪」を——弟の死の話を、聞くときが来た。',
      goal: { type: 'flag', flag: 'k3_done' },
      waypoint: TALK_SPOT(M3),
    },
    q_ch4: {
      id: 'q_ch4',
      title: '暁の大阪へ',
      description:
        '伏見の舫い。夜明けが近い。答えの出ない問いを抱えたまま、喜助に最後の言葉をかける。——声をかければ、舟はそのまま大阪へ発つ。岸を見るなら、その前に。',
      goal: { type: 'flag', flag: 'k4_done' },
      waypoint: TALK_SPOT(M4),
    },
    // 出立はプレイヤーの手で。舟は川を下る一方、発てばその岸へは戻れない。
    q_dep1: {
      id: 'q_dep1',
      title: '三条の舫いを発つ',
      description:
        '岸辺を見て回り、支度がすんだら、歩み板のたもとの船頭に出立を告げる。（舟は川を下る一方——発てば、この岸にはもう戻らない）',
      goal: { type: 'flag', flag: 'dep1' },
      waypoint: SENDO(M1),
    },
    q_dep2: {
      id: 'q_dep2',
      title: '蔵の岸を発つ',
      description:
        '白壁の蔵のならぶ岸。見のこしがなければ、船頭に出立を告げる。（発てば、この岸にはもう戻らない）',
      goal: { type: 'flag', flag: 'dep2' },
      waypoint: SENDO(M2),
    },
    q_dep3: {
      id: 'q_dep3',
      title: '月見の州を発つ',
      description:
        '蛍と朧月の州。心が鎮まったら、船頭に出立を告げる。（発てば、この岸にはもう戻らない）',
      goal: { type: 'flag', flag: 'dep3' },
      waypoint: SENDO(M3),
    },
    sq_quiet: {
      id: 'sq_quiet',
      title: '夜の静けさ',
      description: '岸辺の点景——高札・柳・蛍・地蔵・水音・月——に足を止め、夜の静けさを六つ、心に満たす。',
      goal: { type: 'counter', counter: 'quiet_spots', count: 6 },
      waypoint: KOSATSU,
      side: true,
    },
    sq_walk: {
      id: 'sq_walk',
      title: '川辺の見聞',
      description: '舫いごとの岸辺を歩き、高瀬川の夜の名所を四つ見つける。（名所は全部で六つある）',
      goal: { type: 'counter', counter: 'landmarks_found', count: 4 },
      side: true,
    },
    sq_tourou: {
      id: 'sq_tourou',
      title: '流れ灯',
      description:
        '川筋の灯籠は、なぜか片方ずつ火が消えている。岸の茂みの蛍をそっと掬い、火袋に放して、四つの灯をともし直す。（掬った茂みの蛍も、しばらくすれば戻ってくる）',
      goal: { type: 'counter', counter: 'lanterns_lit', count: 4 },
      waypoint: [KIETOURO1[0] + 1.3, KIETOURO1[1]],
      side: true,
    },
    sq_errands: {
      id: 'sq_errands',
      title: '岸の小さな用',
      description:
        '舫いの岸には、誰の役目でもない小さな用が残っている。高札の下の迷い文。地蔵の乾いた椀。杭の緩んだ綱。——見つけたら、しておく。',
      goal: { type: 'counter', counter: 'errands', count: 3 },
      waypoint: [KOSATSU[0] + 1.7, KOSATSU[1] - 1],
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
            '高瀬舟は、京都の高瀬川を上下する小舟である。罪を得て遠島を仰せつけられた者は、この舟に乗せられ、夜の川を下って大阪へ回される。',
            '護送は、京都町奉行所の同心の役目だ。罪人の身内がひとり、舟に乗ることを許され、たいていは夜どおし、泣くとも愚痴るともつかぬ声が水の上を流れてゆく。同心仲間では、割に合わぬ嫌な役目とされていた。',
            '智恩院の桜が散った後の、ある朧月の夜。同心・羽田庄兵衛——わし——が護送するのは、弟殺しの罪で遠島となった喜助という男、三十歳ばかり。',
            'ところが、この喜助。見送りの身内もないのに、悲しむ様子がまるでない。それどころか……顔色は、晴れやかである。',
            '（舟の上の喜助に話しかけてみよう。岸に降りて、夜の川辺を歩いてみてもいい）',
          ],
        },
        {
          type: 'effects',
          effects: {
            questAdd: ['q_ch1', 'sq_quiet', 'sq_walk', 'sq_tourou', 'sq_errands'],
            learning: ['l_takasebune', 'l_doshin'],
          },
        },
      ],
    },
    // 語らいが済んでも、舟は待つ。出立はプレイヤーが船頭に告げたときだけ。
    // （岸の点景・名所を見のこしたまま連れ去られないための、物語上の「間」）
    {
      id: 'ev_ready1',
      trigger: { type: 'flag', flag: 'k1_done' },
      steps: [
        {
          type: 'narration',
          lines: [
            '船頭は舫い綱に手をかけたまま、急かすふうもなく夜空を仰いでいる。（岸を歩くなら、今のうちだ。発つときは、歩み板のたもとの船頭に告げればよい）',
            '（見れば、岸の灯籠がひとつ、火が消えたままだ。……すぐそこの茂みでは、蛍が明滅しているのだが）',
            '（高札の根本にも、何か白い紙のようなものが落ちている）',
          ],
        },
        { type: 'effects', effects: { questAdd: ['q_dep1'] } },
      ],
    },
    {
      id: 'ev_ready2',
      trigger: { type: 'flag', flag: 'k2_done' },
      steps: [
        {
          type: 'narration',
          lines: [
            '船頭は煙管を一服つけて、まだ舫いを解かずにいる。（蔵の岸を見て回るなら、今のうちだ）',
            '煙を吐きながら、船頭がぽつりと言う。「地蔵さんの椀が、干上がっとりますな。……柄杓なら、岸っぷちに挿してござる」',
          ],
        },
        { type: 'effects', effects: { questAdd: ['q_dep2'] } },
      ],
    },
    {
      id: 'ev_ready3',
      trigger: { type: 'flag', flag: 'k3_done' },
      steps: [
        {
          type: 'narration',
          lines: [
            '重い話のあとの沈黙を、船頭は黙って守っている。舟は、まだ発たない。（州を歩いて、心を鎮めてもいい）',
          ],
        },
        { type: 'effects', effects: { questAdd: ['q_dep3'] } },
      ],
    },
    {
      id: 'ev_ch1',
      trigger: { type: 'flag', flag: 'dep1' },
      steps: [
        {
          type: 'narration',
          lines: [
            '船頭が舫いを解いた。舟は音もなく岸を離れ、黒い水の上をすべってゆく。',
            '「島がありがたい」という男。世間の考えとあべこべの、その晴れやかさが、わしの胸に小さな棘のように残った。',
            '——次の舫いは、白壁の蔵のならぶ岸だ。着いた岸には対の石灯籠が並んで、なぜか片方だけ、火が入っていた。',
          ],
        },
        {
          type: 'effects',
          effects: {
            flags: ['ch2'],
            teleport: [0, M2 + 1.5],
            minutes: 40,
            questAdd: ['q_ch2'],
          },
        },
      ],
    },
    {
      id: 'ev_ch2',
      trigger: { type: 'flag', flag: 'dep2' },
      steps: [
        {
          type: 'narration',
          lines: [
            '舟はまた岸を離れる。二百文を「夢のようだ」と言った男の顔が、行灯の火に照らされて、静かに笑っている。',
            '足るを知る者と、足りぬを数える者。同じ夜の舟に乗っていて、どちらが安らかであるかは、問うまでもなかった。',
            '——夜が更ける。次の舫いは、月見の州。そこで、聞かねばならぬ話がある。',
          ],
        },
        {
          type: 'effects',
          effects: {
            flags: ['ch3'],
            teleport: [0, M3 + 1.5],
            minutes: 50,
            questAdd: ['q_ch3'],
          },
        },
      ],
    },
    {
      id: 'ev_ch3',
      trigger: { type: 'flag', flag: 'dep3' },
      steps: [
        {
          type: 'narration',
          lines: [
            '喜助は話し終えると、少し痩せた肩を落として、それでもどこか、肩の荷を下ろしたような顔で水の面を見ていた。',
            '殺したのは、罪である。だが、苦しみから救うためであった。——罪とは何か。掟とは何か。問いは答えを連れて来ず、櫓の音だけが規則正しく夜を刻む。',
            '——舟は最後の舫いへ。伏見に着けば、夜が明ける。着いた岸は、舫い杭の綱の結びが甘く、灯籠の火もまた消えていた。今夜、最後の岸だ。',
          ],
        },
        {
          type: 'effects',
          effects: {
            flags: ['ch4'],
            teleport: [0, M4 + 1.5],
            minutes: 50,
            questAdd: ['q_ch4'],
          },
        },
      ],
    },
    // ── 結末。独白の色は、ひと晩の 問い/静けさ の満ち方が決める ──
    {
      id: 'ev_end',
      trigger: { type: 'flag', flag: 'k4_done' },
      steps: [
        {
          type: 'narration',
          lines: [
            '伏見の舫いが解かれた。舟は淀川へ——大阪へ向かう。',
            '喜助は舳先の提灯のそばに座り、二百文の入った懐へ、そっと手を当てた。',
          ],
        },
        { type: 'effects', effects: { flags: ['end_ready'] } },
      ],
    },
    // 問いが深く積もった夜だけ、独白の前にひとこと差し挟まれる
    {
      id: 'ev_toi_nokoru',
      trigger: { type: 'param', param: 'toi', gte: 50, requiresFlag: 'end_ready' },
      steps: [
        {
          type: 'narration',
          lines: [
            '（……それでも、答えは出なかった。オオトリテエに預けた、そのあとも）',
            '（いつかまた、この問いに出会うのだろう。医の庭でも、法の庭でも、あるいはもっと身近な、誰かの枕辺でも——喜助の晴れやかな顔と、一緒に）',
          ],
        },
        { type: 'effects', effects: { flags: ['toi_lingers'] } },
      ],
    },
    // 澄んだ夜（静けさ70以上）——岸で過ごした夜が、問いの置きどころをくれる
    {
      id: 'ev_end_sumu',
      trigger: { type: 'param', param: 'shizukesa', gte: 70, requiresFlag: 'end_ready' },
      steps: [
        {
          type: 'narration',
          lines: [
            '次第に更けてゆく朧夜に、沈黙の人ふたりを乗せた高瀬舟は、黒い水の面をすべっていった。',
            'ふと振り返れば、下ってきた川筋に、岸の灯が点々と浮かんでいる。今夜、足を止めた岸のひとつひとつが、遠ざかりながら光っている。',
            '答えの出ない問いは、そのままだ。だが、問いを抱えたまま静かでいられる夜が、あることを知った。',
            '——完——',
          ],
        },
        { type: 'effects', effects: { flags: ['ending'], learning: ['l_ogai'] } },
      ],
    },
    // なかほどの夜（40-69）——問いを畳んでしまうが、畳み目はほどけそうである
    {
      id: 'ev_end_naka',
      trigger: { type: 'param', param: 'shizukesa', gte: 40, lte: 69, requiresFlag: 'end_ready' },
      steps: [
        {
          type: 'narration',
          lines: [
            '次第に更けてゆく朧夜に、沈黙の人ふたりを乗せた高瀬舟は、黒い水の面をすべっていった。',
            'わしは艫に立ち、答えの出ない問いを、風呂敷のように畳んで胸にしまった。畳み目は、まだ少し、ほどけそうである。',
            '——完——',
          ],
        },
        { type: 'effects', effects: { flags: ['ending'], learning: ['l_ogai'] } },
      ],
    },
    // 岸を知らぬ夜（39以下）——静けさは、向こうからは来ない
    {
      id: 'ev_end_yami',
      trigger: { type: 'param', param: 'shizukesa', lte: 39, requiresFlag: 'end_ready' },
      steps: [
        {
          type: 'narration',
          lines: [
            '次第に更けてゆく朧夜に、沈黙の人ふたりを乗せた高瀬舟は、黒い水の面をすべっていった。',
            '思えば今夜、わしは岸に降りた覚えがほとんどない。蛍も、地蔵も、月見の州も、みな舟の上から流れて過ぎた。問いだけが、手つかずのまま重い。',
            '（岸の夜を知らぬまま、川を下り切ってしまった。——静けさは、向こうからは来ないのだ）',
            '——完——',
          ],
        },
        { type: 'effects', effects: { flags: ['ending', 'end_dark'], learning: ['l_ogai'] } },
      ],
    },
    {
      id: 'ev_quiet',
      trigger: { type: 'questComplete', quest: 'sq_quiet' },
      steps: [
        {
          type: 'narration',
          lines: [
            '（夜が、澄んでいる。蛍の火も、水の音も、月の暈も、みな同じ静けさの器に注がれてゆく）',
            '（罪人の護送の夜が、こんなにも静かでよいものか——よいのだろう。夜は誰の上にも、同じに更ける）',
          ],
        },
        { type: 'effects', effects: { params: { shizukesa: 8 } } },
      ],
    },
    {
      id: 'ev_walk',
      trigger: { type: 'questComplete', quest: 'sq_walk' },
      steps: [
        {
          type: 'narration',
          lines: [
            '（高札場、柳の岸、地蔵の辻、蔵の白壁、月見の州、伏見の舫い——夜の高瀬川を、端から端まで歩いた）',
            '（役目で何十遍も下った川なのに、岸に降りて歩いたのは、今夜が初めてかもしれない）',
          ],
        },
        { type: 'effects', effects: { params: { shizukesa: 5 } } },
      ],
    },
    {
      id: 'ev_tourou',
      trigger: { type: 'questComplete', quest: 'sq_tourou' },
      steps: [
        {
          type: 'narration',
          lines: [
            '（四つ目の火袋に、蛍がおさまった。振り返れば、下ってきた川筋に——蛍いろの灯が、点々と四つ）',
            '（石の灯籠は、舟人のための小さな灯台だ。今夜ともした火は、朝までは保つまい。それでも、今夜この川を下る誰かの目には、届く）',
          ],
        },
        { type: 'effects', effects: { params: { shizukesa: 8 }, learning: ['l_tourou'] } },
      ],
    },
    {
      id: 'ev_errands',
      trigger: { type: 'questComplete', quest: 'sq_errands' },
      steps: [
        {
          type: 'narration',
          lines: [
            '（文を挟み、水を張り、綱を結んだ。どれも、誰に頼まれたのでもない小さな用だ）',
            '（喜助の言う「足りている」が、ほんの少し、手のひらから分かった気がする。銭にならぬ用を足した夜は、妙に懐があたたかい）',
          ],
        },
        { type: 'effects', effects: { params: { shizukesa: 6, toi: 2 } } },
      ],
    },
  ],

  learnings: {
    l_takasebune: {
      id: 'l_takasebune',
      title: '高瀬川と高瀬舟',
      body: '高瀬川は江戸時代のはじめ、豪商・角倉了以が京都の中心と伏見を結ぶために開いた運河。物資を運んだ底の浅い小舟が「高瀬舟」で、川の名は舟に由来する。鷗外の物語は、この舟が罪人の護送にも使われた史実を種にしている。',
      tags: ['歴史', '舞台'],
    },
    l_doshin: {
      id: 'l_doshin',
      title: '同心という役人',
      body: '同心は町奉行所などに属した下級の役人。捕物から護送まで実務いっさいを担った。身分は低く俸禄も薄いが、庶民の暮らしにいちばん近い「現場の役人」だった。庄兵衛が喜助の身の上に自分を重ねられたのは、この距離の近さゆえでもある。',
      tags: ['歴史', '人物'],
    },
    l_ento: {
      id: 'l_ento',
      title: '遠島（島流し）の実際',
      body: '遠島は死罪に次ぐ重い刑で、罪人は伊豆七島や隠岐などへ送られた。ただし島では田畑を耕し、家を持ち、働いて暮らすことができた。「重い罰」でありながら「生き直しの場」でもある——喜助の晴れやかさは、この両義性の上に立っている。',
      tags: ['歴史', '社会'],
    },
    l_hotaru: {
      id: 'l_hotaru',
      title: '川辺の蛍',
      body: '蛍は水のきれいな流れにしか棲めない。幼虫は水中で巻き貝を食べて育ち、初夏の夜に光りながら舞う。光は雄と雌の合図で、熱をほとんど持たない「冷たい光」。夜の川辺の点滅は、江戸の人々にとって夏の訪れの便りだった。',
      tags: ['自然', '暮らし'],
    },
    l_chisoku: {
      id: 'l_chisoku',
      title: '知足——足るを知る',
      body: '「足るを知る者は富む」と老子は言った。持ち物の多さではなく、「これで足りている」と思える心が人を富ませる、という考え方。庄兵衛は喜助より多くを持ちながら満たされず、喜助は二百文で満たされている。物語の芯にある問いのひとつ。',
      tags: ['思想', '問い'],
    },
    l_nihyakumon: {
      id: 'l_nihyakumon',
      title: '二百文の値打ち',
      body: '一文銭二百枚。かけそば十杯ちょっとという程度の、ささやかな銭である。だが「働いて得て、使わずに自分の懐に持っている銭」を、喜助は生まれて初めて持った。銭の値打ちは額面ではなく、その人の来し方が決める。',
      tags: ['暮らし', '銭'],
    },
    l_oborozuki: {
      id: 'l_oborozuki',
      title: '朧月',
      body: '春の夜、水蒸気をふくんだ大気に月がかすんで見えるのが朧月。輪郭のにじんだ柔らかな光は春の季語で、桜の散った後の夜にいちばん似合う。鷗外は物語の幕切れを、この朧夜の川面に置いた。',
      tags: ['自然', '季語'],
    },
    l_tourou: {
      id: 'l_tourou',
      title: '川端の灯籠と常夜灯',
      body: '川べりの石灯籠は、舟人のための小さな灯台だった。高瀬川筋には夜どおし火をともす常夜灯が置かれ、火の入れ替えは岸の町の役目。火袋の灯ひとつで、夜の川は「怖い道」から「帰り道」へ変わる。盆に死者の魂を送る灯籠流しも、川と灯のこうした縁から生まれた習わしである。',
      tags: ['暮らし', '灯'],
    },
    l_yutanajii: {
      id: 'l_yutanajii',
      title: 'ユウタナジイ——安楽死の問い',
      body: '鷗外は付記「附高瀬舟縁起」で、この物語の主題のひとつを「ユウタナジイ」（euthanasia・安楽死）だと明かしている。治る見込みのない苦しみから、死なせて楽にしてやることは許されるか。百年以上を経た今も、医療と法と倫理がせめぎ合う現在進行形の問いである。',
      tags: ['思想', '問い'],
    },
    l_ootoritee: {
      id: 'l_ootoritee',
      title: 'オオトリテエ——権威に任せること',
      body: '腑に落ちぬ問いを、庄兵衛は「お奉行様の判断」に預けて呑み込もうとする。鷗外はこれを「オオトリテエ」（autorité・権威）と呼んだ。自分で考え抜くかわりに上位の判断へ寄りかかる楽さと、その後ろめたさ。これもまた、今日まで続く問いである。',
      tags: ['思想', '問い'],
    },
    l_ogai: {
      id: 'l_ogai',
      title: '森鷗外と『高瀬舟』',
      body: '森鷗外（1862-1922）は軍医として最高位まで勤めながら小説を書いた明治・大正の文豪。『高瀬舟』(1916) は江戸の随筆「翁草」の一挿話をもとに、知足と安楽死というふたつの問いを一艘の舟に乗せた晩年の傑作。「歴史其儘」ではなく「歴史離れ」——史実を種に自由に書く、と鷗外自身が方法を語っている。',
      tags: ['作者', '背景'],
    },
  },

  interactables: [
    // ── 舟の上の喜助（章ごとの語らい） ──
    {
      id: 'talk1',
      position: TALK_SPOT(M1),
      prompt: '舟べりの喜助に声をかける',
      radius: 2.4,
      once: true,
      effects: { dialogue: 'dlg_k1' },
    },
    {
      id: 'talk2',
      position: TALK_SPOT(M2),
      prompt: '喜助が懐の何かに手を当てている——話を聞く',
      radius: 2.4,
      once: true,
      requiresFlag: 'ch2',
      effects: { dialogue: 'dlg_k2' },
    },
    {
      id: 'talk3',
      position: TALK_SPOT(M3),
      prompt: '喜助に、弟のことを尋ねる',
      radius: 2.4,
      once: true,
      requiresFlag: 'ch3',
      effects: { dialogue: 'dlg_k3a' },
    },
    {
      id: 'talk4',
      position: TALK_SPOT(M4),
      prompt: '夜明け前の喜助に、最後の言葉をかける',
      radius: 2.4,
      once: true,
      requiresFlag: 'ch4',
      effects: { dialogue: 'dlg_k4' },
    },

    // ── 船頭（出立の合図）——語らいが済んだ舫いでだけ現れる ──
    {
      id: 'sendo1',
      position: SENDO(M1),
      prompt: '船頭に、出立を告げる',
      radius: 2.2,
      once: true,
      requiresFlag: 'k1_done',
      effects: { flags: ['dep1'], minutes: 5 },
    },
    {
      id: 'sendo2',
      position: SENDO(M2),
      prompt: '船頭に、出立を告げる',
      radius: 2.2,
      once: true,
      requiresFlag: 'k2_done',
      effects: { flags: ['dep2'], minutes: 5 },
    },
    {
      id: 'sendo3',
      position: SENDO(M3),
      prompt: '船頭に、出立を告げる',
      radius: 2.2,
      once: true,
      requiresFlag: 'k3_done',
      effects: { flags: ['dep3'], minutes: 5 },
    },

    // ── 岸辺の点景（静けさ） ──
    {
      id: 'spot_kosatsu',
      position: [KOSATSU[0], KOSATSU[1] + 1.3],
      prompt: '月あかりの高札を読む',
      radius: 1.8,
      once: true,
      effects: { dialogue: 'dlg_kosatsu' },
    },
    {
      id: 'spot_yanagi',
      position: [YANAGI1[0] + 1.3, YANAGI1[1]],
      prompt: '柳の下に立ち、枝ずれの音を聴く',
      radius: 1.8,
      once: true,
      effects: { counters: { quiet_spots: 1 }, params: { shizukesa: 8 }, minutes: 10 },
    },
    {
      id: 'spot_hotaru1',
      position: HOTARU1,
      prompt: '茂みの蛍を、しばらく眺める',
      radius: 2.0,
      once: true,
      effects: { counters: { quiet_spots: 1 }, params: { shizukesa: 8 }, minutes: 15, learning: ['l_hotaru'] },
    },
    {
      id: 'spot_jizo',
      position: [JIZO[0], JIZO[1] + 1.1],
      prompt: '辻の地蔵に手を合わせる',
      radius: 1.8,
      once: true,
      effects: { counters: { quiet_spots: 1 }, params: { shizukesa: 8, toi: 2 }, minutes: 10 },
    },
    {
      id: 'spot_mizuoto',
      position: MIZUOTO,
      prompt: '岸っぷちにしゃがみ、水の音を聴く',
      radius: 1.8,
      once: true,
      effects: { counters: { quiet_spots: 1 }, params: { shizukesa: 8 }, minutes: 10 },
    },
    {
      id: 'spot_tsukimi',
      position: TSUKIMI,
      prompt: '州に立って、朧月を仰ぐ',
      radius: 2.0,
      once: true,
      effects: { dialogue: 'dlg_tsukimi' },
    },
    {
      id: 'spot_hotaru2',
      position: HOTARU2,
      prompt: '乱れ舞う蛍の中に立つ',
      radius: 2.2,
      once: true,
      effects: { counters: { quiet_spots: 1 }, params: { shizukesa: 8 }, minutes: 15 },
    },
    {
      id: 'spot_te',
      position: TE_HITASU,
      prompt: '流れに手を浸す——春の水はまだ冷たい',
      radius: 1.8,
      once: true,
      effects: { counters: { quiet_spots: 1 }, params: { shizukesa: 6 }, minutes: 5 },
    },
    {
      id: 'spot_kui',
      position: [KUI[0] - 1.1, KUI[1]],
      prompt: '舫い杭の綱に手を置く',
      radius: 1.6,
      once: true,
      effects: { counters: { quiet_spots: 1 }, params: { shizukesa: 5 }, minutes: 5 },
    },
    {
      id: 'spot_akatsuki',
      position: AKATSUKI,
      prompt: '東の空に、暁の気配を待つ',
      radius: 2.0,
      once: true,
      effects: { dialogue: 'dlg_akatsuki' },
    },

    // ── 蛍の茂み（掬える資源。掬ってもしばらくすれば茂みに戻る） ──
    {
      id: 'catch1',
      position: [HOTARU1[0] - 1.8, HOTARU1[1] + 1],
      prompt: '茂みの蛍を、掌でそっと掬う',
      radius: 1.8,
      cooldownHours: 0.5,
      effects: { items: { hotaru: 1 }, minutes: 10 },
    },
    {
      id: 'catch2',
      position: [HOTARU_M2[0] + 1.2, HOTARU_M2[1]],
      prompt: '柳かげの蛍を、掌でそっと掬う',
      radius: 1.8,
      cooldownHours: 0.5,
      effects: { items: { hotaru: 1 }, minutes: 10 },
    },
    {
      id: 'catch3',
      position: [HOTARU2[0] + 1.5, HOTARU2[1] + 1],
      prompt: '乱舞の端の蛍を、掌でそっと掬う',
      radius: 1.8,
      cooldownHours: 0.5,
      effects: { items: { hotaru: 1 }, minutes: 10 },
    },
    {
      id: 'catch4',
      position: [HOTARU_M4[0] + 1.5, HOTARU_M4[1]],
      prompt: '岸の草むらの蛍を、掌でそっと掬う',
      radius: 1.8,
      cooldownHours: 0.5,
      effects: { items: { hotaru: 1 }, minutes: 10 },
    },

    // ── 火の消えた灯籠（蛍を持っているときだけ「灯せる」が現れる） ──
    {
      id: 'light_tourou1',
      position: [KIETOURO1[0] + 1.3, KIETOURO1[1]],
      prompt: '消えた灯籠の火袋に、蛍を放す',
      radius: 1.6,
      once: true,
      requiresItems: { hotaru: 1 },
      effects: {
        items: { hotaru: -1 },
        flags: ['lit1'],
        counters: { lanterns_lit: 1 },
        params: { shizukesa: 6 },
        minutes: 5,
      },
    },
    {
      id: 'light_tourou2',
      position: [KIETOURO2[0] + 1.3, KIETOURO2[1]],
      prompt: '対のかたわれの火袋に、蛍を放す',
      radius: 1.6,
      once: true,
      requiresItems: { hotaru: 1 },
      effects: {
        items: { hotaru: -1 },
        flags: ['lit2'],
        counters: { lanterns_lit: 1 },
        params: { shizukesa: 6 },
        minutes: 5,
      },
    },
    {
      id: 'light_tourou3',
      position: [KIETOURO3[0] + 1.3, KIETOURO3[1]],
      prompt: '消えた灯籠の火袋に、蛍を放す',
      radius: 1.6,
      once: true,
      requiresItems: { hotaru: 1 },
      effects: {
        items: { hotaru: -1 },
        flags: ['lit3'],
        counters: { lanterns_lit: 1 },
        params: { shizukesa: 6 },
        minutes: 5,
      },
    },
    {
      id: 'light_tourou4',
      position: [KIETOURO4[0] + 1.3, KIETOURO4[1]],
      prompt: '消えた灯籠の火袋に、蛍を放す',
      radius: 1.6,
      once: true,
      requiresItems: { hotaru: 1 },
      effects: {
        items: { hotaru: -1 },
        flags: ['lit4'],
        counters: { lanterns_lit: 1 },
        params: { shizukesa: 6 },
        minutes: 5,
      },
    },

    // ── 掌の蛍を喜助に（弟の告白のあと、蛍を持って舟に戻ると） ──
    {
      id: 'give_hotaru',
      position: [0.9, M3 - 1.8],
      prompt: '掌の蛍を、喜助に見せてやる',
      radius: 1.4,
      once: true,
      requiresFlag: 'k3_done',
      requiresItems: { hotaru: 1 },
      effects: { dialogue: 'dlg_hotaru_kisuke' },
    },

    // ── 岸の小さな用（誰の役目でもない頼まれごと） ──
    {
      id: 'err_mayoibumi',
      position: [KOSATSU[0] + 1.7, KOSATSU[1] - 1],
      prompt: '高札の根本の、白い紙を拾う',
      radius: 1.6,
      once: true,
      effects: { dialogue: 'dlg_mayoibumi' },
    },
    {
      id: 'kumi_mizu',
      position: [-5.0, M2 - 5],
      prompt: '岸っぷちの柄杓で、川の水を汲む',
      radius: 1.5,
      once: true,
      effects: { items: { mizu: 1 }, minutes: 5 },
    },
    {
      id: 'err_jizo_mizu',
      position: [JIZO[0] - 1.4, JIZO[1] - 0.2],
      prompt: '地蔵の乾いた椀に、水をそそぐ',
      radius: 1.5,
      once: true,
      requiresItems: { mizu: 1 },
      effects: { dialogue: 'dlg_jizo_mizu' },
    },
    {
      id: 'err_kui',
      position: [KUI[0], KUI[1] + 1.5],
      prompt: '緩んだ舫い綱を、結び直す',
      radius: 1.5,
      once: true,
      effects: { dialogue: 'dlg_kui_rope' },
    },
  ],

  landmarks: [
    { id: 'lm_sanjo', label: '三条の舫い', position: [-8, M1], radius: 5 },
    { id: 'lm_yanagi', label: '柳の岸', position: [YANAGI1[0] + 1, YANAGI1[1]], radius: 4 },
    { id: 'lm_jizo', label: '地蔵の辻', position: [JIZO[0], JIZO[1] + 1], radius: 4 },
    { id: 'lm_kura', label: '蔵の白壁', position: [-8, M2 + 7], radius: 5 },
    { id: 'lm_tsukimi', label: '月見の州', position: [TSUKIMI[0], TSUKIMI[1] - 1], radius: 4 },
    { id: 'lm_fushimi', label: '伏見の舫い', position: [-8, M4], radius: 5 },
  ],

  mapBounds: [-16, -78, 16, 78],
};
