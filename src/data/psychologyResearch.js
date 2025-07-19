// Psychology Research Database - Most Cited Papers and Frameworks
// This data will be used to train and inform the AI therapy assistant

export const therapeuticFrameworks = {
  cbt: {
    name: "Cognitive Behavioral Therapy",
    foundationalPapers: [
      {
        title: "Cognitive Therapy of Depression",
        authors: "Beck, A. T., Rush, A. J., Shaw, B. F., & Emery, G.",
        year: 1979,
        citations: 15000,
        keyPrinciples: [
          "Thoughts, feelings, and behaviors are interconnected",
          "Negative thought patterns contribute to emotional distress",
          "Identifying and challenging cognitive distortions",
          "Behavioral experiments to test negative beliefs"
        ],
        techniques: [
          "Thought records",
          "Cognitive restructuring", 
          "Behavioral activation",
          "Exposure therapy",
          "Homework assignments"
        ]
      },
      {
        title: "Cognitive Therapy and the Emotional Disorders",
        authors: "Beck, A. T.",
        year: 1976,
        citations: 8500,
        keyPrinciples: [
          "Automatic thoughts influence mood",
          "Schemas shape perception of reality",
          "Cognitive distortions maintain psychological problems"
        ]
      }
    ],
    interventions: [
      "Socratic questioning",
      "Thought challenging",
      "Behavioral experiments",
      "Activity scheduling",
      "Graded exposure"
    ]
  },

  dbt: {
    name: "Dialectical Behavior Therapy",
    foundationalPapers: [
      {
        title: "Cognitive-Behavioral Treatment of Borderline Personality Disorder",
        authors: "Linehan, M. M.",
        year: 1993,
        citations: 12000,
        keyPrinciples: [
          "Dialectical thinking (both/and vs either/or)",
          "Distress tolerance without making things worse",
          "Emotion regulation skills",
          "Interpersonal effectiveness"
        ],
        techniques: [
          "TIPP (Temperature, Intense exercise, Paced breathing, Paired muscle relaxation)",
          "PLEASE (treat PhysicaL illness, balance Eating, avoid mood-Altering substances, balance Sleep, get Exercise)",
          "DEAR MAN (Describe, Express, Assert, Reinforce, Mindful, Appear confident, Negotiate)"
        ]
      }
    ],
    modules: [
      "Mindfulness",
      "Distress Tolerance", 
      "Emotion Regulation",
      "Interpersonal Effectiveness"
    ],
    skills: [
      "Wise mind",
      "Radical acceptance",
      "STOP skill",
      "Opposite action",
      "Mastery activities"
    ]
  },

  act: {
    name: "Acceptance and Commitment Therapy",
    foundationalPapers: [
      {
        title: "Acceptance and Commitment Therapy: An experiential approach to behavior change",
        authors: "Hayes, S. C., Strosahl, K. D., & Wilson, K. G.",
        year: 1999,
        citations: 9500,
        keyPrinciples: [
          "Psychological flexibility as mental health",
          "Acceptance of difficult thoughts and feelings",
          "Commitment to value-based action",
          "Present-moment awareness"
        ]
      }
    ],
    hexaflex: [
      "Present moment awareness",
      "Acceptance", 
      "Cognitive defusion",
      "Self-as-context",
      "Values",
      "Committed action"
    ],
    techniques: [
      "Values clarification",
      "Metaphors and experiential exercises",
      "Mindfulness practices",
      "Defusion techniques"
    ]
  },

  mindfulness: {
    name: "Mindfulness-Based Interventions",
    foundationalPapers: [
      {
        title: "Full Catastrophe Living: Using the Wisdom of Your Body and Mind to Face Stress, Pain, and Illness",
        authors: "Kabat-Zinn, J.",
        year: 1990,
        citations: 7500,
        keyPrinciples: [
          "Present-moment awareness without judgment",
          "Observing thoughts and feelings as temporary experiences",
          "Acceptance of what is",
          "Non-reactivity to mental events"
        ]
      },
      {
        title: "Mindfulness-based stress reduction and health benefits: A meta-analysis",
        authors: "Goyal, M., et al.",
        year: 2014,
        citations: 4200,
        evidenceBase: "Moderate evidence for anxiety and pain reduction"
      }
    ],
    practices: [
      "Body scan meditation",
      "Breathing meditation",
      "Walking meditation",
      "Loving-kindness meditation",
      "Mindful eating"
    ]
  },

  positivePsychology: {
    name: "Positive Psychology",
    foundationalPapers: [
      {
        title: "Authentic Happiness: Using the New Positive Psychology to Realize Your Potential for Lasting Fulfillment",
        authors: "Seligman, M. E. P.",
        year: 2002,
        citations: 6800,
        keyPrinciples: [
          "Focus on strengths rather than deficits",
          "Building positive emotions and experiences",
          "Meaning and purpose in life",
          "Character strengths and virtues"
        ]
      }
    ],
    elements: [
      "Positive emotions",
      "Engagement",
      "Relationships", 
      "Meaning",
      "Achievement"
    ]
  }
};

export const crisisInterventionProtocols = {
  riskAssessment: {
    highRiskIndicators: [
      "Specific suicide plan",
      "Access to means",
      "Recent loss or trauma",
      "Social isolation",
      "Substance abuse",
      "Previous attempts",
      "Psychosis or severe mental illness"
    ],
    immediateActions: [
      "Assess immediate safety",
      "Remove or restrict access to means",
      "Increase social support",
      "Develop safety plan",
      "Consider hospitalization if necessary"
    ]
  },
  safetyPlanElements: [
    "Warning signs recognition",
    "Internal coping strategies",
    "Social supports",
    "Professional contacts",
    "Environmental safety"
  ],
  crisisResources: {
    national: "988 Suicide & Crisis Lifeline",
    text: "Crisis Text Line: Text HOME to 741741",
    international: "International Association for Suicide Prevention"
  }
};

export const conversationTemplates = {
  sessionOpening: [
    "Hello, I'm here to support you today. This is a safe, confidential space. What would you like to talk about?",
    "Thank you for taking this time for yourself. What's been on your mind lately?",
    "I'm glad you're here. What would feel most helpful to explore in our time together?"
  ],
  
  reflectiveListening: [
    "It sounds like you're saying...",
    "What I'm hearing is...", 
    "Help me understand...",
    "That must have been difficult...",
    "I can see this is important to you..."
  ],
  
  explorationQuestions: [
    "Can you tell me more about that?",
    "What was that experience like for you?",
    "How did that make you feel?",
    "What thoughts went through your mind?",
    "What would you like to be different?"
  ],
  
  validationStatements: [
    "Your feelings make complete sense given what you've been through.",
    "It takes courage to share what you just shared.",
    "Many people would feel the same way in your situation.",
    "Thank you for trusting me with this."
  ]
};

export const ethicalGuidelines = {
  principles: [
    "Do no harm",
    "Respect for autonomy", 
    "Beneficence",
    "Justice",
    "Fidelity and responsibility"
  ],
  
  limitations: [
    "AI cannot replace human therapist",
    "Not for emergency situations",
    "Recommends professional help when appropriate",
    "Maintains clear boundaries"
  ],
  
  confidentiality: [
    "Session data encrypted",
    "No personal information stored unnecessarily", 
    "Clear data retention policies",
    "User control over data"
  ]
};

// Evidence-based therapeutic responses database
export const therapeuticResponses = {
  anxiety: {
    cbt: [
      "What thoughts are going through your mind when you feel anxious?",
      "Let's examine the evidence for and against this worry.",
      "What would you tell a friend who had this same worry?"
    ],
    dbt: [
      "Let's try some distress tolerance skills. Can you name 5 things you can see right now?",
      "What would help you ride this wave of anxiety without making it worse?"
    ],
    mindfulness: [
      "Can you feel your feet on the ground right now?",
      "Let's notice this anxiety with curiosity rather than judgment."
    ]
  },
  
  depression: {
    cbt: [
      "What activities used to bring you joy?",
      "How might your thoughts be influencing how you feel?",
      "What small step could you take today?"
    ],
    act: [
      "What matters most to you, even in this difficult time?",
      "What would the person you want to be do right now?"
    ],
    positivepsychology: [
      "What's one thing you're grateful for today, no matter how small?",
      "What strengths have helped you through difficult times before?"
    ]
  }
};

export default {
  therapeuticFrameworks,
  crisisInterventionProtocols,
  conversationTemplates,
  ethicalGuidelines,
  therapeuticResponses
}; 