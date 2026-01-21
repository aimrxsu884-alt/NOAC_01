
import React, { useState } from 'react';
import { Indication } from '../types';

interface IndicationFormProps {
  onSubmit: (indication: Indication, valveIssue: boolean) => void;
}

const IndicationForm: React.FC<IndicationFormProps> = ({ onSubmit }) => {
  const [selected, setSelected] = useState<Indication | null>(null);
  const [valveIssue, setValveIssue] = useState<boolean | null>(null);

  const handleNext = () => {
    if (selected === Indication.AF) {
      if (valveIssue !== null) onSubmit(selected, valveIssue);
    } else if (selected === Indication.VTE) {
      onSubmit(selected, false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="space-y-2">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">เลือกข้อบ่งชี้</h2>
        <p className="text-slate-500 font-bold">Indication for Anticoagulation</p>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {[
          { id: Indication.AF, label: 'AF', desc: 'Atrial Fibrillation', icon: 'fa-heart-pulse', color: 'indigo' },
          { id: Indication.VTE, label: 'VTE', desc: 'Venous Thromboembolism', icon: 'fa-lungs', color: 'rose' }
        ].map((ind) => (
          <button
            key={ind.id}
            onClick={() => setSelected(ind.id)}
            className={`w-full text-left p-6 rounded-[2rem] border-4 transition-all flex items-center gap-5 relative overflow-hidden group ${
              selected === ind.id 
              ? `border-${ind.color}-600 bg-${ind.color}-50 shadow-xl shadow-${ind.color}-100` 
              : 'border-slate-50 bg-slate-50/50 hover:border-slate-200'
            }`}
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl ${
              selected === ind.id ? `bg-${ind.color}-600 text-white` : 'bg-white text-slate-400'
            }`}>
              <i className={`fa-solid ${ind.icon}`}></i>
            </div>
            <div>
              <div className={`text-xl font-black ${selected === ind.id ? `text-${ind.color}-900` : 'text-slate-800'}`}>{ind.label}</div>
              <div className="text-sm font-bold text-slate-400">{ind.desc}</div>
            </div>
            {selected === ind.id && <i className="fa-solid fa-circle-check absolute right-6 top-1/2 -translate-y-1/2 text-2xl text-indigo-600"></i>}
          </button>
        ))}
      </div>

      {selected === Indication.AF && (
        <div className="mt-8 pt-8 border-t-2 border-slate-100 animate-in fade-in zoom-in duration-300">
          <div className="bg-amber-50 border-2 border-amber-200 p-6 rounded-[2rem] mb-6">
            <h3 className="text-lg font-black text-amber-900 mb-2">ตรวจสอบเงื่อนไขเพิ่มเติม</h3>
            <p className="text-sm font-bold text-amber-800/70 mb-4 leading-snug">ผู้ป่วยมี Mechanical heart valve หรือ Mitral stenosis (Rheumatic) หรือไม่?</p>
            
            <div className="flex gap-3">
              {[
                { val: true, label: 'ใช่ (Yes)', color: 'rose' },
                { val: false, label: 'ไม่ใช่ (No)', color: 'emerald' }
              ].map((v) => (
                <button
                  key={v.val.toString()}
                  onClick={() => setValveIssue(v.val)}
                  className={`flex-1 py-4 rounded-2xl font-black text-lg border-4 transition-all ${
                    valveIssue === v.val 
                    ? `border-${v.color}-600 bg-${v.color}-600 text-white shadow-lg` 
                    : 'border-white bg-white text-slate-400 hover:border-amber-100'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <button 
        onClick={handleNext}
        disabled={!selected || (selected === Indication.AF && valveIssue === null)}
        className="w-full vibrant-gradient text-white py-6 rounded-[2rem] font-black text-2xl shadow-2xl disabled:opacity-30 transition-all active:scale-95 flex items-center justify-center gap-3"
      >
        ยืนยันข้อมูล <i className="fa-solid fa-arrow-right-long text-lg"></i>
      </button>
    </div>
  );
};

export default IndicationForm;
