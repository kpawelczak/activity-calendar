import { Observable } from 'rxjs';
import { ValuesRepository } from './values-repository';
import { map } from 'rxjs/operators';

export abstract class SmartRepository<T> extends ValuesRepository<T> {

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
}
