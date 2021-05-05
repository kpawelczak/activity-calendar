import { CalendarActivity } from '../../../../common/models/calendar-activity';

export interface SelectedDayDialogData {
	selectedDay: Date;
	selectedActivity?: CalendarActivity;
}
