"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Ambient background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl bg-emerald-500/10 animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl bg-blue-500/10 animate-pulse" />
      </div>

      <div className="relative z-10">
        {/* Header Skeleton */}
        <header className="sticky top-0 z-50 border-b border-emerald-900/40 bg-[#0a2e1a]/80 backdrop-blur-xl">
          <div className="flex h-20 items-center justify-between px-6">
            <div className="flex items-center gap-6">
              {/* Logo skeleton */}
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-emerald-500/20 animate-pulse" />
                <div>
                  <div className="h-6 w-24 bg-emerald-500/20 rounded animate-pulse mb-1" />
                  <div className="h-3 w-20 bg-emerald-500/10 rounded animate-pulse" />
                </div>
              </div>

              <div className="h-8 w-px bg-emerald-900/40" />

              {/* Title skeleton */}
              <div className="hidden md:flex items-center gap-3">
                <div className="h-5 w-32 bg-emerald-500/20 rounded animate-pulse" />
                <div className="h-6 w-20 bg-emerald-500/20 rounded-full animate-pulse" />
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Theme toggle skeleton */}
              <div className="h-10 w-10 rounded-full bg-emerald-500/20 animate-pulse" />
              
              {/* Notification skeleton */}
              <div className="h-10 w-10 rounded-full bg-emerald-500/20 animate-pulse" />

              {/* User profile skeleton */}
              <div className="flex items-center gap-3 pl-4 border-l border-emerald-900/40">
                <div className="hidden lg:block space-y-1">
                  <div className="h-4 w-24 bg-emerald-500/20 rounded animate-pulse" />
                  <div className="h-3 w-16 bg-emerald-500/10 rounded animate-pulse" />
                </div>
                <div className="h-10 w-10 rounded-full bg-emerald-500/20 animate-pulse" />
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          {/* Page Header Skeleton */}
          <div className="mb-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="h-8 w-48 bg-white/10 rounded animate-pulse mb-2" />
                <div className="h-4 w-64 bg-white/5 rounded animate-pulse" />
              </div>
              <div className="flex items-center gap-3">
                <div className="h-10 w-36 bg-white/10 rounded-lg animate-pulse" />
                <div className="h-10 w-32 bg-emerald-500/20 rounded-lg animate-pulse" />
              </div>
            </div>
          </div>

          {/* Metrics Cards Skeleton */}
          <div className="mb-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="h-6 w-40 bg-white/10 rounded animate-pulse" />
              <div className="flex gap-2">
                <div className="h-8 w-16 bg-white/10 rounded animate-pulse" />
                <div className="h-8 w-16 bg-white/10 rounded animate-pulse" />
                <div className="h-8 w-16 bg-white/10 rounded animate-pulse" />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="border-white/10 bg-white/5 overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-3 flex-1">
                        <div className="h-4 w-24 bg-white/20 rounded animate-pulse" />
                        <div className="h-8 w-32 bg-white/30 rounded animate-pulse" />
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-16 bg-emerald-500/20 rounded-full animate-pulse" />
                          <div className="h-3 w-28 bg-white/10 rounded animate-pulse" />
                        </div>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-emerald-500/20 animate-pulse" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Analytics Card Skeleton */}
          <Card className="border-white/10 bg-white/5 mb-8">
            <CardHeader className="border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-6 w-48 bg-white/20 rounded animate-pulse" />
                  <div className="h-4 w-64 bg-white/10 rounded animate-pulse" />
                </div>
                <div className="flex gap-2">
                  <div className="h-9 w-24 bg-white/10 rounded animate-pulse" />
                  <div className="h-9 w-24 bg-white/10 rounded animate-pulse" />
                  <div className="h-9 w-24 bg-white/10 rounded animate-pulse" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-64 bg-white/5 rounded-lg animate-pulse" />
            </CardContent>
          </Card>

          {/* Inventory Stats Grid Skeleton */}
          <div className="mb-8">
            <div className="h-6 w-56 bg-white/10 rounded animate-pulse mb-4" />
            <div className="grid gap-6 md:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="border-white/10 bg-white/5">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="h-10 w-10 rounded-full bg-blue-500/20 animate-pulse" />
                      <div className="h-5 w-16 bg-emerald-500/20 rounded-full animate-pulse" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 w-20 bg-white/20 rounded animate-pulse" />
                      <div className="h-7 w-28 bg-white/30 rounded animate-pulse" />
                      <div className="h-3 w-16 bg-white/10 rounded animate-pulse" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Table Skeleton */}
          <Card className="border-white/10 bg-white/5">
            <CardHeader className="border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-6 w-56 bg-white/20 rounded animate-pulse" />
                  <div className="h-4 w-72 bg-white/10 rounded animate-pulse" />
                </div>
                <div className="flex gap-2">
                  <div className="h-9 w-48 bg-white/10 rounded animate-pulse" />
                  <div className="h-9 w-20 bg-white/10 rounded animate-pulse" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-2 p-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-4 py-3 border-b border-white/5">
                    <div className="h-12 w-12 rounded bg-white/10 animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-40 bg-white/20 rounded animate-pulse" />
                      <div className="h-3 w-24 bg-white/10 rounded animate-pulse" />
                    </div>
                    <div className="h-4 w-20 bg-white/10 rounded animate-pulse" />
                    <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
                    <div className="h-6 w-16 bg-emerald-500/20 rounded-full animate-pulse" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
