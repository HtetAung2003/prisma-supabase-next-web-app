import Image from "next/image";

export default function Home() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Welcome to Dashboard</h1>
        <p className="text-lg text-muted-foreground">
          This is a sample dashboard with navbar and sidebar ...
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stats Cards */}
        {[
          { title: "Total Sales", value: "$45,231.89", change: "+20.1%" },
          { title: "Subscriptions", value: "2,350", change: "+15%" },
          { title: "Sales", value: "12,234", change: "+12%" },
          { title: "Active Users", value: "573", change: "+2%" },
        ].map((stat) => (
          <div
            key={stat.title}
            className="rounded-lg border border-border bg-card p-6 shadow-sm"
          >
            <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
            <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
            <p className="text-xs text-green-600 dark:text-green-400 mt-2">{stat.change} from last month</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div>
                  <p className="font-medium text-foreground">Activity {i}</p>
                  <p className="text-sm text-muted-foreground">2 hours ago</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  Completed
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
