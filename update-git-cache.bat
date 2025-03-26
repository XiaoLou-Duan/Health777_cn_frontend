@echo off
echo 正在更新git缓存...

REM 清除git缓存
git rm -r --cached .

REM 重新添加所有文件，这将应用新的.gitignore规则
git add .

echo.
echo git缓存更新完成，现在您可以提交更改:
echo git commit -m "更新.gitignore并清除缓存"
echo.
echo 提示：清除缓存后，被忽略的文件将不再被git跟踪，但这些文件仍然会保留在您的本地文件系统中。
