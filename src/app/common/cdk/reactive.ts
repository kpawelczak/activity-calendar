import { Directive, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Directive({ selector: 'reactive' })
export abstract class Reactive implements OnDestroy {

	private readonly unsubscribe$ = new Subject<void>();

	protected constructor() {
	}

	ngOnDestroy() {
		this.unsubscribe();
	}

	protected unsubscribe(): void {

		if (this.unsubscribe$.isStopped) {
			return;
		}

		this.unsubscribe$.next();
		this.unsubscribe$.complete();
	}

	protected takeUntil() {
		return takeUntil(this.unsubscribe$);
	}

}
