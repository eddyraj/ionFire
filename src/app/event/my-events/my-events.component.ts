import { Component, OnInit, OnDestroy } from '@angular/core';
import { DbService } from '../../services/db.service';
import { Observable, Subject } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { takeUntil } from 'rxjs/operators';
import { UtilService } from '../../services/util.service';
import * as moment from 'moment';


@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.scss']
})
export class MyEventsComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();

  events$: Observable<any>;
  eventsAttending$: Observable<any>;
  today;
  
  
  constructor(
    public db: DbService,
    public auth: AuthService,
    public util: UtilService
    ) { 
      this.today = moment().subtract(1, 'day').format();

      auth.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        if(user){
          this.events$ = db.collection$(`events`, ref => ref.where('creatorId', '==', user.uid));
          this.events$
          .pipe(takeUntil(this.destroy$))
          .subscribe(events => {
            //console.log(events);
          });

          this.eventsAttending$ = db.collection$(`myEvents/${user.uid}/events`, ref => ref.where('eventDate', '>=', this.today));
          this.eventsAttending$
          .pipe(takeUntil(this.destroy$))
          .subscribe(events => {
            //console.log(events);
          });

        }
      });    
  }

  ngOnInit() {

  }

  share(eventId) {
    //console.log(eventId);
    this.db.doc$(`events/${eventId}`)
    .pipe(takeUntil(this.destroy$))
    .subscribe(event => {
      var msg = this.util.compilemsg(event);
      //this.socialSharing.share(msg, null, null, null);
      this.util.openExternalWindow(msg);
    });
    
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
