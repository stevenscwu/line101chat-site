# Video Production Guide

Recommended manual workflow for producing:

北科大創新學院 iFIRST AI 文件問答 Demo  
用公開文件建立可在 LINE 查詢的 AI 知識助理

## Workflow

1. Use OBS Studio or Windows screen recording.
   - Set recording to 1080p, 30 fps if possible.
   - Turn on Do Not Disturb before recording LINE.

2. Record `line101chat.com/case-studies`.
   - Capture the video section, iFIRST Demo explanation, QR guide, and CTA buttons.
   - Show that the iFIRST demo chatbot and LINE101Chat business inquiry chatbot are separate.

3. Record the LINE iFirst chatbot answering the demo question.
   - Demo chatbot: 北科大創新學院 / NTUT iFIRST RAG chatbot.
   - Demo question: `人工智慧學程 TOEFL iBT 畢業門檻是多少？`
   - Show that the bot answers from official public documents and includes source information.
   - Do not claim this is an official NTUT service.

4. Use CapCut or DaVinci Resolve.
   - Keep total video length between 60 and 90 seconds.
   - Use clean business pacing and avoid hype-heavy effects.

5. Add voiceover from `voiceover.zh-TW.txt`.
   - Read in natural Traditional Chinese.
   - Keep a calm, practical, trustworthy tone.

6. Add captions from `captions.zh-TW.srt`.
   - Import the SRT file.
   - Adjust timing after the final voiceover is recorded.

7. Export MP4.
   - Recommended: H.264 MP4, 1080p, 30 fps.
   - Compress enough for fast web playback.

8. If the file is under 20 MB, place it at:

   ```text
   public/videos/ifirst-rag-demo.mp4
   ```

9. If the file is large, upload to YouTube unlisted and embed it.
   - Replace or extend the page video section with the YouTube embed.
   - Keep the local MP4 placeholder path documented for future use.

10. Do not expose LINE Developers console links in the public video.
    - Do not show Channel Secret, Channel Access Token, Webhook URL, or admin console pages.

11. Show public QR code image only if available and safe.
    - iFIRST Demo chatbot QR: use only if approved for public demo viewing.
    - LINE101Chat business QR: use only for service inquiries and free assessment.

## Vercel Note

Large video files can slow deployment and increase bandwidth usage. For Vercel production, prefer a compressed MP4 if small, or an unlisted YouTube / external video embed if the file is large.

## Public Link Safety

Do not use LINE Developers Console URLs as public CTA links. Use public LINE add-friend links when available, or keep QR-based CTAs with clear labels.
