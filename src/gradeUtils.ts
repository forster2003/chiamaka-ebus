/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StudentResult, SubjectScore } from './types';

export const SCHOOL_LOGO_URL = 'https://i.ibb.co/HTP5dHHD/Whats-App-Image-2026-06-30-at-10-02-49-AM.jpg';
export const SCHOOL_OFFICIAL_EMAIL = 'holyghostacademy@gmail.com';
export const SCHOOL_MOTTO = 'Moral and Academics (MALU CHUKWU, MALU AKWUKO)';
export const SCHOOL_MANAGER_NAME = 'Engr. ThankGod Ndibe B.Engr., M.Engr.';
export const SCHOOL_MANAGER_PHOTO = 'https://i.ibb.co/pj9SBTbc/cccg.jpg';
export const SCHOOL_WHATSAPP_PHONE_1 = '+234 (0) 905 414 5339';
export const SCHOOL_WHATSAPP_PHONE_2 = '+234 (0) 706 898 6865';
export const SCHOOL_WHATSAPP_URL_1 = 'https://wa.me/2349054145339?text=Hello%20Holy%20Ghost%20Academy%2C%20I%20would%20like%20to%20inquire%20about%20student%20enrollment%20and%20admissions.';
export const SCHOOL_WHATSAPP_URL_2 = 'https://wa.me/2347068986865?text=Hello%20Holy%20Ghost%20Academy%2C%20I%20would%20like%20to%20inquire%20about%20student%20enrollment%20and%20admissions.';

/**
 * Standard WAEC/NECO/Diocesan grading breakdown
 */
export function getGradeFromScore(totalScore: number): { grade: string; remark: string; gradePoint: number } {
  if (totalScore >= 75) {
    return { grade: 'A', remark: 'Excellent', gradePoint: 5.0 };
  } else if (totalScore >= 65) {
    return { grade: 'B', remark: 'Very Good', gradePoint: 4.0 };
  } else if (totalScore >= 50) {
    return { grade: 'C', remark: 'Credit', gradePoint: 3.0 };
  } else if (totalScore >= 45) {
    return { grade: 'D', remark: 'Pass', gradePoint: 2.0 };
  } else if (totalScore >= 40) {
    return { grade: 'E', remark: 'Fair Pass', gradePoint: 1.0 };
  } else {
    return { grade: 'F', remark: 'Fail', gradePoint: 0.0 };
  }
}

/**
 * Generate insightful subject assessment remark based on total score
 */
export function getSubjectAssessmentRemark(subject: string, totalScore: number): string {
  if (totalScore >= 90) return 'Exceptional mastery and superior analytical acumen.';
  if (totalScore >= 80) return 'Distinguished performance with firm conceptual grasp.';
  if (totalScore >= 70) return 'Very good coursework and consistent academic rigor.';
  if (totalScore >= 60) return 'Good comprehension; active class contribution.';
  if (totalScore >= 50) return 'Credit pass; capable of higher achievement with dedication.';
  if (totalScore >= 40) return 'Pass level; targeted review and tutorial focus advised.';
  return 'Below pass threshold; mandatory remedial reinforcement recommended.';
}

export const STANDARD_PROMOTION_STATUS_OPTIONS = [
  'Promoted to Next Class',
  'Promoted to JSS 2',
  'Promoted to JSS 3',
  'Promoted to SS 1',
  'Promoted to SS 2',
  'Promoted to SS 3',
  'Promoted on Trial',
  'Recommended for Advancement',
  'Repeats Class / Not Promoted',
  'Graduated / Passed Out (Certificate Issued)',
  'Advancement Pending Remedial Evaluation',
  'In Progress (Academic Term Ongoing)'
];

/**
 * Determine the next academic class progression in Nigerian secondary school curriculum
 */
export function getNextClassLevel(currentClass?: string): string {
  if (!currentClass) return 'Next Class';
  const trimmed = currentClass.trim();
  const progressionMap: Record<string, string> = {
    'JSS 1': 'JSS 2',
    'JSS 2': 'JSS 3',
    'JSS 3': 'SS 1 (Senior Secondary)',
    'SS 1': 'SS 2',
    'SS 2': 'SS 3',
    'SS 3': 'Graduated / Higher Institution',
  };
  return progressionMap[trimmed] || 'Next Class';
}

/**
 * Automatically determine promotion status according to diocesan pass standards
 */
export function computePromotionStatus(
  classLevel: string = 'SS 2',
  terminalAverage: number = 0,
  failedSubjectsCount: number = 0,
  term?: string
): string {
  const nextClass = getNextClassLevel(classLevel);
  const normalizedClass = classLevel.trim().toUpperCase();

  if (normalizedClass === 'SS 3') {
    return terminalAverage >= 50 
      ? 'Graduated - Eligible for WASSCE / NECO Certification' 
      : 'Advised for Remedial Examination';
  }

  // Check if term is 1st or 2nd term
  if (term && (term.includes('1st') || term.includes('2nd'))) {
    if (terminalAverage >= 50) return `In Good Standing - Advancement on Track to ${nextClass}`;
    if (terminalAverage >= 40) return 'Academic Warning - Remedial Focus Advised';
    return 'Academic Probation - Critical Improvement Needed';
  }

  // 3rd Term (Annual Promotion Decision) or general
  if (terminalAverage >= 50 && failedSubjectsCount <= 2) {
    return `Promoted to ${nextClass}`;
  } else if (terminalAverage >= 45 && failedSubjectsCount <= 3) {
    return `Promoted on Trial to ${nextClass}`;
  } else {
    return `Repeats ${classLevel}`;
  }
}

export interface AcademicEvaluationMetrics {
  grossTotalMarks: number;
  totalMaxMarks: number;
  terminalAverage: number;
  gradePoint: number; // e.g. 4.75 out of 5.00
  accreditedGradeBracket: string; // e.g. "Distinction (A1) - Grade A"
  classStanding: string; // e.g. "1st Class Honors - Exceptional Scholar"
  promotionStatus: string; // e.g. "Promoted to SS 3"
  totalSubjects: number;
}

/**
 * Compute aggregate academic metrics from subject scores and optional saved overrides
 */
export function computeAcademicMetrics(
  subjectScores: SubjectScore[],
  savedResult?: Partial<StudentResult>
): AcademicEvaluationMetrics {
  const totalSubjects = subjectScores.length || 1;
  const calculatedGrossTotal = subjectScores.reduce((sum, s) => sum + (Number(s.totalScore) || 0), 0);
  const totalMaxMarks = totalSubjects * 100;
  const calculatedAverage = Number((calculatedGrossTotal / totalSubjects).toFixed(2));

  // Count failed subjects (< 40)
  const failedSubjectsCount = subjectScores.filter(s => (Number(s.totalScore) || 0) < 40).length;

  // Compute Grade Point Average (GPA out of 5.0)
  const totalGradePoints = subjectScores.reduce((sum, s) => {
    const total = Number(s.totalScore) || 0;
    const { gradePoint } = getGradeFromScore(total);
    return sum + gradePoint;
  }, 0);
  const calculatedGPA = Number((totalGradePoints / totalSubjects).toFixed(2));

  // Use stored metric if provided, otherwise compute standard bracket
  let accreditedGradeBracket = savedResult?.accreditedGradeBracket;
  if (!accreditedGradeBracket) {
    if (calculatedAverage >= 75) {
      accreditedGradeBracket = 'Distinction (A1) - Grade A';
    } else if (calculatedAverage >= 65) {
      accreditedGradeBracket = 'Upper Credit (B2-B3) - Grade B';
    } else if (calculatedAverage >= 50) {
      accreditedGradeBracket = 'Credit (C4-C6) - Grade C';
    } else if (calculatedAverage >= 40) {
      accreditedGradeBracket = 'Pass (P7-P8) - Grade D/E';
    } else {
      accreditedGradeBracket = 'Fail (F9) - Grade F';
    }
  }

  // Use stored standing if provided, otherwise compute standard honors
  let classStanding = savedResult?.classStanding;
  if (!classStanding) {
    if (calculatedAverage >= 85) {
      classStanding = '1st Class Honors - Exceptional Scholar';
    } else if (calculatedAverage >= 75) {
      classStanding = 'High Honors Roll - Distinction';
    } else if (calculatedAverage >= 65) {
      classStanding = 'Honors Standing - Upper Credit';
    } else if (calculatedAverage >= 50) {
      classStanding = 'Credit Standing - Satisfactory';
    } else {
      classStanding = 'Remedial Standing - Academic Probation';
    }
  }

  // Use stored promotion status if provided, otherwise compute standard decision
  let promotionStatus = savedResult?.promotionStatus;
  if (!promotionStatus || !promotionStatus.trim()) {
    promotionStatus = computePromotionStatus(
      savedResult?.classLevel || 'SS 2',
      savedResult?.terminalAverage !== undefined ? savedResult.terminalAverage : calculatedAverage,
      failedSubjectsCount,
      savedResult?.term
    );
  }

  return {
    grossTotalMarks: savedResult?.grossTotalMarks !== undefined ? savedResult.grossTotalMarks : calculatedGrossTotal,
    totalMaxMarks,
    terminalAverage: savedResult?.terminalAverage !== undefined ? savedResult.terminalAverage : calculatedAverage,
    gradePoint: savedResult?.gradePoint !== undefined ? savedResult.gradePoint : calculatedGPA,
    accreditedGradeBracket,
    classStanding,
    promotionStatus,
    totalSubjects,
  };
}
