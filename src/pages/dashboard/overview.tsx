import { useBusinessQuery } from '@/lib/queries';
import { CalendarDays, Users, Briefcase, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';

interface RecentCustomer {
  id: string;
  name: string;
  created_at: string;
}

export default function Overview() {
  const { data: business } = useBusinessQuery();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['overview-stats', business?.id],
    queryFn: async () => {
      if (!business?.id) return null;
      const { data } = await apiClient.reports.overview();
      return data;
    },
    enabled: !!business?.id
  });

  const { data: recentCustomers = [] } = useQuery({
    queryKey: ['recent-customers', business?.id],
    queryFn: async () => {
      if (!business?.id) return [];
      const { data } = await apiClient.customers.list({
        limit: 5,
        orderBy: '-created_at'
      });
      return data;
    },
    enabled: !!business?.id
  });

  // Rest of the code remains the same as in the original file
}