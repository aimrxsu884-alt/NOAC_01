
import React, { useState } from 'react';
import { Gender, PatientData } from '../types';

interface PatientFormProps {
  onSubmit: (data: Omit<PatientData, 'crcl'>) => void;
  initialData: PatientData;
}

const PatientForm: React.FC<PatientFormProps> = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    gender: initialData.gender,
    age: initialData.age || '',
    weight: initialData.weight || '',
    scr: initialData.scr || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.age || !formData.weight || !formData.scr) return;
    onSubmit({
      gender: formData.gender,
      age: Number(formData.age),
      weight: Number(formData.weight),
      scr: Number(formData.scr)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 mb-2">ระบุข้อมูลผู้ป่วย</h2>
          <p className="text-slate-500 font-medium">กรุณาระบุข้อมูลที่ถูกต้องเพื่อคำนวณการทำงานของไต</p>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {[Gender.MALE, Gender.FEMALE].map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setFormData({...formData, gender: g})}
              className={`flex items-center justify-center py-4 px-6 rounded-2xl font-bold transition-all duration-300 ${
                formData.gender === g 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-105' 
                : 'bg-slate-50 text-slate-500 border border-slate-100 hover:bg-slate-100'
              }`}
            >
              <i className={`fa-solid fa-${g === Gender.MALE ? 'mars' : 'venus'} mr-2 text-xl`}></i>
              {g === Gender.MALE ? 'ชาย' : 'หญิง'}
            </button>
          ))}
        </div>

        <div className="space-y-5">
          {[
            { label: 'อายุ (ปี)', key: 'age', icon: 'fa-calendar-day', placeholder: 'เช่น 65' },
            { label: 'น้ำหนัก (กิโลกรัม)', key: 'weight', icon: 'fa-weight-scale', placeholder: 'เช่น 70.5' },
            { label: 'Serum Creatinine (mg/dL)', key: 'scr', icon: 'fa-flask-vial', placeholder: 'เช่น 1.2' },
          ].map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">{field.label}</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                  <i className={`fa-solid ${field.icon}`}></i>
                </div>
                <input 
                  type="number" 
                  step="any"
                  value={formData[field.key as keyof typeof formData]}
                  onChange={e => setFormData({...formData, [field.key]: e.target.value})}
                  placeholder={field.placeholder}
                  required
                  className="w-full pl-11 p-4 rounded-2xl border border-slate-200 bg-slate-50 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 focus:bg-white outline-none transition-all font-bold text-lg"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <button 
        type="submit" 
        className="w-full bg-indigo-600 text-white py-5 rounded-[1.5rem] font-extrabold text-xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-2"
      >
        คำนวณ CrCl <i className="fa-solid fa-chevron-right text-sm"></i>
      </button>
    </form>
  );
};

export default PatientForm;
