"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

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

        resume_id:
          input.resumeId?.trim() || null,

        job_description:
          input.jobDescription.trim(),

        original_text:
          input.originalText.trim(),

        optimized_text:
          input.optimizedText.trim(),

        match_score: Math.max(
          0,
          Math.min(
            100,
            Math.round(input.matchScore),
          ),
        ),

        replacements_applied:
          Math.max(
            0,
            Math.round(
              input.replacementsApplied,
            ),
          ),

        matching_skills:
          input.matchingSkills,

        missing_skills:
          input.missingSkills,

        matching_keywords:
          input.matchingKeywords,

        missing_keywords:
          input.missingKeywords,
      })
      .select("id")
      .single();

    if (error) {
      console.warn(
        "Could not save optimization:",
        error.message,
      );

      return {
        success: false,
        message:
          "The optimized resume could not be saved.",
      };
    }

    revalidatePath("/resume-optimizer");

    return {
      success: true,
      message:
        "Optimized resume saved successfully.",
      id: data.id,
    };
  } catch (error) {
    console.warn(
      "Unexpected optimization save error:",
      error,
    );

    return {
      success: false,
      message:
        "Something went wrong while saving the optimized resume.",
    };
  }
}