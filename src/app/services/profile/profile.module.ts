import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileService } from './profile.service';

@NgModule({
	imports: [
		CommonModule
	],
	providers: [
		ProfileService
	]
})
export class ProfileModule {

}
