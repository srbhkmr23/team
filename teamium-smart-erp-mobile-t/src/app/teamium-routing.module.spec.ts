import { TeamiumRoutingModule } from './teamium-routing.module';

describe('TeamiumRoutingModule', () => {
  let teamiumRoutingModule: TeamiumRoutingModule;

  beforeEach(() => {
    teamiumRoutingModule = new TeamiumRoutingModule();
  });

  it('should create an instance', () => {
    expect(teamiumRoutingModule).toBeTruthy();
  });
});
