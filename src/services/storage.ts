import type { AssessmentResult, DailyReadinessRecord } from '../types/hastaloka';
import { matchAllArchetypes } from '../utils/hastalokaMath';

const STORAGE_KEYS = {
  CURRENT_RESULT: 'hastaloka_current_assessment',
  HISTORY: 'hastaloka_assessment_history',
  DAILY_READINESS: 'hastaloka_daily_readiness_logs',
  USER_PROFILE: 'hastaloka_user_profile',
};

export const StorageService = {
  // Current Assessment
  getCurrentAssessment(): AssessmentResult | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_RESULT);
      if (!data) return null;
      const parsed = JSON.parse(data);
      if (parsed?.vectorScores) {
        // Kalibrasi ulang skor kecocokan dengan formula Centered Cosine terbaru
        parsed.allArchetypeMatches = matchAllArchetypes(parsed.vectorScores);
        parsed.primaryArchetype = parsed.allArchetypeMatches[0].archetype;
        parsed.secondaryArchetype = parsed.allArchetypeMatches[1]?.archetype;
      }
      return parsed;
    } catch (e) {
      console.error('Failed to get current assessment:', e);
      return null;
    }
  },

  saveCurrentAssessment(result: AssessmentResult): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_RESULT, JSON.stringify(result));
      this.addToHistory(result);
    } catch (e) {
      console.error('Failed to save assessment', e);
    }
  },

  // History
  getHistory(): AssessmentResult[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to get history:', e);
      return [];
    }
  },

  addToHistory(result: AssessmentResult): void {
    try {
      const history = this.getHistory();
      // Cegah duplikasi ID
      const filtered = history.filter(h => h.id !== result.id);
      filtered.unshift(result);
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(filtered.slice(0, 50)));
    } catch (e) {
      console.error('Failed to update history', e);
    }
  },

  // Daily Readiness Logs
  getDailyReadinessLogs(): DailyReadinessRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DAILY_READINESS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to get daily readiness logs:', e);
      return [];
    }
  },

  saveDailyReadiness(record: DailyReadinessRecord): void {
    try {
      const logs = this.getDailyReadinessLogs();
      logs.unshift(record);
      localStorage.setItem(STORAGE_KEYS.DAILY_READINESS, JSON.stringify(logs.slice(0, 100)));
    } catch (e) {
      console.error('Failed to save readiness log', e);
    }
  },

  // Backup & Restore
  exportAllData(): string {
    const backup = {
      assessment: this.getCurrentAssessment(),
      history: this.getHistory(),
      readiness: this.getDailyReadinessLogs(),
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(backup, null, 2);
  },

  importAllData(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.assessment) localStorage.setItem(STORAGE_KEYS.CURRENT_RESULT, JSON.stringify(parsed.assessment));
      if (parsed.history) localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(parsed.history));
      if (parsed.readiness) localStorage.setItem(STORAGE_KEYS.DAILY_READINESS, JSON.stringify(parsed.readiness));
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  },

  // Copilot Chat History
  getCopilotChatHistory(): Array<{ role: 'user' | 'assistant'; content: string }> | null {
    try {
      const data = localStorage.getItem('hastaloka_copilot_chat_history');
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  saveCopilotChatHistory(messages: Array<{ role: 'user' | 'assistant'; content: string }>): void {
    try {
      localStorage.setItem('hastaloka_copilot_chat_history', JSON.stringify(messages));
    } catch (e) {
      console.error('Failed to save copilot chat history', e);
    }
  },

  clearCopilotChatHistory(): void {
    try {
      localStorage.removeItem('hastaloka_copilot_chat_history');
    } catch (e) {
      console.error('Failed to clear copilot chat history', e);
    }
  },

  // Copilot Simulator State
  getCopilotSimulatorState(): { dilemma: string; result: string | null; followUps: Array<{ role: 'user' | 'assistant'; content: string }> } | null {
    try {
      const data = localStorage.getItem('hastaloka_copilot_simulator_state');
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  saveCopilotSimulatorState(state: { dilemma: string; result: string | null; followUps: Array<{ role: 'user' | 'assistant'; content: string }> }): void {
    try {
      localStorage.setItem('hastaloka_copilot_simulator_state', JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save copilot simulator state', e);
    }
  },

  clearCopilotSimulatorState(): void {
    try {
      localStorage.removeItem('hastaloka_copilot_simulator_state');
    } catch (e) {
      console.error('Failed to clear copilot simulator state', e);
    }
  }
};
