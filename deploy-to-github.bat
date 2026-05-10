@echo off
chcp 65001 >nul
echo ==========================================
echo     JobMate AI GitHub 部署脚本
echo ==========================================
echo.

:: 检查 Git 是否安装
git --version >nul 2>&1
if errorlevel 1 (
    echo [错误] Git 未安装！请先安装 Git：https://git-scm.com/download/win
    pause
    exit /b 1
)

:: 设置变量
set "REPO_URL="
set "PROJECT_DIR=%~dp0"

echo 步骤 1/5: 请输入 GitHub 仓库地址
echo 格式：https://github.com/your-username/JobMate-AI.git
echo.
set /p REPO_URL="仓库地址: "

if "%REPO_URL%"=="" (
    echo [错误] 仓库地址不能为空！
    pause
    exit /b 1
)

echo.
echo 步骤 2/5: 初始化 Git 仓库...
cd /d "%PROJECT_DIR%"
git init
if errorlevel 1 (
    echo [错误] Git 初始化失败！
    pause
    exit /b 1
)
echo [OK] Git 初始化成功

echo.
echo 步骤 3/5: 添加文件到 Git...
git add .
if errorlevel 1 (
    echo [错误] 添加文件失败！
    pause
    exit /b 1
)
echo [OK] 文件已添加

echo.
echo 步骤 4/5: 提交更改...
git commit -m "Initial commit: JobMate AI v2.0"
if errorlevel 1 (
    echo [警告] 没有可提交的更改或已提交过
)
echo [OK] 提交完成

echo.
echo 步骤 5/5: 推送到 GitHub...
git branch -M main
git remote add origin %REPO_URL% 2>nul
git push -u origin main
if errorlevel 1 (
    echo.
    echo [错误] 推送失败！可能原因：
    echo 1. 仓库不存在，请先在 GitHub 创建仓库
    echo 2. 未登录 GitHub，请运行: git config --global user.name "Your Name"
    echo                         git config --global user.email "your@email.com"
    echo 3. 需要身份验证，请使用 GitHub Personal Access Token
    echo.
    echo 创建仓库地址：https://github.com/new
    pause
    exit /b 1
)

echo.
echo ==========================================
echo     部署成功！
echo ==========================================
echo.
echo 仓库地址: %REPO_URL%
echo.
echo 下一步操作：
echo 1. 访问 GitHub 仓库查看代码
echo 2. 在 GitHub 上配置 GitHub Pages（Settings -^> Pages）
echo 3. 或使用 Vercel 一键部署
echo.
echo Vercel 部署：https://vercel.com/new
pause
