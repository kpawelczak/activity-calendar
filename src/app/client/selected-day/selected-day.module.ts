import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectedDayComponent } from './selected-day.component';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SelectedDateActivitiesComponent } from './selected-date-activities.component';
import { SelectedDateActivityComponent } from './selected-date-activity.component';
import { FabricDateUtilModule } from '../../common/date-util/fabric-date-util.module';
import { SelectedDateActivityService } from './selected-date-activity.service';


@NgModule({
	imports: [
		CommonModule,
		ReactiveFormsModule,
		FormsModule,
		MatSelectModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		MatIconModule,
		FabricDateUtilModule
	],
	declarations: [
		SelectedDayComponent,
		SelectedDateActivityComponent,
		SelectedDateActivitiesComponent
	],
	exports: [
		SelectedDayComponent
	],
	providers: [
		SelectedDateActivityService
	]
})
export class SelectedDayModule {

}
