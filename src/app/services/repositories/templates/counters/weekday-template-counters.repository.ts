import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { FirebaseTemplateCountersService } from '../../../firebase/templates/firebase-template-counters.service';
import { TemplateCounter } from './template-counter';

@Injectable()
export class WeekdayTemplateCountersRepository {

	private templateCounters: TemplateCounter;

	private readonly templateCounters$ = new ReplaySubject<TemplateCounter>(1);

	constructor(private readonly firebaseTemplateCountersService: FirebaseTemplateCountersService) {

	}

	onTemplatesCounter(): Observable<TemplateCounter> {

		if (!this.templateCounters) {
			this.firebaseTemplateCountersService
				.getTemplateCounters()
				.subscribe((templateCounters: TemplateCounter) => {
					this.templateCounters = templateCounters;
					this.templateCounters$.next(templateCounters);
				});
		}

		return this.templateCounters$.asObservable();
	}

	next(counters: TemplateCounter): void {
		this.templateCounters = counters;
		this.templateCounters$.next(counters);
	}

	updateCounter(counter: TemplateCounter): void {
		this.templateCounters = {
			...this.templateCounters,
			...counter
		};
		this.templateCounters$.next(this.templateCounters);
	}

	reset(): void {
		this.templateCounters = null;
		this.templateCounters$.next(this.templateCounters);
	}

}
