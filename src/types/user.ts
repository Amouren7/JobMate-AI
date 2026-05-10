// 用户类型定义

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// LocalStorage key
const USER_KEY = 'jobmate_user';
const AUTH_KEY = 'jobmate_auth';

// 模拟用户数据库（实际项目中应该使用后端 API）
let mockUsers: Array<User & { password: string }> = [];

// 从 LocalStorage 加载已保存的用户
const loadMockUsers = () => {
  const saved = localStorage.getItem('jobmate_mock_users');
  if (saved) {
    mockUsers = JSON.parse(saved);
  }
};

// 保存用户到 LocalStorage
const saveMockUsers = () => {
  localStorage.setItem('jobmate_mock_users', JSON.stringify(mockUsers));
};

// 初始化
loadMockUsers();

// 登录
export const login = async (credentials: LoginCredentials): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockUsers.find(
        (u) => u.username === credentials.username && u.password === credentials.password
      );

      if (user) {
        const { password, ...userWithoutPassword } = user;
        localStorage.setItem(USER_KEY, JSON.stringify(userWithoutPassword));
        localStorage.setItem(AUTH_KEY, 'true');
        resolve(userWithoutPassword);
      } else {
        reject(new Error('用户名或密码错误'));
      }
    }, 500); // 模拟网络延迟
  });
};

// 注册
export const register = async (credentials: RegisterCredentials): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 验证密码
      if (credentials.password !== credentials.confirmPassword) {
        reject(new Error('两次输入的密码不一致'));
        return;
      }

      if (credentials.password.length < 6) {
        reject(new Error('密码长度至少为6位'));
        return;
      }

      // 检查用户名是否已存在
      if (mockUsers.some((u) => u.username === credentials.username)) {
        reject(new Error('用户名已存在'));
        return;
      }

      // 检查邮箱是否已存在
      if (mockUsers.some((u) => u.email === credentials.email)) {
        reject(new Error('邮箱已被注册'));
        return;
      }

      // 创建新用户
      const newUser: User & { password: string } = {
        id: Date.now().toString(),
        username: credentials.username,
        email: credentials.email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${credentials.username}`,
        createdAt: new Date().toISOString(),
        password: credentials.password,
      };

      mockUsers.push(newUser);
      saveMockUsers();

      const { password, ...userWithoutPassword } = newUser;
      localStorage.setItem(USER_KEY, JSON.stringify(userWithoutPassword));
      localStorage.setItem(AUTH_KEY, 'true');
      resolve(userWithoutPassword);
    }, 500);
  });
};

// 退出登录
export const logout = (): void => {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(AUTH_KEY);
};

// 获取当前用户
export const getCurrentUser = (): User | null => {
  const saved = localStorage.getItem(USER_KEY);
  return saved ? JSON.parse(saved) : null;
};

// 检查是否已登录
export const isAuthenticated = (): boolean => {
  return localStorage.getItem(AUTH_KEY) === 'true';
};

// 更新用户信息
export const updateUser = (updates: Partial<User>): User | null => {
  const currentUser = getCurrentUser();
  if (!currentUser) return null;

  const updatedUser = { ...currentUser, ...updates };
  localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));

  // 同时更新 mockUsers
  const userIndex = mockUsers.findIndex((u) => u.id === currentUser.id);
  if (userIndex !== -1) {
    mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates };
    saveMockUsers();
  }

  return updatedUser;
};
