import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { TemplateActivity } from '../../../templates/template-activity';

@Component({
	selector: 'ac-activities-template',
	template: `
		<div class="ac-selected-date-activity header">

			<span>#</span>

			<span>Name</span>

			<span>Amount</span>

		</div>

		<ac-activity-template *ngFor="let templateActivity of templateActivities; let i = index"
							  [index]="i"
							  [selectedDay]="selectedDay"
							  [templateActivity]="templateActivity">
		</ac-activity-template>
	`,
	host: {
		'[class.ac-activities-template]': 'true'
	},
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivitiesTemplateComponent {

	@Input()
	selectedDay: Date;

	@Input()
	templateActivities: Array<TemplateActivity>;

}
