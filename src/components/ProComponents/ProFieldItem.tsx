import { Cascader, DatePicker, Form, Input, Select, TimePicker, TreeSelect } from 'tdesign-react';

const { FormItem } = Form;

export default (props: { field: any; fieldProps: any }) => {
  const { field, fieldProps } = props;
  function renderFormItem(formField: any) {
    return (
      <FormItem label={field.title} name={field.key || field.dataIndex} {...(field.itemProps || {})}>
        {formField}
      </FormItem>
    );
  }
  switch (field.type) {
    case 'select':
      return renderFormItem(<Select {...fieldProps} />);
    case 'cascader':
      return renderFormItem(<Cascader {...fieldProps} />);
    case 'tree':
      return renderFormItem(<TreeSelect {...fieldProps} />);
    case 'date':
      return renderFormItem(<DatePicker {...fieldProps} />);
    case 'time':
      return renderFormItem(<TimePicker {...fieldProps} />);
    default:
      return renderFormItem(<Input {...fieldProps} />);
  }
};
