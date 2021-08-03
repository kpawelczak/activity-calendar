import { NgModule } from '@angular/core';
import { ActivityDimensionedPipe } from './activity-dimensioned.pipe';

@NgModule({
	declarations: [
		ActivityDimensionedPipe
	],
	exports: [
		ActivityDimensionedPipe
	]
})
export class ActivityDimensionedModule {

}
