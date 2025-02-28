import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Package, Plus, Search, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useBusinessQuery } from '@/lib/queries';
import { getProducts } from '@/lib/db/inventory';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export function ProductList() {
  const [search, setSearch] = useState('');
  const { data: business } = useBusinessQuery();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', business?.id, search],
    queryFn: async () => {
      if (!business?.id) return [];
      return getProducts(business.id, {
        search,
        lowStock: false
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
          <h2 className="text-2xl font-bold tracking-tight">Produtos</h2>
          <p className="text-muted-foreground">
            Gerencie seu estoque e produtos
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
        {products.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <Package className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Nenhum produto encontrado
            </h3>
            <p className="text-muted-foreground mb-4">
              Comece cadastrando seus produtos para controlar o estoque
            </p>
            <Button asChild>
              <Link to="/dashboard/inventory/new">
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Primeiro Produto
              </Link>
            </Button>
          </div>
        ) : (
          products.map((product) => (
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
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
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
          ))
        )}
      </div>
    </div>
  );
}