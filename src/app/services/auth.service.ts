import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { DbService } from './db.service';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, take, map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<any>;

  constructor(
    private afAuth: AngularFireAuth,
    private db: DbService,
    private router: Router
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => (user ? db.doc$(`users/${user.uid}`) : of(null)))
    )

  }

  async anonymousLogin() {
    const credential = await this.afAuth.auth.signInAnonymously();
    return await this.updateUserData(credential.user);
  }

  async emailLogin(email:string, password:string) {
    //console.log(email + ' - ' +password);
    const credential = await this.afAuth.auth.signInWithEmailAndPassword(email, password);
    return await this.updateUserData(credential.user);
  }

  async register(email:string, password:string, user: any) {
    //console.log(email + ' - ' +password);
    const credential = await this.afAuth.auth.createUserWithEmailAndPassword(email, password);
    return await this.createUserProfile(credential.user.uid, user);
  }

  private updateUserData({ uid, email, displayName, photoURL, isAnonymous }) {

    //console.log('UID: ' + uid);

    const path = `users/${uid}`;

    const data = {
      uid,
      email,
      displayName,
      photoURL,
      isAnonymous
    };

    return this.db.updateAt(path, data);
  }

  private createUserProfile(uid: string, user: any) {

    //console.log('UID: ' + uid);

    const path = `users/${uid}`;
    const email = user.email || '';
    const phone = user.phone  || '';
    const bloodGroup = user.bloodGroup  || '';
    const gender = user.gender  || '';
    const district = user.district  || '';
    const country = user.country  || '';

    const data = {
      uid,
      email,
      phone,
      bloodGroup,
      gender,
      district,
      country
    };

    //console.log(data);

    return this.db.updateAt(path, data);
  }

  async signOut() {
    await this.afAuth.auth.signOut();
    return this.router.navigate(['/']);
  }

  async doResetPassword(email:string){
    //console.log('reset password for ' + email);
    return await this.afAuth.auth.sendPasswordResetEmail(email);
  }

}
