import { AcLink } from './ac-link';
import { RouteNames } from '../../route-names';

export const acLinks = [
	new AcLink('Calendar', RouteNames.CALENDAR, 'calendar_today'),
	new AcLink('Templates', RouteNames.TEMPLATES, 'dynamic_feed')
];
