import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const db = new Database("database.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS portfolio (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT, -- apartment, commercial, house
    title TEXT,
    location TEXT,
    size TEXT,
    scope TEXT,
    intent TEXT,
    points TEXT,
    images TEXT, -- JSON array of URLs
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS today_design (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    before_img TEXT,
    after_img TEXT,
    material TEXT,
    intent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS site_settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );
`);

// Seed default settings if not exists
const seedSettings = db.prepare("INSERT OR REPLACE INTO site_settings (key, value) VALUES (?, ?)");
seedSettings.run("phone", "010-1234-5678");
seedSettings.run("admin_password", "1111");
seedSettings.run("philosophy_design", "디자인은 도면에서 끝나지 않습니다. 마감 디테일이 완성도를 만듭니다. 공간의 본질을 이해하고 그에 맞는 최적의 선과 면을 찾아냅니다.");
seedSettings.run("philosophy_const", "저는 설계 의도가 현장에서 무너지지 않도록 직접 관리합니다. 기술적인 정밀함이 뒷받침되지 않은 디자인은 완성될 수 없습니다.");
seedSettings.run("about_name", "김태일");
seedSettings.run("about_bio", "15년 경력의 현장 중심 인테리어 디자이너입니다. 수많은 아파트, 상가, 주택 현장을 직접 발로 뛰며 디자인과 시공의 간극을 줄여왔습니다. 상담부터 마감까지 제가 직접 책임지고 관리하여 고객님의 소중한 공간을 완성합니다.");
seedSettings.run("about_image", "https://picsum.photos/seed/profile/800/1000");


// Seed Portfolio if empty
const portfolioCount = db.prepare("SELECT COUNT(*) as count FROM portfolio").get() as any;
if (portfolioCount.count === 0) {
  const insertPortfolio = db.prepare(`
    INSERT INTO portfolio (category, title, location, size, scope, intent, points, images)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  insertPortfolio.run(
    'apartment',
    '수성구 범어동 래미안',
    '대구 수성구',
    '32평',
    '전체 리모델링',
    '웜톤 미니멀 컨셉으로 따뜻하면서도 정돈된 공간을 지향했습니다.',
    '간접조명 설계 최적화, 600각 포세린 타일 정밀 시공',
    JSON.stringify(['https://picsum.photos/seed/apt1/800/1000'])
  );
  insertPortfolio.run(
    'commercial',
    '동성로 카페 테일러',
    '대구 중구',
    '25평',
    '상가 신축 인테리어',
    '인더스트리얼 빈티지 무드에 현대적인 감각을 더한 카페 공간입니다.',
    '노출 천장 도장 마감, 커스텀 제작 바 테이블',
    JSON.stringify(['https://picsum.photos/seed/comm1/800/1000'])
  );
  insertPortfolio.run(
    'house',
    '가창면 전원주택',
    '대구 달성군',
    '45평',
    '구조 변경 및 단열 개선',
    '기존 노후 주택의 구조적 한계를 극복하고 현대적인 생활 패턴에 맞게 재구성했습니다.',
    '창호 전면 교체, 단열 성능 극대화, 오픈형 주방 설계',
    JSON.stringify(['https://picsum.photos/seed/house1/800/1000'])
  );
}

// Seed Today Design if empty
const todayCount = db.prepare("SELECT COUNT(*) as count FROM today_design").get() as any;
if (todayCount.count === 0) {
  const insertToday = db.prepare(`
    INSERT INTO today_design (title, before_img, after_img, material, intent)
    VALUES (?, ?, ?, ?, ?)
  `);
  insertToday.run(
    '낡은 벽돌 담장의 현대적 재해석',
    'https://picsum.photos/seed/before1/800/600',
    'https://picsum.photos/seed/after1/800/600',
    '스타코 플렉스 화이트, 매립형 라인 조명',
    '어둡고 칙칙했던 골목의 담장을 화이트 톤으로 정리하고 라인 조명을 매립하여 밤에도 안전하고 세련된 분위기를 연출했습니다.'
  );
}


async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));

  // Multer configuration
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  });
  const upload = multer({ storage });

  // API Routes
  app.post("/api/upload", upload.single("image"), (req: any, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const url = `/uploads/${req.file.filename}`;
    res.json({ url });
  });
  app.get("/api/settings", (req, res) => {
    const settings = db.prepare("SELECT * FROM site_settings").all();
    const settingsObj = settings.reduce((acc: any, curr: any) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});
    res.json(settingsObj);
  });

  app.post("/api/settings", (req, res) => {
    const { password, settings } = req.body;
    if (password !== "1111") return res.status(401).json({ error: "Unauthorized" });

    const update = db.prepare("INSERT OR REPLACE INTO site_settings (key, value) VALUES (?, ?)");
    const transaction = db.transaction((items) => {
      for (const [key, value] of Object.entries(items)) {
        update.run(key, value);
      }
    });
    transaction(settings);
    res.json({ success: true });
  });

  app.get("/api/portfolio", (req, res) => {
    const { category } = req.query;
    let items;
    if (category) {
      items = db.prepare("SELECT * FROM portfolio WHERE category = ? ORDER BY created_at DESC").all(category);
    } else {
      items = db.prepare("SELECT * FROM portfolio ORDER BY created_at DESC").all();
    }
    res.json(items.map((item: any) => ({ ...item, images: JSON.parse(item.images) })));
  });

  app.post("/api/portfolio", (req, res) => {
    const { password, item } = req.body;
    if (password !== "1111") return res.status(401).json({ error: "Unauthorized" });

    const stmt = db.prepare(`
      INSERT INTO portfolio (category, title, location, size, scope, intent, points, images)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(item.category, item.title, item.location, item.size, item.scope, item.intent, item.points, JSON.stringify(item.images));
    res.json({ success: true });
  });

  app.delete("/api/portfolio/:id", (req, res) => {
    const { password } = req.body;
    if (password !== "1111") return res.status(401).json({ error: "Unauthorized" });
    db.prepare("DELETE FROM portfolio WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.get("/api/today-design", (req, res) => {
    const items = db.prepare("SELECT * FROM today_design ORDER BY created_at DESC").all();
    res.json(items);
  });

  app.post("/api/today-design", (req, res) => {
    const { password, item } = req.body;
    if (password !== "1111") return res.status(401).json({ error: "Unauthorized" });

    const stmt = db.prepare(`
      INSERT INTO today_design (title, before_img, after_img, material, intent)
      VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(item.title, item.before_img, item.after_img, item.material, item.intent);
    res.json({ success: true });
  });

  app.delete("/api/today-design/:id", (req, res) => {
    const { password } = req.body;
    if (password !== "1111") return res.status(401).json({ error: "Unauthorized" });
    db.prepare("DELETE FROM today_design WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
