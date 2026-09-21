interface ProcessTimelineProps {
  steps: string[];
}

export function ProcessTimeline({ steps }: ProcessTimelineProps) {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="border border-telemetry-border bg-substrate-surface p-6 sm:p-8 space-y-6">
      <div className="border-b border-telemetry-border/40 pb-3">
        <span className="telemetry-tag text-signal">[ ARCHITECTURAL SEQUENCE ]</span>
        <h3 className="text-base font-black uppercase text-white tracking-tight mt-1">
          Execution & Engineering Phases
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((step, index) => (
          <div
            key={index}
            className="border border-telemetry-border bg-substrate p-4 space-y-2 relative group hover:border-signal transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-signal">
                PHASE 0{index + 1}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-signal" />
            </div>
            <p className="font-mono text-xs text-white uppercase font-bold leading-snug">
              {step}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
