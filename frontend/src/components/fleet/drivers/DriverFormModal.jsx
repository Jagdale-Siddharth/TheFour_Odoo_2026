import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { inputClass, primaryBtnClass, secondaryBtnClass } from "../../../constants/styles";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  licenseNumber: z.string().trim().min(1, "License Number is required"),
  licenseCategory: z.string().trim().min(1, "License Category is required"),
  licenseExpiryDate: z
    .string()
    .refine((v) => new Date(v).getTime() > Date.now(), "Expiry Date must be in the future"),
  contactNumber: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s()]{7,20}$/, "Invalid phone number"),
  safetyScore: z.coerce.number().int().min(0).max(100).optional(),
});

export default function DriverFormModal({ open, initialData, onSubmit, onClose }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (open) {
      reset(
        initialData
          ? { ...initialData, licenseExpiryDate: initialData.licenseExpiryDate?.slice(0, 10) }
          : {}
      );
    }
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
          {initialData ? "Edit Driver" : "Add Driver"}
        </h3>

        <form onSubmit={handleSubmit(submit)} className="mt-4 space-y-4">
          <Field label="Name" error={errors.name}>
            <input {...register("name")} className={inputClass} />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="License Number" error={errors.licenseNumber}>
              <input {...register("licenseNumber")} className={inputClass} />
            </Field>
            <Field label="License Category" error={errors.licenseCategory}>
              <input {...register("licenseCategory")} className={inputClass} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="License Expiry Date" error={errors.licenseExpiryDate}>
              <input type="date" {...register("licenseExpiryDate")} className={inputClass} />
            </Field>
            <Field label="Contact Number" error={errors.contactNumber}>
              <input {...register("contactNumber")} className={inputClass} />
            </Field>
          </div>

          <Field label="Safety Score (0-100)" error={errors.safetyScore}>
            <input type="number" {...register("safetyScore")} className={inputClass} />
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
