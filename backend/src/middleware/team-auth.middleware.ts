import { Request, Response, NextFunction } from 'express';
import { Team } from '../models/team.model';
import { ApiError } from '../utils/ApiError';

export const requireTeamMembership = (
  minRole: 'member' | 'admin' | 'owner' = 'member',
) => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction,
  ) => {
    const { teamId } = req.body || req.params || req.query;
    if (!teamId) return next(new ApiError(400, 'teamId required'));
    const team = await Team.findById(teamId).lean();
    if (!team) return next(new ApiError(404, 'Team not found'));

    const member = team.members.find(
      (m: any) => m.userId.toString() === req.user._id.toString(),
    );
    if (!member) return next(new ApiError(403, 'Not a member of the team'));

    const rolePriority = { member: 1, admin: 2, owner: 3 };
    if (rolePriority[member.role] < rolePriority[minRole]) {
      return next(new ApiError(403, 'Insufficient role'));
    }

    (req as any).team = team;
    (req as any).teamRole = member.role;
    return next();
  };
};
