import React from "react";
import ContentLoader from "react-content-loader";
import { MobileListItemLoaderProps } from "@/app/shop/types/View";

export default function MobileListItemLoader(props: MobileListItemLoaderProps) {
  return (
    <ContentLoader
      speed={2}
      width="100%"
      height={250}
      viewBox="0 0 1148 850"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
      {...props}
    >
      {[8, 450].map((y, idx) => {
        return (
          <React.Fragment key={idx}>
            <rect x="8" y={y} rx="4" ry="4" width="1148" height="400" />
          </React.Fragment>
        );
      })}
    </ContentLoader>
  );
}
