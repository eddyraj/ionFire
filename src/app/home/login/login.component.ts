import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();

  loginForm: FormGroup;
  error: string;
  user;

  constructor(
    public auth: AuthService,
    public formBuilder: FormBuilder,
    private router: Router
  ) {
    this.loginForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.required]
    });

    auth.user$
    .pipe(takeUntil(this.destroy$))
    .subscribe(user => {
      this.user = user;
      if(user != null && user.uid != ''){
        router.navigateByUrl('/event');
      }
    });
  }

  ngOnInit() {
  }

  dologin(){
    //console.log('login');
    this.auth.emailLogin(this.loginForm.controls.email.value, this.loginForm.controls.password.value)
    .then(() => {
      this.loginForm.reset();
      if(this.user.uid != ''){
        this.router.navigateByUrl('/event');
      }
    }
    )
    .catch(err => {
      if(err){
        this.error = 'Invalid credentials';
      } 
    });
  }

  forgot(){
    //console.log('forgot');
    if(this.loginForm.controls.email.valid){
      this.auth.doResetPassword(this.loginForm.value.email)
      .then(data => {
        //console.log('email sent');
      })
      .catch(err => {
        //console.log(err);
      });
    } else {
      //console.log('No email entered');
      this.error = 'Please enter your email';
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}