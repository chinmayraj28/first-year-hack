import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Children profiles
  children: defineTable({
    userId: v.string(), // Clerk user ID of parent
    name: v.string(),
    age: v.number(),
    dateOfBirth: v.string(),
    concerns: v.array(v.string()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_name", ["userId", "name"]),

  // Test results / Reports
  testResults: defineTable({
    userId: v.string(), // Clerk user ID of teacher
    teacherId: v.string(), // Teacher user ID (same as userId for teacher-uploaded reports)
    studentName: v.string(), // Student name
    grade: v.string(), // Student grade (e.g., "8th Grade", "LKG", "1st Grade")
    reportCode: v.string(), // Unique code for students to access
    studentId: v.optional(v.string()), // Student user ID if linked
    
    // Legacy fields - kept optional for backward compatibility with existing documents
    gradeLevel: v.optional(v.string()), // Deprecated - no longer used
    fileName: v.optional(v.string()), // Deprecated - PDF uploads removed
    fileStorageId: v.optional(v.id("_storage")), // Deprecated - PDF uploads removed
    
    // For LKG-Grade 2: Questionnaire data
    questionnaireData: v.optional(v.array(
      v.object({
        question: v.string(),
        score: v.number(), // 1-5
      })
    )),
    
    // For Grade 6+: Marks and 5-factor assessment (input data)
    subjectAssessments: v.optional(v.array(
      v.object({
        subjectName: v.string(),
        obtainedMarks: v.number(),
        totalMarks: v.optional(v.number()),
        assessmentParameters: v.object({
          conceptualUnderstanding: v.number(), // 1-5
          recall: v.number(), // 1-5
          logicalReasoning: v.number(), // 1-5
          attemptsBonusQuestions: v.number(), // 1-5
          effortNonConservative: v.number(), // 1-5
        }),
      })
    )),
    
    // API analysis results - stores the full response from the API
    apiAnalysisResult: v.optional(v.any()), // Full API response from /api/v1/analysis/advanced
    
    // Processed results from API (for display)
    domainResults: v.optional(v.array(v.any())), // Domain results array (from API analysis)
    results: v.optional(v.array(
      v.object({
        domain: v.string(),
        emoji: v.string(),
        signal: v.string(),
        feedback: v.string(),
        metrics: v.optional(v.object({
          accuracy: v.number(),
          avgReactionTime: v.number(),
          falseClicks: v.number(),
          retries: v.number(),
        })),
      })
    )),
    overallSignal: v.optional(v.string()),
    timestamp: v.number(), // When report was created
    completedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_teacher", ["teacherId"])
    .index("by_report_code", ["reportCode"])
    .index("by_student", ["studentId"]),

  // Parent profiles
  parentProfiles: defineTable({
    userId: v.string(), // Clerk user ID
    email: v.string(),
    acceptedPrivacyPolicy: v.boolean(),
    acceptedTerms: v.boolean(),
    acceptedDisclaimer: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_email", ["email"]),
});
