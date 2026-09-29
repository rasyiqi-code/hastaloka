export type VectorKey = 'drive' | 'adaptability' | 'stability' | 'synthesis' | 'connectivity';

export interface VectorScore {
  drive: number; // 0 - 100
  adaptability: number; // 0 - 100
  stability: number; // 0 - 100
  synthesis: number; // 0 - 100
  connectivity: number; // 0 - 100
}

export interface Question {
  id: string; // e.g., 'D1', 'A1'
  vector: VectorKey;
  text: string;
  categoryTitle: string;
}

export interface ArchetypeProfile {
  id: string;
  name: string;
  indonesianName: string;
  role: string;
  vectorDominance: string;
  description: string;
  idealVector: VectorScore;
  strengths: string[];
  blindSpots: string[];
  careerStrategy: string;
  wealthStrategy: string;
  circadianGuidance: string;
  color: string;
}

export interface ArchetypeMatch {
  archetype: ArchetypeProfile;
  similarity: number; // 0 - 100%
}

export interface AssessmentResult {
  id: string;
  timestamp: string;
  userName: string;
  userAge?: number;
  userProfession?: string;
  chronotype: 'lark' | 'owl' | 'intermediate';
  rawScores: Record<string, number>;
  vectorScores: VectorScore;
  primaryArchetype: ArchetypeProfile;
  secondaryArchetype: ArchetypeProfile;
  allArchetypeMatches: ArchetypeMatch[];
  notes?: string;
}

export interface DailyReadinessRecord {
  id: string;
  date: string;
  time: string;
  ct: number; // 0 - 100
  kt: number; // 0 - 100
  st: number; // 0 - 100
  rt: number; // 0 - 100
  status: 'Optimal' | 'Standar' | 'Kritis';
  recommendation: string;
}

export interface LifeDomain {
  id: number;
  name: string;
  description: string;
  auditAspects: string[];
  category: 'Fisik & Energi' | 'Kognisi & Psikologis' | 'Karier & Finansial' | 'Relasi & Makna';
}

export interface SynergyProtocol {
  type: 'Tinggi' | 'Rawan Gesekan' | 'Netral Komplementer';
  tagline: string;
  description: string;
  protocol?: string;
}
