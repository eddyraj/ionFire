import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { DbService } from '../services/db.service';
import { AuthService } from '../services/auth.service';
//import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import * as moment from 'moment';
import * as _ from "lodash";
import { takeUntil } from 'rxjs/operators';
import { UtilService } from '../services/util.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.scss'],
})
export class EventPage implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();

  events$: Observable<any>;
  user;
  today;
  events;
  eventsAttending$: Observable<any>;
  eventsAttending;

  constructor(
    public db: DbService,
    public auth: AuthService,
    //private socialSharing: SocialSharing,
    public util: UtilService
  ) {

    this.today = moment().subtract(1, 'day').format();

    this.events$ = db.collection$(`events`, ref => ref.where('eventDate', '>=', this.today));
    this.events$
      .pipe(takeUntil(this.destroy$))
      .subscribe(events => {
        //console.log('subs to events');
        // events with emergencies on top sorted by how soon event is happening   
        const eventsList = _.chain(events).sortBy('eventDate').groupBy('type').value();
        this.events = _.flatten(_.map(eventsList, _.values));

        auth.user$
          .pipe(takeUntil(this.destroy$))
          .subscribe(user => {
            if (user != null) {
              //console.log('subs to user');
              this.user = user;
              this.eventsAttending$ = db.collection$(`myEvents/${user.uid}/events`);
              this.eventsAttending$
                .pipe(takeUntil(this.destroy$))
                .subscribe(eventsAttending => {
                  //console.log('subs to eventsAttending');
                  this.eventsAttending = eventsAttending;
                  for (let event of this.events) {
                    for (let eventA of this.eventsAttending) {
                      if (event.id == eventA.id) {
                        event.attending = true;
                        break;
                      }
                    }
                  }
                });
            }
          });
        //console.log(this.events);
      });

    // auth.user$
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe(user => {
    //     this.user = user;
    //     this.eventsAttending$ = db.collection$(`myEvents/${user.uid}/events`);
    //     this.isAttending();
    //   });



  }

  ngOnInit() {
  }

  // isAttending() {
  //   this.eventsAttending$
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe(events => this.eventsAttending = events);
  // }

  attend(event) {
    //console.log(event);
    var uid = this.user.uid;

    // use computed param name ES2015
    this.db.updateAt(`eventAttendees/${event.id}`, { [uid]: this.user.email });

    this.db.updateAt(`myEvents/${uid}/events`, event);
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

