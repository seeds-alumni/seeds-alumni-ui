import type { ReactNode } from 'react';
export type FieldProps = {
    label: ReactNode;
    /** 任意の項目（ラベルに「（任意）」を付ける。必須の項目は入力欄に required を付ける） */
    optional?: boolean;
    /** 入力欄の下の補足 */
    hint?: ReactNode;
    /** 入力の誤り（項目の直後に赤で出す） */
    error?: ReactNode;
    /**
     * 入力欄が1つなら label で包む（既定）。入力欄が複数ある・検索の候補を出すなど、
     * label で包めないときは as="div"（.form-field）にして、入力欄に aria-label を付ける
     */
    as?: 'label' | 'div';
    children: ReactNode;
};
/** フォームの1項目：ラベル → 入力欄 → 補足・誤り（.form の中に縦に並べる） */
export declare function Field({ label, optional, hint, error, as, children }: FieldProps): import("react").JSX.Element;
