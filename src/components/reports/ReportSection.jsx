import { useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import Card from '../common/Card';
import Table from '../common/Table';
import SearchBar from '../common/SearchBar';
import FilterDropdown from '../common/FilterDropdown';
import Pagination from '../common/Pagination';
import Button from '../common/Button';
import { exportToCsv } from '../../utils/exportCsv';

const PAGE_SIZE = 5;

export default function ReportSection({ title, fetcher, columns, searchKeys = [], filename, statusKey, statusOptions }) {
  const { data, loading, error, refetch } = useApi(fetcher, []);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!data) return [];
    let rows = data;
    if (status) rows = rows.filter((row) => row[statusKey] === status);
    if (query) {
      const q = query.toLowerCase();
      rows = rows.filter((row) => searchKeys.some((key) => String(row[key] ?? '').toLowerCase().includes(q)));
    }
    return rows;
  }, [data, query, status, searchKeys, statusKey]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleQueryChange = (v) => {
    setQuery(v);
    setPage(1);
  };
  const handleStatusChange = (v) => {
    setStatus(v);
    setPage(1);
  };

  return (
    <Card>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-display text-sm font-semibold text-[var(--color-ink)]">{title}</h3>
        <div className="flex flex-wrap items-center gap-2">
          <SearchBar value={query} onChange={handleQueryChange} placeholder={`Search ${title.toLowerCase()}...`} />
          {statusOptions && <FilterDropdown value={status} onChange={handleStatusChange} options={statusOptions} label="All Statuses" />}
          <Button variant="secondary" onClick={() => exportToCsv(filename, filtered)} disabled={!filtered.length}>
            <Download size={15} />
            Export CSV
          </Button>
        </div>
      </div>
      <Table
        columns={columns}
        data={paged}
        loading={loading}
        error={error}
        onRetry={refetch}
        emptyTitle={`No ${title.toLowerCase()} found`}
      />
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </Card>
  );
}