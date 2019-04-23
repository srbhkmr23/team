import { TeamiumModule } from './teamium.module';

describe('TeamiumModule', () => {
  let teamiumModule: TeamiumModule;

  beforeEach(() => {
    teamiumModule = new TeamiumModule();
  });

  it('should create an instance', () => {
    expect(teamiumModule).toBeTruthy();
  });
});
