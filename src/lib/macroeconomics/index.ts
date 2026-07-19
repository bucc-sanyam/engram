import type { MacroChapter } from "./types";
import { whatIsEconomics } from "./topics/what-is-economics";
import { conceptualisingTheMacroeconomy } from "./topics/conceptualising-the-macroeconomy";
import { moneyAndInterestRates } from "./topics/money-and-interest-rates";
import { outputAndEmployment } from "./topics/output-and-employment";
import { economicGrowth } from "./topics/economic-growth";
import { macroeconomicPolicy } from "./topics/macroeconomic-policy";

export const MACROECONOMICS_CHAPTERS: MacroChapter[] = [
  whatIsEconomics,
  conceptualisingTheMacroeconomy,
  moneyAndInterestRates,
  outputAndEmployment,
  economicGrowth,
  macroeconomicPolicy,
];
