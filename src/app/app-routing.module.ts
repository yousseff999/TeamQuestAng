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
import { GetstartedComponent } from './FrontOffice/getstarted/getstarted.component';
import { PortfolioComponent } from './FrontOffice/portfolio/portfolio.component';
import { RankComponent } from './FrontOffice/rank/rank.component';
import { CreatedefiComponent } from './BackOffice/createdefi/createdefi.component';
import { MyteamComponent } from './FrontOffice/myteam/myteam.component';
import { AlldefiComponent } from './BackOffice/alldefi/alldefi.component';
import { DefisubmissionsComponent } from './BackOffice/defisubmissions/defisubmissions.component';
import { PredictionComponent } from './BackOffice/prediction/prediction.component';
import { MemoryGameComponent } from './FrontOffice/memory-game/memory-game.component';
import { UndercoverGameComponent } from './FrontOffice/undercover-game/undercover-game.component';
import { RouletteGameComponent } from './FrontOffice/roulette-game/roulette-game.component';
import { MysteryPuzzleGameComponent } from './FrontOffice/mystery-puzzle-game/mystery-puzzle-game.component';
import { EventscategoryComponent } from './FrontOffice/eventscategory/eventscategory.component';
import { PackmanComponent } from './FrontOffice/packman/packman.component';
import { ActivitiesineventsComponent } from './FrontOffice/activitiesinevents/activitiesinevents.component';
import { GamesComponent } from './FrontOffice/games/games.component';
import { SnakeGameComponent } from './FrontOffice/snake-game/snake-game.component';
import { ForgotpasswordComponent } from './FrontOffice/forgotpassword/forgotpassword.component';
import { ResetpasswordComponent } from './FrontOffice/resetpassword/resetpassword.component';


const routes: Routes = [
  {path: '',component: UsercheckComponent},
  {path: 'login',component: LoginComponent},
  {path: 'signup',component: SignUpComponent},
  {path: 'forgot-password',component: ForgotpasswordComponent},
  {path: 'reset-password',component: ResetpasswordComponent},
  {path: 'home',component: HomeComponent,canActivate: [AuthGuard],data: { roles: ['USER'] }},
  {path: 'admin',component: AdminComponent,canActivate: [AuthGuard],data: { roles: ['ADMIN'] }},
  {path: 'showevent',component: ShoweventComponent},
  {path: 'event/update',component: UpdateeventComponent},
  {path: 'addevent',component: AddeventComponent},
  {path: 'eventcategory/:category',component: EventcategoryComponent},
  {path: 'addusertoevent',component: AddusertoeventComponent},
  {path: 'teamcreation',component: TeamcreationComponent},
  {path: 'allteams',component: AllteamsComponent},
  {path: 'jointeam',component: JointeamComponent},
  {path: 'createchallenge',component: CreatechallengeComponent},
  {path: 'questions',component: QuestionComponent},
  {path: 'maps',component: MapDialogComponent},
  {path: 'addactivity',component: AddactivityComponent},
  {path: 'allactivities',component: AllactivitiesComponent},
  {path: 'updateactivity',component: UpdateactivityComponent},
  {path: 'activities-in-event',component: ActivitiesineventsComponent},
  {path: 'allusers',component: AllusersComponent},
  {path: 'alldepartments',component: AlldepatmentsComponent},
  {path: 'createdepartment',component: CreatedepatmentComponent},
  {path: 'allevents',component: AlleventsComponent},
  {path: 'eventscategory/:category',component: EventscategoryComponent},
  {path: 'getstarted',component: GetstartedComponent},
  {path: 'portfolio',component: PortfolioComponent},
  {path: 'rank',component: RankComponent},
  {path: 'createdefi',component: CreatedefiComponent},
  {path: 'myteam',component: MyteamComponent},
  {path: 'alldefi',component: AlldefiComponent},
  {path: 'defisubmissions',component: DefisubmissionsComponent},
  {path: 'prediction',component: PredictionComponent},
  {path: 'games',component: GamesComponent},
  {path: 'memory-game',component: MemoryGameComponent},
  {path: 'undercover-game',component: UndercoverGameComponent},
  {path: 'roulette-game',component: RouletteGameComponent},
  {path: 'puzzle-game',component: MysteryPuzzleGameComponent},
  {path: 'packman-game',component: PackmanComponent},
  {path: 'snake-game',component: SnakeGameComponent},
  
   
  //{path: '',redirectTo: '/login',pathMatch: 'full'}
  //{ path: '**', redirectTo: '/home' } // Handle invalid routes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
