import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivityCalendarButtonModule } from '../../common/ui/activity-calendar-button/activity-calendar-button.module';

import { ActivitiesConfigComponent } from './feature/activities-config.component';
import { DefinedActivitiesListComponent } from './feature/defined-activities-list/defined-activities-list.component';
import { ActivityConfigDialogComponent } from './feature/activity-config-dialog/activity-config-dialog.component';
import { ActivitiesConfigUnitsComponent } from './feature/activities-config-units/activities-config-units.component';
import { ActivitiesConfigUnitDialogComponent } from './feature/activities-config-units/activities-config-unit-dialog.component';

import { FirebaseDefinedActivitiesService } from './infrastructure/firebase-defined-activities.service';
import { FirebaseDefinedActivityService } from './infrastructure/firebase-defined-activity.service';
import { FirebaseUnitsService } from './infrastructure/firebase-units.service';

import { DefinedActivityService } from './store/defined-activities/defined-activity.service';
import { DefinedActivitiesRepository } from './store/defined-activities/defined-activities.repository';
import { MatTabsModule } from '@angular/material/tabs';
import { UnitsRepository } from './store/units/units.repository';
import { UnitsService } from './store/units/units.service';
import { MatSelectModule } from '@angular/material/select';

const infrastructure = [
	FirebaseDefinedActivityService,
	FirebaseDefinedActivitiesService,
	FirebaseUnitsService
];

const store = [
	DefinedActivityService,
	DefinedActivitiesRepository,
	UnitsRepository,
	UnitsService
];

@NgModule({
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatButtonModule,
		MatIconModule,
		ActivityCalendarButtonModule,
		MatInputModule,
		MatTabsModule,
		MatSelectModule
	],
	declarations: [
		ActivitiesConfigComponent,
		ActivityConfigDialogComponent,
		DefinedActivitiesListComponent,
		ActivitiesConfigUnitsComponent,
		ActivitiesConfigUnitDialogComponent
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
