import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, from } from 'rxjs';
import { PortalAuthService } from './portal-auth.service';
import { RuntimeConfigService } from '../config/runtime-config.service';

export interface CompanyBranding {
  name: string;
  logo_url: string | null;
  primary_color: string;
  secondary_color: string;
  favicon_url: string | null;
}

@Injectable({ providedIn: 'root' })
export class BrandingService {
  private auth = inject(PortalAuthService);
  private runtimeConfig = inject(RuntimeConfigService);

  private _branding = signal<CompanyBranding | null>(null);
  branding = this._branding.asReadonly();

  private _loading = signal(false);
  loading = this._loading.asReadonly();

  async loadBranding(): Promise<void> {
    this._loading.set(true);
    try {
      const token = await this.auth.requireAccessToken();
      const edgeBase = this.runtimeConfig.get()?.edgeFunctionsBaseUrl ?? '';
      const url = `${edgeBase}/functions/v1/get-company-branding`;

      const response = await firstValueFrom(
        from(
          this.auth['supabase'].functions.invoke('get-company-branding', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ),
      );

      if (response.error) {
        console.warn('⚠️ BrandingService: Edge function error:', response.error);
        return;
      }

      const data = response.data as CompanyBranding;
      if (data) {
        this._branding.set(data);
        this.applyBranding(data);
      }
    } catch (e) {
      console.warn('⚠️ BrandingService: Failed to load branding', e);
    } finally {
      this._loading.set(false);
    }
  }

  private applyBranding(branding: CompanyBranding): void {
    // Update document title
    document.title = `${branding.name} Portal`;

    // Apply CSS custom properties
    const root = document.documentElement;
    root.style.setProperty('--brand-primary', branding.primary_color);
    root.style.setProperty('--brand-secondary', branding.secondary_color);

    // Update theme-color meta tag (PWA)
    const themeMeta = document.getElementById('theme-color-meta');
    if (themeMeta) {
      themeMeta.setAttribute('content', branding.primary_color);
    }

    // Update favicon if provided
    if (branding.favicon_url) {
      const favicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
      if (favicon) {
        favicon.setAttribute('href', branding.favicon_url);
      }
    }
  }

  /**
   * Get logo URL or return null for placeholder generation.
   */
  getLogoUrl(): string | null {
    return this._branding()?.logo_url ?? null;
  }

  /**
   * Get company initials for placeholder.
   */
  getInitials(): string {
    const name = this._branding()?.name ?? '';
    return name
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  }
}