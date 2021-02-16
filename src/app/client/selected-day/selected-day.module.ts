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
import { SelectedActivityRepository } from './selected-activity.repository';
import { ActivityCalendarButtonModule } from '../../common/ui/activity-calendar-button/activity-calendar-button.module';
import { SelectedDateActivitiesRepository } from './selected-date-activities.repository';
import { FirestoreSelectedActivityModule } from '../../firebase/activities/selected-activity/firestore-selected-activity.module';
import { SelectedActivityService } from './selected-activity.service';


@NgModule({
	imports: [
		CommonModule,
		ReactiveFormsModule,
		FormsModule,
		FirestoreSelectedActivityModule,
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
		SelectedActivityRepository,
		SelectedActivityService,
		SelectedDateActivitiesRepository
	]
})
export class SelectedDayModule {

}
