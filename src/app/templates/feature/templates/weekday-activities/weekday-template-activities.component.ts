import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { weekdayNames } from './weekday-names';
import { WeekdayTemplate } from '../../../store/weekday-template';
import { MatDialog } from '@angular/material/dialog';
import { TemplateActivityDialogComponent } from '../template-activity-dialog/template-activity-dialog.component';
import { Weekday } from '../../../weekday';
import { TemplateRepository } from '../../../store/template/template.repository';
import { Reactive } from '../../../../common/cdk/reactive';


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

				<div class="ac-selected-date-activity header">

					<span>#</span>

					<span>Name</span>

					<span>Amount</span>

				</div>

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
export class WeekdayTemplateActivitiesComponent extends Reactive implements OnInit {

	@Input()
	weekday: Weekday;

	weekdayTemplate: WeekdayTemplate;

	constructor(private readonly templateRepository: TemplateRepository,
				private readonly changeDetectorRef: ChangeDetectorRef,
				private readonly matDialog: MatDialog) {
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
