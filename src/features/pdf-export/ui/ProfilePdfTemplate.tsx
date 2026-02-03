import { UserProfile } from "@/entities/user";
import React from "react";

export interface PdfExportOptions {
  includeLogo?: string; // base64 or url
  adminNotes?: string;
  activityData?: { date: string; tasks: number; points: number }[];
  profileUrl?: string;
  qrCodeUrl?: string; // base64
}

interface ProfilePdfTemplateProps {
  profile: UserProfile;
  blockRatings: {
    name: string;
    points: number;
    maxPoints: number;
    rank: number;
  }[];
  options?: PdfExportOptions;
}

export const ProfilePdfTemplate: React.FC<ProfilePdfTemplateProps> = ({
  profile,
  blockRatings,
  options = {},
}) => {
  const now = new Date();
  const dateString = `${now.toLocaleDateString("ru-RU")} ${now.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}`;

  // Inline styles are often more reliable for Puppeteer/PDF generation than external CSS
  // but we can use Tailwind helper classes if we inject the CSS.
  // For simplicity and robustness in this specific context, I'll use inline styles for critical layout
  // and standard HTML structure.

  const styles = {
    body: {
      fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif",
      color: "#000",
      lineHeight: 1.6,
      padding: "20mm",
      maxWidth: "210mm", // A4 width
      margin: "0 auto",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "30px",
    },
    profilePhoto: {
      width: "80px",
      height: "80px",
      borderRadius: "50%",
      objectFit: "cover" as const,
    },
    date: {
      fontSize: "10pt",
      color: "#808080",
      textAlign: "right" as const,
    },
    logo: {
      width: "40px",
      height: "40px",
      position: "absolute" as const,
      top: "20mm",
      right: "20mm",
    },
    h1: {
      fontSize: "24pt",
      marginBottom: "15px",
    },
    profileInfo: {
      marginBottom: "20px",
    },
    profileName: {
      fontSize: "14pt",
      fontWeight: 600,
      marginBottom: "8px",
    },
    profileDetails: {
      fontSize: "11pt",
      color: "#404040",
      lineHeight: 1.8,
    },
    statsSummary: {
      margin: "20px 0",
      fontSize: "12pt",
      lineHeight: 1.8,
    },
    sectionTitle: {
      fontSize: "14pt",
      fontWeight: 600,
      margin: "25px 0 15px 0",
    },
    ratingsTable: {
      width: "100%",
      borderCollapse: "collapse" as const,
      marginBottom: "30px",
    },
    th: {
      textAlign: "left" as const,
      padding: "8px 0",
      fontSize: "10pt",
      color: "#404040",
      fontWeight: 500,
      borderBottom: "1px solid #c8c8c8",
    },
    td: {
      padding: "10px 0",
      fontSize: "10pt",
    },
    progressBar: {
      width: "150px",
      height: "8px",
      background: "#e6e6e6",
      borderRadius: "4px",
      overflow: "hidden",
    },
    progressFill: (percent: number) => ({
      height: "100%",
      background: "#3bcbff",
      borderRadius: "4px",
      width: `${percent}%`,
    }),
    chartContainer: {
      display: "flex",
      alignItems: "flex-end",
      height: "200px",
      border: "1px solid #c8c8c8",
      padding: "10px",
      gap: "5px",
      marginBottom: "15px",
    },
    chartBar: (heightPercent: number) => ({
      flex: 1,
      background: "#3bcbff",
      minHeight: "2px",
      position: "relative" as const,
      height: `${heightPercent}%`,
    }),
    chartLabel: {
      position: "absolute" as const,
      bottom: "-20px",
      left: 0,
      fontSize: "7pt",
      color: "#808080",
      transform: "rotate(45deg)",
      transformOrigin: "left top",
      whiteSpace: "nowrap" as const,
    },
    ul: {
      listStyle: "none",
      padding: 0,
    },
    li: {
      marginLeft: "20px",
      marginBottom: "4px",
    },
    footer: {
      position: "fixed" as const,
      bottom: "10mm",
      left: 0,
      right: 0,
      textAlign: "center" as const,
      fontSize: "8pt",
      color: "#808080",
    },
    qrCode: {
      position: "fixed" as const,
      bottom: "15mm",
      right: "20mm",
      textAlign: "center" as const,
    },
  };

  const totalTasks =
    options.activityData?.reduce((sum, d) => sum + d.tasks, 0) || 0;
  const totalPoints =
    options.activityData?.reduce((sum, d) => sum + d.points, 0) || 0;
  const count = options.activityData?.length || 1;
  const maxTasks = options.activityData
    ? Math.max(...options.activityData.map((d) => d.tasks))
    : 0;

  // return (
  //   <html>
  //     <head>
  //       <meta charSet="UTF-8" />
  //       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  //     </head>
  //     <body style={styles.body}>
  //       {options.includeLogo && (
  //         <img src={options.includeLogo} style={styles.logo} alt="Logo" />
  //       )}

  //       <div style={styles.header}>
  //         <img
  //           src={profile.avatar}
  //           style={styles.profilePhoto}
  //           alt="Profile Photo"
  //         />
  //         <div style={styles.date}>Дата: {dateString}</div>
  //       </div>

  //       <h1 style={styles.h1}>Профиль участника</h1>

  //       <div style={styles.profileInfo}>
  //         <div style={styles.profileName}>
  //           {profile.firstName} {profile.lastName}
  //         </div>
  //         <div style={styles.profileDetails}>
  //           Позиция: {profile.position ?? ""}
  //           <br />
  //           Стаж: {profile.experience ?? ""}
  //           <br />
  //           Статус: {profile.status ?? ""}
  //         </div>
  //       </div>

  //       <div style={styles.statsSummary}>
  //         Общий рейтинг: #{profile.globalRank}
  //         <br />
  //         Всего очков: {profile.totalPoints}
  //         <br />
  //         Серия активности: {profile.streak} дней
  //       </div>

  //       <h2 style={styles.sectionTitle}>Рейтинг по блокам</h2>

  //       <table style={styles.ratingsTable}>
  //         <thead>
  //           <tr>
  //             <th style={styles.th}>Категория</th>
  //             <th style={styles.th}>Очки</th>
  //             <th style={styles.th}>Место</th>
  //             <th style={styles.th}>Прогресс</th>
  //           </tr>
  //         </thead>
  //         <tbody>
  //           {blockRatings.map((rating) => (
  //             <tr key={rating.name}>
  //               <td style={styles.td}>{rating.name}</td>
  //               <td style={styles.td}>
  //                 {rating.points}/{rating.maxPoints}
  //               </td>
  //               <td style={styles.td}>#{rating.rank}</td>
  //               <td style={styles.td}>
  //                 <div style={styles.progressBar}>
  //                   <div
  //                     style={styles.progressFill(
  //                       (rating.points / rating.maxPoints) * 100,
  //                     )}
  //                   ></div>
  //                 </div>
  //               </td>
  //             </tr>
  //           ))}
  //         </tbody>
  //       </table>

  //       {options.activityData && options.activityData.length > 0 && (
  //         <div style={{ marginTop: "20px", pageBreakInside: "avoid" }}>
  //           <h2 style={styles.sectionTitle}>Активность за период</h2>

  //           <div style={styles.chartContainer}>
  //             {options.activityData.map((data, idx) => {
  //               const height = maxTasks > 0 ? (data.tasks / maxTasks) * 100 : 0;
  //               return (
  //                 <div key={idx} style={styles.chartBar(height)}>
  //                   <div style={styles.chartLabel}>{data.date}</div>
  //                 </div>
  //               );
  //             })}
  //           </div>

  //           <div style={{ ...styles.sectionTitle, fontSize: "11pt" }}>
  //             Статистика активности:
  //           </div>
  //           <ul style={{ ...styles.profileDetails, ...styles.ul }}>
  //             <li style={styles.li}>• Всего задач: {totalTasks}</li>
  //             <li style={styles.li}>• Всего очков: {totalPoints}</li>
  //             <li style={styles.li}>
  //               • В среднем: {(totalTasks / count).toFixed(1)} задач/день (
  //               {(totalPoints / count).toFixed(0)} очков)
  //             </li>
  //             <li style={styles.li}>• Максимум: {maxTasks} задач за день</li>
  //           </ul>
  //         </div>
  //       )}

  //       {options.qrCodeUrl && (
  //         <div style={styles.qrCode}>
  //           <img
  //             src={options.qrCodeUrl}
  //             alt="QR Code"
  //             style={{ width: "80px", height: "80px", marginBottom: "5px" }}
  //           />
  //           <div style={{ fontSize: "8pt", color: "#808080" }}>Профиль</div>
  //         </div>
  //       )}

  //       <div style={styles.footer}>
  //         {process.env.NEXT_PUBLIC_DOMAIN || "example.com"} • Экспортировано для
  //         внутреннего использования
  //       </div>
  //     </body>
  //   </html>
  // );

  return (

      <section style={styles.body}>
        {options.includeLogo && (
          <img src={options.includeLogo} style={styles.logo} alt="Logo" />
        )}

        <div style={styles.header}>
          <img
            src={profile.avatar}
            style={styles.profilePhoto}
            alt="Profile Photo"
          />
          <div style={styles.date}>Дата: {dateString}</div>
        </div>

        <h1 style={styles.h1}>Профиль участника</h1>

        <div style={styles.profileInfo}>
          <div style={styles.profileName}>
            {profile.firstName} {profile.lastName}
          </div>
          <div style={styles.profileDetails}>
            Позиция: {profile.position ?? ""}
            <br />
            Стаж: {profile.experience ?? ""}
            <br />
            Статус: {profile.status ?? ""}
          </div>
        </div>

        <div style={styles.statsSummary}>
          Общий рейтинг: #{profile.globalRank}
          <br />
          Всего очков: {profile.totalPoints}
          <br />
          Серия активности: {profile.streak} дней
        </div>

        <h2 style={styles.sectionTitle}>Рейтинг по блокам</h2>

        <table style={styles.ratingsTable}>
          <thead>
            <tr>
              <th style={styles.th}>Категория</th>
              <th style={styles.th}>Очки</th>
              <th style={styles.th}>Место</th>
              <th style={styles.th}>Прогресс</th>
            </tr>
          </thead>
          <tbody>
            {blockRatings.map((rating) => (
              <tr key={rating.name}>
                <td style={styles.td}>{rating.name}</td>
                <td style={styles.td}>
                  {rating.points}/{rating.maxPoints}
                </td>
                <td style={styles.td}>#{rating.rank}</td>
                <td style={styles.td}>
                  <div style={styles.progressBar}>
                    <div
                      style={styles.progressFill(
                        (rating.points / rating.maxPoints) * 100,
                      )}
                    ></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {options.activityData && options.activityData.length > 0 && (
          <div style={{ marginTop: "20px", pageBreakInside: "avoid" }}>
            <h2 style={styles.sectionTitle}>Активность за период</h2>

            <div style={styles.chartContainer}>
              {options.activityData.map((data, idx) => {
                const height = maxTasks > 0 ? (data.tasks / maxTasks) * 100 : 0;
                return (
                  <div key={idx} style={styles.chartBar(height)}>
                    <div style={styles.chartLabel}>{data.date}</div>
                  </div>
                );
              })}
            </div>

            <div style={{ ...styles.sectionTitle, fontSize: "11pt" }}>
              Статистика активности:
            </div>
            <ul style={{ ...styles.profileDetails, ...styles.ul }}>
              <li style={styles.li}>• Всего задач: {totalTasks}</li>
              <li style={styles.li}>• Всего очков: {totalPoints}</li>
              <li style={styles.li}>
                • В среднем: {(totalTasks / count).toFixed(1)} задач/день (
                {(totalPoints / count).toFixed(0)} очков)
              </li>
              <li style={styles.li}>• Максимум: {maxTasks} задач за день</li>
            </ul>
          </div>
        )}

        {options.qrCodeUrl && (
          <div style={styles.qrCode}>
            <img
              src={options.qrCodeUrl}
              alt="QR Code"
              style={{ width: "80px", height: "80px", marginBottom: "5px" }}
            />
            <div style={{ fontSize: "8pt", color: "#808080" }}>Профиль</div>
          </div>
        )}

        <div style={styles.footer}>
          {process.env.NEXT_PUBLIC_DOMAIN || "example.com"} • Экспортировано для
          внутреннего использования
        </div>
      </section>

  );
};
