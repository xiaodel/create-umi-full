import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import styles from './index.less';

const HomePage: React.FC = () => {
  const { data } = useModel('global');
  return (
    <PageContainer ghost>
      <div className={styles.container}>
          {data?.name}
      </div>
    </PageContainer>
  );
};

export default HomePage;
