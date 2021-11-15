import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Reactive } from '../../../../common/cdk/reactive';
import { TemplateSetsRepository } from '../../store/sets/template-sets.repository';
import { ActiveTemplateSetService } from '../../store/sets/active-template-set.service';
import { TemplateSetsService } from '../../store/sets/template-sets.service';
import { MatDialog } from '@angular/material/dialog';
import { TemplateSetDialogComponent } from './template-set-dialog.component';
import { combineLatest } from 'rxjs';
import { TemplateSet } from '../../store/sets/template-set';
import { tap } from 'rxjs/operators';

@Component({
	template: `
		<div class="ac-title">
			<h2>
				<mat-icon [routerLink]="'../'">west</mat-icon>
				Templates settings
			</h2>
		</div>

		<div class="ac-templates-set-list">

			<div class="ac-templates-set-item no-hover">

				<div>#</div>

				<div>
					Template set name
				</div>

				<div></div>
			</div>

			<div *ngFor="let set of templateSets; let i = index"
				 [class.no-hover]="isTemplateSetDefault(set)"
				 (click)="openTemplateSetDialog(set)"
				 class="ac-templates-set-item">

				<div>{{i + 1}}</div>

				<div>
					{{set.name}}
				</div>

				<mat-icon *ngIf="!isTemplateSetDefault(set)"
						  (click)="deleteTemplateSet(set)">
					delete
				</mat-icon>
			</div>

		</div>

		<div class="add-button-wrapper">
			<button mat-icon-button
					[type]="'button'"
					[disableRipple]="true"
					(click)="openTemplateSetDialog()">
				<mat-icon>add_circle</mat-icon>
			</button>
		</div>
	`,
	host: {
		'[class.templates-settings]': 'true'
	},
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplatesSettingsComponent extends Reactive implements OnInit {

	activeTemplateSet: string;

	templateSets: Array<TemplateSet>;

	constructor(private readonly templateSetsRepository: TemplateSetsRepository,
				private readonly templateSetsService: TemplateSetsService,
				private readonly activeTemplateSetService: ActiveTemplateSetService,
				private readonly matDialog: MatDialog,
				private readonly changeDetectorRef: ChangeDetectorRef) {
		super();
	}

	ngOnInit() {
		combineLatest([
			this.templateSetsRepository.onValues(),
			this.activeTemplateSetService.onValues()
		])
			.pipe(
				this.takeUntil()
			)
			.subscribe(([templateSets, activeTemplateSet]: [Array<TemplateSet>, string]) => {
				this.templateSets = templateSets;
				this.activeTemplateSet = activeTemplateSet;
				this.changeDetectorRef.detectChanges();
			});
	}

	openTemplateSetDialog(templateSet?: TemplateSet): void {
		if (!this.isTemplateSetDefault(templateSet)) {
			this.matDialog
				.open(TemplateSetDialogComponent, {
					panelClass: 'activity-calendar-dialog',
					data: {
						templateSet
					}
				});
		}
	}

	isTemplateSetDefault(templateSet: TemplateSet): boolean {
		return templateSet?.uuid === 'default';
	}

	deleteTemplateSet(templateSet: TemplateSet): void {
		event.preventDefault();
		event.stopPropagation();
		this.templateSetsService
			.deleteTemplate(templateSet)
			.pipe(tap(console.log))
			.subscribe();
	}
}
