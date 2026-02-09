"use client";

import React, { useEffect, useRef, useState } from "react";
import { KakaoMapProps } from "@/app/shop/types/View";

declare global {
  interface Window {
    kakao: any;
  }
}

const KAKAO_SDK_URL = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_APP_KEY}&autoload=false`;

export default function KakaoMap({ lat, lon }: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  // 카카오맵 스크립트 로드
  useEffect(() => {
    // 이미 스크립트가 로드되어 있는지 확인
    if (window.kakao && window.kakao.maps) {
      setIsScriptLoaded(true);
      return;
    }

    // 이미 스크립트 태그가 있는지 확인
    const existingScript = document.querySelector(`script[src*="dapi.kakao.com"]`);
    if (existingScript) {
      existingScript.addEventListener("load", () => setIsScriptLoaded(true));
      return;
    }

    // 스크립트 동적 로드
    const script = document.createElement("script");
    script.src = KAKAO_SDK_URL;
    script.async = true;
    script.onload = () => {
      window.kakao.maps.load(() => {
        setIsScriptLoaded(true);
      });
    };
    document.head.appendChild(script);
  }, []);

  // 지도 생성
  useEffect(() => {
    if (!isScriptLoaded || !mapRef.current || !lat || !lon) return;

    const kakao = window.kakao;
    const container = mapRef.current;

    const options = {
      center: new kakao.maps.LatLng(lat, lon),
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
  }, [isScriptLoaded, lat, lon]);

  return <div ref={mapRef} className="rounded-md border border-[#E1E1E1] w-[97%] h-[500px]"></div>;
}
