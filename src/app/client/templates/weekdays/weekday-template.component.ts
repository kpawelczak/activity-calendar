import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { WeekdayTemplate } from '../../../repositories/templates/weekday-template';
import { Reactive } from '../../../common/reactive';
import { WeekdayTemplateRepository } from './weekday-template.repository';
import { TemplateActivity } from '../../../repositories/templates/template-activity';

@Component({
	selector: 'ac-weekday-template',
	template: `
		<!--		click on button to add activity to template-->

		<ac-template-activity-form *ngFor="let template of weekdayTemplate?.templates"
								   [templateActivity]="template"
								   [weekdayTemplate]="weekdayTemplate"></ac-template-activity-form>

		<ac-button (click)="addTemplate()">Add template</ac-button>
	`,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeekdayTemplateComponent extends Reactive implements OnInit {

	@Input()
	weekday: string;

	weekdayTemplate: WeekdayTemplate;

	constructor(private readonly weekdayTemplateRepository: WeekdayTemplateRepository,
				private readonly changeDetectorRef: ChangeDetectorRef) {
		super();
	}

	ngOnInit() {
		this.weekdayTemplateRepository
			.onTemplate(this.weekday)
			.subscribe((weekdayTemplate: WeekdayTemplate) => {
				this.weekdayTemplate = weekdayTemplate;
				this.changeDetectorRef.detectChanges();
			});
	}

	addTemplate(): void {
		const templateActivity = new TemplateActivity('', '');

		this.weekdayTemplate.templates.push(templateActivity);
	}
}
