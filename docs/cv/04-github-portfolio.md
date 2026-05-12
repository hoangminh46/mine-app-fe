# 🐙 Xây Dựng GitHub Profile & Portfolio Chuyên Nghiệp

> GitHub và Portfolio là "bằng chứng" có giá trị nhất cho lập trình viên.
> Trong khi CV tóm tắt kinh nghiệm, GitHub CHỨNG MINH năng lực thực tế.

---

## 1. GitHub Profile - "CV Thứ Hai" Của Developer

### 1.1 Profile README (Bắt buộc)

Tạo repository có tên trùng với username GitHub → File `README.md` sẽ hiển thị trên profile.

#### Template đề xuất:

```markdown
# Hi there, I'm [Tên] 👋

## About Me
- 🔭 Currently working as a [Chức danh] at [Công ty]
- 🌱 Learning [Công nghệ đang học]
- 💬 Ask me about React, TypeScript, Node.js
- 📫 Reach me at: email@gmail.com
- 🌐 Portfolio: yoursite.com

## Tech Stack
![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![AWS](https://img.shields.io/badge/-AWS-232F3E?logo=amazonaws&logoColor=white)
![Docker](https://img.shields.io/badge/-Docker-2496ED?logo=docker&logoColor=white)

## GitHub Stats
![Your GitHub stats](https://github-readme-stats.vercel.app/api?username=yourusername&show_icons=true&theme=radical)
```

### 1.2 Pinned Repositories (6 repos quan trọng nhất)

> GitHub cho phép pin tối đa 6 repos. Đây là "vitrine" (tủ kính trưng bày) của bạn.

#### Tiêu chí chọn repos để pin:
1. **Relevance:** Phù hợp với vị trí đang apply
2. **Quality:** Code sạch, có tests, architecture rõ ràng
3. **Completeness:** Có README đầy đủ, có live demo
4. **Variety:** Thể hiện nhiều kỹ năng khác nhau

#### ❌ KHÔNG pin:
- Tutorial projects ("todo-app", "calculator")
- Repos trống hoặc chưa hoàn thành
- Fork mà không có contribution

### 1.3 Repository README Chuẩn

Mỗi pinned project NÊN có README theo template:

```markdown
# 🚀 Project Name

> One-line description of what this project does.

## ✨ Features
- Feature 1 with brief description
- Feature 2 with brief description
- Feature 3 with brief description

## 🛠️ Tech Stack
- **Frontend:** React 18, TypeScript, Tailwind CSS
- **Backend:** NestJS, PostgreSQL, Redis
- **DevOps:** Docker, GitHub Actions, AWS

## 📸 Demo
🔗 [Live Demo](https://yourproject.vercel.app)

![Screenshot](./docs/screenshot.png)

## 🏗️ Architecture
Brief description of the architecture decisions.

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- PostgreSQL >= 15

### Installation
\```bash
git clone https://github.com/yourname/project.git
cd project
npm install
npm run dev
\```

## 📝 License
MIT
```

---

## 2. Portfolio Website

### 2.1 Khi nào CẦN portfolio website?
- ✅ Apply vị trí Frontend/Fullstack
- ✅ Muốn thể hiện UI/UX skills
- ✅ Có nhiều dự án muốn showcase
- ⚪ Backend developer: GitHub profile thường đủ

### 2.2 Sections đề xuất:
1. **Hero:** Tên, chức danh, tagline ngắn gọn
2. **About:** Giới thiệu bản thân (2-3 đoạn)
3. **Projects:** Showcase 3-5 dự án tốt nhất
4. **Skills:** Tech stack visualization
5. **Experience:** Timeline kinh nghiệm
6. **Contact:** Form liên hệ hoặc email

### 2.3 Tech stack đề xuất cho portfolio:
- **Nhanh & đơn giản:** Next.js + Vercel (free hosting)
- **Static site:** Astro + Netlify
- **Minimalist:** HTML/CSS/JS thuần (thể hiện fundamentals)

### 2.4 Checklist portfolio:
- [ ] Load time < 3 giây
- [ ] Responsive trên mobile
- [ ] Có custom domain (yourname.dev)
- [ ] HTTPS enabled
- [ ] Tất cả link hoạt động
- [ ] Có resume download button
- [ ] Analytics (Google Analytics hoặc Plausible)

---

## 3. Kết Nối GitHub/Portfolio Với CV

### Trong CV Header:
```
NGUYEN VAN A
Frontend Engineer | 3 Years Experience
📧 email@gmail.com | 📱 +84 912 345 678
🐙 github.com/nguyenvana | 🌐 nguyenvana.dev | 💼 linkedin.com/in/nguyenvana
```

### Trong Work Experience:
```
• Built an AI-powered chat platform handling 1,000+ concurrent users 
  [github.com/yourname/ai-chat | Live: chat.yoursite.com]
```

### Đảm bảo tính NHẤT QUÁN:
| Yếu tố | CV | GitHub | LinkedIn |
|---------|-----|--------|----------|
| Tên | ✅ Khớp | ✅ Khớp | ✅ Khớp |
| Chức danh | ✅ Khớp | ✅ Khớp | ✅ Khớp |
| Tech stack | ✅ Khớp | ✅ Có evidence | ✅ Khớp |
| Timeline | ✅ Khớp | – | ✅ Khớp |

---

## 4. Pre-Application Checklist

- [ ] Đã archive/xóa các repos cũ, chưa hoàn thành, hoặc không chuyên nghiệp
- [ ] 6 pinned repos đều có README chất lượng
- [ ] Tất cả live demo links hoạt động
- [ ] Profile photo chuyên nghiệp (hoặc bỏ trống)
- [ ] Bio rõ ràng, professional
- [ ] Commit history gần đây active (không cần daily, nhưng không nên "chết" 6 tháng)
- [ ] Code style nhất quán trong các repos
- [ ] Không có credentials/secrets bị commit

---

## 💡 Pro Tips

1. **Contribution graph KHÔNG phải tất cả.** Chất lượng code quan trọng hơn "green squares".
2. **Viết commit messages rõ ràng.** Recruiter có thể đọc commit history.
3. **Tham gia Open Source.** Dù chỉ 1 PR nhỏ cũng thể hiện khả năng collaboration.
4. **Viết Technical Blog.** Dev.to, Medium, hoặc blog cá nhân → Thể hiện khả năng communicate.
5. **README là marketing.** Đầu tư thời gian viết README tốt = ROI cao nhất.
