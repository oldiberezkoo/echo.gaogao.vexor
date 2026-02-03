import { UserProfile } from "@/entities/user";
export interface PdfExportOptions {
  includeLogo?: boolean;
  adminNotes?: string;
  activityData?: { date: string; tasks: number; points: number }[];
  profileUrl?: string;
}

export function generateProfileHtml(
  profile: UserProfile,
  blockRatings: {
    name: string;
    points: number;
    maxPoints: number;
    rank: number;
  }[],
  options: PdfExportOptions = {},
): string {
  const now = new Date();
  const dateString = `${now.toLocaleDateString("ru-RU")} ${now.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}`;

  return `
    <!DOCTYPE html>
    <html lang="ru">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
          color: #000;
          line-height: 1.6;
          padding: 20mm;
        }
        
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 30px;
        }
        
        .profile-photo {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-fit: cover;
        }
        
        .date {
          font-size: 10pt;
          color: #808080;
          text-align: right;
        }
        
        .logo {
          width: 40px;
          height: 40px;
          position: absolute;
          top: 20mm;
          right: 20mm;
        }
        
        h1 {
          font-size: 24pt;
          margin-bottom: 15px;
        }
        
        .profile-info {
          margin-bottom: 20px;
        }
        
        .profile-name {
          font-size: 14pt;
          font-weight: 600;
          margin-bottom: 8px;
        }
        
        .profile-details {
          font-size: 11pt;
          color: #404040;
          line-height: 1.8;
        }
        
        .stats-summary {
          margin: 20px 0;
          font-size: 12pt;
          line-height: 1.8;
        }
        
        .section-title {
          font-size: 14pt;
          font-weight: 600;
          margin: 25px 0 15px 0;
        }
        
        .ratings-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
        }
        
        .ratings-table thead {
          border-bottom: 1px solid #c8c8c8;
        }
        
        .ratings-table th {
          text-align: left;
          padding: 8px 0;
          font-size: 10pt;
          color: #404040;
          font-weight: 500;
        }
        
        .ratings-table td {
          padding: 10px 0;
          font-size: 10pt;
        }
        
        .progress-bar {
          width: 150px;
          height: 8px;
          background: #e6e6e6;
          border-radius: 4px;
          overflow: hidden;
        }
        
        .progress-fill {
          height: 100%;
          background: #3bcbff;
          border-radius: 4px;
        }
        
        .activity-chart {
          margin: 20px 0;
          page-break-inside: avoid;
        }
        
        .chart-container {
          display: flex;
          align-items: flex-end;
          height: 200px;
          border: 1px solid #c8c8c8;
          padding: 10px;
          gap: 5px;
          margin-bottom: 15px;
        }
        
        .chart-bar {
          flex: 1;
          background: #3bcbff;
          min-height: 2px;
          position: relative;
        }
        
        .chart-label {
          position: absolute;
          bottom: -20px;
          left: 0;
          font-size: 7pt;
          color: #808080;
          transform: rotate(45deg);
          transform-origin: left top;
          white-space: nowrap;
        }
        
        .activity-stats {
          font-size: 10pt;
          color: #404040;
          line-height: 1.8;
        }
        
        .activity-stats li {
          margin-left: 20px;
        }
        
        .footer {
          position: fixed;
          bottom: 10mm;
          left: 0;
          right: 0;
          text-align: center;
          font-size: 8pt;
          color: #808080;
        }
        
        .qr-code {
          position: fixed;
          bottom: 15mm;
          right: 20mm;
          text-align: center;
        }
        
        .qr-code img {
          width: 80px;
          height: 80px;
          margin-bottom: 5px;
        }
        
        .qr-label {
          font-size: 8pt;
          color: #808080;
        }
        
        @media print {
          body {
            padding: 0;
          }
        }
      </style>
    </head>
    <body>
      ${options.includeLogo ? `<img src="${options.includeLogo}" class="logo" alt="Logo">` : ""}
      
      <div class="header">
        <img src="${profile.avatar}" class="profile-photo" alt="Profile Photo">
        <div class="date">Дата: ${dateString}</div>
      </div>
      
      <h1>Профиль участника</h1>
      
      <div class="profile-info">
        <div class="profile-name">${profile.firstName} ${profile.lastName}</div>
        <div class="profile-details">
          Позиция: ${profile.position ?? ""}<br>
          Стаж: ${profile.experience ?? ""}<br>
          Статус: ${profile.status ?? ""}
        </div>
      </div>
      
      <div class="stats-summary">
        Общий рейтинг: #${profile.globalRank}<br>
        Всего очков: ${profile.totalPoints}<br>
        Серия активности: ${profile.streak} дней
      </div>
      
      <h2 class="section-title">Рейтинг по блокам</h2>
      
      <table class="ratings-table">
        <thead>
          <tr>
            <th>Категория</th>
            <th>Очки</th>
            <th>Место</th>
            <th>Прогресс</th>
          </tr>
        </thead>
        <tbody>
          ${blockRatings
            .map(
              (rating) => `
            <tr>
              <td>${rating.name}</td>
              <td>${rating.points}/${rating.maxPoints}</td>
              <td>#${rating.rank}</td>
              <td>
                <div class="progress-bar">
                  <div class="progress-fill" style="width: ${(rating.points / rating.maxPoints) * 100}%"></div>
                </div>
              </td>
            </tr>
          `,
            )
            .join("")}
        </tbody>
      </table>
      
      ${
        options.activityData?.length
          ? `
        <div class="activity-chart">
          <h2 class="section-title">Активность за период</h2>
          
          <div class="chart-container">
            ${options.activityData
              .map((data) => {
                const maxTasks = Math.max(
                  ...options.activityData!.map((d) => d.tasks),
                );
                const height = (data.tasks / maxTasks) * 100;
                return `
                <div class="chart-bar" style="height: ${height}%">
                  <div class="chart-label">${data.date}</div>
                </div>
              `;
              })
              .join("")}
          </div>
          
          <div class="section-title" style="font-size: 11pt;">Статистика активности:</div>
          <ul class="activity-stats">
            <li>Всего задач: ${options.activityData.reduce((sum, d) => sum + d.tasks, 0)}</li>
            <li>Всего очков: ${options.activityData.reduce((sum, d) => sum + d.points, 0)}</li>
            <li>В среднем: ${(options.activityData.reduce((sum, d) => sum + d.tasks, 0) / options.activityData.length).toFixed(1)} задач/день (${(options.activityData.reduce((sum, d) => sum + d.points, 0) / options.activityData.length).toFixed(0)} очков)</li>
            <li>Максимум: ${Math.max(...options.activityData.map((d) => d.tasks))} задач за день</li>
          </ul>
        </div>
      `
          : ""
      }
      
      ${
        options.profileUrl
          ? `
        <div class="qr-code">
          <img src="${await generateQRCode(options.profileUrl)}" alt="QR Code">
          <div class="qr-label">Профиль</div>
        </div>
      `
          : ""
      }
      
      <div class="footer">
        ${process.env.NEXT_PUBLIC_DOMAIN || "example.com"} • Экспортировано для внутреннего использования
      </div>
    </body>
    </html>
  `;
}

async function generateQRCode(url: string): Promise<string> {
  const QRCode = (await import("qrcode")).default;
  return QRCode.toDataURL(url, { width: 256, margin: 1 });
}

export async function downloadProfilePdf(
  profile: UserProfile,
  blockRatings: {
    name: string;
    points: number;
    maxPoints: number;
    rank: number;
  }[],
  options?: PdfExportOptions,
): Promise<void> {
  try {
    // Генерируем HTML
    const html = generateProfileHtml(profile, blockRatings, options);

    // Отправляем на сервер для конвертации в PDF
    const response = await fetch("/api/export-pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ html }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate PDF");
    }

    // Скачиваем PDF
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `profile_${sanitizeFilename(profile.firstName)}_${Date.now()}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("PDF export error:", error);
    throw error;
  }
}

function sanitizeFilename(text: string): string {
  if (!text) return "export";
  return text
    .toLowerCase()
    .replace(/[^a-zа-яё0-9_-]/gi, "_")
    .replace(/_{2,}/g, "_")
    .trim();
}