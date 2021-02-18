import { ActivityCalendarLink } from './activity-calendar-link';
import { RouteNames } from '../../route-names';

export const activityCalendarLinks = [
	new ActivityCalendarLink('Calendar', RouteNames.CALENDAR, 'calendar_today'),
	new ActivityCalendarLink('Templates', RouteNames.TEMPLATES, 'dynamic_feed')
];
