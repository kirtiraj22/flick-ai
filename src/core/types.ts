export interface AgentContext {
	userId?: string;
	sessionId?: string;
	timestamp: string;
}

export interface TokenOverview {
	id: string;
	price: number;
	metadata: TokenMetadata;
	holders: Holder[];
	marketCap: number;
}

export interface TokenMetadata {
	name: string;
	symbol: string;
	decimals: number;
	description: string;
	website: string | null;
}

export interface Holder {
	address: string;
	balance: number;
}

export interface Metrics {
	volatility: number;
	holderConcentration: number;
}

export interface RiskAssessment {
	score: number;
	flags: string[];
	confidence: "low" | "medium" | "high";
}

export interface SummaryCard {
	title: string;
	subtitle: string;
	metrics: Metrics;
	risk: RiskAssessment;
	narrative: string;
	timestamp: string;
}

export interface WalletSnapshot {
	address: string;
	txCount: number;
	commonTokens: string[];
	recentActivity: any[];
}

export interface PoolStats {
	ok: boolean;
	stats?: {
		avgPrice: number;
		std: number;
		twapDeviation: number;
		swapsCount: number;
		largeSwapCount: number;
	};
	error?: string;
}

export interface AgentResponse {
	text: string;
	card?: any;
	error?: boolean;
}
