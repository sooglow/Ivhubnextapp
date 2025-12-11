import React from "react";
import ContentLoader from "react-content-loader";
import { ListItemLoaderProps } from "@/app/shop/types/View";

export default function ListItemLoader(props: ListItemLoaderProps) {
  return (
    <ContentLoader
      speed={2}
      width="100%"
      height={608}
      viewBox="0 0 1148 608"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
      {...props}
    >
      {[15, 77, 138, 199, 260, 321, 382, 443, 504, 565].map((y, idx) => {
        return (
          <React.Fragment key={idx}>
            <rect x="8" y={y} rx="4" ry="4" width="150" height="38" />
            <rect x="165" y={y} rx="4" ry="4" width="155" height="38" />
            <rect x="325" y={y} rx="4" ry="4" width="225" height="38" />
            <rect x="555" y={y} rx="4" ry="4" width="145" height="38" />
            <rect x="705" y={y} rx="4" ry="4" width="170" height="38" />
            <rect x="880" y={y} rx="4" ry="4" width="165" height="38" />
            <rect x="1048" y={y} rx="4" ry="4" width="95" height="38" />
          </React.Fragment>
        );
      })}
    </ContentLoader>
  );
}
