import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarFirebaseService } from './calendar-firebase.service';

@NgModule({
	imports: [
		CommonModule
	],
	providers: [
		CalendarFirebaseService
	]
})
export class CalendarFirebaseModule {

}
