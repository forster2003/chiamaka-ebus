/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StudentResult, SubjectScore } from './types';

export const SCHOOL_LOGO_URL = 'https://i.ibb.co/HTP5dHHD/Whats-App-Image-2026-06-30-at-10-02-49-AM.jpg';
export const SCHOOL_OFFICIAL_EMAIL = 'holyghostacademy@gmail.com';

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

export interface AcademicEvaluationMetrics {
  grossTotalMarks: number;
  totalMaxMarks: number;
  terminalAverage: number;
  gradePoint: number; // e.g. 4.75 out of 5.00
  accreditedGradeBracket: string; // e.g. "Distinction (A1) - Grade A"
  classStanding: string; // e.g. "1st Class Honors - Exceptional Scholar"
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

  return {
    grossTotalMarks: savedResult?.grossTotalMarks !== undefined ? savedResult.grossTotalMarks : calculatedGrossTotal,
    totalMaxMarks,
    terminalAverage: savedResult?.terminalAverage !== undefined ? savedResult.terminalAverage : calculatedAverage,
    gradePoint: savedResult?.gradePoint !== undefined ? savedResult.gradePoint : calculatedGPA,
    accreditedGradeBracket,
    classStanding,
    totalSubjects,
  };
}
