
class Exceptions {

  deleteDrawException = (techDesc) => {
    return this.removeLineBreaks(
      `Failed to delete draw.
     Draw may contain games in bracket event connected to other games. 
     Make sure to delete draws from oldest to newest.
     Detail: ${techDesc}`
    );
  };

  deleteTeamException = (techDesc) => {
    return this.removeLineBreaks(
      `Failed to delete team.
     Team may be enrolled in a curling event. Team may be part of undeleted games.
     Remove team from the event and any existing games first.
     Detail: ${techDesc}`
    );
  };

  deleteOrgException = (techDesc) => {
    return this.removeLineBreaks(
      `Failed to delete organization.
     A curler may be part of organization. A curling team may be part of organization.
     Remove curler and/or curling team from organization first.
     Detail: ${techDesc}`
    );
  };

  deleteBracketException = (techDesc) => {
    return this.removeLineBreaks(
      `Failed to delete bracket. 
       A game may exist that is part of bracket
       Detail: ${techDesc}`
    );
  };

  deletePoolException = (techDesc) => {
    return this.removeLineBreaks(
      `Failed to delete pool. 
       A game may exist that is part of pool
       Detail: ${techDesc}`
    );
  };

  teamHasPlayedGamesException = (techDesc) => {
    return this.removeLineBreaks(
      `Failed to remove team from event. 
       One or more games exist that team has played in curling event.
       Detail: ${techDesc}`
    );
  }

  deleteGameException = (techDesc) => {
    return this.removeLineBreaks(
      `Failed to remove game. 
       If for bracket event, a game in previous draw may have a destination to this game.
       Detail: ${techDesc}`
    );
  }

  insertionException = (message) => {
    return new Error(`Unable to insert: ${message}`);
  }

  updateException = (message) => {
    return new Error(`Unable to update: ${message}`);
  }

  gameFinishedException = () => {
    return this.removeLineBreaks(
      `Failed to delete end. 
       Game is marked as finished.`
    );
  }

  invalidIdException = () => {
    let invalidIdError = new Error('No records modified. Id(s) may be invalid');
    return invalidIdError;
  }

  nullException = (field) => {
    let nullException = new Error(`Non-nullable field [${field}] is null`);
    return nullException;
  }

  throwIfNull = (obj) => {
    for (let key in obj) {
      if (!obj[key]) {
        throw this.nullException(key);
      }
    }
  }

  removeLineBreaks = (sentence) => sentence.replace(/(\r\n|\n|\r|\t)/gm, "").replace(/ +(?= )/g, '');
}

module.exports = Exceptions;

