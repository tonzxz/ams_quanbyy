import { Injectable } from '@angular/core';

export interface User {
  fullname: string;
  username: string;
  password: string;
  role:'superadmin'|'accounting'|'supply'|'bac'|'inspection'|'end-user';
  profile: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Dummy user data with different roles
  private users: User[] = [
    {
      fullname: 'John Doe',
      username: 'accounting',
      password: 'test',
      role: 'accounting',
      profile: 'profile-pic-url-1'
    },
    {
      fullname: 'Jane Smith',
      username: 'superadmin',
      password: 'test',
      role: 'superadmin',
      profile: 'profile-pic-url-2'
    },
    {
      fullname: 'Alice Johnson',
      username: 'supply',
      password: 'test',
      role: 'supply',
      profile: 'profile-pic-url-3'
    },
    {
      fullname: 'Bob Brown',
      username: 'bac',
      password: 'test',
      role: 'bac',
      profile: 'profile-pic-url-4'
    },
    {
      fullname: 'Charlie White',
      username: 'inspection',
      password: 'test',
      role: 'inspection',
      profile: 'profile-pic-url-5'
    },
    {
      fullname: 'Diana Green',
      username: 'enduser',
      password: 'test',
      role: 'end-user',
      profile: 'profile-pic-url-6'
    }
  ];
  

  user?:User;

  constructor() { }

  login(username:string, password:string){

  }

  logout(){
    this.user = undefined;
  }

}
