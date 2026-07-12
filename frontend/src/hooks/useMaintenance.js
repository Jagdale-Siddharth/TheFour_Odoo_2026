import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import maintenanceApi from "../api/maintenanceApi";

export default function useMaintenance() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const res = await maintenanceApi.list({ status, page, pageSize });
      setItems(res.data.items);
      setTotal(res.data.total);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [status, page]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const createRecord = async (data) => {
    const res = await maintenanceApi.create(data);
    toast.success(res.message);
    await fetchRecords();
  };

  const completeRecord = async (id, data) => {
    const res = await maintenanceApi.complete(id, data);
    toast.success(res.message);
    await fetchRecords();
  };

  const deleteRecord = async (id) => {
    const res = await maintenanceApi.remove(id);
    toast.success(res.message);
    await fetchRecords();
  };

  return {
    items,
    total,
    loading,
    status,
    setStatus,
    page,
    setPage,
    pageSize,
    createRecord,
    completeRecord,
    deleteRecord,
    refetch: fetchRecords,
  };
}
