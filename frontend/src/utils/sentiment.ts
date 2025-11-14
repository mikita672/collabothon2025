import type { NewsItem } from '@/types/news';

export const getSentimentIcon = (sentiment: NewsItem['sentiment']): string => {
  switch (sentiment) {
    case 'positive':
      return 'mdi-trending-up';
    case 'negative':
      return 'mdi-trending-down';
    default:
      return 'mdi-minus';
  }
};

export const getSentimentColor = (sentiment: NewsItem['sentiment']): string => {
  switch (sentiment) {
    case 'positive':
      return '#059669';
    case 'negative':
      return '#dc2626';
    default:
      return '#6b7280';
  }
};

export const getSentimentBadgeClass = (sentiment: NewsItem['sentiment']): string => {
  switch (sentiment) {
    case 'positive':
      return 'sentiment-positive';
    case 'negative':
      return 'sentiment-negative';
    default:
      return 'sentiment-neutral';
  }
};
