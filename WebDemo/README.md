# LabMate Secure Rover - WebDemo (React + Tailwind CSS + Supabase Backend)

โฟลเดอร์นี้ประกอบด้วยระบบ **LabMate Secure Rover Web Demo** ที่แยกส่วนการทำงานอย่างชัดเจนระหว่าง **Frontend (React + Tailwind CSS)** และ **Backend (Supabase Database)**

---

## 1. จุดเด่นของสถาปัตยกรรมใหม่ (WebDemo Architecture)

1. **Frontend Stack:**
   - **React 18 & Vite:** แยก Component อย่างเป็นสัดส่วน (`Header`, `MissionSetup`, `IdentityVerification`, `StateBanner`, `TelemetryCards`, `SimulationControls`, `ChainOfCustodyTimeline`, `ExportAndActions`, `TesaiotPanel`)
   - **Tailwind CSS:** ตกแต่ง UI ทันสมัยแบบ Glassmorphism และ Dark Mode
   - **Lucide Icons:** ไอคอนเวกเตอร์คมชัดสำหรับแสดงสถานะต่างๆ
2. **Backend Stack (Supabase):**
   - **Missions Table (`missions`):** จัดเก็บภารกิจ ผู้ส่ง ผู้รับ สถานะปัจจุบัน และจุดหมาย
   - **Telemetry Logs Table (`telemetry_logs`):** บันทึกประวัติค่าเซนเซอร์แบบ Real-time (Acceleration, Tilt, Temp, Humidity, Pressure, Battery)
   - **Events Log Table (`events`):** บันทึก Secure Chain-of-Custody Timeline ที่ไม่สามารถแก้ไขได้

---

## 2. ขั้นตอนการติดตั้งและเรียกใช้งาน (Setup & Run Guide)

### ขั้นที่ 1: ติดตั้ง Dependencies
เปิด Terminal ในโฟลเดอร์ `WebDemo` แล้วรันคำสั่ง:
```bash
npm install
```

### ขั้นที่ 2: ตั้งค่า Supabase Database (ถ้ามี Account Supabase)
1. เปิด [Supabase Console](https://app.supabase.com) แล้วสร้าง Project ใหม่
2. ไปที่เมนู **SQL Editor** แล้วคัดลอกคำสั่ง SQL จากไฟล์ [`schema.sql`](file:///D:/Sittinon/Coding%202nd%20year/TESAiot/Myproject/LabMate_Person3_SourcePack/WebDemo/schema.sql) ไปวางแล้วกด **Run**
3. ไปที่ **Project Settings &rarr; API** แล้วคัดลอก **URL** และ **anon public key**
4. คัดลอกไฟล์ `.env.example` เป็น `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
5. กรอกค่าที่ได้ลงใน `.env.local`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
*(หมายเหตุ: หากยังไม่ได้ตั้งค่า Supabase ระบบจะสลับไปใช้ **Local DB Fallback** ให้อัตโนมัติ เพื่อให้สามารถทดสอบรันหน้าเว็บได้ทันที)*

### ขั้นที่ 3: เริ่มต้นรัน Dev Server
```bash
npm run dev
```
เปิดเว็บเบราว์เซอร์ที่ `http://localhost:3000`
