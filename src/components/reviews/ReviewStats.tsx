interface ReviewStatsProps {
  stats?: {
    summary?: {
      total_reviews: number;
      average_rating: number;
      total_pending: number;
    };
    professionals?: Array<{
      id: string;
      name: string;
      total_reviews: number;
      average_rating: number;
      pending_responses: number;
      rating_distribution: Record<string, number>;
    }>;
  };
}

export function ReviewStats({ stats }: ReviewStatsProps) {
  const professionalStats = stats?.professionals?.[0] || {
    total_reviews: 0,
    average_rating: 0,
    rating_distribution: {
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <div className="rounded-xl border bg-card p-6">
        <div className="flex items-center gap-x-3">
          <Star className="h-5 w-5 text-yellow-400" />
          <div>
            <p className="text-sm font-medium">Média Geral</p>
            <p className="text-2xl font-bold">
              {stats?.summary?.average_rating?.toFixed(1) || '0.0'}
            </p>
          </div>
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          {stats?.summary?.total_reviews || 0} {stats?.summary?.total_reviews === 1 ? 'avaliação' : 'avaliações'}
        </div>
      </div>

      {[5, 4, 3, 2, 1].map((nota) => {
        const porcentagem = professionalStats.rating_distribution[nota] || 0;
        return (
          <div key={nota} className="flex items-center gap-x-2">
            <div className="flex items-center gap-x-1 w-16">
              <Star className="h-4 w-4 text-yellow-400" />
              <span>{nota}</span>
            </div>
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-400"
                style={{ width: `${porcentagem}%` }}
              />
            </div>
            <div className="w-12 text-sm text-muted-foreground">
              {porcentagem.toFixed(1)}%
            </div>
          </div>
        );
      })}
    </div>
  );
}