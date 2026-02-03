
"use client";
import { ProfilePdfTemplate } from "@/features/pdf-export/ui/ProfilePdfTemplate";
import { BLOCK_RATINGS, MOCK_USER_DATA } from "@/shared/constants";

export default function page() {


  return (
    <div className="bg-white">
      <ProfilePdfTemplate
        profile={MOCK_USER_DATA}
        blockRatings={BLOCK_RATINGS}
        options={{}}
      />
    </div>
  );
}
