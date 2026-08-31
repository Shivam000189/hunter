export interface Job {
  id?: string;
  _id?: string;
  company: string;
  role: string;
  status: 'applied' | 'interview' | 'offer' | 'rejected' | 'APPLIED' | 'INTERVIEW' | 'OFFER' | 'REJECTED';
  salary?: string;
  location?: string;
  appliedDate: string;
  notes?: string | null;
  jobUrl?: string | null;
  resumeId?: string | null;
  resume?: { id: string; versionName: string } | null;
}

export interface Reminder {
  _id?: string;
  id?: number;
  company: string;
  action: string;
  date?: string;
  sentAt?: string;
  nextReminder?: string;
  priority?: 'low' | 'medium' | 'high';
  status?: 'overdue' | 'today' | 'upcoming' | 'done';
}

export const INITIAL_JOBS_PRESET: Job[] = [
  { _id: '1', company: 'Google', role: 'Software Engineer', salary: '$150k-$200k', location: 'Mountain View, CA', status: 'interview', appliedDate: new Date(Date.now() - 4 * 86400000).toISOString() },
  { _id: '2', company: 'Meta', role: 'Senior Product Designer', salary: '$140k-$180k', location: 'Remote', status: 'applied', appliedDate: new Date(Date.now() - 2 * 86400000).toISOString() },
  { _id: '3', company: 'Stripe', role: 'Frontend Engineer', salary: '$130k-$170k', location: 'San Francisco, CA', status: 'offer', appliedDate: new Date(Date.now() - 10 * 86400000).toISOString() },
  { _id: '4', company: 'Netflix', role: 'Backend Engineer', salary: '$160k-$220k', location: 'Los Gatos, CA', status: 'rejected', appliedDate: new Date(Date.now() - 14 * 86400000).toISOString() },
  { _id: '5', company: 'Apple', role: 'iOS Developer', salary: '$145k-$190k', location: 'Cupertino, CA', status: 'interview', appliedDate: new Date(Date.now() - 6 * 86400000).toISOString() },
  { _id: '6', company: 'Amazon', role: 'SDE II', salary: '$140k-$185k', location: 'Seattle, WA', status: 'applied', appliedDate: new Date(Date.now() - 3 * 86400000).toISOString() },
  { _id: '7', company: 'Airbnb', role: 'Full Stack Engineer', salary: '$150k-$195k', location: 'Remote', status: 'interview', appliedDate: new Date(Date.now() - 8 * 86400000).toISOString() },
  { _id: '8', company: 'Uber', role: 'Senior Engineer', salary: '$155k-$200k', location: 'San Francisco, CA', status: 'offer', appliedDate: new Date(Date.now() - 12 * 86400000).toISOString() },
];

export const INTERVIEW_QUESTIONS_BY_ROLE: Record<string, string[]> = {
  'Software Engineer': [
    'Tell me about a challenging technical project you worked on and how you overcame architectural obstacles.',
    'Describe a situation where you had to debug a critical production issue under time pressure.',
    'What is your approach to designing scalable and maintainable distributed backend systems?',
    'Tell me about a time when you had to advocate for code quality or technical debt reduction with stakeholders.',
    'How do you prioritize tasks when managing multiple competing deadlines and feature releases?'
  ],
  'Product Manager': [
    'How do you determine what features to prioritize when customer and engineering requirements conflict?',
    'Describe how you measure the success of a newly launched feature.',
    'Tell me about a time when a product launch failed or underperformed. What did you learn?',
    'How do you conduct customer discovery interviews to unearth real user pain points?',
    'How do you communicate complex product roadmaps to cross-functional executive teams?'
  ],
  'UX Designer': [
    'Walk me through your end-to-end design process from problem discovery to final handoff.',
    'How do you balance aesthetic design desires with business goals and tight technical constraints?',
    'Describe a time when usability test results completely invalidated your initial design hypothesis.',
    'How do you collaborate effectively with front-end engineers during design implementation?',
    'What methodologies do you use to establish and evolve unified design systems?'
  ],
  'Data Scientist': [
    'Explain how you would handle imbalanced datasets in a predictive classification model.',
    'Describe a machine learning project where feature engineering significantly improved your model performance.',
    'How do you communicate statistical findings and uncertainty to non-technical business partners?',
    'What is your process for preventing data leakage and ensuring robust model cross-validation?',
    'Tell me about a time when data showed an unexpected result and how you investigated it.'
  ],
  'Engineering Manager': [
    'How do you handle underperformance while maintaining psychological safety in your team?',
    'Describe how you build technical roadmaps that balance product velocity with architectural debt.',
    'How do you foster mentorship, career growth, and autonomy across distributed engineering squads?',
    'Walk me through a conflict between engineering and product and how you resolved it collaboratively.',
    'What key engineering health metrics do you monitor regularly (e.g., DORA metrics)?'
  ]
};
