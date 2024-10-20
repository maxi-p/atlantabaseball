import React from 'react'
import axios from 'axios'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableDataCell,
  CTableRow,
  CSpinner,
} from '@coreui/react'
import {
  getCoreRowModel,
  flexRender,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

// batter
// batterId
// exitDirection
// exitSpeed
// gameDate
// hangTime
// hitDistance
// hitSpinRate
// launchAngle
// pitcher
// pitcherId
// playOutcome
// videoLink
// _id

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`;
  const day = date.getDay() + 1 < 10 ? `0${date.getDay() + 1}` : `${date.getDay() + 1}`;
  return `${month}/${day}/${date.getFullYear() - 2000}`;
};

const columns = [
  {
    accessorKey: 'videoLink',
    cell: info => <a href={`${info.getValue()}`} target="_blank">Video</a>,
    header: 'Video',
    enableColumnFilter: false,
    enableSorting: false
  },
  {
    accessorKey: 'batter',
    header: 'Batter',
  },
  {
    accessorKey: 'batterId',
    header: 'Batter Id',
    getIsVisible: () => false,
  },
  {
    accessorKey: 'pitcher',
    header: 'Pitcher',
  },
  {
    accessorKey: 'pitcherId',
    header: 'Pitcher Id',
    getIsVisible: () => false,
  },
  {
    accessorKey: 'gameDate',
    accessorFn: row => formatDate(row.gameDate),
    cell: info => info.getValue(),
    header: 'Game Date:',
  },
  {
    accessorKey: 'launchAngle',
    cell: info => info.getValue(),
    header: 'Launch Angle',
    meta: {
      filterVariant: 'range',
    },
  },
  {
    accessorKey: 'exitSpeed',
    cell: info => info.getValue(),
    header: 'Exit Speed',
    meta: {
      filterVariant: 'range',
    },
  },
  {
    accessorKey: 'exitDirection',
    cell: info => info.getValue(),
    header: 'Exit Direction',
    meta: {
      filterVariant: 'range',
    },
  },
  {
    accessorKey: 'hitDistance',
    cell: info => info.getValue(),
    header: 'Hit Distance',
    meta: {
      filterVariant: 'range',
    },
  },
  {
    accessorKey: 'hangTime',
    cell: info => info.getValue(),
    header: 'Hang Time',
    meta: {
      filterVariant: 'range',
    },
  },
  {
    accessorKey: 'hitSpinRate',
    cell: info => info.getValue(),
    header: 'Hit Spin Rate',
    meta: {
      filterVariant: 'range',
    },
  },
  {
    accessorKey: 'playOutcome',
    header: 'Play Outcome',
    meta: {
      filterVariant: 'select',
    },
  },
];

const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }) => {
  const [value, setValue] = React.useState(initialValue)

  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return (
    <input {...props} value={value} onChange={e => setValue(e.target.value)} />
  )
}

const Filter = ({ column }) => {
  const { filterVariant } = column.columnDef.meta ?? {}

  const columnFilterValue = column.getFilterValue()

  const sortedUniqueValues = React.useMemo(
    () =>
      filterVariant === 'range'
        ? []
        : Array.from(column.getFacetedUniqueValues().keys())
          .sort()
          .slice(0, 5000),
    [column.getFacetedUniqueValues(), filterVariant]
  )

  return filterVariant === 'range' ? (
    <div>
      <div className="flex space-x-2">
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
          value={(columnFilterValue)?.[0] ?? ''}
          onChange={value =>
            column.setFilterValue((old) => [value, old?.[1]])
          }
          placeholder={`Min ${column.getFacetedMinMaxValues()?.[0] !== undefined
            ? `(${column.getFacetedMinMaxValues()?.[0]})`
            : ''
            }`}
          className="w-24 border shadow rounded"
        />
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
          value={(columnFilterValue)?.[1] ?? ''}
          onChange={value =>
            column.setFilterValue((old) => [old?.[0], value])
          }
          placeholder={`Max ${column.getFacetedMinMaxValues()?.[1]
            ? `(${column.getFacetedMinMaxValues()?.[1]})`
            : ''
            }`}
          className="w-24 border shadow rounded"
        />
      </div>
      <div className="h-1" />
    </div>
  ) : filterVariant === 'select' ? (
    <select
      onChange={e => column.setFilterValue(e.target.value)}
      value={columnFilterValue?.toString()}
    >
      <option value="">All</option>
      {sortedUniqueValues.map(value => (
        //dynamically generated select options from faceted values feature
        <option value={value} key={value}>
          {value}
        </option>
      ))}
    </select>
  ) : (
    <>
      {/* Autocomplete suggestions from faceted values feature */}
      <datalist id={column.id + 'list'}>
        {sortedUniqueValues.map((value) => (
          <option value={value} key={value} />
        ))}
      </datalist>
      <DebouncedInput
        type="text"
        value={(columnFilterValue ?? '')}
        onChange={value => column.setFilterValue(value)}
        placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
        className="w-36 border shadow rounded"
        list={column.id + 'list'}
      />
      <div className="h-1" />
    </>
  )
}

const Table = () => {
  const [plays, setPlays] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [columnVisibility, setColumnVisibility] = React.useState({});

  React.useEffect(() => {
    loadPlays();
  }, []);

  console.log(plays);

  const loadPlays = async () => {
    const res = await axios.get('/v1/play');
    setLoading(false);
    setPlays(res.data.plays);
  };

  const table = useReactTable({
    data: plays,
    columns,
    state: {
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  });

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Batted Ball Data</strong> <small>Table</small>
          </CCardHeader>
          <CCardBody className="overflow-scroll">
            {loading ? <CSpinner className="mx-auto" /> :
              <>
                <div className="w-75 d-flex flex-row flex-wrap inline rounded">
                  {table.getAllLeafColumns().map(column => {
                    return (
                      <div key={column.id} className="px-1 inline">
                        <label>
                          <input
                            {...{
                              type: 'checkbox',
                              checked: column.getIsVisible(),
                              onChange: column.getToggleVisibilityHandler(),
                            }}
                          />{' '}
                          {column.id}
                        </label>
                      </div>
                    )
                  })}
                </div>

                <CTable>
                  <CTableHead>
                    {table.getHeaderGroups().map(headerGroup => (
                      <CTableRow key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                          <CTableHeaderCell key={header.id}>
                            <div
                              {...{
                                className: header.column.getCanSort()
                                  ? 'cursor-pointer select-none'
                                  : '',
                                onClick: header.column.getToggleSortingHandler(),
                              }}
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {{
                                asc: ' 🔼',
                                desc: ' 🔽',
                              }[header.column.getIsSorted()] ?? null}
                            </div>
                            {header.column.getCanFilter() ? (
                              <div>
                                <Filter column={header.column} />
                              </div>
                            ) : null}
                          </CTableHeaderCell>
                        ))}
                      </CTableRow>
                    ))}
                  </CTableHead>
                  <CTableBody>
                    {table.getRowModel().rows.map(row => (
                      <CTableRow key={row.id}>
                        {row.getVisibleCells().map(cell => (
                          <CTableDataCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </CTableDataCell>
                        ))}
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              </>}
          </CCardBody>
          <div className="h-2" />
          <div className="flex items-center gap-2">
            <button
              className="border rounded p-1"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              {'<<'}
            </button>
            <button
              className="border rounded p-1"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {'<'}
            </button>
            <button
              className="border rounded p-1"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {'>'}
            </button>
            <button
              className="border rounded p-1"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              {'>>'}
            </button>
            <span className="flex items-center gap-1">
              <div>Page</div>
              <strong>
                {table.getState().pagination.pageIndex + 1} of{' '}
                {table.getPageCount()}
              </strong>
            </span>
            <span className="flex items-center gap-1">
              | Go to page:
              <input
                type="number"
                defaultValue={table.getState().pagination.pageIndex + 1}
                onChange={e => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0
                  table.setPageIndex(page)
                }}
                className="border p-1 rounded w-16"
              />
            </span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={e => {
                table.setPageSize(Number(e.target.value))
              }}
            >
              {[10, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Table;
