import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityCalendarButtonComponent } from './activity-calendar-button.component';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
	imports: [
		CommonModule,
		MatProgressSpinnerModule,
		MatButtonModule
	],
	declarations: [
		ActivityCalendarButtonComponent
	],
	exports: [
		ActivityCalendarButtonComponent
	]
})
export class ActivityCalendarButtonModule {

}
