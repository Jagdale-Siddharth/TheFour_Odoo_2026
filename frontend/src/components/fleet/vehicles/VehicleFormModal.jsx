import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { inputClass, primaryBtnClass, secondaryBtnClass } from "../../../constants/styles";

const schema = z.object({
  registrationNumber: z.string().trim().min(1, "Registration Number is required"),
  vehicleName: z.string().trim().min(1, "Vehicle Name is required"),
  vehicleType: z.string().trim().min(1, "Vehicle Type is required"),
  maxLoadCapacity: z.coerce.number().positive("Capacity must be greater than zero"),
  odometer: z.coerce.number().min(0).optional(),
  acquisitionCost: z.coerce.number().min(0).optional(),
});

export default function VehicleFormModal({ open, initialData, onSubmit, onClose }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (open) reset(initialData || {});
  }, [open, initialData, reset]);

  if (!open) return null;

  const submit = async (values) => {
    await onSubmit(values);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-gray-900">
          {initialData ? "Edit Vehicle" : "Add Vehicle"}
        </h3>

        <form onSubmit={handleSubmit(submit)} className="mt-4 space-y-4">
          <Field label="Registration Number" error={errors.registrationNumber}>
            <input {...register("registrationNumber")} className={inputClass} />
          </Field>

          <Field label="Vehicle Name" error={errors.vehicleName}>
            <input {...register("vehicleName")} className={inputClass} />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Vehicle Type" error={errors.vehicleType}>
              <input {...register("vehicleType")} className={inputClass} />
            </Field>
            <Field label="Max Load Capacity" error={errors.maxLoadCapacity}>
              <input type="number" step="0.01" {...register("maxLoadCapacity")} className={inputClass} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Odometer" error={errors.odometer}>
              <input type="number" step="0.01" {...register("odometer")} className={inputClass} />
            </Field>
            <Field label="Acquisition Cost" error={errors.acquisitionCost}>
              <input type="number" step="0.01" {...register("acquisitionCost")} className={inputClass} />
            </Field>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className={secondaryBtnClass}>
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className={primaryBtnClass}>
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="mt-1">{children}</div>
      {error && <p className="mt-1 text-xs text-red-600">{error.message}</p>}
    </div>
  );
}
