import { CalendarActivity } from '../../../common/models/calendar-activity';

export interface SelectedActivityDialogData {
	selectedDay: Date;
	selectedActivity?: CalendarActivity;
}
