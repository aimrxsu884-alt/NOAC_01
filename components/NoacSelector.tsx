
import React, { useState } from 'react';
import { NoacDrug } from '../types';

interface NoacSelectorProps {
  onSubmit: (drug: NoacDrug) => void;
}

const NoacSelector: React.FC<NoacSelectorProps> = ({ onSubmit }) => {
  const [selected, setSelected] = useState<NoacDrug | null>(null);

  const drugs = [
    { name: NoacDrug.DABIGATRAN, brand: 'Pradaxa', color: 'bg-blue-500' },
    { name: NoacDrug.RIVAROXABAN, brand: 'Xarelto', color: 'bg-red-500' },
    { name: NoacDrug.EDOXABAN, brand: 'Lixiana', color: 'bg-green-500' },
    { name: NoacDrug.APIXABAN, brand: 'Eliquis', color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl shadow-sm border">
        <h2 className="text-lg font-bold text-slate-800 mb-1">เลือกยา NOAC ที่ใช้</h2>
        <p className="text-xs text-slate-500 mb-5">เลือกยาที่ต้องการประเมินความเหมาะสม</p>
        
        <div className="grid grid-cols-1 gap-3">
          {drugs.map((d) => (
            <button
              key={d.name}
              onClick={() => setSelected(d.name)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between group ${
                selected === d.name 
                ? 'border-indigo-600 bg-indigo-50 shadow-sm' 
                : 'border-slate-100 hover:border-indigo-200'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-3 h-10 rounded-full ${d.color} opacity-80 group-hover:opacity-100`}></div>
                <div>
                  <div className={`font-bold text-lg ${selected === d.name ? 'text-indigo-700' : 'text-slate-800'}`}>
                    {d.name}
                  </div>
                  <div className="text-xs text-slate-500 font-medium">Original: {d.brand}</div>
                </div>
              </div>
              {selected === d.name && (
                <div className="bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center">
                  <i className="fa-solid fa-check text-xs"></i>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <button 
        onClick={() => selected && onSubmit(selected)}
        disabled={!selected}
        className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg disabled:opacity-50 transition-all active:scale-[0.98]"
      >
        ตรวจสอบปริมาณยา <i className="fa-solid fa-arrow-right ml-2"></i>
      </button>
    </div>
  );
};

export default NoacSelector;
