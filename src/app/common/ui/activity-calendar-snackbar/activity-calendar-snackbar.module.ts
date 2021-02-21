import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityCalendarSnackbarService } from './activity-calendar-snackbar.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
	imports: [
		CommonModule,
		MatSnackBarModule
	],
	providers: [
		ActivityCalendarSnackbarService
	]
})
export class ActivityCalendarSnackbarModule {

}
