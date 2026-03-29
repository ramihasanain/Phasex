export interface FFCalendarEvent {
  title: string;
  country?: string;
  date: string;
  impact: string;
  forecast?: string;
  previous?: string;
  url?: string;
  source?: "forex" | "crypto" | "commodities" | "indices" | "general";
  body?: string;
  imageurl?: string;
  provider?: string;
}
