import { Injectable } from '@angular/core';
import { SmartRepository } from '../../../../common/cdk/smart-repository';
import { Observable } from 'rxjs';
import { FirebaseChangesService } from '../infrastructure/firebase-changes.service';
import { DomainChanges } from '../domain-changes';

@Injectable()
export class DomainChangesRepository extends SmartRepository<DomainChanges> {

	constructor(private readonly firebaseChangesService: FirebaseChangesService) {
		super();
	}

	getValuesFromApi(): Observable<DomainChanges> {
		return this.firebaseChangesService.onChangesIds();
	}
}
