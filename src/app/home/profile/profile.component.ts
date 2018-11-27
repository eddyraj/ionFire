import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DbService } from '../../services/db.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UtilService } from '../../services/util.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnDestroy{

  destroy$: Subject<boolean> = new Subject<boolean>();

  updateForm: FormGroup;
  updatedProfile: any = {};
  user: any;

  constructor(
    public auth: AuthService,
    public db: DbService,
    public formBuilder: FormBuilder,
    public util: UtilService
    ) { 
    this.updateForm = formBuilder.group({
      email: [{value:'',disabled: true}, Validators.compose([Validators.required, Validators.email])],
      phone: [''],
      bloodGroup: ['', Validators.required],
      gender: [''],
      district: [''],
      country: ['', Validators.required]
    });

    console.log(this.updateForm);

    auth.user$
    .pipe(takeUntil(this.destroy$))
    .subscribe(user => {
      if(user != null){
        //console.log(user);
        this.user = user;
        this.updateForm.get('email').setValue(user.email);
        this.updateForm.get('phone').setValue(user.phone);
        this.updateForm.get('bloodGroup').setValue(user.bloodGroup);
        this.updateForm.get('gender').setValue(user.gender);
        this.updateForm.get('district').setValue(user.district);
        this.updateForm.get('country').setValue(user.country);
      }
    });
  }

  update(){
    //console.log('update user');
    this.updatedProfile = {
      phone: this.updateForm.value.phone,
      bloodGroup: this.updateForm.value.bloodGroup,
      gender: this.updateForm.value.gender,
      district: this.updateForm.value.district,
      country: this.updateForm.value.country
    }
    this.db.updateAt(`users/${this.user.uid}`, this.updatedProfile)
    .then(() => {
      this.util.makeToast('Profile updated');
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
