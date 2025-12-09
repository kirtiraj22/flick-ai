type LogLevel = "debug" | "info" | "warn" | "error";

class Logger {
	private level: LogLevel = "info";

	setLevel(level: LogLevel) {
		this.level = level;
	}

	private shouldLog(level: LogLevel): boolean {
		const levels = { debug: 0, info: 1, warn: 2, error: 3 };
		return levels[level] >= levels[this.level];
	}

	debug(message: string, meta?: any) {
		if (this.shouldLog("debug")) {
			console.log(`[DEBUG] ${message}`, meta || "");
		}
	}

	info(message: string, meta?: any) {
		if (this.shouldLog("info")) {
			console.log(`[INFO] ${message}`, meta || "");
		}
	}

	warn(message: string, meta?: any) {
		if (this.shouldLog("warn")) {
			console.warn(`[WARN] ${message}`, meta || "");
		}
	}

	error(message: string, error?: any) {
		if (this.shouldLog("error")) {
			console.error(`[ERROR] ${message}`, error || "");
		}
	}
}

export const logger = new Logger();
