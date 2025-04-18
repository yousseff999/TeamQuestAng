import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './FrontOffice/login/login.component';
import { HomeComponent } from './FrontOffice/home/home.component';
import { AdminComponent } from './BackOffice/admin/admin.component';
import { SignUpComponent } from './FrontOffice/sign-up/sign-up.component';
import { ShoweventComponent } from './BackOffice/showevent/showevent.component';
import { UpdateeventComponent } from './BackOffice/updateevent/updateevent.component';
import { AddeventComponent } from './BackOffice/addevent/addevent.component';
import { EventcategoryComponent } from './BackOffice/eventcategory/eventcategory.component';

const routes: Routes = [
  {path: '',component: HomeComponent},
  {path: 'login',component: LoginComponent},
  {path: 'signup',component: SignUpComponent},
  {path: 'home/:userId',component: HomeComponent,canActivate: [AuthGuard],data: { roles: ['USER'] }},
  {path: 'admin/:userId',component: AdminComponent,canActivate: [AuthGuard],data: { roles: ['ADMIN'] }},
  {path: 'showevent',component: ShoweventComponent},
  {path: 'event/update/:id',component: UpdateeventComponent},
  {path: 'addevent',component: AddeventComponent},
  {path: 'eventcategory/:category',component: EventcategoryComponent},

  //{path: '',redirectTo: '/login',pathMatch: 'full'}
  { path: '**', redirectTo: '/home' } // Handle invalid routes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
