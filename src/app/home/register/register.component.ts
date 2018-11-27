import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FcmService } from '../../services/fcm.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  registerForm: FormGroup;
  newUser: any = {};
  submitAttempt: boolean = false;
  error: string = '';
  user: any;

  constructor(
    public auth: AuthService,
    public formBuilder: FormBuilder,
    public router: Router,
    public fcm: FcmService
  ) {

    this.registerForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])],
      phone: [''],
      bloodGroup: ['', Validators.required],
      gender: [''],
      district: [''],
      country: ['', Validators.required],
      agree: ['false', [Validators.required, Validators.requiredTrue]]
    });


  }

  register() {
    this.submitAttempt = true;
    if (this.registerForm.valid) {

      this.newUser = {
        email: this.registerForm.value.email,
        phone: this.registerForm.value.phone,
        bloodGroup: this.registerForm.value.bloodGroup,
        gender: this.registerForm.value.gender,
        district: this.registerForm.value.district,
        country: this.registerForm.value.country
      }
      //console.log(this.registerForm.value);
      //console.log(this.newUser);

      this.auth.register(this.registerForm.value.email, this.registerForm.value.password, this.newUser)
      .then(() =>
        {
          this.fcm.getPermission();
          this.router.navigateByUrl('/event');
        }
      )
      .catch(err => {
        //console.log(err);
        if(err.code == 'auth/email-already-in-use'){
          this.error = 'Email already in use.'
        }
      });

    } else {
      //console.log('invalid entries');
    }

  }

}
