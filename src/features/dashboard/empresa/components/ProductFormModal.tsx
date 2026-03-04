import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Upload, Package, Info, Check } from "lucide-react";
import { Button } from "../../../../components/ui/Button";
import type { Category } from "../../../catalog/types/category";
import { categoryService } from "../../../catalog/services/categoryService";
import type {
  CreateProductRequest,
  Product,
} from "../../../catalog/types/product";
import { productService } from "../services/productService";
import Swal from "sweetalert2";

const productSchema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  descripcion: z.string().optional(),
  precio: z.number().min(0, "El precio no puede ser negativo"),
  precioOferta: z.number().optional().nullable(),
  ofertaInicio: z.string().optional().nullable(),
  ofertaFin: z.string().optional().nullable(),
  stock: z.number().min(0, "El stock no puede ser negativo"),
  sku: z.string().min(3, "El SKU debe tener al menos 3 caracteres"),
  categoriaId: z.number().positive("Selecciona una categoría"),
  visible: z.boolean(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product?: Product | null;
}

export const ProductFormModal = ({
  isOpen,
  onClose,
  onSuccess,
  product,
}: ProductFormModalProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      visible: true,
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    if (isOpen) {
      fetchCategories();
      if (product) {
        reset({
          nombre: product.nombre,
          descripcion: product.descripcion,
          precio: product.precio,
          precioOferta: product.precioOferta ?? null,
          ofertaInicio: product.ofertaInicio?.substring(0, 16) ?? null,
          ofertaFin: product.ofertaFin?.substring(0, 16) ?? null,
          stock: product.stock,
          sku: product.sku,
          categoriaId: product.categoriaId,
          visible: product.visible,
        });
        setPreviews(product.imagenes);
      } else {
        reset({
          nombre: "",
          descripcion: "",
          precio: 0,
          precioOferta: null,
          ofertaInicio: null,
          ofertaFin: null,
          stock: 0,
          sku: "",
          visible: true,
        });
        setPreviews([]);
        setSelectedImages([]);
      }
    }
  }, [isOpen, product, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedImages((prev) => [...prev, ...files]);
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ProductFormData) => {
    if (previews.length === 0) {
      Swal.fire(
        "Imagen obligatoria",
        "Debes subir al menos una imagen del producto",
        "warning"
      );
      return;
    }
    setIsSubmitting(true);
    try {
      // 🛠️ 1. LIMPIEZA DE DATOS ANTES DE ENVIAR AL BACKEND
      const payloadToSend = {
        ...data, // Si no hay precio de oferta o es NaN, forzamos null
        precioOferta:
          !data.precioOferta || isNaN(data.precioOferta)
            ? null
            : data.precioOferta, // Si hay fecha, le agregamos los segundos (":00") si le faltan. Si no hay, mandamos null estricto.
        ofertaInicio: data.ofertaInicio
          ? data.ofertaInicio.length === 16
            ? `${data.ofertaInicio}:00`
            : data.ofertaInicio
          : null,
        ofertaFin: data.ofertaFin
          ? data.ofertaFin.length === 16
            ? `${data.ofertaFin}:00`
            : data.ofertaFin
          : null,
      };

      if (product) {
        // Update product
        await productService.updateProductMultipart(
          product.id,
          payloadToSend as any, // 👈 Usamos el payload limpio
          selectedImages,
          false,
        );
        Swal.fire("¡Éxito!", "Producto actualizado correctamente", "success");
      } else {
        // Create product
        await productService.createProduct(
          payloadToSend as CreateProductRequest,
          selectedImages,
        ); // 👈 Usamos el payload limpio
        Swal.fire("¡Éxito!", "Producto creado correctamente", "success");
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        "Ocurrió un error al procesar el producto";
      Swal.fire("Error", msg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4">
      <div className="bg-white dark:bg-surface-dark w-full max-w-2xl rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[95vh] sm:max-h-[90vh] flex flex-col transition-all duration-300">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary shrink-0">
              <Package size={20} className="sm:hidden" />
              <Package size={24} className="hidden sm:block" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white truncate">
              {product ? "Editar Producto" : "Nuevo Producto"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-thin"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Nombre */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Nombre del Producto
              </label>
              <input
                {...register("nombre")}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white transition-all focus:ring-2 focus:ring-primary/20"
                placeholder="Ej: Alimento Premium Adulto 15kg"
              />
              {errors.nombre && (
                <p className="text-xs text-red-500">{errors.nombre.message}</p>
              )}
            </div>

            {/* SKU */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                SKU / Código
              </label>
              <input
                {...register("sku")}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white transition-all focus:ring-2 focus:ring-primary/20"
                placeholder="PROD-001"
              />
              {errors.sku && (
                <p className="text-xs text-red-500">{errors.sku.message}</p>
              )}
            </div>

            {/* Categoria */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Categoría
              </label>
              <select
                {...register("categoriaId", { valueAsNumber: true })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white transition-all focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Seleccionar categoría</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
              {errors.categoriaId && (
                <p className="text-xs text-red-500">
                  {errors.categoriaId.message}
                </p>
              )}
            </div>

            {/* Precio */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Precio (S/)
              </label>
              <input
                type="number"
                step="0.01"
                {...register("precio", { valueAsNumber: true })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white font-mono transition-all focus:ring-2 focus:ring-primary/20"
              />
              {errors.precio && (
                <p className="text-xs text-red-500">{errors.precio.message}</p>
              )}
            </div>

            {/* Stock */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Stock Inicial
              </label>
              <input
                type="number"
                {...register("stock", { valueAsNumber: true })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white transition-all focus:ring-2 focus:ring-primary/20"
              />
              {errors.stock && (
                <p className="text-xs text-red-500">{errors.stock.message}</p>
              )}
            </div>

            {/* Oferta Toggle */}
            <div className="md:col-span-2 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30">
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 mb-4">
                <Info size={16} />
                <span className="text-sm font-bold">
                  Oferta Temporal (Opcional)
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider opacity-60">
                    Precio Oferta
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("precioOferta", { valueAsNumber: true })}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider opacity-60">
                    Inicio / Fin
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="datetime-local"
                      {...register("ofertaInicio")}
                      className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white transition-all"
                    />
                    <input
                      type="datetime-local"
                      {...register("ofertaFin")}
                      className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Descripcion */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Descripción
              </label>
              <textarea
                {...register("descripcion")}
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white resize-none transition-all focus:ring-2 focus:ring-primary/20"
                placeholder="Detalles sobre el producto..."
              />
            </div>

            {/* Imágenes */}
            <div className="space-y-4 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Imágenes
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
                {previews.map((src, i) => (
                  <div
                    key={i}
                    className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm"
                  >
                    <img
                      src={src}
                      alt="Preview"
                      className="h-full w-full object-cover transition-transform group-hover:scale-110"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1.5 right-1.5 p-1.5 bg-red-500/90 text-white rounded-full sm:opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group">
                  <Upload
                    size={24}
                    className="text-slate-400 mb-1 group-hover:text-primary transition-colors"
                  />
                  <span className="text-xs text-slate-500 group-hover:text-primary">
                    Subir
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>

          </div>
        </form>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex flex-col sm:flex-row justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            type="button"
            className="w-full sm:w-auto order-2 sm:order-1"
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="w-full sm:w-auto gap-2 order-1 sm:order-2 rounded-xl py-2.5"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Procesando
              </span>
            ) : (
              <>
                <Check size={20} />
                <span>{product ? "Guardar Cambios" : "Crear Producto"}</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
