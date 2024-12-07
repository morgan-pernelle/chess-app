import "./Chessboard.css";
import Tile from "../Tile/Tile";
import React, { useMemo, useRef, useState } from "react";
import Referee from "../../referee/Referee";
import { Piece } from "../../chessboard";
import initialBoardState from "../../initialBoardState";

const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];
const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];

const Chessboard = () => {
  const [gridX, setGridX] = useState(0);
  const [gridY, setGridY] = useState(0);
  const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
  const [pieces, setPieces] = useState<Piece[]>(initialBoardState);
  const chessboardRef = useRef<HTMLDivElement>(null);
  const referee = useMemo(() => new Referee(), []);

  function grabPiece(e: React.MouseEvent) {
    const element = e.target as HTMLElement;
    const chessboard = chessboardRef.current;

    if (element.classList.contains("chess-piece") && chessboard) {
      setGridX(Math.floor((e.clientX - chessboard.offsetLeft) / 100));
      setGridY(
        Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / 100)),
      );

      const x = e.clientX - 50;
      const y = e.clientY - 50;

      element.style.position = "absolute";
      element.style.left = `${x}px`;
      element.style.top = `${y}px`;

      setActivePiece(element);
    }
  }

  function movePiece(e: React.MouseEvent) {
    const chessboard = chessboardRef.current;
    if (activePiece && chessboard) {
      const minX = chessboard.offsetLeft - 25;
      const minY = chessboard.offsetTop - 25;
      const maxX = chessboard.offsetLeft + chessboard.offsetWidth - 75;
      const maxY = chessboard.offsetTop + chessboard.offsetHeight - 75;
      const x = e.clientX - 50;
      const y = e.clientY - 50;

      activePiece.style.position = "absolute";

      activePiece.style.left = x < minX ? `${minX}px` : `${x}px`;
      activePiece.style.top = y < minY ? `${minY}px` : `${y}px`;
      activePiece.style.left = x > maxX ? `${maxX}px` : activePiece.style.left;
      activePiece.style.top = y > maxY ? `${maxY}px` : activePiece.style.top;
    }
  }

  function dropPiece(e: React.MouseEvent) {
    const chessboard = chessboardRef.current;
    if (activePiece && chessboard) {
      const x = Math.floor((e.clientX - chessboard.offsetLeft) / 100);
      const y = Math.abs(
        Math.ceil((e.clientY - chessboard.offsetTop - 800) / 100),
      );

      setPieces((value) => {
        const pieces = value.map((p) => {
          if (p.x === gridX && p.y === gridY) {
            const validMove = referee.isValidMove(
              gridX,
              gridY,
              x,
              y,
              p.type,
              p.team,
              value,
            );

            if (validMove) {
              p.x = x;
              p.y = y;
            } else {
              activePiece.style.position = "relative";
              activePiece.style.removeProperty("top");
              activePiece.style.removeProperty("left");
            }
          }
          return p;
        });
        return pieces;
      });
      setActivePiece(null);
    }
  }

  const board = useMemo(() => {
    const board = [];

    for (let j = verticalAxis.length - 1; j >= 0; j--) {
      for (let i = 0; i < horizontalAxis.length; i++) {
        const number = j + i + 2;
        let image = undefined;

        pieces.forEach((p) => {
          if (p.x === i && p.y === j) {
            image = p.image;
          }
        });

        board.push(<Tile key={`${j},${i}`} image={image} number={number} />);
      }
    }
    return board;
  }, [pieces]);

  return (
    <div
      id="chessboard"
      ref={chessboardRef}
      onMouseDown={(e) => grabPiece(e)}
      onMouseMove={(e) => movePiece(e)}
      onMouseUp={(e) => dropPiece(e)}
    >
      {board}
    </div>
  );
};

export default Chessboard;
