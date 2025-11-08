# EmailJS 설정 가이드

문의 폼 기능을 사용하기 위해 EmailJS 설정이 필요합니다.

## 1. EmailJS 계정 생성

1. [EmailJS 웹사이트](https://www.emailjs.com/)에 접속
2. "Sign Up" 버튼 클릭하여 무료 계정 생성
3. 이메일 인증 완료

## 2. Email Service 설정

1. EmailJS 대시보드에서 **Email Services** 메뉴 클릭
2. **Add New Service** 버튼 클릭
3. 이메일 서비스 제공자 선택 (Gmail, Outlook 등)
4. Gmail 선택 시:
   - Gmail 계정 연결
   - 서비스 이름 입력 (예: "gmail")
5. **Create Service** 클릭
6. 생성된 **Service ID** 복사 (예: `service_xxxxx`)

### ⚠️ Gmail 연결 시 오류 해결 (412 오류)

**오류 메시지**: `412 Gmail_API: Request had insufficient authentication scopes`

이 오류는 Gmail API에 필요한 권한이 부족할 때 발생합니다. 다음 단계를 따라 해결하세요:

1. **현재 Gmail 연결 해제**
   - EmailJS 설정 화면에서 "Disconnect" 버튼 클릭
   - 기존 연결을 완전히 해제합니다

2. **Gmail 계정 재연결**
   - "Gmail Connect" 버튼을 다시 클릭
   - Google 로그인 화면이 나타나면 계정 선택

3. **⚠️ 중요: 모든 권한 허용**
   - Google OAuth 동의 화면이 나타나면 **반드시 모든 권한을 허용**해야 합니다
   - 특히 **"Send email on your behalf" (대신 이메일 보내기)** 권한을 **반드시 체크**하세요
   - 이 권한이 없으면 EmailJS가 Gmail을 통해 이메일을 보낼 수 없습니다
   - "허용" 또는 "Allow" 버튼을 클릭하여 모든 권한 부여

4. **서비스 생성 재시도**
   - 권한을 올바르게 부여한 후 "Create Service" 버튼을 다시 클릭
   - 이제 정상적으로 서비스가 생성됩니다

**팁**: 
- 권한 화면에서 "취소"를 누르거나 일부 권한만 허용하면 오류가 발생합니다
- 처음부터 모든 권한을 허용하는 것이 가장 확실한 방법입니다

## 3. Email Template 생성

1. **Email Templates** 메뉴 클릭
2. **Create New Template** 버튼 클릭
3. 다음 변수들을 사용하여 템플릿 작성:

```
제목: 문의사항 - {{from_name}}

보낸 사람: {{from_name}}
이메일: {{from_email}}

문의 내용:
{{message}}

---
이 이메일은 {{from_email}}로 답장하실 수 있습니다.
```

4. **To Email** 필드에 받을 이메일 주소 입력: `handpansnd@gmail.com`
5. **From Name** 필드에 `{{from_name}}` 입력
6. **Reply To** 필드에 `{{from_email}}` 입력
7. **Save** 클릭
8. 생성된 **Template ID** 복사 (예: `template_xxxxx`)

## 4. Public Key 확인

1. **Account** 메뉴 클릭
2. **General** 탭에서 **Public Key** 확인 및 복사 (예: `xxxxxxxxxxxxx`)

## 5. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용 추가:

```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

**주의**: 
- `.env.local` 파일은 Git에 커밋하지 마세요 (이미 .gitignore에 포함되어 있을 것입니다)
- 실제 값으로 교체하세요 (예: `service_abc123`)
- 환경 변수는 프로덕션 배포 시에도 설정해야 합니다 (Vercel, Netlify 등의 플랫폼 설정에서)

**예시** (실제 설정된 값):
```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_64i70l1
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_g7nq8oc
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=gA6b7-yhIGmYYdUan
```

## 6. 개발 서버 재시작

환경 변수를 추가한 후 개발 서버를 재시작하세요:

```bash
npm run dev
```

## 무료 플랜 제한사항

- 월 200통의 이메일 전송 가능
- 추가 전송이 필요한 경우 유료 플랜으로 업그레이드 가능

## 문제 해결

### 이메일이 전송되지 않는 경우

1. 환경 변수가 올바르게 설정되었는지 확인
2. EmailJS 대시보드에서 서비스와 템플릿이 활성화되어 있는지 확인
3. 브라우저 콘솔에서 에러 메시지 확인
4. EmailJS 대시보드의 **Logs** 메뉴에서 전송 기록 확인

### Gmail 사용 시

- Gmail을 서비스로 사용하는 경우, 처음에는 스팸 폴더를 확인하세요
- Gmail 보안 설정에서 "보안 수준이 낮은 앱의 액세스"를 허용해야 할 수 있습니다
- 더 안정적인 전송을 위해 SendGrid나 Mailgun 같은 전문 이메일 서비스를 사용하는 것을 권장합니다

### 412 Gmail_API 인증 오류 해결

**증상**: "Create Service" 클릭 시 `412 Gmail_API: Request had insufficient authentication scopes` 오류 발생

**원인**: Gmail 계정 연결 시 필요한 권한(특히 "Send email on your behalf")이 제대로 부여되지 않음

**해결 방법**:

1. **기존 연결 해제**
   ```
   EmailJS 설정 화면 → "Disconnect" 버튼 클릭
   ```

2. **Gmail 재연결**
   ```
   "Gmail Connect" 버튼 클릭 → Google 로그인
   ```

3. **모든 권한 허용 (매우 중요!)**
   ```
   Google OAuth 동의 화면에서:
   ✅ "Send email on your behalf" 체크 (필수!)
   ✅ 기타 모든 권한도 허용
   → "허용" 또는 "Allow" 클릭
   ```

4. **서비스 생성 재시도**
   ```
   "Create Service" 버튼 다시 클릭
   ```

**주의사항**:
- 권한 화면에서 "취소"를 누르면 안 됩니다
- 일부 권한만 허용해도 오류가 발생할 수 있습니다
- 처음부터 모든 권한을 허용하는 것이 가장 확실합니다

## 대안: Formspree 사용

더 간단한 방법을 원하시면 Formspree를 사용할 수도 있습니다:

1. [Formspree](https://formspree.io/) 계정 생성
2. 새 폼 생성
3. 생성된 엔드포인트 URL 사용
4. InquiryForm 컴포넌트를 Formspree용으로 수정

Formspree는 HTML 폼만 있으면 되므로 더 간단하지만, 커스터마이징이 제한적입니다.

