export type TeamStatus = 'waiting' | 'admitted' | 'eliminated' | 'completed'

export interface Team {
  id: string
  team_code: string
  event_code: string
  participant1: string
  participant2: string
  is_admitted: boolean
  status: TeamStatus
  round: number
  created_at: string
}

export interface NewsCard {
  id: string
  round: number
  headline: string
  hint: string
  stock_name: string
  previous_price: number
  impact_score: number
  created_by_admin: string
  published: boolean
}

export interface StockSelection {
  stock_name: string
  quantity: number
  invested_amount: number
  price_at_selection: number
}

export interface Submission {
  id: string
  team_id: string
  round: number
  selected_stocks: StockSelection[]
  total_score: number
  submitted_at: string
  is_auto_submitted: boolean
}

export interface RoundStatus {
  id: string
  round_number: number
  is_active: boolean
  start_time: string | null
  end_time: string | null
  elimination_count: number
  is_locked: boolean
}

export interface Ranking {
  id: string
  round: number
  team_id: string
  rank_position: number
  score: number
  team?: Team
}

export interface Admin {
  id: string
  name: string
  email: string
}
