import React, { useState } from "react";

export interface ChameleonProps {
  children: React.ReactNode;
}

function Chameleon({ children }: ChameleonProps) {
  const [count, setCount] = useState(0);
  return (
    <div
      className={
        count % 2 === 0
          ? "zeus:!bg-blue-600 zeus:text-white"
          : "zeus:!bg-red-600 zeus:text-white"
      }
      onClick={() => setCount(count + 1)}
    >
      {children}
    </div>
  );
}

export default Chameleon;
