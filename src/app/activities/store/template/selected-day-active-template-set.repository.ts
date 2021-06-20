import { Injectable } from '@angular/core';
import { ValuesRepository } from '../../../common/cdk/values-repository';

@Injectable()
export class SelectedDayActiveTemplateSetRepository extends ValuesRepository<number> {

	private static readonly DEFAULT_WEEKDAY = new Date().getDay();

	constructor() {
		super(SelectedDayActiveTemplateSetRepository.DEFAULT_WEEKDAY);
	}
}
