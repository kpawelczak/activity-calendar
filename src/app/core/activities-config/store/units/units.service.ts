import { Injectable } from '@angular/core';
import { UnitsRepository } from './units.repository';
import { FirebaseUnitsService } from '../../infrastructure/firebase-units.service';
import { Observable, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { DomainChangesService } from '../../../domain/changes/store/domain-changes.service';
import { AuthenticationService } from '../../../../authentication/authentication.service';
import { ActivitiesConfigStorage } from '../../storage/activities-config.storage';
import { DomainChangesType } from '../../../domain/changes/domain-changes.type';

@Injectable()
export class UnitsService {

	constructor(private readonly unitsRepository: UnitsRepository,
				private readonly firebaseUnitsService: FirebaseUnitsService,
				private readonly activitiesConfigStorage: ActivitiesConfigStorage,
				private readonly domainChangesService: DomainChangesService,
				private readonly authService: AuthenticationService) {
	}

	addUnit(unit: string): Observable<void> {
		const units = this.unitsRepository.getValues();

		units.push(unit);

		return this.firebaseUnitsService
				   .replaceUnits(units)
				   .pipe(
					   switchMap(() => {
						   this.unitsRepository.next(units);

						   return this.authService.onLoggedIn();
					   }),
					   switchMap((loggedIn: boolean) => {
						   this.activitiesConfigStorage.storeUnits(units, loggedIn);
						   return loggedIn ? this.domainChangesService.registerNewChange(DomainChangesType.UNITS) : of(null);
					   }),
					   map((changesId: string) => {
						   this.activitiesConfigStorage.updateChangesId(changesId);
						   return;
					   }),
					   take(1)
				   );
	}

	deleteUnit(deletedUnit: string): void {
		const filteredUnits = this.unitsRepository.getValues().filter((unit: string) => deletedUnit !== unit);
		this.firebaseUnitsService
			.replaceUnits(filteredUnits)
			.pipe(
				switchMap(() => {
					this.unitsRepository.next(filteredUnits);
					return this.authService.onLoggedIn();
				}),
				switchMap((loggedIn: boolean) => {
					this.activitiesConfigStorage.storeUnits(filteredUnits, loggedIn);
					return loggedIn ? this.domainChangesService.registerNewChange(DomainChangesType.UNITS) : of(null);
				}),
				take(1)
			)
			.subscribe((changesId: string) => {
				this.activitiesConfigStorage.updateChangesId(changesId);
			});
	}
}
