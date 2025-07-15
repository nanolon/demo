// =============================================================================
// src/interfaces/ServiceProvider.ts
// Interface für Dependency Injection Pattern
// =============================================================================

export interface ServiceProvider {
    getService<T>(serviceType: string): T | undefined;
    registerService<T>(serviceType: string, service: T): void;
}