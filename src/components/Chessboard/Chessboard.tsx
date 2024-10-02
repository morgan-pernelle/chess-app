import "./Chessboard.css";
import Tile from "../Tile/Tile";
import React, { useRef, useState } from "react";
import Referee from "../../referee/Referee";

const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];
const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];

interface Piece {
	image: string;
	x: number;
	y: number;
	type: PieceType;
	team: TeamType;
}

export enum TeamType {
	OPPONENT = "Opponent",
	OUR = "Our",
}

export enum PieceType {
	PAWN = "Pawn",
	KNIGHT = "Knight",
	BISHOP = "Bishop",
	ROOK = "Rook",
	QUEEN = "Queen",
	KING = "King",
}

const initialBoardState: Piece[] = [];

for (let p = 0; p < 2; p++) {
	const teamType = (p === 0 ? TeamType.OUR : TeamType.OPPONENT);
	const type = (teamType === TeamType.OUR ? "w" : "b");
	const y = (teamType === TeamType.OUR) ? 0 : 7;

	initialBoardState.push({image:`assets/images/rook_${type}.png`, x: 0, y, type: PieceType.ROOK, team: teamType});
	initialBoardState.push({image:`assets/images/rook_${type}.png`, x: 7, y, type: PieceType.ROOK, team: teamType});
	initialBoardState.push({image:`assets/images/knight_${type}.png`, x: 1, y, type: PieceType.KNIGHT, team: teamType});
	initialBoardState.push({image:`assets/images/knight_${type}.png`, x: 6, y, type: PieceType.KNIGHT, team: teamType});
	initialBoardState.push({image:`assets/images/bishop_${type}.png`, x: 2, y, type: PieceType.BISHOP, team: teamType});
	initialBoardState.push({image:`assets/images/bishop_${type}.png`, x: 5, y, type: PieceType.BISHOP, team: teamType});
	initialBoardState.push({image:`assets/images/queen_${type}.png`, x: 3, y, type: PieceType.QUEEN, team: teamType});
	initialBoardState.push({image:`assets/images/king_${type}.png`, x: 4, y, type: PieceType.KING, team: teamType});
}

for (let i = 0; i < 8; i++) {
	initialBoardState.push({image:"assets/images/pawn_b.png", x: i, y: 6, type: PieceType.PAWN, team: TeamType.OPPONENT});
}

for (let i = 0; i < 8; i++) {
	initialBoardState.push({image:"assets/images/pawn_w.png", x: i, y: 1, type: PieceType.PAWN, team: TeamType.OUR});
}

export default function Chessboard() {
	const [gridX, setGridX] = useState(0);
	const [gridY, setGridY] = useState(0);
	const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
	const [pieces, setPieces] = useState<Piece[]>(initialBoardState);
	const chessboardRef = useRef<HTMLDivElement>(null);
	const referee = new Referee();

	function grabPiece(e: React.MouseEvent) {
		const element = e.target as HTMLElement;
		const chessboard = chessboardRef.current;

		if (element.classList.contains("chess-piece") && chessboard) {
			setGridX(Math.floor((e.clientX - chessboard.offsetLeft) / 100));
			setGridY(Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / 100)));

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

			activePiece.style.left = (x < minX) ? `${minX}px` : `${x}px`;
			activePiece.style.top = (y < minY) ? `${minY}px` : `${y}px`;
			activePiece.style.left = (x > maxX) ? `${maxX}px` : activePiece.style.left;
			activePiece.style.top = (y > maxY) ? `${maxY}px` : activePiece.style.top;
		}
	}

	function dropPiece(e: React.MouseEvent) {
		const chessboard = chessboardRef.current;
		if (activePiece && chessboard) {
			const x = Math.floor((e.clientX - chessboard.offsetLeft) / 100);
			const y = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 800) / 100));

			// UPDATES THE PIECE POSITION
			setPieces(value => {
				const pieces = value.map(p => {
					if (p.x === gridX && p.y === gridY) {
						const validMove = referee.isValidMove(gridX, gridY, x, y, p.type, p.team);

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

	let board = [];

	for (let j = verticalAxis.length - 1; j >= 0; j--) {
		for (let i = 0; i < horizontalAxis.length; i++) {
			const number = j + i + 2;
			let image = undefined;

			pieces.forEach((p) => {
				if (p.x === i && p.y === j) {
					image = p.image;
				}
			})

			board.push(<Tile key={`${j},${i}`} image={image} number={number} />);
		}
	}

	return (
		<div
			id="chessboard"
			ref={chessboardRef}
			onMouseDown={e => grabPiece(e)}
			onMouseMove={(e) => movePiece(e)}
			onMouseUp={(e) => dropPiece(e)}
		>
			{board}
		</div>
	);
}