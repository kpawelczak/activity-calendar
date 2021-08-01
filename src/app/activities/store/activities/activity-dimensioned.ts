export class ActivityDimensioned {

	private value: string;

	private unit: string;

	constructor(value: string,
				unit: string) {

		if (value) {
			this.value = value;
		}

		if (unit) {
			this.unit = unit;
		}
	}

	getValue(): string {
		return this.value;
	}

	getUnit(): string {
		return this.unit;
	}

	setValue(value: string): void {
		this.value = value;
	}

	setUnit(value: string): void {
		this.unit = value;
	}

}
