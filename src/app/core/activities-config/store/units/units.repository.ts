import { Injectable } from '@angular/core';
import { SmartRepository } from '../../../../common/cdk/smart-repository';
import { FirebaseUnitsService } from '../../infrastructure/firebase-units.service';
import { Observable, of } from 'rxjs';
import { DomainChangesRepository } from '../../../domain/changes/store/domain-changes.repository';
import { ActivitiesConfigStorage } from '../../storage/activities-config.storage';
import { AuthenticationService } from '../../../../authentication/authentication.service';
import { map, switchMap, take } from 'rxjs/operators';
import { DomainChanges } from '../../../domain/changes/domain-changes';

@Injectable()
export class UnitsRepository extends SmartRepository<Array<string>> {

	constructor(private readonly firebaseUnitsService: FirebaseUnitsService,
				private readonly domainChangesRepository: DomainChangesRepository,
				private readonly activitiesConfigStorage: ActivitiesConfigStorage,
				private readonly authService: AuthenticationService) {
		super();
	}

	getValuesFromApi(): Observable<Array<string>> {
		return this.authService
				   .onLoggedIn()
				   .pipe(
					   switchMap((loggedIn: boolean) => {
						   const storedUnits = this.activitiesConfigStorage.getStoredUnits(loggedIn);
						   return loggedIn
							   ? this.onValuesWithLoggedInUser(storedUnits, loggedIn)
							   : of(storedUnits);
					   }),
					   map((units: Array<string>) => {
						   return !!units?.length ? units : [];
					   }),
					   take(1)
				   );
	}

	private onValuesWithLoggedInUser(storedUnits: Array<string>,
									 loggedIn: boolean): Observable<Array<string>> {
		return this.domainChangesRepository
				   .onValues()
				   .pipe(
					   map((domainChanges: DomainChanges) => {
						   return domainChanges.getUnitsId() === this.activitiesConfigStorage.getStoredChangesId();
					   }),
					   switchMap((checkStorage: boolean) => {
						   return checkStorage && !!storedUnits
							   ? of(storedUnits)
							   : this.firebaseUnitsService.loadUnits()
									 .pipe(
										 map((units: Array<string>) => {
											 this.activitiesConfigStorage.storeUnits(units, loggedIn);
											 return units;
										 })
									 );
					   })
				   );
	}
}
