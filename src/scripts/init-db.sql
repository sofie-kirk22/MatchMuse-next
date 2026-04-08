CREATE TABLE IF NOT EXISTS garments (
  id BIGSERIAL PRIMARY KEY,
  category TEXT NOT NULL CHECK (category IN ('tops', 'bottoms', 'shoes', 'accessories', 'outerwear')),
  filename TEXT NOT NULL,
  image_url TEXT NOT NULL UNIQUE,
  blob_pathname TEXT NOT NULL UNIQUE,
  alt TEXT,
  garment_type TEXT,
  colors TEXT[] NOT NULL DEFAULT '{}',
  styles TEXT[] NOT NULL DEFAULT '{}',
  materials TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS garments_category_idx ON garments(category);
CREATE INDEX IF NOT EXISTS garments_created_at_idx ON garments(created_at DESC);
CREATE INDEX IF NOT EXISTS garments_colors_gin_idx ON garments USING GIN(colors);
CREATE INDEX IF NOT EXISTS garments_styles_gin_idx ON garments USING GIN(styles);
CREATE INDEX IF NOT EXISTS garments_materials_gin_idx ON garments USING GIN(materials);