import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DbService } from '../../services/db.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import * as moment from 'moment';
import { FcmService } from '../../services/fcm.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { UtilService } from '../../services/util.service';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss']
})
export class CreateEventComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();

  createEventForm: FormGroup;
  submitAttempt: boolean = false;
  newEvent:any =  { };
  today;
  time1;
  time2;
  todayFormatted;
  user: any;
  type: string;
  timeError:boolean = false;

  constructor(
    public formBuilder: FormBuilder,
    public db: DbService,
    public router: Router,
    public auth: AuthService,
    public fcm: FcmService,
    public util: UtilService
  ) {

    this.createEventForm = formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      date: [''],
      type: ['', Validators.required],
      location: ['', Validators.required],
      eventDate: [''],
      bloodGroupRequired: ['', Validators.required],
      startTime: [],
      endTime: [],
      patientName: ['']
    });

    auth.user$
    .pipe(takeUntil(this.destroy$))
    .subscribe(user => this.user = user);

    this.today = moment().format();
    this.todayFormatted = moment().format('YYYY-MM-DD');
    this.createEventForm.get('eventDate').setValue(this.today);
    this.createEventForm.get('startTime').setValue(this.today);
    this.createEventForm.get('endTime').setValue(this.today);

  }

  ngOnInit() {
  }

  create() {
    this.submitAttempt = true;
     if (this.createEventForm.valid) {

      this.newEvent = {
        title: this.createEventForm.value.title,
        description: this.createEventForm.value.description,
        type: this.createEventForm.value.type,
        location: this.createEventForm.value.location,
        eventDate: this.util.getMoment(this.createEventForm.value.eventDate, 'date'),
        bloodGroupRequired: this.createEventForm.value.bloodGroupRequired,
        startTime: this.util.getMoment(this.createEventForm.value.startTime, 'time'),
        endTime: this.util.getMoment(this.createEventForm.value.endTime, 'time'),
        patientName: this.createEventForm.value.patientName,
        creatorId: this.user.uid,
        createdDate: moment().format(),
      }

      //console.log(this.newEvent);
      //console.log(this.createEventForm.value);

      
      //console.log(this.util.getMoment(this.createEventForm.value.eventDate, 'date'));
      //console.log(this.util.getMoment(this.createEventForm.value.startTime, 'time'));
      //console.log(this.util.getMoment(this.createEventForm.value.endTime, 'time'));

      this.db.updateAt(`events`,this.newEvent)
        .then(() => {
          this.util.makeToast('Event created');
          this.router.navigateByUrl('/my-events');
        })
        .catch(err => {
          //console.log(err);
        });

    } else {
      //console.log('invalid entries');
    }

  }

  checkTimeStartEnd(){
    let start = this.util.getMoment(this.createEventForm.value.startTime, 'time');
    let end = this.util.getMoment(this.createEventForm.value.endTime, 'time');

    //console.log(start);
    //console.log(end);

    if(end > start){
      //console.log('end greater');
      this.timeError = false;     
    } else {
      //console.log('start greater'); 
      this.timeError = true; 
    }

  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
