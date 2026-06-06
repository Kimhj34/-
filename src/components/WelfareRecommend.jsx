import React, { useState, useMemo } from 'react';
import welfareData from '../data/welfareData.json';

export default function WelfareRecommend() {
  // 입력 폼 상태 관리
  const [age, setAge] = useState(65); // 노인 연령 기준인 65세를 기본값으로 설정
  const [region, setRegion] = useState('전국'); // '전국', '서울', '경기'
  const [careGrade, setCareGrade] = useState('no'); // 'yes' (있음), 'no' (없음), 'unknown' (잘 모름)
  
  const [activeCardId, setActiveCardId] = useState(null);

  // 나이 조절 함수
  const adjustAge = (amount) => {
    setAge((prev) => {
      const nextAge = prev + amount;
      if (nextAge < 0) return 0;
      if (nextAge > 120) return 120;
      return nextAge;
    });
    setActiveCardId(null);
  };

  // 장기요양등급 변경 핸들러
  const handleCareGradeChange = (val) => {
    setCareGrade(val);
    setActiveCardId(null);
  };

  // 추천 결과 필터링 및 정렬 로직
  const recommendedWelfareList = useMemo(() => {
    const listWithScore = welfareData.map((item) => {
      let score = 0;
      let isEligible = true;

      // 1. 나이 검사
      if (age < item.minAge) {
        isEligible = false;
      } else {
        // 나이 조건에 가까울수록 (혹은 나이가 맞을 때 고령자 특화 혜택은 가중치)
        if (item.minAge >= 60) {
          score += 2;
        }
      }

      // 2. 지역 검사
      if (item.region !== '전국' && item.region !== region) {
        isEligible = false;
      } else if (item.region === region && region !== '전국') {
        score += 3; // 지역 전용 혜택은 가중치 부여
      }

      // 3. 장기요양등급 검사
      if (careGrade === 'yes') {
        if (item.requiresCareGrade === 'yes') {
          score += 5; // 등급 보유자 전용 서비스에 높은 우선순위
        } else if (item.requiresCareGrade === 'no') {
          // 장기요양등급 보유자가 일반 돌봄 서비스를 신청하지 못할 수도 있으나, 여기서는 보통 매칭으로 유지
          score += 1;
        } else {
          score += 2;
        }
      } else if (careGrade === 'no') {
        if (item.requiresCareGrade === 'yes') {
          isEligible = false; // 등급이 필요한데 없으면 신청 불가
        } else {
          score += 2;
        }
      } else {
        // 잘 모름 (unknown)
        if (item.requiresCareGrade === 'yes') {
          score += 1; // 등급 필요 혜택도 일단 보여주되 낮은 가중치
        } else {
          score += 2;
        }
      }

      return {
        ...item,
        score,
        isEligible
      };
    });

    // 신청 조건에 맞는 항목만 골라내고 점수가 높은 순으로 정렬
    return listWithScore
      .filter((item) => item.isEligible)
      .sort((a, b) => b.score - a.score);
  }, [age, region, careGrade]);

  // 카드 클릭 시 아코디언 토글
  const toggleCard = (id) => {
    setActiveCardId((prevId) => (prevId === id ? null : id));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* 안내 문구 */}
      <div>
        <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold', marginBottom: '8px' }}>
          간편 맞춤 추천 받기
        </h2>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
          아래의 정보를 입력하시면 받을 수 있는 혜택이 실시간으로 추천됩니다.
        </p>
      </div>

      {/* 데스크톱용 2열 구성 레이아웃 (폼 & 결과 정렬) */}
      <div className="recommend-layout">
        
        {/* 좌측: 정보 입력 폼 */}
        <div className="recommend-form">
          
          {/* 1. 나이 입력 */}
          <div className="form-group">
            <span className="form-label">1. 연세가 어떻게 되시나요?</span>
            <div className="age-controller">
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="age-btn" onClick={() => adjustAge(-10)} aria-label="10살 빼기">-10</button>
                <button className="age-btn" onClick={() => adjustAge(-1)} aria-label="1살 빼기">-1</button>
              </div>
              
              <div className="age-display">
                만 <span style={{ color: 'var(--primary)', fontSize: '1.2em' }}>{age}</span> 세
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="age-btn" onClick={() => adjustAge(1)} aria-label="1살 더하기">+1</button>
                <button className="age-btn" onClick={() => adjustAge(10)} aria-label="10살 더하기">+10</button>
              </div>
            </div>
          </div>

          {/* 2. 거주 지역 선택 */}
          <div className="form-group">
            <span className="form-label">2. 사시는 지역은 어디인가요?</span>
            <div className="grid-select">
              <button 
                className={`grid-select-btn ${region === '서울' ? 'active' : ''}`}
                onClick={() => setRegion('서울')}
              >
                서울특별시
              </button>
              <button 
                className={`grid-select-btn ${region === '경기' ? 'active' : ''}`}
                onClick={() => setRegion('경기')}
              >
                경기도
              </button>
              <button 
                className={`grid-select-btn ${region === '전국' ? 'active' : ''}`}
                onClick={() => setRegion('전국')}
              >
                그 외 지역
              </button>
            </div>
          </div>

          {/* 3. 장기요양등급 여부 */}
          <div className="form-group">
            <span className="form-label">3. 노인장기요양등급이 있으신가요?</span>
            <div className="option-cards">
              <div 
                className={`option-card ${careGrade === 'yes' ? 'active' : ''}`}
                onClick={() => handleCareGradeChange('yes')}
              >
                <span>네, 등급이 있습니다.</span>
                <div className="option-radio">
                  <div className="option-radio-dot"></div>
                </div>
              </div>
              
              <div 
                className={`option-card ${careGrade === 'no' ? 'active' : ''}`}
                onClick={() => handleCareGradeChange('no')}
              >
                <span>아니요, 없습니다.</span>
                <div className="option-radio">
                  <div className="option-radio-dot"></div>
                </div>
              </div>

              <div 
                className={`option-card ${careGrade === 'unknown' ? 'active' : ''}`}
                onClick={() => handleCareGradeChange('unknown')}
              >
                <span>잘 모르겠습니다.</span>
                <div className="option-radio">
                  <div className="option-radio-dot"></div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* 우측: 추천 결과 영역 */}
        <div>
          <div className="recommend-result-header">
            🎯 나에게 딱 맞는 복지 ({recommendedWelfareList.length}건)
          </div>
          
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            받으실 가능성이 높은 순서대로 복지 제도를 보여드려요.
          </p>

          {recommendedWelfareList.length > 0 ? (
            <div className="welfare-grid">
              {recommendedWelfareList.map((item, index) => {
                const isOpen = activeCardId === item.id;
                
                // 점수에 따른 매칭 배지 정보 구성
                let matchLabel = '추천';
                let matchColor = 'var(--text-secondary)';
                let matchBg = '#E2E8F0';

                if (item.score >= 5) {
                  matchLabel = '⭐ 아주 높음';
                  matchColor = '#FFFFFF';
                  matchBg = 'var(--secondary)';
                } else if (item.score >= 3) {
                  matchLabel = '👍 높음';
                  matchColor = '#FFFFFF';
                  matchBg = 'var(--primary)';
                } else {
                  matchLabel = '😊 보통';
                  matchColor = 'var(--text-primary)';
                  matchBg = '#E2E8F0';
                }

                return (
                  <div 
                    key={item.id} 
                    className={`welfare-card ${isOpen ? 'active' : ''}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => toggleCard(item.id)}
                  >
                    {/* 카드 상단 */}
                    <div className="card-header">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span 
                            style={{ 
                              fontSize: '12px', 
                              fontWeight: 'bold', 
                              padding: '4px 8px', 
                              borderRadius: '4px',
                              color: matchColor,
                              backgroundColor: matchBg,
                            }}
                          >
                            {matchLabel}
                          </span>
                          {item.region !== '전국' && (
                            <span style={{ fontSize: '12px', fontWeight: 'bold', padding: '4px 8px', borderRadius: '4px', color: '#000', backgroundColor: '#FEF3C7' }}>
                              📍 {item.region} 전용
                            </span>
                          )}
                        </div>
                        <span className="card-title">{item.name}</span>
                      </div>
                      <button 
                        className="card-toggle-btn"
                        aria-expanded={isOpen}
                        aria-label={`${item.name} 상세 정보 ${isOpen ? '접기' : '더보기'}`}
                      >
                        {isOpen ? '▲' : '▼'}
                      </button>
                    </div>

                    {/* 카드 펼침 상세 */}
                    {isOpen && (
                      <div className="card-detail" onClick={(e) => e.stopPropagation()}>
                        {item.requiresCareGrade === 'yes' && careGrade === 'unknown' && (
                          <div style={{ padding: '10px 14px', backgroundColor: '#FEF3C7', borderLeft: '4px solid #F59E0B', borderRadius: '4px', fontSize: 'var(--text-sm)', color: '#92400E', fontWeight: 'bold', marginBottom: '8px' }}>
                            ⚠️ 이 제도를 받으시려면 '노인장기요양등급'이 꼭 있어야 합니다.
                          </div>
                        )}
                        
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

                    {/* 안내 액션바 */}
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
              <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>👵👴</span>
              현재 입력하신 연세와 조건에 맞는<br/>
              추천 혜택이 발견되지 않았습니다.<br/>
              (조건을 조정해 보세요)
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
