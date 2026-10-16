"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { generateAIBulletImprovements, AIBulletImprovement } from "@/lib/ai/gemini";

export type OptimizationRecord = {
  id: string;
  created_at: string;
  resume_id: string | null;
  job_description: string;
  original_text: string;
  optimized_text: string;
  match_score: number;
  replacements_applied: number;
  matching_skills: string[];
  missing_skills: string[];
  matching_keywords: string[];
  missing_keywords: string[];
};

type SaveOptimizationInput = {
  resumeId?: string | null;
  jobDescription: string;
  originalText: string;
  optimizedText: string;
  matchScore: number;
  replacementsApplied: number;
  matchingSkills: string[];
  missingSkills: string[];
  matchingKeywords: string[];
  missingKeywords: string[];
};

export type SaveOptimizationResult = {
  success: boolean;
  message: string;
  id?: string;
};

export type DeleteOptimizationResult = {
  success: boolean;
  message: string;
};

export async function saveResumeOptimization(
  input: SaveOptimizationInput,
): Promise<SaveOptimizationResult> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        success: false,
        message: "You must be logged in to save an optimized resume.",
      };
    }

    if (!input.originalText.trim()) {
      return {
        success: false,
        message: "Original resume text is missing.",
      };
    }

    if (!input.optimizedText.trim()) {
      return {
        success: false,
        message: "Optimized resume text is missing.",
      };
    }

    if (!input.jobDescription.trim()) {
      return {
        success: false,
        message: "Job description is missing.",
      };
    }

    const { data, error } = await supabase
      .from("resume_optimizations")
      .insert({
        user_id: user.id,
        resume_id: input.resumeId?.trim() || null,
        job_description: input.jobDescription.trim(),
        original_text: input.originalText.trim(),
        optimized_text: input.optimizedText.trim(),
        match_score: Math.max(
          0,
          Math.min(100, Math.round(input.matchScore)),
        ),
        replacements_applied: Math.max(
          0,
          Math.round(input.replacementsApplied),
        ),
        matching_skills: input.matchingSkills,
        missing_skills: input.missingSkills,
        matching_keywords: input.matchingKeywords,
        missing_keywords: input.missingKeywords,
      })
      .select("id")
      .single();

    if (error) {
      console.warn("Could not save optimization:", error.message);
      return {
        success: false,
        message: "The optimized resume could not be saved.",
      };
    }

    revalidatePath("/resume-optimizer");

    return {
      success: true,
      message: "Optimized resume saved successfully.",
      id: data.id,
    };
  } catch (error) {
    console.warn("Unexpected optimization save error:", error);
    return {
      success: false,
      message: "Something went wrong while saving the optimized resume.",
    };
  }
}

export async function getResumeOptimizations(): Promise<{
  success: boolean;
  data?: OptimizationRecord[];
  message?: string;
}> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        success: false,
        message: "You must be logged in to view optimization history.",
      };
    }

    const { data, error } = await supabase
      .from("resume_optimizations")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Could not fetch optimizations:", error.message);
      return {
        success: false,
        message: "Failed to fetch optimization history.",
      };
    }

    return {
      success: true,
      data: (data || []) as OptimizationRecord[],
    };
  } catch (error) {
    console.warn("Unexpected fetch optimization error:", error);
    return {
      success: false,
      message: "Something went wrong while fetching optimization history.",
    };
  }
}

export async function deleteResumeOptimization(
  optimizationId: string,
): Promise<DeleteOptimizationResult> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        success: false,
        message: "You must be logged in to delete an optimization.",
      };
    }

    if (!optimizationId.trim()) {
      return {
        success: false,
        message: "Optimization ID is missing.",
      };
    }

    const { error } = await supabase
      .from("resume_optimizations")
      .delete()
      .eq("id", optimizationId)
      .eq("user_id", user.id);

    if (error) {
      console.warn("Could not delete optimization:", error.message);
      return {
        success: false,
        message: "The saved optimization could not be deleted.",
      };
    }

    revalidatePath("/resume-optimizer");

    return {
      success: true,
      message: "Saved optimization deleted successfully.",
    };
  } catch (error) {
    console.warn("Unexpected delete optimization error:", error);
    return {
      success: false,
      message: "Something went wrong while deleting the optimization.",
    };
  }
}

export async function getAIBulletSuggestions(
  bulletPoints: string[],
  jobDescription: string
): Promise<{
  success: boolean;
  data?: AIBulletImprovement[];
  message?: string;
}> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        success: false,
        message: "You must be logged in to request AI bullet suggestions.",
      };
    }

    if (!bulletPoints || bulletPoints.length === 0) {
      return {
        success: false,
        message: "No bullet points provided.",
      };
    }

    if (!jobDescription.trim()) {
      return {
        success: false,
        message: "Job description is missing.",
      };
    }

    const aiResult = await generateAIBulletImprovements(bulletPoints, jobDescription);

    if (!aiResult.success || !aiResult.data) {
      return {
        success: false,
        message: aiResult.error || "Failed to generate AI bullet improvements.",
      };
    }

    return {
      success: true,
      data: aiResult.data,
    };
  } catch (error) {
    console.warn("Unexpected AI bullet suggestion error:", error);
    return {
      success: false,
      message: "An unexpected error occurred while generating AI suggestions.",
    };
  }
}