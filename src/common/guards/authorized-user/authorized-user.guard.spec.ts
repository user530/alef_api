import { AuthorizedUserGuard } from './authorized-user.guard';

describe('AuthorizedUserGuard', () => {
  it('should be defined', () => {
    expect(new AuthorizedUserGuard()).toBeDefined();
  });
});
