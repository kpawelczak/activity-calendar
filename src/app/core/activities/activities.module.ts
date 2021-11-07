import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TemplatesModule } from '../templates/templates.module';
import { ActivitiesConfigModule } from '../activities-config/activities-config.module';

import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ActivityCalendarButtonModule } from '../../common/ui/activity-calendar-button/activity-calendar-button.module';

import { SelectedDayComponent } from './feature/selected-day.component';
import { ActivitiesTemplateComponent } from './feature/template/activities-template.component';
import { ActivitiesListComponent } from './feature/activities/activities-list.component';
import { ActivityTemplateComponent } from './feature/template/activity-template.component';
import { ActivityDialogComponent } from './feature/activity-dialog/activity-dialog.component';
import { ActiveTemplateSelectComponent } from './feature/template/active-template-select.component';
import { ActivityDialogDefinedActivityComponent } from './feature/activity-dialog/defined-acivity/activity-dialog-defined-activity.component';
import { ActivityDialogDefinedActivityFormComponent } from './feature/activity-dialog/defined-acivity/activity-dialog-defined-activity-form.component';
import { ActivityDialogCustomActivityComponent } from './feature/activity-dialog/custom-activity/activity-dialog-custom-activity.component';

import { FirebaseActivitiesService } from './infrastructure/firebase-activities.service';
import { FirebaseActivitiesCountService } from './infrastructure/firebase-activities-count.service';
import { FirebaseActivityService } from './infrastructure/firebase-activity.service';
import { FirebaseActivitiesChangesService } from './infrastructure/firebase-activities-changes.service';

import { ActivitiesRepository } from './store/activities/activities.repository';
import { ActivitiesService } from './store/activities/activities.service';
import { ActivitiesCountRepository } from './store/count/activities-count.repository';
import { SelectedActivityRepository } from './store/selected-activity/selected-activity.repository';
import { SelectedActivitiesRepository } from './store/selected-activities/selected-activities.repository';
import { SelectedActivitiesService } from './store/selected-activities/selected-activities.service';
import { SelectedDayTemplateActivityRepository } from './store/template/selected-day-template-activity.repository';
import { SelectedActivityService } from './store/selected-activity/selected-activity.service';
import { SelectedDayActiveTemplateSetRepository } from './store/template/selected-day-active-template-set.repository';

import { ActivitiesStorage } from './storage/activities.storage';
import { ActivitiesConverter } from './storage/activities.converter';

import { QuantifiedActivityModule } from '../../common/ui/quantified-activity/quantified-activity.module';


const infrastructure = [
	FirebaseActivitiesService,
	FirebaseActivitiesCountService,
	FirebaseActivityService,
	FirebaseActivitiesChangesService
];

const store = [
	ActivitiesRepository,
	ActivitiesService,
	ActivitiesCountRepository,
	SelectedActivityRepository,
	SelectedActivityService,
	SelectedDayTemplateActivityRepository,
	SelectedActivitiesRepository,
	SelectedActivitiesService,
	SelectedDayActiveTemplateSetRepository
];

const storage = [
	ActivitiesStorage,
	ActivitiesConverter
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

const features = [
	ActivitiesListComponent,
	ActivitiesTemplateComponent,
	ActivityTemplateComponent,
	ActiveTemplateSelectComponent,
	ActivityDialogComponent,
	ActivityDialogCustomActivityComponent,
	ActivityDialogDefinedActivityComponent,
	ActivityDialogDefinedActivityFormComponent
];

const dependencies = [
	TemplatesModule.forFeature(),
	ActivitiesConfigModule.forFeature(),
	QuantifiedActivityModule
	// auth / profile
];

@NgModule({
	imports: [
		CommonModule,
		ReactiveFormsModule,
		FormsModule,
		...dependencies,
		...ui
	],
	declarations: [
		SelectedDayComponent,
		...features
	],
	exports: [
		SelectedDayComponent
	]
})
export class ActivitiesModule {

	static forRoot(): ModuleWithProviders<ActivitiesModule> {
		return {
			ngModule: ActivitiesModule,
			providers: [
				...store,
				...infrastructure,
				...storage,
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
