import React, { useEffect, useRef, useState } from 'react';

const WorkingKakaoMap = ({ locationText, className = "" }) => {
    const mapRef = useRef(null);
    const [status, setStatus] = useState('초기화 중...');
    const [error, setError] = useState(null);
    const [mapLoaded, setMapLoaded] = useState(false);

    useEffect(() => {
        const initKakaoMap = async () => {
            try {
                const apiKey = process.env.REACT_APP_KAKAO_MAP_KEY;
                
                if (!apiKey) {
                    throw new Error('API 키가 설정되지 않았습니다.');
                }

                setStatus('카카오맵 스크립트 로딩 중...');

                // 기존 스크립트 제거
                const existingScript = document.getElementById('kakao-map-sdk');
                if (existingScript) {
                    existingScript.remove();
                }

                // 새 스크립트 생성 (autoload=false 사용)
                const script = document.createElement('script');
                script.id = 'kakao-map-sdk';
                script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&libraries=services&autoload=false`;
                script.async = true;

                script.onload = () => {
                    setStatus('카카오맵 API 초기화 중...');
                    
                    if (window.kakao && window.kakao.maps) {
                        window.kakao.maps.load(() => {
                            setStatus('지도 생성 중...');
                            createMap();
                        });
                    } else {
                        throw new Error('카카오 객체를 찾을 수 없습니다.');
                    }
                };

                script.onerror = (e) => {
                    throw new Error('카카오맵 스크립트 로드에 실패했습니다.');
                };

                document.head.appendChild(script);

            } catch (err) {
                setError(err.message);
                setStatus('초기화 실패');
            }
        };

        const createMap = () => {
            try {
                if (!mapRef.current) {
                    throw new Error('지도 컨테이너를 찾을 수 없습니다.');
                }

                const options = {
                    center: new window.kakao.maps.LatLng(37.5665, 126.9780), // 서울시청
                    level: 3
                };

                const map = new window.kakao.maps.Map(mapRef.current, options);

                // 위치 검색 및 표시
                if (locationText && locationText.trim()) {
                    searchAndDisplayLocation(map, locationText);
                } else {
                    // 기본 마커 추가
                    const marker = new window.kakao.maps.Marker({
                        position: new window.kakao.maps.LatLng(37.5665, 126.9780)
                    });
                    marker.setMap(map);
                }

                setStatus('지도 로드 완료!');
                setMapLoaded(true);

            } catch (err) {
                setError(`지도 생성 실패: ${err.message}`);
            }
        };

        const searchAndDisplayLocation = (map, searchText) => {
            try {
                if (!window.kakao.maps.services) {
                    setMapLoaded(true);
                    return;
                }

                const geocoder = new window.kakao.maps.services.Geocoder();

                geocoder.addressSearch(searchText, (result, status) => {
                    if (status === window.kakao.maps.services.Status.OK) {
                        displayLocationOnMap(map, result[0].y, result[0].x, result[0].address_name);
                    } else {
                        const places = new window.kakao.maps.services.Places();
                        places.keywordSearch(searchText, (data, status) => {
                            if (status === window.kakao.maps.services.Status.OK && data.length > 0) {
                                displayLocationOnMap(map, data[0].y, data[0].x, data[0].place_name);
                            } else {
                                setMapLoaded(true);
                            }
                        });
                    }
                });

            } catch (err) {
                setMapLoaded(true);
            }
        };

        const displayLocationOnMap = (map, lat, lng, name) => {
            try {
                const coords = new window.kakao.maps.LatLng(lat, lng);
                map.setCenter(coords);
                map.setLevel(3);

                const marker = new window.kakao.maps.Marker({
                    map: map,
                    position: coords
                });

                const infowindow = new window.kakao.maps.InfoWindow({
                    content: `<div style="padding:10px;font-size:12px;text-align:center;"><strong>📍 ${name}</strong></div>`
                });

                infowindow.open(map, marker);
                setMapLoaded(true);

            } catch (err) {
                setMapLoaded(true);
            }
        };

        initKakaoMap();
    }, [locationText]);

    if (error) {
        return (
            <div className={`bg-red-50 border border-red-200 rounded-lg p-6 ${className}`}>
                <div className="text-red-600 text-center">
                    <p className="text-lg font-medium mb-2">🚫 지도 로드 실패</p>
                    <p className="text-sm">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`relative ${className}`}>
            <div 
                ref={mapRef} 
                className="w-full h-full rounded-lg border"
                style={{ minHeight: '300px', backgroundColor: '#f8f9fa' }}
            />
            
            {!mapLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-90 rounded-lg">
                    <div className="text-center">
                        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-3"></div>
                        <p className="text-sm font-medium text-gray-700">{status}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkingKakaoMap;