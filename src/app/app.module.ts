import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ActivityCalendarModule } from './calendar/activity-calendar.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { SelectedDayModule } from './selected-day/selected-day.module';
import { CalendarFirebaseModule } from './firebase/calendar-firebase.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';


@NgModule({
	imports: [
		BrowserModule,
		AppRoutingModule,
		HammerModule,
		ActivityCalendarModule,
		SelectedDayModule,
		ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
		CalendarFirebaseModule,
		AngularFireModule.initializeApp(environment.firebase),
		AngularFirestoreModule
	],
	declarations: [
		AppComponent
	],
	bootstrap: [AppComponent]
})
export class AppModule {
}
