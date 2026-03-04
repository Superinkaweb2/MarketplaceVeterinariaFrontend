import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import type { Product } from "../types/marketplace";

export const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();

  const badgeStyles = {
    rx: "bg-blue-100 text-blue-700 border-blue-200",
    service: "bg-purple-100 text-purple-700 border-purple-200",
    approved: "bg-green-100 text-green-700 border-green-200",
    adoption: "bg-orange-100 text-orange-700 border-orange-200"
  };

  const imageUrl = product.imagenes && product.imagenes.length > 0
    ? product.imagenes[0]
    : "https://via.placeholder.com/300?text=Sin+Imagen";

  const isService = product.categoriaId === -2;
  const isAdoption = product.categoriaId === -1;

  const cardContent = (
    <>
      {product.badge && (
        <div className="absolute top-3 left-3 z-10">
          <span className={`px-2 py-1 ${badgeStyles[product.badge.style as keyof typeof badgeStyles]} text-[10px] font-bold uppercase rounded border`}>
            {product.badge.text}
          </span>
        </div>
      )}
      <div className="h-48 bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6 bg-cover bg-center transition-transform group-hover:scale-105" style={{ backgroundImage: `url(${imageUrl})` }}>
        {!imageUrl && <span className="material-symbols-outlined text-4xl text-slate-300">image</span>}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1 line-clamp-2 hover:text-blue-600 transition-colors">{product.nombre}</h3>
        <p className="text-xs text-slate-500 mb-3">{product.empresaNombre}</p>
      </div>
    </>
  );

  return (
    <div className="group flex flex-col bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all duration-300 relative">
      {/* Todos los tipos llevan a su página de detalle */}
      <Link to={`/marketplace/product/${product.id}`} className="flex-1 flex flex-col">
        {cardContent}
      </Link>

      <div className="p-4 pt-0 mt-auto flex items-center justify-between">
        <div className="flex flex-col">
          {isAdoption ? (
            <span className="text-lg font-bold text-orange-600 dark:text-orange-400">¡Adóptame!</span>
          ) : isService ? (
            <span className="text-lg font-bold text-purple-600 dark:text-purple-400">${product.precioActual}</span>
          ) : (
            <>
              {product.precioOferta && (
                <span className="text-xs text-slate-400 line-through">${product.precio}</span>
              )}
              <span className="text-lg font-bold dark:text-white">${product.precioActual}</span>
            </>
          )}
        </div>

        {isAdoption ? (
          <Link
            to={`/marketplace/product/${product.id}`}
            className="p-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 shadow-md transition-all active:scale-90"
            title="Ver detalles de adopción"
          >
            <span className="material-symbols-outlined text-xl">visibility</span>
          </Link>
        ) : isService ? (
          <Link
            to={`/marketplace/product/${product.id}`}
            className="p-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 shadow-md transition-all active:scale-90"
            title="Ver detalles del servicio"
          >
            <span className="material-symbols-outlined text-xl">event_available</span>
          </Link>
        ) : (
          <button
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
            className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-md transition-all active:scale-90"
            title="Añadir al carrito"
          >
            <span className="material-symbols-outlined text-xl">add_shopping_cart</span>
          </button>
        )}
      </div>
    </div>
  );
};
