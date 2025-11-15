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

// Save test results
export const saveTestResults = mutation({
  args: {
    userId: v.string(),
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
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("testResults", {
      userId: args.userId,
      childId: args.childId,
      childName: args.childName,
      results: args.results,
      overallSignal: args.overallSignal,
      completedAt: Date.now(),
    });
  },
});

// Get all test results for a user
export const getTestResults = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("testResults")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

// Get test results for a specific child
export const getTestResultsByChild = query({
  args: { childId: v.id("children") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("testResults")
      .withIndex("by_child", (q) => q.eq("childId", args.childId))
      .order("desc")
      .collect();
  },
});
