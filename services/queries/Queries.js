const GET_ALL_TEAMS_IN_CURLING_EVENT = `
SELECT *
FROM public.eventteams as eventTeams join curlingteam on eventTeams.team_id=curlingteam.id
WHERE eventTeams.event_id=$1;
`;

const GET_ALL_TEAMS = `
SELECT team.id, team.name
FROM public.curlingteam;
`;

module.exports = {
  GET_ALL_TEAMS_IN_CURLING_EVENT,
  GET_ALL_TEAMS
};