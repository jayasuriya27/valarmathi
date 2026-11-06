-- Categories and products are re-created every time (seed data).
-- The enquiries table is NEVER dropped, so customer enquiries are safe.
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  image VARCHAR(500),
  sort_order INT DEFAULT 0
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  category_id INT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  slug VARCHAR(150) UNIQUE NOT NULL,
  description TEXT,
  material VARCHAR(60),
  images TEXT[] NOT NULL DEFAULT '{}',
  featured BOOLEAN DEFAULT FALSE,
  finishes TEXT[] NOT NULL DEFAULT '{}',   -- finish slugs this product is made in (see src/lib/finishes.js)
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_products_category ON products(category_id);

CREATE TABLE IF NOT EXISTS enquiries (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(15) NOT NULL,
  email VARCHAR(100),
  enquiry_type VARCHAR(50),
  message TEXT,
  product_name VARCHAR(150),
  created_at TIMESTAMP DEFAULT NOW()
);
ALTER TABLE enquiries ALTER COLUMN product_name TYPE VARCHAR(150);
-- Space size of the enquiry form (optional, feet). IF NOT EXISTS, so old enquiries are kept.
ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS room_length NUMERIC(5,1);
ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS room_width NUMERIC(5,1);

-- Attachments of an enquiry (product page / contact page form). File is saved in:
--   <UPLOAD_DIR>/enquiries/<enquiry_id>/<stored_name>
CREATE TABLE IF NOT EXISTS enquiry_files (
  id SERIAL PRIMARY KEY,
  enquiry_id INT NOT NULL REFERENCES enquiries(id) ON DELETE CASCADE,
  original_name VARCHAR(255) NOT NULL,
  stored_name VARCHAR(100) NOT NULL,
  mime_type VARCHAR(100),
  size_bytes INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_enquiry_files_enquiry ON enquiry_files(enquiry_id);

-- ---------- Custom design requests ----------
-- One row per request. IF NOT EXISTS, so running setup again never deletes customer requests.
CREATE TABLE IF NOT EXISTS custom_requests (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(15) NOT NULL,
  email VARCHAR(100),
  furniture_type VARCHAR(50) NOT NULL,
  room_type VARCHAR(50),
  room_length NUMERIC(5,1),            -- feet
  room_width NUMERIC(5,1),             -- feet
  room_height NUMERIC(5,1),            -- feet
  site_visit BOOLEAN NOT NULL DEFAULT FALSE,   -- customer does not know the size, wants a site visit
  finishes TEXT[] NOT NULL DEFAULT '{}',       -- finish slugs from src/lib/finishes.js
  finish_help BOOLEAN NOT NULL DEFAULT FALSE,  -- "not sure, please suggest"
  budget VARCHAR(30),
  needed_by VARCHAR(30),
  location VARCHAR(150),
  message TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'new',   -- new | contacted | quoted | closed
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_custom_requests_created ON custom_requests(created_at DESC);

-- Attachments of a request (photos, screenshots, pdf, zip ...). The file itself is in the uploads folder,
-- here we keep only its details:  <UPLOAD_DIR>/custom-designs/<request_id>/<stored_name>
CREATE TABLE IF NOT EXISTS custom_request_files (
  id SERIAL PRIMARY KEY,
  request_id INT NOT NULL REFERENCES custom_requests(id) ON DELETE CASCADE,
  original_name VARCHAR(255) NOT NULL,   -- name the customer had (shown in admin)
  stored_name VARCHAR(100) NOT NULL,     -- random name on disk
  mime_type VARCHAR(100),
  size_bytes INT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_custom_files_request ON custom_request_files(request_id);
