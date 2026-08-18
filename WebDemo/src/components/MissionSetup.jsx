import React, { useState } from 'react';
import { Package, PlusCircle } from 'lucide-react';

export default function MissionSetup({ onCreateMission, showToast }) {
  const [sender, setSender] = useState('ดร.สมชาย (ผู้ดูแล Lab)');
  const [receiver, setReceiver] = useState('ศ.ดร.อนันต์ (อาจารย์ที่ปรึกษา)');
  const [packageName, setPackageName] = useState('Laboratory Equipment (LAB-042)');
  const [destination, setDestination] = useState('Engineering Laboratory 402');

  const handlePreset = (id) => {
    if (id === 1) {
      setSender('ดร.สมชาย (ผู้ดูแล Lab)');
      setReceiver('ศ.ดร.อนันต์ (อาจารย์ที่ปรึกษา)');
      setPackageName('Laboratory Equipment (LAB-042)');
      setDestination('Engineering Laboratory 402');
    } else {
      setSender('ดร.นิภา (นักวิจัย)');
      setReceiver('ศูนย์ตรวจวิเคราะห์จุลชีววิทยา');
      setPackageName('ตัวอย่างสารชีวเคมี (BIO-SAMP-09)');
      setDestination('Bio-Safety Level 3 Lab');
    }
    showToast('โหลดข้อมูลตัวอย่างเรียบร้อย');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateMission({ sender, receiver, packageName, destination });
  };

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-clinical">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
        <h2 className="text-base font-semibold font-display text-[#0c2b4e] flex items-center gap-2">
          <Package className="w-4 h-4 text-[#1d546c]" />
          ตั้งค่าภารกิจ (Mission Setup)
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <button
          type="button"
          onClick={() => handlePreset(1)}
          className="bg-[#f4f4f4] hover:bg-[#e8e8e8] text-[#43474e] text-xs font-medium py-2 px-2.5 rounded-xl border border-[#e2e8f0] transition"
        >
          อุปกรณ์ Lab-042
        </button>
        <button
          type="button"
          onClick={() => handlePreset(2)}
          className="bg-[#f4f4f4] hover:bg-[#e8e8e8] text-[#43474e] text-xs font-medium py-2 px-2.5 rounded-xl border border-[#e2e8f0] transition"
        >
          สารเคมีทดลอง
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label className="block label-caps text-[#43474e] mb-1">
            ผู้ส่ง (Sender)
          </label>
          <input
            type="text"
            value={sender}
            onChange={(e) => setSender(e.target.value)}
            className="w-full bg-[#f9f9f9] border border-[#c4c6cf] rounded-xl px-3.5 py-2 text-sm text-[#1a1c1c] focus:outline-none focus:border-[#1d546c] focus:ring-2 focus:ring-[#1d546c]/20 transition"
            required
          />
        </div>

        <div>
          <label className="block label-caps text-[#43474e] mb-1">
            ผู้รับ (Receiver)
          </label>
          <input
            type="text"
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
            className="w-full bg-[#f9f9f9] border border-[#c4c6cf] rounded-xl px-3.5 py-2 text-sm text-[#1a1c1c] focus:outline-none focus:border-[#1d546c] focus:ring-2 focus:ring-[#1d546c]/20 transition"
            required
          />
        </div>

        <div>
          <label className="block label-caps text-[#43474e] mb-1">
            รายการทรัพย์สิน/เอกสาร
          </label>
          <input
            type="text"
            value={packageName}
            onChange={(e) => setPackageName(e.target.value)}
            className="w-full bg-[#f9f9f9] border border-[#c4c6cf] rounded-xl px-3.5 py-2 text-sm text-[#1a1c1c] focus:outline-none focus:border-[#1d546c] focus:ring-2 focus:ring-[#1d546c]/20 transition"
            required
          />
        </div>

        <div>
          <label className="block label-caps text-[#43474e] mb-1">
            จุดหมายปลายทาง
          </label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full bg-[#f9f9f9] border border-[#c4c6cf] rounded-xl px-3.5 py-2 text-sm text-[#1a1c1c] focus:outline-none focus:border-[#1d546c] focus:ring-2 focus:ring-[#1d546c]/20 transition"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full mt-2 bg-[#0c2b4e] hover:bg-[#001631] text-white font-semibold py-2.5 px-4 rounded-xl shadow-clinical text-sm flex items-center justify-center gap-2 transition"
        >
          <PlusCircle className="w-4 h-4" />
          สร้างภารกิจ (Create Mission)
        </button>
      </form>
    </div>
  );
}
