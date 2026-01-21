
import React, { useState } from 'react';

interface CoMedsFormProps {
  onSubmit: (pgp: boolean, ng: boolean, anti: boolean) => void;
}

const CoMedsForm: React.FC<CoMedsFormProps> = ({ onSubmit }) => {
  const [pgp, setPgp] = useState<boolean>(false);
  const [ng, setNg] = useState<boolean>(false);
  const [anti, setAnti] = useState<boolean>(false);

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl shadow-sm border">
        <h2 className="text-lg font-bold text-slate-800 mb-1">ปัจจัยร่วมอื่นๆ</h2>
        <p className="text-xs text-slate-500 mb-6">ระบุการใช้ยาและเครื่องมืออื่นๆ ที่เกี่ยวข้อง</p>
        
        <div className="space-y-6">
          {/* P-gp Inhibitors */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <i className="fa-solid fa-capsules text-indigo-500 mt-1"></i>
              <div>
                <h3 className="text-sm font-bold text-slate-800">ยาที่ใช้ร่วม (Strong P-gp Inhibitor)</h3>
                <p className="text-[10px] text-slate-500 italic">Verapamil, Dronedarone, Erythromycin, Ketoconazole, Ciclosporine</p>
              </div>
            </div>
            <div className="flex gap-2">
              {[true, false].map((v) => (
                <button
                  key={`pgp-${v}`}
                  onClick={() => setPgp(v)}
                  className={`flex-1 py-3 rounded-xl font-medium border-2 transition-all ${
                    pgp === v ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 text-slate-500'
                  }`}
                >
                  {v ? 'มี (Yes)' : 'ไม่มี (No)'}
                </button>
              ))}
            </div>
          </div>

          {/* NG Tube */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <i className="fa-solid fa-vial text-indigo-500 mt-1"></i>
              <div>
                <h3 className="text-sm font-bold text-slate-800">การให้อาหารทางสายยาง (NG tube)</h3>
                <p className="text-[10px] text-slate-500 italic">สำหรับการประเมินการดูดซึมและชนิดของยา</p>
              </div>
            </div>
            <div className="flex gap-2">
              {[true, false].map((v) => (
                <button
                  key={`ng-${v}`}
                  onClick={() => setNg(v)}
                  className={`flex-1 py-3 rounded-xl font-medium border-2 transition-all ${
                    ng === v ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 text-slate-500'
                  }`}
                >
                  {v ? 'ใส่ (Yes)' : 'ไม่ใส่ (No)'}
                </button>
              ))}
            </div>
          </div>

          {/* Antiplatelets */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <i className="fa-solid fa-tablets text-indigo-500 mt-1"></i>
              <div>
                <h3 className="text-sm font-bold text-slate-800">ยาต้านเกล็ดเลือด (Antiplatelets)</h3>
                <p className="text-[10px] text-slate-500 italic">เช่น Aspirin, Clopidogrel</p>
              </div>
            </div>
            <div className="flex gap-2">
              {[true, false].map((v) => (
                <button
                  key={`anti-${v}`}
                  onClick={() => setAnti(v)}
                  className={`flex-1 py-3 rounded-xl font-medium border-2 transition-all ${
                    anti === v ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 text-slate-500'
                  }`}
                >
                  {v ? 'มีใช้ (Yes)' : 'ไม่มี (No)'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <button 
        onClick={() => onSubmit(pgp, ng, anti)}
        className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg transition-all active:scale-[0.98]"
      >
        ประมวลผลสุดท้าย <i className="fa-solid fa-wand-magic-sparkles ml-2"></i>
      </button>
    </div>
  );
};

export default CoMedsForm;
