import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('stores a token after login and clears it on logout', () => {
    service.login({ username: 'alice', password: 'secret' }).subscribe();

    const req = httpMock.expectOne('http://localhost:8080/api/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush('dummy.jwt.token');

    expect(service.isLoggedIn()).toBeTrue();
    expect(service.getCurrentUsername()).toBe('alice');

    service.logout();

    expect(service.isLoggedIn()).toBeFalse();
    expect(service.getCurrentUsername()).toBeNull();
  });
});
