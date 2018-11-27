import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EventPage } from './event.page';
import { CreateEventComponent } from './create-event/create-event.component';
import { EditEventComponent } from './edit-event/edit-event.component';
import { EventsComponent } from './events/events.component';
import { MyEventsComponent } from './my-events/my-events.component';
import { AuthGuardService } from '../services/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    component: EventPage
  },
  {
    path: 'create-event',
    component: CreateEventComponent, canActivate: [AuthGuardService]
  },
  {
    path: 'edit-event/:id',
    component: EditEventComponent, canActivate: [AuthGuardService]
  },
  {
    path: 'events',
    component: EventsComponent, canActivate: [AuthGuardService]
  },
  {
    path: 'my-events',
    component: MyEventsComponent, canActivate: [AuthGuardService]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EventPage, CreateEventComponent, EditEventComponent, EventsComponent, MyEventsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EventPageModule {}
