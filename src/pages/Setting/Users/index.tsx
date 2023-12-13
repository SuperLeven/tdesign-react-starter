import React, { useState } from 'react';
import { Button, Input, Tree } from 'tdesign-react';
import { SearchIcon } from 'tdesign-icons-react';
import classnames from 'classnames';
import ProTable from 'components/ProComponents/ProTable';
import { treeList } from './consts';
import CommonStyle from 'styles/common.module.less';
import Style from './index.module.less';

const TreeTable: React.FC = () => {
  const [filterText, setFilterText] = useState('');
  const filterByText = (node: any) => {
    const rs = node.data.label.indexOf(filterText) >= 0;
    return rs;
  };
  const columns: ProColumns[] = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      ellipsis: true,
      type: 'select',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: 150,
      ellipsis: true,
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      width: 150,
      fixed: 'right',
    },
  ];
  return (
    <div className={classnames(CommonStyle.pageWithColor, Style.content)}>
      <div className={Style.treeContent}>
        <Input
          className={Style.search}
          suffixIcon={<SearchIcon />}
          placeholder='请输入关键词'
          value={filterText}
          onChange={setFilterText}
        />
        <Tree
          data={treeList}
          activable
          hover
          transition
          allowFoldNodeOnFilter={true}
          filter={filterText ? filterByText : undefined}
        />
      </div>
      <div className={Style.tableContent}>
        <ProTable
          showSelect={true}
          title={'用户列表'}
          toolLeft={<Button>批量删除</Button>}
          toolRight={<Button>新增</Button>}
          columns={columns}
        />
      </div>
    </div>
  );
};

export default TreeTable;
