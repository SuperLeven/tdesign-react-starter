interface ProColumns {
  children?: any;
  colsapn?: any;
  title: string;
  dataIndex: string;
  key: string;
  width?: string | number;
  render?: (text: string, record: TableRowData) => React.ReactNode;
  type?: string;
  align?: string;
  fixed?: string;
  filedProps?: any;
  itemProps?: any;
  ellipsis?: boolean;
  sorter?: boolean;
  defaultSortOrder?: string;
  filters?: any[];
  filterMultiple?: boolean;
  filterDropdown?: React.ReactNode;
  filterDropdownVisible?: boolean;
  onFilterDropdownVisibleChange?: (visible: boolean) => void;
  onFilter?: (value: any, record: TableRowData) => boolean;
  filterIcon?: React.ReactNode;
  filteredValue?: any[];
  hideInSearch?: boolean;
  hideInTable?: boolean;
}

interface ProTableProps {
  title?: ReactNode | string;
  toolRight?: ReactNode;
  toolLeft?: ReactNode;
  selectProps?: {};
  showSelect?: boolean | undefined;
  pagination?: PaginationProps;
  onSelectChange?: ((selectedRowKeys: (string | number)[], options: SelectOptions<TableRowData>) => void) | undefined;
  selectedRowKeys?: (string | number)[] | undefined;
  rowKey?: string;
  columns: ProColumns[];
  request?: (params: any) => Promise<any>;
}
