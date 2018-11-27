import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { TermsComponent } from './terms/terms.component';
import { AuthGuardService } from '../services/auth-guard.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      },
      {
        path: 'profile',
        component: ProfileComponent, canActivate: [AuthGuardService]
      },
      {
        path: 'register',
        component: RegisterComponent
      },
      {
        path: 'terms',
        component: TermsComponent
      }
    ])
  ],
  declarations: [HomePage, LoginComponent, ProfileComponent, RegisterComponent, TermsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePageModule {}
