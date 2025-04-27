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

const routes: Routes = [
  {path: '',component: UsercheckComponent},
  {path: 'login',component: LoginComponent},
  {path: 'signup',component: SignUpComponent},
  {path: 'home/:userId',component: HomeComponent,canActivate: [AuthGuard],data: { roles: ['USER'] }},
  {path: 'admin/:userId',component: AdminComponent,canActivate: [AuthGuard],data: { roles: ['ADMIN'] }},
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
  //{path: '',redirectTo: '/login',pathMatch: 'full'}
  //{ path: '**', redirectTo: '/home' } // Handle invalid routes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
