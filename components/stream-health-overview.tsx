import { CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Alert, Button, Col, Row, Statistic, Typography } from 'antd';
import Link from 'next/link';
import React, { useContext } from 'react';
import { ServerStatusContext } from '../utils/server-status-context';

interface StreamHealthOverviewProps {
  showTroubleshootButton?: Boolean;
}
export default function StreamHealthOverview({
  showTroubleshootButton,
}: StreamHealthOverviewProps) {
  const serverStatusData = useContext(ServerStatusContext);
  const { health } = serverStatusData;
  if (!health) {
    return null;
  }

  const { healthy, healthPercentage, message, representation } = health;
  let color = '#3f8600';
  let icon: 'success' | 'info' | 'warning' | 'error' = 'info';
  if (healthPercentage < 80) {
    color = '#cf000f';
    icon = 'error';
  } else if (healthPercentage < 30) {
    color = '#f0ad4e';
    icon = 'error';
  }

  return (
    <div>
      <Row gutter={8}>
        <Col span={12}>
          <Statistic
            title="Healthy Stream"
            value={healthy ? 'Yes' : 'No'}
            valueStyle={{ color }}
            prefix={healthy ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="Playback Health"
            value={healthPercentage}
            valueStyle={{ color }}
            suffix="%"
          />
        </Col>
      </Row>
      <Row style={{ display: representation < 100 && representation !== 0 ? 'grid' : 'none' }}>
        <Typography.Text
          type="secondary"
          style={{ textAlign: 'center', fontSize: '0.7em', opacity: '0.3' }}
        >
          Stream health represents {representation}% of all known players. Other player status is
          unknown.
        </Typography.Text>
      </Row>
      <Row
        gutter={16}
        style={{ width: '100%', display: message ? 'grid' : 'none', marginTop: '10px' }}
      >
        <Col span={24}>
          <Alert
            message={message}
            type={icon}
            showIcon
            action={
              showTroubleshootButton && (
                <Link passHref href="/stream-health">
                  <Button size="small" type="text" style={{ color: 'black' }}>
                    TROUBLESHOOT
                  </Button>
                </Link>
              )
            }
          />
        </Col>
      </Row>
    </div>
  );
}

StreamHealthOverview.defaultProps = {
  showTroubleshootButton: true,
};
