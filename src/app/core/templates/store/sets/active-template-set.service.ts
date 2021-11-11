import { Injectable } from '@angular/core';
import { SmartRepository } from '../../../../common/cdk/smart-repository';
import { Observable } from 'rxjs';
import { FirebaseActiveTemplateSetService } from '../../infrastructure/firebase-active-template-set.service';
import { take } from 'rxjs/operators';
import { TemplateSet } from './template-set';


@Injectable()
export class ActiveTemplateSetService extends SmartRepository<TemplateSet> {

	constructor(private readonly firebaseActiveTemplateSetService: FirebaseActiveTemplateSetService) {
		super();
	}

	getValuesFromApi(): Observable<TemplateSet> {
		return this.firebaseActiveTemplateSetService
				   .getActiveTemplateSet()
				   .pipe(take(1));
	}

	selectTemplateSet(templateSet: TemplateSet): void {
		this.firebaseActiveTemplateSetService
			.changeActiveTemplateSet(templateSet)
			.then(() => {
				this.next(templateSet);
			});
	}
}
