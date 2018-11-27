import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireMessaging } from "@angular/fire/messaging";
import { AngularFireFunctions } from "@angular/fire/functions";
import { tap, mergeMapTo, takeUntil } from "rxjs/operators";

// Import firebase to fix temporary bug in AngularFire
import * as app from 'firebase';
import { Subject } from 'rxjs';
import { UtilService } from './util.service';

@Injectable({
  providedIn: 'root'
})
export class FcmService implements OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();

  token;

  constructor(
    private afMessaging: AngularFireMessaging,
    private fun: AngularFireFunctions,
    public util: UtilService
  ) { // Bind methods to fix temporary bug in AngularFire
    try {
      const _messaging = app.messaging();
      _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
      _messaging.onMessage = _messaging.onMessage.bind(_messaging);
    } catch(e){}
  }

  // getPermission(){
  //   console.log('getting permission');
  //   return this.afMessaging.requestToken.pipe(
  //     tap(token => {
  //       this.token = token;
  //       console.log(`Token: ${token}`)
  //     })
  //   );
  // }

  getPermission() {
    //console.log('getting permission 2');
    this.afMessaging.requestPermission
      .pipe(mergeMapTo(this.afMessaging.tokenChanges))
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (token) => { 
          //console.log('Permission granted! Save to the server!', token); 
          this.token = token;

          //subscribe as soon as token is received
          this.sub('donations');
        },
        (error) => { console.error(error); },  
      );
  }

  showMessages(){
    //console.log('Message received');
    return this.afMessaging.messages.pipe(
      tap(msg => {
        const body: any = (msg as any).notification.body;
        this.util.makeToast('New Blood Donation Event');
      })
    );
  }

  sub(topic){
    //console.log('subscribeToTopic ' + topic);
    this.fun
    .httpsCallable('subscribeToTopic')({topic, token: this.token})
    .pipe(tap(_ => this.util.makeToast(`Subscribed to ${topic}`)))
    .pipe(takeUntil(this.destroy$))
    .subscribe();
  }

  unsub(topic){
    //console.log('unsubscribeFromTopic ' + topic);
    this.fun
    .httpsCallable('unsubscribeFromTopic')({topic, token: this.token})
    .pipe(tap(_ => this.util.makeToast(`Subscribed to ${topic}`)))
    .pipe(takeUntil(this.destroy$))
    .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }


}
