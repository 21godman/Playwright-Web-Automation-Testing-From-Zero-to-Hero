# Cursor MCP（Playwright）重新安裝與授權教學

## 一、重新安裝 MCP

### 方式 A：用 Cursor 設定畫面（建議）

1. **打開 Cursor 設定**
   - Mac：`Cmd + ,` 或選單 **Cursor → Settings**
   - Windows：`Ctrl + ,`

2. **進入 MCP**
   - 左側選 **Features**
   - 找到 **MCP** 並點進去

3. **移除舊的 Playwright**
   - 若列表裡已有 `playwright`（或你之前取的名字）
   - 點該項目右側的 **刪除 / 垃圾桶** 圖示

4. **新增 Playwright MCP**
   - 點 **"+ Add New MCP Server"**
   - **Name**：填 `playwright`（或任意名稱）
   - **Type**：選 **stdio**
   - **Command**：填下面其中一種
     - 簡單版：`npx @playwright/mcp@latest`
     - 若用 nvm，需用完整路徑（見方式 B）
   - 若有 **Arguments** 欄位，可填：`-y` 和 `@playwright/mcp@latest`（依介面而定）
   - 儲存

5. **重開 Cursor**
   - 完全關閉 Cursor 後再開啟，讓 MCP 重新載入

---

### 方式 B：手動編輯 mcp.json

1. **關閉 Cursor**（避免設定被覆蓋）

2. **編輯設定檔**
   - 檔案位置：`~/.cursor/mcp.json`
   - 即：`/Users/jameskuo/.cursor/mcp.json`

3. **貼上以下內容**（依你習慣選一種）

   **若終端機打 `npx` 會動（PATH 有 Node）：**
   ```json
   {
     "mcpServers": {
       "playwright": {
         "command": "npx",
         "args": ["-y", "@playwright/mcp@latest"]
       }
     }
   }
   ```

   **若用 nvm，需指定 npx 完整路徑：**
   ```json
   {
     "mcpServers": {
       "playwright": {
         "command": "/Users/jameskuo/.nvm/versions/node/v22.12.0/bin/npx",
         "args": ["-y", "@playwright/mcp@latest"]
       }
     }
   }
   ```
   （路徑請依你 `which npx` 結果調整）

4. **存檔後重開 Cursor**

---

## 二、授權／批准 MCP 工具（重要）

MCP 工具**不會自動執行**，需要你在 Cursor 裡**手動批准**才會跑。

### 批准按鈕會出現在哪裡

- **位置**：**Composer 的對話視窗裡**（你和 AI 聊天的那個畫面）
- **時機**：當 AI 要執行 MCP 工具時（例如「打開某個網址」），會在那則 **AI 回覆的內容裡**多出一塊「工具呼叫」的區塊

### 請這樣做

1. **一定要用 Composer（Agent）**
   - 用 **Cmd + I**（Mac）或 **Ctrl + I**（Windows）開 **Composer**
   - 或從介面選「Agent」/「Composer」模式  
   - MCP 只在這裡可用，一般 Chat 不會出現

2. **觸發一次 MCP**
   - 在 Composer 輸入：「請用 MCP 打開 https://www.google.com」
   - 送出

3. **等 AI 回覆**
   - AI 會回覆並嘗試呼叫 MCP（例如 `browser_navigate`）

4. **在「同一則 AI 回覆」裡找批准**
   - 不要關掉對話、不要跳到別則
   - 在 **這則回覆的區塊內**從上到下看：
     - 有沒有 **「Tool call」／「MCP」／「執行工具」** 之類的標題
     - 下面有沒有可**展開**的區塊（點一下展開）
     - 展開後有沒有 **「Approve」／「Run」／「允許」** 按鈕
   - 有時按鈕在回覆的**最下方**，需要**往下捲**才看得到

5. **點擊批准**
   - 看到 **Approve** 或 **Run** 就點下去
   - 點完後工具才會真的執行，瀏覽器才會打開

### 若你完全沒看到任何批准按鈕

可能原因與對應做法：

| 情況 | 建議 |
|------|------|
| 用的是「Chat」而不是「Composer」 | 改用 **Composer（Cmd/Ctrl + I）** 再試 |
| 回覆裡只有文字，沒有工具區塊 | 到 **Settings → Features → MCP** 確認 Playwright 有出現且無錯誤；重開 Cursor 再問一次 |
| 有「Tool rejected」但沒看到按鈕 | 可能是 Cursor 版本不同，批准 UI 長得不一樣；試著在 AI 回覆氣泡的**右上角、下方、或可展開的箭頭**找找 |
| 想讓工具自動執行 | 目前 Cursor 文件未提到 MCP 可「預設允許」，需每次在對話裡批准 |

---

## 三、確認是否成功

1. 在 Composer 說：「請用 MCP 打開 https://www.google.com」
2. 在 **同一則 AI 回覆**裡找到並點擊 **Approve / Run**
3. 若成功，應會跳出 Playwright 的瀏覽器視窗並打開 Google

若仍失敗，可到 [Cursor Forum](https://forum.cursor.com) 搜尋 "MCP approve" 或 "Playwright MCP"，或貼你的 Cursor 版本與「有無看到任何批准相關 UI」描述詢問。

---

## 四、已知問題：完全沒有批准按鈕

**狀況**：很多人回報「等批准但畫面上沒有任何 Approve / Run / Allow 按鈕」——這是 Cursor 的已知問題，不是你自己設錯。

- 論壇討論：[Waiting on approval to run a mcp command but no button or prompt to approve](https://forum.cursor.com/t/waiting-on-approval-to-run-a-mcp-command-but-no-button-or-prompt-to-approve/150025)

**目前可試的作法：**

1. **在 mcp.json 加 `autoApprove`**（若你的 Cursor 版本有支援）  
   已在你的設定裡為 Playwright 加上常見工具的 `autoApprove`，重開 Cursor 後再試一次 MCP，看是否還會卡在批准。

2. **檢查 Cursor 設定**  
   - **Settings → Features** 或 **Agent** 相關頁面  
   - 找「Auto-run」「YOLO mode」「MCP Tools Protection」等  
   - 試著開啟 Auto-run 或關閉 MCP 保護，看 MCP 是否改為自動執行。

3. **更新 Cursor**  
   裝最新版，有時會修正批准 UI 或 MCP 行為。

4. **到論壇回報**  
   若你也是「完全沒有按鈕」，可到上面連結那篇文回覆你的 Cursor 版本與作業系統，方便官方排查。
