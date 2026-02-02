"use client";

/**
 * Rainbow Avatar Component
 * @description Avatar with animated rainbow gradient ring
 */
interface RainbowAvatarProps {
  avatarUrl?: string;
  avatarText: string;
  size?: number;
}

export function RainbowAvatar({
  avatarUrl,
  avatarText,
  size = 64,
}: RainbowAvatarProps) {
  return (
    <div
      className="relative rounded-full shrink-0"
      style={{ width: size, height: size }}
    >
      <div className="absolute inset-[-3px] rounded-full rainbow-ring" />
      <div className="relative z-10 w-full h-full rounded-full overflow-hidden bg-neutral-700 flex items-center justify-center text-white font-semibold">
        {avatarUrl ? (
          <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          avatarText
        )}
      </div>

      <style jsx>{`
        .rainbow-ring {
          background: conic-gradient(
            #ff004c,
            #ff8a00,
            #ffea00,
            #20c997,
            #00d0ff,
            #7b5cff,
            #ff004c
          );
          animation: spin 6s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
