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

  // Test results
  testResults: defineTable({
    userId: v.string(), // Clerk user ID of parent
    childId: v.id("children"),
    childName: v.string(),
    results: v.array(
      v.object({
        domain: v.string(),
        emoji: v.string(),
        signal: v.string(),
        feedback: v.string(),
        metrics: v.object({
          accuracy: v.number(),
          avgReactionTime: v.number(),
          falseClicks: v.number(),
          retries: v.number(),
        }),
      })
    ),
    overallSignal: v.string(),
    completedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_child", ["childId"])
    .index("by_user_and_child", ["userId", "childId"]),

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
