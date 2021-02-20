import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { WeekdayTemplate } from '../../../repositories/templates/weekday-template';
import { Reactive } from '../../../common/reactive';
import { WeekdayTemplateRepository } from '../../../repositories/templates/weekday-template.repository';
import { TemplateActivity } from '../../../repositories/templates/template-activity';
import { v4 as uuidv4 } from 'uuid';
import { FirebaseTemplatesService } from '../../../firebase/templates/firebase-templates.service';
import { Weekday } from '../../../repositories/templates/weekday';
import { weekdayNames } from './weekday-names';

@Component({
	selector: 'ac-weekday-template',
	template: `
		<mat-expansion-panel (opened)="getTemplates()">

			<mat-expansion-panel-header>
				<mat-panel-title>
					{{getWeekdayName()}}
				</mat-panel-title>
			</mat-expansion-panel-header>
			<!--		click on button to add activity to template-->

			<ac-template-activity-form *ngFor="let template of weekdayTemplate?.templates"
									   [templateActivity]="template"
									   [weekdayTemplate]="weekdayTemplate"></ac-template-activity-form>

			<ac-button (click)="addTemplate()">Add template</ac-button>

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
				this.changeDetectorRef.detectChanges();
			});
	}

	addTemplate(): void {
		const templateActivity = new TemplateActivity('', '', uuidv4());

		this.weekdayTemplate.templates.push(templateActivity);
	}

	getTemplates(): void { // todo
		if (this.canGetFromFirebase) {
			this.firebaseTemplatesService
				.getTemplate(this.weekday);
			this.canGetFromFirebase = false;
		}
	}

	getWeekdayName(): string {
		return weekdayNames[this.weekdayTemplate.weekday - 1];
	}
}
