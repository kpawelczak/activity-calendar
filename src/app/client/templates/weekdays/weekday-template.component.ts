import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { WeekdayTemplate } from '../../../services/repositories/templates/template/weekday-template';
import { Reactive } from '../../../common/cdk/reactive';
import { WeekdayTemplateRepository } from '../../../services/repositories/templates/template/weekday-template.repository';
import { TemplateActivity } from '../../../common/models/template-activity';
import { v4 as uuidv4 } from 'uuid';
import { FirebaseTemplatesService } from '../../../services/firebase/templates/firebase-templates.service';
import { Weekday } from '../../../services/repositories/templates/weekday';
import { weekdayNames } from './weekday-names';

@Component({
	selector: 'ac-weekday-template',
	template: `
		<mat-expansion-panel (opened)="getTemplates()">

			<mat-expansion-panel-header
				[class.has-template-activities]="weekdayTemplate.getTemplateCounter()">
				<mat-panel-title>
					{{getWeekdayName()}}
				</mat-panel-title>
				<mat-panel-description>
					{{getTemplateCounter()}}
				</mat-panel-description>
			</mat-expansion-panel-header>

			<ac-template-activity-form *ngFor="let template of weekdayTemplate?.templates"
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
	`,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeekdayTemplateComponent extends Reactive implements OnInit {

	@Input()
	weekday: Weekday;

	weekdayTemplate: WeekdayTemplate;

	private canGetFromFirebase: boolean = true;

	constructor(private readonly firebaseTemplatesService: FirebaseTemplatesService,
				private readonly weekdayTemplateRepository: WeekdayTemplateRepository,
				private readonly changeDetectorRef: ChangeDetectorRef) {
		super();
	}

	ngOnInit() {
		this.weekdayTemplateRepository
			.onTemplate(this.weekday)
			.pipe(this.takeUntil())
			.subscribe((weekdayTemplate: WeekdayTemplate) => {
				this.weekdayTemplate = weekdayTemplate;
				this.canGetFromFirebase = this.weekdayTemplate.templates.length === 0;
				this.changeDetectorRef.detectChanges();
			});
	}

	addTemplate(): void {
		const templateActivity = new TemplateActivity('', '', uuidv4());

		this.weekdayTemplate.templates.push(templateActivity);
	}

	getTemplates(): void {
		if (this.canGetFromFirebase && this.weekdayTemplate.getTemplateCounter()) {
			this.firebaseTemplatesService.getTemplate(this.weekday);
			this.canGetFromFirebase = false;
		}
	}

	getWeekdayName(): string {
		return weekdayNames[this.weekdayTemplate.weekday];
	}

	getTemplateCounter(): number {

		if (!this.weekdayTemplate.getTemplateCounter()) {
			return;
		}

		return Object.values(this.weekdayTemplate.getTemplateCounter())[0];
	}
}
