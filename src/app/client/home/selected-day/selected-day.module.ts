import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectedDayComponent } from './selected-day.component';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SelectedDayActivitiesComponent } from './activities/selected-day-activities.component';
import { SelectedDayActivityFormComponent } from './activity/selected-day-activity-form.component';
import { FabricDateUtilModule } from '../../../common/date-util/fabric-date-util.module';
import { SelectedActivityRepository } from './activity/selected-activity.repository';
import { ActivityCalendarButtonModule } from '../../../common/ui/activity-calendar-button/activity-calendar-button.module';
import { SelectedDayActivitiesRepository } from './activities/selected-day-activities.repository';
import { FirestoreSelectedActivityModule } from '../../../firebase/activities/selected-activity/firestore-selected-activity.module';
import { SelectedActivityService } from './activity/selected-activity.service';
import { MatTabsModule } from '@angular/material/tabs';
import { SelectedDayTemplateComponent } from './template/selected-day-template.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectedDayTemplateActivityComponent } from './template/selected-day-template-activity.component';


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
		MatTabsModule,
		MatCheckboxModule,
		FabricDateUtilModule
	],
	declarations: [
		SelectedDayComponent,
		SelectedDayActivityFormComponent,
		SelectedDayActivitiesComponent,
		SelectedDayTemplateComponent,
		SelectedDayTemplateActivityComponent
	],
	exports: [
		SelectedDayComponent
	],
	providers: [
		SelectedActivityRepository,
		SelectedActivityService,
		SelectedDayActivitiesRepository
	]
})
export class SelectedDayModule {

}
