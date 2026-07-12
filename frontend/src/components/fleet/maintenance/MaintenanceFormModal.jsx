import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { inputClass, primaryBtnClass, secondaryBtnClass } from "../../../constants/styles";

const schema = z.object({
  vehicleId: z.coerce.number().int().positive("Vehicle is required"),
  maintenanceType: z.string().trim().min(1, "Maintenance Type is required"),
  description: z.string().trim().min(1, "Description is required"),
  estimatedCost: z.coerce.number().min(0, "Cost must be zero or more").optional(),
});

export default function MaintenanceFormModal({ open, vehicles, onSubmit, onClose }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (open) reset({});
  }, [open, reset]);

  if (!open) return null;

  const submit = async (values) => {
    await onSubmit(values);
    onClose();
  };

  // Only vehicles that can actually enter the shop are selectable -
  // mirrors the backend rule (not ON_TRIP, not RETIRED, not already IN_SHOP).
  const eligibleVehicles = vehicles.filter(
    (v) => !["ON_TRIP", "RETIRED", "IN_SHOP"].includes(v.status)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-gray-900">New Maintenance Record</h3>

        <form onSubmit={handleSubmit(submit)} className="mt-4 space-y-4">
          <Field label="Vehicle" error={errors.vehicleId}>
            <select {...register("vehicleId")} className={inputClass}>
              <option value="">Select a vehicle</option>
              {eligibleVehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.registrationNumber} - {v.vehicleName}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Maintenance Type" error={errors.maintenanceType}>
            <input {...register("maintenanceType")} className={inputClass} placeholder="e.g. Oil Change" />
          </Field>

          <Field label="Description" error={errors.description}>
            <textarea {...register("description")} rows={3} className={inputClass} />
          </Field>

          <Field label="Estimated Cost" error={errors.estimatedCost}>
            <input type="number" step="0.01" {...register("estimatedCost")} className={inputClass} />
          </Field>

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
