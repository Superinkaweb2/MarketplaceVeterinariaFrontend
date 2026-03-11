import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Upload, Package, Info, Check, Trash2, Plus, FileText, Image as ImageIcon, ReceiptIcon } from "lucide-react";
import { Button } from "../../../../components/ui/Button";
import type { Category } from "../../../catalog/types/category";
import { categoryService } from "../../../catalog/services/categoryService";
import type { CreateProductRequest, Product } from "../../../catalog/types/product";
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

export const ProductFormModal = ({ isOpen, onClose, onSuccess, product }: ProductFormModalProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOffer, setShowOffer] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: { visible: true },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAllCategories();
        setCategories(data);
      } catch (error) { console.error(error); }
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
        if (product.precioOferta) setShowOffer(true);
      } else {
        reset({ nombre: "", descripcion: "", precio: 0, stock: 0, sku: "", visible: true });
        setPreviews([]);
        setSelectedImages([]);
        setShowOffer(false);
      }
    }
  }, [isOpen, product, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalImages = previews.length + files.length;

    if (totalImages > 5) {
      Swal.fire({
        icon: 'warning',
        title: 'Límite excedido',
        text: `Solo puedes subir un máximo de 5 imágenes. Ya tienes ${previews.length}, intentaste subir ${files.length}.`,
        confirmButtonColor: '#3b82f6'
      });
      return;
    }

    if (files.length > 0) {
      setSelectedImages((prev) => [...prev, ...files]);
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    const imageToRemove = previews[index];
    const isNewImage = imageToRemove.startsWith('blob:');

    if (isNewImage) {
      const newImagesBeforeThisOne = previews
        .slice(0, index)
        .filter(p => p.startsWith('blob:')).length;

      setSelectedImages((prev) => prev.filter((_, i) => i !== newImagesBeforeThisOne));
    } else {
      console.log("Eliminando imagen existente del servidor:", imageToRemove);
    }

    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ProductFormData) => {
    if (previews.length === 0) {
      Swal.fire("Imagen obligatoria", "Debes subir al menos una imagen", "warning");
      return;
    }

    setIsSubmitting(true);

    try {
      const currentServerImages = previews.filter(p => !p.startsWith('blob:'));

      const payloadToSend = {
        ...data,
        imagenes: currentServerImages,
        precioOferta: !showOffer || !data.precioOferta ? null : data.precioOferta,
        ofertaInicio: showOffer && data.ofertaInicio
          ? (data.ofertaInicio.length === 16 ? `${data.ofertaInicio}:00` : data.ofertaInicio)
          : null,
        ofertaFin: showOffer && data.ofertaFin
          ? (data.ofertaFin.length === 16 ? `${data.ofertaFin}:00` : data.ofertaFin)
          : null,
      };

      if (product) {
        await productService.updateProductMultipart(
          product.id,
          payloadToSend as any,
          selectedImages,
          false
        );
        Swal.fire("¡Éxito!", "Producto actualizado correctamente", "success");
      } else {
        await productService.createProduct(
          payloadToSend as CreateProductRequest,
          selectedImages
        );
        Swal.fire("¡Éxito!", "Producto creado correctamente", "success");
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      const msg = error.response?.data?.message || "Ocurrió un error al procesar el producto";
      Swal.fire("Error", msg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-slate-200 dark:border-slate-800">

        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Package size={24} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {product ? "Editar Producto" : "Nuevo Producto"}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Form Content (Scrollable) */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">

          {/* Section 1: General Information */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Info className="text-primary/70" size={18} />
              <h3 className="text-sm font-bold uppercase tracking-wider text-primary/80">Información General</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Nombre del Producto</label>
                <input {...register("nombre")} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all" placeholder="Ej. Smartwatch Series 7" />
                {errors.nombre && <p className="text-xs text-red-500 mt-1">{errors.nombre.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">SKU</label>
                <input {...register("sku")} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all" placeholder="PROD-001" />
                {errors.sku && <p className="text-xs text-red-500 mt-1">{errors.sku.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Categoría</label>
                <select {...register("categoriaId", { valueAsNumber: true })} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all appearance-none">
                  <option value="">Seleccionar...</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>
              </div>
            </div>
          </section>

          {/* Section 2: Inventory & Price */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <ReceiptIcon className="text-primary/70" size={18} />
              <h3 className="text-sm font-bold uppercase tracking-wider text-primary/80">Inventario y Precio</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Precio Base (S/)</label>
                <input type="number" step="0.01" {...register("precio", { valueAsNumber: true })} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Stock Inicial</label>
                <input type="number" {...register("stock", { valueAsNumber: true })} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all" />
              </div>
            </div>
          </section>

          {/* Section 3: Temporary Offer */}
          <section className={`space-y-4 p-5 rounded-2xl border transition-all ${showOffer ? 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800' : 'bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800'}`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Check className={showOffer ? 'text-primary' : 'text-slate-400'} size={18} />
                <h3 className={`text-sm font-bold uppercase tracking-wider ${showOffer ? 'text-primary' : 'text-slate-500'}`}>Oferta Temporal</h3>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={showOffer} onChange={(e) => setShowOffer(e.target.checked)} className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 transition-opacity ${showOffer ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">Precio de Oferta</label>
                <input type="number" step="0.01" {...register("precioOferta", { valueAsNumber: true })} className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm text-white" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">Vigencia (Inicio - Fin)</label>
                <div className="flex gap-2">
                  <input type="datetime-local" {...register("ofertaInicio")} className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-2 text-[10px]" />
                  <input type="datetime-local" {...register("ofertaFin")} className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-2 text-[10px]" />
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Description */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="text-primary/70" size={18} />
              <h3 className="text-sm font-bold uppercase tracking-wider text-primary/80">Descripción</h3>
            </div>
            <textarea {...register("descripcion")} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/50 outline-none transition-all resize-none" rows={4} placeholder="Escribe una descripción detallada..." />
          </section>

          {/* Section 5: Images */}
          <section className="space-y-4 pb-4">
            <div className="flex items-center gap-2 mb-2">
              <ImageIcon className="text-primary/70" size={18} />
              <h3 className="text-sm font-bold uppercase tracking-wider text-primary/80">Imágenes del Producto</h3>
            </div>

            <label className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer group">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform text-primary">
                <Upload size={24} />
              </div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Arrastra imágenes o <span className="text-primary">explora</span></p>
              <p className="text-xs text-slate-500 mt-1">Máximo 5 imágenes (JPG, PNG)</p>
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 mt-4">
              {previews.map((src, i) => (
                <div key={i} className="aspect-square bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden relative group">
                  <img src={src} className="w-full h-full object-cover" alt="Preview" />
                  <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-red-500 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity text-white">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              {previews.length < 5 && (
                <div className="aspect-square bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400">
                  <Plus size={20} />
                </div>
              )}
            </div>
          </section>
        </form>

        {/* Footer */}
        <div className="p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} type="button">Cancelar</Button>
          <Button variant="primary" onClick={handleSubmit(onSubmit)} disabled={isSubmitting} className="min-w-[140px]">
            {isSubmitting ? (
              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <span className="flex items-center gap-2"><Check size={20} /> {product ? "Guardar" : "Crear"}</span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};