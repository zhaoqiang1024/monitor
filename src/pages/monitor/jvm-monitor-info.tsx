import React, { useEffect, useRef } from 'react';
import { Line } from '@ant-design/charts';
import { request } from 'umi';
import { Button, Card, Row, Col } from 'antd';
import moment from 'moment';
type params = {
  ip: any;
  pid: any;
};
const JvmMonitor: React.FC<params> = (props: any) => {
  console.log('123123');
  const { ip, pid } = props.location.query;
  const chartsRef = useRef<any>();
  const chartsRef2 = useRef<any>();
  const chartsRef3 = useRef<any>();
  const chartsRef4 = useRef<any>();
  const config = {
    data: [],
    height: 200,
    autoFit: false,
    xField: 'timestamp',
    yField: 'value',
    meta: {
      value: {
        alias: 'gc次数',
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
    meta: {
      value: {
        alias: 'gc次数',
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
  const config3 = {
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
    yAxis: {
      label: {
        formatter: (text: string) => {
          return text + 'MB';
        },
      },
    },
  };
  const config4 = {
    data: [],
    height: 200,
    autoFit: false,
    xField: 'timestamp',
    yField: 'value',
    seriesField: 'type',
    meta: {
      value: {
        alias: '线程数量',
      },
    },
    xAxis: {
      // label: {
      //   rotate: 20,
      // },
      tickLine: {
        length: 5,
      },
      tickCount: 5,
      animate: false,
    },
  };
  const asyncFetch = () => {
    request('http://127.0.0.1:8080/jvm/list', { method: 'get', params: { ip: ip, pid: pid } })
      .then((value) => {
        const heapArray: { type: string; timestamp: any; value: any }[] = [];
        const threadArray: { type: string; timestamp: any; value: any }[] = [];
        const yGC: { timestamp: any; value: any }[] = [];
        const fullGC: { timestamp: any; value: any }[] = [];
        if (value) {
          value.forEach(
            (v: {
              timestamp: any;
              heapUseMemory: any;
              heapMaxMemory: any;
              heapCommitMemory: any;
              threadCount: any;
              peakThreadCount: any;
              tartedThreadCount: any;
              domainThreadCount: any;
              ygcCount: any;
              fullGcCount: any;
            }) => {
              yGC.push({
                timestamp: moment(v.timestamp * 1000).format('YYYY-MM-DD HH:mm:ss'),
                value: v.ygcCount,
              });
              fullGC.push({
                timestamp: moment(v.timestamp * 1000).format('YYYY-MM-DD HH:mm:ss'),
                value: v.fullGcCount,
              });
              heapArray.push({
                type: '已使用',
                timestamp: moment(v.timestamp * 1000).format('YYYY-MM-DD HH:mm:ss'),
                value: v.heapUseMemory,
              });
              heapArray.push({
                type: '已提交',
                timestamp: moment(v.timestamp * 1000).format('YYYY-MM-DD HH:mm:ss'),
                value: v.heapCommitMemory,
              });
              threadArray.push({
                type: '当前活动数量',
                timestamp: moment(v.timestamp * 1000).format('YYYY-MM-DD HH:mm:ss'),
                value: v.threadCount,
              });
              threadArray.push({
                type: '已启动总数',
                timestamp: moment(v.timestamp * 1000).format('YYYY-MM-DD HH:mm:ss'),
                value: v.tartedThreadCount,
              });
              threadArray.push({
                type: '守护线程数',
                timestamp: moment(v.timestamp * 1000).format('YYYY-MM-DD HH:mm:ss'),
                value: v.domainThreadCount,
              });
            },
          );
        }
        chartsRef.current.changeData(yGC);
        chartsRef2.current.changeData(fullGC);
        chartsRef3.current.changeData(heapArray);
        chartsRef4.current.changeData(threadArray);
      })
      .catch(() => {
        return [];
      });
    const newTime = setTimeout(asyncFetch, 1000);
    sessionStorage.setItem('jvmTimerId', newTime + '');
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
          const jvmTimeId = sessionStorage.getItem('jvmTimerId');
          if (jvmTimeId) {
            clearTimeout(parseInt(jvmTimeId));
          }
        }}
      >
        关闭刷新
      </Button>
      <Row gutter={24}>
        <Col span={24}>
          <Card title="YGC">
            <Line {...config} chartRef={chartsRef} />
          </Card>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={24}>
          <Card title="FullGC">
            <Line {...config2} chartRef={chartsRef2} />
          </Card>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={24}>
          <Card title="堆内存">
            <Line {...config3} chartRef={chartsRef3} />
          </Card>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={24}>
          <Card title="线程数量">
            <Line {...config4} chartRef={chartsRef4} />
          </Card>
        </Col>
      </Row>
    </>
  );
};
export default JvmMonitor;
