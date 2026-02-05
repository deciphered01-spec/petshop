'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

export interface AdminNotification {
    id: string;
    message: string;
    related_entity_type: string;
    created_at: string;
    is_read: boolean;
    severity: 'high' | 'medium' | 'low';
}

export function useNotifications() {
    const supabase = createClient();
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['admin-notifications'],
        queryFn: async ({ signal }): Promise<AdminNotification[]> => {
            const { data, error } = await supabase
                .from('admin_notifications')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(10)
                .abortSignal(signal);

            if (error) throw error;

            return (data || []).map((n: any) => ({
                ...n,
                severity: n.message.includes('Mismatched') || n.message.includes('Missing') ? 'high' : 'medium'
            }));
        },
        refetchInterval: 30000, // Poll every 30s
        staleTime: 25000,
    });

    const markAsRead = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from('admin_notifications')
                .update({ is_read: true })
                .eq('id', id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
        }
    });

    return { ...query, markAsRead };
}
