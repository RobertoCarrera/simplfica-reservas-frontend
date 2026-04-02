import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

export interface RuntimeConfig {
  supabase: {
    url: string;
    anonKey: string;
  };
  edgeFunctionsBaseUrl: string;
  supportEmail?: string;
}

@Injectable({ providedIn: 'root' })
export class RuntimeConfigService {
  private config: RuntimeConfig | null = null;

  async load(): Promise<void> {
    try {
      const cacheBuster = `ts=${Date.now()}`;
      const response = await fetch(`/assets/runtime-config.json?${cacheBuster}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const cfg = (await response.json()) as Partial<RuntimeConfig>;

      const defaults: RuntimeConfig = {
        supabase: {
          url: environment.supabase?.url ?? '',
          anonKey: environment.supabase?.anonKey ?? '',
        },
        edgeFunctionsBaseUrl: environment.edgeFunctionsBaseUrl ?? '',
      };

      this.config = {
        supabase: {
          url: cfg?.supabase?.url?.trim() ? cfg.supabase.url : defaults.supabase.url,
          anonKey: cfg?.supabase?.anonKey?.trim() ? cfg.supabase.anonKey : defaults.supabase.anonKey,
        },
        edgeFunctionsBaseUrl: cfg?.edgeFunctionsBaseUrl?.trim()
          ? cfg.edgeFunctionsBaseUrl
          : defaults.edgeFunctionsBaseUrl,
        supportEmail: cfg?.supportEmail?.trim() ? cfg.supportEmail : undefined,
      };
    } catch (e) {
      console.warn('⚠️ RuntimeConfigService: Config load failed, using environment defaults.', e);
      this.config = {
        supabase: {
          url: environment.supabase?.url ?? '',
          anonKey: environment.supabase?.anonKey ?? '',
        },
        edgeFunctionsBaseUrl: environment.edgeFunctionsBaseUrl ?? '',
      };
    }
  }

  get(): RuntimeConfig | null {
    return this.config;
  }

  getSupabase() {
    return this.config?.supabase ?? null;
  }
}
