import { Pipe, PipeTransform } from '@angular/core';
import { ActivityDimensioned } from '../../../core/activities/store/activities/activity-dimensioned';

@Pipe({ name: 'activityDimensioned' })
export class ActivityDimensionedPipe implements PipeTransform {

	transform(value: Array<ActivityDimensioned>, ...args): any {
		return value.map((activityDimensioned: ActivityDimensioned, index: number) => {
			const space = index > 0 ? ' ' : '';
			return space + activityDimensioned.value + ' ' + activityDimensioned.unit;
		});
	}
}
