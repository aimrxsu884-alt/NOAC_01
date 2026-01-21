
import React from 'react';
import { 
  PatientData, 
  ClinicalData, 
  DoseStatus, 
  NoacDrug, 
  AlternativeResult 
} from '../types';
import { evaluateNoac } from '../constants';

interface ResultsViewProps {
  patient: PatientData;
  clinical: ClinicalData;
  smartAdvice: string;
  isLoading: boolean;
  onReset: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({ patient, clinical, smartAdvice, isLoading, onReset }) => {
  const result = evaluateNoac(clinical.currentNoac, patient, clinical);
  
  const alternatives: AlternativeResult[] = Object.values(NoacDrug)
    .filter(d => d !== clinical.currentNoac)
    .map(d => {
      const res = evaluateNoac(d, patient, clinical);
      return {
        drug: d,
        recommendedDose: res.recommendedDose,
        initialTreatment: res.initialTreatment,
        status: res.status
      };
    })
    .filter(alt => alt.status === DoseStatus.APPROPRIATE);

  const getStatusStyle = (status: DoseStatus) => {
    switch (status) {
      case DoseStatus.APPROPRIATE: return 'from-emerald-500 to-teal-600 text-white';
      case DoseStatus.WARNING: return 'from-amber-400 to-orange-500 text-white';
      case DoseStatus.CONTRAINDICATED: return 'from-rose-500 to-red-600 text-white';
    }
  };

  const getStatusIcon = (status: DoseStatus) => {
    switch (status) {
      case DoseStatus.APPROPRIATE: return 'fa-circle-check';
      case DoseStatus.WARNING: return 'fa-triangle-exclamation';
      case DoseStatus.CONTRAINDICATED: return 'fa-circle-xmark';
    }
  };

  if (clinical.hasHeartValveIssue) {
    return (
      <div className="space-y-8 animate-in fade-in zoom-in duration-300">
        <div className="bg-rose-50 border-4 border-rose-100 p-8 rounded-[2.5rem] text-center shadow-inner">
          <div className="bg-rose-500 w-20 h-20 rounded-3xl flex items-center justify-center text-white text-4xl mx-auto mb-6 shadow-lg shadow-rose-200">
            <i className="fa-solid fa-hand-stop"></i>
          </div>
          <h2 className="text-3xl font-black text-rose-800 mb-4">ห้ามใช้ NOAC!</h2>
          <p className="text-xl text-rose-700 font-bold leading-relaxed">
            ไม่แนะนำเนื่องจากมีภาวะลิ้นหัวใจเทียมหรือลิ้นหัวใจตีบรุนแรง<br/>
            <span className="text-rose-900 underline decoration-wavy">พิจารณาใช้ Warfarin แทน</span>
          </p>
        </div>
        <button onClick={onReset} className="w-full bg-slate-800 text-white py-5 rounded-[2rem] font-black text-xl shadow-xl active:scale-95 transition-all">กลับหน้าแรก</button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
      {/* 1. Metrics */}
      <div className="flex gap-3">
        <div className="flex-1 bg-indigo-50 border border-indigo-100 rounded-[2rem] p-5 text-center shadow-sm">
          <p className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-widest mb-1">CrCl (ml/min)</p>
          <p className="text-4xl font-black text-indigo-700">{patient.crcl}</p>
        </div>
        <div className="flex-1 bg-slate-50 border border-slate-100 rounded-[2rem] p-5 text-center shadow-sm">
          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Drug Selected</p>
          <p className="text-lg font-black text-slate-700">{clinical.currentNoac}</p>
        </div>
      </div>

      {/* 2. Primary Result */}
      <div className={`rounded-[3rem] p-8 text-center bg-gradient-to-br shadow-2xl ${getStatusStyle(result.status)}`}>
        <div className="text-5xl mb-4 drop-shadow-md">
          <i className={`fa-solid ${getStatusIcon(result.status)}`}></i>
        </div>
        <h2 className="text-4xl font-black mb-2 tracking-tight">{result.status === DoseStatus.APPROPRIATE ? 'เหมาะสม' : 'ควรระวัง'}</h2>
        
        <div className="mt-8 bg-white/20 backdrop-blur-md rounded-[2rem] p-6 border border-white/30">
          <p className="text-xs font-bold uppercase tracking-widest mb-2 opacity-80">ขนาดยาที่แนะนำ</p>
          <p className="text-4xl font-black">{result.recommendedDose}</p>
        </div>
      </div>

      {/* 3. Static Guidance */}
      {result.advice.length > 0 && (
        <div className="bg-white border-2 border-slate-100 rounded-[2rem] p-6 shadow-sm">
          <ul className="space-y-3">
            {result.advice.map((a, i) => (
              <li key={i} className="flex gap-3 text-sm text-slate-600 font-bold leading-snug">
                <i className="fa-solid fa-circle-check text-emerald-500 mt-0.5"></i>
                {a}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 4. Alternatives */}
      <div className="space-y-4">
        <h3 className="text-xl font-extrabold text-slate-800 ml-2">ทางเลือกยาอื่นๆ (Alternatives)</h3>
        <div className="space-y-3">
          {alternatives.map((alt) => (
            <div key={alt.drug} className="bg-white border-2 border-emerald-50 p-5 rounded-[2.5rem] flex justify-between items-center">
              <div>
                <p className="text-xl font-black text-slate-800">{alt.drug}</p>
                <p className="text-emerald-600 font-bold">{alt.recommendedDose}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full uppercase tracking-widest">Safe</span>
                {alt.initialTreatment && <p className="text-[10px] text-slate-400 mt-1 italic">*{alt.initialTreatment}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Pharmacist Smart Note (Bottom) */}
      <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl border-t-4 border-indigo-500">
        <div className="absolute top-0 right-0 p-6 opacity-10 text-8xl rotate-12 -mr-4 -mt-4">
          <i className="fa-solid fa-user-doctor"></i>
        </div>
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-4">
            <span className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-2xl shadow-lg">
              <i className="fa-solid fa-clipboard-check"></i>
            </span>
            <div>
              <h3 className="text-xl font-black">Pharmacist Smart Note</h3>
              <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">คำแนะนำการปฏิบัติตัว</p>
            </div>
          </div>
          
          <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10">
            {isLoading ? (
              <div className="flex items-center gap-3 py-2">
                <div className="animate-spin h-5 w-5 border-3 border-indigo-400 border-t-transparent rounded-full"></div>
                <p className="font-bold">สรุปคำแนะนำสั้นๆ...</p>
              </div>
            ) : (
              <div className="text-lg font-medium leading-relaxed whitespace-pre-line text-indigo-50">
                {smartAdvice}
              </div>
            )}
          </div>
        </div>
      </div>

      <button 
        onClick={onReset} 
        className="w-full bg-slate-100 text-slate-800 py-6 rounded-[2rem] font-black text-2xl border-2 border-slate-200 active:scale-95 transition-all flex items-center justify-center gap-3"
      >
        <i className="fa-solid fa-rotate-left"></i> เริ่มใหม่
      </button>
    </div>
  );
};

export default ResultsView;
