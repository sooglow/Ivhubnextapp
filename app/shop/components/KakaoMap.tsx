"use client";

import React, { useEffect, useRef } from "react";
import { KakaoMapProps } from "@/app/shop/types/View";

declare global {
  interface Window {
    kakao: any;
  }
}

export default function KakaoMap({ lat, lon }: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current || !lat || !lon) return;

    // 카카오맵 스크립트가 로드될 때까지 대기
    const loadKakaoMap = () => {
      if (window.kakao && window.kakao.maps) {
        const kakao = window.kakao;
        const container = mapRef.current;

        const options = {
          center: new kakao.maps.LatLng(parseFloat(lat), parseFloat(lon)),
          level: 3,
        };

        const map = new kakao.maps.Map(container, options);

        // 마커 생성
        const marker = new kakao.maps.Marker({
          position: map.getCenter(),
        });
        marker.setMap(map);

        // 지도 타입 컨트롤 추가
        const mapTypeControl = new kakao.maps.MapTypeControl();
        map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

        // 줌 컨트롤 추가
        const zoomControl = new kakao.maps.ZoomControl();
        map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
      } else {
        // 카카오맵이 아직 로드되지 않았으면 재시도
        setTimeout(loadKakaoMap, 100);
      }
    };

    loadKakaoMap();
  }, [lat, lon]);

  return <div ref={mapRef} className="rounded-md border w-[97%] h-[500px]"></div>;
}
