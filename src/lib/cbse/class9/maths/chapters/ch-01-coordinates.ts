import type { Chapter } from "@/lib/cbse/types";
import {
  coordinatePlaneFigure,
  distanceFormulaFigure,
} from "../figures/ch-01";
import type { GraphPlotSpec, GeometryBoardSpec } from "@/lib/sim/types";

/* ─── Sim specs ──────────────────────────────────────────────────── */

const simpleGridSim: GraphPlotSpec = {
  kind: "graph-plot",
  title: "A Coordinate Grid",
  altText:
    "A blank Cartesian coordinate plane showing the intersecting x and y axes with a single point plotted.",
  inputs: [],
  xRange: [-5, 5],
  yRange: [-5, 5],
  xLabel: "x-axis",
  yLabel: "y-axis",
  series: [],
  points: [
    { x: 3, y: 4, label: "(3, 4)" }
  ],
};


const quadrantSim: GraphPlotSpec = {
  kind: "graph-plot",
  title: "The Four Quadrants",
  altText:
    "A Cartesian coordinate plane with four points plotted, one in each quadrant, illustrating how the signs of the x and y coordinates determine the quadrant.",
  inputs: [],
  xRange: [-8, 8],
  yRange: [-8, 8],
  xLabel: "x-axis",
  yLabel: "y-axis",
  series: [],
  points: [
    { x: 4, y: 5, label: "P(4, 5) — Quad I" },
    { x: -5, y: 3, label: "Q(-5, 3) — Quad II" },
    { x: -6, y: -4, label: "R(-6, -4) — Quad III" },
    { x: 3, y: -6, label: "S(3, -6) — Quad IV" },
    { x: 0, y: 0, label: "Origin (0, 0)" },
  ],
};

const distanceSim: GeometryBoardSpec = {
  kind: "geometry-board",
  title: "Distance Between Points",
  altText:
    "An interactive coordinate board showing a right triangle formed by two points. The hypotenuse represents the straight-line distance between them.",
  viewBox: [400, 300],
  gridSize: 20,
  vertices: [
    { id: "P", label: "P", at: [100, 200] },
    { id: "Q", label: "Q", at: [300, 100] },
    { id: "R", label: "R", at: [300, 200], draggable: false }
  ],
  polygon: ["P", "R", "Q"],
  readouts: [
    {
      label: "Distance PQ",
      compute: (pts) => {
        const dx = (pts.Q.x - pts.P.x) / 20;
        const dy = (pts.Q.y - pts.P.y) / 20;
        return Math.sqrt(dx * dx + dy * dy).toFixed(1) + " units";
      }
    }
  ]
};

/* ─── Chapter ────────────────────────────────────────────────────── */

export const ch01Coordinates: Chapter = {
  key: "ch-01-coordinates",
  number: 1,
  title: "Orienting Yourself: The Use of Coordinates",
  subject: "maths",
  book: "Ganita Manjari",
  accent: "#9fb3ff",
  summary: "Learn how to precisely locate any point in a two-dimensional space using the Cartesian coordinate system.",
  estMinutes: 20,

  sections: [
    /* ── S1 ─────────────────────────────────────────────────────── */
    {
      key: "the-need-for-coordinates",
      title: "Locating Objects in Space",
      eyebrow: "The idea",
      bookRef: "Ganita Manjari §1.1",
      body: `> A system of coordinates is a structured framework (like the grid lines on a map or graph paper) that enables us to use numbers to describe the exact physical locations of points or objects.
> — *Ganita Manjari*, §1.1

This is the core idea of coordinate geometry: using a pair of numbers to precisely locate a point on a flat surface (a two-dimensional plane).

You already use this idea constantly without calling it coordinate geometry. A seat number in a cinema — say, row G, seat 14 — is really just two coordinates: one number locating the row, another locating the position along it. A game of chess does the same thing, describing a square as "e4" by combining a letter (column) with a number (row). Mathematics simply formalises this everyday habit of pinning down a location with a pair of numbers, and makes it powerful enough to describe not just seats and squares, but any point on an infinitely fine plane.

### The Cartesian System
To establish this system in mathematics, we draw two straight lines perpendicular to each other on a plane. 
- The horizontal line is called the **x-axis**.
- The vertical line is called the **y-axis**.
- The point where these two lines intersect is called the **origin** (usually denoted by $O$).

Distances measured to the right of the origin along the x-axis are positive, while distances to the left are negative. Similarly, distances measured upwards from the origin along the y-axis are positive, and distances downwards are negative.

With these two intersecting number lines, the entire plane — known as the **Cartesian plane** or the coordinate plane — becomes a grid where every single point can be uniquely identified.`,
      sim: simpleGridSim,
      note: {
        kind: "fact",
        title: "Who invented it?",
        body: "The Cartesian coordinate system was invented by the French mathematician and philosopher René Descartes in the 17th century, allegedly while watching a fly crawl on his ceiling.",
      },
    },

    /* ── S2 ─────────────────────────────────────────────────────── */
    {
      key: "coordinates-of-a-point",
      figures: [coordinatePlaneFigure],
      title: "Reading and Writing Coordinates",
      eyebrow: "The (x, y) pair",
      bookRef: "Ganita Manjari §1.3",
      body: `To locate any point on the Cartesian plane, we use a pair of numbers written in brackets, like $(3, 5)$. These two numbers are the **coordinates** of the point.

The order in which you write these numbers is strictly fixed. The first number is always the **x-coordinate**, and the second number is always the **y-coordinate**. 

- The **x-coordinate** represents the perpendicular distance of the point from the y-axis. It tells you how far to move left or right from the origin.
- The **y-coordinate** represents the perpendicular distance of the point from the x-axis. It tells you how far to move up or down.

### Plotting a point
Suppose you want to plot the point $P(4, 2)$. 
1. Start at the origin $(0, 0)$.
2. Look at the x-coordinate (4). Since it is positive, move 4 units to the right along the x-axis.
3. Look at the y-coordinate (2). Since it is positive, move 2 units straight up from your current position.
4. Mark the point. This is $P(4, 2)$.

### Points on the axes
What happens if a point lies directly on one of the axes?
- If a point lies on the **x-axis**, its distance from the x-axis is zero, so its y-coordinate is $0$. Any point on the x-axis has coordinates of the form $(x, 0)$.
- If a point lies on the **y-axis**, its distance from the y-axis is zero, so its x-coordinate is $0$. Any point on the y-axis has coordinates of the form $(0, y)$.
- The **origin** lies on both axes simultaneously, so its coordinates are exactly $(0, 0)$.`,
      note: {
        kind: "watch-out",
        body: "The order matters! The point (3, 5) is completely different from the point (5, 3) — swapping the two numbers moves you to an entirely different location. Always write the x-coordinate first.",
      },
    },

    /* ── S3 ─────────────────────────────────────────────────────── */
    {
      key: "the-four-quadrants",
      title: "The Four Quadrants",
      eyebrow: "Dividing the plane",
      bookRef: "Ganita Manjari §1.3",
      body: `The two intersecting axes divide the Cartesian plane into four distinct regions. These four regions are called **quadrants**. By convention, we number them from I to IV in an anti-clockwise direction, starting from the top-right region.

Because of how the positive and negative numbers are arranged on the axes, each quadrant has a unique signature of signs for its coordinates $(x, y)$:

- **Quadrant I (Top-Right):** You move right (positive $x$) and up (positive $y$). Both coordinates are positive: $(+, +)$. Example: $(4, 5)$.
- **Quadrant II (Top-Left):** You move left (negative $x$) and up (positive $y$). The x-coordinate is negative, but the y-coordinate is positive: $(-, +)$. Example: $(-5, 3)$.
- **Quadrant III (Bottom-Left):** You move left (negative $x$) and down (negative $y$). Both coordinates are negative: $(-, -)$. Example: $(-6, -4)$.
- **Quadrant IV (Bottom-Right):** You move right (positive $x$) and down (negative $y$). The x-coordinate is positive, but the y-coordinate is negative: $(+, -)$. Example: $(3, -6)$.

By simply looking at the signs of a coordinate pair, you can instantly know which quadrant the point lives in, without even drawing a graph.

Quadrants come up constantly outside the maths classroom too. A chart plotting deviation from average alongside distance from a reference line sorts naturally into the same four sign patterns, whether it is tracking rainfall against a seasonal norm or profit against a target. Learning to read the sign pattern at a glance, rather than plotting every point by hand, is what makes quadrants genuinely useful rather than just decorative.`,
      sim: quadrantSim,
      note: {
        kind: "remember",
        body: "Points that lie exactly on the x-axis or y-axis do not belong to any quadrant; they form the boundaries between quadrants, and the origin — common to all four boundaries — belongs to none of them either.",
      },
    },

    /* ── S4 ─────────────────────────────────────────────────────── */
    {
      key: "reflections",
      title: "Reflections in the Plane",
      eyebrow: "Mirror images",
      bookRef: "Ganita Manjari §1.3",
      body: `The coordinate plane is highly symmetrical. You can think of the x-axis and the y-axis as flat mirrors. When you reflect a point across one of these axes, its coordinates change in a very predictable way.

### Reflecting across the x-axis
Imagine placing a mirror on the horizontal x-axis. A point that is 3 units above the x-axis will have a reflection that is 3 units below the x-axis. The horizontal position (x-coordinate) does not change at all. Only the y-coordinate flips its sign.
- If $A(4, 3)$ is reflected across the x-axis, its image is $A'(4, -3)$.
- In general, the reflection of $(x, y)$ across the x-axis is $(x, -y)$.

### Reflecting across the y-axis
Now place the mirror on the vertical y-axis. A point that is 5 units to the right of the y-axis will reflect to a point 5 units to the left. This time, the vertical height (y-coordinate) stays exactly the same, but the x-coordinate flips its sign.
- If $B(5, 2)$ is reflected across the y-axis, its image is $B'(-5, 2)$.
- In general, the reflection of $(x, y)$ across the y-axis is $(-x, y)$.

### Reflecting through the origin
You can also combine both reflections at once. Reflecting a point across the x-axis and then across the y-axis (in either order) lands you diagonally opposite the origin from where you started: the reflection of $(x, y)$ through the origin is $(-x, -y)$.

This mirror property is incredibly useful in computer graphics and design, allowing artists to draw half a shape and instantly generate the perfectly symmetrical other half just by flipping the signs of the coordinates.`,
      note: {
        kind: "exam-tip",
        body: "When reflecting across an axis, the coordinate of THAT axis stays the same, while the OTHER coordinate flips its sign. Reflecting through the origin instead flips both signs at once.",
      },
    },

    /* ── S5 ─────────────────────────────────────────────────────── */
    {
      key: "distance-formula",
      figures: [distanceFormulaFigure],
      title: "Distance Between Two Points",
      eyebrow: "Using Pythagoras",
      bookRef: "Ganita Manjari §1.4",
      body: `If you have two points on a horizontal line, say $(2, 4)$ and $(7, 4)$, finding the distance between them is easy: just subtract their x-coordinates ($7 - 2 = 5$ units). The same logic works for a vertical line. But what if the two points are positioned diagonally from each other?

To find the direct, straight-line distance between any two points in the plane, we use a right-angled triangle and the **Baudhāyana–Pythagoras Theorem**.

Imagine two points, $P(x_1, y_1)$ and $Q(x_2, y_2)$. If you draw a horizontal line through $P$ and a vertical line through $Q$, they meet at a third point $R(x_2, y_1)$, forming a right-angled triangle $PQR$.

- The horizontal distance (base $PR$) is $(x_2 - x_1)$.
- The vertical distance (height $QR$) is $(y_2 - y_1)$.

According to the Pythagoras Theorem, the square of the hypotenuse ($PQ$) equals the sum of the squares of the other two sides:
$PQ^2 = (x_2 - x_1)^2 + (y_2 - y_1)^2$

Taking the square root of both sides gives us the **Distance Formula**:
Distance $= \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$

Because you are squaring the differences, it does not matter if the result inside the brackets is negative; squaring it will always make it positive. This powerful formula allows you to calculate the precise distance between any two locations on the grid.

For example, the distance between $(1, 2)$ and $(4, 6)$ is $\\sqrt{(4-1)^2 + (6-2)^2} = \\sqrt{9 + 16} = \\sqrt{25} = 5$ units — the exact same triangle-based reasoning the interactive tool below walks through step by step.`,
      sim: distanceSim,
    },
  ],

  /* ─── Questions (50 total) ─────────────────────────────────────── */
  questions: [
    // ── MCQ (20) ────────────────────────────────────────────────────
    {
      kind: "mcq",
      prompt: "What is the name of the horizontal line in the Cartesian coordinate system?",
      options: ["y-axis", "Origin", "x-axis", "Quadrant line"],
      correct_index: 2,
      model_answer: "By convention, the horizontal axis is called the x-axis.",
      difficulty: "basic",
      section: "the-need-for-coordinates",
    },
    {
      kind: "mcq",
      prompt: "What are the coordinates of the origin?",
      options: ["(1, 1)", "(0, 1)", "(1, 0)", "(0, 0)"],
      correct_index: 3,
      model_answer: "The origin is the point where the x-axis and y-axis intersect, so its distance from both axes is zero, giving it coordinates (0, 0).",
      difficulty: "basic",
      section: "the-need-for-coordinates",
    },
    {
      kind: "mcq",
      prompt: "If a point lies on the y-axis, which of the following must be true?",
      options: ["Its y-coordinate is 0", "Its x-coordinate is 0", "Both coordinates are 0", "It is in Quadrant I"],
      correct_index: 1,
      model_answer: "A point on the y-axis has zero horizontal distance from the y-axis, meaning its x-coordinate must be exactly 0.",
      difficulty: "intermediate",
      section: "coordinates-of-a-point",
    },
    {
      kind: "mcq",
      prompt: "In the coordinate pair (7, -3), what does the number 7 represent?",
      options: ["The y-coordinate", "The x-coordinate", "The distance from the x-axis", "The origin"],
      correct_index: 1,
      model_answer: "The first number in an ordered pair is always the x-coordinate, representing the horizontal position.",
      difficulty: "basic",
      section: "coordinates-of-a-point",
    },
    {
      kind: "mcq",
      prompt: "Which quadrant does the point (-4, 5) lie in?",
      options: ["Quadrant I", "Quadrant II", "Quadrant III", "Quadrant IV"],
      correct_index: 1,
      model_answer: "The x-coordinate is negative (left) and the y-coordinate is positive (up), placing the point in Quadrant II.",
      difficulty: "basic",
      section: "the-four-quadrants",
    },
    {
      kind: "mcq",
      prompt: "In which quadrant are both the x and y coordinates negative?",
      options: ["Quadrant I", "Quadrant II", "Quadrant III", "Quadrant IV"],
      correct_index: 2,
      model_answer: "In Quadrant III, you move left (negative x) and down (negative y), making both coordinates negative.",
      difficulty: "basic",
      section: "the-four-quadrants",
    },
    {
      kind: "mcq",
      prompt: "The point (5, -2) lies in which quadrant?",
      options: ["Quadrant I", "Quadrant II", "Quadrant III", "Quadrant IV"],
      correct_index: 3,
      model_answer: "The x-coordinate is positive (right) and the y-coordinate is negative (down), placing it in Quadrant IV.",
      difficulty: "basic",
      section: "the-four-quadrants",
    },
    {
      kind: "mcq",
      prompt: "What is the reflection of the point (3, 4) across the x-axis?",
      options: ["(-3, 4)", "(3, -4)", "(-3, -4)", "(4, 3)"],
      correct_index: 1,
      model_answer: "When reflecting across the x-axis, the x-coordinate stays the same and the y-coordinate flips its sign, resulting in (3, -4).",
      difficulty: "intermediate",
      section: "reflections",
    },
    {
      kind: "mcq",
      prompt: "What is the reflection of the point (-6, 2) across the y-axis?",
      options: ["(6, 2)", "(-6, -2)", "(6, -2)", "(2, -6)"],
      correct_index: 0,
      model_answer: "When reflecting across the y-axis, the y-coordinate stays the same and the x-coordinate flips its sign, resulting in (6, 2).",
      difficulty: "intermediate",
      section: "reflections",
    },
    {
      kind: "mcq",
      prompt: "Which theorem is the foundation for the distance formula between two points?",
      options: ["Thales' Theorem", "Baudhāyana–Pythagoras Theorem", "Archimedes' Principle", "Euclid's First Postulate"],
      correct_index: 1,
      model_answer: "The distance formula is derived directly from the Pythagoras Theorem by creating a right-angled triangle between the two points.",
      difficulty: "basic",
      section: "distance-formula",
    },
    {
      kind: "mcq",
      prompt: "What is the distance between the points (2, 5) and (2, 9)?",
      options: ["2 units", "4 units", "7 units", "14 units"],
      correct_index: 1,
      model_answer: "Since the x-coordinates are identical, they lie on a vertical line. The distance is simply the difference in their y-coordinates: 9 - 5 = 4 units.",
      difficulty: "intermediate",
      section: "distance-formula",
    },
    {
      kind: "mcq",
      prompt: "The distance between the origin (0,0) and the point (3,4) is:",
      options: ["5 units", "7 units", "12 units", "25 units"],
      correct_index: 0,
      model_answer: "Using the distance formula: square root of (3^2 + 4^2) = square root of (9 + 16) = square root of 25 = 5 units.",
      difficulty: "intermediate",
      section: "distance-formula",
    },
    {
      kind: "mcq",
      prompt: "If a point is situated 5 units to the left of the y-axis and 2 units below the x-axis, what are its coordinates?",
      options: ["(5, 2)", "(-5, 2)", "(5, -2)", "(-5, -2)"],
      correct_index: 3,
      model_answer: "Left of the y-axis means x = -5. Below the x-axis means y = -2. The coordinates are (-5, -2).",
      difficulty: "intermediate",
      section: "coordinates-of-a-point",
    },
    {
      kind: "mcq",
      prompt: "Which of the following points lies on the x-axis?",
      options: ["(0, 5)", "(-3, 0)", "(2, 2)", "(0, -4)"],
      correct_index: 1,
      model_answer: "Any point on the x-axis has a y-coordinate of 0. (-3, 0) fits this requirement.",
      difficulty: "basic",
      section: "coordinates-of-a-point",
    },
    {
      kind: "mcq",
      prompt: "A point is reflected across the y-axis to become (-8, -1). What were its original coordinates?",
      options: ["(8, -1)", "(-8, 1)", "(8, 1)", "(-1, -8)"],
      correct_index: 0,
      model_answer: "Reflecting across the y-axis flips the x-coordinate. So the original x-coordinate was 8, making the original point (8, -1).",
      difficulty: "advanced",
      section: "reflections",
    },
    {
      kind: "mcq",
      prompt: "In the distance formula, why is it unnecessary to worry about which point is (x1, y1) and which is (x2, y2)?",
      options: [
        "Because distance is always zero",
        "Because subtraction is commutative",
        "Because squaring a negative difference results in a positive number",
        "Because coordinates are always positive",
      ],
      correct_index: 2,
      model_answer: "Whether (x2-x1) yields 3 or -3, squaring it yields 9. The square of any real number difference is positive, making the order irrelevant.",
      difficulty: "advanced",
      section: "distance-formula",
    },
    {
      kind: "mcq",
      prompt: "How many quadrants does the Cartesian plane have?",
      options: ["Two", "Three", "Four", "Eight"],
      correct_index: 2,
      model_answer: "The intersection of the x and y axes divides the plane into exactly four quadrants.",
      difficulty: "basic",
      section: "the-four-quadrants",
    },
    {
      kind: "mcq",
      prompt: "What is the perpendicular distance of the point P(8, -3) from the y-axis?",
      options: ["-3 units", "3 units", "8 units", "5 units"],
      correct_index: 2,
      model_answer: "The perpendicular distance from the y-axis is the absolute value of the x-coordinate, which is 8 units.",
      difficulty: "advanced",
      section: "coordinates-of-a-point",
    },
    {
      kind: "mcq",
      prompt: "Which pair of points are reflections of each other across the origin?",
      options: ["(2, 3) and (-2, 3)", "(2, 3) and (2, -3)", "(2, 3) and (-2, -3)", "(2, 3) and (3, 2)"],
      correct_index: 2,
      model_answer: "Reflecting across the origin flips the signs of BOTH coordinates, mapping (x, y) to (-x, -y). So (2, 3) becomes (-2, -3).",
      difficulty: "advanced",
      section: "reflections",
    },
    {
      kind: "mcq",
      prompt: "The distance between (0, 0) and (x, y) is given by:",
      options: ["x + y", "square root of (x + y)", "square root of (x^2 + y^2)", "x^2 + y^2"],
      correct_index: 2,
      model_answer: "Substituting (0, 0) into the distance formula gives square root of ((x-0)^2 + (y-0)^2), which simplifies to square root of (x^2 + y^2).",
      difficulty: "intermediate",
      section: "distance-formula",
    },

    // ── TRUE/FALSE (10) ─────────────────────────────────────────────
    {
      kind: "truefalse",
      prompt: "The y-axis is the horizontal line on the Cartesian plane.",
      options: ["True", "False"],
      correct_index: 1,
      model_answer: "False — the y-axis is the vertical line. The x-axis is horizontal.",
      difficulty: "basic",
      section: "the-need-for-coordinates",
    },
    {
      kind: "truefalse",
      prompt: "The point (4, 7) represents the exact same location as the point (7, 4).",
      options: ["True", "False"],
      correct_index: 1,
      model_answer: "False — the order matters entirely. (4, 7) means 4 units right and 7 units up, while (7, 4) means 7 units right and 4 units up.",
      difficulty: "basic",
      section: "coordinates-of-a-point",
    },
    {
      kind: "truefalse",
      prompt: "The point (-2, 0) lies in Quadrant II.",
      options: ["True", "False"],
      correct_index: 1,
      model_answer: "False — points with a zero coordinate lie exactly on an axis (in this case, the x-axis) and do not belong to any quadrant.",
      difficulty: "intermediate",
      section: "the-four-quadrants",
    },
    {
      kind: "truefalse",
      prompt: "Quadrant I contains points where both x and y coordinates are positive.",
      options: ["True", "False"],
      correct_index: 0,
      model_answer: "True — in the top-right quadrant, you move right (positive) and up (positive).",
      difficulty: "basic",
      section: "the-four-quadrants",
    },
    {
      kind: "truefalse",
      prompt: "Reflecting a point across the x-axis changes the sign of its y-coordinate.",
      options: ["True", "False"],
      correct_index: 0,
      model_answer: "True — the horizontal position (x) remains identical, but the vertical position (y) flips from above the axis to below it (or vice versa).",
      difficulty: "intermediate",
      section: "reflections",
    },
    {
      kind: "truefalse",
      prompt: "The distance between two points can sometimes be a negative number.",
      options: ["True", "False"],
      correct_index: 1,
      model_answer: "False — distance is a physical measurement of length and is always positive (or zero if the points are identical). The square root in the formula ensures a positive result.",
      difficulty: "intermediate",
      section: "distance-formula",
    },
    {
      kind: "truefalse",
      prompt: "The origin is the only point on the Cartesian plane that lies on both axes simultaneously.",
      options: ["True", "False"],
      correct_index: 0,
      model_answer: "True — the origin (0, 0) is precisely the intersection point of the x-axis and the y-axis.",
      difficulty: "basic",
      section: "the-need-for-coordinates",
    },
    {
      kind: "truefalse",
      prompt: "The distance between (3, 2) and (8, 2) is 5 units.",
      options: ["True", "False"],
      correct_index: 0,
      model_answer: "True — since they lie on the same horizontal line (y=2), the distance is just the difference in their x-coordinates: 8 - 3 = 5.",
      difficulty: "basic",
      section: "distance-formula",
    },
    {
      kind: "truefalse",
      prompt: "If a point is reflected across the y-axis, its distance from the origin changes.",
      options: ["True", "False"],
      correct_index: 1,
      model_answer: "False — reflection acts like a mirror; it preserves all lengths and distances. The reflected point is exactly the same distance from the origin as the original point.",
      difficulty: "advanced",
      section: "reflections",
    },
    {
      kind: "truefalse",
      prompt: "The y-coordinate of a point indicates its perpendicular distance from the x-axis.",
      options: ["True", "False"],
      correct_index: 0,
      model_answer: "True — the y-coordinate tells you how far up or down the point is, which is measured perpendicularly from the horizontal x-axis.",
      difficulty: "advanced",
      section: "coordinates-of-a-point",
    },

    // ── MULTI (8) ───────────────────────────────────────────────────
    {
      kind: "multi",
      prompt: "Which of the following points lie on the y-axis?",
      options: ["(0, 7)", "(5, 0)", "(0, -2)", "(-3, 0)", "(0, 0)"],
      correct_indices: [0, 2, 4],
      model_answer: "Any point on the y-axis must have an x-coordinate of 0. Points (0, 7), (0, -2), and the origin (0, 0) fit this rule.",
      difficulty: "intermediate",
      section: "coordinates-of-a-point",
    },
    {
      kind: "multi",
      prompt: "Which of the following points lie in Quadrant III?",
      options: ["(-4, -9)", "(2, -3)", "(-1, 5)", "(-6, -2)"],
      correct_indices: [0, 3],
      model_answer: "Quadrant III contains points where BOTH coordinates are negative. (-4, -9) and (-6, -2) fit this condition.",
      difficulty: "basic",
      section: "the-four-quadrants",
    },
    {
      kind: "multi",
      prompt: "Select ALL the true statements regarding the Cartesian plane.",
      options: [
        "The axes are perpendicular to each other",
        "Quadrant II is in the bottom-right corner",
        "The x-axis is horizontal",
        "Distances to the left of the origin are positive",
      ],
      correct_indices: [0, 2],
      model_answer: "The axes intersect at 90 degrees (perpendicular) and the x-axis is horizontal. Quadrant II is top-left, and leftwards distances are negative.",
      difficulty: "basic",
      section: "the-need-for-coordinates",
    },
    {
      kind: "multi",
      prompt: "If you reflect the point P(4, 5) across the x-axis to get P', and then reflect P' across the y-axis to get P'', what are the coordinates of these images?",
      options: [
        "P' is (4, -5)",
        "P' is (-4, 5)",
        "P'' is (-4, -5)",
        "P'' is (-4, 5)",
      ],
      correct_indices: [0, 2],
      model_answer: "Reflecting across the x-axis flips the y-coordinate, making P'(4, -5). Reflecting THAT across the y-axis flips the x-coordinate, making P''(-4, -5).",
      difficulty: "advanced",
      section: "reflections",
    },
    {
      kind: "multi",
      prompt: "Which pairs of points are exactly 5 units apart?",
      options: [
        "(0, 0) and (3, 4)",
        "(1, 1) and (1, 6)",
        "(2, 2) and (7, 2)",
        "(0, 0) and (5, 5)",
      ],
      correct_indices: [0, 1, 2],
      model_answer: "(0,0) to (3,4) is 5 units via Pythagoras. (1,1) to (1,6) is a vertical 5 units. (2,2) to (7,2) is a horizontal 5 units. (0,0) to (5,5) is roughly 7.07 units.",
      difficulty: "advanced",
      section: "distance-formula",
    },
    {
      kind: "multi",
      prompt: "Which of the following points do NOT belong to any quadrant?",
      options: ["(0, 8)", "(3, -3)", "(-5, 0)", "(0, 0)", "(-2, -2)"],
      correct_indices: [0, 2, 3],
      model_answer: "Points with a zero coordinate lie on the boundary axes, not inside the quadrant regions themselves.",
      difficulty: "intermediate",
      section: "the-four-quadrants",
    },
    {
      kind: "multi",
      prompt: "What information is needed to uniquely locate a point on the Cartesian plane?",
      options: [
        "Its distance from the x-axis",
        "Its distance from the y-axis",
        "Its quadrant only",
        "The signs indicating direction (left/right, up/down)",
      ],
      correct_indices: [0, 1, 3],
      model_answer: "To locate a point uniquely, you need both perpendicular distances and the direction signs (which are baked into the positive/negative coordinate values).",
      difficulty: "intermediate",
      section: "the-need-for-coordinates",
    },
    {
      kind: "multi",
      prompt: "In the distance formula, the term (x2 - x1) represents:",
      options: [
        "The vertical distance between the points",
        "The horizontal distance between the points",
        "The base of the right-angled triangle used in Pythagoras theorem",
        "The hypotenuse of the triangle",
      ],
      correct_indices: [1, 2],
      model_answer: "The difference in x-coordinates represents the horizontal shift between the two points, which forms the base of the right-angled triangle.",
      difficulty: "intermediate",
      section: "distance-formula",
    },

    // ── QUICKFIRE (6) ───────────────────────────────────────────────
    {
      kind: "quickfire",
      prompt: "What is the point of intersection of the x-axis and y-axis called?",
      model_answer: "Origin",
      difficulty: "basic",
      section: "the-need-for-coordinates",
    },
    {
      kind: "quickfire",
      prompt: "Which coordinate is written first in an ordered pair?",
      model_answer: "x-coordinate",
      difficulty: "basic",
      section: "coordinates-of-a-point",
    },
    {
      kind: "quickfire",
      prompt: "In which quadrant are points with a negative x-coordinate and positive y-coordinate located?",
      model_answer: "Quadrant II",
      difficulty: "basic",
      section: "the-four-quadrants",
    },
    {
      kind: "quickfire",
      prompt: "What will be the coordinates of the point (4, 9) after it is reflected across the y-axis?",
      model_answer: "(-4, 9)",
      difficulty: "intermediate",
      section: "reflections",
    },
    {
      kind: "quickfire",
      prompt: "What is the distance between the points (5, 3) and (5, 10)?",
      model_answer: "7",
      difficulty: "basic",
      section: "distance-formula",
    },
    {
      kind: "quickfire",
      prompt: "A point is on the x-axis. What must its y-coordinate be?",
      model_answer: "0",
      difficulty: "basic",
      section: "coordinates-of-a-point",
    },

    // ── OPEN (6) ────────────────────────────────────────────────────
    {
      kind: "open",
      prompt: "Explain how the Cartesian coordinate system is similar to finding a specific seat in a cinema hall.",
      model_answer: "In a cinema, a seat is identified by two pieces of information: a row letter and a seat number. This is exactly how the Cartesian system works. It uses two intersecting lines (the axes) to provide a row and column number (the x and y coordinates), allowing you to pinpoint any location uniquely.",
      difficulty: "intermediate",
      section: "the-need-for-coordinates",
    },
    {
      kind: "open",
      prompt: "Why is the order of numbers in a coordinate pair strictly fixed?",
      model_answer: "The order is fixed to prevent ambiguity. By universally agreeing that the first number is always horizontal (x) and the second is vertical (y), everyone plotting the point (3, 5) will arrive at the exact same location. Without a fixed order, it would be impossible to know if (3, 5) meant 3 units right or 3 units up.",
      difficulty: "intermediate",
      section: "coordinates-of-a-point",
    },
    {
      kind: "open",
      prompt: "Describe a rule to determine the quadrant of a point simply by looking at the signs of its coordinates, without drawing a graph.",
      model_answer: "If both coordinates are positive (+,+), it is Quadrant I. If x is negative and y is positive (-,+), it is Quadrant II. If both are negative (-,-), it is Quadrant III. If x is positive and y is negative (+,-), it is Quadrant IV.",
      difficulty: "basic",
      section: "the-four-quadrants",
    },
    {
      kind: "open",
      prompt: "If you reflect a shape across the x-axis, describe what happens to the size and position of the shape.",
      model_answer: "The shape's size and dimensions remain exactly the same; reflection preserves distances and angles. Its horizontal position (x-coordinates) remains unchanged. However, its vertical position is inverted, meaning the shape flips upside down across the horizontal axis.",
      difficulty: "advanced",
      section: "reflections",
    },
    {
      kind: "open",
      prompt: "Explain how the Baudhāyana–Pythagoras Theorem is used to find the distance between two diagonal points.",
      model_answer: "By drawing a horizontal line from one point and a vertical line from the other, we form a right-angled triangle. The horizontal and vertical differences between the coordinates form the two shorter sides. The straight-line distance between the points is the hypotenuse, calculated by taking the square root of the sum of the squares of the two shorter sides.",
      difficulty: "advanced",
      section: "distance-formula",
    },
    {
      kind: "open",
      prompt: "Why does a point lying on the x-axis not belong to any quadrant?",
      model_answer: "Quadrants are the strictly bounded two-dimensional regions defined by positive and negative coordinates. A point on the x-axis has a y-coordinate of exactly zero, meaning it has neither positive nor negative vertical direction. Therefore, it sits on the boundary line dividing the quadrants, rather than inside a region.",
      difficulty: "intermediate",
      section: "the-four-quadrants",
    },
  ],
};
