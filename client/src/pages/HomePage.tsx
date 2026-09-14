import { useAuth } from "@/shared/hooks/useAuth";

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || !user) {
    return <div>HomePage</div>;
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-lg">
        {/* Profile Card */}
        <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-sm">
          {/* Header Accent */}
          <div className="h-2 bg-primary" />

          <div className="p-6 sm:p-8">
            {/* User Header */}
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="h-20 w-20 rounded-full border-2 border-border object-cover"
                />

                {/* Online indicator */}
                <span
                  className={`absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-surface ${
                    user.accountStatus === "active" ? "bg-success" : "bg-danger"
                  }`}
                />
              </div>

              <div className="min-w-0">
                <h1 className="truncate text-xl font-bold text-foreground">
                  {user.name}
                </h1>

                <p className="mt-1 truncate text-sm text-muted">
                  @{user.username}
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="my-6 border-t border-border" />

            {/* User Information */}
            <div className="space-y-4">
              <div className="rounded-md bg-surface-secondary p-3">
                <p className="text-xs font-medium uppercase tracking-wide text-subtle">
                  Email
                </p>

                <p className="mt-1 break-all text-sm text-foreground">
                  {user.email}
                </p>
              </div>

              <div className="flex items-center justify-between rounded-md bg-surface-secondary p-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-subtle">
                    Account Status
                  </p>

                  <p className="mt-1 text-sm font-medium text-foreground">
                    {user.accountStatus === "active" ? "Active" : "Inactive"}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    user.accountStatus === "active"
                      ? "bg-success/10 text-success"
                      : "bg-danger/10 text-danger"
                  }`}
                >
                  {user.accountStatus}
                </span>
              </div>

              <div className="rounded-md bg-surface-secondary p-3">
                <p className="text-xs font-medium uppercase tracking-wide text-subtle">
                  Member Since
                </p>

                <p className="mt-1 text-sm text-foreground">
                  {new Date(user.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default HomePage;
