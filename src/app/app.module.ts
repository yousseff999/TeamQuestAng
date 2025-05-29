import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './FrontOffice/home/home.component';
import { AdminComponent } from './BackOffice/admin/admin.component';
import { LoginComponent } from './FrontOffice/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignUpComponent } from './FrontOffice/sign-up/sign-up.component';
import { ResetPwdComponent } from './FrontOffice/reset-pwd/reset-pwd.component';
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
import { MatDialogModule } from '@angular/material/dialog';
import { EventService } from './services/event.service';
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
import { NgChartsModule } from 'ng2-charts';
import { EventscategoryComponent } from './FrontOffice/eventscategory/eventscategory.component';
import { PackmanComponent } from './FrontOffice/packman/packman.component';
import { ActivitiesineventsComponent } from './FrontOffice/activitiesinevents/activitiesinevents.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AdminComponent,
    LoginComponent,
    SignUpComponent,
    ResetPwdComponent,
    ShoweventComponent,
    UpdateeventComponent,
    AddeventComponent,
    EventcategoryComponent,
    AddusertoeventComponent,
    UsercheckComponent,
    TeamcreationComponent,
    AllteamsComponent,
    JointeamComponent,
    CreatechallengeComponent,
    QuestionComponent,
    MapDialogComponent,
    AddactivityComponent,
    AllactivitiesComponent,
    UpdateactivityComponent,
    AllusersComponent,
    AlldepatmentsComponent,
    CreatedepatmentComponent,
    AlleventsComponent,
    GetstartedComponent,
    PortfolioComponent,
    RankComponent,
    CreatedefiComponent,
    MyteamComponent,
    AlldefiComponent,
    DefisubmissionsComponent,
    PredictionComponent,
    MemoryGameComponent,
    UndercoverGameComponent,
    RouletteGameComponent,
    MysteryPuzzleGameComponent,
    EventscategoryComponent,
    PackmanComponent,
    ActivitiesineventsComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    NgChartsModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
