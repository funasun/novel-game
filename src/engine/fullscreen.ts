// Layer 1: 全画面表示のヘルパー。スマホでブラウザのURLバー等を隠して没入させる。
// iPhone の Safari は「要素の全画面API」を持たないため、対応可否は必ず
// feature detection で判定する（UA 名で決め打ちしない）。真の全画面が要素APIで
// 取れない端末（iPhone）では、ホーム画面に追加した PWA として起動してもらう。

type FsElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void;
};
type FsDocument = Document & {
  webkitFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void> | void;
};

const docEl = () => document.documentElement as FsElement;

// 要素の全画面APIが使えるか（iPhone Safari では false）。
export function fullscreenSupported(): boolean {
  const el = docEl();
  return !!(el.requestFullscreen || el.webkitRequestFullscreen);
}

// いま全画面か。
export function isFullscreen(): boolean {
  const d = document as FsDocument;
  return !!(d.fullscreenElement || d.webkitFullscreenElement);
}

// インストール済み（ホーム画面から起動した）PWA として動いているか。
export function isStandalone(): boolean {
  const nav = navigator as Navigator & { standalone?: boolean };
  return (
    nav.standalone === true ||
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches
  );
}

// iOS（iPhone/iPad）か。iPadOS 13+ は Mac を名乗るのでタッチ数で補正。
// 用途は「ホーム画面に追加」案内の出し分けのみ（全画面の可否は feature detection で判定する）。
export function isIOS(): boolean {
  const ua = navigator.userAgent;
  return /iPhone|iPad|iPod/.test(ua) || (navigator.maxTouchPoints > 1 && /Macintosh/.test(ua));
}

// タッチ端末か（=スマホ/タブレット）。デスクトップを不意に全画面化しないための判定。
export function isTouchDevice(): boolean {
  return window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0;
}

// 全画面へ。成功したら、横向きにロックできる端末はロックする（Android/PWA）。
export async function requestAppFullscreen(): Promise<void> {
  const el = docEl();
  try {
    if (el.requestFullscreen) await el.requestFullscreen();
    else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
    else return; // iPhone 等：要素の全画面は非対応
  } catch {
    return; // ユーザー操作外・権限なし等は黙って諦める
  }
  // Android/Chrome は全画面中のみ orientation.lock が効く。横向きに固定して没入させる。
  const orientation = screen.orientation as
    | (ScreenOrientation & { lock?: (o: string) => Promise<void> })
    | undefined;
  orientation?.lock?.('landscape').catch(() => {});
}

export async function exitAppFullscreen(): Promise<void> {
  const d = document as FsDocument;
  try {
    if (d.exitFullscreen) await d.exitFullscreen();
    else if (d.webkitExitFullscreen) await d.webkitExitFullscreen();
  } catch {
    /* noop */
  }
}

export async function toggleAppFullscreen(): Promise<void> {
  if (isFullscreen()) await exitAppFullscreen();
  else await requestAppFullscreen();
}

// 全画面状態の変化を購読（標準 + webkit）。解除ボタンの表示切替に使う。
export function onFullscreenChange(cb: () => void): () => void {
  document.addEventListener('fullscreenchange', cb);
  document.addEventListener('webkitfullscreenchange', cb);
  return () => {
    document.removeEventListener('fullscreenchange', cb);
    document.removeEventListener('webkitfullscreenchange', cb);
  };
}
