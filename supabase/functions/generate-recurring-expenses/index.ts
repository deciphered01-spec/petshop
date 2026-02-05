// @ts-nocheck
// Supabase Edge Function: generate-recurring-expenses
// This function should be scheduled to run daily via Supabase Cron
// Deploy: supabase functions deploy generate-recurring-expenses
// Schedule: Add to Supabase Dashboard > Edge Functions > Cron Jobs
// Schedule expression: 0 1 * * * (runs daily at 1 AM)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

interface RecurringExpenseResult {
  generated_count: number;
  message: string;
}

Deno.serve(async (req) => {
  try {
    // Verify the request is from Supabase Cron or has valid auth
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with service role key for admin operations
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Call the database function to generate recurring expenses
    const { data, error } = await supabase
      .rpc('generate_recurring_expenses');

    if (error) {
      console.error('Error generating recurring expenses:', error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: error.message 
        }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const result: RecurringExpenseResult = data?.[0] || { 
      generated_count: 0, 
      message: 'No expenses generated' 
    };

    console.log(`Recurring expenses generated: ${result.generated_count}`);

    return new Response(
      JSON.stringify({
        success: true,
        count: result.generated_count,
        message: result.message,
        timestamp: new Date().toISOString()
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
});

// DEPLOYMENT INSTRUCTIONS:
// ========================
//
// 1. Deploy this Edge Function:
//    supabase functions deploy generate-recurring-expenses
//
// 2. Set up Cron Job in Supabase Dashboard:
//    - Go to Edge Functions > Cron Jobs
//    - Click "Add Cron Job"
//    - Function: generate-recurring-expenses
//    - Schedule: 0 1 * * * (daily at 1 AM)
//    - Or use this cron expression for testing: 0/5 * * * * (every 5 minutes)
//
// 3. Alternative: Use pg_cron directly in Supabase:
//    SELECT cron.schedule(
//      'generate-recurring-expenses-daily',
//      '0 1 * * *',
//      $$SELECT generate_recurring_expenses();$$
//    );
//
// 4. Manual trigger via API:
//    curl -X POST https://your-project.supabase.co/functions/v1/generate-recurring-expenses \
//      -H "Authorization: Bearer YOUR_ANON_KEY"
