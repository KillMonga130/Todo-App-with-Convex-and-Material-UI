// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tasks: defineTable({
    text: v.string(),
    isCompleted: v.boolean(),
    priority: v.number(), // 1= high, 2= med, 3= low
    dueDate: v.optional(v.string()), 
  }),
});
