import { SignupRoutingModule } from './signup-routing.module';

describe('SignupRoutingModule', () => {
  let signupRoutingModule: SignupRoutingModule;

  beforeEach(() => {
    signupRoutingModule = new SignupRoutingModule();
  });

  it('should create an instance', () => {
    expect(signupRoutingModule).toBeTruthy();
  });
});
