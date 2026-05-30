export interface EmailDetails {
  id: string;
  subject: string;
  sender: string;
  date: string;
  snippet: string;
  importanceScore: number;
  category: 'Career' | 'Education' | 'Finance' | 'Personal' | 'Security' | 'Promotions' | 'Newsletters' | 'Social';
  sentiment: 'Positive' | 'Neutral' | 'Negative' | 'Urgent';
  summary: string;
  actionRequired: boolean;
  actionLabel: string;
  isRead: boolean;
}

export interface SmartBriefing {
  summary: string;
  criticalCount: number;
  opportunityCount: number;
  deadlineCount: number;
  pendingRepliesCount: number;
}

export interface Opportunity {
  id: string;
  title: string;
  entity: string;
  deadline: string;
  description: string;
  type: 'Internship' | 'Scholarship' | 'Job' | 'Competition' | 'Hackathon' | 'Other';
  emailId: string;
}

export interface Deadline {
  id: string;
  event: string;
  date: string;
  type: string;
  urgency: 'High' | 'Medium' | 'Low';
  emailId: string;
}

export interface Relationship {
  name: string;
  email: string;
  frequency: number;
  importanceScore: number;
  relationshipType: string;
}

export interface Trends {
  careerEmailsPercentChange: number;
  promoEmailsPercentChange: number;
  unreadEmailsPercentChange: number;
  healthScore: number;
}

export interface AnalysisResults {
  emails: EmailDetails[];
  briefing: SmartBriefing;
  opportunities: Opportunity[];
  deadlines: Deadline[];
  relationships: Relationship[];
  trends: Trends;
  weeklyReport: string;
}

export interface ChatMessage {
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}
