import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { render } from "react-dom";
import { PathDrawer } from "./PathDrawer";
import { StrokeDrawer } from "./StrokeDrawer";
import { GroupDrawer, Group } from "./GroupDrawer";
import { Points, getPoint } from "./Point";
import { BoundingBox, Size } from "./BoundingBox";
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
  //BBで選択対象になった要素のidのリスト
  const [selectedElms, setSelectedElms] = useState<string[]>([]);

  //stateではなく一時変数で管理する場合はRefを利用すると常に最新値にアクセスできる
  //const isDragging = useRef<boolean>(false);

  const handleDown = (event: React.PointerEvent<SVGSVGElement>) => {
    //isDragging.current = true;

    if (editorMode === "draw") {
      setIsDragging(true);

      const now = getPoint(event.pageX, event.pageY, canvasRef.current);

      const newPoint: drawPoint = {
        x: Math.floor(now.x),
        y: Math.floor(now.y)
      };

      setPoints([...points, newPoint]);
    }
  };

  const handleMove = (event: React.PointerEvent<SVGSVGElement>) => {
    //if (isDragging.current) {
    if (editorMode === "draw") {
      if (isDragging) {
        const now = getPoint(event.pageX, event.pageY, canvasRef.current);
        const newPoint: drawPoint = {
          x: Math.floor(now.x),
          y: Math.floor(now.y)
        };
        setPoints([...points, newPoint]);
      }
    }
  };

  const handleUp = (event: React.PointerEvent<SVGSVGElement>) => {
    //isDragging.current = false;
    if (editorMode === "draw") {
      setIsDragging(false);
      const newStroke: Stroke = {
        id: `${Math.floor(event.pageX)}-${Math.floor(event.pageY)}`,
        points: points
      };

      setStrokes([...strokes, newStroke]);

      //pointsはリセットする
      setPoints([]);
    }
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
  const handleBBResized = (size: Size) => {
    inRectRef.current.setAttribute("x", `${size.left}`);
    inRectRef.current.setAttribute("y", `${size.top}`);
    inRectRef.current.setAttribute("width", `${size.width}`);
    inRectRef.current.setAttribute("height", `${size.height}`);
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

        <BoundingBox mode={editorMode} onResized={handleBBResized} />

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
          touchAction: "none",
          position: "absolute"
        }}
      >
        <PathDrawer points={points} />
        <StrokeDrawer strokes={strokes} events={events} />
        <GroupDrawer groups={groups} events={events} />
        <rect
          ref={inRectRef}
          stroke="none"
          fill="rgba(0,0,0,0)"
          pointerEvents={"none"}
        />
      </svg>
    </>
  );
}

const rootElement = document.getElementById("root");
render(<App />, rootElement);
