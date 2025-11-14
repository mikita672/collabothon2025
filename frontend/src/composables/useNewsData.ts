import { ref } from 'vue';
import type { NewsItem, StockDataPoint } from '@/types/news';

export function useNewsData() {
  const newsItems = ref<NewsItem[]>([
    {
      id: '1',
      title: 'Apple announces new AI chip for iPhone',
      ticker: 'AAPL',
      sentiment: 'positive',
      priceImpact: 2.5,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      company: 'Apple Inc.',
      summary: 'Apple has announced a breakthrough AI chip that will power next-generation iPhones, promising 40% better performance.',
      sourceUrl: 'https://example.com/apple-ai-chip',
      educationalNote: 'Hardware innovations in AI processing can significantly impact a company\'s competitive position and stock value.'
    },
    {
      id: '2',
      title: 'Tesla faces production delays in new facility',
      ticker: 'TSLA',
      sentiment: 'negative',
      priceImpact: -1.8,
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      company: 'Tesla Inc.',
      summary: 'Tesla reports delays in ramping up production at its new manufacturing facility, affecting delivery targets.',
      sourceUrl: 'https://example.com/tesla-delays',
      educationalNote: 'Production delays can affect quarterly earnings and investor confidence, often leading to short-term stock volatility.'
    },
    {
      id: '3',
      title: 'Microsoft expands cloud AI services',
      ticker: 'MSFT',
      sentiment: 'positive',
      priceImpact: 1.9,
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      company: 'Microsoft Corp.',
      summary: 'Microsoft announces significant expansion of Azure AI capabilities, targeting enterprise customers.',
      sourceUrl: 'https://example.com/microsoft-cloud',
      educationalNote: 'Cloud infrastructure investments demonstrate long-term growth strategy and market positioning.'
    },
    {
      id: '4',
      title: 'Amazon reports strong Q4 earnings',
      ticker: 'AMZN',
      sentiment: 'positive',
      priceImpact: 3.2,
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      company: 'Amazon.com Inc.',
      summary: 'Amazon exceeds analyst expectations with robust Q4 earnings driven by AWS growth.',
      sourceUrl: 'https://example.com/amazon-earnings',
      educationalNote: 'Strong earnings reports typically signal healthy business fundamentals and can drive stock appreciation.'
    },
    {
      id: '5',
      title: 'Google faces antitrust challenges',
      ticker: 'GOOGL',
      sentiment: 'negative',
      priceImpact: -2.1,
      timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
      company: 'Alphabet Inc.',
      summary: 'Regulatory scrutiny intensifies as DOJ pursues antitrust case against Google.',
      sourceUrl: 'https://example.com/google-antitrust',
      educationalNote: 'Regulatory challenges can create uncertainty and impact company valuations, especially for tech giants.'
    },
  ]);

  const stockData = ref<StockDataPoint[]>([
    { date: '2024-01-01', price: 150 },
    { date: '2024-01-05', price: 155 },
    { date: '2024-01-10', price: 152 },
    { date: '2024-01-15', price: 158 },
    { date: '2024-01-20', price: 162 },
    { date: '2024-01-25', price: 165 },
    { date: '2024-01-30', price: 168 }
  ]);

  return {
    newsItems,
    stockData
  };
}
