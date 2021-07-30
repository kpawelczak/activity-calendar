import { Injectable } from '@angular/core';
import { UnitsRepository } from './units.repository';
import { FirebaseUnitsService } from '../../infrastructure/firebase-units.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class UnitsService {

	constructor(private readonly unitsRepository: UnitsRepository,
				private readonly firebaseUnitsService: FirebaseUnitsService) {
	}

	addUnit(unit: string): Observable<void> {
		this.unitsRepository.getValues().push(unit);
		return this.firebaseUnitsService
				   .replaceUnits(this.unitsRepository.getValues())
				   .pipe(
					   map(() => this.unitsRepository.next(this.unitsRepository.getValues()))
				   );
	}

	deleteUnit(deletedUnit: string): void {
		const filteredUnits = this.unitsRepository.getValues().filter((unit: string) => deletedUnit !== unit);
		this.firebaseUnitsService
			.replaceUnits(filteredUnits)
			.subscribe(() => {
				this.unitsRepository.next(filteredUnits);
			});
	}
}
