/*
 * @param event_id
 */
const GET_ALL_TEAMS_IN_CURLING_EVENT = `
SELECT curler.id as curler_id, curler.name as curler_name, curler.position as curler_position, curler.throwing_order as throwing_order, curlingteam.id as curlingteam_id, curler.affiliation as curler_affiliation, curlingteam.affiliation as curlingteam_affiliation, curlingteam.name as curlingteam_name, curlingteam.note as curlingteam_note, organization.short_name as org_short_name, organization.full_name as org_full_name
FROM eventteams as eventTeams 
JOIN curlingteam on eventTeams.team_id=curlingteam.id
FULL JOIN curler on curler.curlingteam_id=curlingteam.id
JOIN organization on organization.id=curler.affiliation
WHERE eventTeams.event_id=$1;
`;

const GET_ALL_CURLERS = `
SELECT curler.id as curler_id, curler.name as curler_name, curler.position as curler_position, curler.throwing_order as throwing_order, curlingteam.id as curlingteam_id, curler.affiliation as curler_affiliation, curlingteam.affiliation as curlingteam_affiliation, curlingteam.name as curlingteam_name, curlingteam.note as curlingteam_note, team_org.short_name as curlingteam_org_short_name, team_org.full_name as curlingteam_org_full_name, curler_org.short_name as curler_org_short_name, curler_org.full_name as curler_org_full_name
FROM curlingteam
FULL JOIN curler on curler.curlingteam_id=curlingteam.id
LEFT JOIN organization as team_org on team_org.id=curlingteam.affiliation
LEFT JOIN organization as curler_org on curler_org.id=curler.affiliation;
`;

const GET_CURLING_TEAM = `
SELECT curler.id as curler_id, curler.name as curler_name, curler.position as curler_position, curler.throwing_order as throwing_order, curlingteam.id as curlingteam_id, curler.affiliation as curler_affiliation, curlingteam.affiliation as curlingteam_affiliation, curlingteam.name as curlingteam_name, curlingteam.note as curlingteam_note, organization.short_name as org_short_name, organization.full_name as org_full_name
FROM curlingteam
FULL JOIN curler on curler.curlingteam_id=curlingteam.id
JOIN organization on organization.id=curler.affiliation
WHERE curlingteam.id=$1;
`;

const GET_ALL_GAMES_IN_CURLING_EVENT = `
SELECT 
curlingteam1.name as team_name1, curlingteam2.name as team_name2, 
game.id as game_id, game.event_type, game.game_name, game.notes, game.bracket_id, game.pool_id, game.draw_id, game.curlingteam1_id, game.curlingteam2_id, game.stone_color1, game.stone_color2, game.winner_dest, game.loser_dest, game.ice_sheet, game.finished, game.winner, 
endscore.id as endscore_id, endscore.end_number, endscore.curlingteam1_scored, endscore.score, endscore.blank
FROM game
LEFT JOIN curlingteam as curlingteam1 ON game.curlingteam1_id=curlingteam1.id
LEFT JOIN curlingteam as curlingteam2 ON game.curlingteam2_id=curlingteam2.id
JOIN draw ON game.draw_id=draw.id
LEFT OUTER JOIN (
SELECT endscore.*
FROM (
	SELECT endscore.game_id, MAX(endscore.end_number) as end_number
	FROM endscore
	GROUP BY endscore.game_id
) as max_end_number inner join endscore 
on endscore.end_number=max_end_number.end_number
and endscore.game_id=max_end_number.game_id
) as endscore ON endscore.game_id=game.id
WHERE draw.event_id=$1
ORDER BY curlingteam1_id;`;

const GET_ALL_EVENT_TEAMS_IN_EVENT = `
SELECT event_id, team_id, affiliation, curlingteam.name as team_name, note
FROM eventteams
JOIN curlingteam ON curlingteam.id=eventteams.team_id
WHERE event_id=$1;
`;

const GET_ALL_GAMES_BY_TEAM = `
SELECT curlingteam1.name as team_name1, curlingteam2.name as team_name2,
game.id as game_id, game.event_type, game.game_name, game.notes, game.bracket_id, game.pool_id, game.draw_id, game.curlingteam1_id, game.curlingteam2_id, game.stone_color1, game.stone_color2, game.winner_dest, game.loser_dest, game.ice_sheet, game.finished, game.winner 
FROM game
JOIN curlingteam as curlingteam1 ON game.curlingteam1_id=curlingteam1.id
JOIN curlingteam as curlingteam2 ON game.curlingteam2_id=curlingteam2.id
JOIN draw ON game.draw_id=draw.id
WHERE draw.event_id=$1
AND (curlingteam1_id=$2 OR curlingteam2_id=$2);`;

const GET_ALL_DRAWS_IN_CURLING_EVENT = `
SELECT draw.*
FROM public.draw
JOIN public.curlingevent ON curlingevent.id=draw.event_id
WHERE curlingevent.id=$1
`;

const GET_ALL_GAMES_AND_SCORES = `
SELECT 
curlingteam1.name as team_name1, curlingteam2.name as team_name2, 
game.id as game_id, game.event_type, game.game_name, game.notes, game.bracket_id, game.pool_id, game.draw_id, game.curlingteam1_id, game.curlingteam2_id, game.stone_color1, game.stone_color2, game.winner_dest, game.loser_dest, game.ice_sheet, game.finished, game.winner, 
endscore.id as endscore_id, endscore.end_number, endscore.curlingteam1_scored, endscore.score, endscore.blank
FROM game
JOIN curlingteam as curlingteam1 ON game.curlingteam1_id=curlingteam1.id
JOIN curlingteam as curlingteam2 ON game.curlingteam2_id=curlingteam2.id
JOIN draw ON game.draw_id=draw.id
LEFT OUTER JOIN endscore ON endscore.game_id=game.id
WHERE draw.event_id=$1
ORDER BY curlingteam1_id;
`;

const GET_ALL_GAMES_AND_SCORES_BY_TEAM = `
SELECT 
curlingteam1.name as team_name1, curlingteam2.name as team_name2, 
game.id as game_id, game.event_type, game.game_name, game.notes, game.bracket_id, game.pool_id, game.draw_id, game.curlingteam1_id, game.curlingteam2_id, game.stone_color1, game.stone_color2, game.winner_dest, game.loser_dest, game.ice_sheet, game.finished, game.winner, 
endscore.id as endscore_id, endscore.end_number, endscore.curlingteam1_scored, endscore.score, endscore.blank
FROM game
JOIN curlingteam as curlingteam1 ON game.curlingteam1_id=curlingteam1.id
JOIN curlingteam as curlingteam2 ON game.curlingteam2_id=curlingteam2.id
JOIN draw ON game.draw_id=draw.id
LEFT OUTER JOIN endscore ON endscore.game_id=game.id
WHERE draw.event_id=$1
AND (curlingteam1_id=$2 OR curlingteam2_id=$2);
`;

const GET_ALL_ADMINS = `
SELECT username, issuperadmin, active
FROM admins
`;

const GET_GAMES_PLAYED_BY_TEAM_IN_EVENT = `
SELECT *
FROM public.game
JOIN public.draw ON draw.id=game.draw_id
WHERE draw.event_id=$1
AND (game.curlingteam2_id=$2 OR game.curlingteam1_id=$2)
`;

const GET_FRIENDLY_EVENTS_BY_TEAM = `
SELECT *
FROM curlingteam
JOIN eventteams ON eventteams.team_id=curlingteam.id
JOIN curlingevent ON eventteams.event_id=curlingevent.id
WHERE event_type='friendly'
AND curlingteam.id=$1;
`;

const GET_ALL_BRACKETS_FOR_EVENT = `
SELECT *
FROM bracket
WHERE event_id=$1
`;

const GET_ALL_POOLS_FOR_EVENT = `
SELECT *
FROM pool
WHERE event_id=$1
`;

const DELETE_DRAW = `
DELETE FROM draw WHERE id=$1
`;

const DELETE_TEAM = `
DELETE FROM curlingteam WHERE id=$1
`;

const DELETE_CURLER = `
DELETE FROM curler WHERE id=$1
`;

const DELETE_ORG = `
DELETE FROM organization WHERE id=$1
`;

const DELETE_POOL = `
DELETE FROM pool WHERE id=$1
`;

const DELETE_BRACKET = `
DELETE FROM bracket WHERE id=$1
`;

const DELETE_TEAM_IN_EVENT = `
DELETE FROM eventteams WHERE event_id=$1 AND team_id=$2
`;

const DELETE_GAME = `
DELETE FROM game WHERE id=$1
`;

const DELETE_END = `
DELETE FROM endscore WHERE id=$1
`;

const GET_GAME_FROM_END_ID = `
SELECT * 
FROM endscore
JOIN game ON endscore.game_id=game.id
WHERE endscore.id=$1
`;

const GET_ADMIN_DATA = `
SELECT *
FROM admins
WHERE username=$1;
`;

const GET_ORGANIZATION = `
SELECT *
FROM organization
WHERE id=$1;
`;

const GET_ALL_ORGANIZATIONS = `
SELECT *
FROM organization;
`;

const GET_CURLERS_IN_ORG = `
SELECT curler.*, curlingteam.name AS curlingteamname 
FROM curler 
JOIN curlingteam ON curlingteam.id=curler.curlingteam_id
where curler.affiliation=$1
`;

const CREATE_TEAM = `
INSERT INTO curlingteam(name, affiliation, note)
VALUES ($1, $2, $3) RETURNING id;
`;

const UPDATE_TEAM = `
  UPDATE curlingteam
	SET affiliation=$3, name=$2, note=$4
	WHERE id=$1;
`;

const CREATE_CURLER = `
INSERT INTO curler(name, position, affiliation, curlingteam_id, throwing_order)
VALUES ($1, $2, $3, $4, $5) RETURNING id;
`;

const UPDATE_CURLER = `
  UPDATE curler 
	SET name=$2, position=$3, affiliation=$4, curlingteam_id=$5, throwing_order=$6
	WHERE id=$1;
`;

const CREATE_ORGANIZATION = `
INSERT INTO organization(short_name, full_name)
VALUES ($1, $2) RETURNING id;
`;

const UPDATE_ORGANIZATION = `
  UPDATE organization 
	SET short_name=$2, full_name=$3
	WHERE id=$1;
`;

const CREATE_ADMIN = `
INSERT INTO admins(username, hash, salt, hashLength, issuperadmin)
VALUES ($1, $2, $3, $4, $5);
`;

const REGISTER_USER = `
INSERT INTO admins(username, hash, salt, hashLength, issuperadmin, active)
VALUES ($1, $2, $3, $4, $5, $6);
`;

const UPDATE_ADMIN = `
UPDATE admins
SET hash=$2, salt=$3, hashLength=$4, issuperadmin=$5, active=$6
WHERE username=$1;
`;

const UPDATE_ADMIN_NO_PASSWORD = `
UPDATE admins
SET issuperadmin=$2, active=$3
WHERE username=$1;
`;

const DELETE_ADMIN = `
DELETE
FROM admins
WHERE username=$1;
`;

const INSERT_GAME = `
INSERT INTO game(event_type, notes, game_name, bracket_id, pool_id, draw_id, curlingteam1_id, curlingteam2_id, stone_color1, stone_color2, winner_dest, loser_dest, ice_sheet, finished, winner)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING id;
`;

const INSERT_DRAW = `
INSERT INTO draw(event_id, name, start, video_url)
VALUES ($1, $2, $3, $4) RETURNING id;
`;

const INSERT_EVENT = `
INSERT INTO curlingevent(name, begin_date, end_date, completed, info, event_type)
VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;
`;

const UPDATE_EVENT = `
UPDATE curlingevent
SET name=$2, begin_date=$3, end_date=$4, completed=$5, info=$6, event_type=$7)
WHERE id=$1;
`;

const UPDATE_DRAW = `
UPDATE draw
SET name=$2, start=$3, video_url=$4
WHERE id=$1;
`;

const UPDATE_GAME = `
UPDATE game
SET notes=$2, game_name=$3, bracket_id=$4, pool_id=$5, draw_id=$6, curlingteam1_id=$7, curlingteam2_id=$8, stone_color1=$9, stone_color2=$10, loser_dest=$11, winner_dest=$12, ice_sheet=$13, finished=$14, winner=$15
WHERE id=$1;
`;

const ADD_BRACKET = `
INSERT INTO bracket(event_id, name)
VALUES ($1, $2) RETURNING id;
`;

const UPDATE_BRACKET = `
UPDATE bracket
SET name=$2, event_id=$3
WHERE id=$1;
`;

const ADD_POOL = `
INSERT INTO pool(event_id, name)
VALUES ($1, $2) RETURNING id;
`;

const UPDATE_POOL = `
UPDATE pool
SET name=$2, event_id=$3
WHERE id=$1;
`;

const ADD_END = `
INSERT INTO endscore(game_id, end_number, blank, curlingteam1_scored, score)
VALUES ($1, $2, $3, $4, $5) RETURNING id;
`;

const UPDATE_END = `
UPDATE endscore
SET blank=$2, curlingteam1_scored=$3, score=$4
WHERE id=$1;
`;

const ADD_TEAM_TO_EVENT = `
INSERT INTO eventteams(event_id, team_id)
VALUES ($1, $2);
`;

const DELETE_EVENT = `
DELETE FROM curlingevent
WHERE id=$1
`;

module.exports = {
  GET_ALL_CURLERS,
  GET_ALL_DRAWS_IN_CURLING_EVENT,
  GET_ALL_GAMES_IN_CURLING_EVENT,
  GET_ALL_GAMES_BY_TEAM,
  GET_ALL_GAMES_AND_SCORES,
  GET_ALL_GAMES_AND_SCORES_BY_TEAM,
  GET_ALL_TEAMS_IN_CURLING_EVENT,
  GET_ALL_EVENT_TEAMS_IN_EVENT,
  GET_ALL_ADMINS,
  GET_ALL_BRACKETS_FOR_EVENT,
  GET_ALL_POOLS_FOR_EVENT,
  GET_CURLING_TEAM,
  GET_GAMES_PLAYED_BY_TEAM_IN_EVENT,
  GET_GAME_FROM_END_ID,
  GET_ORGANIZATION,
  GET_FRIENDLY_EVENTS_BY_TEAM,
  GET_ALL_ORGANIZATIONS,
  GET_CURLERS_IN_ORG,
  DELETE_DRAW,
  DELETE_TEAM,
  DELETE_CURLER,
  DELETE_ORG,
  DELETE_POOL,
  DELETE_BRACKET,
  DELETE_TEAM_IN_EVENT,
  DELETE_GAME,
  DELETE_END,
  DELETE_ADMIN,
  DELETE_EVENT,
  GET_ADMIN_DATA,
  CREATE_ADMIN,
  REGISTER_USER,
  UPDATE_ADMIN_NO_PASSWORD,
  UPDATE_ADMIN,
  INSERT_GAME,
  INSERT_DRAW,
  INSERT_EVENT,
  CREATE_TEAM,
  CREATE_CURLER,
  CREATE_ORGANIZATION,
  UPDATE_TEAM,
  UPDATE_CURLER,
  UPDATE_ORGANIZATION,
  UPDATE_EVENT,
  UPDATE_DRAW,
  UPDATE_GAME,
  ADD_BRACKET,
  UPDATE_BRACKET,
  ADD_POOL,
  UPDATE_POOL,
  ADD_END,
  UPDATE_END,
  ADD_TEAM_TO_EVENT
};