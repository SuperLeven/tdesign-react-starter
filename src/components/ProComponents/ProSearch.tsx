import { useEffect, useMemo, useRef, useState } from 'react';
import { Form, Button, Space, Col, Row, Link, Data, FormInstanceFunctions } from 'tdesign-react';
import { Icon } from 'tdesign-icons-react';
import styles from './index.module.less';
import ProFieldItem from './ProFieldItem';

const { FormItem } = Form;

export default (props: { submit: any; reset: any; columns: any[]; form: FormInstanceFunctions<Data> | undefined }) => {
  const formCurrent = useRef<any>();
  const [deviceType, setDeviceType] = useState<string>('');
  const getDevice = (width: number) => {
    switch (true) {
      case width >= 1200:
        return 'lg';
      case width >= 992:
        return 'md';
      case width >= 768:
        return 'sm';
      default:
        return 'xs';
    }
  };
  const deviceTypeNum = useMemo(() => {
    if (deviceType === 'xs') {
      return 6;
    }
    if (deviceType === 'sm') {
      return 4;
    }
    if (deviceType === 'lg') {
      return 3;
    }
    return 4;
  }, [deviceType]);
  const getDeviceType = () => {
    const width = window.innerWidth;
    const device = getDevice(width);
    setDeviceType(device);
  };
  const onSubmit = () => {
    props.submit();
  };

  const onReset = () => {
    props.reset();
  };

  const [collapseValue, setCollapseValue] = useState(false);
  useEffect(() => {
    window.onresize = getDeviceType;
    getDeviceType();
  }, []);
  const showMore = useMemo(() => {
    const num = 12 / deviceTypeNum;
    if (props.columns.length < num) {
      return false;
    }
    return true;
  }, [deviceTypeNum, props.columns]);
  const colProps: any = useMemo(
    () => ({
      span: deviceTypeNum,
    }),
    [deviceTypeNum],
  );
  const columns = props.columns || [];
  const offsetValue = useMemo(() => {
    const num = 12 / deviceTypeNum;
    const lessCol = props.columns.length % num;

    if (!collapseValue && props.columns.length >= num) {
      return 0;
    }
    if (lessCol === 0) {
      return deviceTypeNum * (num - 1);
    }
    return deviceTypeNum * (num - lessCol - 1);
  }, [deviceTypeNum, props.columns, collapseValue]);
  return (
    <div>
      <Form form={props.form} onSubmit={onSubmit} onReset={onReset} colon labelWidth={'auto'}>
        <div ref={formCurrent} className={`${styles['search-container']} ${collapseValue === true ? styles.open : ''}`}>
          <Row gutter={[10, 10]}>
            {columns.map((item: any, index: number) => (
              <Col
                key='ss'
                {...{ ...colProps, key: index }}
                className={collapseValue === false && deviceTypeNum <= index ? styles['hide-col'] : ''}
              >
                <ProFieldItem fieldProps={item.fieldProps} field={item} />
              </Col>
            ))}
            <Col {...colProps} offset={offsetValue}>
              <FormItem>
                <div className={styles['search-btn']}>
                  <Space align='center'>
                    <Button type='reset' theme='default'>
                      重置
                    </Button>
                    <Button type='submit' theme='primary'>
                      搜索
                    </Button>
                    {showMore && (
                      <Link
                        theme='primary'
                        onClick={() => setCollapseValue(!collapseValue)}
                        hover='color'
                        suffixIcon={collapseValue ? <Icon name='chevron-up' /> : <Icon name='chevron-down' />}
                      >
                        {collapseValue ? '收起' : '展开'}
                      </Link>
                    )}
                  </Space>
                </div>
              </FormItem>
            </Col>
          </Row>
        </div>
      </Form>
    </div>
  );
};
