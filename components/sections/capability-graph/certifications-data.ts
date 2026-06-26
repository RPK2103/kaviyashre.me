// TODO: Replace credentialUrl with actual certificate link.

export type Certification = {
  id: string;
  name: string;
  provider: string;
  shortLabel: string;
  issued: string;
  expires?: string;
  credentialUrl: string;
  accent: 'orange' | 'blue' | 'red' | 'violet';
  markKey: 'aws' | 'azure' | 'oracle';
};

export const certifications: Certification[] = [
  {
    id: 'azure-fundamentals',
    name: 'Microsoft Certified: Azure Fundamentals',
    provider: 'Microsoft',
    shortLabel: 'AZ-900',
    issued: 'Mar 2026',
    credentialUrl: '#',
    accent: 'blue',
    markKey: 'azure',
  },
  {
    id: 'aws-cloud-practitioner',
    name: 'AWS Certified Cloud Practitioner',
    provider: 'Amazon Web Services',
    shortLabel: 'AWS CP',
    issued: 'Dec 2025',
    expires: 'Dec 2028',
    credentialUrl: '#',
    accent: 'orange',
    markKey: 'aws',
  },
  {
    id: 'oracle-genai-professional',
    name: 'OCI 2025 Generative AI Professional',
    provider: 'Oracle',
    shortLabel: 'OCI GenAI Pro',
    issued: 'Oct 2025',
    expires: 'Oct 2027',
    credentialUrl: '#',
    accent: 'violet',
    markKey: 'oracle',
  },
  {
    id: 'oracle-ai-foundations',
    name: 'OCI 2025 AI Foundations Associate',
    provider: 'Oracle',
    shortLabel: 'OCI AI',
    issued: 'Sep 2025',
    expires: 'Sep 2027',
    credentialUrl: '#',
    accent: 'red',
    markKey: 'oracle',
  },
];
