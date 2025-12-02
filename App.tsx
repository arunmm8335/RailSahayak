import React, { useState } from 'react';
import Layout from './components/Layout';
import Home from './components/Home';
import Services from './components/Services';
import StationIntel from './components/StationIntel';
import FoodDelivery from './components/FoodDelivery';
import GeminiAssistant from './components/GeminiAssistant';
import { Tab } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.HOME);

  const renderContent = () => {
    switch (activeTab) {
      case Tab.HOME:
        return <Home onChangeTab={setActiveTab} />;
      case Tab.SERVICES:
        return <Services />;
      case Tab.COMMUNITY:
        return <StationIntel />;
      case Tab.FOOD:
        return <FoodDelivery />;
      case Tab.AI_HELP:
        return <GeminiAssistant />;
      default:
        return <Home onChangeTab={setActiveTab} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default App;