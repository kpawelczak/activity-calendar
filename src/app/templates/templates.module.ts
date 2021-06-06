import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ActivityCalendarButtonModule } from '../common/ui/activity-calendar-button/activity-calendar-button.module';


import { WeekdayTemplatesRepository } from './store/templates/weekday-templates.repository';
import { WeekdayTemplateRepository } from './store/template/weekday-template.repository';
import { WeekdayTemplateCountersRepository } from './store/counters/weekday-template-counters.repository';
import { WeekdayTemplateSetsRepository } from './store/sets/weekday-template-sets.repository';

import { FirebaseTemplateService } from './infrastructure/firebase-template.service';
import { FirebaseTemplateCountersService } from './infrastructure/firebase-template-counters.service';
import { FirebaseTemplateSetsService } from './infrastructure/firebase-template-sets.service';

import { TemplatesComponent } from './feature/templates.component';
import { TemplateSettingsComponent } from './feature/settings/template-settings.component';
import { WeekdayActivityFormComponent } from './feature/weekdays/weekday-activity-form.component';
import { WeekdayTemplateComponent } from './feature/weekdays/weekday-template.component';
import { WeekdayTemplateService } from './feature/weekdays/weekday-template.service';

const store = [
	WeekdayTemplatesRepository,
	WeekdayTemplateRepository,
	WeekdayTemplateCountersRepository,
	WeekdayTemplateSetsRepository
];

const infrastructure = [
	FirebaseTemplateService,
	FirebaseTemplateCountersService,
	FirebaseTemplateSetsService
];


@NgModule({
	imports: [
		CommonModule,
		MatFormFieldModule,
		MatInputModule,
		MatExpansionModule,
		ReactiveFormsModule,
		MatIconModule,
		MatButtonModule,
		ActivityCalendarButtonModule,
		MatSelectModule
	],
	declarations: [
		TemplatesComponent,
		TemplateSettingsComponent,
		WeekdayActivityFormComponent,
		WeekdayTemplateComponent
	],
	exports: [
		TemplatesComponent
	],
	providers: [
		...store,
		...infrastructure,
		WeekdayTemplateService
	]
})
export class TemplatesModule {

}
