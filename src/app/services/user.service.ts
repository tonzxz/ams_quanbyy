import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Observable, of, throwError } from 'rxjs'
import { Users } from '../schema/schema' // Import Users class
import { dummyUsers } from '../schema/dummy'

export type User = Users // Correctly export `User` type

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = []
  private user?: User
  private readonly USERS_STORAGE_KEY = 'users'

  constructor(private router: Router) {
    this.loadUsers()
  }

  private generateId(): string {
    return Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
  }

  private loadUsers() {
    const storedUsers = localStorage.getItem(this.USERS_STORAGE_KEY)

    if (storedUsers) {
      this.users = JSON.parse(storedUsers)
    } else {
      this.users = [...dummyUsers] // Load dummy data if no stored users
      this.saveUsers()
    }
  }

  private saveUsers() {
    localStorage.setItem(this.USERS_STORAGE_KEY, JSON.stringify(this.users))
  }

  getAllUsers(): Observable<User[]> {
    return of(this.users)
  }

  getUserById(userId: string): User | undefined {
    return this.users.find(user => user.id === userId)
  }

  addUser(userData: Omit<User, 'id'>): Observable<User> {
    if (this.users.some(u => u.username === userData.username)) {
      return throwError(() => new Error('Username already exists'))
    }

    const newUser: User = {
      ...userData,
      id: this.generateId(),
      profile: userData.profile || 'default-profile-pic-url',
      isAdmin: userData.user_type === 'SuperAdmin' || userData.user_type === 'Admin'
    }

    this.users.push(newUser)
    this.saveUsers()
    return of(newUser)
  }

  async login(username: string, password: string) {
    this.loadUsers()

    const foundUser = this.users.find(u => u.username === username)
    if (!foundUser) throw new Error('User not found.')

    if (foundUser.password === password) {
      this.user = foundUser
      localStorage.setItem('user', JSON.stringify(this.user))
      return foundUser
    } else {
      throw new Error('Invalid credentials.')
    }
  }

  async logout() {
    localStorage.removeItem('user')
    this.user = undefined
    this.router.navigate(['/authentication/login'])
  }

  getUser(): User | undefined {
    const userString = localStorage.getItem('user')
    return userString ? (JSON.parse(userString) as User) : undefined
  }
}
