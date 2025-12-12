# AskualaLink HR & Recruitment System

**Automated Recruitment, GenAI Analytics, and Secure HR Management Backend.**

This repository contains the backend source code for **AskualaLink**, a centralized HR platform designed to streamline the hiring process using Generative AI and manage existing employee attendance and payroll securely.

The system is built with **Node.js** and **Express.js**, focusing on modularity, security, and automation.

---

## 🏗 System Architecture

The backend follows a **Modular Monolith** architecture to ensure separation of concerns while keeping the codebase manageable for the team.

```mermaid
graph TD
    Client[React Frontend] -->|REST API| API_Gateway[Express Server]
    
    subgraph Middleware Layer
    Auth[JWT Auth]
    IP_Check[WiFi/IP Geofencing]
    Logger[Activity Logging]
    end
    
    API_Gateway --> Middleware Layer
    Middleware Layer --> Modules
    
    subgraph Modules
    Recruitment[Recruitment & Applications]
    AI_Service[GenAI Analysis Engine]
    HR_Core[Employee & Payroll]
    Attendance[Secure Attendance]
    end
    
    Recruitment --> Database[(MongoDB/SQL)]
    HR_Core --> Database
    
    AI_Service -->|Analyze Resumes| OpenAI_API[External AI API]
    HR_Core -->|Send Payslips| SMTP_Server[Email Service]
