import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { TemplateActivity } from '../../../template-activity';
import { TemplateService } from '../../../store/template/template.service';
import { WeekdayTemplate } from '../../../store/weekday-template';
import { MatDialog } from '@angular/material/dialog';
import { TemplateActivityDialogComponent } from '../template-activity-dialog/template-activity-dialog.component';

@Component({
	selector: 'ac-template-activity',
	template: `

		<div (click)="openDialog()">{{templateActivity.name}}</div>

		<button mat-icon-button (click)="deleteTemplateActivity()">
			<mat-icon>
				delete
			</mat-icon>
		</button>
	`,
	host: {
		'[class.ac-template-activity-form]': 'true'
	},
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeekdayTemplateActivityComponent {

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
		this.weekdayTemplateService.deleteTemplateActivity(this.weekdayTemplate, this.templateActivity);
	}
}
