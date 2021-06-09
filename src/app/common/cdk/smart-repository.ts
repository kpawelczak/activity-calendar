import { Observable } from 'rxjs';
import { ValuesRepository } from './values-repository';
import { map } from 'rxjs/operators';
import { OnDestroy } from '@angular/core';

export abstract class SmartRepository<T> extends ValuesRepository<T> implements OnDestroy{

	protected requested: boolean;

	abstract getValuesFromApi(): Observable<T>;

	onValues(): Observable<T> {
		const requestFromApi = !this.getValues() && !this.requested;
		return requestFromApi ? this.getValuesFromApi()
									.pipe(
										map((value: T) => {
											this.requested = true;
											this.next(value);
											return value;
										})
									) : super.onValues();
	}

	reset(): void {
		super.reset();
		this.requested = false;
	}
}
