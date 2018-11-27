import { Component, OnDestroy } from '@angular/core';

import { Platform, MenuController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FcmService } from './services/fcm.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();

  disableMenu:boolean = true; 

  public appPages = [
    {
      title: 'Events',
      url: '/event',
      icon: 'calendar'
    },
    {
      title: 'My Events',
      url: '/my-events',
      icon: 'calendar'
    },    
    {
      title: 'Profile',
      url: '/profile',
      icon: 'person'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    
    public auth: AuthService,
    public menuCtrl: MenuController,
    private fcm: FcmService
  ) {
    this.initializeApp();

    auth.user$
    .pipe(takeUntil(this.destroy$))
    .subscribe(user => {
      if(user != null){
        this.disableMenu = false;
      } else {
        this.disableMenu = true;
      }
    });

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.fcm.showMessages().subscribe();
    });
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
