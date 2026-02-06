# AskualaLink HR & Recruitment System

**Automated Recruitment, GenAI Analytics, and Secure HR Management Backend**

AskualaLink is a centralized HR platform designed to streamline the hiring process using Generative AI while securely managing employee attendance and payroll.

The backend is built with **Node.js** and **Express.js**, emphasizing modularity, security, and automation.

---

## System Architecture

The backend follows a **Modular Monolith** architecture to maintain strong separation of concerns while keeping the codebase manageable and scalable.

### Architecture Overview

```mermaid
graph TD
    Client[React Frontend] -->|REST API| API_Gateway[Express Server]

    subgraph Middleware_Layer[Middleware Layer]
        Auth[JWT Authentication]
        IP_Check[WiFi / IP Geofencing]
        Logger[Activity Logging]
    end

    API_Gateway --> Middleware_Layer
    Middleware_Layer --> Modules

    subgraph Modules
        Recruitment[Recruitment & Applications]
        AI_Service[GenAI Analysis Engine]
        HR_Core[Employee & Payroll]
        Attendance[Secure Attendance]
    end

    Recruitment --> Database[(PostgresSQL)]
    HR_Core --> Database

    AI_Service -->|Analyze Resumes| OpenAI_API[External AI API]
    HR_Core -->|Send Payslips| SMTP_Server[Email Service]
