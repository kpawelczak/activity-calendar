import { Weekday } from '../weekday';

export type TemplateCounter = {
	[weekday in Weekday]?: number;
};
