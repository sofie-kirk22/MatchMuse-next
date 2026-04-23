# MatchMuse  
**AI-Powered Wardrobe & Outfit Generator**

MatchMuse is a full-stack web application that helps users generate personalized outfit recommendations using AI. By combining wardrobe management, image analysis, and usage insights, MatchMuse makes it easier to style outfits from clothes you already own.

---

## Features

### AI Outfit Generation
- Generate outfits based on your personal wardrobe
- Intelligent matching using color, style, and material
- Optional filtering (e.g. colors, styles, materials)

### Digital Closet
- Upload and categorize clothing items
- Automatic AI-generated metadata (colors, styles, materials)
- Organized into tops, bottoms, shoes, accessories, and outerwear

### Usage Tracking & Insights
- Log daily outfits
- View:
  - Most worn items
  - Least worn garments
  - Never worn pieces
  - “Haven’t worn in 30 days”
  - Usage trends over time

### Smart Filtering
- Dynamic filters based on actual wardrobe data
- Context-aware filtering (only shows valid combinations)

---

## Tech Stack

**Frontend**
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS

**Backend**
- Next.js API Routes (Node.js runtime)

**Database**
- Vercel Postgres (SQL)

**Storage**
- Vercel Blob (image storage)

**AI Integration**
- OpenAI API  
  - Image understanding  
  - Metadata extraction  
  - Prompt generation  

---

## Architecture
```
User uploads image
        ↓
Stored in Vercel Blob
        ↓
AI generates metadata (OpenAI)
        ↓
Stored in Postgres (garments table)
        ↓
Used for:
   - filtering
   - outfit generation
   - statistics
```
   
---

## Project Structure
```
src/
├── app/
│   ├── api/
│   │   ├── closet/
│   │   ├── outfit/
│   │   ├── garmentWears/
│   │   └── statistics/
│   ├── closet/
│   ├── my-statistics/
│   └── page.tsx
│
├── components/
│   ├── outfitGenerator/
│   ├── closetManager/
│   ├── statistics/
│   └── ui/
│
├── lib/
│   ├── db.ts
│   ├── garment-prompts.ts
│   └── utils/
│
└── types/
```

---

## Multi-User Support (Planned / In Progress)

- User-based data isolation (`user_id`)
- Per-user wardrobes and statistics
- Auth integration (planned)

---

## Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/your-username/matchmuse.git
cd matchmuse
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment variables
Create a .env.local file:
```env
POSTGRES_URL=
BLOB_READ_WRITE_TOKEN=
OPENAI_API_KEY=
```

### 4. Run locally
```bash
npm run dev
```
---
## Key API Routes

| Route                     | Description                    |
| ------------------------- | ------------------------------ |
| `/api/closet/[category]`  | Upload, fetch, delete garments |
| `/api/outfit/generate`    | Generate outfit                |
| `/api/garmentWears`       | Log worn outfits               |
| `/api/statistics`         | Usage insights                 |
| `/api/statistics/summary` | Advanced analytics             |

---

## Future Improvements

- Multi-user authentication
- Smart outfit recommendations based on history
- Calendar-based outfit tracking
- “Wear again” suggestions
- Seasonal recommendations
- Mobile optimization

---

## Purpose

MatchMuse aims to:

- Reduce decision fatigue in daily outfit selection
- Encourage more sustainable use of clothing
- Provide data-driven wardrobe insights

---

## Author

Sofie Kirk Nielsen
Full-stack developer with focus on AI-driven user experiences