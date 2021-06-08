import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { TemplateActivity } from '../../../template-activity';
import { v4 as uuidv4 } from 'uuid';
import { weekdayNames } from './weekday-names';
import { Weekday } from '../../../weekday';
import { Reactive } from '../../../../common/cdk/reactive';
import { WeekdayTemplate } from '../../../store/weekday-template';
import { TemplateRepository } from '../../../store/template/template.repository';


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

				<!--				<mat-form-field appearance="fill">-->
				<!--					<mat-label>Switch weekday template</mat-label>-->
				<!--					<mat-select>-->
				<!--						<mat-option *ngFor="let weekday of weekdayNames"-->
				<!--									[value]="weekday">-->
				<!--							{{weekday}}-->
				<!--						</mat-option>-->
				<!--					</mat-select>-->
				<!--				</mat-form-field>-->

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
export class WeekdayTemplateComponent extends Reactive implements OnInit {

	@Input()
	weekday: Weekday;

	weekdayTemplate: WeekdayTemplate;

	weekdayNames = weekdayNames;

	constructor(private readonly templateRepository: TemplateRepository,
				private readonly changeDetectorRef: ChangeDetectorRef) {
		super();
	}

	ngOnInit() {
		this.templateRepository
			.onWeekdayTemplate(this.weekday)
			.pipe(this.takeUntil())
			.subscribe((weekdayTemplate: WeekdayTemplate) => {
				this.weekdayTemplate = weekdayTemplate;
				this.changeDetectorRef.detectChanges();
			});
	}

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
