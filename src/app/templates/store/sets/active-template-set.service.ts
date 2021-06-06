import { Injectable } from '@angular/core';
import { SmartRepository } from '../../../common/cdk/smart-repository';
import { Observable } from 'rxjs';
import { FirebaseActiveTemplateSetService } from '../../infrastructure/firebase-active-template-set.service';

@Injectable()
export class ActiveTemplateSetService extends SmartRepository<string> {

	constructor(private readonly firebaseActiveTemplateSetService: FirebaseActiveTemplateSetService) {
		super();
	}

	getValuesFromApi(): Observable<string> {
		return this.firebaseActiveTemplateSetService.getActiveTemplateSet();
	}
}
