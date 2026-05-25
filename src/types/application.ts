// 投递申请类型定义

export interface JobApplication {
  id: string;
  companyName: string;
  position: string;
  jdContent?: string;
  matchScore?: number;
  status: 'applied' | 'viewed' | 'interview' | 'offer' | 'rejected' | 'ghosted';
  applyDate: string;
  followUpDate?: string;
  notes?: string;
  salary?: string;
  location?: string;
  platform?: string; // 投递平台：Boss直聘、智联招聘等
  contactName?: string;
  contactInfo?: string;
}

export type ApplicationStatus = JobApplication['status'];

export const STATUS_CONFIG: Record<ApplicationStatus, { label: string; color: string; icon: string }> = {
  applied: { label: '已投递', color: 'blue', icon: '📤' },
  viewed: { label: '已查看', color: 'cyan', icon: '👀' },
  interview: { label: '面试中', color: 'orange', icon: '🤝' },
  offer: { label: '已录用', color: 'green', icon: '🎉' },
  rejected: { label: '已拒绝', color: 'red', icon: '❌' },
  ghosted: { label: '无回复', color: 'gray', icon: '👻' },
};

// LocalStorage key
const APPLICATIONS_KEY = 'jobmate_applications';

// 加载所有投递记录
export function loadApplications(): JobApplication[] {
  const saved = localStorage.getItem(APPLICATIONS_KEY);
  if (!saved) return [];
  try {
    return JSON.parse(saved);
  } catch {
    return [];
  }
}

// 保存投递记录
export function saveApplications(applications: JobApplication[]): void {
  localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(applications));
}

// 添加投递记录
export function addApplication(application: Omit<JobApplication, 'id'>): JobApplication {
  const applications = loadApplications();
  const newApplication: JobApplication = {
    ...application,
    id: Date.now().toString(),
  };
  applications.push(newApplication);
  saveApplications(applications);
  return newApplication;
}

// 更新投递记录
export function updateApplication(id: string, updates: Partial<JobApplication>): JobApplication | null {
  const applications = loadApplications();
  const index = applications.findIndex((app) => app.id === id);
  if (index === -1) return null;

  applications[index] = { ...applications[index], ...updates };
  saveApplications(applications);
  return applications[index];
}

// 删除投递记录
export function deleteApplication(id: string): boolean {
  const applications = loadApplications();
  const filtered = applications.filter((app) => app.id !== id);
  if (filtered.length === applications.length) return false;
  saveApplications(filtered);
  return true;
}

// 获取需要跟进的投递（超过7天无更新）
export function getFollowUpApplications(): JobApplication[] {
  const applications = loadApplications();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  return applications.filter((app) => {
    const applyDate = new Date(app.applyDate);
    const isOld = applyDate < sevenDaysAgo;
    const needsFollowUp = app.status === 'applied' || app.status === 'viewed';
    return isOld && needsFollowUp;
  });
}

// 获取统计数据
export function getApplicationStats() {
  const applications = loadApplications();
  const total = applications.length;
  const byStatus = {
    applied: applications.filter((a) => a.status === 'applied').length,
    viewed: applications.filter((a) => a.status === 'viewed').length,
    interview: applications.filter((a) => a.status === 'interview').length,
    offer: applications.filter((a) => a.status === 'offer').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
    ghosted: applications.filter((a) => a.status === 'ghosted').length,
  };

  const responseRate = total > 0 ? Math.round(((byStatus.viewed + byStatus.interview + byStatus.offer + byStatus.rejected) / total) * 100) : 0;
  const interviewRate = total > 0 ? Math.round(((byStatus.interview + byStatus.offer) / total) * 100) : 0;
  const offerRate = total > 0 ? Math.round((byStatus.offer / total) * 100) : 0;

  return {
    total,
    byStatus,
    responseRate,
    interviewRate,
    offerRate,
    followUpCount: getFollowUpApplications().length,
  };
}
