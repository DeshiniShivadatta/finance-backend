--------------------------------------------------------------------------
--# users Table
--------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100)  NOT NULL,
  email       VARCHAR(150)  UNIQUE NOT NULL,
  password    TEXT          NOT NULL,
  role        VARCHAR(20)   NOT NULL DEFAULT 'viewer' CHECK (role IN ('viewer', 'analyst', 'admin')),
  status      VARCHAR(20)   NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at  TIMESTAMP     DEFAULT NOW(),
  updated_at  TIMESTAMP     DEFAULT NOW()
);

--------------------------------------------------------------------------
--## FINANCIAL RECORDS TABLE
--------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS financial_records (
  id          SERIAL PRIMARY KEY,
  amount      NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  type        VARCHAR(20)    NOT NULL CHECK (type IN ('income', 'expense')),
  category    VARCHAR(100)   NOT NULL,
  date        DATE           NOT NULL,
  notes       TEXT,
  created_by  INT            REFERENCES users(id) ON DELETE SET NULL,
  is_deleted  BOOLEAN        NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMP      DEFAULT NOW(),
  updated_at  TIMESTAMP      DEFAULT NOW()
);
--------------------------------------------------------------------------
-- # Indexes
--------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_records_type       ON financial_records(type);
CREATE INDEX IF NOT EXISTS idx_records_category   ON financial_records(category);
CREATE INDEX IF NOT EXISTS idx_records_date       ON financial_records(date);
CREATE INDEX IF NOT EXISTS idx_records_is_deleted ON financial_records(is_deleted);

-- ============================================================
-- SAMPLE SEED DATA
-- ============================================================

-- Admin user (password: admin123)
INSERT INTO users (name, email, password, role, status) VALUES
  ('Super Admin', 'admin@finance.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'active'),
  ('Jane Analyst', 'analyst@finance.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'analyst', 'active'),
  ('John Viewer', 'viewer@finance.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'viewer', 'active')
ON CONFLICT (email) DO NOTHING;

-- Sample financial records
INSERT INTO financial_records (amount, type, category, date, notes, created_by) VALUES
  (50000.00, 'income',  'Salary',       '2025-01-01', 'Monthly salary',        1),
  (1200.00,  'expense', 'Rent',         '2025-01-05', 'Monthly rent',          1),
  (300.00,   'expense', 'Utilities',    '2025-01-10', 'Electricity and water', 1),
  (8000.00,  'income',  'Freelance',    '2025-02-01', 'Project payment',       1),
  (450.00,   'expense', 'Groceries',    '2025-02-14', 'Monthly groceries',     1),
  (15000.00, 'income',  'Investment',   '2025-03-01', 'Stock dividends',       1),
  (600.00,   'expense', 'Transport',    '2025-03-20', 'Fuel and cab fares',    1),
  (2000.00,  'expense', 'Dining',       '2025-04-05', 'Team dinner',           1),
  (5000.00,  'income',  'Bonus',        '2025-04-15', 'Q1 performance bonus',  1),
  (1800.00,  'expense', 'Subscription', '2025-05-01', 'SaaS tools',            1);