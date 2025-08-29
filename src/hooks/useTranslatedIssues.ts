import { useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translateDynamicContent } from '../utils/translation';

interface Issue {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  priority: number;
  location: string;
  reporterName: string;
  createdAt: string;
  updatedAt?: string;
  department?: string;
  assignedTo?: string;
  resolutionNote?: string;
  citizenRating?: number;
  images?: string[];
}

export const useTranslatedIssues = (issues: Issue[]) => {
  const { language } = useLanguage();

  const translatedIssues = useMemo(() => {
    return issues.map(issue => ({
      ...issue,
      title: translateDynamicContent(issue.title, language),
      description: translateDynamicContent(issue.description, language),
      location: translateDynamicContent(issue.location, language),
      reporterName: translateDynamicContent(issue.reporterName, language),
      department: issue.department ? translateDynamicContent(issue.department, language) : undefined,
      assignedTo: issue.assignedTo ? translateDynamicContent(issue.assignedTo, language) : undefined,
      resolutionNote: issue.resolutionNote ? translateDynamicContent(issue.resolutionNote, language) : undefined
    }));
  }, [issues, language]);

  return translatedIssues;
};