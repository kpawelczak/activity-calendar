import { Injectable } from '@angular/core';
import { SmartRepository } from '../../../common/cdk/smart-repository';
import { Observable } from 'rxjs';
import { FirebaseActiveTemplateSetService } from '../../infrastructure/firebase-active-template-set.service';
import { take } from 'rxjs/operators';


@Injectable()
export class ActiveTemplateSetService extends SmartRepository<string> {

	constructor(private readonly firebaseActiveTemplateSetService: FirebaseActiveTemplateSetService) {
		super();
	}

	getValuesFromApi(): Observable<string> {
		return this.firebaseActiveTemplateSetService
				   .getActiveTemplateSet()
				   .pipe(take(1));
	}

	selectTemplateSet(templateSetName: string): void {
		this.firebaseActiveTemplateSetService
			.changeActiveTemplateSet(templateSetName)
			.then(() => {
				this.next(templateSetName);
			});
	}
}
