import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Check user role to determine redirect
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      const userRole = profile?.role;

      // Staff roles redirect to admin dashboard
      const staffRoles = ['admin', 'director', 'manager', 'ops_manager', 'auditor', 'sales_rep', 'inventory_manager'];
      
      if (userRole && staffRoles.includes(userRole)) {
        return NextResponse.redirect(`${origin}/admin`);
      } else {
        // Regular customers go to storefront
        return NextResponse.redirect(`${origin}/`);
      }
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(`${origin}/signin`);
}
