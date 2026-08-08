import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Ensure public/avatars folder exists and serve it statically
const avatarsDir = path.join(process.cwd(), 'public', 'avatars');
if (!fs.existsSync(avatarsDir)) {
  fs.mkdirSync(avatarsDir, { recursive: true });
}
app.use('/avatars', express.static(avatarsDir));

// Endpoint to list custom avatars inside public/avatars directory
app.get('/api/avatars', (req, res) => {
  try {
    const files = fs.readdirSync(avatarsDir);
    // Filter only image files
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return imageExtensions.includes(ext);
    });
    res.json({ files: imageFiles });
  } catch (error: any) {
    console.error('Error in /api/avatars:', error);
    res.status(500).json({ error: 'Failed to list avatars', details: error.message });
  }
});

// Initialize Gemini Client safely
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  } catch (e) {
    console.warn('Gemini API initialization warning:', e);
  }
}

// Interactive character chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { characterName, title, backstory, openingMessage, personality, voiceTone, messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // If Gemini key is available, generate AI response matching character personality
    if (ai) {
      const systemInstruction = `Bạn là nhân vật tên "${characterName}" (${title}).
Tính cách: ${personality || 'thú vị, cá tính'}.
Giọng điệu: ${voiceTone || 'tự nhiên'}.
Tiểu sử / Backstory:
${backstory || ''}

Tin nhắn mở đầu của bạn:
"${openingMessage || ''}"

YÊU CẦU QUAN TRỌNG:
1. Hãy nhập vai hoàn hảo thành nhân vật ${characterName}. Giữ nguyên phong cách xưng hô, tính cách, bối cảnh và giọng điệu.
2. Trả lời ngắn gọn, hấp dẫn, giàu cảm xúc và sinh động (tối đa 2-4 câu). Có thể thêm hành động trong ngoặc kép hoặc dấu sao như *mỉm cười*, *nghiêng đầu*.
3. Trả lời bằng tiếng Việt.`;

      const contents = messages.map((m: { role: string; text: string }) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.8,
          maxOutputTokens: 500,
        }
      });

      const replyText = response.text || `*${characterName} mỉm cười nhẹ* "Ta đã nhận được lời nhắn của bạn..."`;
      return res.json({ text: replyText });
    } else {
      // Fallback response generator if GEMINI_API_KEY is not set yet
      const lastUserMsg = messages[messages.length - 1]?.text || '';
      const fallbackReplies = [
        `*${characterName} nghe bạn nói rồi mỉm cười* "Lời bạn vừa chia sẻ thật đặc biệt! Với kinh nghiệm của một ${title}, ta cảm nhận được sự chân thành trong đó."`,
        `*${characterName} gật đầu suy ngẫm* "Bạn vừa nói '${lastUserMsg.slice(0, 30)}...' phải không? Điều này nhắc ta nhớ lại một kỷ niệm trong quá khứ..."`,
        `*${characterName} nghiêng đầu lắng nghe* "Thật thú vị! Hãy kể thêm cho ta nghe về góc nhìn của bạn nhé."`
      ];
      const randomReply = fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
      return res.json({ text: randomReply });
    }
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    res.status(500).json({ error: 'Failed to process chat response', details: error.message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
