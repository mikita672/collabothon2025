import { type Ref } from 'vue'
import type { NewsItem } from '@/types/news'

export function useNewsActions(
  selectedNews: Ref<NewsItem | null>,
  selectNews: (news: NewsItem) => void,
  clearSelection: () => void,
  loadStockData: (ticker: string) => Promise<void>
) {
  const handleNewsClick = async (news: NewsItem) => {
    selectNews(news)
    await loadStockData(news.ticker)
  }

  const handleClose = () => {
    clearSelection()
  }

  const openSource = (sourceUrl?: string) => {
    if (sourceUrl) {
      window.open(sourceUrl, '_blank')
    }
  }

  return {
    handleNewsClick,
    handleClose,
    openSource,
  }
}
