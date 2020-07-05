
class Exceptions {

  deleteDrawException = (techDesc) => {
    return this.removeLineBreaks(
      `Failed to delete draw.
     Draw may contain games in bracket event connected to other games. 
     Make sure to delete draws from oldest to newest.
     Technical Description: ${techDesc}`
    );
  };

  deleteTeamException = (techDesc) => {
    return this.removeLineBreaks(
      `Failed to delete team.
     Team may be enrolled in a curling event. Team may be part of undeleted games.
     Remove team from the event and any existing games first.
     Technical Description: ${techDesc}`
    );
  };

  deleteOrgException = (techDesc) => {
    return this.removeLineBreaks(
      `Failed to delete organization.
     A curler may be part of organization. A curling team may be part of organization.
     Remove curler and/or curling team from organization first.
     Technical Description: ${techDesc}`
    );
  };

  invalidIdException = () => {
    let invalidIdError = new Error('No records deleted. Id may be invalid');
    return invalidIdError;
  }

  nullException = () => {
    let nullException = new Error('Non-nullable fields are null');
    return nullException;
  }

  removeLineBreaks = (sentence) => sentence.replace(/(\r\n|\n|\r)/gm, "");
}

module.exports = Exceptions;

