import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import * as moment from 'moment';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(
    private toastController: ToastController
  ) { }

  async makeToast(message) {
    const toast = await this.toastController.create({
      message,
      duration: 5000,
      position: 'bottom',
      showCloseButton: true,
      closeButtonText: 'dismiss'
    });
    toast.present();
  }

  getMoment(dateTime, type) {
    var dt;
    if (dateTime == null || typeof (dateTime) == "string") {
      return dateTime;
    }
    if (type == 'time') {
      dt = moment();
      dt.hour(dateTime.hour.text);
      dt.minute(dateTime.minute.text);
      dt = dt.format();
    } else if (type == 'date') {
      dt = moment(dateTime.year.text + '-' + dateTime.month.text + '-' + dateTime.day.text + 'T00:00').format();
    }
    return dt;
  }


  compilemsg(event): string {
    var msg = '';

    if (event.type == 'Emergency') {
      msg = 'EMERGENCY - '
        + event.title + '%0A'
        + moment(event.eventDate).format('DD-MM-YYYY') + ' | Blood Type: ' + this.containsPlus(event.bloodGroupRequired) + '%0A'
        + event.location + '%0A'
        + event.description + '%0A'
        + "Click below to Register with Blood Donors Bank for the latest blood donation events";
    } else if (event.type == 'Planned Event') {
      msg = event.title + '%0A'
        + moment(event.eventDate).format('DD-MM-YYYY') + ' | ' + moment(event.startTime).format('HH:mm') + ' - ' + moment(event.endTime).format('HH:mm') + '%0A'
        + event.location + '%0A'
        + event.description + '%0A'
        + "Click below to Register with Blood Donors Bank for the latest blood donation events";
    }

    //console.log(msg);
    return msg;
  }

  containsPlus(s){
    if(s.indexOf('+') > -1){
      return s.replace('+', '%2B')
    }
    return s;
  }

  openExternalWindow(msg:string){
    window.open(`${environment.fbShareUrl}${msg}`, '_system', 'location=yes');
  }

}
