export default function Home() {
  const stats = [
    {
      title: "Net revenue",
      value: "$128.4K",
      change: "+12.8%",
      tone: "text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Orders in flight",
      value: "1,284",
      change: "+6.2%",
      tone: "text-sky-600 dark:text-sky-400",
    },
    {
      title: "Return rate",
      value: "1.9%",
      change: "-0.4%",
      tone: "text-violet-600 dark:text-violet-400",
    },
    {
      title: "CSAT",
      value: "94.2",
      change: "+1.1 pts",
      tone: "text-amber-600 dark:text-amber-400",
    },
  ];

  const activity = [
    {
      title: "Warehouse East cleared the backlog queue",
      time: "8 minutes ago",
      status: "Resolved",
    },
    {
      title: "Pricing sync finished for the spring catalog",
      time: "28 minutes ago",
      status: "Synced",
    },
    {
      title: "Wholesale customer requested 320 extra units",
      time: "46 minutes ago",
      status: "Reviewing",
    },
    {
      title: "Retention campaign beat its target audience size",
      time: "1 hour ago",
      status: "Live",
    },
  ];

  return (
    <div className="space-y-6">
      {/* <section className="overflow-hidden rounded-[28px] border border-border/70 bg-card shadow-sm">
        <div className="grid gap-6 px-5 py-6 sm:px-6 lg:grid-cols-[1.4fr_0.8fr] lg:px-8">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
              Live operations snapshot
            </div>
            <div className="space-y-3">
              <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Keep revenue, fulfillment, and customer health in one clear
                view.
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                Today looks healthy overall: demand is up, the warehouse queue
                is stabilizing, and the support team is tracking ahead of
                target.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-border/70 bg-background p-4">
                <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
                  Pipeline
                </p>
                <p className="mt-2 text-2xl font-semibold text-foreground">
                  $2.4M
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Projected 30-day demand
                </p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background p-4">
                <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
                  Fill rate
                </p>
                <p className="mt-2 text-2xl font-semibold text-foreground">
                  97.3%
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Across top 20 SKUs
                </p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background p-4">
                <p className="text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
                  Team load
                </p>
                <p className="mt-2 text-2xl font-semibold text-foreground">
                  68%
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Capacity available today
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-border/70 bg-background p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Priority board
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  The biggest blockers worth clearing next.
                </p>
              </div>
              <span className="rounded-full bg-primary/12 px-2.5 py-1 text-xs font-semibold text-primary">
                3 urgent
              </span>
            </div>
            <div className="mt-5 space-y-3">
              {[
                ["Late carrier scan in Northeast", "Ops", "12 min"],
                ["Low stock risk for Linen Set", "Inventory", "28 min"],
                ["Wholesale invoice awaiting approval", "Finance", "44 min"],
              ].map(([title, owner, eta]) => (
                <div
                  key={title}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-border/70 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {title}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {owner}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                    {eta}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-[24px] border border-border/70 bg-card p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </p>
            <div className="mt-4 flex items-end justify-between gap-3">
              <p className="text-3xl font-semibold tracking-tight text-foreground">
                {stat.value}
              </p>
              <span className={`text-sm font-semibold ${stat.tone}`}>
                {stat.change}
              </span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Compared with the previous 30 days
            </p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[28px] border border-border/70 bg-card p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Recent activity
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Operational updates flowing in across the business.
              </p>
            </div>
            <span className="rounded-full border border-border/70 px-3 py-1 text-xs font-medium text-muted-foreground">
              Updated live
            </span>
          </div>
          <div className="mt-6 space-y-3">
            {activity.map((item) => (
              <div
                key={item.title}
                className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-background px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {item.title}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.time}
                  </p>
                </div>
                <span className="inline-flex w-fit rounded-full bg-primary/12 px-3 py-1 text-xs font-semibold text-primary">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-border/70 bg-card p-5 shadow-sm sm:p-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Team workload
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              A quick pulse on delivery capacity today.
            </p>
          </div>
          <div className="mt-6 space-y-5">
            {[
              ["Operations", "76%", "w-[76%]"],
              ["Support", "63%", "w-[63%]"],
              ["Lifecycle", "49%", "w-[49%]"],
            ].map(([label, value, width]) => (
              <div key={label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{label}</span>
                  <span className="text-muted-foreground">{value}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div className={`h-full rounded-full bg-primary ${width}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}
    </div>
  );
}
