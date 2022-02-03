import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Tile } from 'src/app/models/Tile';
import { TileChangeEvent } from 'src/app/models/TileChangeEvent';

@Component({
  selector: 'Tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss']
})
export class TileComponent implements OnInit {
  @Input() displayTile!: Tile;
  @Output()changeEvent = new EventEmitter<TileChangeEvent>();

  constructor() { 
  }

  ngOnInit(): void {
  }

  sendChange(){
    let event = new TileChangeEvent();
    event.x = this.displayTile.xCoord;
    event.y = this.displayTile.yCoord;
    this.changeEvent.emit(event);
  }

}
