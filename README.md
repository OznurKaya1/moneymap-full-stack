# 💰 MoneyMap
![Java](https://img.shields.io/badge/Java-21-orange?style=flat-square)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.0.3-green?style=flat-square)
![React](https://img.shields.io/badge/React-Vite-blue?style=flat-square)
![MySQL](https://img.shields.io/badge/MySQL-8-lightblue?style=flat-square)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=flat-square&logo=chartdotjs&logoColor=white)

MoneyMap is a full-stack web application that helps users take control of their personal finances by recording, categorizing, and visualizing their income and expenses. Users can sign up, log in securely, and manage their financial data through an intuitive interface that displays records in both tables and charts — making it easy to see where money is coming from and where it's going. Built with React and Vite on the frontend, Java and Spring Boot on the backend, and MySQL for persistent data storage, MoneyMap reflects a realistic, production-style technology stack used widely across the industry.

---

## 🛠️ Technologies Used

**Frontend**
- React (Vite)
- JavaScript
- CSS
- Chart.js

**Backend**
- Java 21
- Spring Boot 4.0.3
- Spring Security
- Spring Data JPA / Hibernate
- Maven

**Database**
- MySQL 8

---

## ⚙️ Installation & Setup

> These instructions are for running the app locally after forking and cloning the repository.

### Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Java 21](https://adoptium.net/)
- [IntelliJ IDEA](https://www.jetbrains.com/idea/)
- [MySQL 8](https://dev.mysql.com/downloads/) with MySQL Workbench

---

### 1. Clone the Repository
```bash
git clone https://github.com/OznurKaya1/moneymap-full-stack
```

---

### 2. Set Up MySQL
Install MySQL if not already installed, then create the database:
```sql
CREATE DATABASE `moneymap-backend`;
```

---

### 3. Create `application.properties`
In `moneymap-backend-app/src/main/resources/` create a file named `application.properties` and add:
```properties
spring.application.name=moneymap-backend
spring.datasource.url=jdbc:mysql://localhost:3306/moneymap-backend?useSSL=false
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

---

### 4. Run the Backend
- Open `moneymap-backend-app/` in IntelliJ IDEA
- Let Maven download dependencies automatically
- Run `MoneymapBackendApplication.java`
- Spring will auto-create all database tables on first startup
- Confirm Spring is running at `http://localhost:8080`

---

### 5. Run the Frontend
```bash
cd moneymap-front-end/MoneyMap
npm install
npm run dev
```
Open your browser to `http://localhost:5173`.

---

### 6. Verify Everything is Working
- Navigate to **Sign Up** and create an account
- Log in and confirm you are redirected to the dashboard
- Add an income or expense entry and confirm it appears in the table
- Test editing and deleting entries
- Navigate to the **Expense Summary** page and confirm your expenses appear in the doughnut and bar charts
- On the **Income Tracker** and **Expense Tracker** pages, use the month filter dropdown to confirm entries filter correctly by month
- On the **Expense Summary** page, use the month filter to confirm the charts update for the selected month

> ⚠️ Both the backend and frontend must be running at the same time for the app to work.

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/signup` | Register a new user |
| `POST` | `/login` | Log in an existing user |

### Forgot Password
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/forgot-password/verify-email` | Verify email for password reset |
| `POST` | `/forgot-password/reset` | Reset user password |

### Expenses
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/{userId}` | Get all expenses for a user |
| `GET` | `/{userId}/category/{category}` | Get expenses filtered by category |
| `GET` | `/{userId}/dates` | Get expenses filtered by date |
| `POST` | `/{userId}` | Add a new expense |
| `PUT` | `/{expenseId}` | Update an existing expense |
| `DELETE` | `/{expenseId}` | Delete an expense |

### Income
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/{userId}` | Get all income entries for a user |
| `POST` | `/{userId}` | Add a new income entry |
| `PUT` | `/{userId}/{incomeId}` | Update an existing income entry |
| `DELETE` | `/{userId}/{incomeId}` | Delete an income entry |

---

## 🗂️ Entity Relationship Diagram

> https://lucid.app/lucidchart/105e5210-9397-431f-b858-251b8e075022/edit?viewport_loc=279%2C-168%2C1447%2C1102%2C0_0&invitationId=inv_e8057dc6-9eef-47fb-a20d-9b4d6b03572b

The database has three tables:

- **user_info** — stores registered user accounts (id, firstName, lastName, email, password)
- **Income** — stores income entries with a foreign key to `user_info` (id, user_id, date, amount, description, category)
- **Expenses** — stores expense entries with a foreign key to `user_info` (id, user_id, date, amount, description, category)

---

## 🖼️ Wireframes

> https://www.figma.com/design/beQMDYI0a4f4kenEeiiRME/MoneyMap-Project-Unit-2?node-id=94-2&p=f&m=draw

---

## 🚀 Future Features

**AI-Powered Financial Assistant**

If I were to rebuild MoneyMap, the most impactful change I would make is to the visual and interaction design of the application. While the current version successfully allows users to track income and expenses and view that data through tables and charts, users still have to interpret the data on their own — which limits how actionable the app feels in practice.

A future version would add an AI-powered chat feature. Instead of only displaying data visually, users could ask natural language questions such as:
- *"Can you analyze my spending?"*
- *"What categories am I spending the most on?"*
- *"How can I reduce my expenses?"*

This would allow MoneyMap to provide personalized, conversational insights and guide users in understanding their financial habits — transforming the app from a simple tracking tool into an intelligent financial assistant.

---

## 📁 Project Structure

```
moneymap-full-stack/
├── moneymap-backend-app/                          ← Spring Boot backend
│   ├── pom.xml
│   ├── mvnw
│   ├── mvnw.cmd
│   └── src/
│       └── main/
│           ├── java/com/launchcode/moneymapbackend/
│           │   ├── config/                        ← Security and app configuration
│           │   ├── controller/                    ← AuthController, ExpenseController,
│           │   │                                     ForgotPasswordController, IncomeController
│           │   ├── dto/                           ← ResetPasswordRequest
│           │   ├── models/                        ← Expenses, Income, UserInfo
│           │   ├── repository/                    ← ExpenseRepository, IncomeRepository,
│           │   │                                     UserInfoRepository
│           │   ├── service/                       ← ExpenseService, IncomeService, UserService
│           │   └── MoneymapBackendApplication.java
│           └── resources/                         ← application.properties
└── moneymap-front-end/MoneyMap/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── css/                               ← Component stylesheets
    │   │   ├── Images/                            ← Image assets
    │   │   ├── layout/                            ← Shared layout components
    │   │   ├── Pages/                             ← Page-level components
    │   │   ├── Tracking/                          ← Expenses.jsx, ExpenseSummary.jsx,
    │   │   │                                         Income.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── DashboardCard.jsx
    │   │   ├── ForgotMyPassword.jsx
    │   │   ├── HomePage.jsx
    │   │   ├── Login.jsx
    │   │   └── SignUp.jsx
    │   ├── services/                              ← authService.js
    │   ├── App.css
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── eslint.config.js
```
