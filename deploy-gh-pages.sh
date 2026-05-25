#!/bin/bash
# JobMate AI GitHub Pages 部署脚本

echo "=========================================="
echo "     JobMate AI GitHub Pages 部署"
echo "=========================================="
echo ""

# 检查 dist 目录
if [ ! -d "dist" ]; then
    echo "[错误] dist 目录不存在！请先运行: npm run build"
    exit 1
fi

cd dist

# 初始化 git
echo "步骤 1/4: 初始化 Git 仓库..."
git init
git add .
git commit -m "Deploy to GitHub Pages"

# 设置远程仓库
echo ""
echo "步骤 2/4: 设置远程仓库..."
git remote add origin https://github.com/Amouren7/JobMate-AI.git

# 切换到 gh-pages 分支
echo ""
echo "步骤 3/4: 切换到 gh-pages 分支..."
git branch -M gh-pages

# 推送
echo ""
echo "步骤 4/4: 推送到 GitHub..."
git push -u origin gh-pages --force

if [ $? -eq 0 ]; then
    echo ""
    echo "=========================================="
    echo "     部署成功！"
    echo "=========================================="
    echo ""
    echo "GitHub 仓库: https://github.com/Amouren7/JobMate-AI"
    echo "GitHub Pages: https://Amouren7.github.io/JobMate-AI"
    echo ""
    echo "请在 GitHub 仓库设置中启用 Pages："
    echo "Settings -> Pages -> Source -> gh-pages"
else
    echo ""
    echo "[错误] 推送失败，请检查网络连接或权限"
    echo "可能需要配置 GitHub Personal Access Token"
fi

cd ..
