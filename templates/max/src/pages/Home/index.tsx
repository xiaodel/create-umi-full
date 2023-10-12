import {PageContainer} from '@ant-design/pro-components';
import {useModel} from '@umijs/max';
import {Modal, Button,Space} from '@/components/Antd'

const HomePage: React.FC = () => {
    const {data} = useModel('global');

    const onFinish = () => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(false);
            }, 2000)
        })
    }
    const click = () => {
        Modal.confirm({
            title: 'Confirm',
            content: 'Bla bla ...',
        });
    }

    return (
        <PageContainer title='Home'>
            <Space>
                <Modal title='可以拖拽的模态框' trigger={<Button>可以拖拽的模态框</Button>} onFinish={onFinish}>
                    {data?.name}
                </Modal>
                <Button onClick={click}>confirm</Button>
            </Space>
        </PageContainer>
    );
};

export default HomePage;
