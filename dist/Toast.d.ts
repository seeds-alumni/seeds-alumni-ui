/**
 * 画面の下に一時的に出す短い知らせ（docs/catalog.md §8.5）。保存・送信などの結果を伝える。
 * 画面の枠が <ToastHost /> を1つ置き（<AppShell>・<ConsoleShell> は自動で置く）、各画面は toast() を呼ぶ。
 *   toast('保存しました。');
 *   toast('保存できませんでした。時間をおいてもう一度お試しください。', { kind: 'ng' });
 * 成功・お知らせ（kind なし・'ok'）は5秒で消える。失敗（'ng'）は読み終えるまで残し、× で閉じる。
 * 入力の誤りの詳しい内容は toast ではなく、項目の直後（<Field error>）や .message-box に書く
 */
export type ToastOptions = {
    kind?: 'ok' | 'ng'; /** 消えるまでの時間（ミリ秒）。失敗は既定で消えない */
    duration?: number;
};
export declare function toast(message: string, options?: ToastOptions): void;
export declare function ToastHost(): import("react").JSX.Element;
