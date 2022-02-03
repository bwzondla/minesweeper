import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Tile } from 'src/app/models/Tile';
import { TileChangeEvent } from 'src/app/models/TileChangeEvent';
import { DialogComponent, } from '../dialog/dialog.component';

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
  public mineTotal: number;

  public grid!: Array<Array<Tile>>;

  constructor(public dialog: MatDialog) { 
    // default stuff that can be changed later
    this.width = 10;
    this.height = 10;
    this.mineTotal = 10;
    this.revealedCount = 0;
    this.revealedTotal = this.width * this.height - this.mineTotal;
  }

  ngOnInit(): void {

    this.grid = new Array(this.width);
    for( let i = 0; i < this.width; i++){
      this.grid[i] = Array<Tile>(this.height);

      for(let j = 0; j < this.height; j++){
        this.grid[i][j] = new Tile(i, j, false, false);
      }

    }

    this.placeMines();
  }


  placeMines(){
    for(let i = 0; i < this.mineTotal; i++){
      let randWidth = Math.round((Math.random() * 100)) % this.width;
      let randHeight = Math.round((Math.random() * 100)) % this.width;
      let tile = this.grid[randWidth][randHeight];
      console.log("New Thing");
      console.log(randWidth);
      console.log(randHeight);

      if(tile.isBomb){
        i--;
      } else {
        tile.isBomb = true;
      }
    }
  }

  tileClicked(event: TileChangeEvent){
    let tile = this.grid[event.x][event.y];
    
    if(tile.isBomb){
      this.openDialog();
      this.ngOnInit();
    } else {
      tile.displayNumber = this.getNeighborBombs(event.x, event.y);
    }
  }


  getNeighborBombs(x: number, y: number) : number{
    let bombCount = 0;
    if( x - 1 > 0){
      if( y - 1 > 0){
        bombCount += this.isBomb(this.grid[x - 1][y - 1]);
      }
      bombCount += this.isBomb(this.grid[x - 1][y]);
      if(y + 1 < this.height){
        bombCount += this.isBomb(this.grid[x - 1][y + 1]);
      }
    }

    if( y - 1 > 0){
      bombCount += this.isBomb(this.grid[x][y - 1]);
    }
    if(y + 1 < this.height){
      bombCount += this.isBomb(this.grid[x][y + 1]);
    }

    if( x + 1 < this.width){
      if( y - 1 > 0){
        bombCount += this.isBomb(this.grid[x - 1][y - 1]);
      }
      bombCount += this.isBomb(this.grid[x - 1][y]);
      if(y + 1 < this.height){
        bombCount += this.isBomb(this.grid[x - 1][y + 1]);
      }
    }

    return bombCount;
  }

  isBomb(tile: Tile): number{
    return tile.isBomb ? 1 : 0; 
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogComponent, {width: '250px'});
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}

