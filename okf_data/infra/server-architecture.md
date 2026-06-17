---
title: Server Architecture (Hybrid MCP & REST)
description: รายละเอียดโครงสร้างการทำงานของ Hybrid Server ที่รองรับทั้ง MCP Protocol และ REST API
type: concept
tags: [architecture, mcp, rest-api, typescript]
timestamp: 2024-06-17T13:00:00Z
---

# Server Architecture: Hybrid MCP & REST

ระบบหัวใจหลักของ Mike Team OKF ถูกออกแบบมาให้ทำงานแบบ **Hybrid** เพื่อความยืดหยุ่นในการใช้งานสูงสุด

## 1. Core Logic Layer
ฟังก์ชันพื้นฐานที่ใช้จัดการข้อมูลใน `okf_data/` ซึ่งถูกเรียกใช้งานโดยทั้ง MCP และ REST API:
- `listNodes()`: สแกนไฟล์ Markdown ทั้งหมดและประมวลผล Metadata + Links
- `getNodeContent()`: ดึงเนื้อหาดิบของไฟล์พร้อมตรวจสอบความปลอดภัยของ Path
- `searchNodes()`: ระบบค้นหาที่รองรับทั้ง Keyword และ Tags

## 2. MCP Layer (Stdio)
ใช้มาตรฐาน **Model Context Protocol** ของ Anthropic เพื่อให้ AI Agents เข้าถึงข้อมูลได้:
- **Tools:** `list_okf_nodes`, `get_okf_content`, `search_okf_nodes`
- **Transport:** ใช้ Stdio (Standard Input/Output) ในการสื่อสาร

## 3. REST API Layer (HTTP)
ใช้ **Express.js** ในการเปิด Endpoint สำหรับระบบภายนอกและ Dashboard:
- `GET /api/nodes`: รายการไฟล์ทั้งหมด
- `GET /api/graph`: ข้อมูลสำหรับวาด Knowledge Graph (Node-to-Node relationships)
- `GET /api/search`: ค้นหาข้อมูลผ่าน Web UI

## 4. Security & Validation
- **Path Sanitization:** ป้องกัน Directory Traversal
- **Link Validation:** ระบบตรวจจับ Broken Links อัตโนมัติระหว่างไฟล์ Markdown

## Relationships
- อ้างอิงแผนงานการพัฒนาได้ที่ [Mike Team Log](../log.md)
- ดูภาพรวมโปรเจกต์ที่เกี่ยวข้องได้ที่ [Project Overview](../projects/project.md)
