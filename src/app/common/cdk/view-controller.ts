import { BehaviorSubject, Observable } from 'rxjs';

export abstract class ViewController<T> {

	private readonly view$ = new BehaviorSubject<T>(this.getInitialValue());

	protected abstract getInitialValue(): T;

	onView(): Observable<T> {
		return this.view$.asObservable();
	}

	switchView(view: T): void {
		this.view$.next(view);
	}
}
