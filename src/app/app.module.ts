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
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
