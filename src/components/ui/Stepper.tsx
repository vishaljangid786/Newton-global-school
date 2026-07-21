export interface Step {
  title: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  className?: string;
}

/**
 * Numbered process stepper (design.md §4.5): horizontal on md+ with connector
 * lines, stacking vertically on mobile. Renders h3 step titles — place under
 * an h2 section.
 */
export default function Stepper({ steps, className = "" }: StepperProps) {
  return (
    <ol className={`flex flex-col md:flex-row ${className}`}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        return (
          <li
            key={step.title}
            className="relative flex gap-4 pb-8 last:pb-0 md:flex-1 md:flex-col md:items-center md:gap-3 md:px-2 md:pb-0 md:text-center"
          >
            {!isLast ? (
              <>
                {/* Vertical connector (mobile) */}
                <span
                  aria-hidden="true"
                  className="absolute bottom-0 left-5 top-12 w-px -translate-x-1/2 bg-border md:hidden"
                />
                {/* Horizontal connector (desktop) */}
                <span
                  aria-hidden="true"
                  className="absolute left-[calc(50%+2rem)] top-5 hidden h-px w-[calc(100%-4rem)] bg-border md:block"
                />
              </>
            ) : null}
            <span
              aria-hidden="true"
              className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-pill bg-[image:var(--gradient-brand)] font-heading text-base font-semibold text-white"
            >
              {index + 1}
            </span>
            <div className="pt-1.5 md:pt-0">
              <h3 className="font-heading text-base font-semibold text-text">
                {step.title}
              </h3>
              {step.description ? (
                <p className="mt-1 text-sm text-text-muted">{step.description}</p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
