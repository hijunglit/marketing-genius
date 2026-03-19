import type React from "react";

const items = ["현재 테스트 운영중입니다.", "현재 테스트 운영중입니다."];
const doubleItems = [...items, ...items];

export const RollingBanner: React.FC = () => {
  return (
    <div className="overflow-hidden w-full bg-gray-50 py-4">
      <div className="flex animate-roll w-[200%]">
        {doubleItems.map((item, idx) => (
          <div
            key={"banner-item" + idx}
            className="flex-none w-[50%] flex justify-center items-center h-10 bg-blue-500 text-white font-bold text-lg"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};
