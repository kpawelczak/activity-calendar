import { TemplateSet } from '../store/sets/template-set';

export interface LocalTemplatesBySetName {
	templateSetUUID: string;
	templates: Array<LocalWeekdayTemplate>;
}

export interface LocalWeekdayTemplate {
	weekday: number;
	templates?: Array<LocalTemplateActivity>;
}

export interface LocalTemplateActivity {
	readonly weekday: number;
	readonly name: string;
	readonly quantifiedActivities: Array<LocalQuantifiedActivity>;
	readonly templateUUID: string;
	readonly templateSetName?: string;
}

export interface LocalQuantifiedActivity {
	value: string;
	unit: string;
}

export interface LocalTemplateChanges {
	templatesId?: string;
	templateSetsId?: string;
	activeTemplateId?: string;
}

export interface LocalTemplates {
	changes?: LocalTemplateChanges;
	templatesBySetName?: Array<LocalTemplatesBySetName>;
	templateSets?: Array<TemplateSet>;
	activeTemplate?: string;
}
