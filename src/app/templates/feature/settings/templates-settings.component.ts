import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Reactive } from '../../../common/cdk/reactive';
import { TemplateSetsRepository } from '../../store/sets/template-sets.repository';
import { ActiveTemplateSetService } from '../../store/sets/active-template-set.service';
import { TemplateSetsService } from '../../store/sets/template-sets.service';
import { MatDialog } from '@angular/material/dialog';
import { TemplateSetDialogComponent } from './template-set-dialog.component';
import { combineLatest } from 'rxjs';

@Component({
	template: `
		<div class="ac-templates-title">
			<h2>
				<mat-icon [routerLink]="'../'">west</mat-icon>
				Templates settings
			</h2>
		</div>

		<div class="ac-templates-set-list">

			<div class="ac-templates-set-item">

				<div>#</div>

				<div>
					Template set name
				</div>

				<div></div>
			</div>

			<div *ngFor="let set of templateSets; let i = index"
				 class="ac-templates-set-item">

				<div>{{i + 1}}</div>

				<div>
					{{set}}
				</div>

				<mat-icon *ngIf="!isTemplateDefault(set)"
						  (click)="deleteTemplateSet(set)">
					delete
				</mat-icon>
			</div>

		</div>

		<button mat-icon-button
				[type]="'button'"
				[disableRipple]="true"
				(click)="openTemplateSetDialog()">
			<mat-icon (click)="openTemplateSetDialog()">add_circle</mat-icon>
		</button>
	`,
	host: {
		'[class.templates-settings]': 'true'
	},
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplatesSettingsComponent extends Reactive implements OnInit {

	activeTemplateSet: string;

	templateSets: Array<string>;

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
			.subscribe(([templateSets, activeTemplateSet]: [Array<string>, string]) => {
				this.templateSets = templateSets;
				this.activeTemplateSet = activeTemplateSet;
				this.changeDetectorRef.detectChanges();
			});
	}

	openTemplateSetDialog(): void {
		this.matDialog
			.open(TemplateSetDialogComponent, {
				panelClass: 'activity-calendar-dialog'
			});
	}

	isTemplateDefault(templateSetName: string): boolean {
		return templateSetName === 'default';
	}

	deleteTemplateSet(templateSetName: string): void {
		this.templateSetsService
			.deleteTemplate(templateSetName)
			.subscribe();
	}
}
