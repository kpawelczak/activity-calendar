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

import { TemplatesRepository } from './store/templates/templates.repository';
import { TemplateSetsRepository } from './store/sets/template-sets.repository';
import { FirebaseTemplateSetsService } from './infrastructure/firebase-template-sets.service';
import { FirebaseTemplatesService } from './infrastructure/firebase-templates.service';
import { FirebaseTemplateService } from './infrastructure/firebase-template.service';
import { FirebaseActiveTemplateSetService } from './infrastructure/firebase-active-template-set.service';

import { TemplatesComponent } from './feature/templates.component';
import { TemplateSettingsComponent } from './feature/settings/template-settings.component';
import { WeekdayActivityFormComponent } from './feature/weekdays/weekday-activity-form.component';
import { WeekdayTemplateComponent } from './feature/weekdays/weekday-template.component';
import { TemplateService } from './store/template/template.service';
import { ActiveTemplateSetService } from './store/sets/active-template-set.service';

const store = [
	TemplatesRepository,
	TemplateSetsRepository,
	ActiveTemplateSetService
];

const infrastructure = [
	FirebaseTemplateService,
	FirebaseTemplatesService,
	FirebaseTemplateSetsService,
	FirebaseActiveTemplateSetService
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
		TemplateService
	]
})
export class TemplatesModule {

}
