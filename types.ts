
export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female'
}

export enum Indication {
  AF = 'Atrial Fibrillation (AF)',
  VTE = 'Venous Thromboembolism (VTE)'
}

export enum NoacDrug {
  DABIGATRAN = 'Dabigatran',
  RIVAROXABAN = 'Rivaroxaban',
  EDOXABAN = 'Edoxaban',
  APIXABAN = 'Apixaban'
}

export interface PatientData {
  gender: Gender;
  age: number;
  weight: number;
  scr: number;
  crcl: number;
}

export interface ClinicalData {
  indication: Indication;
  hasHeartValveIssue: boolean; // For AF (Mechanical/Mitral Stenosis)
  currentNoac: NoacDrug;
  hasPgpInhibitors: boolean;
  hasNGTube: boolean;
  hasAntiplatelets: boolean;
}

export enum DoseStatus {
  APPROPRIATE = 'Appropriate',
  WARNING = 'Warning',
  CONTRAINDICATED = 'Contraindicated'
}

export interface DoseResult {
  status: DoseStatus;
  recommendedDose: string;
  advice: string[];
  initialTreatment?: string;
}

export interface AlternativeResult {
  drug: NoacDrug;
  recommendedDose: string;
  initialTreatment?: string;
  status: DoseStatus;
}
