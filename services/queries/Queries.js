const GET_ALL_TEAMS_IN_CURLING_EVENT = `SELECT distinct team1.name
FROM public.curlingteam as team1
join public.game as game1 on team1.id=game1.curlingteam1_id
join public.draw as draw1 on draw1.id=game1.draw_id
join public.curlingevent as ce1 on ce1.id=draw1.event_id
WHERE ce1.id=$1
UNION
SELECT distinct team2.name
FROM curlingteam as team2
join game as game2 on team2.id=game2.curlingteam2_id
join draw as draw2 on draw2.id=game2.draw_id
join curlingevent as ce2 on ce2.id=draw2.event_id
WHERE ce2.id=$1
ORDER BY name;`;

module.exports = {
  GET_ALL_TEAMS_IN_CURLING_EVENT
};