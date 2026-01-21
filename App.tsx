
import React, { useState } from 'react';
import { 
  Gender, 
  Indication, 
  NoacDrug, 
  PatientData, 
  ClinicalData,
  DoseStatus 
} from './types';
import { calculateCrCl, evaluateNoac } from './constants';
import { GoogleGenAI } from "@google/genai";

import StepIndicator from './components/StepIndicator';
import PatientForm from './components/PatientForm';
import IndicationForm from './components/IndicationForm';
import NoacSelector from './components/NoacSelector';
import CoMedsForm from './components/CoMedsForm';
import ResultsView from './components/ResultsView';

// URL สำหรับเชื่อมต่อกับ Google Apps Script ที่คุณส่งมา
const GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyq0Hcv3ks8KBrj7Skc4Oi7vtB9f9J1Rlijci35dXeZU-f41ubKVfABIAfjLerq8RE7/exec"; 

const App: React.FC = () => {
  const [step, setStep] = useState(1);
  const [patient, setPatient] = useState<PatientData>({
    gender: Gender.MALE,
    age: 0,
    weight: 0,
    scr: 0,
    crcl: 0
  });

  const [clinical, setClinical] = useState<ClinicalData>({
    indication: Indication.AF,
    hasHeartValveIssue: false,
    currentNoac: NoacDrug.DABIGATRAN,
    hasPgpInhibitors: false,
    hasNGTube: false,
    hasAntiplatelets: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [smartAdvice, setSmartAdvice] = useState<string>("");

  const handlePatientSubmit = (data: Omit<PatientData, 'crcl'>) => {
    const crcl = calculateCrCl(data);
    setPatient({ ...data, crcl });
    setStep(2);
  };

  const handleIndicationSubmit = (indication: Indication, valveIssue: boolean) => {
    if (indication === Indication.AF && valveIssue) {
      const updatedClinical = { ...clinical, indication, hasHeartValveIssue: true };
      setClinical(updatedClinical);
      setStep(6);
      saveToDatabase(updatedClinical, "Warfarin Recommended (Valve Issue)");
    } else {
      setClinical({ ...clinical, indication, hasHeartValveIssue: false });
      setStep(3);
    }
  };

  const handleNoacSubmit = (drug: NoacDrug) => {
    setClinical({ ...clinical, currentNoac: drug });
    setStep(4);
  };

  const handleCoMedsSubmit = (pgp: boolean, ng: boolean, anti: boolean) => {
    const finalClinical = { ...clinical, hasPgpInhibitors: pgp, hasNGTube: ng, hasAntiplatelets: anti };
    setClinical(finalClinical);
    setStep(6);
    
    const result = evaluateNoac(finalClinical.currentNoac, patient, finalClinical);
    saveToDatabase(finalClinical, result.recommendedDose);
    generateSmartAdvice(finalClinical);
  };

  const saveToDatabase = async (finalClinical: ClinicalData, doseResult: string) => {
    if (!GAS_WEB_APP_URL || GAS_WEB_APP_URL.includes("YOUR_ACTUAL_ID")) {
      console.warn("GAS Web App URL is not configured yet.");
      return;
    }

    setIsSaving(true);
    try {
      // ส่งข้อมูลไปยัง Google Apps Script
      await fetch(GAS_WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gender: patient.gender,
          age: patient.age,
          weight: patient.weight,
          crcl: patient.crcl,
          indication: finalClinical.indication,
          drug: finalClinical.currentNoac,
          doseResult: doseResult
        }),
      });
      console.log("Log saved successfully to Google Sheets");
    } catch (e) {
      console.error("Failed to save to database:", e);
    } finally {
      setIsSaving(false);
    }
  };

  const generateSmartAdvice = async (updatedClinical: ClinicalData) => {
    setIsLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const drug = updatedClinical.currentNoac;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `สรุปคำแนะนำสั้นๆ สำหรับยา ${drug}:
        1. การกินยา: เน้นตรงเวลาสม่ำเสมอทุกวัน
        2. ลืมกินยา: ระบุจำนวนชั่วโมงที่ยังทานได้ (OD: 12 ชม. / BID: 6 ชม.) ห้ามเพิ่มขนาดยา
        3. ข้อระวังเฉพาะ: (เช่น Rivaroxaban กินพร้อมอาหาร, Dabigatran ห้ามแกะแคปซูล)
        4. อาการผิดปกติ: เลือดออกผิดปกติ จ้ำเลือด
        เขียนภาษาไทย สั้น กระชับ เป็นข้อๆ ไม่ต้องมีคำนำ`,
      });
      setSmartAdvice(response.text || "");
    } catch (e) {
      setSmartAdvice("กินยาตรงเวลาทุกวัน หากลืมให้รีบทานทันทีภายในเวลาที่กำหนด และสังเกตอาการเลือดออกผิดปกติ");
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setStep(1);
    setSmartAdvice("");
  };

  return (
    <div className="max-w-lg mx-auto min-h-screen bg-white flex flex-col shadow-2xl overflow-x-hidden">
      <header className="vibrant-gradient text-white p-8 pt-10 pb-16 rounded-b-[4rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 text-[12rem] -mr-16 -mt-8 rotate-12">
          <i className="fa-solid fa-notes-medical"></i>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-5">
            <div className="bg-white/20 backdrop-blur-xl p-4 rounded-[1.5rem] border border-white/40 shadow-inner">
              <i className="fa-solid fa-shield-halved text-4xl"></i>
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight leading-none mb-1">NOAC <span className="text-indigo-200">Guard</span></h1>
              <p className="text-sm font-bold text-indigo-100/80 uppercase tracking-widest">Clinical Decision Support</p>
            </div>
          </div>
        </div>
      </header>

      <div className="-mt-10 px-4 flex-1 pb-10 relative z-20">
        <div className="bg-white/90 backdrop-blur-md rounded-[3rem] shadow-2xl border border-indigo-50/50 min-h-[500px] flex flex-col overflow-hidden">
          {step < 6 && <StepIndicator currentStep={step} />}
          
          <main className="flex-1 p-6 lg:p-10">
            {step === 1 && <PatientForm onSubmit={handlePatientSubmit} initialData={patient} />}
            {step === 2 && <IndicationForm onSubmit={handleIndicationSubmit} />}
            {step === 3 && <NoacSelector onSubmit={handleNoacSubmit} />}
            {step === 4 && <CoMedsForm onSubmit={handleCoMedsSubmit} />}
            {step === 6 && (
              <ResultsView 
                patient={patient} 
                clinical={clinical} 
                smartAdvice={smartAdvice}
                isLoading={isLoading}
                onReset={reset} 
              />
            )}
          </main>
        </div>
      </div>

      {isSaving && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-2 rounded-full text-xs font-bold animate-pulse shadow-lg flex items-center gap-2">
           <i className="fa-solid fa-spinner animate-spin"></i> กำลังบันทึกข้อมูลการใช้งาน...
        </div>
      )}

      <footer className="p-8 text-center text-slate-300 text-[10px] font-black uppercase tracking-widest">
        Clinical Database Integrated v2.5
      </footer>
    </div>
  );
};

export default App;
