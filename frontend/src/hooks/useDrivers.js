import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import driverApi from "../api/driverApi";

export default function useDrivers() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const fetchDrivers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await driverApi.list({ search, status, page, pageSize });
      setItems(res.data.items);
      setTotal(res.data.total);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [search, status, page]);

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  const createDriver = async (data) => {
    const res = await driverApi.create(data);
    toast.success(res.message);
    await fetchDrivers();
  };

  const updateDriver = async (id, data) => {
    const res = await driverApi.update(id, data);
    toast.success(res.message);
    await fetchDrivers();
  };

  const deleteDriver = async (id) => {
    const res = await driverApi.remove(id);
    toast.success(res.message);
    await fetchDrivers();
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
    createDriver,
    updateDriver,
    deleteDriver,
    refetch: fetchDrivers,
  };
}
