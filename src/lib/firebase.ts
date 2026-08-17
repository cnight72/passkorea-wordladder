import type { Firestore } from 'firebase/firestore';

/**
 * Firebase 웹 설정값은 비밀이 아니다. 프로젝트를 가리키는 식별자일 뿐이고
 * 배포된 JS 번들에 어차피 그대로 실린다. 실제 보호는 Firestore 보안 규칙이 한다.
 * (저장소 루트의 firestore.rules 참고)
 */
const firebaseConfig = {
  apiKey: 'AIzaSyByOs3b45elj8kGK7R0KHZFUCB14j3aXvY',
  authDomain: 'passkorea-wordchain.firebaseapp.com',
  projectId: 'passkorea-wordchain',
  storageBucket: 'passkorea-wordchain.firebasestorage.app',
  messagingSenderId: '831623502926',
  appId: '1:831623502926:web:4746e8b985b800fef7b71f',
};

export interface FirebaseBundle {
  db: Firestore;
  uid: string;
  firestore: typeof import('firebase/firestore');
}

let bundlePromise: Promise<FirebaseBundle | null> | null = null;

/**
 * Firebase SDK는 gzip 기준 150KB가 넘는다. 첫 화면에는 필요 없으므로
 * 점수 전송·리더보드 조회 시점에만 내려받는다.
 *
 * 실패하면 null을 돌려주고, 호출하는 쪽은 리더보드 없이 계속 동작해야 한다.
 */
export function getFirebase(): Promise<FirebaseBundle | null> {
  if (!bundlePromise) bundlePromise = load();
  return bundlePromise;
}

async function load(): Promise<FirebaseBundle | null> {
  try {
    const [appMod, authMod, firestoreMod] = await Promise.all([
      import('firebase/app'),
      import('firebase/auth'),
      import('firebase/firestore'),
    ]);

    const app = appMod.initializeApp(firebaseConfig);
    const auth = authMod.getAuth(app);
    const db = firestoreMod.getFirestore(app);

    const uid = await signIn(auth, authMod);
    if (!uid) return null;

    return { db, uid, firestore: firestoreMod };
  } catch {
    return null;
  }
}

function signIn(
  auth: import('firebase/auth').Auth,
  authMod: typeof import('firebase/auth')
): Promise<string | null> {
  return new Promise((resolve) => {
    // 네트워크가 막힌 환경에서 무한 대기하지 않도록 상한을 둔다
    const timeout = setTimeout(() => resolve(null), 10_000);

    const done = (uid: string | null) => {
      clearTimeout(timeout);
      unsubscribe();
      resolve(uid);
    };

    const unsubscribe = authMod.onAuthStateChanged(
      auth,
      (user) => {
        if (user) done(user.uid);
      },
      () => done(null)
    );

    authMod.signInAnonymously(auth).catch(() => done(null));
  });
}
