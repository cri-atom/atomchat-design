import { isLegacyConfig } from './services.config';

describe('services.config', () => {
  it('detects legacy array-based config', () => {
    const legacyConfig = {
      services: [class A {}, class B {}, class C {}, class D {}, class E {}],
    } as any;

    expect(isLegacyConfig(legacyConfig)).toBeTrue();
  });

  it('rejects typed object-based config as legacy', () => {
    const typedConfig = {
      services: {
        authService: class AuthMock {},
      },
    };

    expect(isLegacyConfig(typedConfig)).toBeFalse();
    expect(isLegacyConfig(null)).toBeFalse();
    expect(isLegacyConfig(undefined)).toBeFalse();
  });
});
