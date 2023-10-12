import React from 'react';

export * from "@ant-design/pro-components";
import {ProTable as AntdProTable} from "@ant-design/pro-components";
import type {ProTableProps} from "@ant-design/pro-components";
import * as apis from "@/services";

export type TableProps<DataSource, U, ValueType> = {
    api?: string;
} & ProTableProps<DataSource, U, ValueType>

/**
 * description: ProTable封装网络请求
 * author:
 * create_date:
 */

export const ProTable = (props: TableProps<any,any,any>) => {
    return (
        <AntdProTable
            request={async (params, sorter, filter) => {
                // @ts-ignore
                const {data, success} = await apis[props.api]({
                    ...params,
                    // FIXME: remove @ts-ignore
                    // @ts-ignore
                    sorter,
                    filter,
                });
                return {
                    data: data?.list || [],
                    success,
                };
            }}
            {...props}
        />
    )
}
