import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FirebaseTemplateCountersService } from '../../infrastructure/firebase-template-counters.service';
import { TemplateCounter } from './template-counter';
import { SmartRepository } from '../../../common/cdk/smart-repository';

@Injectable()
export class WeekdayTemplateCountersRepository extends SmartRepository<TemplateCounter> {

	constructor(private readonly firebaseTemplateCountersService: FirebaseTemplateCountersService) {
		super();
	}

	getValuesFromApi(): Observable<TemplateCounter> {
		return this.firebaseTemplateCountersService.getTemplateCounters();
	}

	updateCounter(counter: TemplateCounter): void {
		const templateCounters = {
			...this.getValues(),
			...counter
		};
		this.next(templateCounters);
	}

}
