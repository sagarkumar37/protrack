import { Injectable } from '@angular/core';
import { FetchUserRoleService } from '../services/admin-report-services/fetch-user-role.service'; 
@Injectable({
  providedIn: 'root'
})
export class Auth2Service {
  private userRole: string;

  constructor(private fetchUserRoleService: FetchUserRoleService) { }

  getUserRole(): string {
    return this.userRole;
  }

  setUserRole(role: string): void {
    this.userRole = role;
  }

  isAuthenticated(): boolean {
    return this.userRole === 'admin';
  }

  checkUserRole(): void {
    this.fetchUserRoleService.getEmployeeRole().subscribe(
      (response) => {
        this.setUserRole(response.role);  // Assuming the API response has a role field
      },
      (error) => {
        console.error('Error fetching user role:', error);
      }
    );
  }
}