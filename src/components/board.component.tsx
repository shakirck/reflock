import {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import usePan from "../hooks/usePan";
import useScale from "../hooks/useScale";
import img from "../assets/img.jpg";
import img2 from "../assets/img2.svg";
import { open, save } from "@tauri-apps/api/dialog";

import "../styles.css";
import { listen } from "@tauri-apps/api/event";
const Board = (props: any) => {
  const [colors, setColors] = useState([
    "#FF6138",
    "#FFBE53",
    "#2980B9",
    "#282741",
  ]);

  const [buffer, setBuffer] = useState({ x: 0, y: 0 });
  const [offset, startPan] = usePan();
  const ref = useRef<HTMLDivElement | null>(null);
  const scale = useScale(ref);
  // const handler = async () => {
  //   let filepath = await open();
  //   console.log(filepath);
  // };
  useLayoutEffect(() => {
    const height = ref.current?.clientHeight ?? 0;
    const width = ref.current?.clientWidth ?? 0;

    // This is the application of the above formula!
    // console.log(width, height);

    setBuffer({
      x: (width - width / scale) / 2,
      y: (height - height / scale) / 2,
    });
  }, [scale, setBuffer]);

  useEffect(() => {
    listen("tauri://file-drop-hover", (e) => {
      console.log("hover", e);
    });
    listen("tauri://file-drop", (e) => {
      console.log("drop", e);
      // if (!e.payload) return;
      const files = e.payload as string[];
      if (files.length === 0) return;
    });

    listen("tauri://file-drop-cancelled", (e) => {
      console.log("cancelled", e);
    });
    listen("tauri://resize", (e) => {
      console.log("resize", e);
    });
  }, []);
  return (
    <div
      ref={ref}
      onMouseDown={startPan}
      style={{ position: "relative" }}
      className="board__container"
      onDragStart={(e) => e.preventDefault()}
      onDrop={(e) => console.log(e)}
    >
      <div
        className="board"
        style={{
          // backgroundImage: "url(src/assets/grid.svg)",
          // backgroundImage: "url(/grid.svg)",
          transform: `scale(${scale})`,
          backgroundPosition: `${-offset.x}px ${-offset.y}px`,
          position: "absolute",
          bottom: buffer.y,
          left: buffer.x,
          right: buffer.x,
          top: buffer.y,
        }}
      >
        <p>{scale}</p>
      </div>
      <div
        style={{
          transform: `scale(${scale}) translate(${-offset.x}px,${-offset.y}px)`,
          zIndex: 1,
        }}
      >
        <img src={img2} draggable={false} className="unselectable" alt="" />
      </div>
    </div>
  );
};
export default Board;
