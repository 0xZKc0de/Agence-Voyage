import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from './services/auth.service'; // تأكد من صحة المسار لمجلد auth
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // نتحقق من حالة المستخدم من خلال الـ AuthService
  return authService.checkSession().pipe(
    take(1), // نأخذ أول نتيجة فقط ونغلق الاتصال
    map(user => {
      if (user) {
        // إذا كان هناك مستخدم، اسمح له بالدخول
        return true;
      } else {
        // إذا لم يكن مسجلاً، حوله لصفحة تسجيل الدخول
        router.navigate(['/auth/login']);
        return false;
      }
    })
  );
};
