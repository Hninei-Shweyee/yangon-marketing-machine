import {
  BarChart3,
  Bot,
  Brain,
  CalendarClock,
  CheckCircle2,
  Clapperboard,
  ClipboardList,
  Facebook,
  FileText,
  Layers3,
  MessageCircle,
  Palette,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Workflow,
  Zap
} from "lucide-react";

export const siteContent = {
  brand: {
    name: "Yangon Marketing Machine",
    shortName: "YMM",
    tagline: "AI Marketing Machine setup agency for Myanmar SMEs",
    email: "business@yangonmarketingmachine.com",
    phone: "+66 647979490",
    location: "Yangon, Myanmar"
  },
  seo: {
    title: "Yangon Marketing Machine - AI Marketing Machine Setup for Myanmar SMEs",
    description:
      "Build an approval-first AI marketing operating system for content, design, video, scheduling, replies, reporting, and monthly improvement.",
    keywords: [
      "AI marketing Myanmar",
      "Yangon marketing agency",
      "AI marketing system",
      "Myanmar SME marketing",
      "marketing automation Myanmar"
    ]
  },
  nav: [
    { label: "Home", href: "/" },
    { label: "Systems", href: "/systems" },
    { label: "Process", href: "/process" },
    { label: "Pricing", href: "/pricing" },
    { label: "Proof", href: "/portfolio" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" }
  ],
  hero: {
    eyebrow: "Approval-first AI marketing OS for Myanmar SMEs",
    headline: "Build Your AI Marketing Machine",
    pitch:
      "We don't just make posts for your business. We build the AI Marketing Machine that helps your team create, design, schedule, reply, track, and improve marketing every month.",
    primaryCta: "Book AI Audit",
    secondaryCta: "Explore Systems",
    stats: [
      { value: "7", label: "Connected systems" },
      { value: "30-day", label: "Setup sprint" },
      { value: "Human-led", label: "Approval workflow" }
    ]
  },
  trustStrip: [
    "Built for Myanmar language workflows",
    "Team training included",
    "Approval-first automation",
    "No guaranteed-sales promises"
  ],
  marketGap: {
    title: "From social posting to a real marketing operating system",
    subtitle:
      "Most SMEs are buying scattered content tasks. Yangon Marketing Machine installs the workflow layer your team can actually operate.",
    columns: [
      {
        title: "Normal social agency",
        points: ["Monthly post calendar", "Designer dependency", "Manual replies", "Little process memory", "Reporting arrives late"]
      },
      {
        title: "AI Marketing Machine",
        points: [
          "Reusable brand brain",
          "Content, design, video, and scheduling workflow",
          "Approval gates before publishing",
          "Campaign OS with tasks and owners",
          "Monthly learning loop"
        ]
      }
    ]
  },
  challenges: [
    {
      icon: FileText,
      title: "Content takes too long",
      text: "We turn rough business ideas into reusable prompts, post angles, captions, and campaign briefs your team can refine."
    },
    {
      icon: Palette,
      title: "Myanmar text breaks designs",
      text: "We separate AI image concepts from Myanmar text editing, so Canva layouts stay readable and brand-safe."
    },
    {
      icon: CalendarClock,
      title: "Posting is inconsistent",
      text: "We create a scheduling rhythm with queues, approvals, and reminders using tools your team can manage."
    },
    {
      icon: MessageCircle,
      title: "Replies are slow",
      text: "We design reply assistance that drafts helpful responses while your team keeps final control."
    },
    {
      icon: BarChart3,
      title: "No learning loop",
      text: "We connect reporting, campaign notes, and monthly review prompts so every month gets smarter."
    }
  ],
  operatingLoop: [
    { title: "Capture", text: "Collect offers, customer questions, product photos, and owner knowledge." },
    { title: "Create", text: "Generate campaign angles, captions, visual concepts, and video scripts." },
    { title: "Approve", text: "Review Myanmar language, brand tone, price details, and publishing readiness." },
    { title: "Publish", text: "Schedule approved posts and campaigns through a clear team workflow." },
    { title: "Learn", text: "Track what worked, document signals, and improve the next month." }
  ],
  systems: [
    {
      icon: Brain,
      name: "AI Brain",
      tool: "Custom GPT / Gemini Gem",
      description: "Your reusable brand, product, audience, tone, FAQ, and campaign memory.",
      deliverables: ["Brand brain", "Prompt library", "Owner training"]
    },
    {
      icon: Sparkles,
      name: "Content Machine",
      tool: "GPT",
      description: "Content ideas, captions, hooks, scripts, and campaign angles for repeatable creation.",
      deliverables: ["Content calendar prompts", "Caption workflows", "Campaign briefs"]
    },
    {
      icon: Palette,
      name: "Design Machine",
      tool: "GPT image concepts + Canva",
      description: "AI-assisted visual direction with Canva text editing for Myanmar words.",
      deliverables: ["Design prompt sets", "Canva templates", "Myanmar text QA"]
    },
    {
      icon: Clapperboard,
      name: "Video Machine",
      tool: "CapCut + Canva videos",
      description: "Short video systems for offers, product explainers, testimonials, and campaigns.",
      deliverables: ["Script templates", "Editing workflow", "Video checklist"]
    },
    {
      icon: CalendarClock,
      name: "Scheduling Machine",
      tool: "Claude + OmniSocial / Buffer",
      description: "A controlled publishing queue with monthly planning and approval checkpoints.",
      deliverables: ["Schedule board", "Approval flow", "Publishing SOP"]
    },
    {
      icon: ClipboardList,
      name: "Campaign & Project OS",
      tool: "Claude + Notion",
      description: "Tasks, briefs, owners, due dates, status, and campaign learnings in one operating space.",
      deliverables: ["Notion OS", "Campaign templates", "Review rhythm"]
    },
    {
      icon: Bot,
      name: "Reply Machine",
      tool: "Telegram / Facebook + OpenClaw + DeepSeek",
      description: "Draft-assisted customer replies with human approval before sensitive responses.",
      deliverables: ["Reply flows", "FAQ dataset", "Escalation rules"]
    }
  ],
  finalToolStack: [
    "GPT",
    "Claude",
    "Gemini Gem",
    "Canva",
    "CapCut",
    "Notion",
    "OmniSocial / Buffer",
    "Telegram",
    "Facebook",
    "OpenClaw",
    "DeepSeek"
  ],
  packages: [
    {
      name: "Starter Machine",
      price: "850,000 MMK",
      description: "For owners who need a simple AI content and design workflow.",
      features: ["AI Brain setup", "Content Machine", "Design Machine starter templates", "Team handover session"],
      cta: "Start with Starter",
      recommended: false
    },
    {
      name: "Growth Machine",
      price: "1,850,000 MMK",
      description: "For growing SMEs that need content, design, video, scheduling, and campaign control.",
      features: [
        "Everything in Starter",
        "Video Machine workflow",
        "Scheduling Machine",
        "Campaign & Project OS",
        "Two training sessions"
      ],
      cta: "Choose Growth",
      recommended: true
    },
    {
      name: "Growth 10x OS",
      price: "2,550,000 MMK",
      description: "For teams ready to operate a fuller AI marketing system with reply assistance.",
      features: [
        "Everything in Growth",
        "Reply Machine blueprint",
        "Advanced reporting loop",
        "Management dashboard",
        "Priority setup support"
      ],
      cta: "Build 10x OS",
      recommended: false
    },
    {
      name: "Monthly Retainer",
      price: "350,000 MMK",
      description: "For continuous improvement after setup.",
      features: ["Monthly system review", "Prompt and workflow updates", "Campaign planning support", "Team Q&A"],
      cta: "Keep Improving",
      recommended: false
    }
  ],
  process: [
    {
      icon: Target,
      title: "Audit",
      text: "We map your offers, channels, team capacity, bottlenecks, and current marketing workflow."
    },
    {
      icon: Brain,
      title: "Build the Brain",
      text: "We create the reusable company context that powers your content, design, video, and reply workflows."
    },
    {
      icon: Workflow,
      title: "Install Systems",
      text: "We connect the machines your package needs and document the approval-first operating process."
    },
    {
      icon: Users,
      title: "Train the Team",
      text: "Your team learns how to use prompts, templates, boards, and publishing checkpoints."
    },
    {
      icon: Zap,
      title: "Run the First Cycle",
      text: "We help launch the first monthly cycle, review signals, and improve the system."
    }
  ],
  portfolio: [
    {
      title: "Tech Mart Digital Store",
      category: "Content + ads workflow",
      image: "/images/portfolio/tech-mart.png",
      result: "Built product content system with AI-assisted captions and promotional ad workflows for daily deals and new arrivals.",
      metrics: ["Product content prompts", "Ad copy templates", "Campaign schedule board"],
      facebook: "https://www.facebook.com/profile.php?id=61583363953832"
    },
    {
      title: "Skill Bridge AI Myanmar",
      category: "Campaign OS",
      image: "/images/portfolio/skill-bridge.jpg",
      result: "Created monthly course intake campaigns with AI-generated scripts, post angles, and enrollment tracking notes.",
      metrics: ["Campaign briefs", "30-day schedule", "Enrollment SOP"],
      facebook: "https://www.facebook.com/profile.php?id=61578756219426"
    },
    {
      title: "Pone Pyin AI Studio MM",
      category: "Content + design workflow",
      image: "/images/portfolio/pone-pyin.png",
      result: "Set up AI-assisted content pipeline for creative showcases, portfolio posts, and client project highlights.",
      metrics: ["Content prompts", "Design templates", "Publishing queue"],
      facebook: "https://www.facebook.com/profile.php?id=100089223420484"
    }
  ],
  about: {
    title: "Built in Yangon for practical Myanmar SME teams",
    text:
      "Yangon Marketing Machine helps business owners move from random marketing activity to a calm, documented, AI-assisted operating system. We care about clear workflows, Myanmar language quality, team adoption, and human approval before publishing.",
    values: [
      { icon: ShieldCheck, title: "Approval-first", text: "AI drafts and organizes. Your team reviews and decides." },
      { icon: Layers3, title: "Systems over tasks", text: "We install repeatable workflows instead of one-off content work." },
      { icon: CheckCircle2, title: "Practical adoption", text: "Tools are chosen for what Myanmar SME teams can actually operate." },
      { icon: Rocket, title: "Monthly improvement", text: "The system gets better through review, not risky autopilot promises." }
    ]
  },
  faqs: [
    {
      question: "Do you guarantee sales?",
      answer:
        "No. We build the operating system that improves marketing execution, consistency, and learning. Sales depend on many factors including offer quality, pricing, market demand, and operations."
    },
    {
      question: "Will AI post automatically without approval?",
      answer:
        "No. Our v1 systems use approval-first workflows. AI helps draft, organize, and suggest. Your team approves before publishing or sensitive replies."
    },
    {
      question: "Can this work with Myanmar language?",
      answer:
        "Yes. We design around Myanmar language realities, including Canva text editing, brand tone review, and human QA."
    },
    {
      question: "Do we need a big marketing team?",
      answer:
        "No. The setup is designed for SME owners and small teams. We match the workflow to your real capacity."
    }
  ],
  contact: {
    title: "Book an AI Marketing Machine Audit",
    subtitle:
      "Tell us where your marketing feels stuck. We will review your workflow and suggest the right machine setup without promising guaranteed sales.",
    budgetRanges: ["Under 500,000 MMK", "500,000 - 1,500,000 MMK", "1,500,000 - 3,000,000 MMK", "3,000,000+ MMK"],
    improvementAreas: ["Content", "Design", "Video", "Scheduling", "Reply", "Ads", "Reporting"]
  },
  footerCta: {
    title: "Ready to stop doing random marketing tasks?",
    text: "Build a clear AI Marketing Machine your team can operate every month.",
    cta: "Book Your Audit"
  }
} as const;

export type Package = (typeof siteContent.packages)[number];
export type System = (typeof siteContent.systems)[number];
