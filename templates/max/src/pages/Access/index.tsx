import {PageContainer} from '@ant-design/pro-components';
import {Access, useAccess, history} from '@umijs/max';
import {Button, Space} from 'antd';
import {Link} from "umi";

const AccessPage: React.FC = () => {
    const access = useAccess();

    const openPage = () => {
        history.push(`/access1/details/123?type=access`)
    }
    return (
        <PageContainer
            ghost
            header={{
                title: '权限示例',
            }}
        >
            <Space>
                <Access accessible={access.canSeeAdmin}>
                    <Button>只有 Admin 可以看到这个按钮</Button>
                </Access>
                <Button onClick={openPage}>跳转用户详情 </Button>
                <Link to={'/access1/list'}>跳转用户列表</Link>
                <Link to={'/access1/update'}>跳转用户编辑</Link>
            </Space>
        </PageContainer>
    );
};

export default AccessPage;
