export interface NewsItem {
  id: string;
  title: string;
  ticker: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  priceImpact: number;
  timestamp: string;
  company: string;
  summary: string;
  sourceUrl: string;
  educationalNote: string;
}

export interface StockDataPoint {
  date: string;
  price: number;
}
