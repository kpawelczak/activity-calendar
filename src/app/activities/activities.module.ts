import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TemplatesModule } from '../templates/templates.module';

import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ActivityCalendarButtonModule } from '../common/ui/activity-calendar-button/activity-calendar-button.module';

import { SelectedDayComponent } from './feature/activities/selected-day.component';
import { SelectedDayTemplateComponent } from './feature/template/selected-day-template.component';
import { SelectedDayActivitiesComponent } from './feature/activities/selected-day-activities.component';
import { SelectedDayTemplateActivityComponent } from './feature/template/selected-day-template-activity.component';
import { SelectedActivityDialogComponent } from './feature/activity-dialog/selected-activity-dialog.component';

import { FirebaseActivitiesService } from './infrastructure/firebase-activities.service';
import { FirebaseActivitiesCountService } from './infrastructure/firebase-activities-count.service';
import { FirebaseActivityService } from './infrastructure/firebase-activity.service';

import { ActivitiesRepository } from './store/activities/activities.repository';
import { ActivitiesCountRepository } from './store/count/activities-count.repository';
import { SelectedActivityRepository } from './store/selected-activity/selected-activity.repository';
import { SelectedActivitiesRepository } from './store/selected-activities/selected-activities.repository';
import { SelectedActivitiesService } from './store/selected-activities/selected-activities.service';
import { SelectedDayTemplateActivityRepository } from './store/template/selected-day-template-activity.repository';
import { SelectedActivityService } from './store/selected-activity/selected-activity.service';


const infrastructure = [
	FirebaseActivitiesService,
	FirebaseActivitiesCountService,
	FirebaseActivityService
];

const store = [
	ActivitiesRepository,
	ActivitiesCountRepository,
	SelectedActivityRepository,
	SelectedActivityService,
	SelectedDayTemplateActivityRepository,
	SelectedActivitiesRepository,
	SelectedActivitiesService
];

const ui = [
	ActivityCalendarButtonModule,
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
		TemplatesModule.forFeature(),
		...ui
	],
	declarations: [
		SelectedDayComponent,
		SelectedActivityDialogComponent,
		SelectedDayActivitiesComponent,
		SelectedDayTemplateComponent,
		SelectedDayTemplateActivityComponent
	],
	exports: [
		SelectedDayComponent
	],
	providers: [
		...store,
		...infrastructure
	]
})
export class ActivitiesModule {

	static forRoot(): ModuleWithProviders<ActivitiesModule> {
		return {
			ngModule: ActivitiesModule,
			providers: [
				...store,
				...infrastructure
			]
		};
	}

	static forFeature(): ModuleWithProviders<ActivitiesModule> {
		return {
			ngModule: ActivitiesModule,
			providers: []
		};
	}
}
