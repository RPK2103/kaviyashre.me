// ─── Types ────────────────────────────────────────────────────────────────────

export type SkillCategory = 'ai' | 'backend' | 'cloud' | 'architecture' | 'product';

/**
 * Normalised position within the 1000×500 logical canvas.
 * x: 0–1 maps to canvas width; y: 0–1 maps to canvas height.
 */
export interface SkillPos {
  x: number;
  y: number;
}

export interface SkillItem {
  id: string;
  label: string;
  emoji?: string;
  type: 'root' | 'child';
  category: SkillCategory;
  pos: SkillPos;
  /** IDs of directly connected nodes (children for roots, parent for children). */
  connections: string[];
  description: string;
  technologies: string[];
  projects: string[];
  usageContext: string;
  children?: SkillItem[];
}

// ─── Skills Graph ─────────────────────────────────────────────────────────────
//
// Logical canvas: 1000 × 500
// Root nodes are large hub circles; child nodes are smaller pills.
// Positions chosen so no nodes overlap and the graph reads naturally left→right.

export const skillsGraph: SkillItem[] = [
  // ── AI ──────────────────────────────────────────────────────────────────────
  {
    id: 'ai',
    label: 'AI',
    emoji: '🤖',
    type: 'root',
    category: 'ai',
    pos: { x: 0.06, y: 0.13 },
    connections: ['azure-openai', 'agents', 'prompt-engineering', 'rag', 'ai-automation'],
    description:
      'Building intelligent systems using LLMs, agent frameworks, and retrieval-augmented architectures — from prototype to production.',
    technologies: ['Azure OpenAI', 'LangChain', 'Python', 'Pinecone', 'Semantic Kernel'],
    projects: ['AI Resume Matcher', 'AI Interview Coach', 'SignalForge'],
    usageContext:
      'Designing and shipping production AI pipelines that surface real business value from unstructured data.',
    children: [
      {
        id: 'azure-openai',
        label: 'Azure OpenAI',
        type: 'child',
        category: 'ai',
        pos: { x: 0.22, y: 0.04 },
        connections: ['ai'],
        description:
          'Deploying GPT-4o and Ada embedding models via Azure OpenAI Service for production workloads with enterprise-grade reliability.',
        technologies: ['Azure OpenAI', 'GPT-4o', 'text-embedding-ada-002', 'REST API', 'Token management'],
        projects: ['AI Resume Matcher', 'SignalForge'],
        usageContext:
          'Used in production for document intelligence, semantic search, and AI-powered Q&A systems.',
      },
      {
        id: 'agents',
        label: 'Agents',
        type: 'child',
        category: 'ai',
        pos: { x: 0.22, y: 0.18 },
        connections: ['ai'],
        description:
          'Designing autonomous agent pipelines with tool use, memory, and multi-step reasoning across complex workflows.',
        technologies: ['LangChain Agents', 'ReAct', 'Tool Calling', 'Semantic Kernel', 'AutoGen'],
        projects: ['AI Interview Coach', 'SignalForge'],
        usageContext:
          'Built agents that autonomously retrieve, reason, and respond across multi-step workflows.',
      },
      {
        id: 'ai-automation',
        label: 'AI Automation',
        type: 'child',
        category: 'ai',
        pos: { x: 0.22, y: 0.31 },
        connections: ['ai'],
        description:
          'Building automated workflows that combine AI intelligence with business process logic to reduce manual toil.',
        technologies: ['Power Automate', 'Azure Logic Apps', 'Python scripts', 'Webhooks', 'REST triggers'],
        projects: ['SignalForge', 'Internal Platforms'],
        usageContext:
          'Reduced manual effort on internal engineering workflows using AI-triggered automations.',
      },
      {
        id: 'prompt-engineering',
        label: 'Prompt Engineering',
        type: 'child',
        category: 'ai',
        pos: { x: 0.40, y: 0.08 },
        connections: ['ai'],
        description:
          'Crafting structured prompts and system instructions that reliably guide LLM behaviour at scale.',
        technologies: ['Few-shot prompting', 'Chain-of-thought', 'Structured outputs', 'JSON mode', 'System prompts'],
        projects: ['AI Resume Matcher', 'AI Interview Coach'],
        usageContext:
          'Applied iteratively to improve accuracy, reduce hallucinations, and enforce output formats.',
      },
      {
        id: 'rag',
        label: 'RAG',
        type: 'child',
        category: 'ai',
        pos: { x: 0.40, y: 0.22 },
        connections: ['ai'],
        description:
          'Building retrieval-augmented generation pipelines to ground LLMs in private or real-time domain knowledge.',
        technologies: ['Vector DBs', 'Pinecone', 'Chroma', 'Azure AI Search', 'Embeddings'],
        projects: ['AI Resume Matcher', 'SignalForge'],
        usageContext:
          'Core architecture for any AI feature requiring accurate, context-specific knowledge retrieval.',
      },
    ],
  },

  // ── Backend ──────────────────────────────────────────────────────────────────
  {
    id: 'backend',
    label: 'Backend',
    emoji: '⚙️',
    type: 'root',
    category: 'backend',
    pos: { x: 0.06, y: 0.47 },
    connections: ['java', 'spring-boot', 'fastapi', 'rest-apis'],
    description:
      'Building scalable backend services, REST APIs, and microservice architectures with Java and Python as core languages.',
    technologies: ['Java', 'Spring Boot', 'FastAPI', 'PostgreSQL', 'Redis'],
    projects: ['SignalForge', 'Skill Repository Pro', 'Internal Platforms'],
    usageContext:
      'Primary engineering stack for production services — focused on reliability, observability, and performance.',
    children: [
      {
        id: 'java',
        label: 'Java',
        type: 'child',
        category: 'backend',
        pos: { x: 0.22, y: 0.41 },
        connections: ['backend'],
        description:
          'Building production-grade services in Java with strong typing, OOP design, and performance characteristics.',
        technologies: ['Java 17+', 'Maven', 'Gradle', 'JUnit', 'Mockito'],
        projects: ['Skill Repository Pro', 'Internal Platforms'],
        usageContext: 'Core language at work for enterprise backend services and API development.',
      },
      {
        id: 'spring-boot',
        label: 'Spring Boot',
        type: 'child',
        category: 'backend',
        pos: { x: 0.22, y: 0.55 },
        connections: ['backend'],
        description:
          'Developing REST APIs and microservices with Spring Boot, handling auth, data persistence, and third-party integrations.',
        technologies: ['Spring Boot', 'Spring Security', 'Spring Data JPA', 'Spring MVC', 'Spring Cloud'],
        projects: ['Skill Repository Pro', 'Internal Platforms'],
        usageContext: 'Used daily at work for building and maintaining enterprise-scale REST APIs.',
      },
      {
        id: 'fastapi',
        label: 'FastAPI',
        type: 'child',
        category: 'backend',
        pos: { x: 0.40, y: 0.43 },
        connections: ['backend'],
        description:
          'Building fast, type-safe Python APIs for AI-integrated services and internal tooling with automatic documentation.',
        technologies: ['FastAPI', 'Pydantic', 'Uvicorn', 'SQLAlchemy', 'Pytest'],
        projects: ['AI Resume Matcher', 'AI Interview Coach', 'SignalForge'],
        usageContext:
          'Preferred Python framework for AI backend services — fast to build, easy to document, fully type-safe.',
      },
      {
        id: 'rest-apis',
        label: 'REST APIs',
        type: 'child',
        category: 'backend',
        pos: { x: 0.40, y: 0.57 },
        connections: ['backend'],
        description:
          'Designing clean, versioned, and well-documented REST APIs following API-first principles with consistent contracts.',
        technologies: ['OpenAPI / Swagger', 'REST principles', 'Postman', 'API versioning', 'Rate limiting'],
        projects: ['SignalForge', 'Skill Repository Pro', 'Internal Platforms'],
        usageContext:
          'Designed APIs consumed by frontends, third-party integrations, and AI pipeline services.',
      },
    ],
  },

  // ── Cloud ────────────────────────────────────────────────────────────────────
  {
    id: 'cloud',
    label: 'Cloud',
    emoji: '☁️',
    type: 'root',
    category: 'cloud',
    pos: { x: 0.06, y: 0.79 },
    connections: ['azure', 'aws', 'kubernetes'],
    description:
      'Deploying and managing cloud-native applications on Azure and AWS with infrastructure-as-code and container orchestration.',
    technologies: ['Azure', 'AWS', 'Kubernetes', 'Terraform', 'Docker'],
    projects: ['Internal Platforms', 'SignalForge'],
    usageContext:
      'Provisioning, deploying, and maintaining cloud infrastructure across enterprise and personal projects.',
    children: [
      {
        id: 'azure',
        label: 'Azure',
        type: 'child',
        category: 'cloud',
        pos: { x: 0.22, y: 0.70 },
        connections: ['cloud'],
        description:
          'Deploying enterprise workloads on Azure — App Service, AKS, Functions, AI Services, and monitoring.',
        technologies: ['Azure App Service', 'Azure Functions', 'AKS', 'Azure AI', 'Azure DevOps', 'Azure Monitor'],
        projects: ['Internal Platforms', 'SignalForge'],
        usageContext:
          'Primary cloud platform at work. Used for both AI services and traditional backend deployments.',
      },
      {
        id: 'aws',
        label: 'AWS',
        type: 'child',
        category: 'cloud',
        pos: { x: 0.22, y: 0.85 },
        connections: ['cloud'],
        description:
          'Building and deploying serverless and containerised applications using core AWS services.',
        technologies: ['Lambda', 'EC2', 'S3', 'RDS', 'CloudFormation', 'ECS'],
        projects: ['Personal Projects', 'AI Experiments'],
        usageContext:
          'Used for personal projects, experimentation, and understanding multi-cloud patterns.',
      },
      {
        id: 'kubernetes',
        label: 'Kubernetes',
        type: 'child',
        category: 'cloud',
        pos: { x: 0.40, y: 0.76 },
        connections: ['cloud'],
        description:
          'Orchestrating containerised workloads with Kubernetes for reliability, horizontal scaling, and zero-downtime deploys.',
        technologies: ['Kubernetes', 'Helm', 'kubectl', 'Ingress controllers', 'ConfigMaps', 'Secrets'],
        projects: ['Internal Platforms'],
        usageContext: 'Managing microservice deployments in production AKS environments.',
      },
    ],
  },

  // ── Architecture ─────────────────────────────────────────────────────────────
  {
    id: 'architecture',
    label: 'Architecture',
    emoji: '🏗',
    type: 'root',
    category: 'architecture',
    pos: { x: 0.64, y: 0.13 },
    connections: ['system-design', 'distributed-systems', 'event-driven'],
    description:
      'Designing distributed systems with a focus on scalability, event-driven patterns, and long-term operational clarity.',
    technologies: ['System Design', 'Kafka', 'Event Sourcing', 'CQRS', 'DDD'],
    projects: ['SignalForge', 'Internal Platforms'],
    usageContext:
      'Applied when scoping new systems or refactoring existing ones to handle scale and future maintainability.',
    children: [
      {
        id: 'system-design',
        label: 'System Design',
        type: 'child',
        category: 'architecture',
        pos: { x: 0.80, y: 0.04 },
        connections: ['architecture'],
        description:
          'Scoping and designing systems at scale — from API design to database sharding strategies to CDN placement.',
        technologies: ['HLD', 'LLD', 'Capacity estimation', 'Trade-off analysis', 'Diagrams-as-code'],
        projects: ['SignalForge', 'Internal Platforms'],
        usageContext:
          'Core skill for technical conversations and for making sound architecture decisions at work.',
      },
      {
        id: 'distributed-systems',
        label: 'Distributed Systems',
        type: 'child',
        category: 'architecture',
        pos: { x: 0.81, y: 0.19 },
        connections: ['architecture'],
        description:
          'Building systems that operate across multiple nodes with well-understood consistency and failure characteristics.',
        technologies: ['CAP theorem', 'Eventual consistency', 'Consensus', 'Service mesh', 'Circuit breakers'],
        projects: ['Internal Platforms'],
        usageContext:
          'Applied when designing fault-tolerant, resilient backend services in production.',
      },
      {
        id: 'event-driven',
        label: 'Event-Driven',
        type: 'child',
        category: 'architecture',
        pos: { x: 0.92, y: 0.11 },
        connections: ['architecture'],
        description:
          'Building loosely coupled systems using event-driven architecture and message streaming for async workflows.',
        technologies: ['Kafka', 'Azure Service Bus', 'RabbitMQ', 'Event Grid', 'Dead-letter queues'],
        projects: ['SignalForge', 'Internal Platforms'],
        usageContext:
          'Used for async service communication and real-time data pipeline architectures.',
      },
    ],
  },

  // ── Product ───────────────────────────────────────────────────────────────────
  {
    id: 'product',
    label: 'Product',
    emoji: '📦',
    type: 'root',
    category: 'product',
    pos: { x: 0.64, y: 0.65 },
    connections: ['product-thinking', 'ux-awareness', 'internal-platforms', 'execution'],
    description:
      'Bringing product thinking, UX awareness, and execution discipline to every engineering decision.',
    technologies: ['Product strategy', 'User research', 'Roadmapping', 'Metrics', 'Figma'],
    projects: ['SignalForge', 'Portfolio OS', 'AI Interview Coach'],
    usageContext:
      'Connecting engineering decisions to user needs and business outcomes — not just shipping features.',
    children: [
      {
        id: 'product-thinking',
        label: 'Product Thinking',
        type: 'child',
        category: 'product',
        pos: { x: 0.80, y: 0.56 },
        connections: ['product'],
        description:
          'Framing technical work in terms of user problems, value delivery, and measurable outcomes before writing a line of code.',
        technologies: ['Jobs-to-be-done', 'User stories', 'PRDs', 'OKRs', 'Problem framing'],
        projects: ['SignalForge', 'AI Interview Coach'],
        usageContext:
          'Applied before writing a single line of code — understanding the why before the how.',
      },
      {
        id: 'ux-awareness',
        label: 'UX Awareness',
        type: 'child',
        category: 'product',
        pos: { x: 0.80, y: 0.72 },
        connections: ['product'],
        description:
          'Designing interfaces and interactions that feel intuitive, accessible, and delightful across all device sizes.',
        technologies: ['Figma', 'Component design', 'Accessibility', 'Design systems', 'Motion design'],
        projects: ['Portfolio OS', 'SignalForge'],
        usageContext:
          'Brought to every frontend decision — typography, spacing, interaction states, and accessibility.',
      },
      {
        id: 'internal-platforms',
        label: 'Internal Platforms',
        type: 'child',
        category: 'product',
        pos: { x: 0.92, y: 0.62 },
        connections: ['product'],
        description:
          'Building internal developer tools and platforms that measurably improve the daily productivity of engineering teams.',
        technologies: ['Developer portals', 'CI/CD tooling', 'Docs systems', 'Automation dashboards'],
        projects: ['Internal Platforms', 'Skill Repository Pro'],
        usageContext:
          'Shipped internal tools used daily by engineering teams — from APIs to admin dashboards.',
      },
      {
        id: 'execution',
        label: 'Execution',
        type: 'child',
        category: 'product',
        pos: { x: 0.92, y: 0.80 },
        connections: ['product'],
        description:
          'Shipping ideas to production with a bias for action, iteration speed, and learning in public.',
        technologies: ['Agile', 'Sprint planning', 'Jira', 'Git workflows', 'Ship culture'],
        projects: ['All Projects'],
        usageContext:
          'The meta-skill: turning plans into shipped, working software that people actually use.',
      },
    ],
  },
];

export const DEFAULT_SELECTED_SKILL_ID = 'ai';
