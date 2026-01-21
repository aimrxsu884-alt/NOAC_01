
import { 
  Gender, 
  Indication, 
  NoacDrug, 
  PatientData, 
  ClinicalData, 
  DoseResult, 
  DoseStatus 
} from './types';

export const calculateCrCl = (patient: Omit<PatientData, 'crcl'>): number => {
  const { age, weight, scr, gender } = patient;
  let crcl = ((140 - age) * weight) / (72 * scr);
  if (gender === Gender.FEMALE) {
    crcl *= 0.85;
  }
  return parseFloat(crcl.toFixed(2));
};

export const evaluateNoac = (
  drug: NoacDrug, 
  patient: PatientData, 
  clinical: ClinicalData 
): DoseResult => {
  const { crcl, age, weight, scr } = patient;
  const { indication, hasNGTube, hasAntiplatelets, hasPgpInhibitors } = clinical;

  // General Contraindication
  if (crcl < 15) {
    return {
      status: DoseStatus.CONTRAINDICATED,
      recommendedDose: 'N/A',
      advice: ['CrCl < 15 ml/min: NOACs are generally contraindicated. Consider Warfarin or clinician discretion.']
    };
  }

  const advice: string[] = [];
  let initialTreatment = '';

  if (indication === Indication.VTE) {
    if (drug === NoacDrug.DABIGATRAN || drug === NoacDrug.EDOXABAN) {
      initialTreatment = 'LMWH (Enoxaparin) or UFH for 5-10 days prior to initiation.';
    }
  }

  switch (drug) {
    case NoacDrug.DABIGATRAN:
      if (crcl < 30) {
        return { status: DoseStatus.CONTRAINDICATED, recommendedDose: 'N/A', advice: ['Dabigatran is not recommended for CrCl < 30 ml/min.'] };
      }
      if (hasNGTube) {
        return { status: DoseStatus.WARNING, recommendedDose: 'N/A', advice: ['Dabigatran MUST NOT be administered via NG tube (capsule must not be opened).'] };
      }
      
      let factorCount = 0;
      if (age >= 80) factorCount++;
      if (clinical.hasPgpInhibitors) factorCount++; // Verapamil is a P-gp inhibitor
      if (hasAntiplatelets) factorCount++;

      if (factorCount >= 1) {
        return { status: DoseStatus.APPROPRIATE, recommendedDose: '110 mg BID', advice, initialTreatment };
      }
      return { status: DoseStatus.APPROPRIATE, recommendedDose: '150 mg BID', advice, initialTreatment };

    case NoacDrug.RIVAROXABAN:
      if (indication === Indication.VTE) {
        return { status: DoseStatus.APPROPRIATE, recommendedDose: '15 mg BID for 21 days, then 20 mg OD', advice, initialTreatment };
      }
      if (crcl > 50) {
        return { status: DoseStatus.APPROPRIATE, recommendedDose: '20 mg OD', advice, initialTreatment };
      }
      return { status: DoseStatus.APPROPRIATE, recommendedDose: '15 mg OD', advice, initialTreatment };

    case NoacDrug.EDOXABAN:
      let edoxFactor = 0;
      if (weight <= 60) edoxFactor++;
      if (crcl >= 15 && crcl <= 49) edoxFactor++;
      if (hasPgpInhibitors) edoxFactor++; // Dronedarone, Erythromycin, Ketoconazole, Ciclosporine

      if (edoxFactor >= 1) {
        return { status: DoseStatus.APPROPRIATE, recommendedDose: '30 mg OD', advice, initialTreatment };
      }
      if (crcl > 50) {
        return { status: DoseStatus.APPROPRIATE, recommendedDose: '60 mg OD', advice, initialTreatment };
      }
      return { status: DoseStatus.APPROPRIATE, recommendedDose: 'N/A', advice: ['Consider clinician discretion for CrCl 15-50 range.'], initialTreatment };

    case NoacDrug.APIXABAN:
      if (indication === Indication.VTE) {
        return { status: DoseStatus.APPROPRIATE, recommendedDose: '10 mg BID for 7 days, then 5 mg BID', advice: ['No dose reduction needed for VTE if CrCl > 15'], initialTreatment };
      }
      if (crcl >= 15 && crcl <= 29) {
        return { status: DoseStatus.APPROPRIATE, recommendedDose: '2.5 mg BID', advice, initialTreatment };
      }
      
      // AF dose reduction criteria (2 of 3)
      let apixFactor = 0;
      if (age >= 80) apixFactor++;
      if (weight <= 60) apixFactor++;
      if (scr >= 1.5) apixFactor++;

      if (apixFactor >= 2) {
        return { status: DoseStatus.APPROPRIATE, recommendedDose: '2.5 mg BID', advice, initialTreatment };
      }
      return { status: DoseStatus.APPROPRIATE, recommendedDose: '5 mg BID', advice, initialTreatment };

    default:
      return { status: DoseStatus.WARNING, recommendedDose: 'Unknown', advice: ['Unable to evaluate.'] };
  }
};
