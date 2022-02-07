import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientListComponent } from 'src/app/clients/client-list.component';
import { AuthGuard } from 'src/app/auth/guards/auth.guard';


const routes: Routes = [
  {path: 'clients', component: ClientListComponent, pathMatch: 'full', canActivate: [AuthGuard]},
  {path: 'login', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)},
  {path: '', redirectTo: 'login', pathMatch: 'full'},
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
