import React, { useState, useEffect, useRef } from 'react';
import welfareData from '../data/welfareData.json';

export default function WelfareChatbot({ onNavigateToSearch }) {
  // 대화 기록 초기화
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: '안녕하세요! 복지 길잡이 말벗 챗봇입니다. 😊\n\n몸이 편치 않으시거나, 혼자 지내기 외로우시거나, 생활비 지원이 필요하신가요? 아래 버튼을 누르시거나 궁금한 내용을 편하게 적어주세요.',
      isWelcome: true
    }
  ]);
  const [inputText, setInputText] = useState('');
  const chatHistoryRef = useRef(null);

  // 메시지 추가 시 자동 스크롤
  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [messages]);

  // 키워드 분석 및 매칭 함수
  const analyzeMessage = (text) => {
    const textLower = text.toLowerCase();
    const matchedServices = [];

    welfareData.forEach((item) => {
      // 키워드 배열 검사
      const hasKeyword = item.keywords.some((kw) => 
        textLower.includes(kw.toLowerCase())
      );
      
      // 제도명 또는 지원대상 텍스트 검사
      const nameMatch = item.name.includes(textLower);
      
      if (hasKeyword || nameMatch) {
        matchedServices.push(item);
      }
    });

    return matchedServices;
  };

  // 메시지 전송 로직
  const handleSendMessage = (textToSend) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    // 1. 유저 메시지 추가
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // 2. 챗봇 대답 생성 (딜레이 효과 추가)
    setTimeout(() => {
      const matches = analyzeMessage(query);
      let botResponse = {};

      if (matches.length > 0) {
        botResponse = {
          id: Date.now() + 1,
          sender: 'bot',
          text: `도움이 되실 만한 복지 제도 ${matches.length}개를 찾았습니다! 아래 카드를 누르시면 자세한 신청 방법을 알려드려요.`,
          recommendations: matches.map((m) => ({
            id: m.id,
            name: m.name,
            target: m.target
          }))
        };
      } else {
        botResponse = {
          id: Date.now() + 1,
          sender: 'bot',
          text: '죄송해요. 말씀하신 내용에 딱 맞는 혜택을 찾지 못했어요. 😢\n\n혹시 "수술비", "생활비", "돌봄", "틀니", "일자리" 같은 쉬운 단어를 넣어서 다시 물어봐 주시겠어요?'
        };
      }

      setMessages((prev) => [...prev, botResponse]);
    }, 600);
  };

  // 퀵 버튼 클릭 핸들러
  const handleQuickButtonClick = (text) => {
    handleSendMessage(text);
  };

  // 엔터 키 입력 핸들러
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="chatbot-container">
      
      {/* 챗봇 메시지 내역 */}
      <div className="chat-history" ref={chatHistoryRef}>
        {messages.map((msg) => (
          <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {/* 보낸이 구분 라벨 */}
            <span 
              style={{ 
                fontSize: 'var(--text-xs)', 
                color: 'var(--text-secondary)',
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                padding: '0 8px'
              }}
            >
              {msg.sender === 'user' ? '나' : '복지 길잡이'}
            </span>

            {/* 메시지 말풍선 */}
            <div className={`chat-bubble ${msg.sender}`}>
              <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
              
              {/* 추천된 복지 혜택 카드 노출 (챗봇 내부) */}
              {msg.recommendations && (
                <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {msg.recommendations.map((rec) => (
                    <div key={rec.id} className="chat-result-card">
                      <div className="chat-result-title">📌 {rec.name}</div>
                      <div className="chat-result-desc">{rec.target}</div>
                      <button 
                        className="chat-result-link-btn"
                        onClick={() => onNavigateToSearch(rec.name)}
                        style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left' }}
                      >
                        👉 자세히 보기 (신청방법/서류)
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 대화 유도 퀵 버튼 영역 (첫 웰컴 메시지 직후 또는 유저 행동 유도용) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', margin: '8px 0' }}>
        <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'bold', color: 'var(--secondary)' }}>
          👇 무엇이 궁금하신가요? 버튼을 눌러보세요:
        </span>
        <div className="chatbot-quick-btns">
          <button className="quick-btn" onClick={() => handleQuickButtonClick('다리가 아파서 수술을 해야 해요')}>
            🦵 다리 수술비 지원
          </button>
          <button className="quick-btn" onClick={() => handleQuickButtonClick('혼자 살아서 돌봄을 받고 싶어요')}>
            🏠 노인 돌봄 서비스
          </button>
          <button className="quick-btn" onClick={() => handleQuickButtonClick('시니어 일자리가 필요해요')}>
            👷 노인 일자리
          </button>
          <button className="quick-btn" onClick={() => handleQuickButtonClick('임플란트나 틀니 지원이 궁금해요')}>
            🦷 틀니/임플란트
          </button>
          <button className="quick-btn" onClick={() => handleQuickButtonClick('갑자기 사정이 어려워져서 생활비가 필요해요')}>
            💰 긴급 생활비
          </button>
        </div>
      </div>

      {/* 입력 영역 */}
      <div className="chat-input-area">
        <input
          type="text"
          className="input-large"
          placeholder="여기에 궁금한 내용을 쓰세요..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="챗봇 대화 입력창"
        />
        <button 
          className="btn-large btn-primary"
          onClick={() => handleSendMessage()}
          style={{ minWidth: '80px' }}
        >
          보내기
        </button>
      </div>

    </div>
  );
}
