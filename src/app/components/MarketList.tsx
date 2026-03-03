import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ArrowUp, DollarSign, Gem, Landmark, Bitcoin, Search, TrendingUp, Star, Flame, Sparkles, Radio, Activity, ArrowUpRight, ArrowDownRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";

export interface Asset {
  id: string;
  name: string;
  nameEn: string;
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  market: "FOREX" | "COMMODITY" | "INDEX" | "CRYPTO";
}

interface MarketListProps {
  assets: Asset[];
  selectedAsset: Asset | null;
  onSelectAsset: (asset: Asset) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const marketConfig = {
  FOREX: {
    labelAr: "العملات",
    labelEn: "Forex",
    icon: DollarSign,
    signalIcon: Radio,
    signalLabel: "مباشر",
    signalLabelEn: "Live",
    gradient: "from-blue-500 via-blue-600 to-cyan-600",
    bgLight: "bg-blue-50",
    bgDark: "bg-blue-950/30",
    textLight: "text-blue-600",
    textDark: "text-blue-400",
    borderLight: "border-blue-200",
    borderDark: "border-blue-800",
    glowColor: "rgba(59, 130, 246, 0.5)",
  },
  COMMODITY: {
    labelAr: "السلع",
    labelEn: "Commodities",
    icon: Gem,
    signalIcon: Flame,
    signalLabel: "ساخن",
    signalLabelEn: "Hot",
    gradient: "from-amber-500 via-orange-600 to-red-600",
    bgLight: "bg-amber-50",
    bgDark: "bg-amber-950/30",
    textLight: "text-amber-600",
    textDark: "text-amber-400",
    borderLight: "border-amber-200",
    borderDark: "border-amber-800",
    glowColor: "rgba(245, 158, 11, 0.5)",
  },
  INDEX: {
    labelAr: "المؤشرات",
    labelEn: "Indices",
    icon: Landmark,
    signalIcon: TrendingUp,
    signalLabel: "رائج",
    signalLabelEn: "Trending",
    gradient: "from-purple-500 via-pink-600 to-rose-600",
    bgLight: "bg-purple-50",
    bgDark: "bg-purple-950/30",
    textLight: "text-purple-600",
    textDark: "text-purple-400",
    borderLight: "border-purple-200",
    borderDark: "border-purple-800",
    glowColor: "rgba(168, 85, 247, 0.5)",
  },
  CRYPTO: {
    labelAr: "العملات الرقمية",
    labelEn: "Crypto",
    icon: Bitcoin,
    signalIcon: Sparkles,
    signalLabel: "نشط",
    signalLabelEn: "Active",
    gradient: "from-orange-500 via-yellow-500 to-amber-500",
    bgLight: "bg-orange-50",
    bgDark: "bg-orange-950/30",
    textLight: "text-orange-600",
    textDark: "text-orange-400",
    borderLight: "border-orange-200",
    borderDark: "border-orange-800",
    glowColor: "rgba(249, 115, 22, 0.5)",
  },
};

export function MarketList({ assets, selectedAsset, onSelectAsset, isCollapsed, onToggleCollapse }: MarketListProps) {
  const { theme } = useTheme();
  const { language, t } = useLanguage();
  const [activeMarket, setActiveMarket] = useState<"FOREX" | "COMMODITY" | "INDEX" | "CRYPTO">("FOREX");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const isRTL = language === "ar";
  const isDark = theme === "dark";

  const filteredAssets = assets.filter(
    (asset) =>
      asset.market === activeMarket &&
      (asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const marketStats = {
    FOREX: assets.filter((a) => a.market === "FOREX"),
    COMMODITY: assets.filter((a) => a.market === "COMMODITY"),
    INDEX: assets.filter((a) => a.market === "INDEX"),
    CRYPTO: assets.filter((a) => a.market === "CRYPTO"),
  };

  const getMarketTrend = (marketAssets: Asset[]) => {
    const positive = marketAssets.filter((a) => a.change >= 0).length;
    return ((positive / marketAssets.length) * 100).toFixed(0);
  };

  const toggleFavorite = (assetId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(assetId)) {
        newFavorites.delete(assetId);
      } else {
        newFavorites.add(assetId);
      }
      return newFavorites;
    });
  };

  const renderAssetItem = (asset: Asset) => {
    const isFavorite = favorites.has(asset.id);
    const config = marketConfig[activeMarket];
    const isPositive = asset.change >= 0;
    
    return (
      <motion.button
        key={asset.id}
        onClick={() => onSelectAsset(asset)}
        initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        transition={{ duration: 0.15 }}
        className={`relative w-full text-${isRTL ? 'right' : 'left'} p-2.5 rounded-xl transition-all overflow-hidden group ${
          selectedAsset?.id === asset.id
            ? `${isDark ? config.bgDark : config.bgLight} shadow-lg ring-2 ${isDark ? config.borderDark : config.borderLight}`
            : isDark 
              ? "bg-gray-800/60 hover:bg-gray-800 shadow-sm hover:shadow-md" 
              : "bg-white hover:bg-gray-50 shadow-sm hover:shadow-md border border-gray-100 hover:border-gray-200"
        }`}
        style={
          selectedAsset?.id === asset.id
            ? {
                boxShadow: `0 0 20px -8px ${config.glowColor}`,
              }
            : {}
        }
      >
        {/* Background Pattern */}
        <div className={`absolute inset-0 opacity-3 ${selectedAsset?.id === asset.id ? 'opacity-5' : ''}`}>
          <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient}`} />
        </div>

        {/* Compact Layout */}
        <div className="relative flex items-center justify-between gap-2">
          {/* Left Side: Name & Symbol */}
          <div className={`flex items-center gap-2 flex-1 min-w-0`}>
            {/* Pulse Indicator */}
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isPositive ? 'bg-green-500' : 'bg-red-500'}`}
            />
            
            {/* Name & Symbol */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className={`font-bold text-xs truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {isRTL ? asset.name : asset.nameEn}
                </h3>
                {isFavorite && (
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`font-mono text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  {asset.symbol}
                </span>
                <Badge 
                  variant="outline" 
                  className={`text-[9px] px-1.5 py-0 h-4 ${isDark ? config.textDark : config.textLight} ${isDark ? config.borderDark : config.borderLight}`}
                >
                  <config.signalIcon className="w-2 h-2 mr-0.5" />
                  {isRTL ? config.signalLabel : config.signalLabelEn}
                </Badge>
              </div>
            </div>
          </div>

          {/* Center: Price */}
          <div className={`flex flex-col items-end px-2 flex-shrink-0`}>
            <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {asset.market === "CRYPTO" || asset.market === "INDEX"
                ? asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                : asset.price.toFixed(4)}
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <Activity className={`w-2.5 h-2.5 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
              <span className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                {isPositive ? '+' : ''}{asset.change.toFixed(asset.market === "CRYPTO" ? 2 : 4)}
              </span>
            </div>
          </div>

          {/* Right: Change Badge */}
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`px-2 py-1 rounded-lg font-bold text-xs flex items-center gap-1 ${
                isPositive
                  ? isDark
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-green-50 text-green-700'
                  : isDark
                  ? 'bg-red-500/20 text-red-400'
                  : 'bg-red-50 text-red-700'
              }`}
            >
              {isPositive ? (
                <ArrowUpRight className="w-3 h-3" />
              ) : (
                <ArrowDownRight className="w-3 h-3" />
              )}
              {isPositive ? '+' : ''}{asset.changePercent.toFixed(2)}%
            </motion.div>
            
            {/* Mini Chart */}
            <div className="flex items-center gap-[2px]">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className={`w-[2px] rounded-full ${
                    isPositive 
                      ? 'bg-green-500/30' 
                      : 'bg-red-500/30'
                  }`}
                  style={{
                    height: `${Math.random() * 8 + 3}px`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Favorite Button - Hidden by default, shown on hover */}
          <div
            onClick={(e) => toggleFavorite(asset.id, e)}
            className={`absolute ${isRTL ? 'left-1' : 'right-1'} top-1 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-200 dark:hover:bg-gray-700/70 cursor-pointer`}
          >
            <Star
              className={`w-3 h-3 ${
                isFavorite 
                  ? "fill-yellow-400 text-yellow-400" 
                  : isDark ? "text-gray-500" : "text-gray-400"
              }`}
            />
          </div>
        </div>

        {/* Hover Effect Overlay */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-0 group-hover:opacity-3 transition-opacity pointer-events-none rounded-xl`}
        />
      </motion.button>
    );
  };

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? "80px" : "320px" }}
      transition={{ type: "spring", damping: 25, stiffness: 200, duration: 0.4 }}
      className="h-full"
    >
      <Card className={`h-full shadow-2xl overflow-hidden ${isDark ? "bg-gradient-to-b from-gray-900 to-gray-900/95 border-gray-800" : "bg-white border-gray-200"} transition-all`}>
        {!isCollapsed ? (
          <>
            <CardHeader className="pb-3 bg-gradient-to-br from-transparent to-transparent">
              <div className="flex items-center justify-between">
                <CardTitle className={`flex items-center gap-3 text-xl ${isDark ? "text-white" : "text-gray-900"}`}>
                  <motion.div 
                    className={`bg-gradient-to-br ${marketConfig[activeMarket].gradient} p-2.5 rounded-xl shadow-lg`}
                    animate={{ rotate: [0, 5, 0, -5, 0] }}
                    transition={{ duration: 5, repeat: Infinity }}
                  >
                    <Landmark className="w-5 h-5 text-white" />
                  </motion.div>
                  <div>
                    <div>{t("markets")}</div>
                    <div className={`text-xs font-normal ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                      {filteredAssets.length} {t("total")}
                    </div>
                  </div>
                </CardTitle>
                {onToggleCollapse && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onToggleCollapse}
                    className={`${isDark ? "hover:bg-gray-800" : ""}`}
                  >
                    <ChevronsLeft className={`w-4 h-4 ${isDark ? "text-gray-400" : "text-gray-600"}`} />
                  </Button>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4 px-4">
              {/* Market Tabs - Horizontal Pills */}
              <div className="grid grid-cols-4 gap-1.5 p-1.5 rounded-xl bg-gray-100 dark:bg-gray-800/50">
                {(Object.keys(marketConfig) as Array<keyof typeof marketConfig>).map((market) => {
                  const config = marketConfig[market];
                  const Icon = config.icon;
                  const isActive = activeMarket === market;

                  return (
                    <motion.button
                      key={market}
                      onClick={() => setActiveMarket(market)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative overflow-hidden p-3 rounded-lg transition-all ${
                        isActive
                          ? `bg-gradient-to-br ${config.gradient} shadow-lg`
                          : isDark 
                            ? "hover:bg-gray-700/50" 
                            : "hover:bg-white"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-1.5">
                        <Icon className={`w-5 h-5 ${isActive ? 'text-white' : isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                        <span className={`text-[10px] font-semibold ${isActive ? 'text-white' : isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                          {isRTL ? config.labelAr.split(' ')[0] : config.labelEn}
                        </span>
                      </div>
                      
                      {/* Active Indicator Dot */}
                      {isActive && (
                        <motion.div
                          layoutId="activeDot"
                          className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Market Stats Bar */}
              <motion.div
                layout
                className={`p-3 rounded-xl ${isDark ? `${marketConfig[activeMarket].bgDark}` : `${marketConfig[activeMarket].bgLight}`} border ${isDark ? marketConfig[activeMarket].borderDark : marketConfig[activeMarket].borderLight}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {(() => {
                      const SignalIcon = marketConfig[activeMarket].signalIcon;
                      return <SignalIcon className={`w-4 h-4 ${isDark ? marketConfig[activeMarket].textDark : marketConfig[activeMarket].textLight}`} />;
                    })()}
                    <span className={`text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {getMarketTrend(marketStats[activeMarket])}% {t("positive")}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                        {marketStats[activeMarket].filter((a) => a.change >= 0).length}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                        {marketStats[activeMarket].filter((a) => a.change < 0).length}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className={`mt-2 h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${getMarketTrend(marketStats[activeMarket])}%` }}
                    className={`h-full bg-gradient-to-r ${marketConfig[activeMarket].gradient}`}
                  />
                </div>
              </motion.div>

              {/* Search */}
              <div className="relative">
                <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
                <Input
                  type="text"
                  placeholder={t("searchAsset")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`${isRTL ? 'pr-10 text-right' : 'pl-10 text-left'} rounded-xl border-2 ${
                    isDark 
                      ? "bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-gray-600" 
                      : "border-gray-200 focus:border-gray-300"
                  }`}
                  dir={isRTL ? "rtl" : "ltr"}
                />
              </div>

              {/* Assets List */}
              <div className="space-y-3 max-h-[calc(100vh-520px)] overflow-y-auto pr-1 custom-scrollbar">
                <AnimatePresence mode="popLayout">
                  {filteredAssets.length > 0 ? (
                    filteredAssets.map(renderAssetItem)
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`text-center py-12 ${isDark ? "text-gray-500" : "text-gray-500"}`}
                    >
                      <Search className={`w-16 h-16 mx-auto mb-3 ${isDark ? "text-gray-700" : "text-gray-300"}`} />
                      <p className="font-semibold">{t("noResults")}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </>
        ) : (
          /* Collapsed View */
          <div className="h-full flex flex-col items-center p-3 space-y-3">
            {/* Toggle Button */}
            {onToggleCollapse && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleCollapse}
                className={`${isDark ? "hover:bg-gray-800" : ""}`}
              >
                <ChevronsRight className={`w-4 h-4 ${isDark ? "text-gray-400" : "text-gray-600"}`} />
              </Button>
            )}
            
            {/* Vertical Market Tabs */}
            <div className="flex-1 flex flex-col gap-3 items-center">
              {(Object.keys(marketConfig) as Array<keyof typeof marketConfig>).map((market) => {
                const config = marketConfig[market];
                const Icon = config.icon;
                const isActive = activeMarket === market;
                
                return (
                  <motion.button
                    key={market}
                    onClick={() => setActiveMarket(market)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                      isActive
                        ? `bg-gradient-to-br ${config.gradient} shadow-lg`
                        : isDark
                          ? "bg-gray-800 hover:bg-gray-700"
                          : "bg-gray-100 hover:bg-gray-200"
                    }`}
                    title={isRTL ? config.labelAr : config.labelEn}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                    {isActive && (
                      <motion.div
                        layoutId="activeMarketCollapsed"
                        className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-white rounded-full"
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        <style>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 5px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: ${isDark ? '#1f2937' : '#f3f4f6'};
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: ${isDark ? '#4b5563' : '#d1d5db'};
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: ${isDark ? '#6b7280' : '#9ca3af'};
          }
        `}</style>
      </Card>
    </motion.div>
  );
}