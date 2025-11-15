import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all children for a user
export const getChildren = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("children")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

// Add a new child
export const addChild = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    age: v.number(),
    dateOfBirth: v.string(),
    concerns: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("children", {
      userId: args.userId,
      name: args.name,
      age: args.age,
      dateOfBirth: args.dateOfBirth,
      concerns: args.concerns,
      createdAt: Date.now(),
    });
  },
});

// Get parent profile
export const getParentProfile = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("parentProfiles")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();
  },
});

// Save parent profile
export const saveParentProfile = mutation({
  args: {
    userId: v.string(),
    email: v.string(),
    acceptedPrivacyPolicy: v.boolean(),
    acceptedTerms: v.boolean(),
    acceptedDisclaimer: v.boolean(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("parentProfiles")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        email: args.email,
        acceptedPrivacyPolicy: args.acceptedPrivacyPolicy,
        acceptedTerms: args.acceptedTerms,
        acceptedDisclaimer: args.acceptedDisclaimer,
      });
      return existing._id;
    } else {
      return await ctx.db.insert("parentProfiles", {
        userId: args.userId,
        email: args.email,
        acceptedPrivacyPolicy: args.acceptedPrivacyPolicy,
        acceptedTerms: args.acceptedTerms,
        acceptedDisclaimer: args.acceptedDisclaimer,
        createdAt: Date.now(),
      });
    }
  },
});

// Generate unique report code
function generateReportCode(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

// Generate upload URL for file storage
export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Save test results/report with unique report code (for teacher uploads)
export const saveTestResults = mutation({
  args: {
    teacherId: v.string(),
    studentName: v.string(),
    grade: v.string(),
    // TEMPORARY: Legacy fields for backward compatibility until Convex regenerates
    gradeLevel: v.optional(v.string()),
    fileName: v.optional(v.string()),
    fileStorageId: v.optional(v.id("_storage")),
    // For LKG-Grade 2: Questionnaire data
    questionnaireData: v.optional(v.array(
      v.object({
        question: v.string(),
        score: v.number(),
      })
    )),
    // For Grade 6+: Marks and 5-factor assessment (input data)
    subjectAssessments: v.optional(v.array(
      v.object({
        subjectName: v.string(),
        obtainedMarks: v.number(),
        totalMarks: v.optional(v.number()),
        assessmentParameters: v.object({
          conceptualUnderstanding: v.number(),
          recall: v.number(),
          logicalReasoning: v.number(),
          attemptsBonusQuestions: v.number(),
          effortNonConservative: v.number(),
        }),
      })
    )),
    // API analysis results - full response from API
    apiAnalysisResult: v.optional(v.any()),
    // Processed results for display
    domainResults: v.optional(v.array(v.any())),
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
  },
  handler: async (ctx, args) => {
    let reportCode = generateReportCode();
    // Ensure code is unique
    let existing = await ctx.db
      .query("testResults")
      .withIndex("by_report_code", (q) => q.eq("reportCode", reportCode))
      .first();
    
    while (existing) {
      reportCode = generateReportCode();
      existing = await ctx.db
        .query("testResults")
        .withIndex("by_report_code", (q) => q.eq("reportCode", reportCode))
        .first();
    }

    return await ctx.db.insert("testResults", {
      userId: args.teacherId,
      teacherId: args.teacherId,
      studentName: args.studentName,
      grade: args.grade,
      reportCode,
      studentId: undefined,
      questionnaireData: args.questionnaireData,
      subjectAssessments: args.subjectAssessments,
      apiAnalysisResult: args.apiAnalysisResult,
      domainResults: args.domainResults || [],
      results: args.results,
      overallSignal: args.overallSignal,
      timestamp: Date.now(),
      completedAt: args.overallSignal ? Date.now() : undefined,
    });
  },
});

// Get file download URL
export const getFileUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

// Link report to student by code (normalized for case-insensitive lookup)
export const linkReportToStudent = mutation({
  args: {
    reportCode: v.string(),
    studentId: v.string(),
  },
  handler: async (ctx, args) => {
    // Normalize code: uppercase and trim
    const normalizedCode = args.reportCode.toUpperCase().trim();
    
    // Get all reports and find by normalized code
    const allReports = await ctx.db
      .query("testResults")
      .collect();
    
    const report = allReports.find((r) => {
      if (!r.reportCode) return false;
      return String(r.reportCode).toUpperCase().trim() === normalizedCode;
    });
    
    if (!report) {
      throw new Error("Report not found");
    }

    if (report.studentId) {
      throw new Error("Report already linked to a student");
    }

    await ctx.db.patch(report._id, {
      studentId: args.studentId,
    });

    return report._id;
  },
});

// Get report by code (normalized for case-insensitive lookup)
export const getReportByCode = query({
  args: { reportCode: v.string() },
  handler: async (ctx, args) => {
    // Normalize code: uppercase and trim
    const normalizedCode = args.reportCode.toUpperCase().trim();
    
    // Get all reports and find by normalized code
    const allReports = await ctx.db
      .query("testResults")
      .collect();
    
    return allReports.find((r) => {
      if (!r.reportCode) return false;
      return String(r.reportCode).toUpperCase().trim() === normalizedCode;
    }) || null;
  },
});

// Get all reports for a student by studentId (legacy - for linked reports)
export const getStudentReports = query({
  args: { studentId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("testResults")
      .withIndex("by_student", (q) => q.eq("studentId", args.studentId))
      .order("desc")
      .collect();
  },
});

// Get all reports by report code (for students to view all reports with their code)
export const getReportsByCode = query({
  args: { reportCode: v.string() },
  handler: async (ctx, args) => {
    // Normalize code: uppercase and trim
    const normalizedCode = args.reportCode.toUpperCase().trim();
    
    // Get all reports and filter by normalized code
    const allReports = await ctx.db
      .query("testResults")
      .collect();
    
    const filtered = allReports.filter((r) => {
      if (!r.reportCode) return false;
      const reportCodeNormalized = String(r.reportCode).toUpperCase().trim();
      return reportCodeNormalized === normalizedCode;
    });
    
    // Sort by timestamp descending
    return filtered.sort((a, b) => {
      const timeA = a.timestamp || a.completedAt || 0;
      const timeB = b.timestamp || b.completedAt || 0;
      return timeB - timeA;
    });
  },
});

// Get all test results for a teacher
export const getTestResults = query({
  args: { teacherId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("testResults")
      .withIndex("by_teacher", (q) => q.eq("teacherId", args.teacherId))
      .order("desc")
      .collect();
  },
});

// Note: getTestResultsByChild removed - childId no longer exists in testResults schema
// Use getTestResults with teacherId or getStudentReports with studentId instead
