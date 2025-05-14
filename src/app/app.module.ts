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
import { EventComponent } from './FrontOffice/event/event.component';
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

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AdminComponent,
    LoginComponent,
    SignUpComponent,
    ResetPwdComponent,
    EventComponent,
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
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
