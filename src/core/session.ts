import { AgentContext } from './types';

export interface SessionData {
  userId: string;
  sessionId: string;
  conversationHistory: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export class SessionManager {
  private sessions: Map<string, SessionData> = new Map();

  createSession(userId: string): SessionData {
    const sessionId = `${userId}_${Date.now()}`;
    const session: SessionData = {
      userId,
      sessionId,
      conversationHistory: [],
      metadata: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.sessions.set(sessionId, session);
    return session;
  }

  getSession(sessionId: string): SessionData | null {
    return this.sessions.get(sessionId) || null;
  }

  updateSession(sessionId: string, updates: Partial<SessionData>): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      Object.assign(session, updates, { updatedAt: new Date().toISOString() });
    }
  }

  addMessage(
    sessionId: string,
    role: 'user' | 'assistant',
    content: string
  ): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.conversationHistory.push({
        role,
        content,
        timestamp: new Date().toISOString()
      });
      session.updatedAt = new Date().toISOString();
    }
  }

  clearSession(sessionId: string): void {
    this.sessions.delete(sessionId);
  }
}

export const sessionManager = new SessionManager();
