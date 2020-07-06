/*
 * @param event_id
 */
const GET_ALL_TEAMS_IN_CURLING_EVENT = `
SELECT curler.id as curler_id, curler.name as curler_name, curler.position as curler_position, curlingteam.id as curlingteam_id, curler.affiliation as curler_affiliation, curlingteam.affiliation as curlingteam_affiliation, curlingteam.name as curlingteam_name, curlingteam.note as curlingteam_note
FROM eventteams as eventTeams 
JOIN curlingteam on eventTeams.team_id=curlingteam.id
FULL JOIN curler on curler.curlingteam_id=curlingteam.id
WHERE eventTeams.event_id=$1;
`;

const GET_ALL_CURLERS = `
SELECT curler.id as curler_id, curler.name as curler_name, curler.position as curler_position, curlingteam.id as curlingteam_id, curler.affiliation as curler_affiliation, curlingteam.affiliation as curlingteam_affiliation, curlingteam.name as curlingteam_name, curlingteam.note as curlingteam_note
FROM curlingteam
FULL JOIN curler on curler.curlingteam_id=curlingteam.id;
`;

const GET_CURLING_TEAM = `
SELECT curler.id as curler_id, curler.name as curler_name, curler.position as curler_position, curlingteam.id as curlingteam_id, curler.affiliation as curler_affiliation, curlingteam.affiliation as curlingteam_affiliation, curlingteam.name as curlingteam_name, curlingteam.note as curlingteam_note
FROM curlingteam
FULL JOIN curler on curler.curlingteam_id=curlingteam.id
WHERE curlingteam.id=$1;
`;

const GET_ALL_GAMES_IN_CURLING_EVENT = `
SELECT curlingteam1.name as team_name1, curlingteam2.name as team_name2,
game.id as game_id, game.event_type, game.notes, game.bracket_id, game.pool_id, game.draw_id, game.curlingteam1_id, game.curlingteam2_id, game.stone_color1, game.stone_color2, game.winner_dest, game.loser_dest, game.ice_sheet, game.finished, game.winner
FROM game
JOIN curlingteam as curlingteam1 ON game.curlingteam1_id=curlingteam1.id
JOIN curlingteam as curlingteam2 ON game.curlingteam2_id=curlingteam2.id
JOIN draw ON game.draw_id=draw.id
WHERE draw.event_id=$1
ORDER BY game.id;`;

const GET_ALL_GAMES_BY_TEAM = `
SELECT curlingteam1.name as team_name1, curlingteam2.name as team_name2,
game.id as game_id, game.event_type, game.notes, game.bracket_id, game.pool_id, game.draw_id, game.curlingteam1_id, game.curlingteam2_id, game.stone_color1, game.stone_color2, game.winner_dest, game.loser_dest, game.ice_sheet, game.finished, game.winner 
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
game.id as game_id, game.event_type, game.notes, game.bracket_id, game.pool_id, game.draw_id, game.curlingteam1_id, game.curlingteam2_id, game.stone_color1, game.stone_color2, game.winner_dest, game.loser_dest, game.ice_sheet, game.finished, game.winner, 
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
game.id as game_id, game.event_type, game.notes, game.bracket_id, game.pool_id, game.draw_id, game.curlingteam1_id, game.curlingteam2_id, game.stone_color1, game.stone_color2, game.winner_dest, game.loser_dest, game.ice_sheet, game.finished, game.winner, 
endscore.id as endscore_id, endscore.end_number, endscore.curlingteam1_scored, endscore.score, endscore.blank
FROM game
JOIN curlingteam as curlingteam1 ON game.curlingteam1_id=curlingteam1.id
JOIN curlingteam as curlingteam2 ON game.curlingteam2_id=curlingteam2.id
JOIN draw ON game.draw_id=draw.id
LEFT OUTER JOIN endscore ON endscore.game_id=game.id
WHERE draw.event_id=$1
AND (curlingteam1_id=$2 OR curlingteam2_id=$2);
`;

const GET_GAMES_PLAYED_BY_TEAM_IN_EVENT = `
SELECT *
FROM public.game
JOIN public.draw ON draw.id=game.draw_id
WHERE draw.event_id=$1
AND (game.curlingteam2_id=$2 OR game.curlingteam1_id=$2)
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
`

const CREATE_TEAM = `
INSERT INTO curlingteam(name, affiliation, note)
VALUES ($1, $2, $3);
`;

const UPDATE_TEAM = `
  UPDATE curlingteam
	SET affiliation=$3, name=$2, note=$4
	WHERE id=$1;
`;

const CREATE_CURLER = `
INSERT INTO curler(name, position, affiliation, curlingteam_id)
VALUES ($1, $2, $3, $4);
`;

const UPDATE_CURLER = `
  UPDATE curler 
	SET name=$2, position=$3, affiliation=$4, curlingteam_id=$5
	WHERE id=$1;
`;

const CREATE_ORGANIZATION = `
INSERT INTO organization(short_name, full_name)
VALUES ($1, $2);
`;

const UPDATE_ORGANIZATION = `
  UPDATE organization 
	SET short_name=$1, full_name=$2
	WHERE id=$1;
`;

const CREATE_ADMIN = `
INSERT INTO admins(username, hash, salt, "hashLength")
VALUES ($1, $2, $3, $4);
`;

module.exports = {
  GET_ALL_CURLERS,
  GET_ALL_DRAWS_IN_CURLING_EVENT,
  GET_ALL_GAMES_IN_CURLING_EVENT,
  GET_ALL_GAMES_BY_TEAM,
  GET_ALL_GAMES_AND_SCORES,
  GET_ALL_GAMES_AND_SCORES_BY_TEAM,
  GET_ALL_TEAMS_IN_CURLING_EVENT,
  GET_CURLING_TEAM,
  GET_GAMES_PLAYED_BY_TEAM_IN_EVENT,
  GET_GAME_FROM_END_ID,
  GET_ORGANIZATION,
  DELETE_DRAW,
  DELETE_TEAM,
  DELETE_CURLER,
  DELETE_ORG,
  DELETE_POOL,
  DELETE_BRACKET,
  DELETE_TEAM_IN_EVENT,
  DELETE_GAME,
  DELETE_END,
  GET_ADMIN_DATA,
  CREATE_TEAM,
  CREATE_CURLER,
  CREATE_ORGANIZATION,
  UPDATE_TEAM,
  UPDATE_CURLER,
  UPDATE_ORGANIZATION,
  CREATE_ADMIN
};