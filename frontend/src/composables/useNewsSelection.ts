import { ref } from 'vue';
import type { NewsItem } from '@/types/news';

export function useNewsSelection() {
  const selectedNews = ref<NewsItem | null>(null);

  const selectNews = (news: NewsItem) => {
    selectedNews.value = news;
  };

  const clearSelection = () => {
    selectedNews.value = null;
  };

  return {
    selectedNews,
    selectNews,
    clearSelection
  };
}
