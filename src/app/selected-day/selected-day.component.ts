import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActiveDateService } from '../calendar/active-date.service';
import { Reactive } from '../common/reactive';
import { CalendarFirebaseService } from '../firebase/calendar-firebase.service';
import { take } from 'rxjs/operators';

@Component({
	selector: 'act-selected-day',
	template: `
		<ng-container *ngIf="selectedDay">
			Selected Date: {{selectedDay | date:'EEEE, MMMM d, y'}}

			<button (click)="addActivity()">add</button>
		</ng-container>
	`,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectedDayComponent extends Reactive implements OnInit {

	selectedDay: Date;

	constructor(private readonly selectedDayService: ActiveDateService,
				private readonly calendarFirebaseService: CalendarFirebaseService,
				private readonly changeDetectorRef: ChangeDetectorRef) {
		super();
	}

	ngOnInit() {
		this.selectedDayService
			.observeSelectedDate()
			.pipe(this.takeUntil())
			.subscribe((selectedDate: Date) => {
				this.selectedDay = selectedDate;
				this.changeDetectorRef.detectChanges();
			});
	}

	addActivity(): void {
		this.calendarFirebaseService
			.getPublic()
			.pipe(take(1))
			.subscribe(console.log);
	}
}
