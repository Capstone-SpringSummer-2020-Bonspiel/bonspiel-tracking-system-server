
class Exceptions {

  deleteDrawException = (techDesc) => {
    return this.removeLineBreaks(
      `Failed to delete draw.
     Draw may contain games in bracket event connected to other games. 
     Make sure to delete draws from oldest to newest.
     Technical Description: ${techDesc}`
    );
  };

  removeLineBreaks = (sentence) => sentence.replace(/(\r\n|\n|\r)/gm, "");
}

module.exports = Exceptions;

