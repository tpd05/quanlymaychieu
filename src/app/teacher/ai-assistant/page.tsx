"use client";

import React, { useState } from 'react';
import { Input, Button, List, Typography, Card, Space, Tag } from 'antd';

export default function AiAssistantPage() {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string; sources?: any[] }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user' as const, content: input };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ message: userMsg.content }),
      });
      const data = await res.json();
      const answer = data.answer || 'Xin lỗi, tạm thời chưa có câu trả lời.';
      setMessages((m) => [...m, { role: 'assistant', content: answer, sources: data.sources }]);
    } catch (e) {
      setMessages((m) => [...m, { role: 'assistant', content: 'Có lỗi xảy ra phía máy chủ.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <Card title="Trợ lý AI">
        <List
          dataSource={messages}
          renderItem={(msg, idx) => (
            <List.Item key={idx}>
              <div style={{ width: '100%' }}>
                <Typography.Text strong>{msg.role === 'user' ? 'Bạn' : 'Trợ lý'}</Typography.Text>
                <div style={{ whiteSpace: 'pre-wrap', marginTop: 4 }}>{msg.content}</div>
                {msg.sources && (
                  <Space wrap style={{ marginTop: 8 }}>
                    {msg.sources.map((s: any, i: number) => (
                      <Tag key={i}>{s.title || s.docId}</Tag>
                    ))}
                  </Space>
                )}
              </div>
            </List.Item>
          )}
        />
        <Space style={{ width: '100%' }}>
          <Input
            placeholder="Nhập tin nhắn..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onPressEnter={send}
            disabled={loading}
          />
          <Button type="primary" onClick={send} loading={loading}>
            Gửi
          </Button>
        </Space>
      </Card>
    </Space>
  );
}
