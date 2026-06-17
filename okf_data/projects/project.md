---
title: Chat-OKF MCP Server
description: รายละเอียดการพัฒนา MCP Server สำหรับเชื่อมต่อกับ OKF
tags: [mcp, okf, typescript, development]
---

# Project: Chat-OKF MCP Server

## วัตถุประสงค์
เพื่อสร้างตัวกลาง (Server) ที่ช่วยให้ Agent หรือ AI สามารถเข้าถึงข้อมูลในรูปแบบ OKF (Open Knowledge Format) ได้ผ่านโปรโตคอล MCP

## สถานะปัจจุบัน (Completed)
- [x] ออกแบบโครงสร้าง MCP Server (`index.ts`)
- [x] กำหนด Tools: `list_okf_nodes`, `get_okf_content`, `search_okf_nodes`
- [x] ทดสอบการเรียกใช้ Tool ผ่าน Agent
- [x] เติมข้อมูลเนื้อหาจริงลงใน Knowledge Base
- [x] ปรับปรุงระบบให้รองรับการค้นหา (Search by Tags/Query)

## เทคโนโลยีที่ใช้
- TypeScript
- Model Context Protocol (MCP) SDK
- Gray-matter (สำหรับอ่าน YAML Frontmatter)
- Glob (สำหรับค้นหาไฟล์)
