import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {

  @Input() events;
  @Output() attendEvent = new EventEmitter();
  @Output() shareEvent = new EventEmitter();

  constructor() {}

  ngOnInit() { }

  attend(eventId: string){
    this.attendEvent.emit(eventId);
  }

  // need to use trackBy in *ngFor to prevent reloading of the complete list 
  // on update of one event
  trackEvent(index, event){
    return event? event.id : undefined;
  }

  share(eventId: string){
    this.shareEvent.emit(eventId);    
  }

}
