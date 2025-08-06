import { useState, useEffect, useCallback } from "react";
import { Cloud, Download, X, AlertCircle } from "lucide-react";
import {
  usePictureToVideoStore,
  createPictureFile,
} from "@/context/store/pictureToVideoStore";

interface GoogleDrivePickerProps {
  acceptedFileTypes: string[];
  maxFiles: number;
}

// Google Identity Services (GIS) 및 Drive API 타입 정의
declare global {
  interface Window {
    google: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: {
              access_token: string;
              error?: string;
            }) => void;
          }) => {
            requestAccessToken: () => void;
          };
        };
      };
    };
    gapi: {
      load: (
        api: string,
        options: { callback: () => void; onerror: () => void } | (() => void)
      ) => void;
      client: {
        init: (config: {
          apiKey: string;
          discoveryDocs: string[];
        }) => Promise<void>;
        setToken: (token: { access_token: string }) => void;
        drive: {
          files: {
            list: (params: {
              pageSize: number;
              fields: string;
              q: string;
              orderBy: string;
            }) => Promise<{ result: { files: GoogleDriveFile[] } }>;
            get: (params: {
              fileId: string;
              alt: string;
            }) => Promise<{ body: string }>;
          };
        };
      };
    };
  }
}

interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  thumbnailLink?: string;
  size?: string;
  createdTime: string;
}

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  thumbnailUrl?: string;
  size?: string;
  createdTime: string;
}

export const GoogleDrivePicker = ({ maxFiles }: GoogleDrivePickerProps) => {
  const { selectedFiles, addFiles, removeFile, setLoading } =
    usePictureToVideoStore();
  const [isGapiLoaded, setIsGapiLoaded] = useState(false);
  const [isGisLoaded, setIsGisLoaded] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [accessToken, setAccessToken] = useState<string>("");
  const [driveFiles, setDriveFiles] = useState<DriveFile[]>([]);
  const [selectedDriveFiles, setSelectedDriveFiles] = useState<Set<string>>(
    new Set()
  );
  const [error, setError] = useState<string>("");
  const [tokenClient, setTokenClient] = useState<any>(null);

  // Google API 설정
  const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
  const DISCOVERY_DOCS = [
    "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
  ];
  const SCOPES = "https://www.googleapis.com/auth/drive.readonly";

  // Drive 파일 목록 로드
  const loadDriveFiles = useCallback(async () => {
    try {
      setLoading(true, "Google Drive 파일을 불러오는 중...");
      setError(""); // 이전 에러 메시지 클리어

      const response = await window.gapi.client.drive.files.list({
        pageSize: 50,
        fields:
          "nextPageToken, files(id, name, mimeType, thumbnailLink, size, createdTime)",
        q: "mimeType contains 'image/' and trashed=false",
        orderBy: "createdTime desc",
      });

      const files: DriveFile[] = response.result.files.map(
        (file: GoogleDriveFile) => ({
          id: file.id,
          name: file.name,
          mimeType: file.mimeType,
          thumbnailUrl: file.thumbnailLink,
          size: file.size,
          createdTime: file.createdTime,
        })
      );

      setDriveFiles(files);

      if (files.length === 0) {
        setError("Google Drive에 이미지 파일이 없습니다.");
      }
    } catch (error: any) {
      console.error("Drive 파일 로드 실패:", error);
      if (error.status === 403) {
        setError(
          "Google Drive 접근 권한이 없습니다. API 키 설정을 확인해주세요."
        );
      } else if (error.status === 401) {
        setError("인증이 만료되었습니다. 다시 로그인해주세요.");
        setIsAuthorized(false);
      } else {
        setError(
          "Google Drive 파일을 불러올 수 없습니다. 네트워크 연결을 확인해주세요."
        );
      }
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  // Google API (GAPI) 초기화 - Drive API용
  const initializeGapi = useCallback(async () => {
    try {
      console.log("Google GAPI Client 초기화 시작");

      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Google Client API 로드 시간 초과 (10초)"));
        }, 10000);

        window.gapi.load("client", {
          callback: async () => {
            try {
              clearTimeout(timeout);
              console.log("Google Client API 로드 완료");

              await window.gapi.client.init({
                apiKey: API_KEY,
                discoveryDocs: DISCOVERY_DOCS,
              });

              console.log("Google Client 초기화 완료");
              setIsGapiLoaded(true);
              resolve();
            } catch (error) {
              clearTimeout(timeout);
              console.error("Google Client 초기화 실패:", error);
              reject(error);
            }
          },
          onerror: () => {
            clearTimeout(timeout);
            reject(new Error("Google Client API 로드 실패"));
          },
        });
      });
    } catch (error: any) {
      console.error("Google GAPI 초기화 실패:", error);
      setError(
        `Google API 초기화 실패: ${
          error.message || "알 수 없는 오류가 발생했습니다."
        }`
      );
    }
  }, [API_KEY]);

  // Google Identity Services (GIS) 초기화 - 인증용
  const initializeGis = useCallback(() => {
    try {
      console.log("Google Identity Services 초기화 시작");

      if (
        !window.google ||
        !window.google.accounts ||
        !window.google.accounts.oauth2
      ) {
        throw new Error("Google Identity Services가 로드되지 않았습니다.");
      }

      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (tokenResponse) => {
          console.log("Token response:", tokenResponse);

          if (tokenResponse.error) {
            console.error("Token 오류:", tokenResponse.error);
            setError(`Google 인증 실패: ${tokenResponse.error}`);
            return;
          }

          if (tokenResponse.access_token) {
            console.log("Access token 획득 성공");
            setAccessToken(tokenResponse.access_token);
            setIsAuthorized(true);

            // GAPI에 토큰 설정
            window.gapi.client.setToken({
              access_token: tokenResponse.access_token,
            });

            // Drive 파일 로드
            loadDriveFiles();
          }
        },
      });

      setTokenClient(client);
      setIsGisLoaded(true);
      console.log("Google Identity Services 초기화 완료");
    } catch (error: any) {
      console.error("Google Identity Services 초기화 실패:", error);
      setError(
        `Google 인증 초기화 실패: ${
          error.message || "알 수 없는 오류가 발생했습니다."
        }`
      );
    }
  }, [CLIENT_ID, loadDriveFiles]);

  // Google API 및 GIS 스크립트 로드
  useEffect(() => {
    const loadGoogleScripts = async () => {
      try {
        // API 키 유효성 검증
        if (!CLIENT_ID || !API_KEY) {
          setError(
            "Google Drive API 설정이 필요합니다. 환경 변수를 확인해주세요."
          );
          return;
        }

        // API 키 형식 검증
        if (!CLIENT_ID.endsWith(".apps.googleusercontent.com")) {
          setError("Google Client ID 형식이 올바르지 않습니다.");
          return;
        }

        if (!API_KEY.startsWith("AIza")) {
          setError("Google API Key 형식이 올바르지 않습니다.");
          return;
        }

        // 1. Google API (GAPI) 로드
        await new Promise<void>((resolve, reject) => {
          if (window.gapi) {
            console.log("Google API 이미 로드됨");
            resolve();
            return;
          }

          console.log("Google API 스크립트 로드 시작");
          const script = document.createElement("script");
          script.src = "https://apis.google.com/js/api.js";
          script.async = true;

          script.onload = () => {
            console.log("Google API 스크립트 로드 완료");
            resolve();
          };

          script.onerror = () => {
            console.error("Google API 스크립트 로드 실패");
            reject(new Error("Google API 스크립트 로드 실패"));
          };

          document.head.appendChild(script);
        });

        // 2. Google Identity Services (GIS) 로드
        await new Promise<void>((resolve, reject) => {
          if (window.google?.accounts?.oauth2) {
            console.log("Google Identity Services 이미 로드됨");
            resolve();
            return;
          }

          console.log("Google Identity Services 스크립트 로드 시작");
          const script = document.createElement("script");
          script.src = "https://accounts.google.com/gsi/client";
          script.async = true;

          script.onload = () => {
            console.log("Google Identity Services 스크립트 로드 완료");
            resolve();
          };

          script.onerror = () => {
            console.error("Google Identity Services 스크립트 로드 실패");
            reject(new Error("Google Identity Services 스크립트 로드 실패"));
          };

          document.head.appendChild(script);
        });

        // 3. 순차적으로 초기화
        await initializeGapi();
        initializeGis();
      } catch (error: any) {
        console.error("Google 스크립트 로드 실패:", error);
        setError(
          `Google 서비스 로드 실패: ${
            error.message || "알 수 없는 오류가 발생했습니다."
          }`
        );
      }
    };

    loadGoogleScripts();
  }, [CLIENT_ID, API_KEY, initializeGapi, initializeGis]);

  // Google 로그인 (GIS 방식)
  const signIn = useCallback(() => {
    try {
      if (!tokenClient) {
        setError(
          "Google 인증 클라이언트가 준비되지 않았습니다. 잠시 후 다시 시도해주세요."
        );
        return;
      }

      console.log("Google 로그인 요청 시작");
      tokenClient.requestAccessToken();
    } catch (error: any) {
      console.error("Google 로그인 실패:", error);

      // 더 구체적인 오류 처리
      if (error.error === "popup_blocked_by_browser") {
        setError(
          "팝업이 차단되었습니다. 브라우저 설정에서 팝업을 허용해주세요."
        );
      } else if (error.error === "access_denied") {
        setError("Google 계정 접근이 거부되었습니다. 권한을 허용해주세요.");
      } else if (error.error === "popup_closed_by_user") {
        setError("팝업이 사용자에 의해 닫혔습니다. 다시 시도해주세요.");
      } else if (error.error === "invalid_client") {
        setError(
          "Google Client ID가 올바르지 않습니다. OAuth 설정을 확인해주세요."
        );
      } else if (error.error === "unauthorized_client") {
        setError(
          "승인되지 않은 클라이언트입니다. Google Cloud Console에서 도메인을 승인된 원본에 추가해주세요."
        );
      } else if (error.error === "redirect_uri_mismatch") {
        setError(
          "리디렉션 URI가 일치하지 않습니다. OAuth 설정에서 현재 도메인을 추가해주세요."
        );
      } else {
        setError(
          `Google 로그인 실패: ${
            error.message || "알 수 없는 오류가 발생했습니다."
          }`
        );
      }
    }
  }, [tokenClient]);

  // Google 로그아웃
  const signOut = useCallback(() => {
    try {
      // 토큰 무효화 (GIS는 별도의 로그아웃 API가 없음)
      if (accessToken) {
        // Google API에서 토큰 제거
        if (window.gapi?.client) {
          window.gapi.client.setToken(null);
        }
      }

      console.log("Google 로그아웃 완료");
      setAccessToken("");
      setIsAuthorized(false);
      setDriveFiles([]);
      setSelectedDriveFiles(new Set());
    } catch (error) {
      console.error("Google 로그아웃 실패:", error);
    }
  }, [accessToken]);

  // 파일 선택/해제
  const toggleFileSelection = useCallback(
    (fileId: string) => {
      setSelectedDriveFiles((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(fileId)) {
          newSet.delete(fileId);
        } else {
          // 최대 선택 개수 확인
          const remainingSlots = maxFiles - selectedFiles.length;
          if (newSet.size >= remainingSlots) {
            return prev;
          }
          newSet.add(fileId);
        }
        return newSet;
      });
    },
    [maxFiles, selectedFiles.length]
  );

  // 선택된 파일을 다운로드하여 추가
  const downloadSelectedFiles = useCallback(async () => {
    try {
      setLoading(true, "선택된 파일을 다운로드하는 중...");

      const selectedFiles = driveFiles.filter((file) =>
        selectedDriveFiles.has(file.id)
      );

      const pictureFiles = await Promise.all(
        selectedFiles.map(async (file) => {
          try {
            // Google Drive API를 사용하여 파일 다운로드
            const response = await window.gapi.client.drive.files.get({
              fileId: file.id,
              alt: "media",
            });

            // Blob으로 변환
            const blob = new Blob([response.body], { type: file.mimeType });
            const jsFile = new File([blob], file.name, {
              type: file.mimeType,
              lastModified: new Date(file.createdTime).getTime(),
            });

            return createPictureFile(jsFile, "drive");
          } catch (error) {
            console.error(`파일 다운로드 실패 (${file.name}):`, error);
            throw error;
          }
        })
      );

      addFiles(pictureFiles);
      setSelectedDriveFiles(new Set());
    } catch (error) {
      console.error("파일 다운로드 실패:", error);
      setError("파일 다운로드에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, [driveFiles, selectedDriveFiles, addFiles, setLoading]);

  const formatFileSize = (sizeStr: string | undefined) => {
    if (!sizeStr) return "N/A";
    const bytes = parseInt(sizeStr);
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const driveSelectedFiles = selectedFiles.filter(
    (file) => file.source === "drive"
  );

  return (
    <div className="p-6 space-y-6">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-red-900 mb-2">
                Google Drive 연결 오류
              </h4>
              <p className="text-sm text-red-800 mb-3">{error}</p>

              {/* 구체적인 해결 방법 안내 */}
              {(error.includes("승인된 원본") ||
                error.includes("도메인") ||
                error.includes("unauthorized_client") ||
                error.includes("accounts.google.com")) && (
                <div className="bg-red-100 p-3 rounded text-xs">
                  <p className="font-medium text-red-800 mb-2">🔧 해결 방법:</p>
                  <ol className="list-decimal list-inside space-y-1 text-red-700">
                    <li>
                      <a
                        href="https://console.cloud.google.com/apis/credentials"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-red-800"
                      >
                        Google Cloud Console
                      </a>
                      에서 OAuth 클라이언트 편집
                    </li>
                    <li>
                      <strong>승인된 JavaScript 원본</strong>에{" "}
                      <code>http://localhost:8080</code> 추가
                    </li>
                    <li>
                      <strong>승인된 리디렉션 URI</strong>에{" "}
                      <code>http://localhost:8080</code> 추가
                    </li>
                    <li>설정 저장 후 페이지 새로고침</li>
                  </ol>
                </div>
              )}

              {error.includes("팝업") && (
                <div className="bg-red-100 p-3 rounded text-xs">
                  <p className="font-medium text-red-800 mb-2">🔧 해결 방법:</p>
                  <ul className="list-disc list-inside space-y-1 text-red-700">
                    <li>브라우저 주소창 옆의 팝업 차단 아이콘 클릭</li>
                    <li>이 사이트에서 팝업 허용 설정</li>
                    <li>페이지 새로고침 후 다시 시도</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Setup Instructions */}
      {(!CLIENT_ID || !API_KEY) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-yellow-900 mb-1">
                Google Drive API 설정 필요
              </h4>
              <p className="text-sm text-yellow-800 mb-3">
                Google Drive 기능을 사용하려면 Google API 설정이 필요합니다.
              </p>
              <div className="space-y-3">
                <div className="text-xs text-yellow-700">
                  <p className="font-medium mb-2">🚀 자동 설정 링크:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                    <a
                      href="https://console.cloud.google.com/projectcreate"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 bg-blue-50 text-blue-700 rounded border hover:bg-blue-100 transition-colors"
                    >
                      <span className="text-sm">📁 새 프로젝트 생성</span>
                    </a>
                    <a
                      href="https://console.cloud.google.com/apis/library/drive.googleapis.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 bg-green-50 text-green-700 rounded border hover:bg-green-100 transition-colors"
                    >
                      <span className="text-sm">🔌 Drive API 활성화</span>
                    </a>
                    <a
                      href="https://console.cloud.google.com/apis/credentials/consent"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 bg-purple-50 text-purple-700 rounded border hover:bg-purple-100 transition-colors"
                    >
                      <span className="text-sm">🔐 OAuth 동의화면</span>
                    </a>
                    <a
                      href="https://console.cloud.google.com/apis/credentials"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 bg-orange-50 text-orange-700 rounded border hover:bg-orange-100 transition-colors"
                    >
                      <span className="text-sm">🔑 API 키 & 인증정보</span>
                    </a>
                  </div>
                  <div className="grid grid-cols-1 gap-2 mt-2">
                    <a
                      href="https://console.cloud.google.com/apis/credentials/consent"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 bg-indigo-50 text-indigo-700 rounded border hover:bg-indigo-100 transition-colors"
                    >
                      <span className="text-sm">⚙️ OAuth 동의 화면 설정</span>
                    </a>
                  </div>
                </div>

                <div className="text-xs text-yellow-700">
                  <p className="font-medium mb-1">📋 단계별 가이드:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>위의 "새 프로젝트 생성" 링크로 프로젝트 생성</li>
                    <li>"Drive API 활성화" 링크에서 API 활성화</li>
                    <li>
                      "OAuth 동의화면" 링크에서 앱 정보 설정 (사용자 유형: 외부)
                    </li>
                    <li>
                      "OAuth 동의 화면 설정"에서 승인된 도메인에{" "}
                      <code>localhost</code> 추가
                    </li>
                    <li>
                      "API 키 & 인증정보" 링크에서 클라이언트 ID와 API 키 생성
                    </li>
                    <li>
                      OAuth 클라이언트 설정에서 현재 도메인 (
                      <code>
                        {typeof window !== "undefined"
                          ? window.location.origin
                          : "http://localhost:8080"}
                      </code>
                      ) 추가
                    </li>
                    <li>아래 환경변수에 복사하여 .env 파일 설정</li>
                  </ol>
                </div>

                <div className="text-xs text-yellow-700 mt-3">
                  <p className="font-medium mb-1">⚠️ 일반적인 오류 해결:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      <strong>"ID 공급업체로 계속할 수 없음":</strong> OAuth
                      클라이언트 설정에서 도메인 추가 필요
                    </li>
                    <li>
                      <strong>"unauthorized_client":</strong> 승인된 JavaScript
                      원본에 현재 도메인 추가
                    </li>
                    <li>
                      <strong>"redirect_uri_mismatch":</strong> 승인된 리디렉션
                      URI에 현재 도메인 추가
                    </li>
                    <li>
                      <strong>"팝업 차단":</strong> 브라우저 설정에서 팝업 허용
                      후 재시도
                    </li>
                  </ul>
                </div>
                <div className="bg-yellow-100 p-3 rounded text-xs">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-yellow-800">
                      💾 환경 변수 템플릿:
                    </p>
                    <button
                      onClick={() => {
                        const template = `# Google Drive API Configuration
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here.apps.googleusercontent.com
VITE_GOOGLE_API_KEY=AIza************************`;
                        navigator.clipboard.writeText(template);
                        alert("환경 변수 템플릿이 클립보드에 복사되었습니다!");
                      }}
                      className="text-blue-600 hover:text-blue-700 underline"
                    >
                      📋 복사
                    </button>
                  </div>
                  <code className="block text-yellow-700 bg-white p-2 rounded">
                    VITE_GOOGLE_CLIENT_ID=your-client-id
                    <br />
                    VITE_GOOGLE_API_KEY=your-api-key
                  </code>
                  <p className="text-yellow-600 mt-2">
                    💡 "복사" 버튼을 클릭하여 .env 파일용 템플릿을 복사하세요
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* API Loading Status */}
      {(!isGapiLoaded || !isGisLoaded) && CLIENT_ID && API_KEY && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-blue-900 mb-1">
                Google 서비스 초기화 중
              </h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p>
                  ✓ Google API (Drive): {isGapiLoaded ? "완료" : "로딩 중..."}
                </p>
                <p>
                  ✓ Google Identity Services:{" "}
                  {isGisLoaded ? "완료" : "로딩 중..."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Google Drive Connection */}
      {isGapiLoaded && isGisLoaded && (
        <div className="space-y-4">
          {!isAuthorized ? (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Cloud className="w-16 h-16 text-gray-400" />
              </div>

              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Google Drive에 연결
              </h3>

              <p className="text-sm text-gray-600 mb-6">
                Google Drive에서 이미지를 선택하려면 계정에 로그인하세요
              </p>

              <button
                onClick={signIn}
                disabled={!isGapiLoaded || !isGisLoaded || !tokenClient}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <Cloud className="w-4 h-4" />
                {!isGapiLoaded || !isGisLoaded
                  ? "Google 서비스 로드 중..."
                  : "Google Drive 연결"}
              </button>
            </div>
          ) : (
            <>
              {/* Connected Status */}
              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <Cloud className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    Google Drive에 연결됨
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={loadDriveFiles}
                    className="text-sm text-green-700 hover:text-green-800"
                  >
                    새로고침
                  </button>
                  <button
                    onClick={signOut}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    연결 해제
                  </button>
                </div>
              </div>

              {/* Drive Files Grid */}
              {driveFiles.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-medium text-gray-900">
                      이미지 파일 ({driveFiles.length})
                    </h4>

                    {selectedDriveFiles.size > 0 && (
                      <button
                        onClick={downloadSelectedFiles}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        선택한 파일 추가 ({selectedDriveFiles.size})
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {driveFiles.map((file) => (
                      <div
                        key={file.id}
                        className={`relative cursor-pointer border rounded-lg overflow-hidden transition-all ${
                          selectedDriveFiles.has(file.id)
                            ? "border-blue-500 ring-2 ring-blue-200"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => toggleFileSelection(file.id)}
                      >
                        {/* Thumbnail */}
                        <div className="aspect-square bg-gray-100 flex items-center justify-center">
                          {file.thumbnailUrl ? (
                            <img
                              src={file.thumbnailUrl}
                              alt={file.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Cloud className="w-8 h-8 text-gray-400" />
                          )}
                        </div>

                        {/* File Info */}
                        <div className="p-2">
                          <p
                            className="text-xs font-medium text-gray-900 truncate"
                            title={file.name}
                          >
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(file.size)}
                          </p>
                        </div>

                        {/* Selection Indicator */}
                        {selectedDriveFiles.has(file.id) && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center">
                            <span className="text-xs">✓</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Selected Files from Drive */}
      {driveSelectedFiles.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">
            선택된 Drive 파일 ({driveSelectedFiles.length})
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {driveSelectedFiles.map((file) => (
              <div
                key={file.id}
                className="relative group bg-gray-50 rounded-lg overflow-hidden border"
              >
                <div className="aspect-square">
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <Cloud className="w-3 h-3 text-blue-500" />
                        <span className="text-xs text-blue-600">
                          Google Drive
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => removeFile(file.id)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                  aria-label="파일 삭제"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="text-sm text-gray-500 space-y-1">
        <p>• Google Drive에 저장된 이미지 파일을 선택할 수 있습니다</p>
        <p>• 선택한 파일은 안전하게 다운로드되어 로컬에서 처리됩니다</p>
        <p>• 파일 읽기 권한만 필요하며, Drive 내용을 수정하지 않습니다</p>
        {selectedFiles.length >= maxFiles && (
          <p className="text-red-500">
            • 최대 {maxFiles}개까지 선택 가능합니다
          </p>
        )}
      </div>
    </div>
  );
};
