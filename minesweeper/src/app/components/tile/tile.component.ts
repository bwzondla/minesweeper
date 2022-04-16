import { Component, EventEmitter, Input, OnInit, Output, SimpleChange } from '@angular/core';
import { Tile } from 'src/app/models/Tile';
import { TileChangeEvent } from 'src/app/models/TileChangeEvent';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldControl } from '@angular/material/form-field';
@Component({
  selector: 'Tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss']
})
export class TileComponent implements OnInit {
  @Input() displayTile!: Tile;
  @Output()changeEvent = new EventEmitter<TileChangeEvent>();
  
  public markedBomb =false;
  public toggle = 0;
  constructor() { 
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes : SimpleChange){
    this.calculateToggle;
  }

  calculateToggle(): void {
    this.toggle = this.displayTile.isBomb ? -1 : 1;
  }

  onRightClick(){
    this.markedBomb = this.markedBomb ? false : true;
  }

  sendChange(){
    this.calculateToggle();
    let event = new TileChangeEvent();
    event.x = this.displayTile.xCoord;
    event.y = this.displayTile.yCoord;
    this.changeEvent.emit(event);
  }

}
