import { Injectable, signal } from '@angular/core';
import { Toast } from '../models/toast.interface';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toasts = signal<Toast[]>([]);

  get toasts$() {
    return this.toasts.asReadonly();
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private addToast(
    type: Toast['type'],
    title: string,
    message: string,
    duration = 5000,
    persistent = false,
    key?: string,
    action?: { label: string; link: string },
  ): string {
    const toast: Toast = {
      id: this.generateId(),
      type,
      title,
      message,
      duration: persistent ? Infinity : duration,
      key,
      action,
    };

    this.toasts.update((current) => [...current, toast]);

    if (!persistent) {
      setTimeout(() => this.removeToast(toast.id), duration);
    }
    return toast.id;
  }

  removeToast(id: string): void {
    this.toasts.update((current) => current.filter((t) => t.id !== id));
  }

  success(title: string, message: string, duration?: number): string {
    return this.addToast('success', title, message, duration);
  }

  error(title: string, message: string, duration?: number): string {
    return this.addToast('error', title, message, duration);
  }

  warning(title: string, message: string, duration?: number): string {
    return this.addToast('warning', title, message, duration);
  }

  info(title: string, message: string, duration?: number): string {
    return this.addToast('info', title, message, duration);
  }

  clear(): void {
    this.toasts.set([]);
  }
}
