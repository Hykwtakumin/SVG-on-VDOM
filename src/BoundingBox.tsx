import * as React from "react";
import * as ReactDOM from "react-dom";
import { FC, useState } from "react";
import { EditorMode } from "./index";
import { getPoint } from "./Point";

export type Size = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export type OffSet = {
  x: number;
  y: number;
};

export type BoundingBoxProps = {
  mode: EditorMode;
  bbSize?: Size;
  onResized?: (rect: Size) => void;
  onAddLink?: (size: Size, href: string) => void;
};

//パスをグループ化したりリンクをつけたりTransFromしたりするコンポーネント
//イベントハンドラが被るのでMainCavans上には描画しない
//ドラッグでBBのサイズを変更
//BBをドラッグすると移動できる
//直接リンクを貼ることができる
//変形ボタンを押すと変形ができるようになる?
export const BoundingBox: FC<BoundingBoxProps> = props => {
  //BBの寸法
  const [bbSize, setBBSize] = useState<Size>(
    props.bbSize || { left: 0, top: 0, width: 0, height: 0 }
  );
  //BBをクリックしたときのオフセット
  const [offSet, SetOffset] = useState<OffSet>({ x: 0, y: 0 });

  //BBレイヤーのref
  const bbRef = React.useRef(null);
  //BB自体のref
  const rectRef = React.useRef(null);

  //ドラッグ中判定
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleDown = (event: React.PointerEvent<SVGSVGElement>) => {
    if (event.target && event.target.id) {
      //さらに分岐していく
      console.log("this is DOM");
      const DOM = event.target as SVGElement;
    } else {
      const now = getPoint(event.pageX, event.pageY, bbRef.current);
      setBBSize({
        left: Math.floor(now.x),
        top: Math.floor(now.y),
        width: 0,
        height: 0
      });
      setIsDragging(true);
    }
  };

  const handleMove = (event: React.PointerEvent<SVGSVGElement>) => {
    if (event.target && event.target.hasOwnProperty("id")) {
      //さらに分岐していく
    } else if (isDragging) {
      const now = getPoint(event.pageX, event.pageY, bbRef.current);
      //BBを作る
      //座標がネガティブになったときの処理も実装する

      // const nowWidth =
      //   Math.floor(now.x) - parseInt(rectRef.current.getAttribute("x"));
      // const nowHeight =
      //   Math.floor(now.y) - parseInt(rectRef.current.getAttribute("y"));

      // let fixedLeft, fixedTop, fixedWidth, fixedHeight;

      // if (Math.floor(now.x) < bbSize.left && Math.floor(now.y) < bbSize.top) {
      //   //縦横どちらもマイナスの時
      //   fixedLeft = Math.floor(now.x);
      //   fixedTop = Math.floor(now.y);
      //   fixedWidth = bbSize.left;
      //   fixedHeight = bbSize.top;
      // } else if (Math.floor(now.x) < bbSize.left) {
      //   //横がマイナスの時
      //   fixedLeft = Math.floor(now.x);
      //   fixedTop = bbSize.top;
      //   fixedWidth = bbSize.left;
      //   fixedHeight = Math.floor(now.y);
      // } else if (Math.floor(now.y) < bbSize.top) {
      //   //縦がマイナスの時
      //   fixedLeft = bbSize.left;
      //   fixedTop = Math.floor(now.y);
      //   fixedWidth = Math.floor(now.x);
      //   fixedHeight = bbSize.top;
      // } else {
      //   //普通のとき
      //   fixedLeft = bbSize.left;
      //   fixedTop = bbSize.top;
      //   fixedWidth = Math.floor(now.x) - bbSize.left;
      //   fixedHeight = Math.floor(now.y) - bbSize.top;
      // }

      // setBBSize({
      //   left: fixedLeft,
      //   top: fixedTop,
      //   width: fixedWidth,
      //   height: fixedHeight
      // });

      if (Math.floor(now.x) > bbSize.left && Math.floor(now.y) > bbSize.top) {
        setBBSize({
          left: bbSize.left,
          top: bbSize.top,
          width: Math.floor(now.x) - bbSize.left,
          height: Math.floor(now.y) - bbSize.top
        });
        //メインキャンバスに伝達する
        props.onResized(bbSize);
      }
      // //メインキャンバスに伝達する
      // props.onResized(bbSize);
    }
  };

  const handleUp = (event: React.PointerEvent<SVGSVGElement>) => {
    props.onResized(bbSize);
    setIsDragging(false);
  };

  return ReactDOM.createPortal(
    <>
      {props.mode === "edit" && (
        <>
          <svg
            ref={bbRef}
            onPointerDown={handleDown}
            onPointerMove={handleMove}
            onPointerUp={handleUp}
            onPointerCancel={handleUp}
            width={"800"}
            height={"600"}
            style={{
              position: "absolute",
              touchAction: "none"
            }}
          >
            <rect
              ref={rectRef}
              style={{
                cursor: "all-scroll"
              }}
              fill="#01bc8c"
              fillOpacity="0.25"
              id={"bbRect"}
              x={bbSize.left}
              y={bbSize.top}
              width={bbSize.width}
              height={bbSize.height}
            />
          </svg>
        </>
      )}
    </>,
    document.getElementById("root")
  );
};
