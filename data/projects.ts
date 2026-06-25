// ─── Projects data ────────────────────────────────────────────────────────────

/**
 * Filterable domain taxonomy.
 * Maps to future filter bar categories: All | AI | Backend | Cloud | Automation | Enterprise
 * Add new values here as the portfolio grows; the filter UI reads this type.
 */
export type ProjectDomain = 'ai' | 'enterprise' | 'automation' | 'cloud' | 'backend';

export interface CaseStudy {
  overview: string;
  problem: string;
  whatIBuilt: string;
  myRole: string;
  architecture: string;
  impact: string;
  improvements: string;
}

export interface ProjectData {
  id: string;
  /** Short display label shown as the card badge (e.g. "AI Platform"). */
  badge: string;
  /**
   * Filterable taxonomy slug.
   * Drives future filter bar — one project can map to one domain.
   * e.g. 'ai' → shown under the "AI" filter.
   */
  domain: ProjectDomain;
  title: string;
  description: string;
  tech: string[];
  meta: string;
  imagePath: string;
  videoPath?: string;
  liveDemoUrl?: string;
  githubUrl?: string;
  /** CSS gradient string — visible when imagePath fails to load */
  placeholderGradient: string;
  /**
   * Controls visibility in the rendered Projects section.
   * Set to false to hide a project without deleting its data.
   * Flip to true when ready to publish.
   */
  featured: boolean;
  caseStudy: CaseStudy;
}

export const projectsData: ProjectData[] = [
  {
    id: 'signalforge',
    badge: 'AI Platform',
    domain: 'ai',
    featured: true,
    title: 'SignalForge',
    description:
      'AI delivery intelligence platform that analyzes project readiness, staffing fit, execution risk, and delivery confidence.',
    tech: ['FastAPI', 'Azure OpenAI', 'TypeScript', 'Azure'],
    meta: 'Microsoft Build AI Hackathon · 2026',
    imagePath: '/projects/signalforge/cover.png',
    videoPath: '/projects/signalforge/demo.mp4',
    liveDemoUrl: undefined,
    githubUrl: undefined,
    placeholderGradient:
      'linear-gradient(135deg, #0f172a 0%, #1e1b4b 45%, #0c0a1e 100%)',
    caseStudy: {
      overview:
        'SignalForge quantifies delivery confidence before a project begins. It accepts raw project inputs — scope description, team composition, timeline — and returns structured readiness scores across four dimensions: staffing fit, execution risk, timeline confidence, and scope clarity. Built and shipped in 48 hours for Microsoft Build AI Hackathon 2026.',
      problem:
        'Delivery teams have no tooling to assess project readiness before kickoff. Risk is identified reactively — after timelines slip, after the wrong team is assigned, after scope ambiguity causes missed deliverables. The gap between project scoping and delivery confidence assessment is entirely manual.',
      whatIBuilt:
        'A FastAPI backend integrated with Azure OpenAI (GPT-4o) that processes unstructured project inputs and returns a structured JSON readiness report. Each dimension — staffing fit, timeline confidence, execution risk, scope clarity — maps to a specialized prompt chain with enforced JSON output. A TypeScript frontend renders the confidence gauges and surfaces risk flags in a clean dashboard.',
      myRole:
        'End-to-end ownership. System architecture, FastAPI API layer, Azure OpenAI prompt engineering with JSON mode, TypeScript frontend build, and Azure deployment. Sole engineer across the full stack from blank repo to shipped demo.',
      architecture:
        'FastAPI orchestrates four parallel prompt chains via Azure OpenAI. JSON mode enforces structured output per dimension. Results are aggregated into a single readiness object returned to the frontend. Hosted on Azure App Service with Azure Container Registry for image management. Environment secrets managed via Azure Key Vault references.',
      impact:
        'Won Microsoft Build AI Hackathon 2026. Demonstrated a viable AI-augmented decision layer for delivery teams — reducing the reliance on gut-feel scoping decisions with measurable confidence signals.',
      improvements:
        'Add RAG with historical project data as scoring context. Build a real-time confidence dashboard with dimension drill-down. Integrate Jira and GitHub Projects as live signal sources. Add team velocity as a scoring input dimension.',
    },
  },
  {
    id: 'skill-repository',
    badge: 'Enterprise System',
    domain: 'enterprise',
    featured: true,
    title: 'Skill Repository',
    description:
      'Internal skill intelligence platform combining async workers, real-time updates, event-driven processing, and enterprise workflows.',
    tech: ['FastAPI', 'Azure Service Bus', 'PostgreSQL', 'Socket.IO', 'Power Apps'],
    meta: 'Rapid Circle · 2026',
    imagePath: '/projects/skill-repository/cover.png',
    videoPath: undefined,
    liveDemoUrl: undefined,
    githubUrl: undefined,
    placeholderGradient:
      'linear-gradient(135deg, #0c1a2e 0%, #0f2744 50%, #050e1c 100%)',
    caseStudy: {
      overview:
        'Skill Repository is an internal workforce intelligence platform that consolidates employee skill profiles, tracks gaps, and surfaces staffing eligibility across the organization. Built on a modern event-driven backend with real-time UI updates and Power Platform integration for non-technical users.',
      problem:
        'No unified source of truth existed for employee skills at Rapid Circle. Skill data was fragmented across spreadsheets, SharePoint lists, and manager memory. Staffing decisions were slow, inconsistent, and lacked visibility into who held what capabilities. There was no mechanism to track skill growth or surface gaps at scale.',
      whatIBuilt:
        'A production FastAPI backend with asynchronous worker pipelines for skill ingestion and processing. Azure Service Bus handles event-driven messaging between services. PostgreSQL stores skill profiles and gap data. Socket.IO enables real-time skill updates to the frontend without polling. Power Apps provides a low-code UI for non-technical stakeholders to view and update skill records.',
      myRole:
        'Backend architecture and API design, async worker pipeline implementation, Azure Service Bus topic/subscription setup, Socket.IO real-time layer, PostgreSQL schema design, and Power Apps connector integration. Collaborated with stakeholders to define skill taxonomy and gap thresholds.',
      architecture:
        'FastAPI handles API contracts and orchestrates the worker layer. Skill ingestion events are published to Azure Service Bus topics and consumed by specialized async workers (processing, enrichment, gap analysis). PostgreSQL stores normalized skill records. Socket.IO broadcasts real-time updates to connected clients. Power Apps integrates via custom connectors against the FastAPI API.',
      impact:
        'Shipped to production at Rapid Circle. Enabled internal skill visibility for the first time, allowing staffing decisions to be made against real data. Reduced skill assessment time from days to minutes for common queries.',
      improvements:
        'Add AI-powered skill gap recommendations using Azure OpenAI. Build reporting dashboards for leadership. Improve skill taxonomy with hierarchy and synonyms. Add skill endorsement and verification workflows.',
    },
  },
  {
    id: 'plant-outage-orchestrator',
    badge: 'Multi-Agent Workflow',
    domain: 'automation',
    featured: true,
    title: 'Plant Outage Orchestrator',
    description:
      'Copilot Studio multi-agent workflow that coordinates outage response, business impact analysis, and stakeholder communication.',
    tech: ['Copilot Studio', 'Power Automate', 'SharePoint', 'M365'],
    meta: 'Internal Demo · 2026',
    imagePath: '/projects/plant-outage-orchestrator/cover.png',
    videoPath: undefined,
    liveDemoUrl: undefined,
    githubUrl: undefined,
    placeholderGradient:
      'linear-gradient(135deg, #0a1a0e 0%, #102a16 50%, #050f08 100%)',
    caseStudy: {
      overview:
        'Plant Outage Orchestrator is a multi-agent AI workflow built on Copilot Studio that automates industrial outage coordination. When an outage event is detected, the system routes to specialized agents for impact analysis, stakeholder notification, and resolution tracking — replacing a manual, multi-team coordination process.',
      problem:
        'Outage events in industrial and manufacturing environments require fast, coordinated responses across operations, IT, and management. Manual coordination means delayed notifications, inconsistent impact assessments, and no audit trail. Teams spent more time on coordination overhead than resolution.',
      whatIBuilt:
        'A Copilot Studio orchestrator agent that classifies incoming outage triggers and routes to three specialized agents: an Impact Analysis agent (queries SharePoint for asset criticality and business exposure), a Communication agent (drafts and sends M365/Teams notifications to relevant stakeholders), and a Tracking agent (creates resolution tasks and updates SharePoint status records). Power Automate flows handle the integration layer.',
      myRole:
        'Designed the multi-agent architecture, built all Copilot Studio agents and topic flows, authored the Power Automate integration flows, set up the SharePoint data layer for asset and stakeholder records, and configured M365 notification templates. Demoed the end-to-end workflow to internal stakeholders.',
      architecture:
        'Copilot Studio orchestrator receives outage triggers via HTTP or Teams message. It classifies severity and routes to specialized agents. Each agent operates independently with its own topic flows and SharePoint data sources. Power Automate bridges Copilot Studio to SharePoint, Teams, and Outlook. Resolution state is persisted in a SharePoint list with audit history.',
      impact:
        'Demonstrated at an internal demo, showing AI-orchestrated incident response reducing manual coordination steps from ~12 touchpoints to 3. Validated Copilot Studio as a viable platform for complex enterprise workflow automation.',
      improvements:
        'Integrate IoT sensor streams as real-time outage triggers. Add predictive outage detection using historical pattern data. Build cross-organization agent federation for supplier coordination. Add SLA tracking and escalation logic.',
    },
  },
  {
    id: 'url-shortener',
    badge: 'Cloud Infrastructure',
    domain: 'cloud',
    featured: false,
    title: 'URL Shortener',
    description:
      'Serverless Azure URL shortener with storage, monitoring, clean routing, and cloud-native fundamentals.',
    tech: ['Azure Functions', 'Azure Storage', 'Azure Monitor'],
    meta: 'Azure Starter Build · 2026',
    imagePath: '/projects/url-shortener-cover.png',
    videoPath: '/projects/url-shortener-demo.mp4',
    liveDemoUrl: undefined,
    githubUrl: undefined,
    placeholderGradient:
      'linear-gradient(135deg, #0a1628 0%, #0e2244 50%, #050c1a 100%)',
    caseStudy: {
      overview:
        'A production-aware serverless URL shortener built entirely on Azure-native primitives. Designed to demonstrate cloud fundamentals — Functions, Table Storage, Monitor, and Application Insights — in a clean, maintainable codebase rather than a toy project.',
      problem:
        'Most Azure tutorials produce throwaway code that doesn\'t reflect real production considerations. I needed a small, well-scoped project that forced clean architecture decisions: stateless compute, persistent storage, observability, and proper routing — without over-engineering.',
      whatIBuilt:
        'Two Azure Functions: a creation endpoint that accepts a long URL, generates a short slug, and persists the mapping in Azure Table Storage; and a redirect endpoint that resolves slugs to destination URLs with proper 301/302 responses. Application Insights tracks request telemetry, error rates, and latency. Azure Monitor alerts on function failures.',
      myRole:
        'Full cloud design and implementation. Function architecture, Table Storage schema, Application Insights instrumentation, Azure Monitor alert rules, and deployment configuration via Azure CLI and Infrastructure-as-Code. Also handled custom domain routing configuration.',
      architecture:
        'HTTP-triggered Azure Functions (Node.js) serve as the compute layer. Azure Table Storage provides low-latency key-value persistence for slug → URL mappings with no operational overhead. Application Insights provides out-of-the-box telemetry. Functions are deployed via GitHub Actions to Azure Function App with slot-based staging.',
      impact:
        'A clean, production-aware reference implementation demonstrating Azure serverless fundamentals. Served as a foundation for understanding Azure\'s core building blocks before working on larger enterprise systems.',
      improvements:
        'Add custom vanity slugs with validation. Build a link analytics dashboard using Application Insights query results. Add link expiration dates and click-through tracking. Implement rate limiting via Azure API Management.',
    },
  },
];
