# LINE101 AI分身技術流程

## 回覆流程

使用者提問 → LINE 或網站接收訊息 → Avatar persona 決定角色、語氣與安全邊界 → RAG 從可信知識找出相關片段 → LLM 生成 grounded answer → AI分身回覆 → 必要時交接真人。

## MVP 架構

Knowledge Base → RAG / Retrieval Layer → Avatar Persona Layer → LLM Response Layer → Channel Layer（Website、LINE、未來 Voice／Video）→ Lead Capture / Human Handoff。

## 模型選項

`mock` 模式提供可在 Vercel 運作的確定性展示，不需要外部模型。`ollama` 模式可使用 `OLLAMA_BASE_URL` 與 `OLLAMA_MODEL`，預設方向為 `gemma4:26b`。也可使用 OpenAI-compatible endpoint。

Vercel 無法存取本機 Windows 的 `http://localhost:11434`。正式環境需要公開但受保護的 HTTPS Ollama-compatible endpoint、私有伺服器、安全 tunnel，或 hosted OpenAI-compatible provider。

## 語音與影片路線

語音 MVP 可先使用瀏覽器 Speech Recognition 與 Speech Synthesis，不依賴付費 API。影片型 AI分身先以生成腳本與行銷素材為主，未來再評估即時影音 avatar。
