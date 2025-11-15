import { computed, type ComputedRef } from 'vue'
import type { NewsItem } from '@/types/news'

export interface SentimentStyles {
  backgroundColor: string
  color: string
  border: string
}

export interface PriceImpactStyles {
  color: string
  borderColor: string
  backgroundColor: string
}

export function useSentiment(news: ComputedRef<NewsItem | null> | NewsItem | null) {
  const newsRef = computed(() => {
    if (!news) return null
    return 'value' in news ? news.value : news
  })

  const isPositive = computed(() => newsRef.value?.sentiment === 'positive')

  const sentimentClass = computed(() => {
    if (!newsRef.value) return 'sentiment-neutral'
    switch (newsRef.value.sentiment) {
      case 'positive':
        return 'sentiment-positive'
      case 'negative':
        return 'sentiment-negative'
      default:
        return 'sentiment-neutral'
    }
  })

  const sentimentIcon = computed(() => {
    if (!newsRef.value) return 'mdi-minus'
    switch (newsRef.value.sentiment) {
      case 'positive':
        return 'mdi-arrow-up-circle'
      case 'negative':
        return 'mdi-arrow-down-circle'
      default:
        return 'mdi-minus-circle'
    }
  })

  const sentimentColor = computed(() => {
    if (!newsRef.value) return 'grey'
    switch (newsRef.value.sentiment) {
      case 'positive':
        return 'success'
      case 'negative':
        return 'error'
      default:
        return 'grey'
    }
  })

  const sentimentStyle = computed((): SentimentStyles => {
    const sentiment = newsRef.value?.sentiment
    if (sentiment === 'positive') {
      return { backgroundColor: '#dcfce7', color: '#15803d', border: '1px solid #86efac' }
    } else if (sentiment === 'negative') {
      return { backgroundColor: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5' }
    } else {
      return { backgroundColor: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db' }
    }
  })

  const priceImpactClass = computed(() => {
    if (!newsRef.value) return 'price-neutral'
    if (newsRef.value.priceImpact > 0) return 'price-positive'
    if (newsRef.value.priceImpact < 0) return 'price-negative'
    return 'price-neutral'
  })

  const priceImpactIcon = computed(() => {
    if (!newsRef.value) return 'mdi-minus'
    if (newsRef.value.priceImpact > 0) return 'mdi-trending-up'
    if (newsRef.value.priceImpact < 0) return 'mdi-trending-down'
    return 'mdi-minus'
  })

  const priceImpactStyle = computed((): PriceImpactStyles => {
    const impact = newsRef.value?.priceImpact || 0
    if (impact > 0) {
      return { color: '#15803d', borderColor: '#86efac', backgroundColor: 'rgba(220, 252, 231, 0.3)' }
    } else if (impact < 0) {
      return { color: '#991b1b', borderColor: '#fca5a5', backgroundColor: 'rgba(254, 226, 226, 0.3)' }
    } else {
      return { color: '#6b7280', borderColor: '#d1d5db', backgroundColor: 'rgba(243, 244, 246, 0.3)' }
    }
  })

  return {
    isPositive,
    sentimentClass,
    sentimentIcon,
    sentimentColor,
    sentimentStyle,
    priceImpactClass,
    priceImpactIcon,
    priceImpactStyle,
  }
}
