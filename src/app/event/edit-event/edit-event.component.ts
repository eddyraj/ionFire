import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { DbService } from '../../services/db.service';
import * as moment from 'moment';
import { UtilService } from '../../services/util.service';

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.scss']
})
export class EditEventComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();

  editEventForm: FormGroup;
  eventId$:Observable<any>;
  event$:Observable<any>;
  event:any;
  todayFormatted;
  type: string;
  timeError:boolean = false;    

  constructor(
    public formBuilder: FormBuilder,
    public route:  ActivatedRoute,
    public router: Router,
    public db: DbService,
    public util: UtilService
  ) { 

    this.editEventForm = formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      type: ['', Validators.required],
      location: ['', Validators.required],
      eventDate: ['', Validators.required],
      bloodGroupRequired: ['', Validators.required],
      startTime: [],
      endTime: [],
      patientName: ['']
    });

    this.todayFormatted = moment().format('YYYY-MM-DD');

    let id = this.route.snapshot.paramMap.get('id');
    this.event$ = this.db.doc$("events/" + id);
    this.event$
    .pipe(takeUntil(this.destroy$))
    .subscribe(event => {
      //console.log(event);
      this.event = event;

      this.editEventForm.get('title').setValue(event.title);
      this.editEventForm.get('description').setValue(event.description);
      this.editEventForm.get('type').setValue(event.type);
      this.editEventForm.get('location').setValue(event.location);
      this.editEventForm.get('eventDate').setValue(event.eventDate);
      this.editEventForm.get('bloodGroupRequired').setValue(event.bloodGroupRequired);
      this.editEventForm.get('startTime').setValue(event.startTime);
      this.editEventForm.get('endTime').setValue(event.endTime);
      this.editEventForm.get('patientName').setValue(event.patientName);

      this.getLocalTime(event.startTime);
    });
    
    

  }

  ngOnInit() {

  }

  getLocalTime(time: Date){
    //console.log(time);
    var d = new Date(new Date(time).toLocaleString());
    var mod = new Date();
    mod.setHours(d.getHours());
    mod.setMinutes(d.getMinutes());
    //console.log(mod.toISOString());
    return mod.toISOString();
  }

  update(){
    //console.log('update');
    // modify date/time fields to convert from object to ISO string 
    this.editEventForm.get('eventDate').setValue(this.util.getMoment(this.editEventForm.value.eventDate, 'date'));
    this.editEventForm.get('startTime').setValue(this.util.getMoment(this.editEventForm.value.startTime, 'time'));
    this.editEventForm.get('endTime').setValue(this.util.getMoment(this.editEventForm.value.endTime, 'time'));

    let currentEvent = this.event;
    let modEvent = this.editEventForm.value;
    const updatedEvent = {...currentEvent, ...modEvent};

    if (this.editEventForm.touched) {
      this.db.updateAt(`events/${currentEvent.id}`, updatedEvent)
      .then(() => {
          this.util.makeToast('Event updated');
          this.router.navigateByUrl('/my-events');
        }
      );
    } else {
      //console.log('No value change, not updating');
    }
  }

  checkTimeStartEnd(){
    let start = this.util.getMoment(this.editEventForm.value.startTime, 'time');
    let end = this.util.getMoment(this.editEventForm.value.endTime, 'time');

    //console.log(start);
    //console.log(end);

    if(end >= start){
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
