import { Pipe, PipeTransform } from '@angular/core';
import { QuantifiedActivity } from './quantified-activity';

@Pipe({ name: 'quantifiedActivity' })
export class QuantifiedActivityPipe implements PipeTransform {

	transform(value: Array<QuantifiedActivity>, ...args): any {
		return value.map((quantifiedActivity: QuantifiedActivity, index: number) => {
			const space = index > 0 ? ' ' : '';
			return space + quantifiedActivity.value + ' ' + quantifiedActivity.unit;
		});
	}
}
