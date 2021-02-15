import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectedDayComponent } from './selected-day.component';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SelectedDateActivitiesComponent } from './selected-date-activities.component';
import { SelectedDateActivityFormComponent } from './selected-date-activity-form.component';
import { FabricDateUtilModule } from '../../common/date-util/fabric-date-util.module';
import { SelectedDateActivityService } from './selected-date-activity.service';
import { FirestoreSelectedDayActivitiesModule } from '../../firebase/activities/selected-day-activities/firestore-selected-day-activities.module';
import { ActivityCalendarButtonModule } from '../../common/ui/activity-calendar-button/activity-calendar-button.module';
import { SelectedDateActivitiesService } from './selected-date-activities.service';


@NgModule({
	imports: [
		CommonModule,
		ReactiveFormsModule,
		FormsModule,
		FirestoreSelectedDayActivitiesModule,
		MatSelectModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		ActivityCalendarButtonModule,
		MatIconModule,
		FabricDateUtilModule
	],
	declarations: [
		SelectedDayComponent,
		SelectedDateActivityFormComponent,
		SelectedDateActivitiesComponent
	],
	exports: [
		SelectedDayComponent
	],
	providers: [
		SelectedDateActivityService,
		SelectedDateActivitiesService
	]
})
export class SelectedDayModule {

}
