export class DomainChanges {

	private activities: string;

	private definedActivities: string;

	private units: string;

	private templates: string;

	private templateSets: string;

	private activeTemplate: string;

	constructor(activities?: string,
				definedActivities?: string,
				units?: string,
				templates?: string,
				templateSets?: string,
				activeTemplate?: string) {
		if (activities) {
			this.activities = activities;
		}

		if (definedActivities) {
			this.definedActivities = definedActivities;
		}

		if (units) {
			this.units = units;
		}

		if (templates) {
			this.templates = templates;
		}

		if (templateSets) {
			this.templateSets = templateSets;
		}

		if (activeTemplate) {
			this.activeTemplate = activeTemplate;
		}
	}

	getActivitiesId(): string {
		return this.activities ? this.activities : '-1';
	}

	getDefinedActivitiesId(): string {
		return this.definedActivities ? this.definedActivities : '-1';
	}

	getUnitsId(): string {
		return this.units ? this.units : '-1';
	}

	getTemplatesId(): string {
		return this.templates ? this.templates : '-1';
	}

	getTemplateSetsId(): string {
		return this.templateSets ? this.templateSets : '-1';
	}

	getActiveTemplateId(): string {
		return this.activeTemplate ? this.activeTemplate : '-1';
	}

	setActiveTemplateId(changesId: string): void {
		this.activeTemplate = changesId;
	}

	setUnitsId(changesId: string): void {
		this.units = changesId;
	}

	setActivitiesId(changesId: string): void {
		this.activities = changesId;
	}

	setDefinedActivitiesId(changesId: string): void {
		this.definedActivities = changesId;
	}

	setTemplatesId(changesId: string): void {
		this.templates = changesId;
	}

	setTemplateSetsId(changesId: string): void {
		this.templateSets = changesId;
	}
}
