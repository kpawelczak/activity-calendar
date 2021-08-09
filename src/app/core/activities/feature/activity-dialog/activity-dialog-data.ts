import { CalendarActivity } from '../../store/activities/calendar-activity';

export interface ActivityDialogData {
	selectedDay: Date;
	selectedActivity?: CalendarActivity;
}
