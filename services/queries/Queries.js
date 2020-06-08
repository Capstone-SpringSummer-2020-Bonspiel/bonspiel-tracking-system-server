/*
 * @param event_id
 */
const GET_ALL_TEAMS_IN_CURLING_EVENT = `
SELECT *
FROM public.eventteams as eventTeams join curlingteam on eventTeams.team_id=curlingteam.id
WHERE eventTeams.event_id=$1;
`;

const GET_ALL_TEAMS = `
SELECT team.id, team.name
FROM public.curlingteam;
`;

/*
 * @param curlingEventId, curlingTeamId
 */
const GET_ALL_GAMES_BY_TEAM_IN_CURLING_EVENT = `
SELECT curlingteam.name as team_name, game.*
FROM public.game
JOIN public.curlingteam ON game.curlingteam1_id=curlingteam.id
JOIN public.eventteams ON eventteams.team_id=curlingteam.id
JOIN public.curlingevent ON curlingevent.id=eventteams.event_id
WHERE curlingteam.id=$2
AND curlingevent.id=$1
UNION
SELECT curlingteam.name as team_name, game.*
FROM public.game
JOIN public.curlingteam ON game.curlingteam2_id=curlingteam.id
JOIN public.eventteams ON eventteams.team_id=curlingteam.id
JOIN public.curlingevent ON curlingevent.id=eventteams.event_id
WHERE curlingteam.id=$2
AND curlingevent.id=$1;
`;

module.exports = {
  GET_ALL_TEAMS_IN_CURLING_EVENT,
  GET_ALL_TEAMS,
  GET_ALL_GAMES_BY_TEAM_IN_CURLING_EVENT
};