import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplatesRoutingModule } from './templates-routing.module';

import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ActivityCalendarButtonModule } from '../../common/ui/activity-calendar-button/activity-calendar-button.module';
import { ActivityDimensionedModule } from '../../common/utils/activity/activity-dimensioned.module';
import { MatTabsModule } from '@angular/material/tabs';

import { FirebaseTemplateSetsService } from './infrastructure/firebase-template-sets.service';
import { FirebaseTemplatesService } from './infrastructure/firebase-templates.service';
import { FirebaseTemplateService } from './infrastructure/firebase-template.service';
import { FirebaseActiveTemplateSetService } from './infrastructure/firebase-active-template-set.service';

import { TemplatesRepository } from './store/templates/templates.repository';
import { TemplatesService } from './store/templates/templates.service';
import { TemplateSetsRepository } from './store/sets/template-sets.repository';
import { TemplateService } from './store/template/template.service';
import { ActiveTemplateSetService } from './store/sets/active-template-set.service';
import { TemplateRepository } from './store/template/template.repository';
import { TemplateSetsService } from './store/sets/template-sets.service';

import { TemplatesComponent } from './feature/templates/templates.component';
import { TemplateSetSelectComponent } from './feature/templates/template-set-select.component';

import { TemplateActivityDialogComponent } from './feature/templates/template-activity-dialog/template-activity-dialog.component';
import { TemplatesRootComponent } from './templates-root.component';
import { TemplatesSettingsComponent } from './feature/settings/templates-settings.component';
import { TemplateSetDialogComponent } from './feature/settings/template-set-dialog.component';
import { WeekdayTemplateActivitiesComponent } from './feature/templates/weekday-activities/weekday-template-activities.component';
import { WeekdayTemplateActivityComponent } from './feature/templates/weekday-activities/weekday-template-activity.component';
import { TemplateCustomActivityComponent } from './feature/templates/template-activity-dialog/custom-activity/template-custom-activity.component';
import { TemplateDefinedActivityFormComponent } from './feature/templates/template-activity-dialog/defined-activity/template-defined-activity-form.component';
import { TemplateDefinedActivityComponent } from './feature/templates/template-activity-dialog/defined-activity/template-defined-activity.component';


const store = [
	ActiveTemplateSetService,
	TemplateRepository,
	TemplateService,
	TemplatesRepository,
	TemplateSetsRepository,
	TemplateSetsService,
	TemplatesService
];

const infrastructure = [
	FirebaseTemplateService,
	FirebaseTemplatesService,
	FirebaseTemplateSetsService,
	FirebaseActiveTemplateSetService
];

const ui = [
	MatFormFieldModule,
	MatInputModule,
	MatExpansionModule,
	ReactiveFormsModule,
	MatIconModule,
	MatButtonModule,
	ActivityCalendarButtonModule,
	MatSelectModule
];

@NgModule({
	imports: [
		CommonModule,
		TemplatesRoutingModule,
		ActivityDimensionedModule,
		MatTabsModule,
		...ui
	],
	declarations: [
		TemplatesRootComponent,
		TemplatesComponent,
		TemplatesSettingsComponent,
		TemplateSetSelectComponent,
		WeekdayTemplateActivitiesComponent,
		WeekdayTemplateActivityComponent,
		TemplateActivityDialogComponent,
		TemplateCustomActivityComponent,
		TemplateDefinedActivityComponent,
		TemplateDefinedActivityFormComponent,
		TemplateSetDialogComponent
	],
	exports: [
		TemplatesRootComponent
	]
})
export class TemplatesModule {

	static forRoot(): ModuleWithProviders<TemplatesModule> {
		return {
			ngModule: TemplatesModule,
			providers: [
				...store,
				...infrastructure
			]
		};
	}

	static forFeature(): ModuleWithProviders<TemplatesModule> {
		return {
			ngModule: TemplatesModule,
			providers: []
		};
	}
}
