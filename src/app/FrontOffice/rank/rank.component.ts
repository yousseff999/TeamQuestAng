import { Component, OnInit } from '@angular/core';
import { DepartmentService } from 'src/app/services/department.service';
import { TeamService } from 'src/app/services/team.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-rank',
  templateUrl: './rank.component.html',
  styleUrls: ['./rank.component.css']
})
export class RankComponent implements OnInit {
  teamScores: [string, number][] = [];
  userScores: [string, number][] = [];
  departmentScores: [string, number][] = [];
  constructor(private teamService: TeamService, private userService: UserService,private departmentService: DepartmentService) {}

  ngOnInit(): void {
    this.teamService.getTeamNamesAndScores().subscribe({
      next: (data) => {
        this.teamScores = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des scores des équipes', err);
      }
    });
   this.userService.getUsersByScoreDesc().subscribe({
      next: (data) => {
        // Map the response to an array of [username, score] tuples
        this.userScores = data.map((user) => [user.username, user.score]);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des scores des utilisateurs', err);
      }
    });
  this.departmentService.getDepartmentNamesAndScores().subscribe({
      next: (data) => {
        // Assignation des scores des départements à la variable locale
        this.departmentScores = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des scores des départements', err);
      }
    });
  }
}
