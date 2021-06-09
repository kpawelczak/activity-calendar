import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { TemplateActivity } from '../../../template-activity';
import { v4 as uuidv4 } from 'uuid';
import { weekdayNames } from './weekday-names';
import { WeekdayTemplate } from '../../../store/weekday-template';


@Component({
	selector: 'ac-weekday-template',
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

				<ac-template-activity-form *ngFor="let template of weekdayTemplate?.getTemplates()"
										   [templateActivity]="template"
										   [weekdayTemplate]="weekdayTemplate"></ac-template-activity-form>

				<div class="ac-weekday-template-add-button-wrapper">
					<button mat-icon-button
							[type]="'button'"
							[disableRipple]="true"
							(click)="addTemplate()">
						<mat-icon>add_circle</mat-icon>
					</button>
				</div>

			</mat-expansion-panel>

		</ng-container>
	`,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeekdayTemplateComponent {

	@Input()
	weekdayTemplate: WeekdayTemplate;

	addTemplate(): void {
		const templateActivity = new TemplateActivity(null, '', '', uuidv4());
		this.weekdayTemplate.addTemplate(templateActivity);
	}

	getWeekdayName(): string {
		return weekdayNames[this.weekdayTemplate.getWeekday()];
	}

	getTemplateCounter(): number {
		return this.weekdayTemplate.getTemplateCounter();
	}
}
