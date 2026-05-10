import { Spin, Typography } from 'antd';
import './style.css';

const { Text } = Typography;

interface LoadingProps {
  tip?: string;
  size?: 'small' | 'default' | 'large';
  fullscreen?: boolean;
}

function Loading({ tip = '加载中...', size = 'large', fullscreen = false }: LoadingProps) {
  if (fullscreen) {
    return (
      <div className="loading-fullscreen">
        <div className="loading-content">
          <div className="loading-spinner">
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
          </div>
          <Text className="loading-text">{tip}</Text>
        </div>
      </div>
    );
  }

  return (
    <div className="loading-wrapper">
      <Spin size={size} tip={tip} />
    </div>
  );
}

// AI 分析专用加载组件
export function AILoading({ tip = 'AI 正在分析中...' }: { tip?: string }) {
  return (
    <div className="ai-loading">
      <div className="ai-loading-content">
        <div className="ai-brain">
          <div className="ai-brain-inner">
            <div className="ai-pulse"></div>
            <div className="ai-pulse"></div>
            <div className="ai-pulse"></div>
          </div>
        </div>
        <Text className="ai-loading-text">{tip}</Text>
        <div className="ai-loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
}

// 骨架屏组件
export function Skeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="skeleton-wrapper">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton-row">
          <div className="skeleton-line" style={{ width: `${Math.random() * 40 + 60}%` }}></div>
        </div>
      ))}
    </div>
  );
}

export default Loading;
