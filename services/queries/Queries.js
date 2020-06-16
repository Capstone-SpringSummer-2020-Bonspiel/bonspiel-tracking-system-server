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

const GET_ALL_GAMES_IN_CURLING_EVENT = `
SELECT curlingteam1.name as team_name1, curlingteam2.name as team_name2 game.*
FROM public.game
JOIN public.curlingteam as curlingteam1 ON game.curlingteam1_id=curlingteam1.id
JOIN public.curlingteam as curlingteam2 ON game.curlingteam2_id=curlingteam2.id
JOIN public.draw ON game.draw_id=draw.id
WHERE draw.event_id=1
ORDER BY game.id;`;

const GET_ALL_DRAWS_IN_CURLING_EVENT = `
SELECT draw.*
FROM public.draw
JOIN public.curlingevent ON curlingevent.id=draw.event_id
WHERE curlingevent.id=$1
`;

const GET_ALL_GAMES_AND_SCORES = `
SELECT curlingteam.name, game.*, endscore.*
FROM public.game
JOIN public.curlingteam ON game.curlingteam1_id=curlingteam.id
JOIN public.eventteams ON eventteams.team_id=curlingteam.id
JOIN public.curlingevent ON curlingevent.id=eventteams.event_id
JOIN public.endscore ON game.id=endscore.game_id
WHERE curlingevent.id=$1
UNION
SELECT curlingteam.name, game.*, endscore.*
FROM public.game
JOIN public.curlingteam ON game.curlingteam2_id=curlingteam.id
JOIN public.eventteams ON eventteams.team_id=curlingteam.id
JOIN public.curlingevent ON curlingevent.id=eventteams.event_id
JOIN public.endscore ON game.id=endscore.game_id
WHERE curlingevent.id=$1;
`;

const GET_ALL_GAMES_AND_SCORES_BY_TEAM_IN_CURLING_EVENT = `
SELECT curlingteam.name, game.*, endscore.*
FROM public.game
JOIN public.curlingteam ON game.curlingteam1_id=curlingteam.id
JOIN public.eventteams ON eventteams.team_id=curlingteam.id
JOIN public.curlingevent ON curlingevent.id=eventteams.event_id
JOIN public.endscore ON game.id=endscore.game_id
WHERE curlingevent.id=$1
AND curlingteam.id=$2
UNION
SELECT curlingteam.name, game.*, endscore.*
FROM public.game
JOIN public.curlingteam ON game.curlingteam2_id=curlingteam.id
JOIN public.eventteams ON eventteams.team_id=curlingteam.id
JOIN public.curlingevent ON curlingevent.id=eventteams.event_id
JOIN public.endscore ON game.id=endscore.game_id
WHERE curlingevent.id=$1
AND curlingteam.id=$2;
`;

module.exports = {
  GET_ALL_TEAMS_IN_CURLING_EVENT,
  GET_ALL_TEAMS,
  GET_ALL_GAMES_IN_CURLING_EVENT,
  GET_ALL_GAMES_BY_TEAM_IN_CURLING_EVENT,
  GET_ALL_DRAWS_IN_CURLING_EVENT,
  GET_ALL_GAMES_AND_SCORES,
  GET_ALL_GAMES_AND_SCORES_BY_TEAM_IN_CURLING_EVENT
};