# 05: Vercel 배포 확인 (사람이 직접 진행)

**What to build:** 완성된 앱을 GitHub(`yooyunwoo/Todo-app`)에 push하고 Vercel로 배포한다. 배포 사이트에서도 로컬과 같은 목록을 보고 추가·체크·삭제를 할 수 있다. 다른 사람이 바꾼 내용은 새로고침하거나 내가 무언가를 바꿀 때 보인다 (실시간 동기화 없음).

**Blocked by:** 03 (완료 체크 / 되돌리기), 04 (삭제)

**Status:** needs-human (Vercel 로그인과 환경변수 입력은 사람이 해야 함)

- [ ] push 전 `git status`에 `.env.local`이 보이지 않는다
- [ ] Vercel 프로젝트에 `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN` 두 환경변수가 들어가 있다
- [ ] 배포 주소로 접속된다
- [ ] 배포 사이트에서 추가·체크·삭제가 된다
- [ ] 로컬에서 만든 할 일이 배포 사이트에도 보인다
- [ ] 환경변수를 고쳤다면 Redeploy한 뒤 다시 확인했다
