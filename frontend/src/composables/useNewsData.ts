import { ref, onMounted } from 'vue';
import type { NewsItem, StockDataPoint } from '@/types/news';
import { fetchNews, fetchStockData, fetchDemoNews } from '@/services/api';

export function useNewsData() {
  const newsItems = ref<NewsItem[]>([]);
  const stockData = ref<StockDataPoint[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const defaultTickers = ['AAPL', 'MSFT', 'AMZN', 'NVDA'];

  // Load news from API
  const loadNews = async (
    tickers: string[] = defaultTickers,
    days: number = 30,
    maxPerTicker: number = 2,
    useModel: number = 5
  ) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const news = await fetchNews(tickers, days, maxPerTicker, useModel);
      // Limit to exactly 7 news items
      newsItems.value = news.slice(0, 7);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load news';
      console.error('Error loading news:', err);
    } finally {
      isLoading.value = false;
    }
  };

  // Load stock data
  const loadStockData = async (ticker: string) => {
    try {
      const data = await fetchStockData(ticker);
      stockData.value = data;
    } catch (err) {
      console.error(`Error loading stock data for ${ticker}:`, err);
      stockData.value = [];
    }
  };

  // Refresh news data
  const refresh = () => loadNews();

  // Load demo news for presentation
  const loadDemoNews = async () => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const demoItems = await fetchDemoNews();
      // Limit to exactly 7 news items
      newsItems.value = demoItems.slice(0, 7);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load demo news';
      console.error('Error loading demo news:', err);
    } finally {
      isLoading.value = false;
    }
  };

  // Auto-load demo news on mount
  onMounted(() => loadDemoNews());

  return {
    newsItems,
    stockData,
    isLoading,
    error,
    loadNews,
    loadStockData,
    refresh,
    loadDemoNews,
  };
}
