import { ChangeDetectionStrategy, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { Weekday } from '../../services/repositories/templates/weekday';


@Component({
	selector: 'ac-templates',
	template: `
		<mat-accordion multi>

			<ac-weekday-template *ngFor="let weekday of weekdays"
								 [weekday]="weekday"></ac-weekday-template>

		</mat-accordion>
	`,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplatesComponent {

	@ViewChild(MatAccordion)
	accordion: MatAccordion;

	weekdays: Array<Weekday> = this.getWeekdays();

	getWeekdays(): Array<Weekday> {
		const weekdays = Object.values(Weekday)
							   .map((value: Weekday) => value)
							   .filter(value => typeof value === 'number');

		weekdays.push(weekdays.shift());

		return weekdays;
	}
}
