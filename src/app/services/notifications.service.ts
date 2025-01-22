// src/app/services/notification.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/** Basic shape of a notification, possibly targeted to a specific user via `toUserId`. */
export interface AppNotification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  toUserId?: string; // If set, only that user sees it
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private readonly NOTIFICATIONS_KEY = 'notifications_data';

  // We store notifications in a BehaviorSubject so components can subscribe
  private notificationsSubject = new BehaviorSubject<AppNotification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  constructor() {
    // 1) Load from localStorage on service init
    const stored = localStorage.getItem(this.NOTIFICATIONS_KEY);
    if (stored) {
      try {
        const parsed: AppNotification[] = JSON.parse(stored);
        // Convert string timestamps back to Date objects
        // (assuming we want them as Date)
        for (const notif of parsed) {
          if (typeof notif.timestamp === 'string') {
            notif.timestamp = new Date(notif.timestamp);
          }
        }
        this.notificationsSubject.next(parsed);
      } catch (error) {
        console.error('Error parsing stored notifications', error);
        // fallback to empty
      }
    }

    // 2) Whenever notifications change, save to localStorage
    this.notifications$.subscribe(list => {
      localStorage.setItem(this.NOTIFICATIONS_KEY, JSON.stringify(list));
    });
  }

  /**
   * Add a new notification.
   * @param message The message text.
   * @param type The notification type (info, success, warning, error).
   * @param toUserId If provided, only that user sees it (in NotificationComponent).
   */
  addNotification(
    message: string,
    type: AppNotification['type'] = 'info',
    toUserId?: string
  ): void {
    const newNotif: AppNotification = {
      id: this.generateId(),
      message,
      type,
      timestamp: new Date(),
      toUserId
    };
    // push into BehaviorSubject array
    const currentList = this.notificationsSubject.value;
    this.notificationsSubject.next([...currentList, newNotif]);
  }

  /** Remove a notification by ID (e.g., when user clicks). */
  removeNotification(id: string) {
    const updated = this.notificationsSubject.value.filter(n => n.id !== id);
    this.notificationsSubject.next(updated);
  }

  /** Clear all notifications. */
  clearAll() {
    this.notificationsSubject.next([]);
  }

  private generateId(): string {
    // Generate a simple 8-char hex ID
    return Array.from({ length: 8 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
  }
}
