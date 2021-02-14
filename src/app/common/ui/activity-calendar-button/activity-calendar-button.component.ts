import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, ViewEncapsulation } from '@angular/core';

@Component({
	selector: 'ac-button',
	template: `
		<button mat-raised-button
				[type]="type"
				[disabled]="loading"
				[style.height.px]="height">
			<mat-progress-spinner *ngIf="loading"
								  [diameter]="diameter"
								  [color]="'accent'"
								  [mode]="'indeterminate'">
			</mat-progress-spinner>
			<span *ngIf="!loading">
				<ng-content></ng-content>
			</span>
		</button>
	`,
	host: {
		'[class.ac-button]': 'true'
	},
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityCalendarButtonComponent implements AfterViewInit {

	@Input()
	loading: boolean;

	@Input()
	type: string = 'button';

	@Input()
	height: number;

	diameter = 28;

	constructor(private readonly elementRef: ElementRef) {
	}

	ngAfterViewInit() {
		this.height = this.elementRef.nativeElement.querySelector('button').offsetHeight;
		this.diameter = this.height - 8;
	}

}
