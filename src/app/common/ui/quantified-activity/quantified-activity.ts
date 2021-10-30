export class QuantifiedActivity {

	private activityValue: string;

	private activityUnit: string;

	constructor(readonly value: string,
				readonly unit: string) {

		if (value) {
			this.activityValue = value;
		}

		if (unit) {
			this.activityUnit = unit;
		}
	}

	getValue(): string {
		return this.activityValue;
	}

	getUnit(): string {
		return this.activityUnit;
	}

	setValue(value: string): void {
		this.activityValue = value;
	}

	setUnit(value: string): void {
		this.activityUnit = value;
	}

}
