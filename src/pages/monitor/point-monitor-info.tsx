import React, { useEffect, useRef } from 'react';
import { Line } from '@ant-design/charts';
import { request } from 'umi';
import { Button, Card, Row, Col } from 'antd';
import moment from 'moment';

type PointMonitorResult = {
  timestamp: any;
  requestCount: any;
  tp50: any;
  tp75: any;
  tp90: any;
  tp99: any;
  tp999: any;
};

type PointMonitorView = {
  type?: string;
  value: number;
  timestamp: string;
};

const PointMonitor: React.FC = (props: any) => {
  const { appName, point } = props.location.query;
  const chartsRef = useRef<any>();
  const chartsRef2 = useRef<any>();
  const config = {
    data: [],
    height: 200,
    autoFit: false,
    xField: 'timestamp',
    yField: 'value',
    meta: {
      value: {
        alias: '请求次数',
      },
    },
    xAxis: {
      tickLine: {
        length: 5,
      },
      tickCount: 5,
      animate: false,
    },
  };
  const config2 = {
    data: [],
    height: 200,
    autoFit: false,
    xField: 'timestamp',
    yField: 'value',
    seriesField: 'type',
    xAxis: {
      tickLine: {
        length: 5,
      },
      tickCount: 5,
      animate: false,
    },
  };
  const asyncFetch = () => {
    request('http://127.0.0.1:8080/monitor/point/info', {
      method: 'get',
      params: { point: point, appName: appName },
    })
      .then((value: PointMonitorResult) => {
        if (value) {
          //原始请求量数据
          const countArray: PointMonitorView[] = chartsRef.current.getChart().chart.options.data;
          //原始TP数据
          const tpArray: PointMonitorView[] = chartsRef2.current.getChart().chart.options.data;
          if (countArray.length > 0 && value.timestamp === countArray[0].timestamp) {
            return;
          }
          //新请求量数据
          const newCountArray: PointMonitorView[] = [];
          //请tp数据
          const newTpArray: PointMonitorView[] = [];
          //大于等于60把第一条数据截取掉
          if (countArray.length === 60) {
            countArray.slice(1).forEach((v) => {
              newCountArray.push(v);
            });
          } else {
            countArray.forEach((v) => {
              newCountArray.push(v);
            });
          }
          //大于等于300把前5条数据截取掉
          if (tpArray.length === 300) {
            tpArray.slice(5).forEach((v) => {
              newTpArray.push(v);
            });
          } else {
            tpArray.forEach((v) => {
              newTpArray.push(v);
            });
          }
          newCountArray.push({
            timestamp: moment(value.timestamp).format('YYYY-MM-DD HH:mm'),
            value: value.requestCount,
          });
          newTpArray.push({
            type: 'TP50',
            timestamp: moment(value.timestamp).format('YYYY-MM-DD HH:mm'),
            value: value.tp50,
          });
          newTpArray.push({
            type: 'TP75',
            timestamp: moment(value.timestamp).format('YYYY-MM-DD HH:mm'),
            value: value.tp75,
          });
          newTpArray.push({
            type: 'TP90',
            timestamp: moment(value.timestamp).format('YYYY-MM-DD HH:mm'),
            value: value.tp90,
          });
          newTpArray.push({
            type: 'TP99',
            timestamp: moment(value.timestamp).format('YYYY-MM-DD HH:mm'),
            value: value.tp99,
          });
          newTpArray.push({
            type: 'TP999',
            timestamp: moment(value.timestamp).format('YYYY-MM-DD HH:mm'),
            value: value.tp999,
          });
          chartsRef.current.getChart().changeData(newCountArray);
          chartsRef2.current.getChart().changeData(newTpArray);
        }
      })
      .catch(() => {
        console.log('错误');
        return null;
      });
    const newTime = setTimeout(asyncFetch, 10000);
    sessionStorage.setItem('pointTimeId', newTime + '');
  };
  useEffect(() => {
    asyncFetch();
  }, []);
  return (
    <>
      <Button
        onClick={() => {
          asyncFetch();
        }}
      >
        开始刷新
      </Button>
      <Button
        onClick={() => {
          const pointTimeId = sessionStorage.getItem('pointTimeId');
          if (pointTimeId) {
            clearTimeout(parseInt(pointTimeId));
          }
        }}
      >
        关闭刷新
      </Button>
      <Row gutter={24}>
        <Col span={24}>
          <Card title="请求统计">
            <Line {...config} ref={chartsRef} />
          </Card>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={24}>
          <Card title="响应时长">
            <Line {...config2} ref={chartsRef2} />
          </Card>
        </Col>
      </Row>
    </>
  );
};
export default PointMonitor;
