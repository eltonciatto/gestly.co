import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useBusinessQuery } from '@/lib/queries';
import { Link } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getProducts } from '@/lib/db/inventory';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export function StockList() {
  const [search, setSearch] = useState('');
  const { data: business } = useBusinessQuery();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['inventory-products', business?.id, search],
    queryFn: async () => {
      if (!business?.id) return [];
      return getProducts(business.id, {
        search,
        lowStock: true
      });
    },
    enabled: !!business?.id
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Estoque</h2>
          <p className="text-muted-foreground">
            Gerencie seus produtos e estoque
          </p>
        </div>
        <Button asChild>
          <Link to="/dashboard/inventory/new">
            <Plus className="h-4 w-4 mr-2" />
            Novo Produto
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-x-2">
        <div className="flex-1">
          <label htmlFor="search" className="sr-only">
            Buscar
          </label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              type="search"
              placeholder="Buscar produtos..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex flex-col p-4 rounded-lg border bg-card"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-medium">{product.name}</h3>
                {product.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {product.description}
                  </p>
                )}
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link to={`/dashboard/inventory/${product.id}`}>
                  Editar
                </Link>
              </Button>
            </div>
            
            <div className="mt-4 pt-4 border-t space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Estoque:</span>
                <div className="flex items-center gap-x-2">
                  <span className="font-medium">{product.current_stock} {product.unit}</span>
                  {product.current_stock <= product.min_stock && (
                    <span className="text-yellow-500">Estoque baixo</span>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Mínimo:</span>
                <span>{product.min_stock} {product.unit}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Custo:</span>
                <span>
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(product.cost_price)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Venda:</span>
                <span>
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(product.sale_price)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}