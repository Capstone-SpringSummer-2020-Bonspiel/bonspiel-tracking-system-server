drop table if exists CurlingEvent, Organization, Pool, Bracket, CurlingTeam, Curler, Draw, Game, EndScore, EventTeams, Admins
CASCADE;
drop type if exists valid_event_types
, valid_position_types, valid_stone_colors, valid_ice_sheets, valid_throwing_order_types CASCADE;


/* 
 * CurlingEvent: an event to be tracked by the bonspiel app. 
 * there are 3 types: a pool-based event, a bracket event (typical of bonspiels), 
 * or a 'championship' which is a pool event followed by a playoff bracket. 
 */

create type valid_event_types as enum
('friendly', 'pools', 'brackets', 'championship');
create table CurlingEvent
(
  ID Serial,
  name text,
  begin_date timestamp,
  end_date timestamp,
  completed boolean DEFAULT FALSE,
  info text,
  event_type valid_event_types,
  CONSTRAINT curlingevent_pkey PRIMARY KEY (id),
  CONSTRAINT curlingevent_check CHECK (end_date >= begin_date)
);


/* Organization - a club or other organization to which a curler is affiliated */
create table Organization
(
  ID Serial,
  short_name text,
  full_name text,
  CONSTRAINT organization_pkey PRIMARY KEY (id)
);


/*
 * Pool - a group of teams that compete against each other in a 'pools' 
 * or 'championship' type of event. pools generally have a static set 
 * of games determined when the event begins.
 */
create table Pool
(
  ID Serial,
  event_id integer NOT NULL, 
  name text,
  color text,
  CONSTRAINT pool_pkey PRIMARY KEY (id),
  CONSTRAINT pool_event_id_fkey FOREIGN KEY (event_id)
    REFERENCES public.curlingevent (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE
    DEFERRABLE INITIALLY DEFERRED
);


/* 
 * Bracket - a group of teams that compete against each other in a 'brackets' 
 * or 'championship' type of event. Brackets have special rules about teams 
 * advancing to future games.
 */
create table Bracket
(
  ID Serial,
  event_id integer NOT NULL,
  name text,
  CONSTRAINT bracket_pkey PRIMARY KEY (id),
  CONSTRAINT bracket_event_id_fkey FOREIGN KEY (event_id)
    REFERENCES public.curlingevent (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE
	DEFERRABLE INITIALLY DEFERRED
);


/* 
 * CurlingTeam - a team that competes in a a curling event 
 *   note that by including a "pool" field and a "dsc" field we are 
 *   essentially implying that a team exists only for the duration of one event.
 *   iow, if the same team entered multiple events then the team would need to 
 *   be entered as separate teams, one per event. This is fine for v1.0 and 
 *   can be revisited for future versions of the bonspiel tracking system.
 */
create table CurlingTeamT
(
  ID Serial,
  affiliation integer,
  name text,
  note text,
  CONSTRAINT curlingteam_pkey PRIMARY KEY (id),
  CONSTRAINT curlingteam_affiliation_fkey FOREIGN KEY (affiliation)
	REFERENCES public.organization (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    DEFERRABLE INITIALLY DEFERRED
  /* dsc DECIMAL(6,2)  usually only 'championship' type events use this field */
  /* might also want to model photos or other media for the team */
  /* might want to also model contact info such as phone, email address */
  /* might want to also model 'coach' */
);


create table eventteams
(
  event_id integer,
  team_id integer,
  CONSTRAINT eventteams_pkey PRIMARY KEY (event_id, team_id),
  CONSTRAINT eventteams_event_id_fkey FOREIGN KEY (event_id)
    REFERENCES public.curlingevent (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE
    DEFERRABLE INITIALLY DEFERRED,
  CONSTRAINT eventteams_team_id_fkey FOREIGN KEY (team_id)
    REFERENCES public.curlingteam (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    DEFERRABLE INITIALLY DEFERRED
);


/* Curler - a competitor who plays on a CurlingTeam */
create type valid_position_types as enum
('skip', 'vice');

create type valid_throwing_order_types as enum
('third', 'second', 'lead', 'fourth', 'alternate');
create table Curler
(
  ID serial,
  name text,
  position valid_position_types,
  photo_url text,
  throwing_order valid_throwing_order_types,
  affiliation integer,
  CurlingTeam_id integer,
  CONSTRAINT curler_pkey PRIMARY KEY (id),
  CONSTRAINT curler_affiliation_fkey FOREIGN KEY (affiliation)
    REFERENCES public.organization (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    DEFERRABLE INITIALLY DEFERRED,
  CONSTRAINT curler_curlingteam_id_fkey FOREIGN KEY (curlingteam_id)
    REFERENCES public.curlingteam (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    DEFERRABLE INITIALLY DEFERRED
);


/* Draw - a collection of curling games that all start at the begin at the same time. */
create table Draw
(
  ID serial,
  event_id integer NOT NULL,
  name text,
  start timestamp,
  video_url text,
  CONSTRAINT draw_pkey PRIMARY KEY (id),
  CONSTRAINT draw_event_id_fkey FOREIGN KEY (event_id)
    REFERENCES public.curlingevent (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE
    DEFERRABLE INITIALLY DEFERRED
  /* 
     * game_draw = TRUE just means that the draw contains games. 
     * this is the default case and the most common case.
     * game_draw = FALSE can be used to indicate time slots containing 
     * meetings, banquet, lunch, maintenance periods, practices, ceremony, etc. 
     * i.e., any scheduled activity other than actual curling
     
	game_draw boolean DEFAULT TRUE, */
);


/* Game - a pair of teams competing against each other */
create type valid_stone_colors as enum
('red', 'yellow');
create type valid_ice_sheets as enum
('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', '1', '2', '3', '4', '5', '6', '7', '8');
create table Game
(
  ID Serial,
  event_type valid_event_types,
  game_name text,
  notes text,
  bracket_id integer DEFAULT NULL,
  pool_id integer DEFAULT NULL,
  draw_id integer NOT NULL,
  CurlingTeam1_id integer REFERENCES CurlingTeam(ID),
  CurlingTeam2_id integer REFERENCES CurlingTeam(ID),
  stone_color1 valid_stone_colors DEFAULT 'red',
  stone_color2 valid_stone_colors DEFAULT 'yellow',
  winner_dest integer,
  loser_dest integer,
  ice_sheet valid_ice_sheets,
  finished boolean DEFAULT FALSE,
  /*currentEnd integer,*/
  winner integer DEFAULT NULL,
  CONSTRAINT game_pkey PRIMARY KEY (id),
  CONSTRAINT game_bracket_id_fkey FOREIGN KEY (bracket_id)
    REFERENCES public.bracket (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    DEFERRABLE INITIALLY DEFERRED,
  CONSTRAINT game_curlingteam1_id_fkey FOREIGN KEY (curlingteam1_id)
    REFERENCES public.curlingteam (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    DEFERRABLE INITIALLY DEFERRED,
  CONSTRAINT game_curlingteam2_id_fkey FOREIGN KEY (curlingteam2_id)
    REFERENCES public.curlingteam (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    DEFERRABLE INITIALLY DEFERRED,
  CONSTRAINT game_draw_id_fkey FOREIGN KEY (draw_id)
    REFERENCES public.draw (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE
    DEFERRABLE INITIALLY DEFERRED,
  CONSTRAINT game_loser_dest_fkey FOREIGN KEY (loser_dest)
    REFERENCES public.game (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    DEFERRABLE INITIALLY DEFERRED,
  CONSTRAINT game_pool_id_fkey FOREIGN KEY (pool_id)
    REFERENCES public.pool (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    DEFERRABLE INITIALLY DEFERRED,
  CONSTRAINT game_winner_dest_fkey FOREIGN KEY (winner_dest)
    REFERENCES public.game (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    DEFERRABLE INITIALLY DEFERRED,
  CONSTRAINT game_check CHECK (curlingteam1_id <> curlingteam2_id)
);



/* 
 * EndScore - the result of one 'end' of a curling game. Typically games 
 * comprise 8 ends, but they can have fewer (if the score is lopsided and 
 * the losing team concedes) or more (if the game is defined to be longer 
 * or if an 8-end game is tied and goes to an extra, 9th end).
 */
create table EndScore
(
  ID Serial,
  game_id integer NOT NULL,
  end_number integer,
  blank boolean,
  CurlingTeam1_scored boolean,
  score integer,
  CONSTRAINT endscore_pkey PRIMARY KEY (id),
  CONSTRAINT endscore_game_id_fkey FOREIGN KEY (game_id)
    REFERENCES public.game (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE
    DEFERRABLE INITIALLY DEFERRED,
  CONSTRAINT endscore_end_number_check CHECK (end_number >= 1),
  CONSTRAINT endscore_end_number_check1 CHECK (end_number <= 11)
);



create table Admins
(
  username text,
  hash text,
  salt text,
  hashLength integer,
  isSuperAdmin boolean DEFAULT FALSE,
  active boolean DEFAULT TRUE,
  CONSTRAINT admins_pkey PRIMARY KEY (username)
);


CREATE VIEW vw_game_draw
AS
  (SELECT g.id AS game_id, d.event_id, g.draw_id, d.name, g.event_type, g.notes, g.bracket_id, g.pool_id,
    g.curlingteam1_id, g.curlingteam2_id, g.stone_color1, g.stone_color2,
    g.winner_dest, g.loser_dest, g.ice_sheet, g.finished, g.winner, d.id, d.start, d.video_url
  FROM game g
    JOIN draw d
    ON d.id = g.draw_id)