import { ITile } from "./ITile";

export class Tile implements ITile {
    public color: string;
    constructor(public xCoord: number, public yCoord: number, public isBomb?: boolean, public isRevealed?: boolean, public displayNumber?: number){
        this.color = "white";
        this.isRevealed = false;
    }
}
