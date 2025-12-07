# TriageCare AI — Intelligent Patient Intake & Automation

<div align="center">

![TriageCare AI](https://img.shields.io/badge/TriageCare-AI-0ea5e9?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMjIgMTJoLTRsLTMgOUw5IDNsLTMgOUgyIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=)
![Version](https://img.shields.io/badge/version-1.0.0-10b981?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)

**An AI-powered healthcare assistant that streamlines patient intake, symptom assessment, appointment management, and clinical workflows.**

[Live Demo](#demo) • [Features](#-key-features) • [Installation](#-installation--setup) • [Documentation](#-pages--modules)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Pages & Modules](#-pages--modules)
- [Technology Stack](#-technology-stack)
- [Installation & Setup](#-installation--setup)
- [Project Structure](#-project-structure)
- [API Integration](#-api-integration)
- [Future Roadmap](#-future-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🏥 Overview

**TriageCare AI** is a comprehensive healthcare platform designed to modernize patient intake and clinical operations. It combines conversational AI for symptom assessment, intelligent specialist matching, seamless appointment booking, and real-time staff dashboards — all in one unified system.

### Why TriageCare AI?

- 🕐 **Reduce Wait Times**: AI-powered triage prioritizes patients based on symptom severity
- 🎯 **Accurate Routing**: Intelligent specialist matching ensures patients see the right doctor
- 📱 **Patient-Centric**: Easy-to-use interface for booking, tracking, and managing healthcare
- 👨‍⚕️ **Staff Efficiency**: Real-time dashboards streamline clinical workflows

---

## 🚀 Key Features

### 1. Conversational Symptom Intake

- **Natural Language Processing**: Patients describe symptoms in plain language
- **Multi-Symptom Detection**: Extracts and tracks multiple symptoms from conversations
- **Severity Classification**: Automatically categorizes conditions as LOW, MEDIUM, or SEVERE
- **Medical Knowledge Base**: Built-in symptom classifier with treatment recommendations
- **Follow-up Questions**: Intelligent follow-up prompts for accurate assessment
- **Emergency Detection**: Immediate alerts for critical symptoms (chest pain, stroke signs, etc.)

### 2. Automated Appointment Management

- **Smart Doctor Search**: Filter by specialty, location, and availability
- **Real-Time Availability**: View doctor schedules with available time slots
- **Interactive Calendar**: Visual date picker with calendar integration
- **One-Click Booking**: Seamless appointment confirmation
- **Appointment Tracking**: View upcoming, past, and cancelled appointments
- **Rescheduling & Cancellation**: Easy modification of existing appointments

### 3. Patient Engagement Layer

- **Preparation Instructions**: Pre-appointment guidance and reminders
- **Health Guidance**: AI-generated advice based on symptoms
- **Medication Recommendations**: Suggested OTC medications with dosage info
- **Follow-up Reminders**: Automated notifications for upcoming care
- **Appointment Notifications**: Email/SMS confirmation and reminders

### 4. Real-Time Staff Dashboard

- **Live Triage Queue**: Monitor incoming patient cases in real-time
- **Priority-Based Sorting**: Urgent cases automatically highlighted
- **Patient Flow Analytics**: Track daily statistics and trends
- **Appointment Overview**: Staff view of scheduled appointments
- **Follow-up Management**: Track pending patient follow-ups
- **Performance Metrics**: Response times, wait times, and completion rates

### 5. Specialists Directory

- **Comprehensive Listings**: Browse all available medical specialties
- **Specialty Descriptions**: Understand what each specialist treats
- **Condition Mapping**: See which symptoms map to which specialists
- **Quick Navigation**: Direct links to book appointments

### 6. Authentication System

- **User Registration**: Secure account creation with validation
- **Login/Logout**: Session management with localStorage
- **User Profiles**: Personalized experience with user data
- **Protected Routes**: Certain features require authentication
- **Role-Based Access**: Patient vs Staff portal access

---

## 📄 Pages & Modules

| Page                | File                   | Description                                                      |
| ------------------- | ---------------------- | ---------------------------------------------------------------- |
| **Home**            | `index.html`           | Landing page with hero, features, how-it-works, and AI chat demo |
| **Specialists**     | `specialists.html`     | Directory of medical specialties with symptom mappings           |
| **Find Doctor**     | `find-doctor.html`     | Search, filter, and book appointments with doctors               |
| **My Appointments** | `my-appointments.html` | Patient portal for managing appointments                         |
| **Staff Dashboard** | `dashboard.html`       | Real-time clinical dashboard for medical staff                   |

### JavaScript Modules

| Module                | File                   | Purpose                                          |
| --------------------- | ---------------------- | ------------------------------------------------ |
| **Chat Interface**    | `script.js`            | AI-powered symptom intake chat system            |
| **Medical Knowledge** | `medical-knowledge.js` | Symptom classification and treatment database    |
| **Authentication**    | `auth.js`              | User login, registration, and session management |
| **Doctor Search**     | `find-doctor.js`       | Doctor filtering, availability, and booking      |
| **Appointments**      | `my-appointments.js`   | Patient appointment management                   |
| **Dashboard**         | `dashboard.js`         | Staff dashboard functionality                    |

---

## 🛠 Technology Stack

### Frontend

| Technology               | Purpose                                          |
| ------------------------ | ------------------------------------------------ |
| **HTML5**                | Semantic markup and structure                    |
| **CSS3**                 | Modern styling with CSS variables, flexbox, grid |
| **JavaScript (ES6+)**    | Interactive functionality and state management   |
| **Google Fonts (Inter)** | Typography                                       |

### AI/NLP Integration

| Technology                    | Purpose                                                |
| ----------------------------- | ------------------------------------------------------ |
| **Google Gemini API**         | Natural language understanding and response generation |
| **Custom Symptom Classifier** | Rule-based medical entity extraction                   |

### Design System

| Feature               | Implementation                                               |
| --------------------- | ------------------------------------------------------------ |
| **Color Scheme**      | Medical-themed with sky blue (#0ea5e9) and emerald (#10b981) |
| **Dark Mode**         | Default dark theme with light mode support                   |
| **Responsive Design** | Mobile-first approach with breakpoints                       |
| **Animations**        | Subtle transitions and micro-interactions                    |

### Storage (Current)

| Technology       | Purpose                                      |
| ---------------- | -------------------------------------------- |
| **localStorage** | User sessions, appointments, and preferences |

---

## 📦 Installation & Setup

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local web server (optional, for API features)
- Google Gemini API key (optional, for AI chat)

### Quick Start

1. **Clone the repository**

   ```bash
   git clone https://github.com/ishicodespace/TriageCare.git
   cd TriageCare
   ```

2. **Open with Live Server**

   - Using VS Code: Install "Live Server" extension and click "Go Live"
   - Using Python: `python -m http.server 5500`
   - Using Node.js: `npx serve .`

3. **Configure API Key (Optional)**

   To enable full AI functionality, add your Gemini API key in `script.js`:

   ```javascript
   const CONFIG = {
     GEMINI_API_KEY: "your-api-key-here",
     GEMINI_API_URL:
       "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
   };
   ```

4. **Access the Application**
   - Open `http://localhost:5500` in your browser
   - Navigate through the different pages to explore features

---

## 📁 Project Structure

```
TriageCare/
├── index.html              # Main landing page with AI chat demo
├── specialists.html        # Medical specialists directory
├── find-doctor.html        # Doctor search and booking
├── my-appointments.html    # Patient appointments portal
├── dashboard.html          # Staff dashboard
├── test-api.html           # API testing utility
│
├── script.js               # AI chat interface and triage logic
├── medical-knowledge.js    # Symptom classifier and medical database
├── auth.js                 # Authentication system
├── find-doctor.js          # Doctor search and booking logic
├── my-appointments.js      # Appointment management
├── dashboard.js            # Staff dashboard functionality
│
├── style.css               # Main stylesheet (dark theme)
├── light-theme.css         # Light mode styles
│
├── README.md               # This file
├── SETUP_INSTRUCTIONS.md   # Detailed setup guide
└── .gitignore              # Git ignore rules
```

---

## 🔌 API Integration

### Gemini AI API

The application integrates with Google's Gemini API for advanced natural language understanding:

```javascript
// Example API call structure
const response = await fetch(
  `${CONFIG.GEMINI_API_URL}?key=${CONFIG.GEMINI_API_KEY}`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  }
);
```

### Fallback System

When the API is unavailable, the system uses a built-in medical knowledge base (`medical-knowledge.js`) with:

- 50+ symptom patterns
- Severity classifications
- Treatment recommendations
- Emergency detection rules

---

## 🔮 Future Roadmap

### Phase 2: Backend Integration

- [ ] Python FastAPI backend
- [ ] PostgreSQL database
- [ ] JWT authentication
- [ ] RESTful API endpoints

### Phase 3: Enhanced Features

- [ ] Voice-to-text symptom input
- [ ] Video consultation integration
- [ ] Electronic Health Records (EHR) integration
- [ ] Multi-language support

### Phase 4: Advanced AI

- [ ] Medical image analysis
- [ ] Predictive health analytics
- [ ] Personalized health recommendations
- [ ] Integration with wearable devices

### Phase 5: Enterprise

- [ ] Multi-tenant architecture
- [ ] HIPAA compliance certification
- [ ] Insurance integration
- [ ] Pharmacy network integration

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Guidelines

- Follow existing code style
- Add comments for complex logic
- Update documentation as needed
- Test across different browsers

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Ishi** - [GitHub](https://github.com/ishicodespace)
**KumudKode** - [Github](https://github.com/kumudkode)

---

<div align="center">

**Built with ❤️ for better healthcare**

[⬆ Back to Top](#triagecare-ai--intelligent-patient-intake--automation)

</div>
