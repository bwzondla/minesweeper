import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Tile } from 'src/app/models/Tile';
import { TileChangeEvent } from 'src/app/models/TileChangeEvent';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import { ReturnStatement } from '@angular/compiler';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  public width: number;
  public height: number;
  public revealedCount: number;
  public revealedTotal: number;
  public gameOver: boolean;
  public mineTotal: number;

  public grid!: Array<Array<Tile>>;

  constructor(public dialog: MatDialog) { 
    // default stuff that can be changed later
    this.width = 10;
    this.height = 10;
    this.mineTotal = 10;
    this.revealedCount = 0;
    this.revealedTotal = this.width * this.height - this.mineTotal;
    this.gameOver = false;
  }

  ngOnInit(): void {
    this.gameOver = false;
    this.grid = new Array(this.width);
    for( let i = 0; i < this.width; i++){
      this.grid[i] = Array<Tile>(this.height);

      for(let j = 0; j < this.height; j++){
        this.grid[i][j] = new Tile(i, j, false, false);
      }

    }
 
    this.placeMines();

    for( let i = 0; i < this.width; i++){
      for(let j = 0; j < this.height; j++){
        this.grid[i][j].displayNumber = this.getNeighborBombs(i, j);
      }
    }
  }


  placeMines(){
    for(let i = 0; i < this.mineTotal; i++){
      let randWidth = Math.round((Math.random() * 100)) % this.width;
      let randHeight = Math.round((Math.random() * 100)) % this.width;
      let tile = this.grid[randWidth][randHeight];

      if(tile.isBomb){
        i--;
      } else {
        tile.isBomb = true;
      }
    }
  }

  tileClicked(event: TileChangeEvent){

    if(this.gameOver){this.revealAll(); return;}

    let tile = this.grid[event.x][event.y];
    
    if(tile.isBomb){
      this.openDialog();
      this.gameOver = true;
    } else {
      this.revealDFS(event.x, event.y);
    }
  }

  revealAll():void{
    for( let i = 0; i < this.width; i++){
      for(let j = 0; j < this.height; j++){
        this.grid[i][j].isRevealed = true;
      }
    }
  }

  revealDFS(x: number, y: number){
    if(this.grid[x][y].displayNumber != 0 || this.grid[x][y].isRevealed === true){
      if(!this.grid[x][y].isBomb){
        this.grid[x][y].isRevealed = true;
        this.revealedCount += 1;
      }
      return
    }
    this.grid[x][y].isRevealed = true;
    this.revealedCount += 1;

    if(x - 1 >= 0){
      this.revealDFS(x - 1, y)
    }

    if(x + 1 < this.width){
      this.revealDFS(x +1, y)
    }

    if(y - 1 >= 0){
      this.revealDFS(x , y - 1);
    }

    if(y + 1 < this.height){
      this.revealDFS(x , y + 1);
    }

  }

  getNeighborBombs(x: number, y: number) : number{
    let bombCount = 0;
    if(this.grid[x][y].isBomb){ return -1;}
    if( x - 1 >= 0){
      if( y - 1 >= 0){
        bombCount += this.isBomb(this.grid[x - 1][y - 1]);
      }
      bombCount += this.isBomb(this.grid[x - 1][y]);
      if(y + 1 < this.height){
        bombCount += this.isBomb(this.grid[x - 1][y + 1]);
      }
    }

    if( y - 1 >= 0){
      bombCount += this.isBomb(this.grid[x][y - 1]);
    }
    if(y + 1 < this.height){
      bombCount += this.isBomb(this.grid[x][y + 1]);
    }

    if( x + 1 < this.width){
      if( y - 1 >= 0){
        bombCount += this.isBomb(this.grid[x + 1][y - 1]);
      }
      bombCount += this.isBomb(this.grid[x + 1][y]);
      if(y + 1 < this.height){ 
        bombCount += this.isBomb(this.grid[x + 1][y + 1]);
      }
    }

    return bombCount;
  } 

  isBomb(tile: Tile): number{
    return tile.isBomb ? 1 : 0; 
  }

  openDialog(): void {
    let outcome = "You Hit A Bomb!";

    if(this.revealedTotal == this.revealedCount){
      outcome = "You Won!"
    }

    const dialogRef = this.dialog.open(GameOver, {
      width: '45%', 
      height: '45%',
      data: {gameOutcome: outcome}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
    this.revealAll();
  }
}

export interface DialogData {
  gameOutcome: string;
}

@Component({
  selector: 'gameover',
  templateUrl: 'gameover.html',
})
export class GameOver {
  constructor(
    public dialogRef: MatDialogRef<GameOver>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
