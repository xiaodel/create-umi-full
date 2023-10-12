# @umijs/create-umi-full

## 本脚手架基于[@umijs/create-umi](https://umijs.org)

### 创建项目： npx create-umi-full@latest

主要库版本如下：

```json
{
  "@ant-design/icons": "^5.0.1",
  "@ant-design/pro-components": "^2.4.4",
  "@umijs/max": "^4.0.83",
  "@umijs/utils": "^4.0.83",
  "antd": "^5.4.0"
}
```

### 主要增加、调整以下内容

- 添加路由示例代码
- 添加request配置示例代码
- 添加getInitialState示例代码
- 添加登录页面示例代码
- services/*示例代码调整
- ProTable封装
- Modal支持拖拽

  


##### DEMO 示例

```javascript jsx
// ProTable封装 
// 使用components/ProComponents 导出 ProTable传入services下的api 名称自动实现接口请求，不再需要传入request。如：

pages/Table/index.tsx

import {ActionType,FooterToolbar,PageContainer,ProDescriptions,ProTable} from '@/components/ProComponents';

<ProTable
headerTitle="查询表格"
actionRef={actionRef}
rowKey="id"
search={{
    labelWidth: 120,
}}
toolBarRender={() => [
    <Button
        key="1"
        type="primary"
        onClick={() => handleModalVisible(true)}
    >
        新建
    </Button>,
]}
//不再需要传入request
api='queryUserList'
columns={columns}
rowSelection={{
    onChange: (_, selectedRows) => setSelectedRows(selectedRows),
}}
/>

```

```javascript jsx
// Modal支持拖拽

import {PageContainer} from '@ant-design/pro-components';
import {Modal, Button,Space} from '@/components/Antd'

const HomePage: React.FC = () => {

  const onFinish = () => {
    return new Promise(resolve => {
      setTimeout(() => {
        // true关闭弹窗，false不关闭
        resolve(true);
      }, 2000)
    })
  }

  return (
          <PageContainer title='Home'>
            <Space>
              // 在 Modal 的基础上增加了 trigger ，无需维护 open 状态
              <Modal title='可以拖拽的模态框' trigger={<Button>可以拖拽的模态框</Button>} onFinish={onFinish}>
                <div>在 Modal 的基础上增加了 trigger ，无需维护 open 状态</div>
              </Modal>
            </Space>
          </PageContainer>
  );
};

export default HomePage;

```

### 联系方式
QQ：1580043700
