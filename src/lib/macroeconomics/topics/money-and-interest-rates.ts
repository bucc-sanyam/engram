import type { MacroChapter } from "../types";

export const moneyAndInterestRates: MacroChapter = {
  slug: "money-and-interest-rates",
  title: "Money and Interest Rates",
  chapter: 3,
  tagline: "Unpacking the plumbing of the economy: from informal moneylenders to endogenous money creation.",
  color: "#a78bfa",
  prereqs: ["conceptualising-the-macroeconomy"],
  unlocks: ["output-and-employment"],
  intro: `Money is the lifeblood of a monetary production economy. But what actually *is* money? How does it flow between savers and borrowers? And most importantly, where does it come from? 

This chapter begins with the stark realities of India's financial architecture—a dual system where formal commercial banking exists alongside deeply entrenched informal finance. It then shifts to theories of money, contrasting the traditional 'exogenous' view (where the central bank sets the money supply) with the 'endogenous' view (where commercial banks actively create money by lending). It concludes by examining how domestic interest rates and foreign exchange rates interact in an open economy.`,
  sections: [
    {
      slug: "financial-architecture",
      title: "The Financial Architecture of India",
      sectionNumber: "3.2",
      importance: "Core",
      summary: "The formal and informal pathways connecting deficit and surplus sectors.",
      body: `**Inter-sectoral Financial Flows**
When a firm wants to invest in new productive capacity (like building a factory), it needs funds. It can use retained earnings (internal) or tap into external sources: borrowing from commercial banks, raising funds in the debt market (bonds), or issuing equity in the stock market. 

Similarly, households borrow for consumption (housing, education, weddings). If their current consumption exceeds their current income, they must take a loan, effectively transferring purchasing power from the future to the present.

**The Role of Financial Institutions**
Financial institutions (banks, mutual funds, insurance companies) act as intermediaries between those with surplus funds (savers) and those needing funds (borrowers). They make profits via the 'spread'—the difference between the interest they charge on loans and the interest they pay on deposits.

**Informal Finance**
In India, the formal financial architecture (regulated by the RBI and SEBI) only tells half the story. Over 80% of the workforce is informal. Rural and marginalised households frequently lack the collateral or paperwork (e.g., land titles) required by formal banks. 

Consequently, they turn to informal finance: moneylenders, pawnbrokers, and chit funds. Informal credit is highly accessible but comes at crushing, exorbitant interest rates (often 20% to 36% per annum). As highlighted in literary excerpts in the chapter, this debt often leads to deep precarity, tying individuals to exploitative labour or stripping them of their assets.`,
      questions: [
        {
          kind: "mcq",
          prompt: "How do commercial banks primarily make a profit?",
          options: [
            "By printing currency notes on behalf of the central bank.",
            "By charging a higher interest rate on the loans they issue than the interest rate they pay on deposits (the spread).",
            "By collecting income taxes from households.",
            "By trading heavily in the foreign exchange market."
          ],
          correct_index: 1,
          model_answer: "Banks act as intermediaries and their primary profit engine is the 'spread' between the lending rate and the deposit rate.",
          difficulty: "basic"
        }
      ],
      facts: [
        "In India, informal finance like moneylenders and pawnbrokers still command a significant portion of rural debt because formal credit requires extensive paperwork and collateral."
      ]
    },
    {
      slug: "what-is-money-and-its-theories",
      title: "What is Money and How is it Created?",
      sectionNumber: "3.3",
      importance: "Foundation",
      summary: "Money is an IOU characterised by liquidity. It is created endogenously by banks lending.",
      body: `**What is Money?**
Money is fundamentally a financial obligation (an IOU) that is widely accepted as a means of payment and a store of value. However, not all financial assets are 'money'. The defining characteristic of money is **liquidity**—the speed, ease, and economy with which an asset can be converted into a widely accepted means of payment. 

Currency (cash) is the most liquid. Bank demand deposits are also highly liquid. Mutual funds, life insurance policies, and real estate lie much further down the liquidity spectrum.

**Theories of Money: Exogenous vs. Endogenous**
Where does money come from?

1. **Exogenous Money (The Traditional View):**
Many textbooks teach that the central bank (the RBI) controls the exact quantity of money in the economy. In this view, banks are passive intermediaries: they take in a deposit, keep a fraction as a reserve, and lend out the rest. The money supply is fixed from the "outside" (exogenous).

2. **Endogenous Money (The Modern Reality):**
In a monetary production economy, money is created from the "inside" (endogenous). Banks are not passive; they are active profit-maximisers. When a bank issues a loan to a firm, it simply credits the firm's deposit account. **Lending creates deposits.** Banks do not need pre-existing deposits to issue a loan. 

If this is true, what does the central bank do? The RBI does not fix the *quantity* of money; instead, it fixes the **price of money** (the policy interest rate, or repo rate). It supplies whatever quantity of reserves the banking system needs at that target interest rate to maintain financial stability.

**The Monetary Transmission Mechanism**
When the RBI changes its policy repo rate, it acts as an anchor. Commercial banks adjust their lending and deposit rates accordingly, which then cascades into the bond and equity markets. This is how the central bank influences aggregate investment and consumption.`,
      questions: [
        {
          kind: "mcq",
          prompt: "According to the Endogenous Money approach, how is money primarily created in a modern economy?",
          options: [
            "The central bank prints physical currency and distributes it to the public.",
            "The government mints coins based on gold reserves.",
            "Commercial banks create money whenever they issue a new loan by crediting the borrower's deposit account.",
            "Households create money by depositing their savings into a bank."
          ],
          correct_index: 2,
          model_answer: "In the endogenous money framework, 'loans create deposits'. Commercial banks create new money out of thin air when they extend credit.",
          difficulty: "intermediate"
        },
        {
          kind: "truefalse",
          prompt: "Under the endogenous money view, the central bank fixes the exact quantity of money circulating in the economy.",
          options: ["True", "False"],
          correct_index: 1,
          model_answer: "False. The central bank sets the *price* of money (the interest rate) and allows the quantity of money to fluctuate based on the demand for credit from the economy.",
          difficulty: "basic"
        }
      ],
      facts: [
        "In 2014, the Bank of England published a report explicitly endorsing the Endogenous Money view, confirming that commercial banks create money by making loans."
      ]
    },
    {
      slug: "money-in-the-open-economy",
      title: "Money in the Open Economy",
      sectionNumber: "3.5",
      importance: "Core",
      summary: "How exchange rates and foreign capital flows interact with domestic interest rates.",
      body: `When an economy is open to the Rest of the World (RoW), financial flows cross political boundaries, introducing foreign exchange.

**The Exchange Rate and Interest Rates**
The exchange rate is the price of one currency in terms of another (e.g., INR to USD). While trade (exports and imports) influences the demand and supply of foreign currency, international capital flows play a massive role.

Suppose the RBI increases domestic interest rates. Indian financial assets (like government bonds) now offer a higher rate of return. Foreign Institutional Investors (FIIs) seeking higher yields will move their funds into India. To buy Indian bonds, they must sell USD and buy INR. 
- This increases the demand for INR.
- The INR **appreciates** (gets stronger) relative to the USD.

**Consequences of a Stronger Rupee:**
- **Importers benefit:** It takes fewer rupees to buy a dollar, making imported goods (like petroleum) cheaper.
- **Exporters suffer:** Indian goods become more expensive for foreigners to buy in dollar terms, hurting export competitiveness.

**The Capital and Current Accounts**
These flows are tracked in the Balance of Payments:
1. **Current Account:** Tracks the flow of commodities (exports minus imports) and income transfers (like remittances).
2. **Capital Account:** Tracks the flow of financial assets (Foreign Direct Investment [FDI], FII, commercial borrowing).

Because of double-entry accounting, a Current Account Deficit (importing more goods than exporting) must be financed by a Capital Account Surplus (a net inflow of foreign money/debt). A country cannot infinitely borrow from the rest of the world to fund consumption; eventually, the debt must be serviced.`,
      questions: [
        {
          kind: "mcq",
          prompt: "If the Reserve Bank of India (RBI) significantly increases domestic interest rates, what is the most likely immediate effect on the Indian Rupee (INR), ceteris paribus?",
          options: [
            "The INR will depreciate because foreign investors will pull their money out.",
            "The INR will appreciate because higher returns will attract foreign financial inflows, increasing demand for the rupee.",
            "The exchange rate will remain completely unchanged.",
            "Indian exports will immediately become much cheaper for the US market."
          ],
          correct_index: 1,
          model_answer: "Higher domestic interest rates attract foreign capital. Investors buy INR to invest in India, which increases demand for the rupee and causes it to appreciate.",
          difficulty: "intermediate"
        }
      ],
      facts: [
        "A country's Balance of Payments is essentially an accounting identity: a deficit in the Current Account must be matched by a surplus in the Capital Account."
      ]
    }
  ]
};
