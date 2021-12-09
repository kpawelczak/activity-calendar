export interface QuantifiedActivityFormEntry {
	value: string;
	unit: string;
}

export interface ActivityFormEntry {
	name: string;
	entries: Array<QuantifiedActivityFormEntry>;
}
