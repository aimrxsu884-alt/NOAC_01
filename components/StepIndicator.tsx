
import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const steps = [
    { id: 1, icon: 'fa-user' },
    { id: 2, icon: 'fa-clipboard-list' },
    { id: 3, icon: 'fa-pills' },
    { id: 4, icon: 'fa-hand-dots' },
  ];

  return (
    <div className="px-8 py-6 flex justify-between items-center bg-transparent">
      {steps.map((s, idx) => (
        <React.Fragment key={s.id}>
          <div className="flex flex-col items-center relative">
            <div 
              className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm transition-all duration-500 ${
                currentStep === s.id 
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200 scale-110' 
                : currentStep > s.id 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              <i className={`fa-solid ${currentStep > s.id ? 'fa-check' : s.icon}`}></i>
            </div>
          </div>
          {idx < steps.length - 1 && (
            <div className={`flex-1 h-1.5 mx-2 rounded-full transition-all duration-700 ${currentStep > s.id ? 'bg-emerald-400' : 'bg-slate-100'}`}></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepIndicator;
