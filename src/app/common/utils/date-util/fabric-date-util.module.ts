import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FabricDateUtilService } from './fabric-date-util.service';

@NgModule({
	imports: [
		CommonModule
	],
	providers: [
		FabricDateUtilService
	]
})
export class FabricDateUtilModule {

}
