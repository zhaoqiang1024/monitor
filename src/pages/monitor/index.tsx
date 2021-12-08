import React, { useState, useEffect, useRef } from 'react';
import { Line } from '@ant-design/charts';
import { request } from 'umi';
import { Button, Card, Row, Col } from 'antd';
import { ListItem } from '@antv/component';

const Monitor: React.FC = () => {
  const [timer, setTimer] = useState<NodeJS.Timeout>();
  const chartsRef = useRef();
  const chartsRef2 = useRef();
  const chartsRef3 = useRef();
  const chartsRef4 = useRef();
  const [threadCount, setThreadCount] = useState(123);
  const config = {
    data: [],
    height: 400,
    autoFit: false,
    xField: 'timestamp',
    yField: 'ygcCount',
    meta: {
      value: {
        alias: 'gc次数',
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
  const config2 = {
    data: [],
    height: 400,
    autoFit: false,
    xField: 'timestamp',
    yField: 'fullGcCount',
    meta: {
      value: {
        alias: 'gc次数',
      },
    },
    xAxis: {
      // label: {
      //   rotate: 0,
      // },
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
          return `${text}MB`;
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
    request('http://127.0.0.1:8080/jvmMonitor', { method: 'get' }).then((value) => {
      chartsRef.current.changeData(value);
      chartsRef2.current.changeData(value);
      const heapArray: { type: string; timestamp: any; value: any }[] = [];
      const threadArray: { type: string; timestamp: any; value: any }[] = [];
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
          }) => {
            heapArray.push({
              type: 'use',
              timestamp: v.timestamp,
              value: v.heapUseMemory,
            });
            heapArray.push({
              type: 'commit',
              timestamp: v.timestamp,
              value: v.heapCommitMemory,
            });
            threadArray.push({
              type: '当前活动数量',
              timestamp: v.timestamp,
              value: v.threadCount,
            });
            threadArray.push({
              type: '已启动总数',
              timestamp: v.timestamp,
              value: v.tartedThreadCount,
            });
          },
        );
      }
      chartsRef3.current.changeData(heapArray);
      chartsRef4.current.changeData(threadArray);
    });
    const newTime = setTimeout(asyncFetch, 1000);
    setTimer(newTime);
  };
  useEffect(() => {
    asyncFetch();
  }, []);

  // function fn() {
  //   request('http://127.0.0.1:8080/monitor', { method: 'get' }).then((value) => {
  //     console.log('123');
  //   });
  //   setTimeout(fn, 1000);
  // }
  // fn();

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
          clearTimeout(timer);
        }}
      >
        关闭刷新
      </Button>
      <Row gutter={16}>
        <Col span={12}>
          <Card title="YGC">
            <Line {...config} chartRef={chartsRef} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="FullGC">
            <Line {...config2} chartRef={chartsRef2} />
          </Card>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Card title="堆内存">
            <Line {...config3} chartRef={chartsRef3} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="线程数量">
            <Line {...config4} chartRef={chartsRef4} />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Monitor;
