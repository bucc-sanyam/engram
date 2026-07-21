import { PsChapter } from "../types";

export const kennethAllenMcDuff: PsChapter = {
  slug: "kenneth-allen-mcduff",
  title: "Kenneth Allen McDuff: Big Mac",
  summary:
    "The horrifying story of a brutal psychopath who was set free due to prison overcrowding, only to immediately resume hunting vulnerable women.",
  sections: [
    {
      slug: "the-broomstick-murders",
      title: "The Broomstick Murders",
      summary:
        "How a sadistic bully committed a horrific triple homicide, and the systemic failure that allowed him to strike again.",
      body: `**Concept:**
A psychopath does not experience rehabilitation; they merely experience a temporary pause in their predatory behavior while incarcerated. If released without proper psychological screening, they will almost inevitably return to their violent impulses the moment they have the opportunity.

**Why it matters:**
Kenneth Allen McDuff, known as the 'Bad Boy of Rosebud,' was a massive, brutish, and deeply racist man. In 1966, he committed the horrific 'Broomstick Murders,' kidnapping three teenagers, executing the two boys, and snapping the neck of 16-year-old Edna Louise Sullivan using a piece of broomstick. 

**The Insight:**
McDuff received three death sentences for this atrocity. However, due to legal changes, his sentence was commuted to life in prison. Then, in 1989, the Texas prison system experienced massive overcrowding. Desperate to free up beds, parole applications were rushed through without being properly read. McDuff—a man who literally crushed a teenage girl's neck for his own amusement—was deemed 'unlikely to kill again' and paroled after serving 23 years.

**Case Walk-through: Three Days Later**
The system's failure was absolute and immediate. Just three days after walking out of prison, McDuff hunted down and strangled a young prostitute named Sarafia Parker, dumping her body in a field. Rather than returning to society as a reformed citizen, McDuff used his freedom to refine his hunting techniques. He specifically targeted vulnerable, marginalized women—drug addicts and prostitutes—whom he believed the police would not actively search for, demonstrating the cold, calculating nature of a true psychopath.

**Spot it:**
*A violent repeat offender is released early from a psychiatric facility due to budget cuts. The facility's administrators sign off on his release without reviewing his recent behavioral reports, claiming he is 'cured.' Within a week, the offender attacks a homeless person in a park, knowing the victim lacks the resources to fight back or easily seek police help.*

**Thread:**
Having slipped through the cracks of the justice system, McDuff found an even more brazen way to exploit the state's resources while continuing his reign of terror.`,
      questions: [
        {
          kind: "mcq",
          prompt: "Why was Kenneth McDuff released from prison in 1989 despite having committed the horrific Broomstick Murders?",
          options: [
            "He was proven innocent by new DNA evidence.",
            "He escaped during a prison riot.",
            "He was paroled because of massive prison overcrowding and rushed administrative reviews.",
            "He provided testimony against a major drug cartel."
          ],
          correct_index: 2,
          model_answer: "McDuff was paroled due to severe prison overcrowding, where administrators rushed through paperwork without properly reviewing his dangerous history.",
          difficulty: "basic"
        },
        {
          kind: "mcq",
          prompt: "How soon after his parole in 1989 did McDuff commit his next murder?",
          options: [
            "Three days later.",
            "Six months later.",
            "Five years later.",
            "He never killed again."
          ],
          correct_index: 0,
          model_answer: "Demonstrating his complete lack of rehabilitation, McDuff killed a young woman just three days after being released.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "In the 'Spot it' vignette, how does the release of the violent offender parallel McDuff's parole?",
          model_answer: "Both dangerous individuals are released not because they are rehabilitated, but due to systemic failures and resource shortages (budget cuts/overcrowding), and both immediately exploit this failure to attack vulnerable targets.",
          difficulty: "intermediate"
        }
      ],
      facts: [
        "Kenneth McDuff originally received the death penalty for the 1966 'Broomstick Murders' before his sentence was commuted to life in prison.",
        "Due to severe prison overcrowding in 1989, McDuff was paroled and went on to commit another murder just three days after his release."
      ]
    },
    {
      slug: "the-college-monster",
      title: "The College Monster",
      summary:
        "How McDuff exploited a prison re-integration program to terrorize a college campus.",
      body: `**Concept:**
Psychopaths are expert parasites. They are highly skilled at identifying programs, individuals, or institutions that offer resources (shelter, money, access to victims) and draining them dry under the guise of compliance or rehabilitation.

**Why it matters:**
While out on parole and actively murdering women, McDuff discovered a state-funded program called Project RIO (Re-integration of Offenders). The program was designed to help uneducated ex-convicts become employable by sending them to college. McDuff immediately enrolled at the Texas State Technical Institute in Waco. 

**The Insight:**
McDuff had absolutely no intention of getting an education. For him, the college was a goldmine: a free private room, three square meals a day, subsistence money, and access to a campus where women outnumbered men nearly four to one. He set up shop in room #118 of Sabine Hall and turned it into his personal criminal headquarters. 

**Case Walk-through: The Predator on Campus**
McDuff treated the college campus as his hunting ground. He entertained prostitutes in his room, planned burglaries, dealt drugs, and physically threatened other students. His massive 250-lb frame and terrifying demeanor meant that other residents were too afraid to report him to the authorities; they simply hid when he was around. 

While taking advantage of the state's charity, he continued to abduct women from the local red-light districts. On one occasion, when police tried to pull him over at a checkpoint with a terrified prostitute named Brenda Kay Thompson in his truck, Brenda violently kicked out his windshield trying to escape. Unfazed, McDuff sped straight at the police officers, outran them in a high-speed chase, and drove Brenda into the woods, where she suffered a torturous death. 

**Spot it:**
*A known con artist enrolls in a charity-run halfway house program that provides free housing and job training for recovering addicts. Instead of attending the job seminars, he uses his free room to store stolen electronics and manipulates the charity workers into giving him extra food stipends, which he uses to buy drugs.*

**Thread:**
McDuff's rampage eventually caught up with him, and he was sent back to Death Row. But before he faced the executioner, the author needed him to reveal the locations of the bodies he had hidden in the Texas wilderness.`,
      questions: [
        {
          kind: "mcq",
          prompt: "How did McDuff exploit the Project RIO (Re-integration of Offenders) program?",
          options: [
            "He used it to genuinely learn a new trade and become an electrician.",
            "He used it to secure a free room, food, and money while continuing to commit crimes and terrorize the college campus.",
            "He embezzled money from the program's administration office.",
            "He used it to hire lawyers to sue the state."
          ],
          correct_index: 1,
          model_answer: "McDuff used the program to get free housing and resources, turning his dorm room into a base for drug dealing and violence.",
          difficulty: "intermediate"
        },
        {
          kind: "mcq",
          prompt: "What happened when police attempted to pull McDuff over while Brenda Kay Thompson was in his truck?",
          options: [
            "He surrendered immediately and confessed.",
            "Brenda kicked out the windshield, and McDuff drove straight at the officers to escape.",
            "He pretended Brenda was his wife and they were rushing to the hospital.",
            "He abandoned the truck and ran into the woods on foot."
          ],
          correct_index: 1,
          model_answer: "Brenda desperately kicked out the windshield to escape, but McDuff nearly ran over the officers and successfully fled the scene with her.",
          difficulty: "basic"
        },
        {
          kind: "open",
          prompt: "In the 'Spot it' vignette, how is the con artist's behavior similar to McDuff's time at college?",
          model_answer: "Both exploit a well-intentioned rehabilitation or charity program to secure free resources (housing, money) while secretly using the program as a base to continue their illicit and destructive activities.",
          difficulty: "intermediate"
        }
      ],
      facts: [
        "McDuff exploited a state-funded program designed to rehabilitate offenders to get free room and board at a college campus.",
        "While living on the college campus, McDuff used his dorm room to plan crimes, deal drugs, and terrorize other students."
      ]
    },
    {
      slug: "the-death-row-deal",
      title: "The Death Row Deal",
      summary:
        "How the author manipulated McDuff's mother to extract the locations of the hidden bodies.",
      body: `**Concept:**
When a psychopath is facing imminent death, they often view the hidden locations of their victims' bodies as their final piece of leverage or power. To extract this information, an investigator must create a scenario where the psychopath believes they are gaining a tangible benefit or exercising control by revealing the secret.

**Why it matters:**
McDuff was eventually caught, convicted of multiple murders, and sent to Death Row in Texas. He had hidden the bodies of several women, including 17-year-old Regenia DeAnne Moore, leaving their families in agonizing limbo. Regenia's mother desperately wanted to give her daughter a decent burial. McDuff, callous to the end, refused to give up the locations unless he got something out of it.

**The Insight:**
McDuff told the author: "I have serious health problems. They don't give vital medication to us, so if you want me to give up a body you give my Mom $500 so's I can get treatment. Get her to sign for it so's I can prove she has the money." 

The author recognized an opportunity. He visited McDuff's elderly mother, Addie, known locally as the 'Pistol Packin' Momma.' Addie, realizing her son's fate was sealed, agreed to help the author outsmart him. She refused to actually take the $500, but she willingly signed a fake receipt stating she had received the money, knowing it would trick her son into talking. 

**Case Walk-through: Giving Up the Ghosts**
The author presented the signed receipt to McDuff on Death Row. Believing he had successfully extorted the author and secured the funds for his medication, McDuff's greed and desire for medical treatment outweighed his desire to keep his secrets. 

He finally gave up the information. He directed the authorities to a sinkhole near a creek outside Waco, where they recovered Regenia's body. She had been hog-tied and thrown away like trash seven years earlier. Because of a clever con utilizing his own mother, McDuff gave several families the closure they so desperately needed before he was finally executed in 1998.

**Spot it:**
*A captured corporate spy refuses to reveal the password to a heavily encrypted hard drive containing stolen trade secrets. The interrogator discovers the spy is obsessed with an offshore bank account. The interrogator fakes a bank transfer receipt showing a massive deposit into the account, contingent on the password working. Believing he has won, the spy gladly types in the password.*

**Thread:**
Kenneth McDuff was a brutal, disorganized killer who relied on sheer physical strength and intimidation. But as we move to Chapter 10, we encounter a predator of a completely different breed: John 'JR' Robinson, the Internet's first serial killer.`,
      questions: [
        {
          kind: "mcq",
          prompt: "What did McDuff demand in exchange for revealing the locations of his victims' bodies?",
          options: [
            "A pardon from the Governor of Texas.",
            "A transfer to a minimum-security prison.",
            "$500 given to his mother to pay for his medical treatment on Death Row.",
            "A televised interview on national news."
          ],
          correct_index: 2,
          model_answer: "McDuff demanded that the author give his mother $500 to fund his medical treatment before he would reveal the body locations.",
          difficulty: "basic"
        },
        {
          kind: "mcq",
          prompt: "How did the author trick McDuff into believing the demand had been met?",
          options: [
            "He counterfeited $500 in fake bills.",
            "He got McDuff's mother to sign a fake receipt proving she received the money, even though she refused to take it.",
            "He hired an actress to play McDuff's mother on the phone.",
            "He forged the mother's signature on a bank document."
          ],
          correct_index: 1,
          model_answer: "McDuff's mother cooperated with the author, signing a fake receipt for the money to trick her son into confessing.",
          difficulty: "intermediate"
        },
        {
          kind: "open",
          prompt: "In the 'Spot it' vignette, how does the interrogator's tactic mirror the author's strategy with McDuff?",
          model_answer: "Both use a fabricated document (a fake bank transfer / a fake receipt) to make the criminal believe they have successfully extorted a tangible benefit, exploiting their greed to extract hidden information.",
          difficulty: "intermediate"
        }
      ],
      facts: [
        "McDuff attempted to extort the author for $500 in exchange for revealing the locations of his hidden victims.",
        "The author partnered with McDuff's own mother to trick the killer with a fake receipt, securing the body locations before McDuff was executed."
      ]
    }
  ]
};
