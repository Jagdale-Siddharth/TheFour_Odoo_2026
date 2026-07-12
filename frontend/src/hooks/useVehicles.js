import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import vehicleApi from "../api/vehicleApi";

export default function useVehicles() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await vehicleApi.list({ search, status, page, pageSize });
      setItems(res.data.items);
      setTotal(res.data.total);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [search, status, page]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const createVehicle = async (data) => {
    const res = await vehicleApi.create(data);
    toast.success(res.message);
    await fetchVehicles();
  };

  const updateVehicle = async (id, data) => {
    const res = await vehicleApi.update(id, data);
    toast.success(res.message);
    await fetchVehicles();
  };

  const retireVehicle = async (id) => {
    const res = await vehicleApi.retire(id);
    toast.success(res.message);
    await fetchVehicles();
  };

  const deleteVehicle = async (id) => {
    const res = await vehicleApi.remove(id);
    toast.success(res.message);
    await fetchVehicles();
  };

  return {
    items,
    total,
    loading,
    search,
    setSearch,
    status,
    setStatus,
    page,
    setPage,
    pageSize,
    createVehicle,
    updateVehicle,
    retireVehicle,
    deleteVehicle,
    refetch: fetchVehicles,
  };
}
