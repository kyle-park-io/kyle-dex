import { type Component, type JSX } from 'solid-js';
import { createSignal, createEffect, onMount, onCleanup, Show, For } from 'solid-js';
import { useParams } from '@solidjs/router';
import { DexHeader } from './layout/DexHeader';
import { createChart, ColorType, CrosshairMode, LineStyle, LineSeries, CandlestickSeries, HistogramSeries, AreaSeries, type IChartApi, type ISeriesApi } from 'lightweight-charts';
import chroma from 'chroma-js';
import { getPairList, getPairProperty, getPairReserveAll, getPairsCurrentReserve, getPairEventAll } from './axios/Dex.axios.pair';
import { getClientPairsEvent } from './axios/Dex.axios.client';
import { globalState } from '../global/constants';
import axios from 'axios';
import '../chart/Chart.css';

const api = globalState.api_url;

// Chart types
type ChartType = 'all' | 'one-pair' | 'my-pair';
type ChartStyle = 'scatter' | 'line' | 'area' | 'candlestick' | 'bar';

// Color palette using chroma-js
const createColorPalette = (count: number) => {
  return chroma.scale(['#f0b90b', '#0ecb81', '#1e90ff', '#f6465d', '#9b59b6']).mode('lab').colors(count);
};

const DexChartIndex: Component = (): JSX.Element => {
  const params = useParams();
  
  // State
  const [isNetwork, setIsNetwork] = createSignal(false);
  const [isSupportedNetwork, setIsSupportedNetwork] = createSignal(false);
  const [loading, setLoading] = createSignal(true);
  const [chartType, setChartType] = createSignal<ChartType>('all');
  const [chartStyle, setChartStyle] = createSignal<ChartStyle>('line');
  const [selectedPair, setSelectedPair] = createSignal<string>('');
  const [selectedEvent, setSelectedEvent] = createSignal<string>('all');
  
  // Data
  const [pairs, setPairs] = createSignal<any[]>([]);
  const [events, setEvents] = createSignal<any[]>([]);
  const [chartData, setChartData] = createSignal<any[]>([]);
  const [priceInfo, setPriceInfo] = createSignal<any>(null);
  
  // Event detail modal
  const [selectedEventDetail, setSelectedEventDetail] = createSignal<any>(null);
  const [showEventModal, setShowEventModal] = createSignal(false);
  
  // Chart refs
  let chartContainerRef: HTMLDivElement | undefined;
  let scatterCanvasRef: HTMLCanvasElement | undefined;
  let chart: IChartApi | null = null;
  let series: ISeriesApi<any> | null = null;
  
  // Scatter data for All Pairs (x: reserve0, y: reserve1)
  const [scatterData, setScatterData] = createSignal<{ x: number; y: number; label: string; color: string }[]>([]);

  // Initialize chart
  const initChart = () => {
    if (!chartContainerRef) {
      console.log('Chart container ref not ready');
      return;
    }
    
    console.log('Initializing chart, container size:', chartContainerRef.clientWidth, chartContainerRef.clientHeight);
    
    // Clean up existing chart
    if (chart) {
      chart.remove();
      chart = null;
      series = null;
    }

    chart = createChart(chartContainerRef, {
      layout: {
        background: { type: ColorType.Solid, color: '#141820' },
        textColor: '#848e9c',
      },
      grid: {
        vertLines: { color: '#2b3139' },
        horzLines: { color: '#2b3139' },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          color: '#f0b90b',
          width: 1,
          style: LineStyle.Dashed,
          labelBackgroundColor: '#f0b90b',
        },
        horzLine: {
          color: '#f0b90b',
          width: 1,
          style: LineStyle.Dashed,
          labelBackgroundColor: '#f0b90b',
        },
      },
      timeScale: {
        borderColor: '#2b3139',
        timeVisible: true,
      },
      rightPriceScale: {
        borderColor: '#2b3139',
      },
      handleScale: {
        axisPressedMouseMove: true,
      },
      handleScroll: {
        vertTouchDrag: true,
      },
    });

    // Resize handler
    const handleResize = () => {
      if (chart && chartContainerRef) {
        chart.applyOptions({ 
          width: chartContainerRef.clientWidth,
          height: chartContainerRef.clientHeight 
        });
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  };

  // Draw scatter chart on canvas (x: Reserve0, y: Reserve1)
  const drawScatterChart = () => {
    if (!scatterCanvasRef) return;
    
    const data = scatterData();
    if (data.length === 0) return;
    
    const canvas = scatterCanvasRef;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    const container = canvas.parentElement;
    if (container) {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    }
    
    const width = canvas.width;
    const height = canvas.height;
    const padding = 60;
    
    // Clear canvas
    ctx.fillStyle = '#141820';
    ctx.fillRect(0, 0, width, height);
    
    // Calculate min/max for scaling
    const xValues = data.map(d => d.x);
    const yValues = data.map(d => d.y);
    const xMin = Math.min(...xValues) * 0.9;
    const xMax = Math.max(...xValues) * 1.1;
    const yMin = Math.min(...yValues) * 0.9;
    const yMax = Math.max(...yValues) * 1.1;
    
    // Scale functions
    const scaleX = (x: number) => padding + ((x - xMin) / (xMax - xMin)) * (width - padding * 2);
    const scaleY = (y: number) => height - padding - ((y - yMin) / (yMax - yMin)) * (height - padding * 2);
    
    // Draw grid
    ctx.strokeStyle = '#2b3139';
    ctx.lineWidth = 1;
    
    // Vertical grid lines
    for (let i = 0; i <= 5; i++) {
      const x = padding + (i / 5) * (width - padding * 2);
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();
    }
    
    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding + (i / 5) * (height - padding * 2);
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }
    
    // Draw axes
    ctx.strokeStyle = '#848e9c';
    ctx.lineWidth = 2;
    
    // X axis
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
    
    // Y axis
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();
    
    // Draw axis labels
    ctx.fillStyle = '#848e9c';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    
    // X axis label
    ctx.fillText('Reserve0', width / 2, height - 10);
    
    // Y axis label
    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Reserve1', 0, 0);
    ctx.restore();
    
    // Draw axis values
    ctx.font = '10px sans-serif';
    ctx.fillStyle = '#848e9c';
    
    // X axis values
    for (let i = 0; i <= 5; i++) {
      const value = xMin + (i / 5) * (xMax - xMin);
      const x = scaleX(value);
      ctx.textAlign = 'center';
      ctx.fillText(formatNumber(value), x, height - padding + 15);
    }
    
    // Y axis values
    for (let i = 0; i <= 5; i++) {
      const value = yMin + (i / 5) * (yMax - yMin);
      const y = scaleY(value);
      ctx.textAlign = 'right';
      ctx.fillText(formatNumber(value), padding - 5, y + 4);
    }
    
    // Draw scatter points
    data.forEach((point, index) => {
      const x = scaleX(point.x);
      const y = scaleY(point.y);
      
      // Draw point
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fillStyle = point.color;
      ctx.fill();
      
      // Draw border
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Draw label (pair index)
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(String(index + 1), x, y + 3);
    });
    
    // Draw legend
    const legendX = width - padding - 120;
    const legendY = padding + 10;
    ctx.fillStyle = 'rgba(20, 24, 32, 0.9)';
    ctx.fillRect(legendX - 10, legendY - 10, 130, Math.min(data.length * 18 + 20, 150));
    
    ctx.font = '10px sans-serif';
    data.slice(0, 7).forEach((point, index) => {
      ctx.fillStyle = point.color;
      ctx.beginPath();
      ctx.arc(legendX, legendY + index * 18 + 5, 5, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#848e9c';
      ctx.textAlign = 'left';
      ctx.fillText(`${index + 1}: ${point.label}`, legendX + 10, legendY + index * 18 + 9);
    });
    
    if (data.length > 7) {
      ctx.fillStyle = '#848e9c';
      ctx.fillText(`... +${data.length - 7} more`, legendX + 10, legendY + 7 * 18 + 9);
    }
  };
  
  // Format large numbers
  const formatNumber = (num: number): string => {
    if (num >= 1e18) return (num / 1e18).toFixed(1) + 'E';
    if (num >= 1e15) return (num / 1e15).toFixed(1) + 'P';
    if (num >= 1e12) return (num / 1e12).toFixed(1) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num.toFixed(0);
  };

  // Update chart data
  const updateChartData = (data: any[], styleOverride?: ChartStyle) => {
    if (!chart) {
      console.log('Chart not initialized yet');
      return;
    }

    console.log('Updating chart with data points:', data.length);

    // Remove existing series
    if (series) {
      chart.removeSeries(series);
      series = null;
    }

    if (data.length === 0) {
      console.log('No data to display');
      return;
    }

    const style = styleOverride || chartStyle();
    const colors = createColorPalette(data.length);

    if (style === 'scatter') {
      // Scatter: Use HistogramSeries with different colors for each point
      series = chart.addSeries(HistogramSeries, {
        priceFormat: {
          type: 'volume',
        },
        priceLineVisible: false,
        lastValueVisible: false,
      });
      // Apply different colors to each data point
      series.setData(data.map((d: any, i: number) => ({
        ...d,
        color: colors[i % colors.length],
      })));
    } else if (style === 'line') {
      series = chart.addSeries(LineSeries, {
        color: '#f0b90b',
        lineWidth: 2,
        crosshairMarkerVisible: true,
        crosshairMarkerRadius: 4,
        priceLineVisible: false,
      });
      series.setData(data);
    } else if (style === 'area') {
      series = chart.addSeries(AreaSeries, {
        topColor: 'rgba(240, 185, 11, 0.4)',
        bottomColor: 'rgba(240, 185, 11, 0.0)',
        lineColor: '#f0b90b',
        lineWidth: 2,
      });
      series.setData(data);
    } else if (style === 'candlestick') {
      series = chart.addSeries(CandlestickSeries, {
        upColor: '#0ecb81',
        downColor: '#f6465d',
        borderUpColor: '#0ecb81',
        borderDownColor: '#f6465d',
        wickUpColor: '#0ecb81',
        wickDownColor: '#f6465d',
      });
      series.setData(data);
    } else if (style === 'bar') {
      series = chart.addSeries(HistogramSeries, {
        color: '#f0b90b',
        priceFormat: {
          type: 'volume',
        },
      });
      series.setData(data.map((d, i) => ({ ...d, color: colors[i % colors.length] })));
    }

    chart.timeScale().fitContent();
  };

  // Fetch pairs
  const fetchPairs = async () => {
    try {
      const network = localStorage.getItem('network') as string;
      const data = await getPairList(api, { network });
      
      const pairList = await Promise.all(data.map(async (item: any) => {
        const pairAddress = item.eventData.pair;
        try {
          const property = await getPairProperty(api, { network, pairAddress });
          return {
            address: pairAddress,
            shortAddress: pairAddress.slice(0, 10) + '...',
            token0: property.token0,
            token1: property.token1,
            isWeth: property.token0 === globalState.hardhat_weth_address || 
                    property.token1 === globalState.hardhat_weth_address,
          };
        } catch {
          return {
            address: pairAddress,
            shortAddress: pairAddress.slice(0, 10) + '...',
            token0: '',
            token1: '',
            isWeth: false,
          };
        }
      }));
      
      setPairs(pairList);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        setPairs([]);
      }
    }
  };

  // Fetch all pairs data - display each pair as scatter chart (x: reserve0, y: reserve1)
  const fetchAllPairsData = async () => {
    setLoading(true);
    try {
      const network = localStorage.getItem('network') as string;
      console.log('Fetching all pairs data for network:', network);
      const data = await getPairsCurrentReserve(api, { network });
      console.log('Received data:', data);
      
      if (!data || data.length === 0) {
        console.log('No data received');
        setChartData([]);
        setScatterData([]);
        setPriceInfo(null);
        setLoading(false);
        return;
      }
      
      // Create color palette for scatter points
      const colors = createColorPalette(data.length);
      
      // Prepare scatter data (x: reserve0, y: reserve1) and time-series data
      const scatterPoints: { x: number; y: number; label: string; color: string }[] = [];
      const chartPoints: { time: number; value: number }[] = [];
      const pairAddresses: string[] = [];
      let baseTime = Math.floor(Date.now() / 1000) - data.length * 3600;
      let totalReserve0 = 0;
      let totalReserve1 = 0;
      
      for (let i = 0; i < data.length; i++) {
        const reserve0 = Number(data[i].eventData.reserve0);
        const reserve1 = Number(data[i].eventData.reserve1);
        const pairAddress = data[i].pair || data[i].eventData?.pair || `Pair ${i + 1}`;
        
        totalReserve0 += reserve0;
        totalReserve1 += reserve1;
        pairAddresses.push(pairAddress);
        
        // Scatter point: x = reserve0, y = reserve1
        scatterPoints.push({
          x: reserve0,
          y: reserve1,
          label: pairAddress.slice(0, 8) + '...',
          color: colors[i % colors.length],
        });
        
        // Time-series data for Line/Area charts (index as time)
        chartPoints.push({
          time: baseTime + i * 3600,
          value: reserve0, // Display reserve0 value
        });
      }
      
      console.log('Scatter points:', scatterPoints);
      console.log('Chart points:', chartPoints);
      setScatterData(scatterPoints);
      setChartData(chartPoints);
      
      // Display All Pairs as scatter chart by default
      setChartStyle('scatter');
      
      // Draw scatter chart after state update
      setTimeout(() => drawScatterChart(), 50);
      
      // Display total statistics
      setPriceInfo({
        current: totalReserve0.toLocaleString(),
        change: '0',
        high: Math.max(...chartPoints.map(p => p.value)).toLocaleString(),
        low: Math.min(...chartPoints.map(p => p.value)).toLocaleString(),
        volume: data.length,
        totalReserve0: totalReserve0.toLocaleString(),
        totalReserve1: totalReserve1.toLocaleString(),
      });
      
      // Fetch events for all pairs using extracted addresses
      await fetchAllPairsEvents(pairAddresses);
    } catch (err) {
      console.error('Error fetching all pairs data:', err);
      setChartData([]);
      setScatterData([]);
      setPriceInfo(null);
    }
    setLoading(false);
  };
  
  // Fetch events for all pairs
  const fetchAllPairsEvents = async (pairAddresses?: string[]) => {
    try {
      const network = localStorage.getItem('network') as string;
      
      // Use provided pair addresses or fallback to pairs() state
      let addressList = pairAddresses;
      if (!addressList || addressList.length === 0) {
        const pairList = pairs();
        if (pairList.length === 0) {
          console.log('No pairs available for fetching events');
          return;
        }
        addressList = pairList.map(p => p.address);
      }
      
      const allEvents: any[] = [];
      
      // Fetch events from first 5 pairs to avoid too many requests
      const pairsToFetch = addressList.slice(0, 5);
      
      for (const pairAddress of pairsToFetch) {
        try {
          const events = await getPairEventAll(api, { network, pairAddress });
          if (events && Array.isArray(events)) {
            allEvents.push(...events.slice(0, 10).map((item: any) => ({
              type: item.event.toLowerCase(),
              pair: pairAddress.slice(0, 10) + '...',
              fullPair: pairAddress,
              time: item.blockNumber ? `Block ${item.blockNumber}` : new Date().toLocaleTimeString(),
              data: item.eventData,
              blockNumber: item.blockNumber,
            })));
          }
        } catch (err) {
          console.log('Error fetching events for pair:', pairAddress);
        }
      }
      
      // Sort by block number (newest first)
      allEvents.sort((a, b) => (b.blockNumber || 0) - (a.blockNumber || 0));
      console.log('Fetched all pairs events:', allEvents.length);
      setEvents(allEvents.slice(0, 50));
    } catch (err) {
      console.error('Error fetching all pairs events:', err);
      setEvents([]);
    }
  };

  // Fetch single pair data
  const fetchPairData = async (pairAddress: string) => {
    if (!pairAddress) return;
    
    setLoading(true);
    try {
      const network = localStorage.getItem('network') as string;
      const data = await getPairReserveAll(api, { network, pairAddress });
      
      const chartPoints: any[] = [];
      let baseTime = Math.floor(Date.now() / 1000) - data.length * 3600;
      
      for (let i = 1; i < data.length; i++) {
        const reserve0 = Number(data[i].eventData.reserve0);
        const reserve1 = Number(data[i].eventData.reserve1);
        const value = reserve1 > 0 ? reserve0 / reserve1 : 0;
        
        chartPoints.push({
          time: baseTime + i * 3600,
          value: value,
        });
      }
      
      setChartData(chartPoints);
      updateChartData(chartPoints);
      
      if (chartPoints.length > 0) {
        const lastValue = chartPoints[chartPoints.length - 1].value;
        const firstValue = chartPoints[0].value;
        const change = firstValue > 0 ? ((lastValue - firstValue) / firstValue) * 100 : 0;
        
        setPriceInfo({
          current: lastValue.toFixed(4),
          change: change.toFixed(2),
          high: Math.max(...chartPoints.map(p => p.value)).toFixed(4),
          low: Math.min(...chartPoints.map(p => p.value)).toFixed(4),
          volume: data.length,
        });
      }
      
      // Fetch events for this pair
      await fetchPairEvents(pairAddress);
    } catch (err) {
      setChartData([]);
      setPriceInfo(null);
    }
    setLoading(false);
  };
  
  // Fetch events for a single pair
  const fetchPairEvents = async (pairAddress: string) => {
    try {
      const network = localStorage.getItem('network') as string;
      const data = await getPairEventAll(api, { network, pairAddress });
      
      if (data && Array.isArray(data)) {
        const eventList = data.slice(0, 50).map((item: any) => ({
          type: item.event.toLowerCase(),
          pair: pairAddress.slice(0, 10) + '...',
          fullPair: pairAddress,
          time: item.blockNumber ? `Block ${item.blockNumber}` : new Date().toLocaleTimeString(),
          data: item.eventData,
          blockNumber: item.blockNumber,
        }));
        setEvents(eventList);
      } else {
        setEvents([]);
      }
    } catch (err) {
      console.error('Error fetching pair events:', err);
      setEvents([]);
    }
  };

  // Fetch my pairs data
  const fetchMyPairsData = async () => {
    setLoading(true);
    try {
      const network = localStorage.getItem('network') as string;
      const address = localStorage.getItem('address') as string;
      
      if (!address || address === 'null') {
        setChartData([]);
        setPriceInfo(null);
        setLoading(false);
        return;
      }
      
      const data = await getClientPairsEvent(api, { network, userAddress: address });
      
      // Process events for chart
      const balanceMap = new Map<string, number>();
      let baseTime = Math.floor(Date.now() / 1000) - data.length * 3600;
      
      for (let i = 0; i < data.length; i++) {
        if (data[i].event === 'Transfer') {
          const pair = data[i].pair;
          const value = Number(data[i].eventData.value) / Math.pow(10, 18);
          const current = balanceMap.get(pair) || 0;
          
          if (data[i].eventData.to === address) {
            balanceMap.set(pair, current + value);
          } else {
            balanceMap.set(pair, current - value);
          }
        }
      }
      
      const chartPoints: any[] = [];
      let i = 0;
      for (const [, value] of balanceMap) {
        chartPoints.push({
          time: baseTime + i * 3600,
          value: Math.abs(value),
        });
        i++;
      }
      
      setChartData(chartPoints);
      
      // Use bar style for my pairs
      setChartStyle('bar');
      updateChartData(chartPoints, 'bar');
      
      // Set events
      const eventList = data.slice(0, 50).map((item: any) => ({
        type: item.event.toLowerCase(),
        pair: item.pair.slice(0, 10) + '...',
        fullPair: item.pair,
        time: new Date().toLocaleTimeString(),
        data: item.eventData,
      }));
      setEvents(eventList);
      
    } catch (err) {
      setChartData([]);
      setEvents([]);
    }
    setLoading(false);
  };

  // Handle chart type change
  const handleChartTypeChange = (type: ChartType) => {
    setChartType(type);
    setSelectedPair('');
    setChartData([]);
    setScatterData([]);
    setEvents([]);
    setPriceInfo(null);
    
    // Remove existing series
    if (series && chart) {
      chart.removeSeries(series);
      series = null;
    }
    
    if (type === 'all') {
      fetchAllPairsData();
    } else if (type === 'one-pair') {
      setChartStyle('line');
      // Let user select pair manually (no auto selection)
    } else if (type === 'my-pair') {
      setChartStyle('line');
      fetchMyPairsData();
    }
  };

  // Handle pair selection (toggle)
  const handlePairSelect = (pairAddress: string) => {
    if (selectedPair() === pairAddress) {
      // Deselect if clicking the same pair again
      setSelectedPair('');
      if (chartType() === 'one-pair') {
        setChartData([]);
        setPriceInfo(null);
        if (series && chart) {
          chart.removeSeries(series);
          series = null;
        }
      }
    } else {
      setSelectedPair(pairAddress);
      if (chartType() === 'one-pair') {
        fetchPairData(pairAddress);
      }
    }
  };

  // Handle chart style change
  const handleStyleChange = (style: ChartStyle) => {
    setChartStyle(style);
    
    if (chartType() === 'all' && style === 'scatter') {
      // Draw scatter chart on canvas
      setTimeout(() => drawScatterChart(), 50);
    } else {
      // Draw on lightweight-charts
      updateChartData(chartData(), style);
    }
  };

  // Effects
  createEffect(() => {
    if (params.id === undefined) {
      setIsNetwork(false);
      setIsSupportedNetwork(false);
    } else {
      setIsNetwork(true);
      
      // Check if network is hardhat (only supported network for now)
      const network = localStorage.getItem('network');
      if (network !== 'hardhat') {
        setIsSupportedNetwork(false);
        setLoading(false);
        return;
      }
      
      setIsSupportedNetwork(true);
      // Initialize chart after DOM is ready
      setTimeout(() => {
        initChart();
        fetchPairs();
        fetchAllPairsData();
      }, 100);
    }
  });
  
  // Redraw scatter chart when scatterData changes
  createEffect(() => {
    const data = scatterData();
    if (data.length > 0 && chartType() === 'all' && chartStyle() === 'scatter') {
      setTimeout(() => drawScatterChart(), 50);
    }
  });

  // Handle window resize for scatter chart
  onMount(() => {
    const handleResize = () => {
      if (chartType() === 'all' && chartStyle() === 'scatter' && scatterData().length > 0) {
        drawScatterChart();
      }
    };
    window.addEventListener('resize', handleResize);
    onCleanup(() => window.removeEventListener('resize', handleResize));
  });

  onCleanup(() => {
    if (chart) {
      chart.remove();
      chart = null;
    }
  });

  return (
    <div class="chart-page-container">
      <DexHeader />
      
      <Show when={!isNetwork()}>
        <div class="chart-empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h4>Network Not Selected</h4>
          <p>Please select a network to view chart data</p>
        </div>
      </Show>

      <Show when={isNetwork() && !isSupportedNetwork()}>
        <div class="unsupported-network-container">
          {/* Background Animation */}
          <div class="unsupported-bg-animation">
            <svg class="floating-icon float-1" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <svg class="floating-icon float-2" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
            <svg class="floating-icon float-3" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg class="floating-icon float-4" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>

          {/* Content */}
          <div class="unsupported-content">
            {/* Icon */}
            <div class="unsupported-icon">
              <div class="unsupported-icon-inner">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </div>
              <div class="unsupported-icon-pulse"></div>
            </div>

            {/* Title */}
            <h1 class="unsupported-title">Unsupported Network</h1>
            <p class="unsupported-subtitle">This network is not available for charts</p>

            {/* Description */}
            <p class="unsupported-description">
              Chart functionality is currently only available on Hardhat network.
              Please switch your network to access real-time liquidity pool analytics.
            </p>

            {/* Supported Networks */}
            <div class="supported-networks">
              <span class="supported-networks-label">Supported Networks</span>
              <div class="network-badges">
                <div class="network-badge">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                  Hardhat
                </div>
              </div>
            </div>
          </div>
        </div>
      </Show>

      <Show when={isNetwork() && isSupportedNetwork()}>
        {/* Header */}
        <div class="chart-header">
          <div class="chart-header-content">
            <div class="chart-title-section">
              <h1 class="chart-title">Trading Charts</h1>
              <p class="chart-subtitle">Real-time liquidity pool analytics</p>
            </div>
            
            <div class="chart-tabs">
              <button 
                class={`chart-tab ${chartType() === 'all' ? 'active' : ''}`}
                onClick={() => handleChartTypeChange('all')}
              >
                All Pairs
              </button>
              <button 
                class={`chart-tab ${chartType() === 'one-pair' ? 'active' : ''}`}
                onClick={() => handleChartTypeChange('one-pair')}
              >
                Single Pair
              </button>
              <button 
                class={`chart-tab ${chartType() === 'my-pair' ? 'active' : ''}`}
                onClick={() => handleChartTypeChange('my-pair')}
              >
                My Pairs
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div class="chart-main-content">
          {/* Chart Area */}
          <div class="chart-area">
            <div class="chart-area-header">
              <div class="chart-area-title">
                <h3>
                  {chartType() === 'all' ? 'All Pairs Overview' : 
                   chartType() === 'one-pair' ? 'Pair Reserve Ratio' : 
                   'My LP Token Balance'}
                </h3>
                <Show when={selectedPair()}>
                  <span class="chart-pair-badge">{selectedPair().slice(0, 10)}...</span>
                </Show>
              </div>
              
              <div class="chart-controls">
                {/* Scatter button only for All Pairs */}
                <Show when={chartType() === 'all'}>
                  <button 
                    class={`chart-control-btn ${chartStyle() === 'scatter' ? 'active' : ''}`}
                    onClick={() => handleStyleChange('scatter')}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="5" cy="12" r="2" />
                      <circle cx="12" cy="6" r="2" />
                      <circle cx="12" cy="18" r="2" />
                      <circle cx="19" cy="10" r="2" />
                    </svg>
                    Scatter
                  </button>
                </Show>
                <button 
                  class={`chart-control-btn ${chartStyle() === 'line' ? 'active' : ''}`}
                  onClick={() => handleStyleChange('line')}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 12h4l3-9 4 18 3-9h4" />
                  </svg>
                  Line
                </button>
                <button 
                  class={`chart-control-btn ${chartStyle() === 'area' ? 'active' : ''}`}
                  onClick={() => handleStyleChange('area')}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 3v18h18" />
                    <path d="M3 12l5-4 4 4 5-6 4 4" />
                  </svg>
                  Area
                </button>
                {/* Bar button only for My Pairs (not suitable for All Pairs due to time-based x-axis) */}
                <Show when={chartType() !== 'all'}>
                  <button 
                    class={`chart-control-btn ${chartStyle() === 'bar' ? 'active' : ''}`}
                    onClick={() => handleStyleChange('bar')}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="10" width="4" height="10" />
                      <rect x="10" y="6" width="4" height="14" />
                      <rect x="17" y="2" width="4" height="18" />
                    </svg>
                    Bar
                  </button>
                </Show>
              </div>
            </div>

            {/* Price Info */}
            <Show when={priceInfo() && !loading()}>
              <div class="price-info">
                <Show when={chartType() === 'all'}>
                  <div class="price-main">
                    <span class="price-value">Total Pairs: {priceInfo()?.volume}</span>
                  </div>
                  <div class="price-stats">
                    <div class="price-stat">
                      <span class="price-stat-label">Total Reserve0</span>
                      <span class="price-stat-value">{priceInfo()?.totalReserve0}</span>
                    </div>
                    <div class="price-stat">
                      <span class="price-stat-label">Total Reserve1</span>
                      <span class="price-stat-value">{priceInfo()?.totalReserve1}</span>
                    </div>
                    <div class="price-stat">
                      <span class="price-stat-label">Max Reserve</span>
                      <span class="price-stat-value">{priceInfo()?.high}</span>
                    </div>
                  </div>
                </Show>
                <Show when={chartType() !== 'all'}>
                  <div class="price-main">
                    <span class="price-value">{priceInfo()?.current}</span>
                    <span class={`price-change ${Number(priceInfo()?.change) >= 0 ? 'positive' : 'negative'}`}>
                      {Number(priceInfo()?.change) >= 0 ? '▲' : '▼'} {Math.abs(Number(priceInfo()?.change))}%
                    </span>
                  </div>
                  <div class="price-stats">
                    <div class="price-stat">
                      <span class="price-stat-label">High</span>
                      <span class="price-stat-value">{priceInfo()?.high}</span>
                    </div>
                    <div class="price-stat">
                      <span class="price-stat-label">Low</span>
                      <span class="price-stat-value">{priceInfo()?.low}</span>
                    </div>
                    <div class="price-stat">
                      <span class="price-stat-label">Events</span>
                      <span class="price-stat-value">{priceInfo()?.volume}</span>
                    </div>
                  </div>
                </Show>
              </div>
            </Show>

            {/* Chart Container */}
            <div class="chart-container">
              {/* Scatter Canvas for All Pairs */}
              <Show when={chartType() === 'all' && chartStyle() === 'scatter'}>
                <canvas 
                  ref={scatterCanvasRef} 
                  style={{ width: '100%', height: '100%', display: 'block' }}
                />
              </Show>
              
              {/* Lightweight Charts for other chart types */}
              <div 
                ref={chartContainerRef}
                style={{ 
                  width: '100%', 
                  height: '100%',
                  display: chartType() === 'all' && chartStyle() === 'scatter' ? 'none' : 'block'
                }}
              />
              
              <Show when={loading()}>
                <div class="chart-loading">
                  <div class="chart-loading-spinner"></div>
                  <span class="chart-loading-text">Loading chart data...</span>
                </div>
              </Show>
              
              <Show when={!loading() && chartData().length === 0 && scatterData().length === 0}>
                <div class="chart-empty-state">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M3 3v18h18" />
                    <path d="M3 12l5-4 4 4 5-6 4 4" />
                  </svg>
                  <h4>No Data Available</h4>
                  <p>
                    {chartType() === 'one-pair' ? 'Select a pair to view its chart' :
                     chartType() === 'my-pair' ? 'No LP tokens found for your account' :
                     'No pair data available for this network'}
                  </p>
                </div>
              </Show>
            </div>

            {/* Legend */}
            <Show when={chartData().length > 0 && !loading()}>
              <div class="chart-legend">
                <div class="legend-item">
                  <span class="legend-color" style={{ background: '#f0b90b' }}></span>
                  <span>Reserve Ratio (Token0/Token1)</span>
                </div>
              </div>
            </Show>
          </div>

          {/* Sidebar */}
          <div class="chart-sidebar">
            {/* Pair List */}
            <div class="sidebar-card">
              <div class="sidebar-card-header">
                <h4>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                  Pairs
                  <span class="count-badge">{pairs().length}</span>
                </h4>
              </div>
              <div class="sidebar-card-body">
                <Show when={pairs().length === 0}>
                  <div class="chart-empty-state" style={{ padding: '1.5rem' }}>
                    <p style={{ margin: 0 }}>No pairs available</p>
                  </div>
                </Show>
                <div class="pair-list">
                  <For each={pairs()}>
                    {(pair) => (
                      <button 
                        class={`pair-item ${selectedPair() === pair.address ? 'active' : ''}`}
                        onClick={() => handlePairSelect(pair.address)}
                      >
                        <div class="pair-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M8 12h8M12 8v8" />
                          </svg>
                        </div>
                        <div class="pair-info">
                          <div class="pair-address">{pair.shortAddress}</div>
                          <div class="pair-tokens">
                            {pair.isWeth ? 'WETH Pair' : 'Token Pair'}
                          </div>
                        </div>
                      </button>
                    )}
                  </For>
                </div>
              </div>
            </div>

            {/* Event Filter */}
            <div class="sidebar-card">
              <div class="sidebar-card-header">
                <h4>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                  Events
                </h4>
              </div>
              <div class="event-filter">
                <button 
                  class={`event-btn ${selectedEvent() === 'all' ? 'active' : ''}`}
                  onClick={() => setSelectedEvent('all')}
                >
                  All
                </button>
                <button 
                  class={`event-btn mint ${selectedEvent() === 'mint' ? 'active' : ''}`}
                  onClick={() => setSelectedEvent('mint')}
                >
                  Mint
                </button>
                <button 
                  class={`event-btn burn ${selectedEvent() === 'burn' ? 'active' : ''}`}
                  onClick={() => setSelectedEvent('burn')}
                >
                  Burn
                </button>
                <button 
                  class={`event-btn swap ${selectedEvent() === 'swap' ? 'active' : ''}`}
                  onClick={() => setSelectedEvent('swap')}
                >
                  Swap
                </button>
                <button 
                  class={`event-btn transfer ${selectedEvent() === 'transfer' ? 'active' : ''}`}
                  onClick={() => setSelectedEvent('transfer')}
                >
                  Transfer
                </button>
              </div>
              <div class="sidebar-card-body">
                <Show when={events().length === 0}>
                  <div class="chart-empty-state" style={{ padding: '1.5rem' }}>
                    <p style={{ margin: 0 }}>No events yet</p>
                  </div>
                </Show>
                <div class="event-list">
                  <For each={events().filter(e => selectedEvent() === 'all' || e.type === selectedEvent())}>
                    {(event) => (
                      <div 
                        class="event-item clickable"
                        onClick={() => {
                          setSelectedEventDetail(event);
                          setShowEventModal(true);
                        }}
                      >
                        <span class={`event-type-badge ${event.type}`}>{event.type}</span>
                        <div class="event-details">
                          <div class="event-pair">{event.pair}</div>
                          <div class="event-time">{event.time}</div>
                        </div>
                        <svg class="event-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M9 18l6-6-6-6" />
                        </svg>
                      </div>
                    )}
                  </For>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Show>
      
      {/* Event Detail Modal */}
      <Show when={showEventModal() && selectedEventDetail()}>
        <div class="event-modal-overlay" onClick={() => setShowEventModal(false)}>
          <div class="event-modal" onClick={(e) => e.stopPropagation()}>
            <div class="event-modal-header">
              <h3>
                <span class={`event-type-badge ${selectedEventDetail()?.type}`}>
                  {selectedEventDetail()?.type?.toUpperCase()}
                </span>
                Event Details
              </h3>
              <button class="event-modal-close" onClick={() => setShowEventModal(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="event-modal-body">
              <div class="event-modal-row">
                <span class="event-modal-label">Pair Address</span>
                <span class="event-modal-value monospace">{selectedEventDetail()?.fullPair}</span>
              </div>
              <div class="event-modal-row">
                <span class="event-modal-label">Time / Block</span>
                <span class="event-modal-value">{selectedEventDetail()?.time}</span>
              </div>
              
              {/* Event-specific data */}
              <Show when={selectedEventDetail()?.data}>
                <div class="event-modal-section">
                  <h4>Event Data</h4>
                  <For each={Object.entries(selectedEventDetail()?.data || {})}>
                    {([key, value]) => (
                      <div class="event-modal-row">
                        <span class="event-modal-label">{key}</span>
                        <span class="event-modal-value monospace">
                          {typeof value === 'string' && value.length > 20 
                            ? value.slice(0, 10) + '...' + value.slice(-8)
                            : String(value)}
                        </span>
                      </div>
                    )}
                  </For>
                </div>
              </Show>
              
              {/* Formatted values for specific event types */}
              <Show when={selectedEventDetail()?.type === 'mint' && selectedEventDetail()?.data}>
                <div class="event-modal-section">
                  <h4>Mint Details</h4>
                  <div class="event-modal-row">
                    <span class="event-modal-label">Amount0</span>
                    <span class="event-modal-value highlight">
                      {(Number(selectedEventDetail()?.data?.amount0 || 0) / 1e18).toFixed(6)}
                    </span>
                  </div>
                  <div class="event-modal-row">
                    <span class="event-modal-label">Amount1</span>
                    <span class="event-modal-value highlight">
                      {(Number(selectedEventDetail()?.data?.amount1 || 0) / 1e18).toFixed(6)}
                    </span>
                  </div>
                </div>
              </Show>
              
              <Show when={selectedEventDetail()?.type === 'burn' && selectedEventDetail()?.data}>
                <div class="event-modal-section">
                  <h4>Burn Details</h4>
                  <div class="event-modal-row">
                    <span class="event-modal-label">Amount0</span>
                    <span class="event-modal-value highlight red">
                      {(Number(selectedEventDetail()?.data?.amount0 || 0) / 1e18).toFixed(6)}
                    </span>
                  </div>
                  <div class="event-modal-row">
                    <span class="event-modal-label">Amount1</span>
                    <span class="event-modal-value highlight red">
                      {(Number(selectedEventDetail()?.data?.amount1 || 0) / 1e18).toFixed(6)}
                    </span>
                  </div>
                </div>
              </Show>
              
              <Show when={selectedEventDetail()?.type === 'swap' && selectedEventDetail()?.data}>
                <div class="event-modal-section">
                  <h4>Swap Details</h4>
                  <div class="event-modal-row">
                    <span class="event-modal-label">Amount0 In</span>
                    <span class="event-modal-value">
                      {(Number(selectedEventDetail()?.data?.amount0In || 0) / 1e18).toFixed(6)}
                    </span>
                  </div>
                  <div class="event-modal-row">
                    <span class="event-modal-label">Amount1 In</span>
                    <span class="event-modal-value">
                      {(Number(selectedEventDetail()?.data?.amount1In || 0) / 1e18).toFixed(6)}
                    </span>
                  </div>
                  <div class="event-modal-row">
                    <span class="event-modal-label">Amount0 Out</span>
                    <span class="event-modal-value">
                      {(Number(selectedEventDetail()?.data?.amount0Out || 0) / 1e18).toFixed(6)}
                    </span>
                  </div>
                  <div class="event-modal-row">
                    <span class="event-modal-label">Amount1 Out</span>
                    <span class="event-modal-value">
                      {(Number(selectedEventDetail()?.data?.amount1Out || 0) / 1e18).toFixed(6)}
                    </span>
                  </div>
                </div>
              </Show>
              
              <Show when={selectedEventDetail()?.type === 'transfer' && selectedEventDetail()?.data}>
                <div class="event-modal-section">
                  <h4>Transfer Details</h4>
                  <div class="event-modal-row">
                    <span class="event-modal-label">From</span>
                    <span class="event-modal-value monospace">
                      {selectedEventDetail()?.data?.from}
                    </span>
                  </div>
                  <div class="event-modal-row">
                    <span class="event-modal-label">To</span>
                    <span class="event-modal-value monospace">
                      {selectedEventDetail()?.data?.to}
                    </span>
                  </div>
                  <div class="event-modal-row">
                    <span class="event-modal-label">Value</span>
                    <span class="event-modal-value highlight">
                      {(Number(selectedEventDetail()?.data?.value || 0) / 1e18).toFixed(6)} LP
                    </span>
                  </div>
                </div>
              </Show>
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
};

export default DexChartIndex;
