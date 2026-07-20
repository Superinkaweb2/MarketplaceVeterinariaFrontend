import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import type { Product } from "../types/marketplace";

export const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();

  const badgeStyles = {
    rx: "bg-blue-100 text-blue-700",
    service: "bg-purple-100 text-purple-700",
    approved: "bg-green-100 text-green-700",
    adoption: "bg-orange-100 text-orange-700"
  };

  const imageUrl = product.imagenes && product.imagenes.length > 0
    ? product.imagenes[0]
    : null;

  const isService = product.categoriaId === -2;
  const isAdoption = product.categoriaId === -1;
  const hasDiscount = !isAdoption && product.precio > product.precioActual;

  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 relative">
      {/* Badge */}
      {product.badge && (
        <div className="absolute top-3 left-3 z-10">
          <span className={`px-2.5 py-1 ${badgeStyles[product.badge.style as keyof typeof badgeStyles]} text-[10px] font-bold uppercase rounded-lg`}>
            {product.badge.text}
          </span>
        </div>
      )}

      {/* Discount badge */}
      {hasDiscount && (
        <div className="absolute top-3 right-3 z-10">
          <span className="px-2 py-1 bg-red-500 text-white text-[10px] font-bold rounded-lg">
            -{Math.round(((product.precio - product.precioActual) / product.precio) * 100)}%
          </span>
        </div>
      )}

      {/* Image */}
      <Link to={`/marketplace/product/${product.id}`} className="block">
        <div
          className="h-52 bg-slate-50 flex items-center justify-center p-6 bg-cover bg-center transition-transform duration-300 group-hover:scale-[1.02]"
          style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : {}}
        >
          {!imageUrl && (
            <div className="flex flex-col items-center text-slate-300">
              <span className="material-symbols-outlined text-5xl mb-2">image</span>
              <span className="text-[10px] font-medium uppercase tracking-wider">Sin Imagen</span>
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <Link to={`/marketplace/product/${product.id}`}>
          <h3 className="font-semibold text-slate-900 text-sm mb-1.5 line-clamp-2 hover:text-blue-600 transition-colors leading-snug min-h-[2.5rem]">
            {product.nombre}
          </h3>
        </Link>

        <p className="text-xs text-slate-400 mb-3 line-clamp-1">
          {product.empresaNombre}
        </p>

        {/* Price + Action */}
        <div className="mt-auto flex items-end justify-between gap-2">
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-xs text-slate-400 line-through leading-none">
                S/{product.precio.toFixed(2)}
              </span>
            )}
            {isAdoption ? (
              <span className="text-lg font-bold text-orange-600 leading-tight">¡Adóptame!</span>
            ) : (
              <span className="text-lg font-bold text-slate-900 leading-tight">
                S/{product.precioActual.toFixed(2)}
              </span>
            )}
          </div>

          {isAdoption ? (
            <Link
              to={`/marketplace/product/${product.id}`}
              className="p-2.5 rounded-xl bg-orange-500 text-white hover:bg-orange-600 shadow-md shadow-orange-500/20 transition-all active:scale-90"
              title="Ver detalles de adopción"
            >
              <span className="material-symbols-outlined text-xl">visibility</span>
            </Link>
          ) : isService ? (
            <Link
              to={`/marketplace/product/${product.id}`}
              className="p-2.5 rounded-xl bg-purple-600 text-white hover:bg-purple-700 shadow-md shadow-purple-500/20 transition-all active:scale-90"
              title="Reservar cita"
            >
              <span className="material-symbols-outlined text-xl">event_available</span>
            </Link>
          ) : (
            <button
              onClick={(e) => {
                e.preventDefault();
                addToCart(product);
              }}
              className="p-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all active:scale-90"
              title="Añadir al carrito"
            >
              <span className="material-symbols-outlined text-xl">add_shopping_cart</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
