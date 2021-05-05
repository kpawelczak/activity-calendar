import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { FabricDateUtilModule } from '../../../common/utils/date-util/fabric-date-util.module';
import { ActivityCalendarButtonModule } from '../../../common/ui/activity-calendar-button/activity-calendar-button.module';
import { FirebaseActivityModule } from '../../../services/firebase/activities/activity/firebase-activity.module';

import { SelectedDayComponent } from './selected-day.component';
import { SelectedDayActivitiesComponent } from './activities/selected-day-activities.component';
import { SelectedDayActivityDialogComponent } from './activity/selected-day-activity-dialog.component';
import { SelectedDayTemplateComponent } from './template/selected-day-template.component';
import { SelectedDayTemplateActivityComponent } from './template/selected-day-template-activity.component';

import { SelectedDayTemplateActivityRepository } from './template/selected-day-template-activity.repository';
import { SelectedDayActivityService } from './activity/selected-day-activity.service';
import { SelectedActivityRepository } from './activity/selected-activity.repository';
import { SelectedDayActivitiesRepository } from './activities/selected-day-activities.repository';


const materialModules = [
	MatSelectModule,
	MatFormFieldModule,
	MatInputModule,
	MatButtonModule,
	MatIconModule,
	MatTabsModule,
	MatCheckboxModule,
	MatDialogModule
];

@NgModule({
	imports: [
		CommonModule,
		ReactiveFormsModule,
		FormsModule,
		FirebaseActivityModule,
		ActivityCalendarButtonModule,
		FabricDateUtilModule,
		...materialModules
	],
	declarations: [
		SelectedDayComponent,
		SelectedDayActivityDialogComponent,
		SelectedDayActivitiesComponent,
		SelectedDayTemplateComponent,
		SelectedDayTemplateActivityComponent
	],
	exports: [
		SelectedDayComponent
	],
	providers: [
		SelectedActivityRepository,
		SelectedDayActivityService,
		SelectedDayActivitiesRepository,
		SelectedDayTemplateActivityRepository
	]
})
export class SelectedDayModule {

}
