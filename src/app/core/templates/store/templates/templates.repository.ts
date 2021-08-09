import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WeekdayTemplate } from '../weekday-template';
import { FirebaseTemplatesService } from '../../infrastructure/firebase-templates.service';
import { SmartRepository } from '../../../../common/cdk/smart-repository';
import { switchMap } from 'rxjs/operators';
import { ActiveTemplateSetService } from '../sets/active-template-set.service';


@Injectable()
export class TemplatesRepository extends SmartRepository<Array<WeekdayTemplate>> {

	constructor(private readonly firebaseTemplatesService: FirebaseTemplatesService,
				private readonly activeTemplateSetService: ActiveTemplateSetService) {
		super();
	}

	getValuesFromApi(): Observable<Array<WeekdayTemplate>> {
		return this.activeTemplateSetService
				   .onValues()
				   .pipe(
					   switchMap((templateSetName: string) => {
						   return this.firebaseTemplatesService
									  .loadTemplates(templateSetName);
					   })
				   );
	}
}
