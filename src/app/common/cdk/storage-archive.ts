export abstract class StorageArchive<T> {

	abstract getStorageKey(): string;

	store(value: T, extendKey?: string): void {
		localStorage.setItem(`${this.getStorageKey()}${this.getExtendedKey(extendKey)}`, JSON.stringify(value));
	}

	getStoredValue(extendKey?: string): T {
		const value = localStorage.getItem(`${this.getStorageKey()}${this.getExtendedKey(extendKey)}`);

		if (value) {
			return JSON.parse(value);
		}
	}

	clear(extendKey?: string): void {
		localStorage.removeItem(`${this.getStorageKey()}${this.getExtendedKey(extendKey)}`);
	}

	private getExtendedKey(key: string): string {
		return key ? `_${key}` : '';
	}
}
