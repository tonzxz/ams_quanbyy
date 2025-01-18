import { Injectable } from '@angular/core';

import { z } from 'zod';

export const userSchema = z.object({
  fullname: z.string().min(1, "Full name is required"), // Ensure full name is non-empty
  username: z.string().min(1, "Username is required"), // Ensure username is non-empty
  password: z.string().min(6, "Password must be at least 6 characters"), // Password must be at least 6 characters
  role: z.enum(['superadmin', 'accounting', 'supply', 'bac', 'inspection', 'end-user']), // Enums for role
  profile: z.string().min(1, "Profile is required") // Ensure profile is non-empty
});

export type User = z.infer<typeof userSchema>;

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  // Dummy user data with different roles
  private users: User[] = [
    {
      fullname: 'John Doe',
      username: 'accounting',
      password: 'test123',
      role: 'accounting',
      profile: 'profile-pic-url-1'
    },
    {
      fullname: 'Jane Smith',
      username: 'superadmin',
      password: 'test123',
      role: 'superadmin',
      profile: 'profile-pic-url-2'
    },
    {
      fullname: 'Alice Johnson',
      username: 'supply',
      password: 'test123',
      role: 'supply',
      profile: 'profile-pic-url-3'
    },
    {
      fullname: 'Bob Brown',
      username: 'bac',
      password: 'test123',
      role: 'bac',
      profile: 'profile-pic-url-4'
    },
    {
      fullname: 'Charlie White',
      username: 'inspection',
      password: 'test123',
      role: 'inspection',
      profile: 'profile-pic-url-5'
    },
    {
      fullname: 'Diana Green',
      username: 'enduser',
      password: 'test123',
      role: 'end-user',
      profile: 'profile-pic-url-6'
    }
  ];
  
  user?:User;

  constructor() { }

  // Authentication Methods
  async login(username:string, password:string){

    await (new Promise(resolve => setTimeout(resolve, 1500)))    
    for(let user of this.users){
      if(user.username == username){
        if(user.password == password){
          this.user = user;
          return;
        }else{
          throw new Error('Invalid credentials.');
        }
      }
    }
    throw new Error('User not found.');
  }

  async logout(){
    this.user = undefined;
  }
}