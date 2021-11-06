import { LocalActivity } from './local-activity';

export interface LocalActivityByMonth {
	month: string;
	calendarActivities: Array<LocalActivity>;
}
