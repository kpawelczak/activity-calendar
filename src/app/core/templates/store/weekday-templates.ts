import { WeekdayTemplate } from './weekday-template';
import { Weekday } from '../weekday';

export class WeekdayTemplates {

	static getPristineWeekdayTemplates(): Array<WeekdayTemplate> {
		return [
			new WeekdayTemplate(Weekday.MONDAY),
			new WeekdayTemplate(Weekday.TUESDAY),
			new WeekdayTemplate(Weekday.WEDNESDAY),
			new WeekdayTemplate(Weekday.THURSDAY),
			new WeekdayTemplate(Weekday.FRIDAY),
			new WeekdayTemplate(Weekday.SATURDAY),
			new WeekdayTemplate(Weekday.SUNDAY)
		];
	}
}
