import React, { useState } from 'react';
import Layout from './components/Layout';
import WelfareSearch from './components/WelfareSearch';
import WelfareRecommend from './components/WelfareRecommend';
import WelfareChatbot from './components/WelfareChatbot';
import './App.css';

function App() {
  // 기본 상태 설정 (노인 대상이므로 기본 폰트 크기를 'large'(크게)로 설정하여 시작)
  const [currentTab, setCurrentTab] = useState('search'); 
  const [fontSize, setFontSize] = useState('large'); 
  const [searchQuery, setSearchQuery] = useState('');

  // 챗봇 내 복지 혜택 카드에서 '자세히 보기' 클릭 시 작동하는 내비게이션 콜백
  const handleNavigateToSearch = (welfareName) => {
    setSearchQuery(welfareName);
    setCurrentTab('search');
  };

  return (
    <Layout
      currentTab={currentTab}
      setCurrentTab={setCurrentTab}
      fontSize={fontSize}
      setFontSize={setFontSize}
    >
      {/* 1. 복지 검색 탭 */}
      {currentTab === 'search' && (
        <WelfareSearch 
          key={searchQuery} // searchQuery 변경 시 컴포넌트를 완전히 새로 렌더링하여 검색 필드 업데이트
          defaultSearchQuery={searchQuery} 
        />
      )}
      
      {/* 2. 간편 맞춤 추천 탭 */}
      {currentTab === 'recommend' && (
        <WelfareRecommend />
      )}
      
      {/* 3. 말벗 상담 챗봇 탭 */}
      {currentTab === 'chatbot' && (
        <WelfareChatbot onNavigateToSearch={handleNavigateToSearch} />
      )}
    </Layout>
  );
}

export default App;
