# JobTrack — Frontend

React (Vite) + Tailwind CSS frontend for the **Job-Tracker-Backend** Spring Boot API.

**Stack:** React 18, Vite 5, Tailwind CSS 3, Axios, React Router 6, Context API, Lucide React.

## 1. Install & run

Prerequisites: Node.js 18+ and the Spring Boot backend running on `http://localhost:8080`.

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**.

Production build: `npm run build` (output in `dist/`), preview with `npm run preview`.

## 2. Connect to your Spring Boot backend

1. Start MySQL and create the database: `CREATE DATABASE job_tracker;`
2. Make sure your `application.properties` has the datasource settings plus `jwt.secret` and `jwt.expiration`
   (the secret must be at least 32 characters for HS256).
3. Run the backend: `mvn spring-boot:run` (port 8080).
4. Run the frontend as above.

### How requests reach the backend (CORS)

Your backend has **no CORS configuration**, so a browser on `localhost:5173` calling `localhost:8080` directly
would be blocked. To avoid touching your backend, the Vite dev server **proxies `/api/*` to
`http://localhost:8080`** (see `vite.config.js`). The browser only talks to port 5173, so no CORS is involved.

To point at a different backend host: copy `.env.example` to `.env` and change `VITE_PROXY_TARGET`.

### Deploying the frontend separately (optional)

A static build has no proxy, so the backend would need CORS. Add this file to the backend **only when you deploy**
(it is not required for local development):

```java
package com.chetan.jobtracker.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class CorsConfig {
    @Bean
    public UrlBasedCorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration c = new CorsConfiguration();
        c.setAllowedOrigins(java.util.List.of("https://your-frontend-domain.com"));
        c.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        c.setAllowedHeaders(java.util.List.of("*"));
        UrlBasedCorsConfigurationSource s = new UrlBasedCorsConfigurationSource();
        s.registerCorsConfiguration("/**", c);
        return s;
    }
}
```

and add `.cors(Customizer.withDefaults())` to the `HttpSecurity` chain in `SecurityConfig`.
Then build the frontend with `VITE_API_BASE_URL=https://your-api-domain.com`.

## 3. Project structure

```
frontend/
├── public/                  favicon
├── src/
│   ├── components/          Button, Field, StatusBadge, StatCard, ConfirmDialog, Pagination,
│   │                        ApplicationForm, AppLayout (sidebar), ProtectedRoute, ...
│   ├── pages/               Login, Register, Dashboard, Applications, AddApplication,
│   │                        EditApplication, ApplicationDetails, NotFound
│   ├── services/            api.js (Axios + interceptors), authService, applicationService
│   ├── context/             AuthContext (JWT session), ToastContext (notifications)
│   ├── hooks/               useDebounce, useDocumentTitle
│   └── utils/               constants (statuses), token, errors, format
├── tailwind.config.js
├── vite.config.js           dev proxy to the backend
└── package.json
```

## 4. How it maps to the backend

| Frontend | Endpoint | Notes |
|---|---|---|
| Login | `POST /api/auth/login` | Response `{ token, name, email }` |
| Register | `POST /api/auth/register` | Response is ignored; user is sent to Login |
| Dashboard | `GET /api/applications/stats` | `totalApplications, applied, interviewScheduled, interviewDone, offerReceived, rejected, withdrawn, successRate` |
| My Applications | `GET /api/applications[?status= \| ?company=]` | Plain array; search and pagination are handled in the UI |
| Add | `POST /api/applications` | `companyName, jobRole, status` required |
| Details / Edit | `GET`/`PUT /api/applications/{id}` | PUT replaces all fields, so the form always sends the full object |
| Delete | `DELETE /api/applications/{id}` | Returns plain text, not JSON |

## 5. Authentication notes

- The JWT is kept in `localStorage` and sent as `Authorization: Bearer <token>` by an Axios request interceptor.
- Before every request the token's `exp` claim is checked; if expired the user is logged out and sent to `/login`.
- A `401` or `403` from any non-auth endpoint also ends the session (your backend returns 403 for missing/invalid tokens).
- `localStorage` is readable by any script on the page, so keep dependencies trusted. Moving to an httpOnly cookie
  would require backend changes.
