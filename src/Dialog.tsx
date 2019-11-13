import * as React from "react";
import * as ReactDOM from "react-dom";
import { FC } from "react";

export type DialogProps = {
  isShow: boolean;
  message?: string;
  okText?: string;
  onOk: () => void;
  onCancel?: () => void;
};

//シンプルなダイアログ用コンポーネント
export const Dialog: FC<DialogProps> = props => {
  return ReactDOM.createPortal(
    <>
      {props.isShow && (
        <>
          <section className={"overLay"} />
          <div
            style={{
              width: "300",
              height: "200",
              backgroundColor: "gray"
            }}
          >
            <h1>消去しますか?</h1>
            <input
              type={"button"}
              value={props.okText || "OK"}
              onClick={props.onOk}
            />
            <input
              type={"button"}
              value={"キャンセル"}
              onClick={props.onCancel}
            />
          </div>
        </>
      )}
    </>,
    document.body
  );
};
