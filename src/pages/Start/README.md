# StartPage 관련 할 일 목록

## TODO
1. StartPage 수정사항
   - [ ] 카카오톡 링크 입장 테스트 버튼 삭제 (디버깅용 버튼 제거)

2. LinkInPage 수정사항
   - [ ] isValid 판정 로직을 실제 Link Type에 맞게 변경
   - [ ] 현재는 임시로 "링크" 텍스트 포함 여부로만 판단 중
   - [ ] 실제 유효한 참여 링크 형식으로 검증 로직 구현 필요 

3. KakaoInPage 수정사항
   - [ ] 임시 데이터(familyName, userName) 삭제
   - [ ] API 연동하여 실제 가족 및 사용자 정보 받아오기
   - [ ] 참여 코드 검증 로직 구현 

4. MakeConfirmPage 수정사항
   - [x] 임시 테스트용 데이터 구현
     - userName: 라우팅 경로별 다른 샘플 데이터 사용
       - FirstMakePage 라우팅: "새로만든사람"
       - LinkInPage 라우팅: "링크만든사람"
     - familyName: FirstMakePage에서 입력한 값 또는 샘플 데이터 사용
   - [ ] API 연동
     - [ ] userName: 백엔드에서 회원 정보 받아오기
     - [ ] familyName: FirstMakePage에서 입력한 값 또는 LinkInPage 접근 시 백엔드에서 가족 정보 받아오기
   - [x] 라우팅 경로별 다른 메시지 표시 구현
     - FirstMakePage: "[userName]님이 [familyName]의 방장입니다."
     - LinkInPage: "[userName]님이 만든 [familyName]에 참여합니다."

## 구현 상세
### MakeConfirmPage 데이터 흐름
1. userName
   - 현재: 라우팅 경로에 따라 다른 샘플 데이터 사용
     - FirstMakePage에서 온 경우: "새로만든사람"
     - LinkInPage에서 온 경우: "링크만든사람"
   - 추후: 회원가입 시 입력한 이름을 백엔드에서 받아옴

2. familyName
   - FirstMakePage 라우팅: state로 전달받은 familyName 사용
   - LinkInPage 라우팅: "테스트용가족이름" (임시) → 추후 백엔드에서 가족 정보 받아옴 

3. 메시지 표시
   - FirstMakePage 라우팅: "[userName]님이 [familyName]의 방장입니다."
   - LinkInPage 라우팅: "[userName]님이 만든 [familyName]에 참여합니다." 