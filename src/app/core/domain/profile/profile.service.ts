import { Injectable } from '@angular/core';
import { ValuesRepository } from '../../../common/cdk/values-repository';

@Injectable()
export class ProfileService extends ValuesRepository<string> {

	constructor() {
		super();
	}
}
