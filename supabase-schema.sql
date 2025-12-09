-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Admins table
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Teams table
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_code TEXT UNIQUE NOT NULL,
  event_code TEXT NOT NULL,
  participant1 TEXT NOT NULL,
  participant2 TEXT NOT NULL,
  is_admitted BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'waiting' CHECK (status IN ('waiting', 'admitted', 'eliminated', 'completed')),
  round INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- News cards table
CREATE TABLE news_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  round INTEGER NOT NULL,
  headline TEXT NOT NULL,
  hint TEXT NOT NULL,
  stock_name TEXT NOT NULL,
  previous_price NUMERIC(10, 2) NOT NULL,
  impact_score NUMERIC(5, 2) NOT NULL,
  created_by_admin UUID REFERENCES admins(id),
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Submissions table
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  round INTEGER NOT NULL,
  selected_stocks JSONB NOT NULL,
  total_score NUMERIC(10, 2) DEFAULT 0,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_auto_submitted BOOLEAN DEFAULT FALSE
);

-- Round status table
CREATE TABLE round_status (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  round_number INTEGER UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT FALSE,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  elimination_count INTEGER DEFAULT 0,
  is_locked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rankings table
CREATE TABLE rankings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  round INTEGER NOT NULL,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  rank_position INTEGER NOT NULL,
  score NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(round, team_id)
);

-- Enable Row Level Security
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE round_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE rankings ENABLE ROW LEVEL SECURITY;

-- Policies for teams (allow all to read/insert, admins to update)
CREATE POLICY "Teams are viewable by everyone" ON teams FOR SELECT USING (true);
CREATE POLICY "Anyone can create teams" ON teams FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can update teams" ON teams FOR UPDATE USING (auth.role() = 'authenticated');

-- Policies for news_cards
CREATE POLICY "Published news cards are viewable by everyone" ON news_cards FOR SELECT USING (published = true OR auth.role() = 'authenticated');
CREATE POLICY "Admins can manage news cards" ON news_cards FOR ALL USING (auth.role() = 'authenticated');

-- Policies for submissions
CREATE POLICY "Submissions are viewable by everyone" ON submissions FOR SELECT USING (true);
CREATE POLICY "Anyone can create submissions" ON submissions FOR INSERT WITH CHECK (true);

-- Policies for round_status
CREATE POLICY "Round status is viewable by everyone" ON round_status FOR SELECT USING (true);
CREATE POLICY "Admins can manage round status" ON round_status FOR ALL USING (auth.role() = 'authenticated');

-- Policies for rankings
CREATE POLICY "Rankings are viewable by everyone" ON rankings FOR SELECT USING (true);
CREATE POLICY "Admins can manage rankings" ON rankings FOR ALL USING (auth.role() = 'authenticated');

-- Insert initial round status
INSERT INTO round_status (round_number, is_active, elimination_count) VALUES
  (1, false, 0),
  (2, false, 0),
  (3, false, 0);

-- Sample news cards for Round 1 (Easy)
INSERT INTO news_cards (round, headline, hint, stock_name, previous_price, impact_score, published) VALUES
  (1, 'Tech Giant Announces Record Profits', 'Strong quarterly earnings beat expectations', 'INFY', 1650.00, 8.5, true),
  (1, 'Banking Sector Faces Regulatory Scrutiny', 'New compliance requirements may impact margins', 'HDFC', 1780.00, -5.2, true),
  (1, 'Oil Prices Surge on Supply Concerns', 'Global supply chain disruptions continue', 'RELIANCE', 2450.00, 7.8, true),
  (1, 'Pharma Company Gets FDA Approval', 'New drug approval opens major market', 'SUNPHARMA', 1120.00, 9.2, true),
  (1, 'Auto Manufacturer Reports Weak Sales', 'Chip shortage continues to impact production', 'TATAMOTORS', 890.00, -6.5, true),
  (1, 'E-commerce Platform Expands to New Markets', 'International expansion strategy announced', 'NYKAA', 145.00, 6.8, true),
  (1, 'Steel Prices Hit Multi-Year High', 'Infrastructure boom drives demand', 'TATASTEEL', 1340.00, 8.1, true),
  (1, 'Telecom Operator Raises Tariffs', 'Price hike expected to boost ARPU', 'BHARTIARTL', 1580.00, 5.9, true),
  (1, 'IT Services Firm Wins Major Contract', 'Multi-billion dollar deal with Fortune 500 company', 'TCS', 3890.00, 7.5, true),
  (1, 'Consumer Goods Company Faces Raw Material Inflation', 'Rising input costs may squeeze margins', 'HINDUNILVR', 2650.00, -4.3, true),
  (1, 'Renewable Energy Firm Secures Funding', 'Major investment for solar projects', 'ADANIGREEN', 1890.00, 8.9, true),
  (1, 'Airline Industry Shows Recovery Signs', 'Passenger traffic rebounds post-pandemic', 'INDIGO', 3450.00, 6.2, true),
  (1, 'Real Estate Developer Launches New Project', 'Premium residential project in metro city', 'DLF', 780.00, 5.5, true),
  (1, 'Cement Manufacturer Reports Strong Demand', 'Infrastructure spending drives growth', 'ULTRACEMCO', 9850.00, 7.2, true),
  (1, 'Financial Services Firm Expands Digital Offerings', 'New fintech platform launched', 'BAJFINANCE', 7890.00, 6.7, true);

-- Note: Create admin users in Supabase Auth dashboard:
-- Email: ajayadmin90@ubuntu.com, Password: Ajay90@
-- Email: prathamadmin90@ubuntu.com, Password: Pratham80@
