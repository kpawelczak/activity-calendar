import { Observable } from 'rxjs';
import { ValuesRepository } from './values-repository';

export abstract class SmartRepository<T> extends ValuesRepository<T> {

	protected requested: boolean;

	abstract getValuesFromApi(): Observable<T>;

	onValues(): Observable<T> {
		const requestFromApi = !this.getValues() && !this.requested;
		return requestFromApi ? this.getValuesFromApi() : super.onValues();
	}
}
