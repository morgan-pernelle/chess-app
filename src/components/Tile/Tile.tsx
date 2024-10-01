import "./Tile.css";

interface Props {
	image: string | undefined;
	number: number;
}

export default function Tile({number, image}: Props) {
	if (number % 2 === 0) {
		return (
			<div className="tile black-tile">
				<img className={image == undefined ? "" : "chess-piece-image"} src={image} />
			</div>
		);
	} else {
		return (
			<div className="tile white-tile">
				<img className={image == undefined ? "" : "chess-piece-image"} src={image} />
			</div>
		);
	}
}