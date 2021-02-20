import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { TemplateActivity } from '../../../../repositories/templates/template-activity';

@Component({
	selector: 'ac-selected-day-template',
	template: `
		<div class="ac-selected-date-activity header">

			<span>#</span>

			<span>Name</span>

			<span>Reps</span>

		</div>

		<ac-selected-day-template-activity *ngFor="let templateActivity of templateActivities; let i = index"
										   [index]="i"
										   [selectedDay]="selectedDay"
										   [templateActivity]="templateActivity">
		</ac-selected-day-template-activity>
	`,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectedDayTemplateComponent {

	@Input()
	selectedDay: Date;

	@Input()
	templateActivities: Array<TemplateActivity>;

}
