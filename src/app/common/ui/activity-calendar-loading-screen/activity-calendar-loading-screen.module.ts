import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityCalendarLoadingScreenComponent } from './activity-calendar-loading-screen.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivityCalendarLoadingScreenService } from './activity-calendar-loading-screen.service';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
	imports: [
		CommonModule,
		MatProgressSpinnerModule,
		MatDialogModule
	],
	declarations: [
		ActivityCalendarLoadingScreenComponent
	],
	entryComponents: [
		ActivityCalendarLoadingScreenComponent
	],
	providers: [
		ActivityCalendarLoadingScreenService
	]
})
export class ActivityCalendarLoadingScreenModule {

}
