// 用户类型
export interface User {
  id: string;
  name: string;
  avatar?: string;
  role: 'student' | 'jobSeeker' | 'employed';
  background: string;
}

// 简历类型
export interface Resume {
  id: string;
  userId: string;
  content: string;
  score: number;
  optimizedContent?: string;
  optimizedScore?: number;
}

// JD分析类型
export interface JDAnalysis {
  id: string;
  jdContent: string;
  matchScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  suggestions: string[];
}

// 面试准备类型
export interface InterviewPrep {
  id: string;
  companyName: string;
  position: string;
  companyInfo: CompanyInfo;
  predictedQuestions: InterviewQuestion[];
}

export interface CompanyInfo {
  name: string;
  industry: string;
  stage: string;
  size: string;
  culture: string[];
  highlights: string[];
}

export interface InterviewQuestion {
  id: string;
  type: 'technical' | 'behavioral' | 'situational';
  question: string;
  suggestedAnswer?: string;
}

// 看板数据类型
export interface DashboardData {
  totalApplications: number;
  interviewRate: number;
  offerCount: number;
  skillRadar: SkillData[];
  applicationTimeline: TimelineData[];
}

export interface SkillData {
  skill: string;
  score: number;
  fullMark: number;
}

export interface TimelineData {
  date: string;
  applications: number;
  interviews: number;
}
