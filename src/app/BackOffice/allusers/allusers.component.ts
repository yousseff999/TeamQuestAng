import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service'; // adapte le chemin selon ton projet
import { User } from 'src/app/models/user'; // importe le modèle User si nécessaire

@Component({
  selector: 'app-allusers',
  templateUrl: './allusers.component.html',
  styleUrls: ['./allusers.component.css']
})
export class AllusersComponent implements OnInit {
  users: User[] = [];
  searchQuery: string = '';
  selectedRole: string = '';
  selectedUserId: number | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => this.users = users,
      error: (err) => console.error('Erreur lors du chargement des utilisateurs :', err)
    });
  }

  assignRole(userId: number, role: string): void {
    this.userService.assignRoleToUser(userId, role).subscribe({
      next: (updatedUser) => {
        console.log('Rôle assigné avec succès:', updatedUser);
        this.getAllUsers(); // Refresh list if needed
      },
      error: (err) => {
        console.error('Erreur lors de l’assignation du rôle :', err);
      }
    });
  }

  searchUsers(): void {
    if (!this.searchQuery.trim()) {
      this.getAllUsers();
      return;
    }
    this.userService.searchUsers(this.searchQuery).subscribe({
      next: (users) => this.users = users,
      error: (err) => console.error('Erreur lors de la recherche :', err)
    });
  }
}
