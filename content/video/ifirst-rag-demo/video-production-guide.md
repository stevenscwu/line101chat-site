# Video Production Guide

Recommended manual workflow for producing the NTUT iFIRST RAG Demo promotion video.

## Workflow

1. Record the website case studies page with OBS.
   - Capture the video section, NTUT demo case card, QR guide, and free assessment CTA.

2. Record the LINE demo interaction.
   - Use the 北科大創新學院 Demo chatbot, LINE channel `2007782998`.
   - Suggested question: `人工智慧學程 TOEFL iBT 畢業門檻是多少？`
   - Show the answer and source information.
   - Hide private LINE IDs, notifications, and unrelated chats.

3. Edit in CapCut or DaVinci Resolve.
   - Keep total length between 60 and 90 seconds.
   - Use the website's existing visual language: emerald green, slate, white, clean cards.

4. Import the voiceover.
   - Use `voiceover.zh-TW.txt` as the base recording script.

5. Add captions.
   - Import `captions.zh-TW.srt`.
   - Adjust timing after the final voiceover is recorded.

6. Export the final MP4 as:

```text
public/videos/ifirst-rag-demo.mp4
```

7. Commit the MP4 only if the file size is reasonable.

8. If the file is too large, upload it to YouTube as unlisted or use external video hosting, then update the website to embed that hosted video.

## Vercel Note

Large video files can slow deployment and increase bandwidth usage. For Vercel production, prefer a compressed MP4 if small, or an unlisted YouTube / external video embed if the file is large.

## Public Link Safety

Do not use LINE Developers Console URLs as public CTA links. Use public LINE add-friend links when available, or keep QR-based CTAs with clear labels.
