//src/app/services/user.service.ts

// import { Injectable } from '@angular/core';
// import { Router } from '@angular/router';
// import { Observable, of, throwError } from 'rxjs';
// import { z } from 'zod';

// export const userSchema = z.object({
//   id: z.string().length(32, "ID must be exactly 32 characters").optional(), 
//   fullname: z.string().min(1, "Full name is required"),
//   username: z.string().min(1, "Username is required"),
//   password: z.string().min(6, "Password must be at least 6 characters"),
//   role: z.enum(['superadmin', 'accounting', 'supply', 'bac', 'inspection', 'end-user']),
//   profile: z.string().min(1, "Profile is required")
// });

// export type User = z.infer<typeof userSchema>;

// @Injectable({
//   providedIn: 'root'
// })
// export class UserService {
//   private users: User[] = [
//     {
//       id: this.generateId(),
//       fullname: 'John Doe',
//       username: 'accounting',
//       password: 'test123',
//       role: 'accounting',
//       profile: 'profile-pic-url-1'
//     },
//     {
//       id: this.generateId(),
//       fullname: 'Jane Smith',
//       username: 'superadmin',
//       password: 'test123',
//       role: 'superadmin',
//       profile: 'profile-pic-url-2'
//     },
//     {
//       id: this.generateId(),
//       fullname: 'Alice Johnson',
//       username: 'supply',
//       password: 'test123',
//       role: 'supply',
//       profile: 'profile-pic-url-3'
//     },
//     {
//       id: this.generateId(),
//       fullname: 'Bob Brown',
//       username: 'bac',
//       password: 'test123',
//       role: 'bac',
//       profile: 'profile-pic-url-4'
//     },
//     {
//       id: this.generateId(),
//       fullname: 'Charlie White',
//       username: 'inspection',
//       password: 'test123',
//       role: 'inspection',
//       profile: 'profile-pic-url-5'
//     },
//     {
//       id: this.generateId(),
//       fullname: 'Diana Green',
//       username: 'enduser',
//       password: 'test123',
//       role: 'end-user',
//       profile: 'profile-pic-url-6'
//     }
//   ];
  
//   private user?: User;
//   private readonly USERS_STORAGE_KEY = 'users_data';

//   constructor(private router: Router) {
//     this.loadUsers();
//   }

//   // Helper method to generate a random 32-character ID
//   private generateId(): string {
//     return Array.from({ length: 32 }, () => 
//       Math.floor(Math.random() * 16).toString(16)
//     ).join('');
//   }

//   // Load users from localStorage
//   private loadUsers() {
//     const storedUsers = localStorage.getItem(this.USERS_STORAGE_KEY);
//     if (storedUsers) {
//       this.users = JSON.parse(storedUsers);
//     } else {
//       // If no stored users, save the initial dummy data
//       this.saveUsers();
//     }
//   }

//   // Save users to localStorage
//   private saveUsers() {
//     localStorage.setItem(this.USERS_STORAGE_KEY, JSON.stringify(this.users));
//   }

//   // Get all users
//   getAllUsers(): Observable<User[]> {
//     return of(this.users);
//   }

//   // Create new user
//   addUser(userData: Omit<User, 'id'>): Observable<User> {
//     try {
//       // Validate username uniqueness
//       if (this.users.some(user => user.username === userData.username)) {
//         return throwError(() => new Error('Username already exists'));
//       }

//       // Create new user with generated ID
//       const newUser: User = {
//         ...userData,
//         id: this.generateId(),
//         profile: userData.profile || 'default-profile-pic-url' // Provide default profile pic
//       };

//       // Validate with Zod schema
//       userSchema.parse(newUser);

//       // Add to users array and save
//       this.users.push(newUser);
//       this.saveUsers();

//       return of(newUser);
//     } catch (error) {
//       return throwError(() => error);
//     }
//   }

//   // Update existing user
//   updateUser(userId: string, userData: Partial<User>): Observable<User> {
//   try {
//     const userIndex = this.users.findIndex(user => user.id === userId);
//     if (userIndex === -1) {
//       return throwError(() => new Error('User not found'));
//     }

//     // Check username uniqueness if username is being updated
//     if (
//       userData.username &&
//       userData.username !== this.users[userIndex].username &&
//       this.users.some(user => user.username === userData.username)
//     ) {
//       return throwError(() => new Error('Username already exists'));
//     }

//     // Update user
//     const updatedUser: User = {
//       ...this.users[userIndex],
//       ...userData,
//       id: userId // Ensure ID doesn't change
//     };

//     // If password is empty, retain the current password
//     if (!userData.password || userData.password.trim() === '') {
//       updatedUser.password = this.users[userIndex].password;
//     }

//     // Validate with Zod schema
//     userSchema.parse(updatedUser);

//     // Update array and save
//     this.users[userIndex] = updatedUser;
//     this.saveUsers();

//     // Update current user if the updated user is logged in
//     if (this.user?.id === userId) {
//       this.user = updatedUser;
//       localStorage.setItem('user', JSON.stringify(this.user));
//     }

//     return of(updatedUser);
//   } catch (error) {
//     return throwError(() => error);
//   }
// }


//   // Delete user
//   deleteUser(userId: string): Observable<boolean> {
//     const userIndex = this.users.findIndex(user => user.id === userId);
//     if (userIndex === -1) {
//       return throwError(() => new Error('User not found'));
//     }

//     // Prevent deletion of logged-in user
//     if (this.user?.id === userId) {
//       return throwError(() => new Error('Cannot delete currently logged-in user'));
//     }

//     // Remove user and save
//     this.users.splice(userIndex, 1);
//     this.saveUsers();

//     return of(true);
//   }

//   getUser(): User | undefined {
//     const userString = localStorage.getItem('user');
//     if (userString) {
//       this.user = JSON.parse(userString) as User;
//     }
//     return this.user;
//   }

//   async login(username: string, password: string) {
//     await new Promise(resolve => setTimeout(resolve, 1000));
//     const user = this.users.find(u => u.username === username);
    
//     if (user) {
//       if (user.password === password) {
//         this.user = user;
//         localStorage.setItem('user', JSON.stringify(this.user));
//         return;
//       } else {
//         throw new Error('Invalid credentials.');
//       }
//     }
//     throw new Error('User not found.');
//   }

//   async logout() {
//     localStorage.removeItem('user');
//     this.user = undefined;
//     this.router.navigate(['/authentication/login']);
//   }
// } 

// src/app/services/user.service.ts

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { z } from 'zod';

// ==============================
// Zod Schemas
// ==============================
export const userSchema = z.object({
  id: z.string().length(32, "ID must be exactly 32 characters").optional(),
  fullname: z.string().min(1, "Full name is required"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(['superadmin', 'accounting', 'supply', 'bac', 'inspection', 'end-user']),
  profile: z.string().min(1, "Profile is required"),

  // NEW: Additional fields to store assigned codes and sub-accounts
  assignedAccountCodes: z.array(z.string()).optional(),
  assignedSubAccounts: z.array(z.string()).optional()
});

export const accountCodeSchema = z.object({
  id: z.string().length(32, "ID must be exactly 32 characters").optional(),
  code: z.string().min(1, "Account code is required"),
  description: z.string().min(1, "Description is required")
});

export const subAccountSchema = z.object({
  id: z.string().length(32, "ID must be exactly 32 characters").optional(),
  mainAccountCode: z.string().min(1, "Main account code is required"),
  subClassification: z.string().min(1, "Sub-classification is required"),
  subLevel: z.number().min(1, "Sub-level must be a positive number"),
  subCode: z.string().min(1, "Sub-account code is required")
});

// ==============================
// Types
// ==============================
export type User = z.infer<typeof userSchema>;
export type AccountCode = z.infer<typeof accountCodeSchema>;
export type SubAccount = z.infer<typeof subAccountSchema>;

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // ------------------------------
  // Users
  // ------------------------------
  private users: User[] = [
    {
      id: this.generateId(),
      fullname: 'John Doe',
      username: 'accounting',
      password: 'test123',
      role: 'accounting',
      profile: 'profile-pic-url-1',
      assignedAccountCodes: [],
      assignedSubAccounts: []
    },
    {
      id: this.generateId(),
      fullname: 'Jane Smith',
      username: 'superadmin',
      password: 'test123',
      role: 'superadmin',
      profile: 'profile-pic-url-2',
      assignedAccountCodes: [],
      assignedSubAccounts: []
    },
    {
      id: this.generateId(),
      fullname: 'Alice Johnson',
      username: 'supply',
      password: 'test123',
      role: 'supply',
      profile: 'profile-pic-url-3',
      assignedAccountCodes: [],
      assignedSubAccounts: []
    },
    {
      id: this.generateId(),
      fullname: 'Bob Brown',
      username: 'bac',
      password: 'test123',
      role: 'bac',
      profile: 'profile-pic-url-4',
      assignedAccountCodes: [],
      assignedSubAccounts: []
    },
    {
      id: this.generateId(),
      fullname: 'Charlie White',
      username: 'inspection',
      password: 'test123',
      role: 'inspection',
      profile: 'profile-pic-url-5',
      assignedAccountCodes: [],
      assignedSubAccounts: []
    },
    {
      id: this.generateId(),
      fullname: 'Diana Green',
      username: 'enduser',
      password: 'test123',
      role: 'end-user',
      profile: 'profile-pic-url-6',
      assignedAccountCodes: [],
      assignedSubAccounts: []
    }
  ];

  // ------------------------------
  // Account Codes
  // ------------------------------
  private accountCodes: AccountCode[] = [
    {
      id: this.generateId(),
      code: '1000',
      description: 'Cash'
    },
    {
      id: this.generateId(),
      code: '1100',
      description: 'Accounts Receivable'
    },
    {
      id: this.generateId(),
      code: '1200',
      description: 'Office Supplies'
    }
  ];

  // ------------------------------
  // Sub Accounts
  // ------------------------------
  private subAccounts: SubAccount[] = [
    {
      id: this.generateId(),
      mainAccountCode: '1000',
      subClassification: 'Petty Cash',
      subLevel: 1,
      subCode: '1000-01'
    },
    {
      id: this.generateId(),
      mainAccountCode: '1100',
      subClassification: 'Trade Receivables',
      subLevel: 2,
      subCode: '1100-01'
    },
    {
      id: this.generateId(),
      mainAccountCode: '1200',
      subClassification: 'Ink & Toner',
      subLevel: 1,
      subCode: '1200-01'
    }
  ];

  // ------------------------------
  // Storage Keys
  // ------------------------------
  private readonly USERS_STORAGE_KEY = 'users_data';
  private readonly ACCOUNT_CODES_STORAGE_KEY = 'account_codes_data';
  private readonly SUB_ACCOUNTS_STORAGE_KEY = 'sub_accounts_data';

  // ------------------------------
  // Current Logged-in User
  // ------------------------------
  private user?: User;

  constructor(private router: Router) {
    // Initial load from localStorage
    this.loadUsers();
    this.loadAccountCodes();
    this.loadSubAccounts();
  }

  // =========================================
  // Helper method to generate a random 32-character ID
  // =========================================
  private generateId(): string {
    return Array.from({ length: 32 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
  }

  // =========================================
  // USERS
  // =========================================
  // --- Load users from localStorage ---
  private loadUsers() {
    const storedUsers = localStorage.getItem(this.USERS_STORAGE_KEY);
    if (storedUsers) {
      this.users = JSON.parse(storedUsers);
    } else {
      // If no stored users, save the initial dummy data
      this.saveUsers();
    }
  }

  // --- Save users to localStorage ---
  private saveUsers() {
    localStorage.setItem(this.USERS_STORAGE_KEY, JSON.stringify(this.users));
  }

  // --- Get all users ---
  getAllUsers(): Observable<User[]> {
    return of(this.users);
  }

  // --- Create new user ---
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
        profile: userData.profile || 'default-profile-pic-url',
        assignedAccountCodes: [],
        assignedSubAccounts: []
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

  // --- Update existing user ---
  updateUser(userId: string, userData: Partial<User>): Observable<User> {
    try {
      const userIndex = this.users.findIndex(u => u.id === userId);
      if (userIndex === -1) {
        return throwError(() => new Error('User not found'));
      }

      // Check username uniqueness if username is being updated
      if (
        userData.username &&
        userData.username !== this.users[userIndex].username &&
        this.users.some(u => u.username === userData.username)
      ) {
        return throwError(() => new Error('Username already exists'));
      }

      // Keep existing assigned codes if not provided
      const existing = this.users[userIndex];
      const updatedUser: User = {
        ...existing,
        ...userData,
        id: userId, // Ensure ID doesn't change
        assignedAccountCodes: userData.assignedAccountCodes ?? existing.assignedAccountCodes,
        assignedSubAccounts: userData.assignedSubAccounts ?? existing.assignedSubAccounts
      };

      // If password is empty, retain the current password
      if (!userData.password || userData.password.trim() === '') {
        updatedUser.password = existing.password;
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

  // --- Delete user ---
  deleteUser(userId: string): Observable<boolean> {
    const userIndex = this.users.findIndex(u => u.id === userId);
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

  // --- Get currently logged-in user ---
  getUser(): User | undefined {
    const userString = localStorage.getItem('user');
    if (userString) {
      this.user = JSON.parse(userString) as User;
    }
    return this.user;
  }

  // --- Login ---
  async login(username: string, password: string) {
    // Simulate async call
    await new Promise(resolve => setTimeout(resolve, 1000));
    const foundUser = this.users.find(u => u.username === username);

    if (foundUser) {
      if (foundUser.password === password) {
        this.user = foundUser;
        localStorage.setItem('user', JSON.stringify(this.user));
        return;
      } else {
        throw new Error('Invalid credentials.');
      }
    }
    throw new Error('User not found.');
  }

  // --- Logout ---
  async logout() {
    localStorage.removeItem('user');
    this.user = undefined;
    this.router.navigate(['/authentication/login']);
  }

  // =========================================
  // ACCOUNT CODES
  // =========================================
  // --- Load account codes from localStorage ---
  private loadAccountCodes() {
    const storedCodes = localStorage.getItem(this.ACCOUNT_CODES_STORAGE_KEY);
    if (storedCodes) {
      this.accountCodes = JSON.parse(storedCodes);
    } else {
      this.saveAccountCodes();
    }
  }

  // --- Save account codes to localStorage ---
  private saveAccountCodes() {
    localStorage.setItem(this.ACCOUNT_CODES_STORAGE_KEY, JSON.stringify(this.accountCodes));
  }

  // --- Get all account codes ---
  getAllAccountCodes(): Observable<AccountCode[]> {
    return of(this.accountCodes);
  }

  // Only 'superadmin' or 'accounting' can add new account codes
  addAccountCode(data: Omit<AccountCode, 'id'>): Observable<AccountCode> {
    try {
      // Ensure user is logged in
      if (!this.user) {
        return throwError(() => new Error('You must be logged in to add an account code.'));
      }
      // Check role
      if (this.user.role !== 'superadmin' && this.user.role !== 'accounting') {
        return throwError(() => new Error('You are not authorized to add account codes.'));
      }

      const newAccountCode: AccountCode = {
        ...data,
        id: this.generateId()
      };

      accountCodeSchema.parse(newAccountCode);
      this.accountCodes.push(newAccountCode);
      this.saveAccountCodes();

      return of(newAccountCode);
    } catch (error) {
      return throwError(() => error);
    }
  }

  // Update existing account code
  updateAccountCode(accountId: string, data: Partial<AccountCode>): Observable<AccountCode> {
    try {
      if (!this.user) {
        return throwError(() => new Error('You must be logged in to update an account code.'));
      }
      if (this.user.role !== 'superadmin' && this.user.role !== 'accounting') {
        return throwError(() => new Error('You are not authorized to update account codes.'));
      }

      const index = this.accountCodes.findIndex(a => a.id === accountId);
      if (index === -1) {
        return throwError(() => new Error('Account code not found'));
      }

      const updatedAccount: AccountCode = {
        ...this.accountCodes[index],
        ...data,
        id: accountId // ensure the ID remains unchanged
      };

      accountCodeSchema.parse(updatedAccount);
      this.accountCodes[index] = updatedAccount;
      this.saveAccountCodes();

      return of(updatedAccount);
    } catch (error) {
      return throwError(() => error);
    }
  }

  // Delete account code
  deleteAccountCode(accountId: string): Observable<boolean> {
    if (!this.user) {
      return throwError(() => new Error('You must be logged in to delete an account code.'));
    }
    if (this.user.role !== 'superadmin' && this.user.role !== 'accounting') {
      return throwError(() => new Error('You are not authorized to delete account codes.'));
    }

    const index = this.accountCodes.findIndex(a => a.id === accountId);
    if (index === -1) {
      return throwError(() => new Error('Account code not found'));
    }

    this.accountCodes.splice(index, 1);
    this.saveAccountCodes();
    return of(true);
  }

  // =========================================
  // SUB ACCOUNTS
  // =========================================
  // --- Load sub accounts from localStorage ---
  private loadSubAccounts() {
    const storedSubAccounts = localStorage.getItem(this.SUB_ACCOUNTS_STORAGE_KEY);
    if (storedSubAccounts) {
      this.subAccounts = JSON.parse(storedSubAccounts);
    } else {
      this.saveSubAccounts();
    }
  }

  // --- Save sub accounts to localStorage ---
  private saveSubAccounts() {
    localStorage.setItem(this.SUB_ACCOUNTS_STORAGE_KEY, JSON.stringify(this.subAccounts));
  }

  // --- Get all sub accounts ---
  getAllSubAccounts(): Observable<SubAccount[]> {
    return of(this.subAccounts);
  }

  // Only 'superadmin' or 'accounting' can add new sub accounts
  addSubAccount(data: Omit<SubAccount, 'id'>): Observable<SubAccount> {
    try {
      if (!this.user) {
        return throwError(() => new Error('You must be logged in to add a sub account.'));
      }
      if (this.user.role !== 'superadmin' && this.user.role !== 'accounting') {
        return throwError(() => new Error('You are not authorized to add sub accounts.'));
      }

      const newSubAccount: SubAccount = {
        ...data,
        id: this.generateId()
      };

      subAccountSchema.parse(newSubAccount);
      this.subAccounts.push(newSubAccount);
      this.saveSubAccounts();

      return of(newSubAccount);
    } catch (error) {
      return throwError(() => error);
    }
  }

  // Update existing sub account
  updateSubAccount(subAccountId: string, data: Partial<SubAccount>): Observable<SubAccount> {
    try {
      if (!this.user) {
        return throwError(() => new Error('You must be logged in to update a sub account.'));
      }
      if (this.user.role !== 'superadmin' && this.user.role !== 'accounting') {
        return throwError(() => new Error('You are not authorized to update sub accounts.'));
      }

      const index = this.subAccounts.findIndex(sa => sa.id === subAccountId);
      if (index === -1) {
        return throwError(() => new Error('Sub-account not found'));
      }

      const updatedSubAccount: SubAccount = {
        ...this.subAccounts[index],
        ...data,
        id: subAccountId
      };

      subAccountSchema.parse(updatedSubAccount);
      this.subAccounts[index] = updatedSubAccount;
      this.saveSubAccounts();

      return of(updatedSubAccount);
    } catch (error) {
      return throwError(() => error);
    }
  }

  // Delete sub account
  deleteSubAccount(subAccountId: string): Observable<boolean> {
    if (!this.user) {
      return throwError(() => new Error('You must be logged in to delete a sub account.'));
    }
    if (this.user.role !== 'superadmin' && this.user.role !== 'accounting') {
      return throwError(() => new Error('You are not authorized to delete sub accounts.'));
    }

    const index = this.subAccounts.findIndex(sa => sa.id === subAccountId);
    if (index === -1) {
      return throwError(() => new Error('Sub-account not found'));
    }

    this.subAccounts.splice(index, 1);
    this.saveSubAccounts();
    return of(true);
  }

  // =========================================
  // ASSIGNMENT METHODS
  // =========================================
  /**
   * Assign an existing AccountCode to a specific User.
   * Only superadmin or accounting can do this.
   */
  assignAccountCodeToUser(userId: string, accountCodeId: string): Observable<User> {
    try {
      if (!this.user) {
        return throwError(() => new Error('You must be logged in to assign account codes.'));
      }
      if (this.user.role !== 'superadmin' && this.user.role !== 'accounting') {
        return throwError(() => new Error('You are not authorized to assign account codes.'));
      }

      // Make sure the account code actually exists
      const codeExists = this.accountCodes.some(ac => ac.id === accountCodeId);
      if (!codeExists) {
        return throwError(() => new Error('Account code not found.'));
      }

      // Find the user
      const userIndex = this.users.findIndex(u => u.id === userId);
      if (userIndex === -1) {
        return throwError(() => new Error('User not found.'));
      }

      const userToUpdate = this.users[userIndex];
      const assignedCodes = new Set(userToUpdate.assignedAccountCodes || []);
      assignedCodes.add(accountCodeId); // avoid duplicates

      const updatedUser: User = {
        ...userToUpdate,
        assignedAccountCodes: Array.from(assignedCodes)
      };

      userSchema.parse(updatedUser); // Validate with Zod

      this.users[userIndex] = updatedUser;
      this.saveUsers();

      return of(updatedUser);
    } catch (error) {
      return throwError(() => error);
    }
  }

  /**
   * Assign an existing SubAccount to a specific User.
   * Only superadmin or accounting can do this.
   */
  assignSubAccountToUser(userId: string, subAccountId: string): Observable<User> {
    try {
      if (!this.user) {
        return throwError(() => new Error('You must be logged in to assign sub accounts.'));
      }
      if (this.user.role !== 'superadmin' && this.user.role !== 'accounting') {
        return throwError(() => new Error('You are not authorized to assign sub accounts.'));
      }

      // Make sure the sub account actually exists
      const subExists = this.subAccounts.some(sa => sa.id === subAccountId);
      if (!subExists) {
        return throwError(() => new Error('Sub-account not found.'));
      }

      // Find the user
      const userIndex = this.users.findIndex(u => u.id === userId);
      if (userIndex === -1) {
        return throwError(() => new Error('User not found.'));
      }

      const userToUpdate = this.users[userIndex];
      const assignedSubs = new Set(userToUpdate.assignedSubAccounts || []);
      assignedSubs.add(subAccountId); // avoid duplicates

      const updatedUser: User = {
        ...userToUpdate,
        assignedSubAccounts: Array.from(assignedSubs)
      };

      userSchema.parse(updatedUser); // Validate with Zod

      this.users[userIndex] = updatedUser;
      this.saveUsers();

      return of(updatedUser);
    } catch (error) {
      return throwError(() => error);
    }
  }
}
