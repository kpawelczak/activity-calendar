export interface LocalActivitiesCountByMonth {
	month: number;
	count: number;
}

export interface LocalActivitiesCount {
	year: number;
	months: Array<LocalActivitiesCountByMonth>;
}
