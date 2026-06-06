import React, { useState, useMemo } from 'react';
import welfareData from '../data/welfareData.json';

export default function WelfareSearch({ defaultSearchQuery = '' }) {
  const [searchQuery, setSearchQuery] = useState(defaultSearchQuery);
  const [activeCardId, setActiveCardId] = useState(null); // 한 번에 하나의 카드만 열 수 있도록 아코디언 구조화

  // 입력값 변경 핸들러
  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // 퀵 태그 버튼 클릭
  const handleTagClick = (tag) => {
    setSearchQuery(tag);
    setActiveCardId(null); // 태그 변경 시 열려 있는 아코디언 닫기
  };

  // 검색 결과 필터링 로직
  const filteredWelfareList = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return welfareData; // 검색어가 없으면 전체 목록 표시 (둘러보기 편하게 지원)
    }

    return welfareData.filter((item) => {
      // 제목, 지원대상, 핵심 키워드 매칭
      return (
        item.name.toLowerCase().includes(query) ||
        item.target.toLowerCase().includes(query) ||
        item.conditions.toLowerCase().includes(query) ||
        item.keywords.some((keyword) => query.includes(keyword) || keyword.includes(query))
      );
    });
  }, [searchQuery]);

  // 카드 클릭 시 아코디언 토글
  const toggleCard = (id) => {
    setActiveCardId((prevId) => (prevId === id ? null : id));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* 안내 타이틀 */}
      <div>
        <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold', marginBottom: '8px' }}>
          궁금한 복지 제도를 찾아보세요
        </h2>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
          글씨를 직접 입력하시거나, 아래의 자주 찾는 단어들을 눌러보세요.
        </p>
      </div>

      {/* 대형 검색창 영역 */}
      <div className="search-section">
        <input
          type="text"
          className="input-large"
          placeholder="예: 수술비, 생활비, 돌봄, 틀니"
          value={searchQuery}
          onChange={handleInputChange}
          aria-label="복지 검색어 입력창"
        />
        {searchQuery && (
          <button 
            className="btn-large btn-outline" 
            onClick={() => { setSearchQuery(''); setActiveCardId(null); }}
            style={{ minWidth: '70px', padding: '0 12px' }}
          >
            지우기
          </button>
        )}
      </div>

      {/* 퀵 추천 태그 버튼 모음 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', color: 'var(--secondary)' }}>
          💡 누르면 바로 검색돼요:
        </span>
        <div className="tag-container">
          <button className="tag-btn" onClick={() => handleTagClick('다리 수술비')}>🦵 다리 수술비</button>
          <button className="tag-btn" onClick={() => handleTagClick('긴급생활비')}>💰 긴급 생활비</button>
          <button className="tag-btn" onClick={() => handleTagClick('돌봄')}>🏠 노인 돌봄</button>
          <button className="tag-btn" onClick={() => handleTagClick('틀니')}>🦷 틀니 지원</button>
          <button className="tag-btn" onClick={() => handleTagClick('일자리')}>👷 노인 일자리</button>
        </div>
      </div>

      {/* 검색 결과 리스트 */}
      <div style={{ marginTop: '10px' }}>
        <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', marginBottom: '12px' }}>
          검색 결과 ({filteredWelfareList.length}건)
        </h3>

        {filteredWelfareList.length > 0 ? (
          <div className="welfare-grid">
            {filteredWelfareList.map((item) => {
              const isOpen = activeCardId === item.id;
              return (
                <div 
                  key={item.id} 
                  className={`welfare-card ${isOpen ? 'active' : ''}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => toggleCard(item.id)}
                >
                  {/* 카드 상단 헤더 */}
                  <div className="card-header">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                      <span className="card-title">{item.name}</span>
                      {!isOpen && (
                        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>
                          대상: {item.target}
                        </span>
                      )}
                    </div>
                    <button 
                      className="card-toggle-btn" 
                      aria-expanded={isOpen}
                      aria-label={`${item.name} 상세 정보 ${isOpen ? '접기' : '더보기'}`}
                    >
                      {isOpen ? '▲' : '▼'}
                    </button>
                  </div>

                  {/* 카드 하단 상세내용 (아코디언 형태) */}
                  {isOpen && (
                    <div className="card-detail" onClick={(e) => e.stopPropagation()}>
                      <div className="detail-section">
                        <span className="detail-label">🎯 지원 대상</span>
                        <span className="detail-value">{item.target}</span>
                      </div>

                      <div className="detail-section">
                        <span className="detail-label">📝 신청 조건</span>
                        <span className="detail-value">{item.conditions}</span>
                      </div>

                      <div className="detail-section">
                        <span className="detail-label">📂 필요한 서류</span>
                        <span className="detail-value">{item.documents}</span>
                      </div>

                      <div className="detail-section">
                        <span className="detail-label">🙋 신청 방법</span>
                        <span className="detail-value">{item.method}</span>
                      </div>

                      <div className="detail-section">
                        <span className="detail-label">📞 문의 기관</span>
                        <span className="detail-value" style={{ fontWeight: 'bold', color: 'var(--primary)' }}>
                          {item.agency}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* 탭 안내 액션바 (접혀있을 때만 노출) */}
                  {!isOpen && (
                    <div style={{ marginTop: '12px', textAlign: 'right', fontSize: 'var(--text-xs)', color: 'var(--primary)', fontWeight: 'bold' }}>
                      누르면 상세 내용이 열립니다 👉
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px 20px', 
            border: '3px dashed var(--border-color)', 
            borderRadius: 'var(--radius-md)',
            backgroundColor: '#FFFFFF',
            fontSize: 'var(--text-md)',
            color: 'var(--text-secondary)'
          }}>
            <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>🧐</span>
            찾으시는 복지 제도가 없습니다.<br/>
            다른 글씨로 다시 검색해 보세요.
          </div>
        )}
      </div>

    </div>
  );
}
