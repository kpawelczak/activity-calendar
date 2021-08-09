import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { TemplateActivity } from '../../../template-activity';
import { TemplateService } from '../../../store/template/template.service';
import { WeekdayTemplate } from '../../../store/weekday-template';
import { MatDialog } from '@angular/material/dialog';
import { TemplateActivityDialogComponent } from '../template-activity-dialog/template-activity-dialog.component';

@Component({
	selector: 'ac-template-activity',
	template: `
		<div (click)="openDialog()"
			 class="ac-selected-date-activity">
			<span>{{index + 1}}</span>

			<span>{{templateActivity.name}}</span>

			<span>{{templateActivity.dimensionedActivities | activityDimensioned}}</span>

			<mat-icon (click)="deleteTemplateActivity()">
				delete
			</mat-icon>

		</div>
	`,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeekdayTemplateActivityComponent {

	@Input()
	index: number;

	@Input()
	templateActivity: TemplateActivity;

	@Input()
	weekdayTemplate: WeekdayTemplate;

	loading: boolean;

	constructor(private readonly weekdayTemplateService: TemplateService,
				private readonly matDialog: MatDialog) {

	}

	openDialog(): void {
		this.matDialog.open(TemplateActivityDialogComponent, {
			panelClass: 'activity-calendar-dialog',
			data: {
				weekdayTemplate: this.weekdayTemplate,
				templateActivity: this.templateActivity
			}
		});
	}

	deleteTemplateActivity(): void {
		event.preventDefault();
		event.stopPropagation();
		this.weekdayTemplateService.deleteTemplateActivity(this.weekdayTemplate, this.templateActivity);
	}
}
