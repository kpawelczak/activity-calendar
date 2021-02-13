import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseProfileService } from './firebase-profile.service';

@NgModule({
	imports: [
		CommonModule
	],
	providers: [
		FirebaseProfileService
	]
})
export class FirebaseProfileModule {

}
