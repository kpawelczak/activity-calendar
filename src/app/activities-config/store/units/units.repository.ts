import { Injectable } from '@angular/core';
import { SmartRepository } from '../../../common/cdk/smart-repository';
import { FirebaseUnitsService } from '../../infrastructure/firebase-units.service';
import { Observable } from 'rxjs';

@Injectable()
export class UnitsRepository extends SmartRepository<Array<string>> {

	constructor(private readonly firebaseUnitsService: FirebaseUnitsService) {
		super();
	}

	getValuesFromApi(): Observable<Array<string>> {
		return this.firebaseUnitsService.loadUnits();
	}
}
