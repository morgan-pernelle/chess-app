export interface Piece {
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
