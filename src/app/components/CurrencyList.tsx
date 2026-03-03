import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ArrowUp, ArrowDown } from "lucide-react";

export interface Currency {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

interface CurrencyListProps {
  currencies: Currency[];
  selectedCurrency: Currency | null;
  onSelectCurrency: (currency: Currency) => void;
}

export function CurrencyList({ currencies, selectedCurrency, onSelectCurrency }: CurrencyListProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>أزواج العملات</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
        {currencies.map((currency) => (
          <button
            key={currency.id}
            onClick={() => onSelectCurrency(currency)}
            className={`w-full text-right p-3 rounded-lg border-2 transition-all hover:bg-slate-50 ${
              selectedCurrency?.id === currency.id
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <Badge variant={currency.change >= 0 ? "default" : "destructive"} className="text-xs">
                {currency.changePercent >= 0 ? "+" : ""}{currency.changePercent.toFixed(2)}%
              </Badge>
              <div>
                <div className="font-semibold">{currency.name}</div>
                <div className="text-xs text-gray-500">{currency.symbol}</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {currency.change >= 0 ? (
                  <ArrowUp className="w-4 h-4 text-green-600" />
                ) : (
                  <ArrowDown className="w-4 h-4 text-red-600" />
                )}
                <span className={`text-sm ${currency.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {Math.abs(currency.change).toFixed(4)}
                </span>
              </div>
              <div className="text-lg font-bold">{currency.price.toFixed(4)}</div>
            </div>
          </button>
        ))}
      </CardContent>
    </Card>
  );
}
