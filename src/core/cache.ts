import { PoolStats, TokenOverview, WalletSnapshot } from "./types";

interface CacheEntry<T> {
	value: T;
	expiresAt: number;
}

export class Cache<T = any> {
	private store: Map<string, CacheEntry<T>> = new Map();
	private defaultTTL: number;

	constructor(defaultTTLSeconds = 300) {
		this.defaultTTL = defaultTTLSeconds * 1000;
	}

	set(key: string, value: T, ttlSeconds?: number): void {
		const ttl = ttlSeconds ? ttlSeconds * 1000 : this.defaultTTL;
		this.store.set(key, {
			value,
			expiresAt: Date.now() + ttl,
		});
	}

	get(key: string): T | null {
		const entry = this.store.get(key);
		if (!entry) return null;

		if (Date.now() > entry.expiresAt) {
			this.store.delete(key);
			return null;
		}

		return entry.value;
	}

	has(key: string): boolean {
		return this.get(key) !== null;
	}

	delete(key: string): void {
		this.store.delete(key);
	}

	clear(): void {
		this.store.clear();
	}

	cleanup(): void {
		const now = Date.now();
		for (const [key, entry] of this.store.entries()) {
			if (now > entry.expiresAt) {
				this.store.delete(key);
			}
		}
	}
}

export const tokenCache = new Cache<TokenOverview>(300);
export const walletCache = new Cache<WalletSnapshot>(180);
export const poolCache = new Cache<PoolStats>(120);
