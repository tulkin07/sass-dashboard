import type { Country } from "@/shared/types/api";

// restcountries.com v1-v4 deprecated; static fallback for reliable demo data
const FALLBACK_COUNTRIES: Country[] = [
  { name: { common: "India", official: "Republic of India" }, population: 1417492000, flags: { png: "", svg: "" } },
  { name: { common: "China", official: "People's Republic of China" }, population: 1412175000, flags: { png: "", svg: "" } },
  { name: { common: "United States", official: "United States of America" }, population: 331893745, flags: { png: "", svg: "" } },
  { name: { common: "Indonesia", official: "Republic of Indonesia" }, population: 273523621, flags: { png: "", svg: "" } },
  { name: { common: "Pakistan", official: "Islamic Republic of Pakistan" }, population: 220892331, flags: { png: "", svg: "" } },
  { name: { common: "Nigeria", official: "Federal Republic of Nigeria" }, population: 206139589, flags: { png: "", svg: "" } },
  { name: { common: "Brazil", official: "Federative Republic of Brazil" }, population: 212559409, flags: { png: "", svg: "" } },
  { name: { common: "Bangladesh", official: "People's Republic of Bangladesh" }, population: 164689383, flags: { png: "", svg: "" } },
  { name: { common: "Russia", official: "Russian Federation" }, population: 145934462, flags: { png: "", svg: "" } },
  { name: { common: "Mexico", official: "United Mexican States" }, population: 128932753, flags: { png: "", svg: "" } },
  { name: { common: "Japan", official: "Japan" }, population: 125836021, flags: { png: "", svg: "" } },
  { name: { common: "Germany", official: "Federal Republic of Germany" }, population: 83240525, flags: { png: "", svg: "" } },
  { name: { common: "United Kingdom", official: "United Kingdom of Great Britain and Northern Ireland" }, population: 67215293, flags: { png: "", svg: "" } },
  { name: { common: "France", official: "French Republic" }, population: 67391582, flags: { png: "", svg: "" } },
  { name: { common: "Uzbekistan", official: "Republic of Uzbekistan" }, population: 35163944, flags: { png: "", svg: "" } },
];

export async function fetchCountries(): Promise<Country[]> {
  return [...FALLBACK_COUNTRIES].sort((a, b) => b.population - a.population);
}
