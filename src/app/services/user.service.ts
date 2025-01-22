// src/app/services/user.service.ts

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { z } from 'zod';

// ==============================
// Zod Schemas
// ==============================

// 1) We add a .refine() so that if role is "end-user", position must not be empty.
export const userSchema = z
  .object({
    id: z.string().length(32, "ID must be exactly 32 characters").optional(),
    fullname: z.string().min(1, "Full name is required"),
    username: z.string().min(1, "Username is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(['superadmin', 'accounting', 'supply', 'bac', 'inspection', 'end-user']),
    profile: z.string().min(1, "Profile is required"),

    // NEW FIELD: position is optional unless role = end-user
    position: z.string().optional(),

    // Additional arrays for assigned codes and sub-accounts
    assignedAccountCodes: z.array(z.string()).optional(),
    assignedSubAccounts: z.array(z.string()).optional()
  })
  .refine(
    (data) => {
      // If role is 'end-user', position must be non-empty
      if (data.role === 'end-user') {
        return data.position && data.position.trim().length > 0;
      }
      return true; // for other roles, it's not required
    },
    {
      message: 'Position is required for users with the "end-user" role.',
      path: ['position'] // path to highlight
    }
  );

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
      position: undefined,
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
      position: undefined,
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
      position: undefined,
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
      position: undefined,
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
      position: undefined,
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
      position: 'Manager', // EXAMPLE: if role is end-user, let's provide a position
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

  // ==============================
  // USERS
  // ==============================
  private loadUsers() {
    const storedUsers = localStorage.getItem(this.USERS_STORAGE_KEY);
    if (storedUsers) {
      this.users = JSON.parse(storedUsers);
    } else {
      // If no stored users, save the initial dummy data
      this.saveUsers();
    }
  }

  private saveUsers() {
    localStorage.setItem(this.USERS_STORAGE_KEY, JSON.stringify(this.users));
  }

  getAllUsers(): Observable<User[]> {
    return of(this.users);
  }

  addUser(userData: Omit<User, 'id'>): Observable<User> {
    try {
      // Username uniqueness
      if (this.users.some(u => u.username === userData.username)) {
        return throwError(() => new Error('Username already exists'));
      }

      const newUser: User = {
        ...userData,
        id: this.generateId(),
        profile: userData.profile || 'default-profile-pic-url',
        assignedAccountCodes: [],
        assignedSubAccounts: []
      };

      userSchema.parse(newUser); // Validate with Zod
      this.users.push(newUser);
      this.saveUsers();

      return of(newUser);
    } catch (error) {
      return throwError(() => error);
    }
  }

  updateUser(userId: string, userData: Partial<User>): Observable<User> {
    try {
      const userIndex = this.users.findIndex(u => u.id === userId);
      if (userIndex === -1) {
        return throwError(() => new Error('User not found'));
      }

      // Check username uniqueness if it's updated
      if (
        userData.username &&
        userData.username !== this.users[userIndex].username &&
        this.users.some(u => u.username === userData.username)
      ) {
        return throwError(() => new Error('Username already exists'));
      }

      const existing = this.users[userIndex];
      const updatedUser: User = {
        ...existing,
        ...userData,
        id: userId,
        // Retain assigned codes if not in partial
        assignedAccountCodes: userData.assignedAccountCodes ?? existing.assignedAccountCodes,
        assignedSubAccounts: userData.assignedSubAccounts ?? existing.assignedSubAccounts
      };

      // If password is empty, keep old one
      if (!userData.password || userData.password.trim() === '') {
        updatedUser.password = existing.password;
      }

      userSchema.parse(updatedUser); // Validate
      this.users[userIndex] = updatedUser;
      this.saveUsers();

      // If the updated user is the one currently logged in, update localStorage
      if (this.user?.id === userId) {
        this.user = updatedUser;
        localStorage.setItem('user', JSON.stringify(this.user));
      }

      return of(updatedUser);
    } catch (error) {
      return throwError(() => error);
    }
  }

  deleteUser(userId: string): Observable<boolean> {
    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return throwError(() => new Error('User not found'));
    }

    if (this.user?.id === userId) {
      return throwError(() => new Error('Cannot delete currently logged-in user'));
    }

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
    // Simulate async call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const foundUser = this.users.find(u => u.username === username);
    if (!foundUser) throw new Error('User not found.');

    if (foundUser.password === password) {
      this.user = foundUser;
      localStorage.setItem('user', JSON.stringify(this.user));
      return;
    } else {
      throw new Error('Invalid credentials.');
    }
  }

  async logout() {
    localStorage.removeItem('user');
    this.user = undefined;
    this.router.navigate(['/authentication/login']);
  }

  // ==============================
  // ACCOUNT CODES
  // ==============================
  private loadAccountCodes() {
    const storedCodes = localStorage.getItem(this.ACCOUNT_CODES_STORAGE_KEY);
    if (storedCodes) {
      this.accountCodes = JSON.parse(storedCodes);
    } else {
      this.saveAccountCodes();
    }
  }

  private saveAccountCodes() {
    localStorage.setItem(this.ACCOUNT_CODES_STORAGE_KEY, JSON.stringify(this.accountCodes));
  }

  getAllAccountCodes(): Observable<AccountCode[]> {
    return of(this.accountCodes);
  }

  addAccountCode(data: Omit<AccountCode, 'id'>): Observable<AccountCode> {
    try {
      if (!this.user) {
        return throwError(() => new Error('You must be logged in to add an account code.'));
      }
      if (this.user.role !== 'superadmin' && this.user.role !== 'accounting') {
        return throwError(() => new Error('You are not authorized to add account codes.'));
      }

      const newCode: AccountCode = {
        ...data,
        id: this.generateId()
      };

      accountCodeSchema.parse(newCode);
      this.accountCodes.push(newCode);
      this.saveAccountCodes();

      return of(newCode);
    } catch (error) {
      return throwError(() => error);
    }
  }

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

      const updated: AccountCode = {
        ...this.accountCodes[index],
        ...data,
        id: accountId
      };

      accountCodeSchema.parse(updated);
      this.accountCodes[index] = updated;
      this.saveAccountCodes();

      return of(updated);
    } catch (error) {
      return throwError(() => error);
    }
  }

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

  // ==============================
  // SUB ACCOUNTS
  // ==============================
  private loadSubAccounts() {
    const storedSubAccounts = localStorage.getItem(this.SUB_ACCOUNTS_STORAGE_KEY);
    if (storedSubAccounts) {
      this.subAccounts = JSON.parse(storedSubAccounts);
    } else {
      this.saveSubAccounts();
    }
  }

  private saveSubAccounts() {
    localStorage.setItem(this.SUB_ACCOUNTS_STORAGE_KEY, JSON.stringify(this.subAccounts));
  }

  getAllSubAccounts(): Observable<SubAccount[]> {
    return of(this.subAccounts);
  }

  addSubAccount(data: Omit<SubAccount, 'id'>): Observable<SubAccount> {
    try {
      if (!this.user) {
        return throwError(() => new Error('You must be logged in to add a sub account.'));
      }
      if (this.user.role !== 'superadmin' && this.user.role !== 'accounting') {
        return throwError(() => new Error('You are not authorized to add sub accounts.'));
      }

      const newSub: SubAccount = {
        ...data,
        id: this.generateId()
      };

      subAccountSchema.parse(newSub);
      this.subAccounts.push(newSub);
      this.saveSubAccounts();

      return of(newSub);
    } catch (error) {
      return throwError(() => error);
    }
  }

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

      const updated: SubAccount = {
        ...this.subAccounts[index],
        ...data,
        id: subAccountId
      };

      subAccountSchema.parse(updated);
      this.subAccounts[index] = updated;
      this.saveSubAccounts();

      return of(updated);
    } catch (error) {
      return throwError(() => error);
    }
  }

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

  // ==============================
  // ASSIGNMENT METHODS
  // ==============================
  assignAccountCodeToUser(userId: string, accountCodeId: string): Observable<User> {
    try {
      if (!this.user) {
        return throwError(() => new Error('You must be logged in to assign account codes.'));
      }
      if (this.user.role !== 'superadmin' && this.user.role !== 'accounting') {
        return throwError(() => new Error('You are not authorized to assign account codes.'));
      }

      const codeExists = this.accountCodes.some(ac => ac.id === accountCodeId);
      if (!codeExists) {
        return throwError(() => new Error('Account code not found.'));
      }

      const userIndex = this.users.findIndex(u => u.id === userId);
      if (userIndex === -1) {
        return throwError(() => new Error('User not found.'));
      }

      const userToUpdate = this.users[userIndex];
      const assignedCodes = new Set(userToUpdate.assignedAccountCodes || []);
      assignedCodes.add(accountCodeId);

      const updatedUser: User = {
        ...userToUpdate,
        assignedAccountCodes: Array.from(assignedCodes)
      };

      userSchema.parse(updatedUser);
      this.users[userIndex] = updatedUser;
      this.saveUsers();

      return of(updatedUser);
    } catch (error) {
      return throwError(() => error);
    }
  }

  assignSubAccountToUser(userId: string, subAccountId: string): Observable<User> {
    try {
      if (!this.user) {
        return throwError(() => new Error('You must be logged in to assign sub accounts.'));
      }
      if (this.user.role !== 'superadmin' && this.user.role !== 'accounting') {
        return throwError(() => new Error('You are not authorized to assign sub accounts.'));
      }

      const subExists = this.subAccounts.some(sa => sa.id === subAccountId);
      if (!subExists) {
        return throwError(() => new Error('Sub-account not found.'));
      }

      const userIndex = this.users.findIndex(u => u.id === userId);
      if (userIndex === -1) {
        return throwError(() => new Error('User not found.'));
      }

      const userToUpdate = this.users[userIndex];
      const assignedSubs = new Set(userToUpdate.assignedSubAccounts || []);
      assignedSubs.add(subAccountId);

      const updatedUser: User = {
        ...userToUpdate,
        assignedSubAccounts: Array.from(assignedSubs)
      };

      userSchema.parse(updatedUser);
      this.users[userIndex] = updatedUser;
      this.saveUsers();

      return of(updatedUser);
    } catch (error) {
      return throwError(() => error);
    }
  }
}
