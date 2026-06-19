"use client";

import { FormEvent, useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { GradientButton } from "@/components/ui/GradientButton";
import { siteContent } from "@/data/siteContent";

type FormState = {
  name: string;
  businessName: string;
  businessType: string;
  facebookPage: string;
  contact: string;
  problem: string;
  package: string;
  budget: string;
  improvements: string[];
};

const initialState: FormState = {
  name: "",
  businessName: "",
  businessType: "",
  facebookPage: "",
  contact: "",
  problem: "",
  package: "",
  budget: "",
  improvements: []
};

export function ContactForm() {
  const [form, setForm] = useState(initialState);
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isValid = useMemo(
    () => Boolean(form.name && form.businessName && form.contact && form.problem && form.package && form.budget),
    [form]
  );

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function toggleImprovement(value: string) {
    setForm((current) => ({
      ...current,
      improvements: current.improvements.includes(value)
        ? current.improvements.filter((item) => item !== value)
        : [...current.improvements, value]
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched(true);
    setError("");
    if (!isValid) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/audit-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Could not save your request.");
      }

      setSubmitted(true);
      setForm(initialState);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Sorry, your request could not be saved. Please try again or contact us directly.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-md border border-line bg-white p-8 text-center shadow-soft">
        <CheckCircle2 className="mx-auto h-12 w-12 text-cyan" aria-hidden />
        <h3 className="mt-4 text-2xl font-bold text-ink">Audit request received</h3>
        <p className="mt-3 text-sm leading-7 text-muted">
          Thank you. The next step is a workflow review, not a guaranteed-sales promise. We will respond with audit timing.
        </p>
        <button type="button" className="mt-6 text-sm font-semibold text-blue" onClick={() => setSubmitted(false)}>
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-md border border-line bg-white p-5 shadow-soft md:p-8">
      <div className="grid gap-5 md:grid-cols-2">
        <Input label="Name" value={form.name} onChange={(value) => updateField("name", value)} required />
        <Input label="Business Name" value={form.businessName} onChange={(value) => updateField("businessName", value)} required />
        <Input label="Business Type" value={form.businessType} onChange={(value) => updateField("businessType", value)} />
        <Input label="Facebook Page Link" value={form.facebookPage} onChange={(value) => updateField("facebookPage", value)} />
        <Input
          label="Phone / Viber / Telegram"
          value={form.contact}
          onChange={(value) => updateField("contact", value)}
          required
        />
        <Select label="Interested Package" value={form.package} onChange={(value) => updateField("package", value)} required>
          <option value="">Select package</option>
          {siteContent.packages.map((pkg) => (
            <option key={pkg.name} value={pkg.name}>
              {pkg.name}
            </option>
          ))}
        </Select>
        <Select label="Monthly Marketing Budget Range" value={form.budget} onChange={(value) => updateField("budget", value)} required>
          <option value="">Select budget</option>
          {siteContent.contact.budgetRanges.map((range) => (
            <option key={range} value={range}>
              {range}
            </option>
          ))}
        </Select>
        <label className="grid gap-2 md:col-span-2">
          <span className="text-sm font-semibold text-ink">Main Marketing Problem *</span>
          <textarea
            value={form.problem}
            onChange={(event) => updateField("problem", event.target.value)}
            rows={5}
            className="rounded-md border border-line bg-white px-4 py-3 text-sm outline-none transition focus:border-blue focus:ring-4 focus:ring-blue/10"
            placeholder="What feels slow, messy, or hard to improve right now?"
          />
        </label>
      </div>

      <fieldset className="mt-6">
        <legend className="text-sm font-semibold text-ink">What do you want to improve?</legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {siteContent.contact.improvementAreas.map((item) => (
            <label key={item} className="flex items-center gap-3 rounded-md border border-line px-3 py-3 text-sm font-medium text-ink">
              <input
                type="checkbox"
                checked={form.improvements.includes(item)}
                onChange={() => toggleImprovement(item)}
                className="h-4 w-4 rounded border-line text-blue"
              />
              {item}
            </label>
          ))}
        </div>
      </fieldset>

      {touched && !isValid ? <p className="mt-5 text-sm font-semibold text-red-600">Please complete the required fields.</p> : null}
      {error ? <p className="mt-5 text-sm font-semibold text-red-600">{error}</p> : null}

      <GradientButton type="submit" className="mt-7 w-full md:w-auto">
        {isSubmitting ? "Saving Request..." : "Submit Audit Request"}
      </GradientButton>
    </form>
  );
}

function Input({
  label,
  value,
  onChange,
  required
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-ink">
        {label}
        {required ? " *" : ""}
      </span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 rounded-md border border-line bg-white px-4 text-sm outline-none transition focus:border-blue focus:ring-4 focus:ring-blue/10"
      />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  required,
  children
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-semibold text-ink">
        {label}
        {required ? " *" : ""}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 rounded-md border border-line bg-white px-4 text-sm outline-none transition focus:border-blue focus:ring-4 focus:ring-blue/10"
      >
        {children}
      </select>
    </label>
  );
}
