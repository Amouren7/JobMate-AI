import { useEffect, useState, type ReactNode } from 'react';
import './style.css';

interface PageTransitionProps {
  children: ReactNode;
  animation?: 'fade' | 'slide-up' | 'slide-left' | 'slide-right' | 'scale';
  delay?: number;
  duration?: number;
}

function PageTransition({
  children,
  animation = 'fade',
  delay = 0,
  duration = 300,
}: PageTransitionProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const getAnimationClass = () => {
    switch (animation) {
      case 'fade':
        return 'page-transition-fade';
      case 'slide-up':
        return 'page-transition-slide-up';
      case 'slide-left':
        return 'page-transition-slide-left';
      case 'slide-right':
        return 'page-transition-slide-right';
      case 'scale':
        return 'page-transition-scale';
      default:
        return 'page-transition-fade';
    }
  };

  return (
    <div
      className={`page-transition ${getAnimationClass()} ${isVisible ? 'visible' : ''}`}
      style={{ '--transition-duration': `${duration}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

// 卡片动画组件
interface CardAnimationProps {
  children: ReactNode;
  index?: number;
  animation?: 'fade' | 'slide-up' | 'slide-left' | 'scale';
}

export function CardAnimation({
  children,
  index = 0,
  animation = 'slide-up',
}: CardAnimationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 100); // 错开动画时间

    return () => clearTimeout(timer);
  }, [index]);

  const getAnimationClass = () => {
    switch (animation) {
      case 'fade':
        return 'card-animation-fade';
      case 'slide-up':
        return 'card-animation-slide-up';
      case 'slide-left':
        return 'card-animation-slide-left';
      case 'scale':
        return 'card-animation-scale';
      default:
        return 'card-animation-slide-up';
    }
  };

  return (
    <div className={`card-animation ${getAnimationClass()} ${isVisible ? 'visible' : ''}`}>
      {children}
    </div>
  );
}

// 列表项动画
interface ListItemAnimationProps {
  children: ReactNode;
  index: number;
}

export function ListItemAnimation({ children, index }: ListItemAnimationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 80);

    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div className={`list-item-animation ${isVisible ? 'visible' : ''}`}>
      {children}
    </div>
  );
}

// 按钮动画包装器
interface ButtonAnimationProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function ButtonAnimation({ children, onClick, className = '' }: ButtonAnimationProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);
  const handleMouseLeave = () => setIsPressed(false);

  return (
    <div
      className={`button-animation ${isPressed ? 'pressed' : ''} ${className}`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export default PageTransition;
