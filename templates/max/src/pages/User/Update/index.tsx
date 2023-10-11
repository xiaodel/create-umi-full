import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';

const HomePage: React.FC = () => {
    const { data } = useModel('global');
    return (
        <PageContainer ghost>
            <div>
                Update
            </div>
        </PageContainer>
    );
};

export default HomePage;
