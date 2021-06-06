import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { Reactive } from '../../common/cdk/reactive';
import { Weekday } from '../store/weekday';


@Component({
	selector: 'ac-templates',
	template: `
		<div class="ac-templates-title">
			<h2>Active templates</h2>
		</div>

		<template-settings></template-settings>

		<mat-accordion multi>

			<ac-weekday-template *ngFor="let weekday of weekdays"
								 [weekday]="weekday"></ac-weekday-template>

		</mat-accordion>

	`,
	host: {
		'[class.ac-templates]': 'true'
	},
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplatesComponent extends Reactive implements OnInit {

	@ViewChild(MatAccordion)
	accordion: MatAccordion;

	weekdays: Array<Weekday> = this.getWeekdays();

	constructor(private readonly changeDetectorRef: ChangeDetectorRef) {
		super();
	}

	ngOnInit() {

	}

	getWeekdays(): Array<Weekday> {
		const weekdays = Object.values(Weekday)
							   .map((value: Weekday) => value)
							   .filter(value => typeof value === 'number');

		weekdays.push(weekdays.shift());

		return weekdays;
	}
}
