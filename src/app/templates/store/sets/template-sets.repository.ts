import { Injectable } from '@angular/core';
import { SmartRepository } from '../../../common/cdk/smart-repository';
import { Observable } from 'rxjs';
import { FirebaseTemplateSetsService } from '../../infrastructure/firebase-template-sets.service';
import { map } from 'rxjs/operators';


@Injectable()
export class TemplateSetsRepository extends SmartRepository<Array<string>> {

	constructor(private readonly firebaseTemplateSets: FirebaseTemplateSetsService) {
		super();
	}

	getValuesFromApi(): Observable<Array<string>> {
		return this.firebaseTemplateSets
				   .getTemplateSets()
				   .pipe(
					   map((templateSets: Array<string>) => {
						   this.requested = true;
						   this.next(templateSets);
						   return templateSets;
					   })
				   );
	}
}
