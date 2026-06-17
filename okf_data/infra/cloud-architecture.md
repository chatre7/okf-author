---
title: Infrastructure Architecture 2024
description: รายละเอียดโครงสร้างระบบ Cloud ขององค์กร
tags: [infra, cloud, aws, architecture]
---

# Infrastructure Architecture

## Cloud Provider
เราใช้ **AWS (Amazon Web Services)** เป็นหลักในการวางระบบ

## Components
- **Compute:** EC2 (T3.large สำหรับ API Server)
- **Database:** RDS (PostgreSQL 15)
- **Storage:** S3 (สำหรับเก็บ Log และเอกสารสำรอง)
- **Container:** EKS (Kubernetes) สำหรับ Microservices

## Security
- VPC Isolation
- IAM Roles with Least Privilege
- Encryption at rest (AES-256)
