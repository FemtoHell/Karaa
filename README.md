# Hướng dẫn chạy Docker - Từng bước chi tiết

## ✅ File .env đã được tạo sẵn!

File `.env` đã được tạo với thông tin từ backend hiện tại của bạn. MongoDB và Redis đã được cấu hình để sử dụng containers local.

---

## 🚀 Các lệnh cần chạy trong Terminal

### Bước 1: Build và khởi động tất cả services

```bash
docker-compose up -d --build
```

**Giải thích:**
- `docker-compose up`: Khởi động các services
- `-d`: Chạy ở background (detached mode)
- `--build`: Build images trước khi start

**Kết quả mong đợi:**
```
✅ Creating network "resume-builder_resume-builder-network"
✅ Creating volume "resume-builder_mongodb_data"
✅ Creating volume "resume-builder_redis_data"
✅ Creating volume "resume-builder_backend_uploads"
✅ Creating resume-builder-mongodb
✅ Creating resume-builder-redis
✅ Creating resume-builder-backend
✅ Creating resume-builder-frontend
```

---

### Bước 2: Kiểm tra trạng thái containers

```bash
docker-compose ps
```

**Kết quả mong đợi:** Tất cả containers đều có status là "Up" hoặc "Up (healthy)"

---

### Bước 3: Xem logs để đảm bảo mọi thứ chạy đúng

```bash
docker-compose logs -f
```

**Giải thích:**
- `logs`: Xem logs của các containers
- `-f`: Follow mode (theo dõi real-time)

**Nhấn Ctrl+C để thoát khỏi logs**

---

### Bước 4: Xem logs của từng service riêng lẻ

**Backend logs:**
```bash
docker-compose logs -f backend
```

**Frontend logs:**
```bash
docker-compose logs -f frontend
```

**MongoDB logs:**
```bash
docker-compose logs -f mongodb
```

**Redis logs:**
```bash
docker-compose logs -f redis
```

---

### Bước 5: Kiểm tra health status

```bash
docker-compose ps -a
```

Hoặc xem chi tiết container:
```bash
docker ps
```

---

### Bước 6: Truy cập ứng dụng

Mở browser và truy cập:

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api/v1
- **Health check:** http://localhost:5000/api/v1/health

---

## 🔄 Các lệnh quản lý thường dùng

### Dừng tất cả containers (giữ data)
```bash
docker-compose stop
```

### Khởi động lại sau khi dừng
```bash
docker-compose start
```

### Khởi động lại một service cụ thể
```bash
docker-compose restart backend
docker-compose restart frontend
```

### Dừng và xóa containers (GIỮ data trong volumes)
```bash
docker-compose down
```

### Dừng và XÓA TẤT CẢ (bao gồm cả data)
```bash
docker-compose down -v
```

⚠️ **Cảnh báo:** Lệnh này sẽ xóa hết data trong MongoDB!

---

## 🔧 Troubleshooting

### Xem logs chi tiết của backend
```bash
docker-compose logs --tail=100 backend
```

### Vào bên trong backend container
```bash
docker-compose exec backend sh
```

Sau khi vào container, bạn có thể:
```bash
ls -la                    # Xem files
npm run seed:all          # Chạy seed data
node src/server.js        # Chạy server thủ công
exit                      # Thoát container
```

### Vào MongoDB shell
```bash
docker-compose exec mongodb mongosh resume_builder
```

Trong MongoDB shell:
```javascript
show dbs                  // Xem các databases
use resume_builder        // Chọn database
show collections          // Xem các collections
db.users.find()           // Query users
exit                      // Thoát
```

### Vào Redis CLI
```bash
docker-compose exec redis redis-cli
```

Trong Redis CLI:
```bash
PING                      # Test connection (trả về PONG)
KEYS *                    # Xem tất cả keys
GET key_name              # Lấy giá trị của một key
exit                      # Thoát
```

---

## 🔥 Rebuild sau khi sửa code

### Rebuild tất cả
```bash
docker-compose up -d --build
```

### Rebuild chỉ backend
```bash
docker-compose up -d --build backend
```

### Rebuild chỉ frontend
```bash
docker-compose up -d --build frontend
```

### Rebuild từ đầu hoàn toàn (xóa cache)
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

---

## 📊 Monitoring

### Xem resource usage
```bash
docker stats
```

### Xem disk space
```bash
docker system df
```

### Xem tất cả volumes
```bash
docker volume ls
```

---

## 🧹 Cleanup

### Xóa tất cả containers đã dừng
```bash
docker container prune
```

### Xóa tất cả images không dùng
```bash
docker image prune -a
```

### Xóa tất cả volumes không dùng
```bash
docker volume prune
```

### Cleanup toàn bộ Docker
```bash
docker system prune -a --volumes
```

⚠️ **Cảnh báo:** Lệnh này sẽ xóa tất cả!

---

## ✅ Checklist để verify setup thành công

1. [ ] Tất cả 4 containers đang chạy: `docker-compose ps`
2. [ ] Backend logs không có errors: `docker-compose logs backend`
3. [ ] Frontend accessible: http://localhost:3000
4. [ ] Backend API responding: http://localhost:5000/api/v1/health
5. [ ] MongoDB connected: Check backend logs for "MongoDB Connected"
6. [ ] Redis connected: Check backend logs for "Redis connected"

---

## 🎯 Quick Commands Summary

```bash
# Start
docker-compose up -d

# View logs
docker-compose logs -f

# Check status
docker-compose ps

# Stop
docker-compose down

# Rebuild
docker-compose up -d --build
```

---

Nếu gặp vấn đề, hãy check logs: `docker-compose logs -f`
