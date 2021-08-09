import { ActivityEntry } from './activity-entry';
import { v4 as uuidv4 } from 'uuid';

export class ActivityConfig {

	private uuid: string;

	constructor(readonly name: string,
				readonly entries: Array<ActivityEntry>,
				uuid?: string) {
		if (uuid) {
			this.uuid = uuid;
		}
	}

	getUUID(): string {
		return this.uuid;
	}

	setNewUUID(): void {
		this.uuid = uuidv4();
	}
}
