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
import { AddusertoeventComponent } from './BackOffice/addusertoevent/addusertoevent.component';
import { UsercheckComponent } from './FrontOffice/usercheck/usercheck.component';
import { TeamcreationComponent } from './FrontOffice/teamcreation/teamcreation.component';
import { AllteamsComponent } from './BackOffice/allteams/allteams.component';
import { JointeamComponent } from './FrontOffice/jointeam/jointeam.component';
import { CreatechallengeComponent } from './FrontOffice/createchallenge/createchallenge.component';
import { QuestionComponent } from './FrontOffice/question/question.component';
import { MapDialogComponent } from './map-dialog/map-dialog.component';
import { AddactivityComponent } from './BackOffice/addactivity/addactivity.component';
import { AllactivitiesComponent } from './BackOffice/allactivities/allactivities.component';
import { UpdateactivityComponent } from './BackOffice/updateactivity/updateactivity.component';
import { AllusersComponent } from './BackOffice/allusers/allusers.component';
import { AlldepatmentsComponent } from './BackOffice/alldepatments/alldepatments.component';
import { CreatedepatmentComponent } from './BackOffice/createdepatment/createdepatment.component';
import { AlleventsComponent } from './FrontOffice/allevents/allevents.component';


const routes: Routes = [
  {path: '',component: UsercheckComponent},
  {path: 'login',component: LoginComponent},
  {path: 'signup',component: SignUpComponent},
  {path: 'home',component: HomeComponent,canActivate: [AuthGuard],data: { roles: ['USER'] }},
  {path: 'admin',component: AdminComponent,canActivate: [AuthGuard],data: { roles: ['ADMIN'] }},
  {path: 'showevent',component: ShoweventComponent},
  {path: 'event/update/:id',component: UpdateeventComponent},
  {path: 'addevent',component: AddeventComponent},
  {path: 'eventcategory/:category',component: EventcategoryComponent},
  {path: 'addusertoevent/:id',component: AddusertoeventComponent},
  {path: 'teamcreation',component: TeamcreationComponent},
  {path: 'allteams',component: AllteamsComponent},
  {path: 'jointeam',component: JointeamComponent},
  {path: 'createchallenge',component: CreatechallengeComponent},
  {path: 'questions',component: QuestionComponent},
  {path: 'maps',component: MapDialogComponent},
  {path: 'addactivity',component: AddactivityComponent},
  {path: 'allactivities',component: AllactivitiesComponent},
  {path: 'updateactivity',component: UpdateactivityComponent},
  {path: 'allusers',component: AllusersComponent},
  {path: 'alldepartments',component: AlldepatmentsComponent},
  {path: 'createdepartment',component: CreatedepatmentComponent},
  {path: 'allevents',component: AlleventsComponent},
  //{path: '',redirectTo: '/login',pathMatch: 'full'}
  //{ path: '**', redirectTo: '/home' } // Handle invalid routes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
