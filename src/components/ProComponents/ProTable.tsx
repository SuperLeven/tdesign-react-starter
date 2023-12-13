import { useCallback, useMemo, useState } from 'react';
import { useAntdTable } from 'ahooks';
import {
  Col,
  Form,
  PaginationProps,
  PrimaryTableCol,
  PrimaryTableProps,
  Row,
  Space,
  Table,
  TableChangeContext,
  TableChangeData,
  TableRowData,
} from 'tdesign-react';
import ProSearch from './ProSearch';
import styles from './index.module.less';

export default (props: ProTableProps) => {
  const [form] = Form.useForm();
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  function getFormValues() {
    if (form && form.getCurrentElement) {
      const tForm = form.getCurrentElement();
      const tFormItem = tForm.getElementsByClassName('t-form__item');
      const names = [];
      for (let i = 0; i < tFormItem.length; i++) {
        const classNames = tFormItem[i].className.split(' ');
        const currentClassName = classNames.find((name) => name.startsWith('t-form-item__'));
        if (currentClassName) {
          names.push(currentClassName.replace('t-form-item__', ''));
        }
      }
      const values = form.getFieldsValue(names);
      return values;
    }
    return {};
  }
  const { request = () => Promise.resolve({ data: [], total: 0 }) } = props;
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);

  function onSelectChange(value: any[], { selectedRowData }: any) {
    setSelectedRowKeys(value);
    if (props.onSelectChange) props.onSelectChange(value, selectedRowData);
  }

  const service = async (params: any) => {
    const values = getFormValues();
    const result = await request(JSON.parse(JSON.stringify({ ...params, ...values })));
    setData(result.data);
    setTotal(result.total);
    return {
      total: result.total,
      list: result.data,
    };
  };

  const getFieldsValue = (fields?: string[]) => {
    if (fields) {
      return form.getFieldsValue(fields);
    }
    return getFormValues();
  };

  const { tableProps, search } = useAntdTable(service, {
    form: {
      ...form,
      resetFields: form.reset,
      setFieldsValue: form.setFieldsValue,
      getFieldsValue,
      validateFields: async (fields?: string[]) => {
        const res = await form.validate();
        if (res === true) {
          return getFieldsValue(fields);
        }
        throw res;
      },
    },
    defaultParams: [(props.pagination as any) || {}],
  });

  const onChange = useCallback(
    (data: TableChangeData, context: TableChangeContext<any>) => {
      const antdAction = {
        pagination: 'paginate',
        sorter: 'sort',
        filter: 'filter',
      };
      const extra = {
        currentDataSource: context.currentData,
        action: antdAction[context.trigger],
      };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore-next-line
      tableProps?.onChange(data.pagination, data.filter, data.sorter, extra);
    },
    [tableProps],
  );

  const formatPagination = (pagination: any) => {
    const tPagination: PaginationProps = {
      ...pagination,
    };
    return tPagination;
  };

  function formatTableProps(tableProps: any) {
    const tTable: PrimaryTableProps = {
      ...tableProps,
      rowKey: props.rowKey || 'id',
      columns: props.columns,
      data: tableProps.dataSource,
      onChange,
      pagination: formatPagination(tableProps.pagination),
    };
    return tTable;
  }
  const formColumns = useMemo(
    () => props.columns.filter((item: any) => !item.hideInSearch && item.type !== 'index' && item.type !== 'action'),
    [],
  );
  const tableColumns: PrimaryTableCol<TableRowData>[] = useMemo(() => {
    const cols = props.columns
      .filter((item: any) => !item.hideInTable)
      .map((item) => ({
        align: item.align as any,
        colKey: item.dataIndex,
        ellipsis: item.ellipsis as any,
        fixed: item.fixed as any,
        width: item.width as any,
        render: item.render as any,
        title: item.title,
        colspan: item.colsapn,
        children: item.children,
        // align	String	left	列横向对齐方式。可选项：left/right/center	N
        // attrs	Object / Function	-	透传 HTML 属性到列元素。TS 类型：BaseTableColumnAttributes<T> type BaseTableColumnAttributes<T> = { [key: string]: any } | ((context: CellData<T>) => { [key: string]: any })。详细类型定义	N
        // cell	String / Function	-	自定义单元格渲染，优先级高于 render。泛型 T 指表格数据类型。TS 类型：string | TNode<BaseTableCellParams<T>> interface BaseTableCellParams<T> { row: T; rowIndex: number; col: BaseTableCol<T>; colIndex: number }。通用类型定义。详细类型定义	N
        // children	Array	-	用于多级表头，泛型 T 指表格数据类型。TS 类型：Array<BaseTableCol<T>>	N
        // className	String / Object / Array / Function	-	列类名，值类型是 Function 使用返回值作为列类名；值类型不为 Function 时，值用于整列类名（含表头）。泛型 T 指表格数据类型。TS 类型：TableColumnClassName<T> | TableColumnClassName<T>[] type TableColumnClassName<T> = ClassName | ((context: CellData<T>) => ClassName) interface CellData<T> extends BaseTableCellParams<T> { type: 'th' | 'td' }。通用类型定义。详细类型定义	N
        // colKey	String	-	渲染列所需字段，值为 serial-number 表示当前列为「序号」列	N
        // colspan	Number	-	单行表头合并列。多行表头请参考「多级表头」文档示例	N
        // ellipsis	TNode	false	单元格和表头内容超出时，是否显示省略号。如果仅希望单元格超出省略，可设置 ellipsisTitle = false。
        // 值为 true，则超出省略浮层默认显示单元格内容；
        // 值类型为 Function 则自定义超出省略浮中层显示的内容；
        // 值类型为 Object，则自动透传属性到 Tooltip 组件，可用于调整浮层背景色和方向等特性。
        // 同时透传 Tooltip 属性和自定义浮层内容，请使用 { props: { theme: 'light' }, content: () => 'something' }。
        // 请注意单元格超出省略的两个基本点：1. 内容元素是内联元素或样式（自定义单元格内容时需特别注意）；2. 内容超出父元素。TS 类型：boolean | TNode<BaseTableCellParams<T>> | TooltipProps | { props: TooltipProps; content: TNode<BaseTableCellParams<T>> }，Tooltip API Documents。通用类型定义。详细类型定义	N
        // ellipsisTitle	TNode	undefined	表头内容超出时，是否显示省略号。优先级高于 ellipsis。
        // 值为 true，则超出省略的浮层默认显示表头全部内容；
        // 值类型为 Function 用于自定义超出省略浮层显示的表头内容；
        // 值类型为 Object，则自动透传属性到 Tooltip 组件，则自动透传属性到 Tooltip 组件，可用于调整浮层背景色和方向等特性。
        // 同时透传 Tooltip 属性和自定义浮层内容，请使用 { props: { theme: 'light' }, content: () => 'something' }。TS 类型：boolean | TNode<BaseTableColParams<T>> | TooltipProps | { props: TooltipProps; content: TNode<BaseTableColParams<T>> } interface BaseTableColParams<T> { col: BaseTableCol<T>; colIndex: number }。通用类型定义。详细类型定义	N
        // fixed	String	left	固定列显示位置。可选项：left/right	N
        // foot	String / Function	-	自定义表尾内容。TS 类型：string | TNode | TNode<{ col: BaseTableCol; colIndex: number }>。通用类型定义	N
        // minWidth	String / Number	-	透传 CSS 属性 min-width 到 <col> 元素。⚠️ 仅少部分浏览器支持，如：使用 TablesNG 渲染的 Chrome 浏览器支持 minWidth	N
        // render	Function	-	自定义表头或单元格，泛型 T 指表格数据类型。TS 类型：TNode<BaseTableRenderParams<T>> interface BaseTableRenderParams<T> extends BaseTableCellParams<T> { type: RenderType } type RenderType = 'cell' | 'title'。通用类型定义。详细类型定义	N
        // resizable	Boolean	true	是否允许调整当前列列宽	N
        // resize	Object	-	限制拖拽调整的最小宽度和最大宽度。resize.minWidth 默认为 80，resize.maxWidth 默认为 600。TS 类型：TableColumnResizeConfig interface TableColumnResizeConfig { minWidth: number; maxWidth: number }。详细类型定义	N
        // stopPropagation	Boolean	-	是否阻止当列单元格点击事件冒泡	N
        // thClassName	String / Object / Array / Function	-	列表头类名，值类型是函数时使用返回值作为列类名。泛型 T 指表格数据类型。TS 类型：TableColumnClassName<T> | TableColumnClassName<T>[]。通用类型定义	N
        // title	String / Function	-	自定义表头渲染，优先级高于 render。TS 类型：string | TNode | TNode<{ col: BaseTableCol; colIndex: number }>。通用类型定义	N
        // width	String / Number	-	列宽，可以作为最小宽度使用。当列宽总和小于 table 元素时，浏览器根据宽度设置情况自动分配宽度；当列宽总和大于 table 元素，表现为定宽。可以同时调整 table 元素的宽度来达到自己想要的效果
      }));
    if (props.showSelect) {
      return [
        {
          colKey: 'row-select',
          type: 'multiple',
          ...{ ...(props.selectProps || {}) },
          width: 50,
        },
        ...cols,
      ];
    }
    return cols;
  }, [props]);
  return (
    <>
      <Row gutter={[10, 10]} style={{ width: '100%' }}>
        <Col span={12}>
          <ProSearch {...search} form={form} columns={formColumns} />
        </Col>
        {props.title || props.toolLeft || props.toolRight ? (
          <Col span={12}>
            <Row gutter={10}>
              <Col span={6}>
                <Space align='center'>
                  <span className={styles['tabel-title']}>{props.title}</span>
                  {props.toolLeft}
                </Space>
              </Col>
              <Col span={6}>
                <div className={styles['table-tool-right']}>{props.toolRight}</div>
              </Col>
            </Row>
          </Col>
        ) : (
          <></>
        )}
        <Col span={12}>
          <Table
            data={data}
            selectedRowKeys={selectedRowKeys}
            onSelectChange={onSelectChange}
            bordered={true}
            size='small'
            selectOnRowClick={props.showSelect}
            stripe={true}
            {...formatTableProps(tableProps)}
            pagination={{ ...(tableProps.pagination || {}), total }}
            columns={tableColumns}
            hover
          />
        </Col>
      </Row>
    </>
  );
};
