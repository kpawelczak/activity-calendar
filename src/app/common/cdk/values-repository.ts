import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { Reactive } from './reactive';
import { OnDestroy } from '@angular/core';
import { isNotNullOrUndefined } from 'codelyzer/util/isNotNullOrUndefined';

export abstract class ValuesRepository<T> extends Reactive implements OnDestroy {

	private values: T;

	private readonly values$: Subject<T>;

	protected constructor(value?: T) {
		super();
		if (isNotNullOrUndefined(value)) {
			this.values = value;
			this.values$ = new BehaviorSubject<T>(value);
		} else {
			this.values$ = new ReplaySubject<T>(1);
		}
	}

	onValues(): Observable<T> {
		return this.values$.asObservable();
	}

	next(values: T): void {
		this.values = values;
		this.values$.next(values);
	}

	getValues(): T {
		return this.values;
	}

	reset(): void {
		this.next(null);
	}
}
