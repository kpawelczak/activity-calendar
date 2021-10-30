import { QuantifiedActivity } from '../../../../common/ui/quantified-activity/quantified-activity';

export class CalendarActivity {

	private assignedTemplateUUID: string = '-1';

	private activityUUID: string;

	constructor(readonly day: number,
				readonly name: string,
				readonly quantifiedActivity: Array<QuantifiedActivity>,
				options?: {
					activityUUID?: string,
					assignedTemplateUUID?: string
				}) {
		if (options?.activityUUID) {
			this.activityUUID = options.activityUUID;
		}

		if (options?.assignedTemplateUUID) {
			this.assignedTemplateUUID = options.assignedTemplateUUID;
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
