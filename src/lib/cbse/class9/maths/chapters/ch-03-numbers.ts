import type { Chapter } from "@/lib/cbse/types";
import {
  numberLineFigure,
  constructRootFigure,
  rootSpiralFigure,
} from "../figures/ch-03";
import type { WorkedExampleSpec } from "@/lib/sim/types";

/* ─── Sim specs ──────────────────────────────────────────────────── */

const rationalAdditionSim: WorkedExampleSpec = {
  kind: "worked-example",
  title: "Adding Rational Numbers",
  altText:
    "An interactive derivation showing the step-by-step addition of two rational numbers (fractions) by finding a common denominator.",
  inputs: [
    { id: "a", label: "Numerator 1 (a)", min: -10, max: 10, step: 1, default: 2 },
    { id: "b", label: "Denominator 1 (b)", min: 1, max: 10, step: 1, default: 3 },
    { id: "c", label: "Numerator 2 (c)", min: -10, max: 10, step: 1, default: -1 },
    { id: "d", label: "Denominator 2 (d)", min: 1, max: 10, step: 1, default: 4 },
  ],
  steps: [
    {
      explain: "First, write down the two rational numbers we want to add: $\\frac{a}{b} + \\frac{c}{d}$.",
      compute: (v) => `\\frac{${v.a}}{${v.b}} + \\frac{${v.c}}{${v.d}}`,
    },
    {
      explain: "To add them, they must have the same denominator. We multiply the first fraction by $\\frac{d}{d}$ and the second by $\\frac{b}{b}$.",
      compute: (v) => `\\left(\\frac{${v.a} \\times ${v.d}}{${v.b} \\times ${v.d}}\\right) + \\left(\\frac{${v.c} \\times ${v.b}}{${v.d} \\times ${v.b}}\\right)`,
    },
    {
      explain: "Calculate the products in the numerators and the common denominator.",
      compute: (v) => `\\frac{${v.a * v.d}}{${v.b * v.d}} + \\frac{${v.c * v.b}}{${v.b * v.d}}`,
    },
    {
      explain: "Now that the denominators are equal, we can combine the numerators over the common denominator: $\\frac{ad + bc}{bd}$.",
      compute: (v) => `\\frac{${v.a * v.d} + (${v.c * v.b})}{${v.b * v.d}}`,
    },
  ],
  result: (v) => `\\frac{${v.a * v.d + v.c * v.b}}{${v.b * v.d}}`,
};

const tallySim: WorkedExampleSpec = {
  kind: "worked-example",
  title: "One-to-One Correspondence",
  altText: "An interactive example showing matching pebbles to cattle.",
  inputs: [
    { id: "cows", label: "Number of cows", min: 1, max: 20, step: 1, default: 5 }
  ],
  steps: [
    {
      explain: "For every cow that leaves, we place one pebble in the pot.",
      compute: (v) => `Cows leaving = ${v.cows}`
    },
    {
      explain: "The number of pebbles in the pot represents the total count without needing a written number.",
      compute: (v) => `Pebbles in pot = ${v.cows}`
    }
  ],
  result: (v) => `1 cow = 1 pebble. ${v.cows} cows = ${v.cows} pebbles.`
};

const integerArithmeticSim: WorkedExampleSpec = {
  kind: "worked-example",
  title: "Fortunes and Debts",
  altText: "An interactive example of multiplying fortunes (positive) and debts (negative).",
  inputs: [
    { id: "a", label: "Amount", min: -10, max: 10, step: 1, default: -3 },
    { id: "b", label: "Multiplier", min: -10, max: 10, step: 1, default: -4 }
  ],
  steps: [
    {
      explain: "Positive numbers are fortunes. Negative numbers are debts. Let's multiply them.",
      compute: (v) => `(${v.a}) \\times (${v.b})`
    },
    {
      explain: "Multiplying two debts (two negative numbers) represents the removal of debt, which acts as a fortune.",
      compute: (v) => `${v.a * v.b}`
    }
  ],
  result: (v) => `Result = ${v.a * v.b}`
};

/* ─── Chapter ────────────────────────────────────────────────────── */

export const ch03Numbers: Chapter = {
  key: "ch-03-numbers",
  number: 3,
  title: "The World of Numbers",
  subject: "maths",
  book: "Ganita Manjari",
  accent: "#87e3cd",
  summary: "Journey from ancient tally marks to the invention of zero, and explore how humanity expanded the number system to include integers and rational numbers.",
  estMinutes: 25,

  sections: [
    /* ── S1 ─────────────────────────────────────────────────────── */
    {
      key: "dawn-of-mathematics",
      title: "The Need to Count",
      eyebrow: "Ancient origins",
      bookRef: "Ganita Manjari §3.1",
      sim: tallySim,
      body: `Long before formal equations, written digits, or geometry existed, mathematics was born out of everyday necessity. Imagine yourself as an early herder whose flock wanders into the forest each morning to graze. How do you know every sheep has returned safely by nightfall? Without a spoken language that includes numbers, you cannot just count "one, two, three." Instead, you might rely on a clever technique known as **one-to-one correspondence**. For every sheep that leaves the pen, you place a small pebble into a clay pot. When the sheep return in the evening, you remove one pebble for each sheep that walks through the gate. If the pot is empty, your flock is safe; if pebbles remain, you have lost some sheep.

This intuitive matching of objects laid the groundwork for what we now call the **Natural Numbers** (denoted by the symbol $ℕ$). These are the fundamental counting numbers that start at one and go on infinitely: $1, 2, 3, 4, \\dots$

### The Earliest Evidence of Counting
Our ancestors left behind fascinating archaeological evidence of their counting systems, often carved into stone or bone. Some of the oldest known mathematical artefacts were discovered on the African continent.
- The **Lebombo Bone**, found in the border region between South Africa and Eswatini, dates back approximately 35,000 years. This baboon fibula features 29 distinct, deliberate tally marks carved into its surface, suggesting it was used as an early calendar to track lunar cycles or perhaps menstrual cycles.
- Another remarkable artefact is the **Ishango Bone**, discovered in the Democratic Republic of the Congo and thought to be roughly 20,000 years old. This bone is not just a simple tally; it groups its marks deliberately. One column lists the prime numbers between 10 and 20, while another hints at multiplication by doubling — a sophisticated grasp of numerical patterns long before written history began.

### The Fascination with Large Quantities
As human societies transitioned from small nomadic tribes to sprawling agricultural civilisations, the need for mathematics expanded dramatically. Trade, taxation, and astronomy demanded the ability to track much larger quantities. The Indus Valley Civilisation, for instance, developed remarkably precise, standardised weights and measures to support trade across vast distances. 

During the subsequent Vedic period, Indian scholars began naming unimaginably massive numbers. While many ancient cultures struggled to name anything beyond a few thousand, the Vedas gave distinct terms to successive powers of ten, reaching all the way up to $10^{12}$ (known as *parārdha*).

This cultural comfort with massive quantities, and this fascination with powers of ten specifically, is what eventually provided the fertile ground for the invention of the decimal place-value system — the very numerical framework that powers the modern world today.`,
      note: {
        kind: "fact",
        title: "Closure property",
        body: "Natural numbers are 'closed' under addition. This means if you add any two natural numbers together, the result is always another natural number. They are NOT closed under subtraction (e.g., 3 - 5 is not a natural number).",
      },
    },

    /* ── S2 ─────────────────────────────────────────────────────── */
    {
      key: "invention-of-zero",
      title: "The Invention of Zero",
      eyebrow: "The void becomes a number",
      bookRef: "Ganita Manjari §3.2",
      body: `For most of human history, the number line simply stopped at one. If you had five apples and gave them all away, there was no number for what remained — only a void. Early counting systems, including the Babylonians', used a blank space as a placeholder, so that 36 could be told apart from 306, but nobody treated "nothing" as a quantity you could add, subtract or multiply.

The idea that emptiness deserved a name did not start in mathematics at all. Centuries before Brahmagupta, Indian philosophical and meditative traditions had already spent a long time treating *śhūnyatā* — emptiness — as something worth studying closely: a state a mind could reach and describe, not simply a lack of anything. That comfort with treating "nothing" as a real, describable thing is what allowed *śhūnya* to move from philosophy into arithmetic.

The written symbol came first. The Bakhśhālī Manuscript — placed somewhere in the early centuries CE — marks an empty place with a simple dot, a *bindu*. A symbol on a page is not yet a number, though; it needs rules for how it behaves inside a calculation.

That step belongs to Brahmagupta. In his 628 CE treatise, the *Brāhmasphuṭasiddhānta*, zero finally got a precise mathematical identity: it is what is left over once you take a quantity away from itself, $a - a = 0$. From that starting point he worked out how zero behaves under every basic operation — add it to a number and that number is untouched; take it away from a number and that number is again untouched; but multiply anything by it and the result collapses to zero, no matter how large the original number was.

Those three behaviours are what separate a mere placeholder from a working number. A symbol only earns a place in arithmetic once you know exactly how it behaves inside every calculation — and that is precisely what Brahmagupta gave *śhūnya*.`,
      note: {
        kind: "fact",
        body: "Zero reached mathematics by a roundabout route: philosophy and meditation named 'emptiness' as a real, nameable state centuries before Brahmagupta gave it arithmetic rules in 628 CE.",
      },
    },

    /* ── S3 ─────────────────────────────────────────────────────── */
    {
      key: "integers",
      figures: [numberLineFigure],
      title: "Integers: Fortunes and Debts",
      eyebrow: "Expanding the horizon",
      bookRef: "Ganita Manjari §3.3",
      sim: integerArithmeticSim,
      body: `Brahmagupta did not stop at zero. Once he could subtract a number from itself and land on zero, the natural next question was what happens when you subtract a *larger* number from a smaller one — what is $3 - 5$?

To make sense of an answer that clearly was not "nothing," he reached for something everyone already understood: money. He called a positive quantity a **fortune** (*dhana*) — wealth you hold — and a negative quantity a **debt** (*ṛiṇa*) — wealth you owe. Putting debts on the far side of zero from the fortunes gave the world **negative numbers** for the first time. Natural numbers, their negative mirror images, and zero together make up the **Integers**, written $ℤ$.

### How fortunes and debts combine

Brahmagupta then worked out exactly how these two states interact, and the rules he wrote down thirteen centuries ago are still the ones you use today:
- Combine two fortunes and you get a bigger fortune: $5 + 4 = 9$.
- Combine two debts and you get a bigger debt: $(-5) + (-4) = -9$ — two people who each owe money, owe money together.
- A fortune multiplied by a debt produces a debt: $(-3) \\times 4 = -12$ — four copies of a ₹3 debt add up to a ₹12 debt.
- **Two debts multiplied together produce a fortune**: $(-3) \\times (-4) = 12$.

That last rule is the one students trip on. Picture a debt as something being *taken away* from you rather than added to you. Multiplying by a positive number repeats an action; multiplying by a negative number *reverses* it. So multiplying a debt by a negative number does not pile on more debt — it cancels debt that would otherwise exist. If four of your ₹3 debts were erased rather than charged, you would end up ₹12 better off than before, which is exactly the fortune the arithmetic predicts.`,
      note: {
        kind: "exam-tip",
        body: "Integers are closed under addition, subtraction, and multiplication. If you perform any of these three operations on two integers, the result will always be an integer.",
      },
    },

    /* ── S4 ─────────────────────────────────────────────────────── */
    {
      key: "rational-numbers",
      figures: [constructRootFigure, rootSpiralFigure],
      title: "Rational Numbers",
      eyebrow: "Filling the spaces",
      bookRef: "Ganita Manjari §3.4",
      body: `As society grew more complex, measuring became as important as counting. If three farmers share a field equally, integers alone cannot describe what each one owns — you need a way to represent parts of a whole. These are fractions, and expanding the number system to include them is what finally lets you measure as finely as you like, instead of only counting in whole steps.

Just as every integer has an additive inverse (the inverse of 5 is $-5$), every positive fraction has a negative counterpart (the inverse of $3/4$ is $-3/4$). Gathering all the integers and all these positive and negative fractions together gives the set of **Rational Numbers**, denoted $ℚ$ — for *quotient*, since a rational number is exactly the result of dividing one integer by another.

> A rational number is defined as any number that can be expressed in the form $\\frac{p}{q}$, where $p$ and $q$ are integers and $q \\neq 0$.
> — *Ganita Manjari*, §3.4

### Why can't $q$ be zero?
Division by zero is undefined in mathematics — you cannot split a pie into zero pieces and ask how big each piece is. Whatever value $v$ you tried to assign would have to satisfy $0 \\times v = p$, which is impossible unless $p$ is also zero — and even then, any $v$ would technically work, so the answer would not even be unique. Mathematicians sidestep this contradiction entirely by simply banning $q = 0$ from the definition.

### Integers are Rational
Notice that the integer $5$ can be written as $\\frac{5}{1}$, and $-10$ can be written as $\\frac{-10}{1}$. Because every integer can be written as a fraction with $q = 1$, all integers — and therefore all natural numbers too — are automatically part of the rational number family. This is why the number sets nest neatly inside one another: every natural number is an integer, and every integer is rational.`,
      sim: rationalAdditionSim,
      note: {
        kind: "remember",
        body: "Rational numbers are closed under addition, subtraction, multiplication, and division, provided you never divide by zero — that one operation is the single exception the set cannot absorb, no matter what you try.",
      },
    },

    /* ── S5 ─────────────────────────────────────────────────────── */
    {
      key: "equivalent-rationals",
      title: "Equivalent Rational Numbers",
      eyebrow: "Different faces, same value",
      bookRef: "Ganita Manjari §3.4",
      body: `Rational numbers do not have a single, unique way of being written down. If you eat half a pizza, you could describe what you ate as $1/2$, or $2/4$, or $4/8$ — the amount on your plate is exactly the same no matter which fraction you use to describe it.

In mathematics, we write:
$\\frac{1}{2} = \\frac{2}{4} = \\frac{3}{6} = \\frac{-10}{-20}$

Numbers written this way are called **equivalent rational numbers**. You can always generate a new equivalent form by multiplying or dividing both the numerator and the denominator by the same non-zero integer — doing this to both parts at once changes how the fraction *looks* without changing the value it represents, because you are really only multiplying the whole fraction by $\\frac{k}{k}$, which always equals 1.

This matters more in practice than it might seem. Two fractions that look completely different — say $3/5$ and $18/30$ — can secretly be the same number, and you cannot reliably compare, add, or subtract rational numbers until you notice when this is happening.

By convention, we simplify a rational number to its **lowest terms** by dividing out every common factor until the numerator and denominator are **co-prime** — meaning they share no common factor other than 1. So $\\frac{-10}{-20}$, which has a common factor of 10 in both parts, simplifies down to $\\frac{1}{2}$. Lowest terms is the form mathematicians treat as "standard," precisely because it makes it obvious at a glance whether two fractions are secretly equal.

A quick way to check two fractions without simplifying either one is **cross-multiplication**: $\\frac{a}{b}$ and $\\frac{c}{d}$ are equivalent exactly when $a \\times d = b \\times c$. Try it on $\\frac{3}{5}$ and $\\frac{18}{30}$ — $3 \\times 30 = 90$ and $5 \\times 18 = 90$ — the products match, so despite looking nothing alike, the two fractions are the same rational number.`,
      note: {
        kind: "watch-out",
        body: "Equivalent rational numbers represent the exact same point on the number line — simplifying or expanding a fraction never moves it, it only changes its name.",
      },
    },
  ],

  /* ─── Questions (50 total) ─────────────────────────────────────── */
  questions: [
    // ── MCQ (20) ────────────────────────────────────────────────────
    {
      kind: "mcq",
      prompt: "What mathematical concept did early herders use when matching pebbles to returning cattle?",
      options: [
        "Place-value system",
        "One-to-one correspondence",
        "Rational fractions",
        "Algebraic variables",
      ],
      correct_index: 1,
      model_answer: "They matched one pebble to one cow, a direct mapping known as one-to-one correspondence.",
      difficulty: "basic",
      section: "dawn-of-mathematics",
    },
    {
      kind: "mcq",
      prompt: "Which ancient artifact shows evidence of grouping notches by prime numbers?",
      options: [
        "The Rosetta Stone",
        "The Bakhśhālī Manuscript",
        "The Ishango Bone",
        "The Lebombo Bone",
      ],
      correct_index: 2,
      model_answer: "The Ishango bone, found in the Congo, contains columns of tallies grouped into the prime numbers 11, 13, 17, and 19.",
      difficulty: "basic",
      section: "dawn-of-mathematics",
    },
    {
      kind: "mcq",
      prompt: "The set of Natural Numbers includes which of the following?",
      options: [
        "0, 1, 2, 3...",
        "-1, -2, -3...",
        "1, 2, 3, 4...",
        "Fractions and decimals",
      ],
      correct_index: 2,
      model_answer: "Natural numbers are the strictly positive counting numbers starting from 1.",
      difficulty: "basic",
      section: "dawn-of-mathematics",
    },
    {
      kind: "mcq",
      prompt: "Which text explicitly named extremely large powers of 10, such as 10^53 (tallakṣhaṇa)?",
      options: [
        "The Brāhmasphuṭasiddhānta",
        "The Lalitavistara",
        "The Ishango bone inscriptions",
        "The Bakhśhālī Manuscript",
      ],
      correct_index: 1,
      model_answer: "The Lalitavistara, a Buddhist text, recounts the Buddha naming massive numbers up to tallakṣhaṇa (10^53).",
      difficulty: "intermediate",
      section: "dawn-of-mathematics",
    },
    {
      kind: "mcq",
      prompt: "Before zero became a mathematical number with operational rules, how was it primarily used?",
      options: [
        "To represent negative debts",
        "As a placeholder to distinguish numbers like 36 and 306",
        "To signify infinity",
        "As a variable in algebra",
      ],
      correct_index: 1,
      model_answer: "Ancient cultures initially used a blank space or a dot merely as a placeholder to ensure digits were in the correct place-value column.",
      difficulty: "intermediate",
      section: "invention-of-zero",
    },
    {
      kind: "mcq",
      prompt: "Who authored the Brāhmasphuṭasiddhānta, defining the arithmetic rules of zero?",
      options: [
        "Aryabhata",
        "Brahmagupta",
        "Bhaskara",
        "Descartes",
      ],
      correct_index: 1,
      model_answer: "Brahmagupta wrote the text in 628 CE, formally giving zero its algebraic properties.",
      difficulty: "basic",
      section: "invention-of-zero",
    },
    {
      kind: "mcq",
      prompt: "According to Brahmagupta, what is the result of multiplying any number by zero?",
      options: [
        "The number itself",
        "Infinity",
        "Undefined",
        "Zero",
      ],
      correct_index: 3,
      model_answer: "One of Brahmagupta's foundational laws states that any number multiplied by zero equals zero (a × 0 = 0).",
      difficulty: "basic",
      section: "invention-of-zero",
    },
    {
      kind: "mcq",
      prompt: "To explain negative numbers, Brahmagupta used the real-world analogy of:",
      options: [
        "Apples and oranges",
        "Fortunes (Dhana) and Debts (Ṛiṇa)",
        "Height and depth",
        "Speed and time",
      ],
      correct_index: 1,
      model_answer: "He grounded negative numbers in commerce, treating positive numbers as assets/fortunes and negative numbers as debts.",
      difficulty: "basic",
      section: "integers",
    },
    {
      kind: "mcq",
      prompt: "Which set of numbers is denoted by the symbol Z?",
      options: [
        "Natural Numbers",
        "Rational Numbers",
        "Whole Numbers",
        "Integers",
      ],
      correct_index: 3,
      model_answer: "The set of integers (positive numbers, negative numbers, and zero) is denoted by Z, from the German word Zahlen.",
      difficulty: "basic",
      section: "integers",
    },
    {
      kind: "mcq",
      prompt: "In Brahmagupta's logic, why does multiplying two negative numbers yield a positive result?",
      options: [
        "Because two wrongs make a right",
        "Multiplying by a negative represents the 'removal' of a debt, making you richer",
        "Because it is mathematically impossible to have a negative area",
        "Because fortunes always outnumber debts",
      ],
      correct_index: 1,
      model_answer: "If a negative number is a debt, multiplying it by a negative means you are subtracting or taking away that debt, which increases your overall wealth (a positive).",
      difficulty: "intermediate",
      section: "integers",
    },
    {
      kind: "mcq",
      prompt: "What is a Rational Number?",
      options: [
        "Any number greater than zero",
        "Any number that can be expressed as p/q where p and q are integers and q is not zero",
        "Any number that is an integer",
        "Any fraction where the numerator is smaller than the denominator",
      ],
      correct_index: 1,
      model_answer: "A rational number is exactly defined as the ratio of two integers p and q, provided the denominator q is not zero.",
      difficulty: "basic",
      section: "rational-numbers",
    },
    {
      kind: "mcq",
      prompt: "Why does the definition of a rational number p/q require that q ≠ 0?",
      options: [
        "Because zero has no value",
        "Because dividing by zero is mathematically undefined",
        "Because it would result in a negative number",
        "Because fractions cannot have zero in the numerator",
      ],
      correct_index: 1,
      model_answer: "Division by zero yields no logical or defined mathematical value, so a valid fraction cannot have a denominator of zero.",
      difficulty: "intermediate",
      section: "rational-numbers",
    },
    {
      kind: "mcq",
      prompt: "Which of the following is NOT a rational number?",
      options: [
        "5",
        "-1/2",
        "3/0",
        "0/7",
      ],
      correct_index: 2,
      model_answer: "3/0 has a denominator of zero, which violates the definition of a rational number.",
      difficulty: "intermediate",
      section: "rational-numbers",
    },
    {
      kind: "mcq",
      prompt: "How can the integer -8 be written to prove it is a rational number?",
      options: [
        "-8/0",
        "1/-8",
        "-8/1",
        "It cannot be written as a rational number",
      ],
      correct_index: 2,
      model_answer: "Any integer can be written as a fraction by placing it over a denominator of 1. Thus, -8 is -8/1.",
      difficulty: "basic",
      section: "rational-numbers",
    },
    {
      kind: "mcq",
      prompt: "Fractions like 1/2, 2/4, and 3/6 are known as:",
      options: [
        "Irrational fractions",
        "Equivalent rational numbers",
        "Inverse numbers",
        "Prime fractions",
      ],
      correct_index: 1,
      model_answer: "They all represent the exact same value or portion of a whole, so they are called equivalent.",
      difficulty: "basic",
      section: "equivalent-rationals",
    },
    {
      kind: "mcq",
      prompt: "What does it mean for a set of numbers to be 'closed' under addition?",
      options: [
        "Adding two numbers in the set always yields zero",
        "Adding two numbers in the set always yields a number outside the set",
        "Adding two numbers in the set always yields a number that is also within the set",
        "You can only add positive numbers",
      ],
      correct_index: 2,
      model_answer: "Closure means the operation does not let you 'escape' the set. Adding two integers always produces another integer.",
      difficulty: "intermediate",
      section: "dawn-of-mathematics",
    },
    {
      kind: "mcq",
      prompt: "Under which operation are Natural Numbers NOT closed?",
      options: [
        "Addition",
        "Multiplication",
        "Subtraction",
        "None of the above",
      ],
      correct_index: 2,
      model_answer: "Subtracting a larger natural number from a smaller one (e.g., 3 - 5) results in a negative number, which is outside the set of Natural Numbers.",
      difficulty: "advanced",
      section: "dawn-of-mathematics",
    },
    {
      kind: "mcq",
      prompt: "What is the additive inverse of the rational number 3/7?",
      options: [
        "7/3",
        "1",
        "-3/7",
        "0",
      ],
      correct_index: 2,
      model_answer: "The additive inverse is the number you add to get zero. For 3/7, it is its negative counterpart, -3/7.",
      difficulty: "intermediate",
      section: "rational-numbers",
    },
    {
      kind: "mcq",
      prompt: "What symbol denotes the set of Rational Numbers?",
      options: [
        "N",
        "Z",
        "R",
        "Q",
      ],
      correct_index: 3,
      model_answer: "Rational numbers are denoted by Q, which stands for Quotient.",
      difficulty: "basic",
      section: "rational-numbers",
    },
    {
      kind: "mcq",
      prompt: "When are two rational numbers p/q and r/s considered equal?",
      options: [
        "When p+s = q+r",
        "When ps = qr",
        "When p=r only",
        "When q=s only",
      ],
      correct_index: 1,
      model_answer: "Using cross-multiplication, p/q = r/s is equivalent to saying ps = qr.",
      difficulty: "advanced",
      section: "equivalent-rationals",
    },

    // ── TRUE/FALSE (10) ─────────────────────────────────────────────
    {
      kind: "truefalse",
      prompt: "The Ishango Bone provides evidence that ancient humans understood prime numbers.",
      options: ["True", "False"],
      correct_index: 0,
      model_answer: "True — the bone contains a column with tallies grouped exactly into 11, 13, 17, and 19.",
      difficulty: "basic",
      section: "dawn-of-mathematics",
    },
    {
      kind: "truefalse",
      prompt: "The number 0 is a Natural Number.",
      options: ["True", "False"],
      correct_index: 1,
      model_answer: "False — Natural numbers strictly begin at 1. Zero was invented later and is included in the set of Whole Numbers and Integers.",
      difficulty: "intermediate",
      section: "dawn-of-mathematics",
    },
    {
      kind: "truefalse",
      prompt: "The concept of zero as an operational number with mathematical rules was formalised in India.",
      options: ["True", "False"],
      correct_index: 0,
      model_answer: "True — Brahmagupta's text in 628 CE was the first to define the arithmetic rules of zero.",
      difficulty: "basic",
      section: "invention-of-zero",
    },
    {
      kind: "truefalse",
      prompt: "According to Brahmagupta, subtracting zero from a number changes its value.",
      options: ["True", "False"],
      correct_index: 1,
      model_answer: "False — his rule states that a number minus zero remains completely unchanged (a - 0 = a).",
      difficulty: "basic",
      section: "invention-of-zero",
    },
    {
      kind: "truefalse",
      prompt: "Adding two negative integers always results in a positive integer.",
      options: ["True", "False"],
      correct_index: 1,
      model_answer: "False — a debt plus a debt is a larger debt. -3 + -4 = -7.",
      difficulty: "intermediate",
      section: "integers",
    },
    {
      kind: "truefalse",
      prompt: "Integers are closed under division.",
      options: ["True", "False"],
      correct_index: 1,
      model_answer: "False — dividing two integers (like 3 divided by 2) often results in a fraction (1.5), which is outside the set of integers.",
      difficulty: "advanced",
      section: "integers",
    },
    {
      kind: "truefalse",
      prompt: "Every integer is also a rational number.",
      options: ["True", "False"],
      correct_index: 0,
      model_answer: "True — any integer 'n' can be written as a fraction 'n/1', satisfying the definition of a rational number.",
      difficulty: "intermediate",
      section: "rational-numbers",
    },
    {
      kind: "truefalse",
      prompt: "The rational number 5/10 is in its lowest, simplest terms.",
      options: ["True", "False"],
      correct_index: 1,
      model_answer: "False — both numerator and denominator share a common factor of 5. It simplifies to 1/2.",
      difficulty: "basic",
      section: "equivalent-rationals",
    },
    {
      kind: "truefalse",
      prompt: "Rational numbers are closed under subtraction.",
      options: ["True", "False"],
      correct_index: 0,
      model_answer: "True — subtracting any two rational numbers will always result in another valid rational number.",
      difficulty: "advanced",
      section: "rational-numbers",
    },
    {
      kind: "truefalse",
      prompt: "In a rational number p/q, the numerator p is never allowed to be zero.",
      options: ["True", "False"],
      correct_index: 1,
      model_answer: "False — the NUMERATOR can be zero (0/5 is simply 0, which is rational). It is the DENOMINATOR q that cannot be zero.",
      difficulty: "advanced",
      section: "rational-numbers",
    },

    // ── MULTI (8) ───────────────────────────────────────────────────
    {
      kind: "multi",
      prompt: "Which of the following are examples of one-to-one correspondence?",
      options: [
        "Matching each student in a class to exactly one chair",
        "Writing down the number 5",
        "Placing a pebble in a pot for every sheep that passes",
        "Adding two fractions",
      ],
      correct_indices: [0, 2],
      model_answer: "One-to-one correspondence is the physical matching of one item from a set to one item of another set.",
      difficulty: "intermediate",
      section: "dawn-of-mathematics",
    },
    {
      kind: "multi",
      prompt: "Which mathematical texts are associated with ancient India?",
      options: [
        "Brāhmasphuṭasiddhānta",
        "Principia Mathematica",
        "Lalitavistara",
        "Bakhśhālī Manuscript",
      ],
      correct_indices: [0, 2, 3],
      model_answer: "The Principia was written by Newton. The others are foundational Indian texts involving numbers and zero.",
      difficulty: "intermediate",
      section: "dawn-of-mathematics",
    },
    {
      kind: "multi",
      prompt: "According to Brahmagupta's rules, which of the following operations result in the number 'a' remaining unchanged?",
      options: [
        "a + 0",
        "a × 0",
        "a - 0",
        "0 - a",
      ],
      correct_indices: [0, 2],
      model_answer: "Adding or subtracting zero leaves the original number unchanged. Multiplying by zero yields zero.",
      difficulty: "basic",
      section: "invention-of-zero",
    },
    {
      kind: "multi",
      prompt: "Which of the following sets of numbers are 'closed' under subtraction?",
      options: [
        "Natural Numbers",
        "Integers",
        "Rational Numbers",
        "Whole Numbers",
      ],
      correct_indices: [1, 2],
      model_answer: "Integers and rational numbers are closed under subtraction, because subtracting one from another always yields a number in the same set. Natural numbers and whole numbers are not (e.g., 3 - 5 is negative).",
      difficulty: "advanced",
      section: "rational-numbers",
    },
    {
      kind: "multi",
      prompt: "Select ALL the equivalent rational numbers for 3/4.",
      options: [
        "6/8",
        "9/12",
        "-3/-4",
        "4/3",
      ],
      correct_indices: [0, 1, 2],
      model_answer: "Multiplying numerator and denominator by 2 gives 6/8, by 3 gives 9/12, and by -1 gives -3/-4. 4/3 is the reciprocal, not equivalent.",
      difficulty: "intermediate",
      section: "equivalent-rationals",
    },
    {
      kind: "multi",
      prompt: "Which statements about the set of Integers (Z) are true?",
      options: [
        "It includes all Natural Numbers",
        "It includes fractions like 1/2",
        "It includes zero",
        "It includes negative whole numbers",
      ],
      correct_indices: [0, 2, 3],
      model_answer: "Integers consist of positive whole numbers (natural numbers), negative whole numbers, and zero. It does not include fractions.",
      difficulty: "basic",
      section: "integers",
    },
    {
      kind: "multi",
      prompt: "If you have a rational number -5/7, which of the following are valid ways to write it?",
      options: [
        "-(5/7)",
        "(-5)/7",
        "5/(-7)",
        "(-5)/(-7)",
      ],
      correct_indices: [0, 1, 2],
      model_answer: "The negative sign can be placed in front, on the numerator, or on the denominator. Placing it on both makes it positive (5/7).",
      difficulty: "advanced",
      section: "rational-numbers",
    },
    {
      kind: "multi",
      prompt: "Which of the following operations involving zero are undefined or impossible in mathematics?",
      options: [
        "0 + 5",
        "5 / 0",
        "0 / 5",
        "-7 / 0",
      ],
      correct_indices: [1, 3],
      model_answer: "You cannot divide by zero. Dividing zero by a number (0/5) is simply zero.",
      difficulty: "intermediate",
      section: "rational-numbers",
    },

    // ── QUICKFIRE (6) ───────────────────────────────────────────────
    {
      kind: "quickfire",
      prompt: "What counting method matches one object to exactly one other object?",
      model_answer: "One-to-one correspondence",
      difficulty: "basic",
      section: "dawn-of-mathematics",
    },
    {
      kind: "quickfire",
      prompt: "What is the ancient Sanskrit term for zero used by Brahmagupta?",
      model_answer: "Śhūnya",
      difficulty: "intermediate",
      section: "invention-of-zero",
    },
    {
      kind: "quickfire",
      prompt: "According to Brahmagupta, what is the result of multiplying two debts (negative numbers)?",
      model_answer: "A fortune (a positive number)",
      difficulty: "intermediate",
      section: "integers",
    },
    {
      kind: "quickfire",
      prompt: "What mathematical property dictates that adding two integers always yields an integer?",
      model_answer: "Closure property",
      difficulty: "advanced",
      section: "integers",
    },
    {
      kind: "quickfire",
      prompt: "What letter is used to denote the set of Rational Numbers?",
      model_answer: "Q",
      difficulty: "basic",
      section: "rational-numbers",
    },
    {
      kind: "quickfire",
      prompt: "In the fraction p/q, which value is absolutely forbidden for q?",
      model_answer: "0",
      difficulty: "basic",
      section: "rational-numbers",
    },

    // ── OPEN (6) ────────────────────────────────────────────────────
    {
      kind: "open",
      prompt: "Why was the invention of a symbol for zero an important step, but not the final step, in the creation of zero as a number?",
      model_answer: "Early cultures used a dot or space merely as a placeholder to keep digits aligned (like distinguishing 36 from 306). It only became a true number when Brahmagupta provided formal arithmetic rules for it, defining how it behaves when added, subtracted, and multiplied with other numbers.",
      difficulty: "advanced",
      section: "invention-of-zero",
    },
    {
      kind: "open",
      prompt: "Explain how Brahmagupta used the concepts of 'Fortunes' and 'Debts' to make negative numbers understandable.",
      model_answer: "He related abstract math to everyday commerce. Positive numbers were 'Fortunes' (money you have), and negative numbers were 'Debts' (money you owe). This made operations intuitive: adding two debts creates a bigger debt, while having a debt taken away is mathematically identical to gaining a fortune.",
      difficulty: "intermediate",
      section: "integers",
    },
    {
      kind: "open",
      prompt: "Prove that the integer 7 is also a rational number.",
      model_answer: "A rational number is any number that can be expressed as a fraction p/q, where p and q are integers and q is not zero. The integer 7 can be written as 7/1. Since both 7 and 1 are integers and 1 is not zero, 7 satisfies the definition of a rational number.",
      difficulty: "intermediate",
      section: "rational-numbers",
    },
    {
      kind: "open",
      prompt: "Why do we say that the set of Natural Numbers is NOT closed under subtraction?",
      model_answer: "A set is closed under an operation if performing that operation always results in a member of the same set. If you subtract 5 from 3, the result is -2. Since -2 is a negative integer and not a Natural Number, the set is not closed under subtraction.",
      difficulty: "advanced",
      section: "dawn-of-mathematics",
    },
    {
      kind: "open",
      prompt: "Explain what equivalent rational numbers are, using an example.",
      model_answer: "Equivalent rational numbers are fractions that look different but represent the exact same value. For example, 1/2 and 2/4 and 50/100 are equivalent. They can be found by multiplying or dividing the numerator and denominator by the same non-zero integer.",
      difficulty: "basic",
      section: "rational-numbers",
    },
    {
      kind: "open",
      prompt: "Why is division by zero undefined in the definition of a rational number?",
      model_answer: "Division represents sharing a quantity into equal parts. You cannot logically divide an object into 'zero' parts. Mathematically, dividing by zero breaks the rules of arithmetic, leading to contradictions, so it is strictly forbidden in the denominator (q ≠ 0).",
      difficulty: "intermediate",
      section: "rational-numbers",
    },
  ],
};
