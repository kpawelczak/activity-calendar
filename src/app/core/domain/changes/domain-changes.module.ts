import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseChangesService } from './infrastructure/firebase-changes.service';
import { DomainChangesRepository } from './store/domain-changes.repository';
import { DomainChangesService } from './store/domain-changes.service';

const providers = [
	FirebaseChangesService,
	DomainChangesRepository,
	DomainChangesService
];

@NgModule({
	imports: [
		CommonModule
	],
	providers
})
export class DomainChangesModule {

	static forRoot(): ModuleWithProviders<DomainChangesModule> {
		return {
			ngModule: DomainChangesModule,
			providers
		};
	}

	static forFeature(): ModuleWithProviders<DomainChangesModule> {
		return {
			ngModule: DomainChangesModule,
			providers: []
		};
	}
}
