"use client";

import { FormEvent, useMemo, useState } from "react";
import { Download, ExternalLink, Lock, RefreshCcw, Search } from "lucide-react";
import { GradientButton } from "@/components/ui/GradientButton";

type AuditRequestRecord = {
  id: string;
  submittedAt: string;
  status: "New" | "Contacted" | "Audit Booked" | "Won" | "Not Fit";
  name: string;
  businessName: string;
  businessType: string;
  facebookPage: string;
  contact: string;
  problem: string;
  package: string;
  budget: string;
  improvements: string[];
  adminNotes: string;
  followUpDate: string;
};

export function AdminDashboard() {
  const [password, setPassword] = useState("");
  const [activePassword, setActivePassword] = useState("");
  const [requests, setRequests] = useState<AuditRequestRecord[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const selected = requests.find((request) => request.id === selectedId) ?? requests[0];

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const searchText = [request.name, request.businessName, request.contact, request.package, request.budget].join(" ").toLowerCase();
      const matchesSearch = searchText.includes(query.toLowerCase());
      const matchesStatus = status === "All" || request.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [query, requests, status]);

  const stats = useMemo(
    () => [
      { label: "Total Requests", value: requests.length },
      { label: "New", value: requests.filter((request) => request.status === "New").length },
      { label: "Contacted", value: requests.filter((request) => request.status === "Contacted").length },
      { label: "Audit Booked", value: requests.filter((request) => request.status === "Audit Booked").length }
    ],
    [requests]
  );

  async function loadRequests(nextPassword = activePassword) {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/audit-requests", {
        headers: {
          "x-admin-password": nextPassword
        }
      });

      if (response.status === 401) {
        throw new Error("Wrong admin password.");
      }

      if (!response.ok) {
        throw new Error("Could not load audit requests.");
      }

      const data = await response.json();
      setRequests(data.requests);
      setSelectedId(data.requests[0]?.id ?? "");
      setActivePassword(nextPassword);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load audit requests.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await loadRequests(password);
  }

  async function downloadWorkbook() {
    setError("");
    const response = await fetch("/api/audit-requests/export", {
      headers: {
        "x-admin-password": activePassword
      }
    });

    if (!response.ok) {
      setError("Could not download Excel file.");
      return;
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "audit-requests.xlsx";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  if (!activePassword) {
    return (
      <form onSubmit={handleLogin} className="mx-auto max-w-md rounded-md border border-line bg-white p-8 shadow-soft">
        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-cloud text-blue">
          <Lock className="h-5 w-5" aria-hidden />
        </div>
        <h1 className="mt-5 text-3xl font-bold text-ink">Admin Dashboard</h1>
        <p className="mt-3 text-sm leading-7 text-muted">Enter the admin password to view Book Audit requests saved in Excel.</p>
        <label className="mt-6 grid gap-2">
          <span className="text-sm font-semibold text-ink">Admin Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-12 rounded-md border border-line px-4 text-sm outline-none transition focus:border-blue focus:ring-4 focus:ring-blue/10"
          />
        </label>
        {error ? <p className="mt-4 text-sm font-semibold text-red-600">{error}</p> : null}
        <GradientButton type="submit" className="mt-6 w-full">
          {isLoading ? "Opening Dashboard..." : "Open Dashboard"}
        </GradientButton>
        <p className="mt-4 text-xs leading-6 text-muted">Set your password via the ADMIN_PASSWORD environment variable.</p>
      </form>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue">Admin CRM</p>
          <h1 className="mt-3 text-4xl font-bold text-ink md:text-5xl">Book Audit Requests</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
            Leads are saved to the local Excel workbook at storage/audit-requests.xlsx.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => loadRequests()}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-line bg-white px-4 text-sm font-semibold text-ink"
          >
            <RefreshCcw className="h-4 w-4" aria-hidden />
            Refresh
          </button>
          <button
            type="button"
            onClick={downloadWorkbook}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-brand px-4 text-sm font-semibold text-white"
          >
            <Download className="h-4 w-4" aria-hidden />
            Download Excel
          </button>
        </div>
      </div>

      {error ? <p className="mt-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p> : null}

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        {stats.map((item) => (
          <div key={item.label} className="rounded-md border border-line bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-muted">{item.label}</p>
            <p className="mt-2 text-3xl font-bold text-ink">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <section className="rounded-md border border-line bg-white shadow-sm">
          <div className="grid gap-4 border-b border-line p-4 md:grid-cols-[1fr_220px]">
            <label className="relative">
              <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted" aria-hidden />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search name, business, phone, package"
                className="h-11 w-full rounded-md border border-line pl-10 pr-3 text-sm outline-none transition focus:border-blue focus:ring-4 focus:ring-blue/10"
              />
            </label>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="h-11 rounded-md border border-line px-3 text-sm outline-none transition focus:border-blue focus:ring-4 focus:ring-blue/10"
            >
              {["All", "New", "Contacted", "Audit Booked", "Won", "Not Fit"].map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="bg-cloud text-xs uppercase tracking-[0.12em] text-muted">
                <tr>
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3">Business</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Package</th>
                  <th className="px-4 py-3">Budget</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filteredRequests.map((request) => (
                  <tr
                    key={request.id}
                    className={selected?.id === request.id ? "bg-blue/5" : "hover:bg-cloud/60"}
                    onClick={() => setSelectedId(request.id)}
                  >
                    <td className="px-4 py-4 font-semibold text-ink">{request.name}</td>
                    <td className="px-4 py-4 text-muted">{request.businessName}</td>
                    <td className="px-4 py-4 text-muted">{request.contact}</td>
                    <td className="px-4 py-4 text-muted">{request.package}</td>
                    <td className="px-4 py-4 text-muted">{request.budget}</td>
                    <td className="px-4 py-4">
                      <span className="rounded-md bg-cloud px-3 py-1 text-xs font-bold text-blue">{request.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredRequests.length === 0 ? <p className="p-6 text-center text-sm text-muted">No audit requests found.</p> : null}
        </section>

        <LeadDetail request={selected} />
      </div>
    </div>
  );
}

function LeadDetail({ request }: { request?: AuditRequestRecord }) {
  if (!request) {
    return (
      <aside className="rounded-md border border-line bg-white p-6 shadow-sm">
        <p className="text-sm text-muted">No lead selected yet.</p>
      </aside>
    );
  }

  return (
    <aside className="rounded-md border border-line bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue">Lead Detail</p>
      <h2 className="mt-3 text-2xl font-bold text-ink">{request.businessName}</h2>
      <p className="mt-1 text-sm text-muted">{request.name}</p>

      <div className="mt-6 grid gap-4">
        <Detail label="Submitted" value={formatDate(request.submittedAt)} />
        <Detail label="Business Type" value={request.businessType || "Not provided"} />
        <Detail label="Phone / Viber / Telegram" value={request.contact} />
        <Detail label="Interested Package" value={request.package} />
        <Detail label="Budget Range" value={request.budget} />
        <Detail label="Improve Areas" value={request.improvements.length ? request.improvements.join(", ") : "Not selected"} />
      </div>

      {request.facebookPage ? (
        <a
          href={request.facebookPage}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue"
        >
          Open Facebook Page
          <ExternalLink className="h-4 w-4" aria-hidden />
        </a>
      ) : null}

      <div className="mt-6 rounded-md bg-cloud p-4">
        <p className="text-sm font-bold text-ink">Main Marketing Problem</p>
        <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-muted">{request.problem}</p>
      </div>
    </aside>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{label}</p>
      <p className="mt-1 text-sm font-semibold text-ink">{value}</p>
    </div>
  );
}

function formatDate(value: string) {
  if (!value) return "Unknown";

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}
