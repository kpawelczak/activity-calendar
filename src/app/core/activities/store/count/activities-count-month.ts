export class ActivitiesCountMonth {

	private count: number;

	constructor(readonly month: number,
				count: number) {
		if (count !== undefined) {
			this.count = count;
		}
	}

	getCount() {
		return this.count;
	}

	incrementCount(): void {
		this.count = this.count + 1;
	}

	decrementCount(): void {
		this.count -= 1;
	}

}
