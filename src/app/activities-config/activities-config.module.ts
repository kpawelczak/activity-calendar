import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { ActivitiesConfigComponent } from './feature/activities-config.component';
import { DefinedActivitiesListComponent } from './feature/defined-activities-list/defined-activities-list.component';
import { ActivityConfigDialogComponent } from './feature/activity-config-dialog/activity-config-dialog.component';
import { ActivityCalendarButtonModule } from '../common/ui/activity-calendar-button/activity-calendar-button.module';
import { MatInputModule } from '@angular/material/input';

import { FirebaseDefinedActivitiesService } from './infrastructure/firebase-defined-activities.service';
import { FirebaseDefinedActivityService } from './infrastructure/firebase-defined-activity.service';

import { DefinedActivityService } from './store/defined-activities/defined-activity.service';
import { DefinedActivitiesRepository } from './store/defined-activities/defined-activities.repository';

const infrastructure = [
	FirebaseDefinedActivityService,
	FirebaseDefinedActivitiesService
];

const store = [
	DefinedActivityService,
	DefinedActivitiesRepository
];


@NgModule({
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatButtonModule,
		MatIconModule,
		ActivityCalendarButtonModule,
		MatInputModule
	],
	declarations: [
		ActivitiesConfigComponent,
		ActivityConfigDialogComponent,
		DefinedActivitiesListComponent
	],
	exports: [
		ActivitiesConfigComponent
	]
})
export class ActivitiesConfigModule {

	static forRoot(): ModuleWithProviders<ActivitiesConfigModule> {
		return {
			ngModule: ActivitiesConfigModule,
			providers: [
				...store,
				...infrastructure
			]
		};
	}

	static forFeature(): ModuleWithProviders<ActivitiesConfigModule> {
		return {
			ngModule: ActivitiesConfigModule,
			providers: []
		};
	}
}
