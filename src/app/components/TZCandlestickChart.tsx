import { ResponsiveContainer, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Bar } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

interface TZCandlestickChartProps {
  data: Array<{
    time: string;
    value: number;
    timestamp: number;
    fullTime?: string;
  }>;
  height?: number;
}

// دالة لتوليد بيانات OHLC من قيمة واحدة
function generateOHLCFromValue(value: number, index: number) {
  // نضيف تذبذب واقعي للشموع - زيادة التذبذب لشموع أطول
  const volatility = Math.abs(value) * 0.08; // 8% تذبذب لشموع أطول
  
  // إنشاء فرق أكبر بين Open و Close
  const openOffset = (Math.random() - 0.5) * volatility * 1.5;
  const closeOffset = (Math.random() - 0.5) * volatility * 1.5;
  
  const open = value + openOffset;
  const close = value + closeOffset;
  
  // فتائل أطول
  const wickLength = volatility * (0.5 + Math.random() * 0.8); // فتائل بطول 50%-130% من التذبذب
  const high = Math.max(open, close) + wickLength;
  const low = Math.min(open, close) - wickLength;
  
  return {
    open: parseFloat(open.toFixed(2)),
    high: parseFloat(high.toFixed(2)),
    low: parseFloat(low.toFixed(2)),
    close: parseFloat(close.toFixed(2)),
  };
}

export function TZCandlestickChart({ data, height = 400 }: TZCandlestickChartProps) {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const isDark = theme === 'dark';
  const isRTL = language === 'ar';

  // تحويل البيانات لصيغة الشموع
  const candlestickData = data.map((item, index) => {
    const ohlc = generateOHLCFromValue(item.value, index);
    const isGreen = ohlc.close > ohlc.open;
    
    return {
      time: item.time,
      fullTime: item.fullTime || item.time,
      timestamp: item.timestamp,
      ...ohlc,
      value: item.value,
      range: [ohlc.low, ohlc.high],
      body: [Math.min(ohlc.open, ohlc.close), Math.max(ohlc.open, ohlc.close)],
      isGreen,
    };
  });

  // Custom Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      return (
        <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-3 rounded-lg border-2 shadow-xl`}>
          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
            📅 {data.fullTime}
          </p>
          <div className="space-y-1">
            <p className={`text-xs font-semibold ${data.isGreen ? 'text-green-500' : 'text-red-500'}`}>
              🕯️ {data.isGreen ? (isRTL ? 'صاعد ↑' : 'Bullish ↑') : (isRTL ? 'هابط ↓' : 'Bearish ↓')}
            </p>
            <div className={`grid grid-cols-2 gap-2 mt-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <div>
                <p className="text-xs opacity-70">{isRTL ? 'افتتاح' : 'Open'}</p>
                <p className="text-sm font-bold">{data.open.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs opacity-70">{isRTL ? 'إغلاق' : 'Close'}</p>
                <p className="text-sm font-bold">{data.close.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-green-500">{isRTL ? 'أعلى' : 'High'}</p>
                <p className="text-sm font-bold text-green-500">{data.high.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-red-500">{isRTL ? 'أدنى' : 'Low'}</p>
                <p className="text-sm font-bold text-red-500">{data.low.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Candlestick Shape
  const CandlestickShape = (props: any) => {
    const { x, y, width, height, payload } = props;
    
    if (!payload || width <= 0) return null;
    
    const { open, high, low, close } = payload;
    const isGreen = close > open;
    const color = isGreen ? '#10b981' : '#ef4444';
    
    // حساب المقياس
    const dataRange = Math.max(...candlestickData.map(d => d.high)) - Math.min(...candlestickData.map(d => d.low));
    const minValue = Math.min(...candlestickData.map(d => d.low));
    const scale = height / dataRange;
    
    // حساب المواضع
    const highY = (Math.max(...candlestickData.map(d => d.high)) - high) * scale;
    const lowY = (Math.max(...candlestickData.map(d => d.high)) - low) * scale;
    const openY = (Math.max(...candlestickData.map(d => d.high)) - open) * scale;
    const closeY = (Math.max(...candlestickData.map(d => d.high)) - close) * scale;
    
    const bodyTop = Math.min(openY, closeY);
    const bodyHeight = Math.abs(closeY - openY);
    const centerX = x + width / 2;
    const bodyWidth = Math.max(width * 0.6, 2);
    
    return (
      <g>
        {/* الفتيل العلوي */}
        <line
          x1={centerX}
          y1={highY}
          x2={centerX}
          y2={bodyTop}
          stroke={color}
          strokeWidth={Math.max(width * 0.1, 1)}
        />
        
        {/* جسم الشمعة */}
        <rect
          x={centerX - bodyWidth / 2}
          y={bodyTop}
          width={bodyWidth}
          height={Math.max(bodyHeight, 1)}
          fill={color}
          stroke={color}
          strokeWidth={1}
          opacity={0.9}
        />
        
        {/* الفتيل السفلي */}
        <line
          x1={centerX}
          y1={bodyTop + bodyHeight}
          x2={centerX}
          y2={lowY}
          stroke={color}
          strokeWidth={Math.max(width * 0.1, 1)}
        />
      </g>
    );
  };

  const gridColor = isDark ? "#1f2937" : "#f3f4f6";
  const textColor = isDark ? "#9ca3af" : "#374151";

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={candlestickData} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
          <defs>
            <linearGradient id="candleBg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isDark ? "#1f2937" : "#f9fafb"} stopOpacity={0.2} />
              <stop offset="100%" stopColor={isDark ? "#111827" : "#ffffff"} stopOpacity={0} />
            </linearGradient>
          </defs>
          
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <ReferenceLine y={0} stroke={isDark ? "#6b7280" : "#9ca3af"} strokeWidth={2} strokeDasharray="5 5" />
          
          <XAxis 
            dataKey="time" 
            stroke={textColor}
            tick={{ fontSize: 10, fill: textColor }}
            interval="preserveStartEnd"
            height={50}
          />
          
          <YAxis 
            stroke={textColor} 
            tick={{ fontSize: 11, fill: textColor }}
            domain={[
              (dataMin: number) => Math.floor(dataMin * 0.98),
              (dataMax: number) => Math.ceil(dataMax * 1.02)
            ]}
          />
          
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: isDark ? '#4f46e5' : '#6366f1', strokeWidth: 1 }} />
          
          {/* استخدام Bar مع custom shape للشموع */}
          <Bar 
            dataKey="value" 
            shape={<CandlestickShape />}
            isAnimationActive={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}