export class DomainChanges {

	private activities: string;

	private definedActivities: string;

	private units: string;

	constructor(activities?: string,
				definedActivities?: string,
				units?: string) {
		if (activities) {
			this.activities = activities;
		}

		if (definedActivities) {
			this.definedActivities = definedActivities;
		}

		if (units) {
			this.units = units;
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

	setUnitsId(changesId: string): void {
		this.units = changesId;
	}

	setActivitiesId(changesId: string): void {
		this.activities = changesId;
	}

	setDefinedActivitiesId(changesId: string): void {
		this.definedActivities = changesId;
	}
}
