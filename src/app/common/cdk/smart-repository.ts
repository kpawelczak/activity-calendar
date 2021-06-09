import { Observable } from 'rxjs';
import { ValuesRepository } from './values-repository';
import { take } from 'rxjs/operators';
import { OnDestroy } from '@angular/core';

export abstract class SmartRepository<T> extends ValuesRepository<T> implements OnDestroy {

	protected requested: boolean;

	abstract getValuesFromApi(): Observable<T>;

	protected constructor() {
		super();
	}

	onValues(): Observable<T> {
		return this.onRequestedValues();
	}

	reset(): void {
		super.reset();
		this.requested = false;
	}

	private onRequestedValues(): Observable<T> {
		const requestFromApi = !this.getValues() && !this.requested;

		this.requested = true;

		if (requestFromApi) {
			this.getValuesFromApi()
				.pipe(take(1))
				.subscribe((value: T) => {
					this.next(value);
				});
		}

		return super.onValues();
	}
}
