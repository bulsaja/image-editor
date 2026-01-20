import React from 'react';
import { Spin, Empty } from '@douyinfe/semi-ui';
/**
 * data === null means loading state
 * @param {props}
 * @returns
 */
interface ListStatusProps {
  data: any;
  loading?: JSX.Element;
  empty?: JSX.Element;
  error?: JSX.Element;
  children: JSX.Element;
}

export default function ListStatus({ data, loading, empty, error, children }: ListStatusProps): JSX.Element {
  if (!loading) {
    loading = (
      <Spin size="large" tip="loading...">
        {children}
      </Spin>
    );
  }
  if (!empty) {
    empty = <Empty description="No data" />;
  }
  if (!error) {
    error = <Empty description="Loading failed" />;
  }
  if (data === null) {
    return loading;
  }
  if (data && data.length === 0) {
    return empty;
  }
  if (data && data.length > 0) {
    return children;
  }
  return error;
}
