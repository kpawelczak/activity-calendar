import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RouteName } from '../../route-name';
import { HomeRootComponent } from './feature/home-root.component';

const routes = [{
	path: '',
	component: HomeRootComponent,
	children: [{
		path: RouteName.HOME,
		component: HomeRootComponent
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
export class HomeRoutingModule {

}

