import { type Component, type JSX } from 'solid-js';
import { createSignal, createEffect, onMount, onCleanup, Show, For } from 'solid-js';
import { useParams } from '@solidjs/router';
import { DexHeader } from './layout/DexHeader';
import { createChart, ColorType, CrosshairMode, LineStyle, LineSeries, CandlestickSeries, HistogramSeries, AreaSeries, type IChartApi, type ISeriesApi } from 'lightweight-charts';
import chroma from 'chroma-js';
import { getPairList, getPairProperty, getPairReserveAll, getPairsCurrentReserve } from './axios/Dex.axios.pair';
import { getClientPairsEvent } from './axios/Dex.axios.client';
import { globalState } from '../global/constants';
import axios from 'axios';
import '../chart/Chart.css';

const api = globalState.api_url;

// Chart types
type ChartType = 'all' | 'one-pair' | 'my-pair';
type ChartStyle = 'line' | 'area' | 'candlestick' | 'bar';

// Color palette using chroma-js
const createColorPalette = (count: number) => {
  return chroma.scale(['#f0b90b', '#0ecb81', '#1e90ff', '#f6465d', '#9b59b6']).mode('lab').colors(count);
};

const DexChartIndex: Component = (): JSX.Element => {
  const params = useParams();
  
  // State
  const [isNetwork, setIsNetwork] = createSignal(false);
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
  
  // Chart refs
  let chartContainerRef: HTMLDivElement | undefined;
  let chart: IChartApi | null = null;
  let series: ISeriesApi<any> | null = null;

  // Initialize chart
  const initChart = () => {
    if (!chartContainerRef) return;
    
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

  // Update chart data
  const updateChartData = (data: any[]) => {
    if (!chart) return;

    // Remove existing series
    if (series) {
      chart.removeSeries(series);
      series = null;
    }

    if (data.length === 0) return;

    const style = chartStyle();
    const colors = createColorPalette(data.length);

    if (style === 'line') {
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

  // Fetch all pairs data
  const fetchAllPairsData = async () => {
    setLoading(true);
    try {
      const network = localStorage.getItem('network') as string;
      const data = await getPairsCurrentReserve(api, { network });
      
      const chartPoints: any[] = [];
      let baseTime = Math.floor(Date.now() / 1000) - data.length * 3600;
      
      for (let i = 0; i < data.length; i++) {
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
    } catch (err) {
      setChartData([]);
      setPriceInfo(null);
    }
    setLoading(false);
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
    } catch (err) {
      setChartData([]);
      setPriceInfo(null);
    }
    setLoading(false);
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
      updateChartData(chartPoints);
      
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
    
    if (type === 'all') {
      setChartStyle('line');
      fetchAllPairsData();
    } else if (type === 'one-pair') {
      setChartStyle('line');
      if (pairs().length > 0) {
        setSelectedPair(pairs()[0].address);
        fetchPairData(pairs()[0].address);
      }
    } else if (type === 'my-pair') {
      fetchMyPairsData();
    }
  };

  // Handle pair selection
  const handlePairSelect = (pairAddress: string) => {
    setSelectedPair(pairAddress);
    if (chartType() === 'one-pair') {
      fetchPairData(pairAddress);
    }
  };

  // Handle chart style change
  const handleStyleChange = (style: ChartStyle) => {
    setChartStyle(style);
    updateChartData(chartData());
  };

  // Effects
  createEffect(() => {
    if (params.id === undefined) {
      setIsNetwork(false);
    } else {
      setIsNetwork(true);
    }
  });

  onMount(() => {
    if (params.id !== undefined) {
      setIsNetwork(true);
      initChart();
      fetchPairs();
      fetchAllPairsData();
    }
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

      <Show when={isNetwork()}>
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
              </div>
            </div>

            {/* Price Info */}
            <Show when={priceInfo() && !loading()}>
              <div class="price-info">
                <div class="price-main">
                  <span class="price-value">{priceInfo()?.current}</span>
                  <span class={`price-change ${Number(priceInfo()?.change) >= 0 ? 'positive' : 'negative'}`}>
                    {Number(priceInfo()?.change) >= 0 ? '▲' : '▼'} {Math.abs(Number(priceInfo()?.change))}%
                  </span>
                </div>
                <div class="price-stats">
                  <div class="price-stat">
                    <span class="price-stat-label">24h High</span>
                    <span class="price-stat-value">{priceInfo()?.high}</span>
                  </div>
                  <div class="price-stat">
                    <span class="price-stat-label">24h Low</span>
                    <span class="price-stat-value">{priceInfo()?.low}</span>
                  </div>
                  <div class="price-stat">
                    <span class="price-stat-label">Events</span>
                    <span class="price-stat-value">{priceInfo()?.volume}</span>
                  </div>
                </div>
              </div>
            </Show>

            {/* Chart Container */}
            <div class="chart-container" ref={chartContainerRef}>
              <Show when={loading()}>
                <div class="chart-loading">
                  <div class="chart-loading-spinner"></div>
                  <span class="chart-loading-text">Loading chart data...</span>
                </div>
              </Show>
              
              <Show when={!loading() && chartData().length === 0}>
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
                      <div class="event-item">
                        <span class={`event-type-badge ${event.type}`}>{event.type}</span>
                        <div class="event-details">
                          <div class="event-pair">{event.pair}</div>
                          <div class="event-time">{event.time}</div>
                        </div>
                      </div>
                    )}
                  </For>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
};

export default DexChartIndex;
