import { environment } from '../../environments/environment';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService, LoginRequest, LoginResponse } from './auth.service';
import { Router } from '@angular/router';
import { vi } from 'vitest';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    const routerSpy = { navigate: vi.fn() };
    
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: routerSpy }
      ]
    });
    
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login successfully and store token', () => {
    const mockLoginRequest: LoginRequest = {
      email: 'test@example.com',
      password: 'password123'
    };

    const mockLoginResponse: LoginResponse = {
      accessToken: 'mock-jwt-token',
      refreshToken: 'mock-refresh-token',
      userId: 1,
      email: 'test@example.com',
      fullName: 'Test User',
      role: 'Kupac',
      ime: 'Test',
      prezime: 'User',
      uloga: 'Kupac'
    };

    service.login(mockLoginRequest).subscribe(response => {
      expect(response.accessToken).toBe('mock-jwt-token');
      expect(localStorage.getItem('token')).toBe('mock-jwt-token');
      expect(localStorage.getItem('currentUser')).toBeTruthy();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockLoginRequest);
    req.flush(mockLoginResponse);
  });

  it('should logout and clear storage', () => {
    localStorage.setItem('token', 'test-token');
    localStorage.setItem('currentUser', JSON.stringify({ ime: 'Test' }));

    service.logout();

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('currentUser')).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/kupac']);
  });

  it('should check if user is authenticated', () => {
    expect(service.isAuthenticated()).toBe(false);

    localStorage.setItem('token', 'test-token');
    service['currentUserSubject'].next({
      accessToken: 'token',
      refreshToken: 'refresh-token',
      email: 'test@example.com',
      fullName: 'Test User',
      role: 'Kupac',
      userId: 1
    });
    expect(service.isAuthenticated()).toBe(true);
  });

  it('should get current user', () => {
    const mockUser: LoginResponse = {
      accessToken: 'token',
      refreshToken: 'refresh-token',
      email: 'test@example.com',
      fullName: 'Test User',
      role: 'Majstor',
      userId: 1,
      uloga: 'Majstor',
      ime: 'Test'
    };
    
    localStorage.setItem('currentUser', JSON.stringify(mockUser));
    service['currentUserSubject'].next(mockUser);
    
    const currentUser = service.getCurrentUser();
    expect(currentUser?.uloga).toBe('Majstor');
  });
});
