// Research projects — shared by the research list and the detail pages.
export const projects = [
  {
    slug: "deceased-pets-xr",
    title: "Representing Deceased Pets in Extended Reality",
    authors: "Edgar Hipp, Martin Feick, Shi Liu, Alexander Mädche",
    venue: "Master's Thesis · Human-Centered Systems Lab (h-lab), WIN, KIT",
    year: "2026",
    // Short summary shown on the research card.
    summary:
      "My Master's thesis started with a question that made people pause at dinner: when a pet dies, what do we keep — and could extended reality hold onto any of it? To keep it honest, I ran two workshops in Leipzig and Munich with a wonderfully mismatched group of people and let their arguments about grief, memory, and taste steer the design.",
    // Detail page content.
    hero: "/figures/ws2_workshop_overview.jpg",
    heroCaption: "Workshop in Munich.",
    body: [
      "It's a strange question to sit with: when a pet dies, what do we actually want to keep, and could extended reality hold onto any of it? I chose it on purpose. A question like that pulls the real conversations — about grief, memory, and what we owe the things we love — into the room before anyone starts talking about headsets or file formats.",
      "So instead of guessing at an answer alone, I ran two workshops, one in Leipzig and one in Munich, and worked through the question with people out loud.",
      "The room was gloriously mismatched: finance PhDs, an opera singer, egyptology students, and a couple of engineers who kept trying to shrink the problem down to something buildable. That mix was the whole point. People argued about ethics, ownership, and loss long before anyone mentioned a model or a mesh.",
      "I came away believing speculative design isn't about predicting the future so much as making it concrete enough to argue about. What we sketched together became a shared vocabulary for grief and technology — and a design brief rooted in how people actually mourn, not in whatever happens to be easy to render.",
    ],
    gallery: [
      { src: "/figures/ws1_workshop_overview.jpg", caption: "Leipzig, room overview." },
      { src: "/figures/ws1_groupwork.jpg", caption: "Leipzig, working through ideas." },
      { src: "/figures/ws2_workshop_overview.jpg", caption: "Munich, room overview." },
      { src: "/figures/ws1_futurescone_activity.jpg", caption: "Leipzig, futures-cone activity." },
      { src: "/figures/ws1_pairwork.jpg", caption: "Leipzig, pair work." },
      { src: "/figures/ws1_presentation.jpg", caption: "Leipzig, presenting concepts." },
      { src: "/figures/ws1_presentation_discussion.jpg", caption: "Leipzig, discussion after presentations." },
    ],
  },
];

export const getProject = (slug) => projects.find((p) => p.slug === slug);
