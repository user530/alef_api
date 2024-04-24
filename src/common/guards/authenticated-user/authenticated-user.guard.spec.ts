import { AuthenticatedUserGuard } from './authenticated-user.guard';

describe('AuthenticatedUserGuard', () => {
  it('should be defined', () => {
    expect(new AuthenticatedUserGuard()).toBeDefined();
  });
});
