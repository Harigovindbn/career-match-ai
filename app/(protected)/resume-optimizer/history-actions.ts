"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export type DeleteOptimizationResult = {
  success: boolean;
  message: string;
};

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
        message:
          "You must be logged in to delete an optimization.",
      };
    }

    if (!optimizationId.trim()) {
      return {
        success: false,
        message:
          "Optimization ID is missing.",
      };
    }

    const { error } = await supabase
      .from("resume_optimizations")
      .delete()
      .eq("id", optimizationId)
      .eq("user_id", user.id);

    if (error) {
      console.warn(
        "Could not delete optimization:",
        error.message,
      );

      return {
        success: false,
        message:
          "The saved optimization could not be deleted.",
      };
    }

    revalidatePath("/resume-optimizer");

    return {
      success: true,
      message:
        "Saved optimization deleted successfully.",
    };
  } catch (error) {
    console.warn(
      "Unexpected delete optimization error:",
      error,
    );

    return {
      success: false,
      message:
        "Something went wrong while deleting the optimization.",
    };
  }
}