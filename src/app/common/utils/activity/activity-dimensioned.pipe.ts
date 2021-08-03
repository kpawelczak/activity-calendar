import { Pipe, PipeTransform } from '@angular/core';
import { ActivityDimensioned } from '../../../activities/store/activities/activity-dimensioned';

@Pipe({ name: 'activityDimensioned' })
export class ActivityDimensionedPipe implements PipeTransform {

	transform(value: Array<ActivityDimensioned>, ...args): any {
		return value.map((activityDimensioned: ActivityDimensioned, index: number) => {
			const coma = index > 0 ? ', ' : '';
			return activityDimensioned.value + ' ' + activityDimensioned.unit + coma;
		});
	}
}
