Resume Builder – Kiến trúc, hạ tầng và hướng dẫn

1) Tổng quan hệ thống
- Monorepo gồm: frontend (React + Vite + Nginx) và backend (Node.js + Express).
- CSDL: MongoDB (lưu user, resume, template, guide, notification...).
- Cache/Session: Redis (rate limiting, session store, cache).
- Auth: JWT (access/refresh) + session + OAuth (Google/LinkedIn). Email qua SMTP.
- Tính năng chính backend: CRUD resume, versioning/compare, chia sẻ, export PDF/DOCX, notification, guest session.
- Healthcheck: /health và /api/v1/health.

2) Cấu trúc thư mục chính
- backend/
  - src/app.js: cấu hình Express, middleware, CORS, session Redis, route mount, health.
  - src/server.js: khởi động server, connect MongoDB/Redis, graceful shutdown.
  - src/config/: database.js, redis.js, passport.js (OAuth, session store).
  - src/routes/: authRoutes, resumeRoutes, templateRoutes, userRoutes, notificationRoutes, guestRoutes, guideRoutes.
  - src/controllers/: xử lý nghiệp vụ; export pdf/docx, emailService, encryption, jwt utils.
  - src/models/: User, Resume, Template, Guide, Notification (Mongoose models).
  - src/middleware/: auth, validation, errorHandler; utils/: asyncHandler, generators, etc.
  - seeds/: seed templates/guides. Dockerfile sản xuất, .env.example đầy đủ biến.
- frontend/
  - src/: React + Vite, router, context, services, config/api.js (VITE_API_URL).
  - nginx.conf: SPA rewrite /* -> /index.html, gzip, cache static.
  - Dockerfile multi-stage: build với Node, serve bằng Nginx.
- docker-compose.yml: mongodb, redis, backend, frontend; network + volumes.
- render.yaml: hạ tầng Render (backend web Node, frontend static, Redis managed).

3) Kiến trúc triển khai (Infrastructure)
- Local (Docker Compose):
  - mongodb: mongo:7 (27017), volume mongodb_data, healthcheck mongosh ping.
  - redis: redis:7-alpine (6379), volume redis_data, healthcheck redis-cli ping.
  - backend: build từ backend/Dockerfile, volume backend_uploads -> /app/uploads.
    - Env chính: PORT, API_VERSION, MONGODB_URI, REDIS_*, JWT_*, SESSION_SECRET, ENCRYPTION_SECRET, SMTP_*, FRONTEND_URL/CLIENT_URL, RATE_LIMIT_*, CACHE_TTL_*.
    - Healthcheck HTTP tới /api/v1/health.
  - frontend: build từ frontend/Dockerfile, publish 3000:80, healthcheck wget :80.
  - Network: bridge resume-builder-network; Volumes: mongodb_data, redis_data, backend_uploads.
- Render:
  - Web (backend): env node, build/start trong thư mục backend, PORT=10000, healthCheckPath=/health, Redis URL lấy từ service Redis.
  - Web (frontend static): build Vite, staticPublishPath=frontend/dist, route rewrite /* -> /index.html, VITE_API_URL trỏ backend Render.
  - Redis managed: policy allkeys-lru.

4) URL và cổng mặc định
- Dev thuần:
  - Backend: http://localhost:5000/api/v1
  - Frontend (Vite): http://localhost:5173
- Docker Compose:
  - Frontend: http://localhost:3000
  - Backend: Nên dùng http://localhost:5001/api/v1 (PORT=5001 trong compose).
- Render:
  - Frontend: render static URL
  - Backend: render API URL, ví dụ https://<api>.onrender.com/api/v1

5) Biến môi trường tối thiểu (đề xuất)
- Backend: MONGODB_URI, REDIS_HOST/PORT (hoặc REDIS_URL trên Render), JWT_SECRET, JWT_REFRESH_SECRET,
  SESSION_SECRET, ENCRYPTION_SECRET, FRONTEND_URL, CLIENT_URL, SMTP_HOST/PORT/EMAIL/PASSWORD (nếu dùng email).
- Frontend: VITE_API_URL (trỏ tới API /api/v1).

6) Quy trình chạy ngắn gọn
- Dev nhanh (không Docker):
  - backend/: cp .env.example -> .env, chỉnh biến; npm install; npm run dev
  - frontend/: set VITE_API_URL trong .env hoặc lệnh build; npm install; npm run dev
- Docker Compose:
  - docker-compose up -d --build
  - Frontend: http://localhost:3000
  - Backend: http://localhost:5001/api/v1

7) Cách hoạt động (thành phần chính) và vì sao cần
- Express API: routing tách module (auth/resume/guide/...), middleware chuẩn (helmet/cors/session/rate-limit). Lý do: dễ mở rộng, tách biệt concerns, giảm rủi ro bảo mật.
- Auth: JWT access/refresh + session (Passport) + OAuth. Lý do: JWT phù hợp SPA/mobile; session cho OAuth/web; refresh token giảm rủi ro lộ access token ngắn hạn.
- MongoDB (Mongoose): User/Resume/Template/Guide/Notification; index/TTL (nên thêm). Lý do: linh hoạt schema, versioning resume thuận tiện.
- Redis: session store, cache, rate-limit. Lý do: giảm tải DB, tăng tốc, giữ phiên phân tán.
- Mã hóa/crypto: ENCRYPTION_SECRET cho dữ liệu nhạy cảm; bcryptjs cho mật khẩu; JWT ký bằng secret. Lý do: bảo vệ PII, tuân thủ bảo mật.
- Export PDF/DOCX (pdfkit/docx) và Email (SMTP). Lý do: đáp ứng nghiệp vụ chia sẻ/tải xuống và khôi phục mật khẩu.

8) Yêu cầu tài nguyên & mở rộng (2025-10-24T20:49:06.420Z)
- Server đề xuất: Node 20, 1–2 vCPU, 1–2 GB RAM cho backend; Mongo/Redis tách máy/chia service; SSD cho Mongo; bật auto-restart/healthcheck.
- Nâng cấp cần có: CI/CD, OpenAPI/Swagger, test e2e, metrics (Prometheus/OpenTelemetry), log tập trung, job queue (BullMQ) cho tác vụ nặng (export/email), feature flags, i18n.
- Vì sao: ổn định và quan sát tốt hơn, triển khai an toàn, mở rộng tuyến tính khi người dùng tăng.

9) Bảo mật chi tiết và tại sao
- Sanitization NoSQL: chặn keys bắt đầu bằng $/. trong payload, dùng whitelist schema + express-validator. Vì sao: tránh NoSQL injection.
- CSP + headers: thiết lập CSP, HSTS, X-Frame-Options, X-Content-Type-Options. Vì sao: giảm XSS/clickjacking/MIME sniff.
- CORS chặt: origin theo FRONTEND_URL, không dùng *. Vì sao: ngăn CSRF kết hợp CORS sai.
- Token hygiene: rotate/expire JWT & refresh; revoke khi logout; lưu refresh an toàn (httpOnly, Secure, SameSite). Vì sao: giảm tác động khi rò rỉ token.
- Secrets: dùng secrets manager, không commit .env; rotate định kỳ. Vì sao: giảm rủi ro rò rỉ.
- Upload an toàn: limit size (MAX_FILE_SIZE), kiểm MIME/định dạng, quét virus, lưu ngoài webroot, signed URL nếu public. Vì sao: ngăn RCE/malware.
- Rate limiting + brute-force protection theo IP/user/route. Vì sao: chống tấn công đoán mật khẩu/DDoS.
- Dependency hygiene: npm audit, renovate, lockfile. Vì sao: vá CVE sớm.
- DB an toàn: quyền tối thiểu, index phù hợp, backup/restore, TTL cho tokens/notifications tạm. Vì sao: hiệu năng và an toàn dữ liệu.

10) Đồng bộ cấu hình & known issues
- docker-compose lệch PORT/healthcheck (5000 vs 5001). Hành động: thống nhất PORT trong Dockerfile/compose/health.
- FRONTEND_URL/CLIENT_URL: Dev (5173) vs Docker (3000) vs Prod (domain). Hành động: đặt env theo môi trường để CORS/OAuth đúng.

11) API khởi điểm
- Health: /health và /api/v1/health
- Nhóm: /api/v1/auth, /resumes, /templates, /users, /notifications, /guest, /guides

12) Seed/tiện ích
- npm run seed:all trong backend để nạp templates/guides (có thể exec trong container backend).

Tham khảo nhanh Docker
- Start: docker-compose up -d --build
- Logs: docker-compose logs -f
- Stop: docker-compose down
- Rebuild service: docker-compose up -d --build backend|frontend

13) Kiểu kiến trúc phần mềm và giải thích (2025-10-24T21:36:31.199Z)
- Client–Server SPA + Backend for Frontend (BFF) trong mô hình Microservices nhẹ (polyglot persistence: MongoDB + Redis):
  + SPA (React/Vite) là client, gọi BFF (Express API) qua REST; Nginx chỉ serve static và route SPA.
  + BFF tập trung hoá logic giao tiếp client: auth (JWT/Session/OAuth), rate-limit, cache, định dạng dữ liệu cho UI.
  + Dữ liệu tách lớp: MongoDB làm nguồn sự thật (SoT), Redis làm cache/session và rate-limit.
- Vì sao mô hình này phù hợp:
  + Tách biệt concerns: UI độc lập vòng đời triển khai với API; dễ CI/CD và scale riêng.
  + Hiệu năng: Redis giảm độ trễ, rate-limit bảo vệ backend; SPA giảm tải server-side rendering.
  + Linh hoạt mở rộng: có thể tách tiếp các bounded context (auth/notification/resume) thành services riêng khi tải tăng; BFF giữ hợp đồng ổn định cho frontend.
  + Bảo trì/dễ phát triển: monorepo giúp đồng bộ version giữa FE/BE, tái sử dụng cấu hình Docker/Render, nhất quán env.

