"use client";

import Image from "next/image";
import Link from "next/link";
import { Store, BarChart3, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomerStorefront } from "@/components/storefront/CustomerStorefront";
import { DirectorDashboard } from "@/components/dashboard/DirectorDashboard";
import { OperationsDashboard } from "@/components/dashboard/OperationsDashboard";

export default function Home() {
  return (
    <Tabs defaultValue="storefront" className="min-h-screen bg-slate-100">
      {/* View Switcher Header */}
      <div className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Image
              src="/logo-green.png"
              alt="Baycarl Pet Shop"
              width={120}
              height={35}
              className="h-8 w-auto"
            />
            <span className="hidden text-sm font-medium text-slate-500 sm:inline">|</span>
            <span className="hidden text-sm text-slate-600 sm:inline">Demo Mode</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/signin">
              <Button variant="ghost" className="text-slate-600 hover:text-slate-900">
                Sign In
              </Button>
            </Link>
          </div>
          <TabsList className="bg-slate-100">
            <TabsTrigger value="storefront" className="gap-2 data-[state=active]:bg-white">
              <Store className="h-4 w-4" />
              <span className="hidden sm:inline">Storefront</span>
            </TabsTrigger>
            <TabsTrigger value="director" className="gap-2 data-[state=active]:bg-white">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Director</span>
            </TabsTrigger>
            <TabsTrigger value="operations" className="gap-2 data-[state=active]:bg-white">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Operations</span>
            </TabsTrigger>
          </TabsList>
        </div>
      </div>

      {/* Content Area */}
      <TabsContent value="storefront" className="mt-0">
        <CustomerStorefront />
      </TabsContent>
      <TabsContent value="director" className="mt-0">
        <DirectorDashboard />
      </TabsContent>
      <TabsContent value="operations" className="mt-0">
        <OperationsDashboard />
      </TabsContent>
    </Tabs>
  );
}
