import { ref, type Ref } from 'vue';
import type { StockDataPoint } from '@/types/news';

export function useChartDrawing() {
  const chartCanvas = ref<HTMLCanvasElement | null>(null);

  const drawChart = (
    canvas: HTMLCanvasElement,
    stockData: StockDataPoint[],
    isPositive: boolean
  ) => {
    const ctx = canvas.getContext('2d');
    if (!ctx || !stockData.length) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    // Set canvas size with higher DPI for clarity
    canvas.width = rect.width * dpr;
    canvas.height = 200 * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = '200px';
    ctx.scale(dpr, dpr);

    const padding = 50;
    const width = rect.width - padding * 2;
    const height = 200 - padding * 2;

    const prices = stockData.map(d => d.price);
    const minPrice = Math.min(...prices) - 10;
    const maxPrice = Math.max(...prices) + 10;
    const priceRange = maxPrice - minPrice;

    ctx.clearRect(0, 0, rect.width, 200);

    drawGridLines(ctx, padding, width, height, rect.width);
    drawXAxisLabels(ctx, stockData, padding, width);
    drawYAxisLabels(ctx, padding, height, maxPrice, priceRange);
    drawPriceLine(ctx, stockData, padding, width, height, minPrice, priceRange, isPositive);
  };

  const drawGridLines = (
    ctx: CanvasRenderingContext2D,
    padding: number,
    width: number,
    height: number,
    canvasWidth: number
  ) => {
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 4; i++) {
      const y = padding + (height / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvasWidth - padding, y);
      ctx.stroke();
    }
  };

  const drawXAxisLabels = (
    ctx: CanvasRenderingContext2D,
    stockData: StockDataPoint[],
    padding: number,
    width: number
  ) => {
    ctx.fillStyle = '#6b7280';
    ctx.font = '11px system-ui';
    ctx.textAlign = 'center';
    
    stockData.forEach((point, index) => {
      if (index % Math.ceil(stockData.length / 5) === 0) {
        const x = padding + (width / (stockData.length - 1)) * index;
        const date = new Date(point.date);
        ctx.fillText(`${date.getMonth() + 1}/${date.getDate()}`, x, 200 - 8);
      }
    });
  };

  const drawYAxisLabels = (
    ctx: CanvasRenderingContext2D,
    padding: number,
    height: number,
    maxPrice: number,
    priceRange: number
  ) => {
    ctx.fillStyle = '#6b7280';
    ctx.font = '11px system-ui';
    ctx.textAlign = 'right';
    
    for (let i = 0; i <= 4; i++) {
      const y = padding + (height / 4) * i;
      const price = maxPrice - (priceRange / 4) * i;
      ctx.fillText('$' + price.toFixed(0), padding - 10, y + 4);
    }
  };

  const drawPriceLine = (
    ctx: CanvasRenderingContext2D,
    stockData: StockDataPoint[],
    padding: number,
    width: number,
    height: number,
    minPrice: number,
    priceRange: number,
    isPositive: boolean
  ) => {
    ctx.strokeStyle = isPositive ? '#10b981' : '#ef4444';
    ctx.lineWidth = 2;
    ctx.beginPath();

    stockData.forEach((point, index) => {
      const x = padding + (width / (stockData.length - 1)) * index;
      const y = padding + height - ((point.price - minPrice) / priceRange) * height;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();
  };

  return {
    chartCanvas,
    drawChart
  };
}
