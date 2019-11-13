import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { render } from "react-dom";
import { PathDrawer } from "./PathDrawer";
import { StrokeDrawer } from "./StrokeDrawer";
import { GroupDrawer, Group } from "./GroupDrawer";
import { Points, getPoint } from "./Point";
import { Dialog } from "./Dialog";
import "./styles.css";

export type drawPoint = {
  x: number;
  y: number;
};

export type Stroke = {
  id: string;
  points: drawPoint[];
  isSelected: boolean;
};

export type Size = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export type PointerEvents = "none" | "auto";

export type EditorMode = "draw" | "edit";

function App() {
  //エディタの編集モード
  const [editorMode, setEditorMode] = useState<EditorMode>("draw");
  //リアルタイムで描画する座標
  const [points, setPoints] = useState<drawPoint[]>([]);
  //通常のストローク
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  //グループ化した要素たち
  const [groups, setGroups] = useState<Group[]>([]);
  //ドラッグ中のboolean
  const [isDragging, setIsDragging] = useState<boolean>(false);
  //要素のpointer-events
  const [events, setEvents] = useState<PointerEvents>("none");
  //モーダルの表示
  const [isOpen, setIsOpen] = useState<boolean>(false);
  //キャンバスのref
  const canvasRef = useRef<SVGSVGElement>(null);
  //BB判定用Rectのref
  const inRectRef = useRef<SVGRectElement>(null);
  //BBの寸法
  const [inRectSize, setInrectSize] = useState<Size>({
    left: 0,
    top: 0,
    width: 0,
    height: 0
  });
  //BBで選択対象になった要素のidのリスト
  const [selectedElms, setSelectedElms] = useState<string[]>([]);

  const handleDown = (event: React.PointerEvent<SVGSVGElement>) => {
    setIsDragging(true);
    if (editorMode === "draw") {
      const now = getPoint(event.pageX, event.pageY, canvasRef.current);

      const newPoint: drawPoint = {
        x: Math.floor(now.x),
        y: Math.floor(now.y)
      };

      setPoints([...points, newPoint]);
    } else {
      //編集モードのときはBBやパスの操作ということにする
      handleBBDown(event);
    }
  };

  const handleBBDown = (event: React.PointerEvent<SVGSVGElement>) => {
    const now = getPoint(event.pageX, event.pageY, canvasRef.current);
    setInrectSize({
      left: Math.floor(now.x),
      top: Math.floor(now.y),
      width: 0,
      height: 0
    });

    // const target = event.target as SVGElement;
    // if (target.id === "mainCavas") {
    //   //BBを新規作成
    //   const now = getPoint(event.pageX, event.pageY, canvasRef.current);
    //   setInrectSize({
    //     left: Math.floor(now.x),
    //     top: Math.floor(now.y),
    //     width: 0,
    //     height: 0
    //   });
    // } else {
    // }
  };

  const handleMove = (event: React.PointerEvent<SVGSVGElement>) => {
    //if (isDragging.current) {
    if (isDragging) {
      if (editorMode === "draw") {
        const now = getPoint(event.pageX, event.pageY, canvasRef.current);
        const newPoint: drawPoint = {
          x: Math.floor(now.x),
          y: Math.floor(now.y)
        };
        setPoints([...points, newPoint]);
      } else {
        handleBBMove(event);
      }
    }
  };

  const handleBBMove = (event: React.PointerEvent<SVGSVGElement>) => {
    const target = event.target as SVGElement;
    const now = getPoint(event.pageX, event.pageY, canvasRef.current);
    // if (target.id === "mainCavas") {

    // } else {}
    //BBのサイズ調整
    if (
      Math.floor(now.x) > inRectSize.left &&
      Math.floor(now.y) > inRectSize.top
    ) {
      setInrectSize({
        left: inRectSize.left,
        top: inRectSize.top,
        width: Math.floor(now.x) - inRectSize.left,
        height: Math.floor(now.y) - inRectSize.top
      });
      updateInterSeciton();
    }
  };

  const handleUp = (event: React.PointerEvent<SVGSVGElement>) => {
    setIsDragging(false);
    if (editorMode === "draw") {
      const newStroke: Stroke = {
        id: `${Math.floor(event.pageX)}-${Math.floor(event.pageY)}`,
        points: points
      };

      setStrokes([...strokes, newStroke]);

      //pointsはリセットする
      setPoints([]);
    } else {
      handleBBUp(event);
    }
  };

  const handleBBUp = (event: React.PointerEvent<SVGSVGElement>) => {
    //
    updateInterSeciton();
  };

  //元に戻す
  const handleUndo = event => {
    const newStrokes = strokes.filter((stroke, index) => {
      return index !== strokes.length - 1;
    });
    setStrokes(newStrokes);
  };

  //全部消去
  const handleAllClear = () => {
    setStrokes([]);
    setIsOpen(false);
  };

  //編集モード切り替え
  const switchEditorMode = event => {
    if (editorMode === "draw") {
      setEditorMode("edit");
      setEvents("auto");
    } else {
      setEditorMode("draw");
      setEvents("none");
    }
  };

  //BBがリサイズされたときに送られる
  const updateInterSeciton = () => {
    const list = Array.from(
      canvasRef.current.getIntersectionList(inRectRef.current.getBBox(), null)
    );
    //選択されたPathのIDを配列に入れていく
    setSelectedElms(
      list.reduce((prev, curr, index) => {
        prev.push(curr.id);
        return prev;
      }, [])
    );
    //StrokeのisSelected要素を入れ替えていく
    setStrokes(
      strokes.reduce((prev, curr, index) => {
        if (selectedElms.includes(curr.id)) {
          curr.isSelected = true;
        } else {
          curr.isSelected = false;
        }
        prev.push(curr);
        return prev;
      }, [])
    );
  };

  //リンクの追加
  const handleAddLink = event => {
    if (selectedElms) {
      //新しいGroupを作成し、そこに追加する
      const selectedStrokes = strokes.reduce((prev, curr) => {
        if (selectedElms.includes(curr.id)) {
          curr.isSelected = false;
          prev.push(curr);
        }
        return prev;
      }, []);
      const newGroup: Group = {
        id: `${Date.now()}`,
        href: "https://github.com/Hykwtakumin/HyperIllustServer",
        strokes: selectedStrokes,
        transform: ""
      };
      setGroups([...groups, newGroup]);
      //selectedにある要素をstrokesから削除する
      setStrokes(
        strokes.reduce((prev, curr) => {
          if (!selectedElms.includes(curr.id)) {
            prev.push(curr);
          }
          return prev;
        }, [])
      );
      //selectedな要素をクリアーする
      setSelectedElms([]);
    } else {
      console.log("要素が選択されていません");
    }
  };

  return (
    <>
      <div id={"controleSection"}>
        <input type={"button"} value={editorMode} onClick={switchEditorMode} />
        <input type={"button"} value={"元に戻す"} onClick={handleUndo} />
        <input
          type={"button"}
          value={"リセット"}
          onClick={() => {
            setIsOpen(true);
          }}
        />
        <input type={"button"} value={"リンクを追加"} onClick={handleAddLink} />

        <Dialog
          isShow={isOpen}
          onOk={handleAllClear}
          onCancel={() => {
            setIsOpen(false);
          }}
        />
      </div>

      <svg
        ref={canvasRef}
        id={"mainCanvas"}
        onPointerDown={handleDown}
        onPointerMove={handleMove}
        onPointerUp={handleUp}
        onPointerCancel={handleUp}
        width={"800"}
        height={"600"}
        style={{
          border: "solid 1px black",
          touchAction: "none"
        }}
      >
        <PathDrawer points={points} />
        <StrokeDrawer strokes={strokes} events={events} />
        <GroupDrawer groups={groups} events={events} />
        <rect
          display={editorMode === "draw" ? "none" : ""}
          ref={inRectRef}
          x={inRectSize.left}
          y={inRectSize.top}
          width={inRectSize.width}
          height={inRectSize.height}
          stroke="none"
          fill="#01bc8c"
          fillOpacity="0.25"
          pointerEvents={events}
        />
      </svg>
    </>
  );
}

const rootElement = document.getElementById("root");
render(<App />, rootElement);
