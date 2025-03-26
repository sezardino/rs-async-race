export class LocalStorageService {
  public static set(name: string, value: unknown): void {
    localStorage.setItem(name, JSON.stringify(value));
  }

  public static delete(name: string): void {
    localStorage.removeItem(name);
  }

  public static get(name: string): unknown {
    return JSON.parse(localStorage.getItem(name) || '{}');
  }
}
