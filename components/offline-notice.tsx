import { BookTwoTone, MessageTwoTone, PlaySquareTwoTone, ProfileTwoTone } from '@ant-design/icons';
import { Card, Col, Row, Typography } from 'antd';
import Link from 'next/link';
import { useContext } from 'react';
import LogTable from './log-table';
import OwncastLogo from './logo';
import NewsFeed from './news-feed';
import { ConfigDetails } from '../types/config-section';
import { ServerStatusContext } from '../utils/server-status-context';

const { Paragraph, Text } = Typography;

const { Title } = Typography;
const { Meta } = Card;

function generateStreamURL(serverURL, rtmpServerPort) {
  return `rtmp://${serverURL.replace(/(^\w+:|^)\/\//, '')}:${rtmpServerPort}/live`;
}

type OfflineProps = {
  logs: any[];
  config: ConfigDetails;
};

export default function Offline({ logs = [], config }: OfflineProps) {
  const serverStatusData = useContext(ServerStatusContext);

  const { serverConfig } = serverStatusData || {};
  const { streamKey, rtmpServerPort } = serverConfig;
  const instanceUrl = global.window?.location.hostname || '';

  let rtmpURL;
  if (instanceUrl && rtmpServerPort) {
    rtmpURL = generateStreamURL(instanceUrl, rtmpServerPort);
  }

  const data = [
    {
      icon: <BookTwoTone twoToneColor="#6f42c1" />,
      title: 'Use your broadcasting software',
      content: (
        <div>
          <a
            href="https://owncast.online/docs/broadcasting/?source=admin"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn how to point your existing software to your new server and start streaming your
            content.
          </a>
          <div className="stream-info-container">
            <Text strong className="stream-info-label">
              Streaming URL:
            </Text>
            {rtmpURL && (
              <Paragraph className="stream-info-box" copyable>
                {rtmpURL}
              </Paragraph>
            )}
            <Text strong className="stream-info-label">
              Stream Key:
            </Text>
            <Paragraph className="stream-info-box" copyable={{ text: streamKey }}>
              *********************
            </Paragraph>
          </div>
        </div>
      ),
    },
    {
      icon: <PlaySquareTwoTone twoToneColor="#f9826c" />,
      title: 'Embed your video onto other sites',
      content: (
        <div>
          <a
            href="https://owncast.online/docs/embed?source=admin"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn how you can add your Owncast stream to other sites you control.
          </a>
        </div>
      ),
    },
  ];

  if (!config?.chatDisabled) {
    data.push({
      icon: <MessageTwoTone twoToneColor="#0366d6" />,
      title: 'Chat is disabled',
      content: <span>Chat will continue to be disabled until you begin a live stream.</span>,
    });
  }

  if (!config?.yp?.enabled) {
    data.push({
      icon: <ProfileTwoTone twoToneColor="#D18BFE" />,
      title: 'Find an audience on the Owncast Directory',
      content: (
        <div>
          List yourself in the Owncast Directory and show off your stream. Enable it in{' '}
          <Link href="/config-public-details">settings.</Link>
        </div>
      ),
    });
  }

  if (!config?.federation?.enabled) {
    data.push({
      icon: <img alt="fediverse" width="20px" src="fediverse-white.png" />,
      title: 'Add your Owncast instance to the Fediverse',
      content: (
        <div>
          <Link href="/config-federation">Enable Owncast social</Link> features to have your
          instance join the Fediverse, allowing people to follow, share and engage with your live
          stream.
        </div>
      ),
    });
  }

  return (
    <>
      <Row>
        <Col span={12} offset={6}>
          <div className="offline-intro">
            <span className="logo">
              <OwncastLogo />
            </span>
            <div>
              <Title level={2}>No stream is active</Title>
              <p>You should start one.</p>
            </div>
          </div>
        </Col>
      </Row>
      <Row gutter={[16, 16]} className="offline-content">
        <Col span={12} xs={24} sm={24} md={24} lg={12} className="list-section">
          {data.map(item => (
            <Card key={item.title} size="small" bordered={false}>
              <Meta avatar={item.icon} title={item.title} description={item.content} />
            </Card>
          ))}
        </Col>
        <Col span={12} xs={24} sm={24} md={24} lg={12}>
          <NewsFeed />
        </Col>
      </Row>
      <LogTable logs={logs} originalPageSize={5} />
    </>
  );
}
