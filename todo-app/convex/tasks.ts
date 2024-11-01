// convex/tasks.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all tasks
export const get = query({
    args: {},
    handler: async (ctx) => {
      return await ctx.db.query("tasks").collect();
    },
  });
  
  // Add a new task
  export const add = mutation({
    args: { text: v.string(), priority: v.optional(v.number()), dueDate: v.optional(v.string()) },
    handler: async (ctx, { text, priority = 2, dueDate }) => {
      return await ctx.db.insert("tasks", { text, isCompleted: false, priority, dueDate });
    },
  });
  
  // Toggle task completion
  export const toggle = mutation({
    args: { id: v.id("tasks"), isCompleted: v.boolean() },
    handler: async (ctx, { id, isCompleted }) => {
      await ctx.db.patch(id, { isCompleted });
    },
  });
  
  // Remove a task
  export const remove = mutation({
    args: { id: v.id("tasks") },
    handler: async (ctx, { id }) => {
      await ctx.db.delete(id);
    },
  });
  
  // Edit task text
  export const edit = mutation({
    args: { id: v.id("tasks"), newText: v.string() },
    handler: async (ctx, { id, newText }) => {
      await ctx.db.patch(id, { text: newText });
    },
  });
  
  // Update priority
  export const updatePriority = mutation({
    args: { id: v.id("tasks"), priority: v.number() },
    handler: async (ctx, { id, priority }) => {
      await ctx.db.patch(id, { priority });
    },
  });