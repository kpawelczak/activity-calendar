import { Injectable } from '@angular/core';
import { DomainChangesRepository } from './domain-changes.repository';
import { DomainChangesType } from '../domain-changes.type';
import { FirebaseChangesService } from '../infrastructure/firebase-changes.service';
import { map, take } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable()
export class DomainChangesService {

	private savedChanges: Array<DomainChangesType> = [];

	constructor(private readonly changesRepository: DomainChangesRepository,
				private readonly firebaseChangesService: FirebaseChangesService) {
	}

	registerNewChange(type: DomainChangesType): Observable<any> {
		return this.shouldUpdateChangesId(type)
			? this.firebaseChangesService
				  .registerNewChanges(type)
				  .pipe(
					  map((changesId: string) => {
						  this.savedChanges.push(type);
						  this.next(type, changesId);
						  return changesId;
					  }),
					  take(1)
				  )
			: of(null);
	}

	reset(): void {
		this.savedChanges = [];
		this.changesRepository.reset();
	}

	private next(type: DomainChangesType, changesId: string): void {

		const currentChanges = this.changesRepository.getValues();

		switch (type) {

			case DomainChangesType.ACTIVITIES: {
				currentChanges.setActivitiesId(changesId);
				break;
			}

			case DomainChangesType.DEFINED_ACTIVITIES: {
				currentChanges.setDefinedActivitiesId(changesId);
				break;
			}

			case DomainChangesType.UNITS: {
				currentChanges.setUnitsId(changesId);
				break;
			}

			case DomainChangesType.TEMPLATES: {
				currentChanges.setTemplatesId(changesId);
				break;
			}

			case DomainChangesType.TEMPLATES_SET: {
				currentChanges.setTemplateSetsId(changesId);
				break;
			}

			case DomainChangesType.ACTIVE_TEMPLATE: {
				currentChanges.setActiveTemplateId(changesId);
				break;
			}
		}

		this.changesRepository.next(currentChanges);
	}

	private shouldUpdateChangesId(type: DomainChangesType) {
		return this.savedChanges.indexOf(type) === -1;
	}
}
