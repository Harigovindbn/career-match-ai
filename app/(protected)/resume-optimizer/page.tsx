'use client';

import { useState, useEffect, useCallback } from 'react';
import OptimizerWorkspace from '@/components/resume-optimizer/OptimizerWorkspace';
import {
  getResumeOptimizations,
  deleteResumeOptimization,
  OptimizationRecord,
} from './actions';
import {
  History,
  Trash2,
  Calendar,
  Sparkles,
  Loader2,
  FileText,
} from 'lucide-react';

export default function ResumeOptimizerPage() {
  const [history, setHistory] = useState<OptimizationRecord[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'optimizer' | 'history'>('optimizer');

  const fetchHistory = useCallback(async () => {
    try {
      const result = await getResumeOptimizations();
      if (result.success && result.data) {
        setHistory(result.data);
      }
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const result = await getResumeOptimizations();
        if (isMounted && result.success && result.data) {
          setHistory(result.data);
        }
      } catch (err) {
        console.error('Failed to load history:', err);
      } finally {
        if (isMounted) {
          setLoadingHistory(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this saved optimization?')) return;
    setDeletingId(id);
    const result = await deleteResumeOptimization(id);
    if (result.success) {
      setHistory((prev) => prev.filter((item) => item.id !== id));
    } else {
      alert(result.message);
    }
    setDeletingId(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Resume Optimizer
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Tailor your resume to target job descriptions, increase keyword match scores, and track your optimization history.
          </p>
        </div>

        <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('optimizer')}
            className={`flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg transition ${
              activeTab === 'optimizer'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Optimizer
          </button>
          <button
            onClick={() => {
              setActiveTab('history');
              setLoadingHistory(true);
              fetchHistory();
            }}
            className={`flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg transition ${
              activeTab === 'history'
                ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            Saved History ({history.length})
          </button>
        </div>
      </div>

      {activeTab === 'optimizer' ? (
        <OptimizerWorkspace />
      ) : (
        <div className="space-y-4">
          {loadingHistory ? (
            <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-3" />
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading saved optimizations...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <FileText className="w-10 h-10 text-zinc-400 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                No Saved Optimizations
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                You haven&apos;t saved any optimized resumes yet. Run an optimization to get started.
              </p>
              <button
                onClick={() => setActiveTab('optimizer')}
                className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Go to Optimizer
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {history.map((record) => (
                <div
                  key={record.id}
                  className="p-5 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                          Optimization Run
                        </span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400">
                          {record.match_score}% Match Score
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(record.created_at).toLocaleDateString()}
                        </span>
                        <span>•</span>
                        <span>{record.replacements_applied} Keywords Applied</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(record.id)}
                      disabled={deletingId === record.id}
                      className="inline-flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-900/40 transition w-fit"
                    >
                      {deletingId === record.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                      Delete
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1">
                      <span className="font-medium text-zinc-700 dark:text-zinc-300">
                        Matching Skills ({record.matching_skills?.length || 0})
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {record.matching_skills?.map((skill, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 rounded border border-emerald-200 dark:border-emerald-900/40"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="font-medium text-zinc-700 dark:text-zinc-300">
                        Missing Skills ({record.missing_skills?.length || 0})
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {record.missing_skills?.map((skill, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 rounded border border-amber-200 dark:border-amber-900/40"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}