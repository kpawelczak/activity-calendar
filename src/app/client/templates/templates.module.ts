import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplatesComponent } from './templates.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { WeekdayActivityFormComponent } from './weekdays/weekday-activity-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ActivityCalendarButtonModule } from '../../common/ui/activity-calendar-button/activity-calendar-button.module';
import { WeekdayTemplateComponent } from './weekdays/weekday-template.component';
import { FirebaseTemplatesModule } from '../../services/firebase/templates/firebase-templates.module';
import { WeekdayTemplateService } from './weekdays/weekday-template.service';


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
		FirebaseTemplatesModule
	],
	declarations: [
		TemplatesComponent,
		WeekdayActivityFormComponent,
		WeekdayTemplateComponent
	],
	providers: [
		WeekdayTemplateService
	]
})
export class TemplatesModule {

}
