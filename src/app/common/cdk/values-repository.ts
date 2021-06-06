import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { Reactive } from './reactive';

export abstract class ValuesRepository<T> extends Reactive {

	private values: T;

	private readonly values$: Subject<T>;

	protected constructor(value?: T) {
		super();
		if (value) {
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
