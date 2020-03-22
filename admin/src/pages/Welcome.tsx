import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Typography, Alert } from 'antd';
import styles from './Welcome.less';

const CodePreview: React.FC<{}> = ({ children }) => (
  <pre className={styles.pre}>
    <code>
      <Typography.Text copyable>{children}</Typography.Text>
    </code>
  </pre>
);

export default (): React.ReactNode => (
  <PageHeaderWrapper>
    <Card>
     
      <Typography.Paragraph strong>
        欢迎您，管理员！
      </Typography.Paragraph>
      
      <Typography.Paragraph strong>
        请选择左侧菜单开始您的任务！
      </Typography.Paragraph>
      
    </Card>
    
  </PageHeaderWrapper>
);
