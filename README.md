# SpendSmart 💸
> AI-powered expense tracker built with Java Spring Boot, React, and Groq LLM

Full-stack personal finance app with JWT authentication, budget tracking, and an AI assistant that analyzes your spending patterns using the Groq API (llama-3.3-70b-versatile).

---

## Tech Stack

**Backend**
- Java 17 + Spring Boot 4
- Spring Security + JWT Authentication
- Spring Data JPA + Hibernate
- MySQL

**Frontend**
- React + Vite
- Chart.js (data visualization)
- Axios

**AI**
- Groq API — llama-3.3-70b-versatile model

---

## Features

- 🔐 JWT-based user authentication (register/login)
- 💰 Add, view, and delete expenses by category
- 📊 Dashboard with spending charts and summaries
- 🎯 Budget management — set limits and track progress
- 🤖 AI financial assistant — ask questions about your spending

---

## Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL 8+
- Groq API key → [console.groq.com](https://console.groq.com)

### Backend Setup

1. Clone the repo
```bash
git clone https://github.com/aryanp7974-crypto/AI-smart-Expense-tracker.git
cd AI-smart-Expense-tracker
```

2. Create MySQL database
```sql
CREATE DATABASE expense_tracker;
```

3. Create `src/main/resources/application.properties`
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/expense_tracker
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

groq.api.key=YOUR_GROQ_API_KEY
jwt.secret=YOUR_JWT_SECRET_KEY
jwt.expiration=86400000
```

4. Run the backend
```bash
./mvnw spring-boot:run
```
Backend runs on `http://localhost:8080`

### Frontend Setup

```bash
cd expense-frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/expenses` | Get all expenses |
| POST | `/api/expenses` | Add expense |
| DELETE | `/api/expenses/{id}` | Delete expense |
| GET | `/api/budget` | Get budget |
| POST | `/api/budget` | Set budget |
| POST | `/api/ai/query` | Ask AI about spending |

---

## Project Structure

```
├── src/main/java/com/expensetracker/
│   ├── controller/       # REST controllers
│   ├── service/          # Business logic
│   ├── repository/       # JPA repositories
│   ├── model/            # Entity classes
│   ├── security/         # JWT + Spring Security config
│   └── dto/              # Request/Response DTOs
├── expense-frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Dashboard, Expenses, Budget
│   │   └── services/     # Axios API calls
```

---

## Environment Variables

Never commit `application.properties`. It's gitignored. Create it locally with your own credentials.

---

Built by [Aryan Pandey](https://github.com/aryanp7974-crypto) — B.Tech CSE @ Mahakal Institute of Technology
