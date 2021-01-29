import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { quarters } from '../../common/data/quarters';
import { ActivityCalendarViewService } from '../../activity-calendar-view.service';
import { ActivityCalendarService } from '../../activity-calendar.service';
import { FabricDateUtilService } from '../../../common/date-util/fabric-date-util.service';
import { ActivityCalendarView } from '../../common/models/activity-calendar-view';

@Component({
	selector: 'act-calendar-months',
	template: `
		<table>
			<tr *ngFor="let quarter of quarters">
				<td (click)="selectMonth(month.nr)"
					*ngFor="let month of quarter"
					[class.gui-date-picker-current-month]="isMonth(currentDay, month.nr)"
					[class.gui-date-picker-selected-month]="isMonth(selectedDate, month.nr)"
					class="gui-date-picker-month">
					<span>
						{{month.name}}
					</span>
				</td>
			</tr>
		</table>
	`,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityCalendarMonthsComponent {

	@Input()
	selectedDate: Date;

	@Input()
	selectedYear: number;

	quarters = quarters;

	currentDay: Date = new Date();

	constructor(private readonly dateUtilsService: FabricDateUtilService,
				private readonly calendarService: ActivityCalendarService,
				private readonly calendarViewService: ActivityCalendarViewService) {
	}

	isMonth(date: Date, month: number): boolean {
		if (date) {
			return this.dateUtilsService.isMonth(date, month, this.selectedYear);
		}
	}

	selectMonth(month: number): void {
		this.calendarService.selectMonth(month);
		this.calendarViewService.switchView(ActivityCalendarView.DAYS);
	}
}
