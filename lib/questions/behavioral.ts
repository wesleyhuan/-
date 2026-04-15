import type { Difficulty } from '../ai/types'

export interface Question {
  id: string
  type: 'BEHAVIORAL' | 'TECHNICAL' | 'SYSTEM_DESIGN'
  category: string
  difficulty: Difficulty
  question: string
  requiresCode: boolean
  starterCode?: string
  googleFocus: boolean
}

export const behavioralQuestions: Question[] = [
  // Leadership
  {
    id: 'beh-001', type: 'BEHAVIORAL', category: 'leadership', difficulty: 'MEDIUM',
    question: 'Tell me about a time you led a project without formal authority. How did you get others to follow your direction?',
    requiresCode: false, googleFocus: true,
  },
  {
    id: 'beh-002', type: 'BEHAVIORAL', category: 'leadership', difficulty: 'HARD',
    question: 'Describe a situation where you had to make a critical decision with incomplete information. What was your process and outcome?',
    requiresCode: false, googleFocus: true,
  },
  {
    id: 'beh-003', type: 'BEHAVIORAL', category: 'leadership', difficulty: 'MEDIUM',
    question: 'Give me an example of when you identified a problem no one else had noticed and took the initiative to solve it.',
    requiresCode: false, googleFocus: true,
  },

  // Conflict resolution
  {
    id: 'beh-004', type: 'BEHAVIORAL', category: 'conflict', difficulty: 'MEDIUM',
    question: 'Tell me about a time you had a significant disagreement with a colleague or manager. How did you resolve it?',
    requiresCode: false, googleFocus: true,
  },
  {
    id: 'beh-005', type: 'BEHAVIORAL', category: 'conflict', difficulty: 'HARD',
    question: 'Describe a situation where you had to advocate strongly for a technical approach your team initially disagreed with.',
    requiresCode: false, googleFocus: true,
  },
  {
    id: 'beh-006', type: 'BEHAVIORAL', category: 'conflict', difficulty: 'EASY',
    question: 'Tell me about a time you had to work with a difficult team member. How did you handle it?',
    requiresCode: false, googleFocus: false,
  },

  // Failure and learning
  {
    id: 'beh-007', type: 'BEHAVIORAL', category: 'failure', difficulty: 'MEDIUM',
    question: 'Tell me about your biggest professional failure. What did you learn and how did you recover?',
    requiresCode: false, googleFocus: true,
  },
  {
    id: 'beh-008', type: 'BEHAVIORAL', category: 'failure', difficulty: 'HARD',
    question: 'Describe a time a project you led failed to meet its goals. What was your role and what would you do differently?',
    requiresCode: false, googleFocus: true,
  },
  {
    id: 'beh-009', type: 'BEHAVIORAL', category: 'failure', difficulty: 'EASY',
    question: 'Tell me about a time you received critical feedback. How did you respond and what did you change?',
    requiresCode: false, googleFocus: false,
  },

  // Ownership and impact
  {
    id: 'beh-010', type: 'BEHAVIORAL', category: 'ownership', difficulty: 'MEDIUM',
    question: 'Give me an example of when you went above and beyond your job responsibilities to deliver impact.',
    requiresCode: false, googleFocus: true,
  },
  {
    id: 'beh-011', type: 'BEHAVIORAL', category: 'ownership', difficulty: 'HARD',
    question: 'Tell me about a time you identified a significant technical debt issue and drove its resolution despite competing priorities.',
    requiresCode: false, googleFocus: true,
  },
  {
    id: 'beh-012', type: 'BEHAVIORAL', category: 'ownership', difficulty: 'EASY',
    question: 'Describe a time when you took ownership of a problem that wasn\'t originally your responsibility.',
    requiresCode: false, googleFocus: false,
  },

  // Communication
  {
    id: 'beh-013', type: 'BEHAVIORAL', category: 'communication', difficulty: 'MEDIUM',
    question: 'Tell me about a time you had to explain a complex technical concept to a non-technical stakeholder. How did you approach it?',
    requiresCode: false, googleFocus: true,
  },
  {
    id: 'beh-014', type: 'BEHAVIORAL', category: 'communication', difficulty: 'EASY',
    question: 'Give me an example of when you had to deliver difficult news to your team or manager. How did you handle it?',
    requiresCode: false, googleFocus: false,
  },

  // Ambiguity
  {
    id: 'beh-015', type: 'BEHAVIORAL', category: 'ambiguity', difficulty: 'MEDIUM',
    question: 'Tell me about a time you started a project with very unclear requirements. How did you move forward?',
    requiresCode: false, googleFocus: true,
  },
  {
    id: 'beh-016', type: 'BEHAVIORAL', category: 'ambiguity', difficulty: 'HARD',
    question: 'Describe the most ambiguous problem you\'ve worked on. How did you create clarity and structure for your team?',
    requiresCode: false, googleFocus: true,
  },

  // Collaboration
  {
    id: 'beh-017', type: 'BEHAVIORAL', category: 'collaboration', difficulty: 'EASY',
    question: 'Tell me about a successful project you completed as part of a team. What was your specific contribution?',
    requiresCode: false, googleFocus: false,
  },
  {
    id: 'beh-018', type: 'BEHAVIORAL', category: 'collaboration', difficulty: 'MEDIUM',
    question: 'Give me an example of when you worked with a cross-functional team to deliver a project. What challenges did you face?',
    requiresCode: false, googleFocus: true,
  },

  // Innovation
  {
    id: 'beh-019', type: 'BEHAVIORAL', category: 'innovation', difficulty: 'MEDIUM',
    question: 'Tell me about a time you proposed and implemented an innovative solution that significantly improved a process or product.',
    requiresCode: false, googleFocus: true,
  },
  {
    id: 'beh-020', type: 'BEHAVIORAL', category: 'innovation', difficulty: 'HARD',
    question: 'Describe a time you challenged the status quo and pushed for a fundamentally different approach. What happened?',
    requiresCode: false, googleFocus: true,
  },

  // Time management
  {
    id: 'beh-021', type: 'BEHAVIORAL', category: 'time-management', difficulty: 'EASY',
    question: 'Tell me about a time you had to manage multiple high-priority tasks simultaneously. How did you prioritize?',
    requiresCode: false, googleFocus: false,
  },
  {
    id: 'beh-022', type: 'BEHAVIORAL', category: 'time-management', difficulty: 'MEDIUM',
    question: 'Describe a situation where you had to deliver a project under extreme time pressure. What trade-offs did you make?',
    requiresCode: false, googleFocus: true,
  },

  // Customer focus
  {
    id: 'beh-023', type: 'BEHAVIORAL', category: 'customer-focus', difficulty: 'MEDIUM',
    question: 'Tell me about a time user feedback fundamentally changed your technical approach. What did you learn?',
    requiresCode: false, googleFocus: true,
  },
  {
    id: 'beh-024', type: 'BEHAVIORAL', category: 'customer-focus', difficulty: 'HARD',
    question: 'Describe a time you had to balance technical excellence with shipping quickly for users. How did you decide?',
    requiresCode: false, googleFocus: true,
  },

  // Mentorship
  {
    id: 'beh-025', type: 'BEHAVIORAL', category: 'mentorship', difficulty: 'MEDIUM',
    question: 'Tell me about a time you mentored a junior colleague. How did you help them grow and what was the outcome?',
    requiresCode: false, googleFocus: true,
  },
  {
    id: 'beh-026', type: 'BEHAVIORAL', category: 'mentorship', difficulty: 'HARD',
    question: 'Describe a time you had to give candid performance feedback to a peer or report. How did you approach it?',
    requiresCode: false, googleFocus: true,
  },

  // Technical judgment
  {
    id: 'beh-027', type: 'BEHAVIORAL', category: 'technical-judgment', difficulty: 'HARD',
    question: 'Tell me about a time you had to choose between two viable technical solutions with significant trade-offs. Walk me through your reasoning.',
    requiresCode: false, googleFocus: true,
  },
  {
    id: 'beh-028', type: 'BEHAVIORAL', category: 'technical-judgment', difficulty: 'MEDIUM',
    question: 'Describe a time you advocated for simplicity when the team was over-engineering a solution.',
    requiresCode: false, googleFocus: true,
  },

  // Integrity
  {
    id: 'beh-029', type: 'BEHAVIORAL', category: 'integrity', difficulty: 'MEDIUM',
    question: 'Tell me about a time you discovered a critical bug or issue right before launch. What did you do?',
    requiresCode: false, googleFocus: true,
  },
  {
    id: 'beh-030', type: 'BEHAVIORAL', category: 'integrity', difficulty: 'HARD',
    question: 'Describe a time you had to push back on a decision from leadership that you believed was wrong. How did you handle it?',
    requiresCode: false, googleFocus: true,
  },
]
