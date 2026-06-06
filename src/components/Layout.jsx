import React, { useEffect } from 'react';

export default function Layout({ children, currentTab, setCurrentTab, fontSize, setFontSize }) {
  // 글자 크기에 따라 body 클래스 동적 변경
  useEffect(() => {
    document.body.className = ''; // 기존 클래스 초기화
    if (fontSize === 'large') {
      document.body.classList.add('font-large');
    } else if (fontSize === 'xlarge') {
      document.body.classList.add('font-xlarge');
    }
  }, [fontSize]);

  return (
    <div className="app-container">
      {/* 데스크톱 통합 상단 헤더 */}
      <header className="app-header">
        <div className="header-top">
          {/* 로고 & 타이틀 */}
          <div 
            className="app-title" 
            onClick={() => setCurrentTab('search')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') setCurrentTab('search'); }}
          >
            <span>👵👴</span>
            <span>복지 길잡이</span>
          </div>

          {/* 중앙 가로형 대형 메뉴 네비게이션 */}
          <nav className="header-menu" aria-label="메인 메뉴">
            <button 
              className={`menu-item ${currentTab === 'search' ? 'active' : ''}`}
              onClick={() => setCurrentTab('search')}
              aria-selected={currentTab === 'search'}
            >
              <span className="menu-icon" aria-hidden="true">🔍</span>
              <span>복지 검색</span>
            </button>
            
            <button 
              className={`menu-item ${currentTab === 'recommend' ? 'active' : ''}`}
              onClick={() => setCurrentTab('recommend')}
              aria-selected={currentTab === 'recommend'}
            >
              <span className="menu-icon" aria-hidden="true">📋</span>
              <span>간편 추천</span>
            </button>
            
            <button 
              className={`menu-item ${currentTab === 'chatbot' ? 'active' : ''}`}
              onClick={() => setCurrentTab('chatbot')}
              aria-selected={currentTab === 'chatbot'}
            >
              <span className="menu-icon" aria-hidden="true">💬</span>
              <span>말벗 상담</span>
            </button>
          </nav>
          
          {/* 우측 글자 크기 조절기 */}
          <div className="font-controller" aria-label="글씨 크기 조절">
            <button 
              className={`font-btn ${fontSize === 'normal' ? 'active' : ''}`}
              onClick={() => setFontSize('normal')}
              title="글씨 보통 크기"
            >
              가
            </button>
            <button 
              className={`font-btn ${fontSize === 'large' ? 'active' : ''}`}
              onClick={() => setFontSize('large')}
              title="글씨 크게"
            >
              가+
            </button>
            <button 
              className={`font-btn ${fontSize === 'xlarge' ? 'active' : ''}`}
              onClick={() => setFontSize('xlarge')}
              title="글씨 아주 크게"
            >
              가++
            </button>
          </div>
        </div>
      </header>

      {/* 메인 화면 콘텐츠 */}
      <main className="app-content">
        {children}
      </main>
    </div>
  );
}
