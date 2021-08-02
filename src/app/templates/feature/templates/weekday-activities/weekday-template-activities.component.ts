import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { weekdayNames } from './weekday-names';
import { WeekdayTemplate } from '../../../store/weekday-template';
import { MatDialog } from '@angular/material/dialog';
import { TemplateActivityDialogComponent } from '../template-activity-dialog/template-activity-dialog.component';


@Component({
	selector: 'ac-weekday-template-activities',
	template: `
		<ng-container *ngIf="weekdayTemplate">

			<mat-expansion-panel>

				<mat-expansion-panel-header [class.has-template-activities]="getTemplateCounter()">
					<mat-panel-title>
						{{getWeekdayName()}}
					</mat-panel-title>
					<mat-panel-description>
						{{getTemplateCounter()}}
					</mat-panel-description>
				</mat-expansion-panel-header>

				<ac-template-activity *ngFor="let template of weekdayTemplate?.getTemplates()"
									  [templateActivity]="template"
									  [weekdayTemplate]="weekdayTemplate"></ac-template-activity>

				<div class="ac-weekday-template-add-button-wrapper">
					<button mat-icon-button
							[type]="'button'"
							[disableRipple]="true"
							(click)="openTemplateDialog()">
						<mat-icon>add_circle</mat-icon>
					</button>
				</div>

			</mat-expansion-panel>

		</ng-container>
	`,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeekdayTemplateActivitiesComponent {

	@Input()
	weekdayTemplate: WeekdayTemplate;

	constructor(private readonly matDialog: MatDialog) {
	}

	openTemplateDialog(): void {
		this.matDialog.open(TemplateActivityDialogComponent, {
			panelClass: 'activity-calendar-dialog',
			data: {
				weekdayTemplate: this.weekdayTemplate
			}
		});
	}

	getWeekdayName(): string {
		return weekdayNames[this.weekdayTemplate.getWeekday()];
	}

	getTemplateCounter(): number {
		return this.weekdayTemplate.getTemplateCounter();
	}
}
