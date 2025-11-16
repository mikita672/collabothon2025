import { API_BASE_URL } from '@/config/api';
import type { NewsItem, StockDataPoint } from '@/types/news';

interface NewsApiResponse {
  items: Array<{
    id: string;
    title: string;
    ticker: string;
    company: string;
    sourceUrl: string;
    timestamp: string;
    summary: any; 
    priceImpact: number; // Already in percentage format
    educationalNote: string | any; 
    relatedTickers?: string[];
    rawSource?: string;
  }>;
  count: number;
}

interface FundDataResponse {
  ticker: string;
  data: Record<string, number>;
  count: number;
  source_file: string;
}

// Sentiment based on price impact
function determineSentiment(priceImpact: number): 'positive' | 'negative' | 'neutral' {
  if (priceImpact > 0.5) return 'positive';
  if (priceImpact < -0.5) return 'negative';
  return 'neutral';
}

// Extract summary from various formats
function extractSummary(summary: any): string {
  if (!summary) return '';
  if (typeof summary === 'string') return summary;
  return summary?.summary || '';
}

// Fetch news from backend

export async function fetchNews(
  tickers: string[] = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'],
  days: number = 7,
  maxPerTicker: number = 10,
  useModel: number = 0
): Promise<NewsItem[]> {
  const params = new URLSearchParams();
  tickers.forEach(ticker => params.append('tickers', ticker));
  params.append('days', days.toString());
  params.append('max_per_ticker', maxPerTicker.toString());
  params.append('use_model', useModel.toString());

  const response = await fetch(`${API_BASE_URL}/news?${params.toString()}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch news: ${response.statusText}`);
  }

  const data: NewsApiResponse = await response.json();
  
  return data.items.map(item => ({
    id: item.id || '',
    title: item.title || '',
    ticker: item.ticker || '',
    company: item.company || '',
    timestamp: item.timestamp || '',
    sourceUrl: item.sourceUrl || '',
    sentiment: determineSentiment(item.priceImpact),
    priceImpact: item.priceImpact || 0,
    summary: extractSummary(item.summary),
    educationalNote: item.educationalNote || 'No educational information available.',
  }));
}

// Fetch stock data for ticker
export async function fetchStockData(ticker: string, days: number = 365): Promise<StockDataPoint[]> {
  const response = await fetch(`${API_BASE_URL}/fund/${ticker}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch stock data for ${ticker}: ${response.statusText}`);
  }

  const data: FundDataResponse = await response.json();
  
  const stockPoints: StockDataPoint[] = Object.entries(data.data)
    .map(([date, price]) => ({ date, price }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return stockPoints.slice(-days); // Last N days
}

// Fetch latest stock value
export async function fetchLatestStockValue(ticker: string): Promise<number> {
  const response = await fetch(`${API_BASE_URL}/fund/${ticker}/latest`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch latest value for ${ticker}: ${response.statusText}`);
  }

  const data = await response.json();
  return data.latest;
}

// Generate demo news for presentation
export async function fetchDemoNews(): Promise<NewsItem[]> {
  const demoNews: NewsItem[] = [];
  
  // Fetch 7 news items with different variants
  const variants = [0, 1, 2, 0, 1, 2, 0]; // good, bad, very bad, repeat
  
  for (const variant of variants) {
    const response = await fetch(`${API_BASE_URL}/api/admin/test-news?variant=${variant}`);
    
    if (!response.ok) continue;
    
    const item = await response.json();
    
    demoNews.push({
      id: item.id,
      title: item.title,
      ticker: item.ticker,
      company: item.company,
      timestamp: item.timestamp,
      sourceUrl: item.sourceUrl,
      sentiment: determineSentiment(item.priceImpact),
      priceImpact: item.priceImpact,
      summary: item.summary,
      educationalNote: item.educationalNote,
    });
  }
  
  return demoNews;
}
