import React, { useState } from 'react';
import styled from 'styled-components';
import Summary from '../components/Summary';
import Statistics from '../components/Statistics';
import Analysis from '../components/Analysis';
import Settings from '../components/Settings';
import CryptoChart from '../components/CryptoChart';

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 20px;
`;

const Price = styled.h1`
  font-size: 32px;
  margin: 0;
  color: black;
`;

const Change = styled.span`
  color: ${(props) => (props.isPositive ? '#4caf50' : '#f44336')};
  font-size: 18px;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
`;

const Tab = styled.button`
  padding: 10px 15px;
  border: none;
  background-color: transparent;
  cursor: pointer;
  font-size: 16px;
  color: ${(props) => (props.active === true ? '#4B40EE' : '#5f6368')};
  border-bottom: ${(props) =>
    props.active === true ? '2px solid #4B40EE' : 'none'};
  border-radius: 0;
  outline: none !important;
`;

const CryptoDashboard = () => {
  const [price, setPrice] = useState(63179.71);
  const [change, setChange] = useState(2161.42);
  const [changePercentage, setChangePercentage] = useState(3.54);
  const [activeTab, setActiveTab] = useState('chart');

  const renderSection = () => {
    switch (activeTab) {
      case 'summary':
        return <Summary />;
      case 'chart':
        return <CryptoChart />;
      case 'statistics':
        return <Statistics />;
      case 'analysis':
        return <Analysis />;
      case 'settings':
        return <Settings />;
      default:
        return null;
    }
  };

  return (
    <Container>
      <Header>
        <Price>${price.toFixed(2)} USD</Price>
        <Change isPositive={change > 0}>
          {change > 0 ? '+' : ''}
          {change.toFixed(2)} ({changePercentage.toFixed(2)}%)
        </Change>
      </Header>
      <TabContainer>
        <Tab
          active={activeTab === 'summary'}
          onClick={() => setActiveTab('summary')}
        >
          Summary
        </Tab>
        <Tab
          active={activeTab === 'chart'}
          onClick={() => setActiveTab('chart')}
        >
          Chart
        </Tab>
        <Tab
          active={activeTab === 'statistics'}
          onClick={() => setActiveTab('statistics')}
        >
          Statistics
        </Tab>
        <Tab
          active={activeTab === 'analysis'}
          onClick={() => setActiveTab('analysis')}
        >
          Analysis
        </Tab>
        <Tab
          active={activeTab === 'settings'}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </Tab>
      </TabContainer>
      {renderSection()}
    </Container>
  );
};

export default CryptoDashboard;
