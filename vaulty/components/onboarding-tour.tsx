"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Sparkles, Shield, NotebookText, BellRing, FolderOpen, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/store/app-store";

const tourSteps = [
  {
    title: "Welcome to Vaulty",
    description:
      "Vaulty helps you manage passwords, reminders, notes, and document references in one premium workspace.",
    icon: Sparkles,
    gradient: "var(--gradient-main)",
  },
  {
    title: "Use Quick Capture",
    description:
      "From the dashboard, you can quickly add a note, reminder, or document reference during your demo.",
    icon: NotebookText,
    gradient: "var(--gradient-pink)",
  },
  {
    title: "Stay on top of reminders",
    description:
      "Use structured reminders with date, time, location, and priority to show a polished productivity workflow.",
    icon: BellRing,
    gradient: "var(--gradient-warm)",
  },
  {
    title: "Keep documents organized",
    description:
      "Documents let you store references and important file labels in a clean, clickable list.",
    icon: FolderOpen,
    gradient: "var(--gradient-green)",
  },
  {
    title: "Protect credentials in the vault",
    description:
      "The vault uses a 4-digit PIN for demo protection, making sensitive entries feel private and controlled.",
    icon: Shield,
    gradient: "var(--gradient-cool)",
  },
];

export function OnboardingTour() {
  const { hasSeenOnboarding, setHasSeenOnboarding } = useAppStore();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!hasSeenOnboarding) {
      setOpen(true);
    }
  }, [hasSeenOnboarding]);

  const closeTour = () => {
    setOpen(false);
    setHasSeenOnboarding(true);
  };

  const nextStep = () => {
    if (step < tourSteps.length - 1) {
      setStep((prev) => prev + 1);
      return;
    }
    closeTour();
  };

  const prevStep = () => {
    if (step > 0) {
      setStep((prev) => prev - 1);
    }
  };

  const current = tourSteps[step];
  const Icon = current.icon;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative w-full max-w-xl overflow-hidden rounded-[32px] border border-[color:var(--line)] bg-[color:var(--panel)] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.25)]"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.28 }}
          >
            <button
              onClick={closeTour}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-2xl border border-[color:var(--line)] bg-[color:var(--panel-strong)] text-[color:var(--text)]"
              aria-label="Close onboarding tour"
            >
              <X className="h-4 w-4" />
            </button>

            <div
              className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl text-white shadow-[0_18px_50px_rgba(0,0,0,0.18)]"
              style={{ background: current.gradient }}
            >
              <Icon className="h-7 w-7" />
            </div>

            <div className="mb-6">
              <p className="mb-2 text-sm font-medium uppercase tracking-[0.24em] text-[color:var(--text-muted)]">
                Onboarding tour
              </p>
              <h2 className="text-title text-[color:var(--text)]">{current.title}</h2>
              <p className="mt-3 text-sm leading-7 text-[color:var(--text-muted)]">
                {current.description}
              </p>
            </div>

            <div className="mb-6 flex items-center gap-2">
              {tourSteps.map((_, index) => (
                <span
                  key={index}
                  className={`h-2 rounded-full transition-all ${
                    step === index ? "w-8 bg-[color:var(--primary)]" : "w-2 bg-[color:var(--line-strong)]"
                  }`}
                />
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-[color:var(--text-muted)]">
                Step {step + 1} of {tourSteps.length}
              </div>

              <div className="flex flex-wrap gap-2">
                <Button variant="ghost" onClick={closeTour}>
                  Skip
                </Button>

                {step > 0 ? (
                  <Button variant="secondary" onClick={prevStep} className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                ) : null}

                <Button onClick={nextStep} className="gap-2">
                  {step === tourSteps.length - 1 ? "Finish" : "Next"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}