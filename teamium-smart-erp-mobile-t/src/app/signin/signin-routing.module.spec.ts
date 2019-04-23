import { SigninRoutingModule } from './signin-routing.module';

describe('SigninRoutingModule', () => {
  let signinRoutingModule: SigninRoutingModule;

  beforeEach(() => {
    signinRoutingModule = new SigninRoutingModule();
  });

  it('should create an instance', () => {
    expect(signinRoutingModule).toBeTruthy();
  });
});
