---
title: "Prompt Engineering cơ bản"
tags: [ai, prompt, beginner]
order: 1
status: learning
difficulty: beginner
created: 2026-05-22
updated: 2026-05-22
---

# Prompt Engineering cơ bản

Prompt Engineering là nghệ thuật và khoa học viết câu lệnh (prompt) để AI model trả lời chính xác và hữu ích nhất.

## 1. Prompt là gì?

**Prompt** là đầu vào (input) mà bạn gửi cho AI language model. Chất lượng output phụ thuộc trực tiếp vào chất lượng prompt.

> 💡 "Garbage in, garbage out" — Nếu prompt mơ hồ, kết quả sẽ mơ hồ.

### Các thành phần của một prompt tốt

| Thành phần | Mô tả | Ví dụ |
|---|---|---|
| **Role** | Vai trò AI đóng | "Bạn là senior developer..." |
| **Context** | Bối cảnh, thông tin nền | "Dự án dùng Next.js 14..." |
| **Task** | Nhiệm vụ cụ thể | "Viết function xử lý..." |
| **Format** | Định dạng output mong muốn | "Trả lời dạng JSON..." |
| **Constraints** | Ràng buộc, giới hạn | "Không dùng thư viện ngoài..." |

## 2. Các kỹ thuật cơ bản

### 2.1 Zero-shot Prompting

Gửi prompt trực tiếp mà không có ví dụ:

```python
prompt = "Phân loại sentiment của câu sau: 'Sản phẩm này rất tuyệt vời!'"
# Output: Positive
```

### 2.2 Few-shot Prompting

Cung cấp một vài ví dụ trước khi hỏi:

```python
prompt = """
Phân loại sentiment:
- "Tôi rất thích sản phẩm này" → Positive
- "Dịch vụ quá tệ" → Negative
- "Bình thường, không có gì đặc biệt" → Neutral

Phân loại: "Hàng giao nhanh, chất lượng ổn"
"""
# Output: Positive
```

### 2.3 Chain-of-Thought (CoT)

Yêu cầu AI suy nghĩ từng bước:

```text
Hãy giải bài toán sau, suy nghĩ từng bước:

Một cửa hàng bán 120 sản phẩm ngày thứ 2.
Ngày thứ 3 bán nhiều hơn 25%.
Ngày thứ 4 bán ít hơn ngày thứ 3 là 10 sản phẩm.

Hỏi: Tổng 3 ngày bán bao nhiêu sản phẩm?
```

## 3. System Prompt vs User Prompt

```javascript
const messages = [
  {
    role: "system",
    content: "Bạn là trợ lý lập trình. Trả lời bằng tiếng Việt, kèm code example."
  },
  {
    role: "user",
    content: "Giải thích async/await trong JavaScript"
  }
];
```

- **System Prompt**: Thiết lập hành vi, vai trò, constraints cho AI
- **User Prompt**: Câu hỏi/yêu cầu cụ thể từ người dùng

## 4. Best Practices

1. **Cụ thể hóa**: Thay vì "viết code", hãy nói "viết function TypeScript nhận array number, trả về số lớn nhất"
2. **Cho ví dụ**: Few-shot luôn tốt hơn zero-shot cho task phức tạp
3. **Chia nhỏ**: Task lớn → chia thành nhiều prompt nhỏ
4. **Iterate**: Prompt đầu tiên hiếm khi hoàn hảo, luôn tinh chỉnh
5. **Đặt constraints**: Giới hạn format, độ dài, ngôn ngữ output

## 5. Anti-patterns cần tránh

- ❌ Prompt quá ngắn và mơ hồ: "Viết code"
- ❌ Quá nhiều yêu cầu trong 1 prompt
- ❌ Không cho context: "Sửa bug này" (bug nào?)
- ❌ Mâu thuẫn giữa các constraints
- ❌ Kỳ vọng AI biết thông tin private/internal

## Tổng kết

Prompt Engineering không phải magic — nó là kỹ năng có thể học và cải thiện qua thực hành. Bắt đầu với template đơn giản, sau đó iterate dần.

> 📚 **Tài liệu tham khảo**: OpenAI Prompt Engineering Guide, Anthropic Prompt Design
