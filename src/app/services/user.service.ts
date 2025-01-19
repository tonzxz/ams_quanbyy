// import { Injectable } from '@angular/core';
// import { Router } from '@angular/router';

// import { z } from 'zod';

// export const userSchema = z.object({
//   id: z.string().length(32, "ID must be exactly 32 characters").optional(), 
//   fullname: z.string().min(1, "Full name is required"), // Ensure full name is non-empty
//   username: z.string().min(1, "Username is required"), // Ensure username is non-empty
//   password: z.string().min(6, "Password must be at least 6 characters"), // Password must be at least 6 characters
//   role: z.enum(['superadmin', 'accounting', 'supply', 'bac', 'inspection', 'end-user']), // Enums for role
//   profile: z.string().min(1, "Profile is required") // Ensure profile is non-empty
// });

// export type User = z.infer<typeof userSchema>;

// @Injectable({
//   providedIn: 'root'
// })
// export class UserService {
  
//   // Dummy user data with different roles
//   private users: User[] = [
//     {
//       fullname: 'John Doe',
//       username: 'accounting',
//       password: 'test123',
//       role: 'accounting',
//       profile: 'profile-pic-url-1'
//     },
//     {
//       fullname: 'Jane Smith',
//       username: 'superadmin',
//       password: 'test123',
//       role: 'superadmin',
//       profile: 'profile-pic-url-2'
//     },
//     {
//       fullname: 'Alice Johnson',
//       username: 'supply',
//       password: 'test123',
//       role: 'supply',
//       profile: 'profile-pic-url-3'
//     },
//     {
//       fullname: 'Bob Brown',
//       username: 'bac',
//       password: 'test123',
//       role: 'bac',
//       profile: 'profile-pic-url-4'
//     },
//     {
//       fullname: 'Charlie White',
//       username: 'inspection',
//       password: 'test123',
//       role: 'inspection',
//       profile: 'profile-pic-url-5'
//     },
//     {
//       fullname: 'Diana Green',
//       username: 'enduser',
//       password: 'test123',
//       role: 'end-user',
//       profile: 'profile-pic-url-6'
//     }
//   ];
  
//   private user?:User;

//   constructor(private router:Router) { }

  
//   getUser():User|undefined{
//     const user_string = localStorage.getItem('user');
//     if(user_string){
//       this.user = JSON.parse(user_string) as User;
//     }
//     return this.user;
//   }

//   // Authentication Methods  
//   async login(username:string, password:string){

//     await (new Promise(resolve => setTimeout(resolve, 1000)))    
//     for(let user of this.users){
//       if(user.username == username){
//         if(user.password == password){
//           this.user = user;
//           localStorage.setItem('user', JSON.stringify(this.user));
//           return;
//         }else{
//           throw new Error('Invalid credentials.');
//         }
//       }
//     }
//     throw new Error('User not found.');
//   }

//   async logout(){
//     localStorage.removeItem('user');
//     this.user = undefined;
//     this.router.navigate(['/authentication/login']);
//   }
// }


import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { z } from 'zod';

export const userSchema = z.object({
  id: z.string().length(32, "ID must be exactly 32 characters").optional(), 
  fullname: z.string().min(1, "Full name is required"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(['superadmin', 'accounting', 'supply', 'bac', 'inspection', 'end-user']),
  profile: z.string().min(1, "Profile is required")
});

export type User = z.infer<typeof userSchema>;

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = [
    {
      id: this.generateId(),
      fullname: 'John Doe',
      username: 'accounting',
      password: 'test123',
      role: 'accounting',
      profile: 'profile-pic-url-1'
    },
    {
      id: this.generateId(),
      fullname: 'Jane Smith',
      username: 'superadmin',
      password: 'test123',
      role: 'superadmin',
      profile: 'profile-pic-url-2'
    },
    {
      id: this.generateId(),
      fullname: 'Alice Johnson',
      username: 'supply',
      password: 'test123',
      role: 'supply',
      profile: 'profile-pic-url-3'
    },
    {
      id: this.generateId(),
      fullname: 'Bob Brown',
      username: 'bac',
      password: 'test123',
      role: 'bac',
      profile: 'profile-pic-url-4'
    },
    {
      id: this.generateId(),
      fullname: 'Charlie White',
      username: 'inspection',
      password: 'test123',
      role: 'inspection',
      profile: 'profile-pic-url-5'
    },
    {
      id: this.generateId(),
      fullname: 'Diana Green',
      username: 'enduser',
      password: 'test123',
      role: 'end-user',
      profile: 'profile-pic-url-6'
    }
  ];
  
  private user?: User;
  private readonly USERS_STORAGE_KEY = 'users_data';

  constructor(private router: Router) {
    this.loadUsers();
  }

  // Helper method to generate a random 32-character ID
  private generateId(): string {
    return Array.from({ length: 32 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
  }

  // Load users from localStorage
  private loadUsers() {
    const storedUsers = localStorage.getItem(this.USERS_STORAGE_KEY);
    if (storedUsers) {
      this.users = JSON.parse(storedUsers);
    } else {
      // If no stored users, save the initial dummy data
      this.saveUsers();
    }
  }

  // Save users to localStorage
  private saveUsers() {
    localStorage.setItem(this.USERS_STORAGE_KEY, JSON.stringify(this.users));
  }

  // Get all users
  getAllUsers(): Observable<User[]> {
    return of(this.users);
  }

  // Create new user
  addUser(userData: Omit<User, 'id'>): Observable<User> {
    try {
      // Validate username uniqueness
      if (this.users.some(user => user.username === userData.username)) {
        return throwError(() => new Error('Username already exists'));
      }

      // Create new user with generated ID
      const newUser: User = {
        ...userData,
        id: this.generateId(),
        profile: userData.profile || 'default-profile-pic-url' // Provide default profile pic
      };

      // Validate with Zod schema
      userSchema.parse(newUser);

      // Add to users array and save
      this.users.push(newUser);
      this.saveUsers();

      return of(newUser);
    } catch (error) {
      return throwError(() => error);
    }
  }

  // Update existing user
  updateUser(userId: string, userData: Partial<User>): Observable<User> {
  try {
    const userIndex = this.users.findIndex(user => user.id === userId);
    if (userIndex === -1) {
      return throwError(() => new Error('User not found'));
    }

    // Check username uniqueness if username is being updated
    if (
      userData.username &&
      userData.username !== this.users[userIndex].username &&
      this.users.some(user => user.username === userData.username)
    ) {
      return throwError(() => new Error('Username already exists'));
    }

    // Update user
    const updatedUser: User = {
      ...this.users[userIndex],
      ...userData,
      id: userId // Ensure ID doesn't change
    };

    // If password is empty, retain the current password
    if (!userData.password || userData.password.trim() === '') {
      updatedUser.password = this.users[userIndex].password;
    }

    // Validate with Zod schema
    userSchema.parse(updatedUser);

    // Update array and save
    this.users[userIndex] = updatedUser;
    this.saveUsers();

    // Update current user if the updated user is logged in
    if (this.user?.id === userId) {
      this.user = updatedUser;
      localStorage.setItem('user', JSON.stringify(this.user));
    }

    return of(updatedUser);
  } catch (error) {
    return throwError(() => error);
  }
}


  // Delete user
  deleteUser(userId: string): Observable<boolean> {
    const userIndex = this.users.findIndex(user => user.id === userId);
    if (userIndex === -1) {
      return throwError(() => new Error('User not found'));
    }

    // Prevent deletion of logged-in user
    if (this.user?.id === userId) {
      return throwError(() => new Error('Cannot delete currently logged-in user'));
    }

    // Remove user and save
    this.users.splice(userIndex, 1);
    this.saveUsers();

    return of(true);
  }

  getUser(): User | undefined {
    const userString = localStorage.getItem('user');
    if (userString) {
      this.user = JSON.parse(userString) as User;
    }
    return this.user;
  }

  async login(username: string, password: string) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const user = this.users.find(u => u.username === username);
    
    if (user) {
      if (user.password === password) {
        this.user = user;
        localStorage.setItem('user', JSON.stringify(this.user));
        return;
      } else {
        throw new Error('Invalid credentials.');
      }
    }
    throw new Error('User not found.');
  }

  async logout() {
    localStorage.removeItem('user');
    this.user = undefined;
    this.router.navigate(['/authentication/login']);
  }
}