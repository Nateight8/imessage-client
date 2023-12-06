import React, { PropsWithChildren } from "react";

type Props = {};

function HeaderLayout({ children }: PropsWithChildren) {
  return (
    <div className="border-y border-border h-16 px-4 flex items-center">
      {children}
    </div>
  );
}

export default HeaderLayout;
