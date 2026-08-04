import type { Chapter } from "@/lib/cbse/types";
import {
  athleticsTrackFigure,
  archimedesFigure,
  sectorFigure,
  unitSquaresFigure,
  circleDissectionFigure,
} from "../figures/ch-06";
import type { GeometryBoardSpec, WorkedExampleSpec } from "@/lib/sim/types";

/* ─── Sim specs ──────────────────────────────────────────────────── */

const perimeterSim: GeometryBoardSpec = {
  kind: "geometry-board",
  title: "Perimeter of a Polygon",
  altText:
    "An interactive geometry board where you can drag the corners of a quadrilateral to see how its perimeter and area change in real time.",
  viewBox: [400, 300],
  gridSize: 20,
  vertices: [
    { id: "A", label: "A", at: [100, 100] },
    { id: "B", label: "B", at: [300, 100] },
    { id: "C", label: "C", at: [300, 200] },
    { id: "D", label: "D", at: [100, 200] },
  ],
  polygon: ["A", "B", "C", "D"],
  readouts: [
    {
      label: "Perimeter",
      compute: (pts) => {
        const dist = (p1: { x: number; y: number }, p2: { x: number; y: number }) =>
          Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
        
        const perim =
          dist(pts.A, pts.B) +
          dist(pts.B, pts.C) +
          dist(pts.C, pts.D) +
          dist(pts.D, pts.A);
          
        return `${Math.round(perim)} units`;
      },
    },
    {
      label: "Area (Shoelace)",
      compute: (pts) => {
        // Shoelace formula for area
        let area =
          pts.A.x * pts.B.y - pts.A.y * pts.B.x +
          pts.B.x * pts.C.y - pts.B.y * pts.C.x +
          pts.C.x * pts.D.y - pts.C.y * pts.D.x +
          pts.D.x * pts.A.y - pts.D.y * pts.A.x;
          
        area = Math.abs(area) / 2;
        // Since viewBox units are large (e.g. 100 to 300), we can scale it down if needed, 
        // but let's just display the raw area in square units.
        return `${Math.round(area)} sq units`;
      },
    },
  ],
};

const circumferenceWorked: WorkedExampleSpec = {
  kind: "worked-example",
  title: "Calculating Circumference",
  altText: "An interactive worked example calculating the circumference of a circle from its radius.",
  inputs: [
    {
      id: "r",
      label: "Radius",
      min: 1,
      max: 50,
      step: 1,
      default: 7,
      unit: "cm"
    }
  ],
  steps: [
    {
      explain: "The formula for the circumference of a circle is $C = 2\\pi r$.",
      compute: (v) => `C = 2 \\pi ( ${v.r} )`
    },
    {
      explain: "Using the approximation $\\pi \\approx 22/7$ for simplicity.",
      compute: (v) => `C \\approx 2 \\times (22/7) \\times ${v.r}`
    }
  ],
  result: (v) => {
    const ans = (2 * 22 / 7 * v.r).toFixed(2);
    return `C \\approx ${ans} cm`;
  }
};

const arcLengthWorked: WorkedExampleSpec = {
  kind: "worked-example",
  title: "Calculating Arc Length",
  altText: "An interactive worked example calculating the length of an arc from its radius and subtended angle.",
  inputs: [
    {
      id: "r",
      label: "Radius",
      min: 1,
      max: 50,
      step: 1,
      default: 14,
      unit: "cm"
    },
    {
      id: "theta",
      label: "Angle (degrees)",
      min: 10,
      max: 360,
      step: 10,
      default: 90,
      unit: "°"
    }
  ],
  steps: [
    {
      explain: "The formula for arc length is $\\frac{\\theta}{360} \\times 2\\pi r$.",
      compute: (v) => `(${v.theta}/360) \\times 2\\pi (${v.r})`
    },
    {
      explain: "Using the approximation $\\pi \\approx 22/7$.",
      compute: (v) => `(${v.theta}/360) \\times 2 \\times (22/7) \\times ${v.r}`
    }
  ],
  result: (v) => {
    const ans = (v.theta / 360 * 2 * (22/7) * v.r).toFixed(2);
    return `Arc Length \\approx ${ans} cm`;
  }
};

/* ─── Chapter ────────────────────────────────────────────────────── */

export const ch06PerimeterArea: Chapter = {
  key: "ch-06-perimeter-area",
  number: 6,
  title: "Measuring Space: Perimeter and Area",
  subject: "maths",
  book: "Ganita Manjari",
  accent: "#ffc163",
  summary: "Explore how to measure the boundaries of geometric shapes, and discover the fascinating history behind the most famous ratio in mathematics: pi, before venturing inside to measure area.",
  estMinutes: 40,

  sections: [
    /* ── S1 ─────────────────────────────────────────────────────── */
    {
      key: "perimeter-basics",
      figures: [athleticsTrackFigure],
      title: "Perimeter of Shapes",
      eyebrow: "Around the border",
      bookRef: "Ganita Manjari §6.1",
      body: `If you have ever watched athletes lined up for a $4 \\times 100$ m relay race, you might have noticed they do not all start at the same line. The athletes in the outer lanes start further ahead than those in the inner lanes. Why? Because the outer border of the track is longer than the inner border.

> Given any shape, its perimeter is the total length around its border.
> — *Ganita Manjari*, §6.1

This concept of measuring the total length around the boundary of a shape is called the **perimeter**. Imagine a tiny insect walking exactly along the border of a shape until it returns to its starting point; the distance it travels is the perimeter.

For polygons (shapes made of straight lines), finding the perimeter is simple: you just add up the lengths of all the sides.
- For a **square** with side $a$, all four sides are equal. The perimeter is $a + a + a + a = 4a$.
- For an **equilateral triangle** with side $a$, the three sides are equal. The perimeter is $3a$.
- For a **rectangle** with length $l$ and width $w$, there are two pairs of equal sides. The perimeter is $2l + 2w = 2(l + w)$.

As a shape scales up, its perimeter scales proportionally. If you double the side length of a square, its perimeter exactly doubles.

For example, a football pitch that is $105$ m long and $68$ m wide has a perimeter of $2(105 + 68) = 346$ m — the exact distance a groundsman would walk while marking out its boundary line.`,
      sim: perimeterSim,
      note: {
        kind: "fact",
        body: "The word 'perimeter' comes from the Greek words 'peri' (around) and 'metron' (measure) — literally, 'a measure around'. The same root gives us 'metre' and 'geometry'.",
      },
    },

    /* ── S2 ─────────────────────────────────────────────────────── */
    {
      key: "perimeter-of-circle",
      title: "The Circle and its Circumference",
      eyebrow: "Curved boundaries",
      bookRef: "Ganita Manjari §6.2",
      body: `Measuring a polygon is easy because you can use a straight ruler. But how do you measure the perimeter of a perfect circle? The perimeter of a circle has a special name: its **circumference** (denoted by $C$).

Thousands of years ago, people noticed a magical constant in nature: if you measure the circumference of *any* circle and divide it by its diameter ($D$), you always get exactly the same number. It does not matter if the circle is the size of a coin or the size of a planet; the ratio $C/D$ is always constant. 

We now call this constant **$\\pi$** (pronounced "pi"). Because $C/D = \\pi$, we can rearrange this to find the formula for the circumference of any circle:
$C = \\pi D$

Since the diameter is just twice the radius ($D = 2r$), this formula is most famously written as:
**$C = 2\\pi r$**

This constant is remarkable precisely because it does not depend on size at all. Draw a circle the size of a coin, and a circle the size of a running track, and dividing each one's circumference by its own diameter gives you the identical number, digit for digit. No other simple ratio of a shape's measurements behaves this way — a square's perimeter divided by its side length is always exactly 4, but that is a whole number by definition, not a mysterious constant discovered through measurement.

For example, a circular table with a diameter of $1.4$ m has a circumference of $C = \\pi \\times 1.4 \\approx 4.4$ m — useful to know if you are buying a border trim for a tablecloth and need to know how much to buy.`,
      sim: circumferenceWorked,
      note: {
        kind: "watch-out",
        body: "Remember that the radius is half the diameter. If a problem gives you the diameter, you can use $C = \\pi D$ directly — there is no need to halve it and then double the radius again.",
      },
    },

    /* ── S3 ─────────────────────────────────────────────────────── */
    {
      key: "history-of-pi",
      figures: [archimedesFigure],
      title: "The Quest for Pi",
      eyebrow: "A historical journey",
      bookRef: "Ganita Manjari §6.2",
      body: `Knowing that $\\pi$ exists is one thing, but calculating its exact numerical value has been one of the greatest obsessions in the history of mathematics.

- **Mesopotamia (c. 1900 BCE):** Early mathematicians realised a circle's perimeter was slightly larger than a hexagon inscribed inside it. They estimated $\\pi$ as $3.125$.
- **Archimedes (c. 250 BCE):** He devised a brilliant method of 'trapping' $\\pi$. He drew polygons inside a circle (inscribed) and outside the circle (circumscribed). By calculating the perimeters of these polygons with up to 96 sides, he proved that $\\pi$ is between $3\\frac{10}{71}$ and $3\\frac{1}{7}$.
- **Zu Chongzhi (c. 480 CE):** In China, he pushed Archimedes' method to the extreme, using a polygon with 24,576 sides! He discovered the fraction $355/113$, which is incredibly accurate to seven decimal places ($3.1415929...$).
- **Āryabhaṭa (c. 499 CE):** In India, he calculated the ratio of circumference to diameter as approximately $3.1416$ — remarkably close to the true value — and explicitly noted that this was only an approximation, an unusually modern acknowledgement for the time.

Despite these heroic geometrical efforts, mathematicians were still only finding *approximations* using straight-sided shapes to estimate a curve.

The true breakthrough came from India. **Mādhava of Sangamagrāma** (c. 1350 CE) realised $\\pi$ was a limit that could be reached through an infinite sum of numbers, rather than cutting up geometry. He discovered the first exact formula for $\\pi$:
$\\pi/4 = 1 - 1/3 + 1/5 - 1/7 + \\dots$

This infinite series changed mathematics forever, birthing the field we now know as calculus.`,
      note: {
        kind: "fact",
        title: "The Symbol",
        body: "The Greek letter π was first used to represent this ratio in 1706 by Welsh mathematician William Jones, because it is the first letter of the Greek word 'perimetros'.",
      },
    },

    /* ── S4 ─────────────────────────────────────────────────────── */
    {
      key: "pi-is-irrational",
      title: "Pi is Irrational",
      eyebrow: "The never-ending number",
      bookRef: "Ganita Manjari §6.3",
      body: `We often use fractions like $22/7$ or decimals like $3.14$ to represent $\\pi$ in calculations. But it is crucial to understand that **$\\pi$ is not equal to $22/7$**. They are just "close enough" for practical use.

In reality, $\\pi$ is an **irrational number**. This means it is mathematically impossible to write $\\pi$ as a simple fraction of two integers. 

Because it cannot be written as a fraction, its decimal expansion goes on forever without ever repeating or settling into a rhythmic pattern.
$\\pi = 3.14159265358979323846\\dots$

If you have any fraction that is close to $\\pi$, you can always find a slightly more complex fraction that gets even closer, but you will never find one that matches perfectly.

Recall that a rational number is one that can be written exactly as $\\frac{p}{q}$ for integers $p$ and $q$ — think $\\frac{22}{7}$, or $\\frac{355}{113}$, both of which get closer and closer to $\\pi$ without ever quite reaching it. An **irrational number** is simply any number that refuses this treatment: no matter how large or clever a fraction you try, it will always be slightly off.

Proving that $\\pi$ actually IS irrational — rather than just an unusually stubborn number nobody had found the right fraction for yet — turned out to be surprisingly hard. It was not settled until 1761, when the mathematician Johann Lambert produced a rigorous proof, more than two thousand years after Archimedes first started narrowing it down geometrically.

$22/7$ matches $\\pi$ to only two decimal places; $355/113$ is far better, matching six decimal places — but push either fraction out further and its digits diverge from $\\pi$'s actual, endlessly non-repeating decimal expansion.`,
      note: {
        kind: "exam-tip",
        body: "Always remember: π ≈ 22/7, but π ≠ 22/7. The fraction is a convenient approximation for hand calculation, never the exact value — do not treat it as one in a proof.",
      },
    },

    /* ── S5 ─────────────────────────────────────────────────────── */
    {
      key: "arc-length",
      figures: [sectorFigure],
      title: "Length of an Arc",
      eyebrow: "Pieces of the perimeter",
      bookRef: "Ganita Manjari §6.4",
      body: `If the total circumference of a circle is $2\\pi r$, what is the length of just a piece of the boundary? A continuous piece of a circle's boundary is called an **arc**.

Imagine a circle cut perfectly in half. The arc of this semicircle is exactly half of the total circumference:
Semicircle length $= \\frac{1}{2} \\times 2\\pi r = \\pi r$

If you cut the circle into four equal slices (like a pizza), the arc of each quarter circle is one-fourth of the total circumference:
Quarter circle length $= \\frac{1}{4} \\times 2\\pi r = \\frac{\\pi r}{2}$

We can generalise this by looking at the angle the slice makes at the centre of the circle. A full circle is $360°$. A semicircle is $180°$, which is exactly $180/360$ (or half) of the full circle. A quarter circle is $90°$, which is $90/360$ (or one quarter) of the full circle.

Therefore, for any arc that subtends an angle $\\theta$ at the centre of the circle, the formula for its length is:
Arc length $= \\frac{\\theta}{360} \\times 2\\pi r$

For example, a garden sprinkler set to sweep through $90°$ with a reach of $5$ m waters an arc of length $\\frac{90}{360} \\times 2\\pi(5) \\approx 7.85$ m along the outer edge of its spray — exactly a quarter of the full circle's circumference, just as the fraction $\\frac{\\theta}{360}$ predicts.

This is also why a running track's staggered start makes sense. Every lane traces an arc of the same angle around the bend, but at a larger radius, so the outer runners genuinely do cover more ground — and that head start is what makes the race fair.`,
      sim: arcLengthWorked,
    },

    /* ── S6 ─────────────────────────────────────────────────────── */
    {
      key: "area-basics",
      figures: [unitSquaresFigure],
      title: "Measuring Area",
      eyebrow: "The space inside",
      bookRef: "Ganita Manjari §6.5",
      body: `Perimeter tells you the length of a shape's border. But if you want to know how much paint you need to cover a wall, or how much carpet you need for a floor, the boundary length is useless. You need to know the amount of flat space contained *inside* that boundary. This measurement is called the **area**.

You can measure perimeter with a straight, one-dimensional ruler. But a ruler cannot measure area, because a ruler has no width. To measure two-dimensional space, your measuring tool must also be two-dimensional. 

The simplest shape that perfectly tiles a flat surface without leaving gaps is a square. So, to measure area, we count how many standard squares fit inside the shape. The fundamental standard is a **unit square** — a square whose sides are exactly 1 unit long (like 1 cm by 1 cm). When we say a shape has an area of "15 square centimetres" (written as $15 \\text{ cm}^2$), we mean exactly 15 of these 1 cm by 1 cm tiles fit perfectly inside it.

### The Area of a Rectangle
For a rectangle, finding the area does not require counting every single square one by one. If a rectangle is 5 cm long and 3 cm wide, you can think of it as being made of 3 rows, where each row contains exactly 5 unit squares.

The total number of squares is just $5 \\times 3 = 15$. This gives us the fundamental formula for the area of any rectangle:
**$\\text{Area} = \\text{length} \\times \\text{width}$**

Because a square is just a special rectangle where the length and width are the same ($a$), its area is simply $a \\times a = a^2$. 

Unlike perimeter, which scales directly with the sides (double the side, double the perimeter), area scales with the *square* of the sides. If you double the length and width of a rectangle, you do not just double its area — you quadruple it ($2 \\times 2 = 4$). A 2 cm by 2 cm square holds 4 unit squares, while a 4 cm by 4 cm square holds 16!`,
      note: {
        kind: "exam-tip",
        body: "Never confuse perimeter with area. Perimeter is measured in linear units (cm, m). Area is always measured in squared units ($\\text{cm}^2, \\text{m}^2$).",
      },
    },

    /* ── S7 ─────────────────────────────────────────────────────── */
    {
      key: "area-by-dissection",
      figures: [circleDissectionFigure],
      title: "Area by Dissection",
      eyebrow: "Rearranging the pieces",
      bookRef: "Ganita Manjari §6.6",
      body: `Finding the area of a rectangle is straightforward because squares fit perfectly into it. But what about a triangle, a parallelogram, or a circle? You cannot perfectly pack square tiles into a curved shape — the edges will always be messy.

Instead of trying to count squares directly, mathematicians rely on a brilliant principle: **if you cut a shape into pieces and rearrange them, the total area does not change**. This is called finding area by *dissection*.

If you take a parallelogram, cut off a triangle from one end, and move it to the other end, it forms a perfect rectangle with the same base and height. Therefore, the area of a parallelogram is exactly the same as the rectangle it forms: $\\text{base} \\times \\text{height}$. 

If you take a triangle and duplicate it, the two identical triangles can be placed together to form a parallelogram. Since the two triangles together have an area of $\\text{base} \\times \\text{height}$, a single triangle has exactly half that area: $\\frac{1}{2} \\times \\text{base} \\times \\text{height}$.

### The Area of a Circle
This same trick works even for circles, if you are willing to make an infinite number of cuts. 

Imagine slicing a circular pizza into wedges. If you cut it into 4 wedges and arrange them side by side, pointing alternately up and down, they form a bumpy shape. Cut it into 16 wedges, and the shape begins to look like a parallelogram with slightly scalloped top and bottom edges.

As you cut the circle into thinner and thinner wedges (moving towards infinity), the scalloped edges become perfectly straight, and the shape becomes a perfect, flat-edged parallelogram.

What are the dimensions of this new parallelogram?
- Its height is exactly the length of the straight side of a wedge — which is the **radius ($r$)**.
- Its top and bottom edges are made of the circle's curved crust. Half the crust forms the top, and half forms the bottom. So the base is exactly half the circumference. Since the full circumference is $2\\pi r$, the base is just **$\\pi r$**.

The area of a parallelogram is base $\\times$ height. 
$\\text{Area} = (\\pi r) \\times (r)$
**$\\text{Area} = \\pi r^2$**

Through the magic of dissection, the seemingly impossible task of measuring a curved area is solved by turning it into a rectangle.`,
    },
  ],

  /* ─── Questions (50 total) ─────────────────────────────────────── */
  questions: [
    // ── MCQ (20) ────────────────────────────────────────────────────
    {
      kind: "mcq",
      prompt: "What is the perimeter of a shape?",
      options: [
        "The total amount of space inside the shape",
        "The total length around its external border",
        "The longest diagonal across the shape",
        "The number of corners it has",
      ],
      correct_index: 1,
      model_answer: "Perimeter is strictly the measurement of the total distance along the outside boundary of a 2D shape.",
      difficulty: "basic",
      section: "perimeter-basics",
    },
    {
      kind: "mcq",
      prompt: "Why can a one-dimensional ruler not be used to measure area?",
      options: [
        "Because rulers only measure in centimetres",
        "Because area is a two-dimensional space and a ruler has no width",
        "Because rulers are not long enough",
        "Because area is measured in degrees",
      ],
      correct_index: 1,
      model_answer: "A ruler measures length, which is one-dimensional. Area is two-dimensional, so it requires a two-dimensional unit (like a square) to measure.",
      difficulty: "basic",
      section: "area-basics",
    },
    {
      kind: "mcq",
      prompt: "What is the formula for the perimeter of a rectangle with length 'l' and width 'w'?",
      options: ["l + w", "l × w", "2(l + w)", "4(l + w)"],
      correct_index: 2,
      model_answer: "A rectangle has two lengths and two widths. Summing them gives 2l + 2w, which factors to 2(l + w).",
      difficulty: "basic",
      section: "perimeter-basics",
    },
    {
      kind: "mcq",
      prompt: "If you double the side length of an equilateral triangle, what happens to its perimeter?",
      options: [
        "It stays the same",
        "It doubles",
        "It triples",
        "It quadruples",
      ],
      correct_index: 1,
      model_answer: "Perimeter scales linearly with the side lengths. If sides are doubled, the total border length is exactly doubled.",
      difficulty: "intermediate",
      section: "perimeter-basics",
    },
    {
      kind: "mcq",
      prompt: "If you double the length and width of a rectangle, what happens to its area?",
      options: ["It stays the same", "It doubles", "It triples", "It quadruples"],
      correct_index: 3,
      model_answer: "Area scales with the square of the sides. 2 × 2 = 4, so the area quadruples.",
      difficulty: "intermediate",
      section: "area-basics",
    },
    {
      kind: "mcq",
      prompt: "In the dissection of a circle into a parallelogram, what does the height of the parallelogram represent?",
      options: ["The circumference", "The diameter", "The radius", "Pi"],
      correct_index: 2,
      model_answer: "The height is made of the straight side of the wedges, which perfectly corresponds to the radius (r) of the original circle.",
      difficulty: "intermediate",
      section: "area-by-dissection",
    },
    {
      kind: "mcq",
      prompt: "Which ancient mathematician trapped π between the perimeters of inscribed and circumscribed polygons?",
      options: [
        "Euclid",
        "Archimedes",
        "Brahmagupta",
        "Ptolemy",
      ],
      correct_index: 1,
      model_answer: "Archimedes of Syracuse used up to 96-sided polygons inside and outside a circle to establish strict upper and lower limits for π.",
      difficulty: "intermediate",
      section: "history-of-pi",
    },
    {
      kind: "mcq",
      prompt: "What significant mathematical shift did Mādhava of Sangamagrāma introduce to calculating π?",
      options: [
        "He measured string around a massive circular wheel",
        "He used a polygon with over 24,000 sides",
        "He expressed it as an exact infinite series of fractions",
        "He proved that π equals exactly 22/7",
      ],
      correct_index: 2,
      model_answer: "Mādhava moved away from geometry and discovered the first exact analytical formula for π using an infinite alternating series (calculus).",
      difficulty: "advanced",
      section: "history-of-pi",
    },
    {
      kind: "mcq",
      prompt: "Why is the Welsh mathematician William Jones significant in this context?",
      options: [
        "He calculated the first 100 digits of π",
        "He proved π was irrational",
        "He was the first to use the Greek letter π to denote the C/D ratio",
        "He discovered the equation C = 2πr",
      ],
      correct_index: 2,
      model_answer: "In 1706, Jones chose the symbol π for the ratio, standing for the Greek word 'perimetros' (perimeter).",
      difficulty: "intermediate",
      section: "history-of-pi",
    },
    {
      kind: "mcq",
      prompt: "Which of the following describes the number π?",
      options: [
        "It is a rational number",
        "It can be written as exactly 22/7",
        "It is an irrational number",
        "It has a repeating decimal pattern",
      ],
      correct_index: 2,
      model_answer: "π is irrational, meaning its decimal digits continue infinitely without any repeating pattern and it cannot be written as a perfect fraction.",
      difficulty: "basic",
      section: "pi-is-irrational",
    },
    {
      kind: "mcq",
      prompt: "What does it mean when we say a number is 'irrational'?",
      options: [
        "It is negative",
        "It cannot be expressed as a simple fraction of two integers",
        "It does not exist in real space",
        "It changes its value over time",
      ],
      correct_index: 1,
      model_answer: "An irrational number cannot be represented as p/q where p and q are integers.",
      difficulty: "basic",
      section: "pi-is-irrational",
    },
    {
      kind: "mcq",
      prompt: "What is the length of the arc of a semicircle with radius 'r'?",
      options: ["2πr", "πr", "πr/2", "4πr"],
      correct_index: 1,
      model_answer: "A semicircle is exactly half of a full circle. (1/2) × 2πr simplifies to πr.",
      difficulty: "basic",
      section: "arc-length",
    },
    {
      kind: "mcq",
      prompt: "What is the formula for the arc length of a circle segment that subtends an angle θ at the centre?",
      options: [
        "(θ / 360) × πr",
        "(θ / 180) × 2πr",
        "(θ / 360) × 2πr",
        "θ × 2πr",
      ],
      correct_index: 2,
      model_answer: "The arc length is a fraction of the total circumference (2πr). The fraction is the angle θ out of a full 360 degrees.",
      difficulty: "intermediate",
      section: "arc-length",
    },
    {
      kind: "mcq",
      prompt: "The fraction 355/113 is famous because:",
      options: [
        "It is the exact definition of π",
        "It was discovered by Archimedes",
        "It is an extremely close rational approximation of π discovered by Zu Chongzhi",
        "It proves that π is rational",
      ],
      correct_index: 2,
      model_answer: "Discovered in ancient China, it approximates π correctly to seven decimal places, and remained the best fraction for over 800 years.",
      difficulty: "advanced",
      section: "history-of-pi",
    },
    {
      kind: "mcq",
      prompt: "Why do runners in the outer lanes of a track race start further ahead?",
      options: [
        "They run faster",
        "The outer perimeter of the track is longer than the inner perimeter",
        "To prevent them from tripping over each other",
        "Because of wind resistance",
      ],
      correct_index: 1,
      model_answer: "The circumference of the outer curves is greater due to a larger radius. A 'stagger' is required so all runners cover the exact same total distance.",
      difficulty: "basic",
      section: "perimeter-basics",
    },
    {
      kind: "mcq",
      prompt: "If a circle has a diameter of 10 units, what is its exact circumference?",
      options: ["5π units", "10π units", "20π units", "100π units"],
      correct_index: 1,
      model_answer: "Using C = πD, replacing D with 10 gives C = 10π.",
      difficulty: "intermediate",
      section: "perimeter-of-circle",
    },
    {
      kind: "mcq",
      prompt: "Which date is celebrated internationally as Pi Day?",
      options: ["July 22", "March 14", "April 13", "May 9"],
      correct_index: 1,
      model_answer: "March 14 is written as 3/14 in the US format, matching the first three digits of π (3.14).",
      difficulty: "basic",
      section: "pi-is-irrational",
    },
    {
      kind: "mcq",
      prompt: "If the angle subtended by an arc at the centre is 90 degrees, what fraction of the full circumference is the arc length?",
      options: ["One-half", "One-third", "One-quarter", "One-eighth"],
      correct_index: 2,
      model_answer: "90 degrees is exactly 90/360, which simplifies to 1/4 (one-quarter) of the full circle.",
      difficulty: "basic",
      section: "arc-length",
    },
    {
      kind: "mcq",
      prompt: "A straight continuous line forming the boundary of a closed geometric figure is known as its:",
      options: ["Area", "Volume", "Perimeter", "Radius"],
      correct_index: 2,
      model_answer: "The total length of the boundary curve or lines of a closed figure is its perimeter.",
      difficulty: "basic",
      section: "perimeter-basics",
    },
    {
      kind: "mcq",
      prompt: "In Mādhava's infinite series for π/4 (1 - 1/3 + 1/5 - 1/7...), what happens as you add more terms?",
      options: [
        "The result becomes infinity",
        "The result fluctuates wildly without settling",
        "The sum gets increasingly closer to the exact true value of π/4",
        "It equals zero",
      ],
      correct_index: 2,
      model_answer: "This is a convergent series. Each term added refines the result, driving it closer and closer (to the limit) of the true exact value.",
      difficulty: "advanced",
      section: "history-of-pi",
    },

    // ── TRUE/FALSE (10) ─────────────────────────────────────────────
    {
      kind: "truefalse",
      prompt: "The area of a shape changes if you cut it into pieces and rearrange them.",
      options: ["True", "False"],
      correct_index: 1,
      model_answer: "False — the principle of dissection states that total area remains identical no matter how the pieces are rearranged.",
      difficulty: "basic",
      section: "area-by-dissection",
    },
    {
      kind: "truefalse",
      prompt: "The ratio of a circle's circumference to its diameter changes depending on how large the circle is.",
      options: ["True", "False"],
      correct_index: 1,
      model_answer: "False — the ratio C/D is exactly the same constant (π) for every perfect circle in the universe, regardless of scale.",
      difficulty: "intermediate",
      section: "perimeter-of-circle",
    },
    {
      kind: "truefalse",
      prompt: "Archimedes discovered the exact, perfect numerical value for π using polygons.",
      options: ["True", "False"],
      correct_index: 1,
      model_answer: "False — Archimedes only found an 'approximation' by establishing upper and lower bounds. Because π is irrational, an exact decimal cannot be found.",
      difficulty: "intermediate",
      section: "history-of-pi",
    },
    {
      kind: "truefalse",
      prompt: "Mādhava of Sangamagrāma represented π as an infinite sum of fractions.",
      options: ["True", "False"],
      correct_index: 0,
      model_answer: "True — he was the first to use an infinite series (1 - 1/3 + 1/5...) to calculate π exactly, shifting the math from geometry to early calculus.",
      difficulty: "advanced",
      section: "history-of-pi",
    },
    {
      kind: "truefalse",
      prompt: "The number π is exactly equal to the fraction 22/7.",
      options: ["True", "False"],
      correct_index: 1,
      model_answer: "False — 22/7 is merely a convenient rational approximation. π is irrational and cannot be equal to any simple fraction.",
      difficulty: "basic",
      section: "pi-is-irrational",
    },
    {
      kind: "truefalse",
      prompt: "The decimal expansion of π has no repeating pattern.",
      options: ["True", "False"],
      correct_index: 0,
      model_answer: "True — this is the defining characteristic of an irrational number; its decimals stretch to infinity without a repeating rhythm.",
      difficulty: "basic",
      section: "pi-is-irrational",
    },
    {
      kind: "truefalse",
      prompt: "An arc subtending 180 degrees at the centre is known as a semicircle.",
      options: ["True", "False"],
      correct_index: 0,
      model_answer: "True — 180 degrees is exactly half of the 360-degree circle, creating a perfect semicircle.",
      difficulty: "basic",
      section: "arc-length",
    },
    {
      kind: "truefalse",
      prompt: "The formula for the length of an arc relies on calculating a fraction of the total area of the circle.",
      options: ["True", "False"],
      correct_index: 1,
      model_answer: "False — arc length relies on calculating a fraction of the total CIRCUMFERENCE (perimeter), not the area.",
      difficulty: "intermediate",
      section: "arc-length",
    },
    {
      kind: "truefalse",
      prompt: "The stagger in a running track gives athletes in the outer lanes a physical advantage.",
      options: ["True", "False"],
      correct_index: 1,
      model_answer: "False — the stagger is specifically designed to eliminate advantage by ensuring every runner traverses the exact same total distance.",
      difficulty: "basic",
      section: "perimeter-basics",
    },
    {
      kind: "truefalse",
      prompt: "Area is always measured in squared units like cm².",
      options: ["True", "False"],
      correct_index: 0,
      model_answer: "True — because area measures 2D space, the standard unit is a 2D square (e.g., 1 cm × 1 cm).",
      difficulty: "basic",
      section: "area-basics",
    },

    // ── MULTI (8) ───────────────────────────────────────────────────
    {
      kind: "multi",
      prompt: "Which of the following are valid formulas for area?",
      options: [
        "Rectangle: length × width",
        "Circle: πr²",
        "Square: 4 × side",
        "Triangle: ½ × base × height",
      ],
      correct_indices: [0, 1, 3],
      model_answer: "The formula 4 × side calculates the perimeter of a square, not its area. The other three correctly calculate 2D area.",
      difficulty: "intermediate",
      section: "area-basics",
    },
    {
      kind: "multi",
      prompt: "Which of the following numbers are considered approximations of π?",
      options: [
        "3.14",
        "22/7",
        "355/113",
        "1",
      ],
      correct_indices: [0, 1, 2],
      model_answer: "3.14, 22/7, and 355/113 are all historically used and highly effective numerical approximations for the true irrational value of π.",
      difficulty: "basic",
      section: "pi-is-irrational",
    },
    {
      kind: "multi",
      prompt: "Which mathematicians made significant historical contributions to the calculation of π?",
      options: [
        "Archimedes",
        "Brahmagupta",
        "Zu Chongzhi",
        "William Jones (Symbol)",
      ],
      correct_indices: [0, 2, 3],
      model_answer: "Archimedes and Zu Chongzhi made calculations with polygon approximations, and Jones gave it the symbol. Brahmagupta is famous for his work with zero and integers, not primarily for calculating π.",
      difficulty: "advanced",
      section: "history-of-pi",
    },
    {
      kind: "multi",
      prompt: "Select ALL the true statements regarding irrational numbers like π.",
      options: [
        "They cannot be written as a fraction p/q of integers",
        "Their decimal expansions terminate (end) eventually",
        "Their decimal expansions go on forever without a repeating block",
        "They can be perfectly calculated using a straight ruler",
      ],
      correct_indices: [0, 2],
      model_answer: "Irrational numbers cannot be expressed as simple fractions, meaning their decimals are infinite and non-repeating.",
      difficulty: "intermediate",
      section: "pi-is-irrational",
    },
    {
      kind: "multi",
      prompt: "If you have a circle with radius 10, what forms represent its circumference?",
      options: [
        "20π",
        "10π",
        "approx 62.8",
        "100",
      ],
      correct_indices: [0, 2],
      model_answer: "C = 2πr = 2π(10) = 20π. Using 3.14 for π, this is approximately 62.8.",
      difficulty: "intermediate",
      section: "perimeter-of-circle",
    },
    {
      kind: "multi",
      prompt: "When dissecting a circle into a parallelogram to find its area, which statements are true?",
      options: [
        "The height of the parallelogram is r",
        "The base of the parallelogram is 2πr",
        "The base of the parallelogram is πr",
        "The area is πr²",
      ],
      correct_indices: [0, 2, 3],
      model_answer: "The base is half the circumference (πr), not the full 2πr.",
      difficulty: "advanced",
      section: "area-by-dissection",
    },
    {
      kind: "multi",
      prompt: "How did Archimedes 'trap' the value of π?",
      options: [
        "He inscribed polygons inside the circle (smaller perimeter)",
        "He circumscribed polygons outside the circle (larger perimeter)",
        "He used calculus to sum infinite fractions",
        "He guessed it based on planetary orbits",
      ],
      correct_indices: [0, 1],
      model_answer: "He created geometric upper and lower bounds by drawing straight-edged polygons tightly inside and outside the circular curve.",
      difficulty: "advanced",
      section: "history-of-pi",
    },
    {
      kind: "multi",
      prompt: "The formula (θ / 360) × 2πr requires which pieces of information to solve for arc length?",
      options: [
        "The radius of the circle",
        "The angle subtended by the arc",
        "The area of the circle",
        "The weight of the circle",
      ],
      correct_indices: [0, 1],
      model_answer: "You only need the radius (r) to find total circumference, and the central angle (θ) to find the specific fraction of the boundary.",
      difficulty: "basic",
      section: "arc-length",
    },

    // ── QUICKFIRE (6) ───────────────────────────────────────────────
    {
      kind: "quickfire",
      prompt: "What is the fundamental unit used to measure two-dimensional space?",
      model_answer: "Unit square",
      difficulty: "basic",
      section: "area-basics",
    },
    {
      kind: "quickfire",
      prompt: "What is the specific geometric term for the perimeter of a circle?",
      model_answer: "Circumference",
      difficulty: "basic",
      section: "perimeter-of-circle",
    },
    {
      kind: "quickfire",
      prompt: "What is the area of a rectangle with length 5 cm and width 3 cm?",
      model_answer: "15 cm²",
      difficulty: "basic",
      section: "area-basics",
    },
    {
      kind: "quickfire",
      prompt: "What type of number cannot be written as a simple fraction and has a non-repeating, infinite decimal?",
      model_answer: "Irrational number",
      difficulty: "intermediate",
      section: "pi-is-irrational",
    },
    {
      kind: "quickfire",
      prompt: "What is a continuous portion of a circle's circumference called?",
      model_answer: "Arc",
      difficulty: "basic",
      section: "arc-length",
    },
    {
      kind: "quickfire",
      prompt: "If an arc subtends 90 degrees at the centre, what fraction of the total circumference is it?",
      model_answer: "One-quarter (1/4)",
      difficulty: "basic",
      section: "arc-length",
    },

    // ── OPEN (6) ────────────────────────────────────────────────────
    {
      kind: "open",
      prompt: "Explain the difference between perimeter and area, and why they require different units of measurement.",
      model_answer: "Perimeter is the 1D length of a shape's outer boundary, measured in linear units like cm. Area is the amount of 2D space inside the boundary, which must be measured in 2D units like square centimetres (cm²). A standard 1D ruler cannot measure 2D space because it has no width.",
      difficulty: "intermediate",
      section: "area-basics",
    },
    {
      kind: "open",
      prompt: "Describe the logic behind Archimedes' method for estimating π using polygons.",
      model_answer: "A circle's curved circumference is hard to measure with a straight ruler. Archimedes used polygons, whose straight perimeters are easy to calculate. A polygon perfectly inside the circle must have a smaller perimeter than the circle, and a polygon perfectly outside must have a larger perimeter. By using polygons with many sides (up to 96), he created a tight numerical 'trap' that π had to fall between.",
      difficulty: "advanced",
      section: "history-of-pi",
    },
    {
      kind: "open",
      prompt: "Why was Mādhava's discovery of the infinite series for π considered a monumental shift in mathematics?",
      model_answer: "Before Mādhava, mathematicians relied strictly on geometry — drawing physical shapes and counting sides to approximate π. Mādhava broke away from geometry entirely, showing that π could be expressed purely analytically as the limit of an infinite sum of fractions. This conceptual leap laid the foundations for modern calculus.",
      difficulty: "advanced",
      section: "history-of-pi",
    },
    {
      kind: "open",
      prompt: "If π is irrational, why do we use 22/7 in school calculations?",
      model_answer: "Because π is an infinite, non-repeating decimal, it is impossible to use its absolute true value in standard arithmetic. The rational fraction 22/7 evaluates to roughly 3.1428, which is extremely close to the true value of π (3.1415...). It is mathematically simpler to multiply and divide by a fraction than an infinite decimal, providing answers that are highly accurate for practical purposes.",
      difficulty: "intermediate",
      section: "pi-is-irrational",
    },
    {
      kind: "open",
      prompt: "Describe how you can find the area of a circle by dissecting it.",
      model_answer: "You slice the circle into many thin wedges and interlock them alternately pointing up and down. This forms a bumpy shape that approaches a perfect parallelogram as the wedges get infinitely thin. The height of this parallelogram is the circle's radius (r), and its base is half the circumference (πr). Multiplying base by height gives the area: πr².",
      difficulty: "advanced",
      section: "area-by-dissection",
    },
    {
      kind: "open",
      prompt: "Why does doubling the side lengths of a square exactly double its perimeter?",
      model_answer: "The perimeter of a square is the sum of its four identical sides, given by the formula P = 4a. If you double the side length to 2a, the new perimeter formula becomes P = 4(2a) = 8a. Since 8a is exactly twice 4a, the perimeter scales perfectly linearly with the side length.",
      difficulty: "basic",
      section: "perimeter-basics",
    },
  ],
};
