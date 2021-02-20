import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EntryRootComponent } from './entry-root.component';
import { LoginComponent } from './login/login.component';
import { RouteName } from '../route-name';
import { RegistrationComponent } from './registration/registration.component';

const routes = [{
	path: '',
	component: EntryRootComponent,
	children: [
		{
			path: '',
			component: LoginComponent
		}, {
			path: RouteName.REGISTRATION,
			component: RegistrationComponent
		}
	]
}];


@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild(routes)
	],
	exports: [
		RouterModule
	]
})
export class EntryRoutingModule {

}

