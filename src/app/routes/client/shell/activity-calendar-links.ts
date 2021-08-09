import { ActivityCalendarLink } from './activity-calendar-link';
import { RouteName } from '../../../route-name';

export const activityCalendarLinks = [
	new ActivityCalendarLink('Calendar', RouteName.CALENDAR, 'calendar_today'),
	new ActivityCalendarLink('Templates', RouteName.TEMPLATES, 'dynamic_feed'),
	new ActivityCalendarLink('Configuration', RouteName.ACTIVITIES_SETTINGS, 'hiking')
];
