# Mike Team OKF & Knowledge Graph

ระบบจัดการความรู้อัจฉริยะ (Knowledge Management System) มาตรฐาน **Open Knowledge Format (OKF)** ที่ออกแบบมาเพื่อทีมงาน Mike Team โดยเฉพาะ รองรับการทำงานร่วมกับ AI Agents (ผ่าน MCP) และการเข้าถึงผ่าน Web Dashboard

## 🚀 ฟีเจอร์หลัก (Key Features)

- **AI-Native (MCP Server):** เชื่อมต่อกับ AI Agents (Claude, Gemini) เพื่อให้ AI สามารถค้นหาและสรุปข้อมูลจากคลังความรู้ของทีมได้แม่นยำ
- **Hybrid Server:** ทำงานเป็นทั้ง MCP Server (Stdio) และ REST API Server (HTTP Port 3000) ในตัวเดียวกัน
- **Interactive Knowledge Graph:** Dashboard แสดงความสัมพันธ์ของความรู้แบบกราฟ (Force-Directed Graph) 
    - รองรับการซูม (Zoom In/Out) และเลื่อน (Pan)
    - ระบบ **Highlight Synchronization**: เมื่อคลิกที่ Sidebar หรือในกราฟ ระบบจะ Highlight เส้นความสัมพันธ์ที่เกี่ยวข้องให้ทันที
- **Link Validation:** ระบบตรวจสอบ Link อัตโนมัติ ป้องกันปัญหา Broken Link โดยแสดงเป็นจุดสีแดงประในกราฟ
- **OKF Compliance:** โครงสร้างข้อมูลเป็นไปตามมาตรฐาน Open Knowledge Format (YAML Frontmatter + Markdown)

## 📁 โครงสร้างโปรเจกต์

- `okf_data/`: คลังข้อมูลเอกสาร (.md) แบ่งตามหมวดหมู่
- `okf_data/infra/server-architecture.md`: เอกสารทางเทคนิคที่สรุปสถาปัตยกรรมของระบบนี้
- `public/`: ไฟล์หน้าเว็บ Dashboard
- `index.ts`: หัวใจหลักของระบบ (Hybrid Server)
- `okf-author.skill`: Agent Skill สำหรับช่วยสร้างเอกสารให้ตรงตามมาตรฐาน

## 🛠️ การติดตั้งและใช้งาน (Installation & Usage)

### 1. ติดตั้ง Dependencies
```bash
npm install
```

### 2. เริ่มต้นการทำงาน (Start Server)
```bash
npx ts-node index.ts
```
- **Dashboard:** เข้าใช้งานที่ [http://localhost:3000](http://localhost:3000)
- **REST API:** 
    - `/api/nodes`: รายการไฟล์ทั้งหมด
    - `/api/graph`: ข้อมูลสำหรับวาดกราฟความสัมพันธ์
    - `/api/search?q=keyword`: ค้นหาข้อมูล

### 3. การสร้างเอกสารใหม่ด้วย AI Skill
หากคุณใช้ Gemini CLI สามารถติดตั้ง Skill เพื่อช่วยสร้างเอกสารที่ถูกต้องได้:
```bash
gemini skills install ./okf-author.skill --scope workspace
/skills reload
```
จากนั้นสั่ง AI: *"สร้าง node ใหม่เรื่อง [ชื่อหัวข้อ]"*

## 📄 มาตรฐานข้อมูล (OKF Standard)

ทุกไฟล์ใน `okf_data/` จะต้องมี Frontmatter ดังนี้:
```yaml
---
title: ชื่อหัวข้อ
description: คำอธิบาย
type: project | roadmap | concept | log | guideline
tags: [tag1, tag2]
timestamp: 2024-06-17T12:00:00Z
---
```

## 🤝 การสนับสนุน
หากพบปัญหาหรือต้องการฟีเจอร์เพิ่มเติม ติดต่อทีม Mike Team หรือแจ้งผ่าน Agent ได้ทันที!
