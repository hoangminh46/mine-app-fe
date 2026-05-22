---
title: "Large Language Models — Kiến thức nền tảng"
tags: [ai, llm, theory, transformer]
order: 2
status: reviewed
difficulty: intermediate
created: 2026-05-20
updated: 2026-05-22
---

# Large Language Models — Kiến thức nền tảng

LLM (Large Language Model) là mô hình AI được huấn luyện trên lượng lớn dữ liệu text, có khả năng hiểu và sinh ngôn ngữ tự nhiên.

## 1. Kiến trúc Transformer

Transformer là kiến trúc nền tảng của hầu hết LLM hiện đại, được giới thiệu trong paper "Attention is All You Need" (2017).

### Các thành phần chính

- **Self-Attention**: Cho phép model "nhìn" toàn bộ context cùng lúc
- **Multi-Head Attention**: Nhiều "đầu" attention học các pattern khác nhau
- **Feed-Forward Network**: Xử lý thông tin sau attention
- **Positional Encoding**: Giúp model hiểu thứ tự từ

```python
# Simplified self-attention
import torch
import torch.nn.functional as F

def self_attention(Q, K, V):
    d_k = Q.size(-1)
    scores = torch.matmul(Q, K.transpose(-2, -1)) / (d_k ** 0.5)
    weights = F.softmax(scores, dim=-1)
    return torch.matmul(weights, V)
```

## 2. Các loại LLM phổ biến

| Model | Hãng | Params | Đặc điểm |
|-------|------|--------|-----------|
| GPT-4o | OpenAI | ~1.8T | Multimodal, reasoning mạnh |
| Claude | Anthropic | — | An toàn, context dài |
| Gemini | Google | — | Multimodal, tích hợp Search |
| Llama 3 | Meta | 8B-405B | Open-source |
| Mistral | Mistral AI | 7B-8x22B | Nhẹ, hiệu quả |

## 3. Tokenization

LLM không xử lý text trực tiếp mà chia thành **tokens**:

```text
"Hello world" → ["Hello", " world"] → [9906, 1917]
"Xin chào" → ["X", "in", " ch", "ào"] → [55, 258, 523, 28710]
```

> ⚠️ Tiếng Việt thường tốn nhiều token hơn tiếng Anh do tokenizer được train chủ yếu trên English corpus.

## 4. Temperature & Sampling

- **Temperature = 0**: Output deterministic, luôn chọn token xác suất cao nhất
- **Temperature = 1**: Cân bằng giữa sáng tạo và chính xác
- **Temperature > 1**: Rất sáng tạo nhưng có thể "ảo"

## 5. Hạn chế của LLM

1. **Hallucination**: Sinh thông tin sai nhưng nghe rất tự tin
2. **Knowledge cutoff**: Không biết thông tin sau ngày training
3. **Context window**: Giới hạn lượng text xử lý cùng lúc
4. **Reasoning**: Vẫn yếu ở logic phức tạp, toán nâng cao

## Tổng kết

LLM là công cụ mạnh mẽ nhưng cần hiểu rõ cách hoạt động và hạn chế để sử dụng hiệu quả.
