export interface LocalTemplatesBySetName {
	templateSetName: string;
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

export interface LocalTemplates {
	changesId?: string;
	templatesBySetName?: Array<LocalTemplatesBySetName>;
	templateSets?: any;
	activeTemplate?: any;
}
