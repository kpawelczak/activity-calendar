import { NgModule } from '@angular/core';
import { QuantifiedActivityPipe } from './quantified-activity.pipe';

@NgModule({
	declarations: [
		QuantifiedActivityPipe
	],
	exports: [
		QuantifiedActivityPipe
	]
})
export class QuantifiedActivityModule {

}
