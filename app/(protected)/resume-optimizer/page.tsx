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
    <div className="container mx-auto px-4 py-8 max-w-7xl space-y-6 bg-[var(--background)] text-[var(--foreground)] min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)] flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[var(--primary)]" />
            Resume Optimizer
          </h1>
          <p className="text-xs sm:text-sm text-[var(--muted)] mt-1">
            Tailor your resume to target job descriptions, increase keyword match scores, and track your optimization history.
          </p>
        </div>

        <div className="flex bg-[var(--surface)] border border-[var(--border)] p-1 rounded-2xl w-fit shadow-lg">
          <button
            type="button"
            onClick={() => setActiveTab('optimizer')}
            className={`flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl transition ${
              activeTab === 'optimizer'
                ? 'bg-[var(--primary)] text-[var(--primary-text)] shadow-md shadow-[color-mix(in_srgb,var(--primary)_10%,transparent)]'
                : 'text-[var(--muted)] hover:text-[var(--foreground)]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Optimizer
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('history');
              setLoadingHistory(true);
              fetchHistory();
            }}
            className={`flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl transition ${
              activeTab === 'history'
                ? 'bg-[var(--primary)] text-[var(--primary-text)] shadow-md shadow-[color-mix(in_srgb,var(--primary)_10%,transparent)]'
                : 'text-[var(--muted)] hover:text-[var(--foreground)]'
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
            <div className="flex flex-col items-center justify-center p-12 bg-[var(--surface)] rounded-3xl border border-[var(--border)] shadow-2xl">
              <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)] mb-3" />
              <p className="text-xs text-[var(--muted)]">Loading saved optimizations...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="p-12 text-center bg-[var(--surface)] rounded-3xl border border-[var(--border)] shadow-2xl">
              <FileText className="w-10 h-10 text-[var(--primary)] mx-auto mb-3" />
              <h3 className="text-base font-bold text-[var(--foreground)] mb-1">
                No Saved Optimizations
              </h3>
              <p className="text-xs text-[var(--muted)] mb-4">
                You haven&apos;t saved any optimized resumes yet. Run an optimization to get started.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('optimizer')}
                className="inline-flex items-center gap-2 text-xs font-semibold px-5 py-2.5 bg-[var(--primary)] text-[var(--primary-text)] rounded-xl hover:bg-[var(--primary-hover)] shadow-lg shadow-[color-mix(in_srgb,var(--primary)_10%,transparent)] transition"
              >
                Go to Optimizer
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {history.map((record) => (
                <div
                  key={record.id}
                  className="p-6 bg-[var(--surface)] rounded-3xl border border-[var(--border)] shadow-2xl space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[var(--foreground)]">
                          Optimization Run
                        </span>
                        <span className="text-[10px] px-3 py-0.5 rounded-full font-bold uppercase tracking-wider bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] text-[var(--primary)] border border-[color-mix(in_srgb,var(--primary)_30%,transparent)]">
                          {record.match_score}% Match Score
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[var(--muted)]">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[var(--primary)]" />
                          {new Date(record.created_at).toLocaleDateString()}
                        </span>
                        <span>•</span>
                        <span>{record.replacements_applied} Keywords Applied</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDelete(record.id)}
                      disabled={deletingId === record.id}
                      className="inline-flex items-center gap-1.5 text-xs text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 px-3 py-2 rounded-xl border border-rose-500/30 transition w-fit disabled:opacity-50"
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
                    <div className="space-y-1.5">
                      <span className="font-semibold uppercase tracking-wider text-[11px] text-[var(--muted)]">
                        Matching Skills ({record.matching_skills?.length || 0})
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {record.matching_skills?.map((skill, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] text-[var(--primary)] rounded-lg border border-[color-mix(in_srgb,var(--primary)_30%,transparent)] text-[11px] font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="font-semibold uppercase tracking-wider text-[11px] text-[var(--muted)]">
                        Missing Skills ({record.missing_skills?.length || 0})
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {record.missing_skills?.map((skill, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 bg-rose-500/10 text-rose-400 rounded-lg border border-rose-500/30 text-[11px] font-medium"
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