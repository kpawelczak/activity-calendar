export class CalendarActivity {

	private assignedTemplateUUID: string;

	private activityUUID: string;

	constructor(readonly day: number,
				readonly name: string,
				readonly amount: string,
				activityUUID?: string,
				assignedTemplateUUID: string = '-1') {
		if (activityUUID) {
			this.activityUUID = activityUUID;
		}

		if (assignedTemplateUUID) {
			this.assignedTemplateUUID = assignedTemplateUUID;
		}
	}

	getActivityUUID(): string {
		return this.activityUUID;
	}

	getAssignedTemplateUUID(): string {
		return this.assignedTemplateUUID;
	}

	setActivityUUID(activityUUID: string): void {
		this.activityUUID = activityUUID;
	}

	setTemplateUUID(templateUUID: string): void {
		this.assignedTemplateUUID = templateUUID;
	}
}
